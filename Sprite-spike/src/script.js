import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'


/**
 * Sprite animation
 */
function TextureAnimator(texture, tilesHoriz, tilesVert, tileDispDuration) {
    let obj = {};

    obj.texture = texture;
    obj.tilesHorizontal = tilesHoriz;
    obj.tilesVertical = tilesVert;
    obj.tileDisplayDuration = tileDispDuration;

    obj.numberOfTiles = tilesHoriz * tilesVert;

    obj.texture.wrapS = THREE.RepeatWrapping;
    obj.texture.wrapT = THREE.RepeatWrapping;
    obj.texture.repeat.set(1 / tilesHoriz, 1 / tilesVert);
    obj.currentTile = 0;

    obj.nextFrame = function () {
        obj.currentTile++;
        if (obj.currentTile == obj.numberOfTiles)
            obj.currentTile = 0;

        let currentColumn = obj.currentTile % obj.tilesHorizontal;
        obj.texture.offset.x = currentColumn / obj.tilesHorizontal;

        let currentRow = Math.floor(obj.currentTile / obj.tilesHorizontal);
        obj.texture.offset.y = obj.tilesVertical - currentRow / obj.tilesVertical;
    }

    obj.start = function () { obj.intervalID = setInterval(obj.nextFrame, obj.tileDisplayDuration); }

    obj.stop = function () { clearInterval(obj.intervalID); }

    obj.start();
    return obj;
}

/**
 * Base
 */
// Debug

const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const loadingManager = new THREE.LoadingManager()
const textureLoader = new THREE.TextureLoader(loadingManager)
const texture = textureLoader.load('/textures/sprites/YEe96.jpg');
// var texture = new SpriteSheetTexture('/textures/sprites/YEe96.jpg', 4, 4, 100, 16);

// SpriteSheetTexture()

var annie = new TextureAnimator(texture, 4, 4, 16, 25000);
/**
 * Object
 */



// var material = new THREE.MeshBasicMaterial({
//     map: texture
// });
// const geometry = new THREE.BoxGeometry(200, 200, 200);
// const mesh = new THREE.Mesh(geometry, material);
// scene.add(mesh);

annie.stop()

var material = new THREE.MeshBasicMaterial({ map: annie.texture })
// material.texture = annie
const cube = new THREE.Mesh(
    new THREE.BoxBufferGeometry(1, 1, 1),
    material
)

scene.add(cube)

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


var loopTime = clock.getElapsedTime()
const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Update Sprites
    if (elapsedTime > loopTime + 0.250) {
        annie.nextFrame()
        loopTime = elapsedTime
    }


    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
