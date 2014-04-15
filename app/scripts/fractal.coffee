createColorTex = (start,mid,end) ->
  canvas  = document.createElement( 'canvas' )
  canvas.width = 256
  canvas.height = 1
  context = canvas.getContext('2d')

  #Gradient
  gradient = context.createLinearGradient(0,0,canvas.width,canvas.height)
  gradient.addColorStop(0,start)
  gradient.addColorStop(0.2,mid)
  gradient.addColorStop(0.4,end)
  gradient.addColorStop(0.7,mid)
  gradient.addColorStop(1,end)
  context.fillStyle = gradient
  context.fillRect(0,0,canvas.width,canvas.height)

  return canvas

getPixel = (imageData, x, y) ->
  index = (x + y * imageData.width)
  return imageData.data[index]

setPixel = (imageData, x, y, r, g, b, a) ->
  index = (x + y * imageData.width) * 4
  imageData.data[index+0] = r
  imageData.data[index+1] = g
  imageData.data[index+2] = b
  imageData.data[index+3] = a

hueToRgb = (p, q, t) ->
  if(t < 0)
    t += 1
  if(t > 1)
    t -= 1
  if(t < 1/6)
    return p + (q - p) * 6 * t
  if(t < 1/2)
    return q
  if(t < 2/3)
    return p + (q - p) * (2/3 - t) * 6
  return p

hslToRgb = (h, s, l) ->
  if s is 0
    r = g = b = l
  else
    q = if l < 0.5 then l * (1 + s) else l + s - l * s
    p = 2 * l - q
    r = hueToRgb(p, q, h + 1/3)
    g = hueToRgb(p, q, h)
    b = hueToRgb(p, q, h - 1/3)

  return [r * 255, g * 255, b * 255]

mandlebrot = (x,y,max_iter) ->
  x0 = x
  y0 = y
  x = 0.0
  y = 0.0
  iter = 0
  
  while ((x*x + y*y) < 4 and iter < max_iter)
    xtemp = x*x - y*y + x0
    y = 2*x*y + y0
    x = xtemp

    iter += 1
  return {iter:iter,x:x,y:y}

naiveFractal = () ->
  canvas = document.getElementById('fractal')

  context = canvas.getContext("2d")

  WIDTH = window.innerWidth
  HEIGHT = window.innerHeight

  canvas.width = WIDTH
  canvas.height = HEIGHT

  imageData = context.createImageData(WIDTH, HEIGHT)

  fractalType = "mandlebrot"

  for i in [0..WIDTH]
    for j in [0..HEIGHT]
      switch fractalType
        when "buddhabrot"
          buddhabrot(i,j,imageData,100)
        when "mandlebrot"
          data = mandlebrot((i*(3.5/WIDTH))-2.5,(j*(2/HEIGHT))-1.0,1000)
          absVal = data.x*data.x + data.y*data.y
          nsmooth = data.iter + 1 - Math.log(Math.log(absVal))/Math.log(2)
          d = hslToRgb(nsmooth/255,0.8,0.5)
          setPixel(imageData,i,j,d[0],d[1],d[2],255)
  context.putImageData(imageData, 0, 0)

shaderFractal = () ->

  fractal = {}
  fractal.type = 'mandel'
  fractal.startColour = '#34495e'
  fractal.midColour = '#2ecc71'
  fractal.endColour = '#3498db'
  fractalTypes = ['mandel','julia']

  render = () ->
    renderer.render( scene, camera )
  animate  = () ->
    requestAnimationFrame(animate)
    render()
  onWindowResize = () ->
    camera = new THREE.OrthographicCamera(-5.0,5.0,5.0,-5.0,1,1000)
    camera.position.set(0,0,1)
    camera.lookAt(new THREE.Vector3(0,0,0))

    renderer.setSize( window.innerWidth, window.innerHeight )
    render()

  container = document.getElementById('shaderFractal')

  scene = new THREE.Scene()
  camera = new THREE.OrthographicCamera(-5.0,5.0,5.0,-5.0,1,1000)
  camera.position.set(0,0,1)
  scene.add(camera)
  
  renderer = new THREE.WebGLRenderer()
  renderer.setSize(window.innerWidth, window.innerHeight)
  
  container.appendChild(renderer.domElement)

  scale = 2.0

  colorTex = new THREE.Texture(createColorTex(fractal.startColour,fractal.midColour,fractal.endColour))

  uniforms = {
    coordinateTransform: {
      type: "v2",
      value: new THREE.Vector2(window.innerWidth, window.innerHeight)
    }
    uTex:
      type: "t"
      value: colorTex
    center: { type: "v2", value: new THREE.Vector2(0.5,0) },
    scale: { type: "f", value: 2.0},
  }

  colorTex.needsUpdate = true

  vert = require 'scripts/mandel_vert'
  frag = require 'scripts/mandel_frag'

  material = new THREE.ShaderMaterial
    uniforms: uniforms,
    vertexShader: vert,
    fragmentShader: frag
    
  mesh = new THREE.Mesh( new THREE.PlaneGeometry(10, 10), material)
  scene.add(mesh)

  gui = new dat.GUI
  typeController = gui.add fractal, 'type', fractalTypes
  colorFolder = gui.addFolder 'Color Scheme'
  startColor = colorFolder.addColor fractal, 'startColour'
  midColor = colorFolder.addColor fractal, 'midColour'
  endColor = colorFolder.addColor fractal, 'endColour'
  colorFolder.open()

  startColor.onChange (value) ->
    tex = createColorTex(fractal.startColour,fractal.midColour,fractal.endColour)
    mesh.material.uniforms.uTex.value = new THREE.Texture(tex)
    mesh.material.uniforms.uTex.value.needsUpdate = true
    tex.needsUpdate = true

  midColor.onChange (value) ->
    tex = createColorTex(fractal.startColour,fractal.midColour,fractal.endColour)
    mesh.material.uniforms.uTex.value = new THREE.Texture(tex)
    mesh.material.uniforms.uTex.value.needsUpdate = true
    tex.needsUpdate = true

  endColor.onChange (value) ->
    tex = createColorTex(fractal.startColour,fractal.midColour,fractal.endColour)
    mesh.material.uniforms.uTex.value = new THREE.Texture(tex)
    mesh.material.uniforms.uTex.value.needsUpdate = true
    tex.needsUpdate = true


  typeController.onFinishChange (value) ->
    if value is 'mandel'
      mesh.material.fragmentShader = require 'scripts/mandel_frag'
    else if value is 'julia'
      mesh.material.fragmentShader = require 'scripts/julia_frag'
    mesh.material.needsUpdate = true


  window.addEventListener( 'resize', onWindowResize, true )

  $('#shaderFractal').on 'mousewheel', (ev) ->
    ev.preventDefault()
    orig = ev.originalEvent
    detail = 1
    delta = orig.wheelDeltaY
    s = 1.125
    if delta > 0
      s = 1.0 / s
    material.uniforms.scale.value *= s
    scale *= s
    render()
  curX = -1
  curY = -1
  $('#shaderFractal')
  .mousedown (ev) ->
    curX = ev.offsetX
    curY = ev.offsetY
    return
  .mousemove (ev) ->
    if curX > 0 and curY > 0
      dx = curX - ev.offsetX
      dy = ev.offsetY - curY

      material.uniforms.center.value.x -= (dx / window.innerWidth) * scale
      material.uniforms.center.value.y -= (dy / window.innerHeight) * scale

      render()

      curX = ev.offsetX
      curY = ev.offsetY
      return
  .mouseup (ev) ->
    curX = -1
    curY = -1
    return



  animate()


shaderFractal()