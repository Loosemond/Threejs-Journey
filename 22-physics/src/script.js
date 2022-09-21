import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import CANNON from 'cannon'
/**
 * Debug
 */
const gui = new dat.GUI()
const debugObject = {}

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()

const environmentMapTexture = cubeTextureLoader.load([
    '/textures/environmentMaps/4/nx.png',
    '/textures/environmentMaps/4/px.png',
    '/textures/environmentMaps/4/py.png',
    '/textures/environmentMaps/4/ny.png',
    '/textures/environmentMaps/4/pz.png',
    '/textures/environmentMaps/4/nz.png'
])
/**
 * Physics
 */
// world
const world = new CANNON.World()
// Collision optimization may generate bugs 
world.broadphase = new CANNON.SAPBroadphase(world)
// Ignore stand still objects
world.allowSleep = true
world.gravity.set(0, -9.82, 0)
// Materials
const concreteMaterial = new CANNON.Material("Concrete")
const plasticMaterial = new CANNON.Material("plastic")

const conretePlasticContactMaterial = new CANNON.ContactMaterial(
    concreteMaterial,
    plasticMaterial,
    {
        friction: 0.1,
        restitution: 0.7
    }
)
world.addContactMaterial(conretePlasticContactMaterial)
world.defaultContactMaterial = conretePlasticContactMaterial
// Sphere
// const sphereShape = new CANNON.Sphere(0.5)

// const sphereBody = new CANNON.Body({
//     mass: 1,
//     position: new CANNON.Vec3(0, 3, 0),
//     shape: sphereShape,
//     material: plasticMaterial

// })
// world.addBody(sphereBody)

// Floor
const floorShape = new CANNON.Plane()
const floorBody = new CANNON.Body()
floorBody.material = concreteMaterial
floorBody.mass = 0
floorBody.addShape(floorShape)
floorBody.quaternion.setFromAxisAngle(
    new CANNON.Vec3(-1, 0, 0),
    Math.PI / 2
)
world.addBody(floorBody)
/**
 * Test sphere
 */
// const sphere = new THREE.Mesh(
//     new THREE.SphereGeometry(0.5, 32, 32),
//     new THREE.MeshStandardMaterial({
//         metalness: 0.3,
//         roughness: 0.4,
//         envMap: environmentMapTexture,
//         envMapIntensity: 0.5
//     })
// )
// sphere.castShadow = true
// sphere.position.y = 0.5
// scene.add(sphere)

/**
 * Floor
 */
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({
        color: '#777777',
        metalness: 0.5,
        roughness: 0.4,
        envMap: environmentMapTexture,
        envMapIntensity: 0.5
    })
)
floor.receiveShadow = true
floor.rotation.x = - Math.PI * 0.5
scene.add(floor)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = - 7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = - 7
directionalLight.position.set(5, 5, 5)
scene.add(directionalLight)

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
camera.position.set(- 3, 3, 3)
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
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Sounds
 */
const audioListener = new THREE.AudioListener();
const sound = new THREE.PositionalAudio(audioListener);

camera.add(audioListener);
const hitSound = new THREE.Audio(audioListener);
// scene.add(hitSound);

const audioLoader = new THREE.AudioLoader();

audioLoader.load('/sounds/hit.mp3', function (audioBuffer) {
    hitSound.setBuffer(audioBuffer);
    hitSound.setLoop(true);
    hitSound.setVolume(1);
    // hitSound.hasPlaybackControl = true
    // hitSound.autoplay = true
    // hitSound.setRefDistance(100);
},
    // onProgress callback
    function (xhr) {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },

    // onError callback
    function (err) {
        console.log('An error happened');
    })


// sound.set(hitSound)
sound.setRefDistance(1000);
// hitSound.play()
// const hitSound = new Audio('/sounds/hit.mp3')

function isCollider(obj) {
    return
}

const playHitSound = (collision) => {
    const impactStrength = collision.contact.getImpactVelocityAlongNormal()
    // console.log(collision.contact.bi.id)
    let collidingObj = objectsToUpdate.find(e => e.body.id === collision.contact.bi.id)
    // console.log(collidingObj)

    // console.log(objectsToUpdate.find(e => console.log(e.body.id)))

    if (impactStrength > 0) {
        // hitSound.volume = Math.random()
        // hitSound.currentTime = 0
        // hitSound.stop()
        // hitSound.play()
        collidingObj.mesh.children[0].play()
    }
}


/**
 * Utils
 */
const objectsToUpdate = []
const createSphere = (radius, position) => {
    // Three.js mesh
    audioLoader.load('/sounds/hit.mp3', function (buffer) {
        // hitSound.setBuffer(audioBuffer);

        const mesh = new THREE.Mesh(
            new THREE.SphereGeometry(radius, 20, 20),
            new THREE.MeshStandardMaterial({
                metalness: 0.3,
                roughness: 0.1,
                envMap: environmentMapTexture,
                envMapIntensity: 0.8
            })
        )
        mesh.castShadow = true
        mesh.position.copy(position)
        mesh.add(sound)
        scene.add(mesh)

        const audio = new THREE.PositionalAudio(audioListener);
        audio.setBuffer(buffer);
        audio.setRefDistance(20)
        mesh.add(audio)

        const shape = new CANNON.Sphere(radius)

        const body = new CANNON.Body({
            mass: 1,
            position: new CANNON.Vec3(0, 3, 0),
            shape: shape,
            material: plasticMaterial
        })
        body.position.copy(position)

        body.addEventListener('collide', playHitSound)
        world.addBody(body)

        objectsToUpdate.push({
            mesh: mesh,
            body: body
        })
    },)



}
createSphere(0.5, { x: 0, y: 3, z: 0 })
// createSphere(0.5, { x: 1.5, y: 3, z: 0 })
// createSphere(0.5, { x: 1.5, y: 3, z: 1.5 })

debugObject.createSphere = () => {
    createSphere(
        Math.random() * 0.5 + 0.2,
        {
            x: (Math.random() - 0.5) * 3,
            y: 3,
            z: (Math.random() - 0.5) * 3
        }
    )
}
gui.add(debugObject, 'createSphere')

// objectsToUpdate[0].mesh.children[0].play()


/**
 * Animate
 */
const clock = new THREE.Clock()
let oldElapsedTime = 0
const tick = () => {

    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - oldElapsedTime
    oldElapsedTime = elapsedTime

    // update physics World
    world.step(1 / 60, deltaTime, 3)
    // sphere.position.copy(sphereBody.position)
    // sphereBody.applyLocalForce(new CANNON.Vec3(1, 0, 0), new CANNON.Vec3(0, 0, 0))
    for (const object of objectsToUpdate) {
        object.mesh.position.copy(object.body.position)
        object.mesh.quaternion.copy(object.body.quaternion)
        // object.mesh.children[0].play()
        // console.log(object.mesh.children[0].play)
        // object.body.applyLocalForce(new CANNON.Vec3(1, 0, 0), new CANNON.Vec3(0, 0, 0))
    }

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()