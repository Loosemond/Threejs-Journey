import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { PlaneGeometry } from 'three'
import * as lil from "lil-gui"


/**
 * Debug
 */

const gui = new lil.GUI({ width: 300 })

/**
 * Textures
 */
const loadingManager = new THREE.LoadingManager()
const textureLoader = new THREE.TextureLoader(loadingManager)
const cubeTextureLoader = new THREE.CubeTextureLoader()

const doorcolorTexture = textureLoader.load("/textures/door/color.jpg")
const alphaTexture = textureLoader.load('/textures/door/alpha.jpg')
const heightTexture = textureLoader.load('/textures/door/height.jpg')
const normalTexture = textureLoader.load('/textures/door/normal.jpg')
const ambientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
const metalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
const roughnessTexture = textureLoader.load('/textures/door/roughness.jpg')
const matcapTexture = textureLoader.load('/textures/matcaps/7.png')
const gradientTexture = textureLoader.load('/textures/gradients/3.jpg')

const environmentMapTexture = cubeTextureLoader.load([
    "/textures/environmentMaps/2/px.jpg",
    "/textures/environmentMaps/2/nx.jpg",
    "/textures/environmentMaps/2/py.jpg",
    "/textures/environmentMaps/2/ny.jpg",
    "/textures/environmentMaps/2/pz.jpg",
    "/textures/environmentMaps/2/nz.jpg",

])
/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
/**
 * Objects
 */
// const material = new THREE.MeshBasicMaterial()
// material.map = doorcolorTexture
// material.color.set("red")
// material.color = new THREE.Color("yellow")
// material.opacity = 0.5
// material.transparent = true
// material.alphaMap = alphaTexture
// material.side = THREE.DoubleSide // more expensive 

// const material = new THREE.MeshNormalMaterial()
// // material.wireframe = true
// material.flatShading = true
// material.side = THREE.DoubleSide // more expensive 


// const material = new THREE.MeshMatcapMaterial()
// material.matcap = matcapTexture // we can simulate light
// material.flatShading = true

// const material = new THREE.MeshDepthMaterial()

// const material = new THREE.MeshLambertMaterial() // reacts to light and is very fast
// material.side = THREE.DoubleSide // more expensive 


// const material = new THREE.MeshPhongMaterial() // reacts to light less performant
// material.side = THREE.DoubleSide // more expensive 
// material.shininess = 1000 // specular
// material.specular = new THREE.Color(0xff0000)

// const material = new THREE.MeshToonMaterial() // reacts to light Cartoon efect
// material.side = THREE.DoubleSide // more expensive 
// gradientTexture.minFilter = THREE.NearestFilter
// gradientTexture.magFilter = THREE.NearestFilter
// gradientTexture.mipmaps = false

// const material = new THREE.MeshStandardMaterial() // reacts to light more features physically based
// // gui.add(material, "metalness", 0, 1)
// // gui.add(material, "roughness", 0, 1)
// material.roughnessMap = roughnessTexture
// material.metalnessMap = matcapTexture
// gui.add(material, "flatShading")
// material.aoMap = ambientOcclusionTexture
// gui.add(material, "aoMapIntensity", 0, 2)
// material.map = doorcolorTexture
// material.side = THREE.DoubleSide // more expensive 
// material.displacementMap = heightTexture
// gui.add(material, "displacementScale", 0, 0.2)
// material.normalMap = normalTexture
// material.normalScale.set(0.5, 0.5)
// material.alphaMap = alphaTexture
// material.transparent = true

const material = new THREE.MeshStandardMaterial()
material.metalness = 0.7
material.roughness = 0.2
gui.add(material, 'metalness').min(0).max(1).step(0.0001)
gui.add(material, 'roughness').min(0).max(1).step(0.0001)
material.envMap = environmentMapTexture

material.gradientMap = gradientTexture


const sphere = new THREE.Mesh(new THREE.SphereBufferGeometry(0.5, 64, 64), material)
sphere.position.x -= 1.5
sphere.geometry.setAttribute('uv2', new THREE.BufferAttribute(sphere.geometry.attributes.uv.array, 2))


const plane = new THREE.Mesh(new THREE.PlaneBufferGeometry(1, 1, 64, 64), material)
plane.geometry.setAttribute('uv2', new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2))

const torus = new THREE.Mesh(new THREE.TorusBufferGeometry(0.3, 0.2, 64, 64), material)
torus.position.x += 1.5
torus.geometry.setAttribute('uv2', new THREE.BufferAttribute(torus.geometry.attributes.uv.array, 2))
scene.add(sphere, plane, torus)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

const pointLight = new THREE.PointLight(0xffffff, 0.5)
scene.add(pointLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    // update objects
    sphere.rotation.y = elapsedTime * 0.15
    plane.rotation.y = elapsedTime * 0.15
    torus.rotation.y = elapsedTime * 0.15
    plane.rotation.x = elapsedTime * 0.2
    sphere.rotation.x = elapsedTime * 0.2
    torus.rotation.x = elapsedTime * 0.2

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()