import './style.css'
import * as THREE from 'three'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"


/**
 * Cursor
 */
const cursor = {
    x: 0,
    y: 0
}

window.addEventListener("mousemove", (mouseEvent) => {
    cursor.x = mouseEvent.clientX / sizes.width - 0.5
    cursor.y = (mouseEvent.clientY / sizes.height) - 0.5
})

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Sizes
const sizes = {
    width: 800,
    height: 600
}

// Scene
const scene = new THREE.Scene()

// Object
const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1, 5, 5, 5),
    new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true })
)
scene.add(mesh)

// Camera
// Array cameras allow to create split screen camera effect

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)


camera.position.z = 3
camera.lookAt(mesh.position)
scene.add(camera)

//Controls

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
// controls.target.y = 1

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)

// Animate
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    // Update objects
    // mesh.rotation.y = elapsedTime;

    // Update Camera
    // Rotate camera around the cube
    // camera.position.x = Math.cos(cursor.x * Math.PI * 2) * 3
    // camera.position.z = Math.sin(cursor.x * Math.PI * 2) * 3

    // camera.position.y = Math.sin(cursor.y * Math.PI * 2) * 3
    // camera.position.z = Math.cos(cursor.y * Math.PI * 1) * 3
    // camera.position.z += camera.position.z - (Math.cos(cursor.y * Math.PI * 2) * -3)



    // Cursor
    // camera.position.x = cursor.x * -1
    // camera.position.y = cursor.y

    // mesh.rotation.y = cursor.x * 2
    // mesh.rotation.x = cursor.y * 2
    camera.lookAt(mesh.position)

    // camera.rotation.y = cursor.x
    // camera.rotation.x = cursor.y
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()