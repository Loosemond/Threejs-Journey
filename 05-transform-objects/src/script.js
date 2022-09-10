import './style.css'
import * as THREE from 'three'
import { WireframeGeometry } from 'three'

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Objects
 */
const group = new THREE.Group()

const mesh_1 = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({ color: "#F06060", wireframe: true, }))
const mesh_2 = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({ color: "#F3B562", wireframe: true, transparent: true, opacity: 1 }))
const mesh_3 = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({ color: "#8CBEB2", wireframe: true }))


mesh_1.position.set(3, 0, 0)
mesh_2.position.set(0, -3, 0)

// mesh_1.scale.set(0.5, 1, 1)
// mesh_2.scale.set(0.5, 1, 1)
// mesh_3.scale.set(0.5, 1, 1)
group.add(mesh_1)
group.add(mesh_2)
group.add(mesh_3)




// X,Y,Z
group.position.set(1, 2.5, 0)

// Limits the distange to origin to one
group.position.normalize()

scene.add(group)
console.log()

// Axes helper Shows the axis on origin
// Red X , Green Y, Blue Z
const axesHelper = new THREE.AxesHelper(2)
scene.add(axesHelper)

// Scale
// Also scales the space between the cubes
group.scale.set(1, 0.5, 1.2)

// Rotation
group.rotation.y = Math.PI / 4
group.rotation.z = Math.PI / 4
group.rotation.reorder("XYZ")




/**
 * Sizes
 */
const sizes = {
    width: 800,
    height: 600
}

/**
 * Camera
 */

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3
camera.position.x = .2

scene.add(camera)
// it will orent the object to look at another object or a vector
camera.lookAt(group.position)


// Distance to camera
console.log(group.position.distanceTo(camera.position))


/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)
