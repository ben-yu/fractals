(function(/*! Brunch !*/) {
  'use strict';

  var globals = typeof window !== 'undefined' ? window : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};

  var has = function(object, name) {
    return ({}).hasOwnProperty.call(object, name);
  };

  var expand = function(root, name) {
    var results = [], parts, part;
    if (/^\.\.?(\/|$)/.test(name)) {
      parts = [root, name].join('/').split('/');
    } else {
      parts = name.split('/');
    }
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function(name) {
      var dir = dirname(path);
      var absolute = expand(dir, name);
      return globals.require(absolute);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    definition(module.exports, localRequire(name), module);
    var exports = cache[name] = module.exports;
    return exports;
  };

  var require = function(name) {
    var path = expand(name, '.');

    if (has(cache, path)) return cache[path];
    if (has(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has(cache, dirIndex)) return cache[dirIndex];
    if (has(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '"');
  };

  var define = function(bundle, fn) {
    if (typeof bundle === 'object') {
      for (var key in bundle) {
        if (has(bundle, key)) {
          modules[key] = bundle[key];
        }
      }
    } else {
      modules[bundle] = fn;
    }
  };

  globals.require = require;
  globals.require.define = define;
  globals.require.register = define;
  globals.require.brunch = true;
})();

window.require.register("scripts/fractal", function(exports, require, module) {
  var createColorTex, getPixel, hslToRgb, hueToRgb, mandlebrot, naiveFractal, setPixel, shaderFractal;

  createColorTex = function(start, mid, end) {
    var canvas, context, gradient;
    canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 1;
    context = canvas.getContext('2d');
    gradient = context.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, start);
    gradient.addColorStop(0.2, mid);
    gradient.addColorStop(0.4, end);
    gradient.addColorStop(0.7, mid);
    gradient.addColorStop(1, end);
    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);
    return canvas;
  };

  getPixel = function(imageData, x, y) {
    var index;
    index = x + y * imageData.width;
    return imageData.data[index];
  };

  setPixel = function(imageData, x, y, r, g, b, a) {
    var index;
    index = (x + y * imageData.width) * 4;
    imageData.data[index + 0] = r;
    imageData.data[index + 1] = g;
    imageData.data[index + 2] = b;
    return imageData.data[index + 3] = a;
  };

  hueToRgb = function(p, q, t) {
    if (t < 0) {
      t += 1;
    }
    if (t > 1) {
      t -= 1;
    }
    if (t < 1 / 6) {
      return p + (q - p) * 6 * t;
    }
    if (t < 1 / 2) {
      return q;
    }
    if (t < 2 / 3) {
      return p + (q - p) * (2 / 3 - t) * 6;
    }
    return p;
  };

  hslToRgb = function(h, s, l) {
    var b, g, p, q, r;
    if (s === 0) {
      r = g = b = l;
    } else {
      q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      p = 2 * l - q;
      r = hueToRgb(p, q, h + 1 / 3);
      g = hueToRgb(p, q, h);
      b = hueToRgb(p, q, h - 1 / 3);
    }
    return [r * 255, g * 255, b * 255];
  };

  mandlebrot = function(x, y, max_iter) {
    var iter, x0, xtemp, y0;
    x0 = x;
    y0 = y;
    x = 0.0;
    y = 0.0;
    iter = 0;
    while ((x * x + y * y) < 4 && iter < max_iter) {
      xtemp = x * x - y * y + x0;
      y = 2 * x * y + y0;
      x = xtemp;
      iter += 1;
    }
    return {
      iter: iter,
      x: x,
      y: y
    };
  };

  naiveFractal = function() {
    var HEIGHT, WIDTH, absVal, canvas, context, d, data, fractalType, i, imageData, j, nsmooth, _i, _j;
    canvas = document.getElementById('fractal');
    context = canvas.getContext("2d");
    WIDTH = window.innerWidth;
    HEIGHT = window.innerHeight;
    canvas.width = WIDTH;
    canvas.height = HEIGHT;
    imageData = context.createImageData(WIDTH, HEIGHT);
    fractalType = "mandlebrot";
    for (i = _i = 0; 0 <= WIDTH ? _i <= WIDTH : _i >= WIDTH; i = 0 <= WIDTH ? ++_i : --_i) {
      for (j = _j = 0; 0 <= HEIGHT ? _j <= HEIGHT : _j >= HEIGHT; j = 0 <= HEIGHT ? ++_j : --_j) {
        switch (fractalType) {
          case "buddhabrot":
            buddhabrot(i, j, imageData, 100);
            break;
          case "mandlebrot":
            data = mandlebrot((i * (3.5 / WIDTH)) - 2.5, (j * (2 / HEIGHT)) - 1.0, 1000);
            absVal = data.x * data.x + data.y * data.y;
            nsmooth = data.iter + 1 - Math.log(Math.log(absVal)) / Math.log(2);
            d = hslToRgb(nsmooth / 255, 0.8, 0.5);
            setPixel(imageData, i, j, d[0], d[1], d[2], 255);
        }
      }
    }
    return context.putImageData(imageData, 0, 0);
  };

  shaderFractal = function() {
    var animate, camera, colorFolder, colorTex, container, curX, curY, endColor, fractal, fractalTypes, frag, gui, material, mesh, midColor, onWindowResize, render, renderer, scale, scene, startColor, typeController, uniforms, vert;
    fractal = {};
    fractal.type = 'mandel';
    fractal.startColour = '#34495e';
    fractal.midColour = '#2ecc71';
    fractal.endColour = '#3498db';
    fractalTypes = ['mandel', 'julia'];
    render = function() {
      return renderer.render(scene, camera);
    };
    animate = function() {
      requestAnimationFrame(animate);
      return render();
    };
    onWindowResize = function() {
      var camera;
      camera = new THREE.OrthographicCamera(-5.0, 5.0, 5.0, -5.0, 1, 1000);
      camera.position.set(0, 0, 1);
      camera.lookAt(new THREE.Vector3(0, 0, 0));
      renderer.setSize(window.innerWidth, window.innerHeight);
      return render();
    };
    container = document.getElementById('shaderFractal');
    scene = new THREE.Scene();
    camera = new THREE.OrthographicCamera(-5.0, 5.0, 5.0, -5.0, 1, 1000);
    camera.position.set(0, 0, 1);
    scene.add(camera);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);
    scale = 2.0;
    colorTex = new THREE.Texture(createColorTex(fractal.startColour, fractal.midColour, fractal.endColour));
    uniforms = {
      coordinateTransform: {
        type: "v2",
        value: new THREE.Vector2(window.innerWidth, window.innerHeight)
      },
      uTex: {
        type: "t",
        value: colorTex
      },
      center: {
        type: "v2",
        value: new THREE.Vector2(0.5, 0)
      },
      scale: {
        type: "f",
        value: 2.0
      }
    };
    colorTex.needsUpdate = true;
    vert = require('scripts/mandel_vert');
    frag = require('scripts/mandel_frag');
    material = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: vert,
      fragmentShader: frag
    });
    mesh = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), material);
    scene.add(mesh);
    gui = new dat.GUI;
    typeController = gui.add(fractal, 'type', fractalTypes);
    colorFolder = gui.addFolder('Color Scheme');
    startColor = colorFolder.addColor(fractal, 'startColour');
    midColor = colorFolder.addColor(fractal, 'midColour');
    endColor = colorFolder.addColor(fractal, 'endColour');
    colorFolder.open();
    startColor.onChange(function(value) {
      var tex;
      tex = createColorTex(fractal.startColour, fractal.midColour, fractal.endColour);
      mesh.material.uniforms.uTex.value = new THREE.Texture(tex);
      mesh.material.uniforms.uTex.value.needsUpdate = true;
      return tex.needsUpdate = true;
    });
    midColor.onChange(function(value) {
      var tex;
      tex = createColorTex(fractal.startColour, fractal.midColour, fractal.endColour);
      mesh.material.uniforms.uTex.value = new THREE.Texture(tex);
      mesh.material.uniforms.uTex.value.needsUpdate = true;
      return tex.needsUpdate = true;
    });
    endColor.onChange(function(value) {
      var tex;
      tex = createColorTex(fractal.startColour, fractal.midColour, fractal.endColour);
      mesh.material.uniforms.uTex.value = new THREE.Texture(tex);
      mesh.material.uniforms.uTex.value.needsUpdate = true;
      return tex.needsUpdate = true;
    });
    typeController.onFinishChange(function(value) {
      if (value === 'mandel') {
        mesh.material.fragmentShader = require('scripts/mandel_frag');
      } else if (value === 'julia') {
        mesh.material.fragmentShader = require('scripts/julia_frag');
      }
      return mesh.material.needsUpdate = true;
    });
    window.addEventListener('resize', onWindowResize, true);
    $('#shaderFractal').on('mousewheel', function(ev) {
      var delta, detail, orig, s;
      ev.preventDefault();
      orig = ev.originalEvent;
      detail = 1;
      delta = orig.wheelDeltaY;
      s = 1.125;
      if (delta > 0) {
        s = 1.0 / s;
      }
      material.uniforms.scale.value *= s;
      scale *= s;
      return render();
    });
    curX = -1;
    curY = -1;
    $('#shaderFractal').mousedown(function(ev) {
      curX = ev.offsetX;
      curY = ev.offsetY;
    }).mousemove(function(ev) {
      var dx, dy;
      if (curX > 0 && curY > 0) {
        dx = curX - ev.offsetX;
        dy = ev.offsetY - curY;
        material.uniforms.center.value.x -= (dx / window.innerWidth) * scale;
        material.uniforms.center.value.y -= (dy / window.innerHeight) * scale;
        render();
        curX = ev.offsetX;
        curY = ev.offsetY;
      }
    }).mouseup(function(ev) {
      curX = -1;
      curY = -1;
    });
    return animate();
  };

  shaderFractal();
  
});
window.require.register("scripts/julia_frag", function(exports, require, module) {
  module.exports = ["uniform sampler2D uTex;","uniform vec2 center;","uniform float scale;","uniform vec2 coordinateTransform;","","void main()","{","    const int iter = 256;","    vec2 z;","","    z.x = 3.0 * (gl_FragCoord.x / coordinateTransform.x - 0.5);","    z.y = 2.0 * (gl_FragCoord.y / coordinateTransform.y - 0.5);","","    int index = 0;","    for(int i=0; i<iter; i++) {","        float x = (z.x * z.x - z.y * z.y) + center.x;","        float y = (z.y * z.x + z.x * z.y) + center.y;","","        if((x * x + y * y) >= 4.0) break;","        z.x = x;","        z.y = y;","        index = index + 1;","    }","    gl_FragColor = texture2D(uTex, vec2((index == iter ? 0.0 : float(index)) / 100.0,0.0));","}"].join("\n")
});
window.require.register("scripts/mandel_frag", function(exports, require, module) {
  module.exports = ["uniform sampler2D uTex;","uniform vec2 center;","uniform float scale;","uniform vec2 coordinateTransform;","","void main()","{","	const int iter = 256;","    vec2 z, c;","","    c.x = 1.3333 * (gl_FragCoord.x / coordinateTransform.x - 0.5) * scale - center.x;","    c.y = (gl_FragCoord.y / coordinateTransform.y - 0.5) * scale - center.y;","","    z = c;","    int index = 0;","    for(int i=0; i<iter; i++) {","        float x = (z.x * z.x - z.y * z.y) + c.x;","        float y = (z.y * z.x + z.x * z.y) + c.y;","","        if((x * x + y * y) >= 4.0) break;","        z.x = x;","        z.y = y;","        index = index + 1;","    }","    gl_FragColor = texture2D(uTex, vec2((index == iter ? 0.0 : float(index)) / 100.0,0.0));","}"].join("\n")
});
window.require.register("scripts/mandel_vert", function(exports, require, module) {
  module.exports = ["void main()","{","	gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);","}",""].join("\n")
});
