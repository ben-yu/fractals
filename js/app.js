(function(){"use strict";var e="undefined"!=typeof window?window:global;if("function"!=typeof e.require){var t={},r={},i=function(e,t){return{}.hasOwnProperty.call(e,t)},n=function(e,t){var r,i,n=[];r=/^\.\.?(\/|$)/.test(t)?[e,t].join("/").split("/"):t.split("/");for(var o=0,a=r.length;a>o;o++)i=r[o],".."===i?n.pop():"."!==i&&""!==i&&n.push(i);return n.join("/")},o=function(e){return e.split("/").slice(0,-1).join("/")},a=function(t){return function(r){var i=o(t),a=n(i,r);return e.require(a)}},s=function(e,t){var i={id:e,exports:{}};t(i.exports,a(e),i);var n=r[e]=i.exports;return n},l=function(e){var o=n(e,".");if(i(r,o))return r[o];if(i(t,o))return s(o,t[o]);var a=n(o,"./index");if(i(r,a))return r[a];if(i(t,a))return s(a,t[a]);throw Error('Cannot find module "'+e+'"')},c=function(e,r){if("object"==typeof e)for(var n in e)i(e,n)&&(t[n]=e[n]);else t[e]=r};e.require=l,e.require.define=c,e.require.register=c,e.require.brunch=!0}})(),window.require.register("scripts/fractal",function(e,t){var r,i,n,o,a,s,l,c;r=function(e,t,r){var i,n,o;return i=document.createElement("canvas"),i.width=256,i.height=1,n=i.getContext("2d"),o=n.createLinearGradient(0,0,i.width,i.height),o.addColorStop(0,e),o.addColorStop(.2,t),o.addColorStop(.4,r),o.addColorStop(.7,t),o.addColorStop(1,r),n.fillStyle=o,n.fillRect(0,0,i.width,i.height),i},i=function(e,t,r){var i;return i=t+r*e.width,e.data[i]},l=function(e,t,r,i,n,o,a){var s;return s=4*(t+r*e.width),e.data[s+0]=i,e.data[s+1]=n,e.data[s+2]=o,e.data[s+3]=a},o=function(e,t,r){return 0>r&&(r+=1),r>1&&(r-=1),1/6>r?e+6*(t-e)*r:.5>r?t:2/3>r?e+6*(t-e)*(2/3-r):e},n=function(e,t,r){var i,n,a,s,l;return 0===t?l=n=i=r:(s=.5>r?r*(1+t):r+t-r*t,a=2*r-s,l=o(a,s,e+1/3),n=o(a,s,e),i=o(a,s,e-1/3)),[255*l,255*n,255*i]},a=function(e,t,r){var i,n,o,a;for(n=e,a=t,e=0,t=0,i=0;4>e*e+t*t&&r>i;)o=e*e-t*t+n,t=2*e*t+a,e=o,i+=1;return{iter:i,x:e,y:t}},s=function(){var e,t,r,i,o,s,c,u,h,d,f,p,m,E;for(i=document.getElementById("fractal"),o=i.getContext("2d"),t=window.innerWidth,e=window.innerHeight,i.width=t,i.height=e,d=o.createImageData(t,e),u="mandlebrot",h=m=0;t>=0?t>=m:m>=t;h=t>=0?++m:--m)for(f=E=0;e>=0?e>=E:E>=e;f=e>=0?++E:--E)switch(u){case"buddhabrot":buddhabrot(h,f,d,100);break;case"mandlebrot":c=a(h*(3.5/t)-2.5,f*(2/e)-1,1e3),r=c.x*c.x+c.y*c.y,p=c.iter+1-Math.log(Math.log(r))/Math.log(2),s=n(p/255,.8,.5),l(d,h,f,s[0],s[1],s[2],255)}return o.putImageData(d,0,0)},c=function(){var e,i,n,o,a,s,l,c,u,h,d,f,p,m,E,g,v,y,T,x,R,b,_,w;return u={},u.type="mandel",u.startColour="#34495e",u.midColour="#2ecc71",u.endColour="#3498db",h=["mandel","julia"],v=function(){return y.render(x,i)},e=function(){return requestAnimationFrame(e),v()},g=function(){var e;return e=new THREE.OrthographicCamera(-5,5,5,-5,1,1e3),e.position.set(0,0,1),e.lookAt(new THREE.Vector3(0,0,0)),y.setSize(window.innerWidth,window.innerHeight),v()},a=document.getElementById("shaderFractal"),x=new THREE.Scene,i=new THREE.OrthographicCamera(-5,5,5,-5,1,1e3),i.position.set(0,0,1),x.add(i),y=new THREE.WebGLRenderer,y.setSize(window.innerWidth,window.innerHeight),a.appendChild(y.domElement),T=2,o=new THREE.Texture(r(u.startColour,u.midColour,u.endColour)),_={coordinateTransform:{type:"v2",value:new THREE.Vector2(window.innerWidth,window.innerHeight)},uTex:{type:"t",value:o},center:{type:"v2",value:new THREE.Vector2(.5,0)},scale:{type:"f",value:2}},o.needsUpdate=!0,w=t("scripts/mandel_vert"),d=t("scripts/mandel_frag"),p=new THREE.ShaderMaterial({uniforms:_,vertexShader:w,fragmentShader:d}),m=new THREE.Mesh(new THREE.PlaneGeometry(10,10),p),x.add(m),f=new dat.GUI,b=f.add(u,"type",h),n=f.addFolder("Color Scheme"),R=n.addColor(u,"startColour"),E=n.addColor(u,"midColour"),c=n.addColor(u,"endColour"),n.open(),R.onChange(function(){var e;return e=r(u.startColour,u.midColour,u.endColour),m.material.uniforms.uTex.value=new THREE.Texture(e),m.material.uniforms.uTex.value.needsUpdate=!0,e.needsUpdate=!0}),E.onChange(function(){var e;return e=r(u.startColour,u.midColour,u.endColour),m.material.uniforms.uTex.value=new THREE.Texture(e),m.material.uniforms.uTex.value.needsUpdate=!0,e.needsUpdate=!0}),c.onChange(function(){var e;return e=r(u.startColour,u.midColour,u.endColour),m.material.uniforms.uTex.value=new THREE.Texture(e),m.material.uniforms.uTex.value.needsUpdate=!0,e.needsUpdate=!0}),b.onFinishChange(function(e){return"mandel"===e?m.material.fragmentShader=t("scripts/mandel_frag"):"julia"===e&&(m.material.fragmentShader=t("scripts/julia_frag")),m.material.needsUpdate=!0}),window.addEventListener("resize",g,!0),$("#shaderFractal").on("mousewheel",function(e){var t,r,i,n;return e.preventDefault(),i=e.originalEvent,r=1,t=i.wheelDeltaY,n=1.125,t>0&&(n=1/n),p.uniforms.scale.value*=n,T*=n,v()}),s=-1,l=-1,$("#shaderFractal").mousedown(function(e){s=e.offsetX,l=e.offsetY}).mousemove(function(e){var t,r;s>0&&l>0&&(t=s-e.offsetX,r=e.offsetY-l,p.uniforms.center.value.x-=t/window.innerWidth*T,p.uniforms.center.value.y-=r/window.innerHeight*T,v(),s=e.offsetX,l=e.offsetY)}).mouseup(function(){s=-1,l=-1}),e()},c()}),window.require.register("scripts/julia_frag",function(e,t,r){r.exports=["uniform sampler2D uTex;","uniform vec2 center;","uniform float scale;","uniform vec2 coordinateTransform;","","void main()","{","    const int iter = 256;","    vec2 z;","","    z.x = 3.0 * (gl_FragCoord.x / coordinateTransform.x - 0.5);","    z.y = 2.0 * (gl_FragCoord.y / coordinateTransform.y - 0.5);","","    int index = 0;","    for(int i=0; i<iter; i++) {","        float x = (z.x * z.x - z.y * z.y) + center.x;","        float y = (z.y * z.x + z.x * z.y) + center.y;","","        if((x * x + y * y) >= 4.0) break;","        z.x = x;","        z.y = y;","        index = index + 1;","    }","    gl_FragColor = texture2D(uTex, vec2((index == iter ? 0.0 : float(index)) / 100.0,0.0));","}"].join("\n")}),window.require.register("scripts/mandel_frag",function(e,t,r){r.exports=["uniform sampler2D uTex;","uniform vec2 center;","uniform float scale;","uniform vec2 coordinateTransform;","","void main()","{","	const int iter = 256;","    vec2 z, c;","","    c.x = 1.3333 * (gl_FragCoord.x / coordinateTransform.x - 0.5) * scale - center.x;","    c.y = (gl_FragCoord.y / coordinateTransform.y - 0.5) * scale - center.y;","","    z = c;","    int index = 0;","    for(int i=0; i<iter; i++) {","        float x = (z.x * z.x - z.y * z.y) + c.x;","        float y = (z.y * z.x + z.x * z.y) + c.y;","","        if((x * x + y * y) >= 4.0) break;","        z.x = x;","        z.y = y;","        index = index + 1;","    }","    gl_FragColor = texture2D(uTex, vec2((index == iter ? 0.0 : float(index)) / 100.0,0.0));","}"].join("\n")}),window.require.register("scripts/mandel_vert",function(e,t,r){r.exports=["void main()","{","	gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);","}",""].join("\n")});