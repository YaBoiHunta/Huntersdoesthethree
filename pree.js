import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import Tween from '@tweenjs/tween.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';

// Set up the scene
function setupScene() {
    const scene = new THREE.Scene();
    return scene;
}

// Set up the camera
function setupCamera() {
    let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 10;
    camera.position.y = 5;
    return camera;
} 

// Set up the second camera
function setupSecondCamera() {
    let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 0;
    camera.position.y = 1; // Height of the Camera. 
    camera.position.x = 8; // Change the position to look at the scene from a different angle
    // look at the cube from what would the the right side of it.
    // Rotate the camera
    camera.rotation.y = Math.PI / 2;
    return camera;
}
// Setup a third camera to look at the left side of the cube.

function setupThirdCamera() {
    let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 0;
    camera.position.y = 1; // Height of the Camera.
    camera.position.x = -8; // Change the position to look at the scene from a different angle
    // look at the cube from what would the the left side of it.
    // Rotate the camera
    camera.rotation.y = Math.PI / -2;
    return camera;
}

// Set up the renderer
function setupRenderer() {
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    renderer.shadowMap.enabled = true;
    return renderer;
}

// Set up the controls
function setupControls(camera, renderer, controls, enabled) {
    if (controls) {
        controls.dispose(); // Dispose of the old controls
    }
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enabled = enabled;
    return controls;
}

// Set up the light
function setupLight(scene) {
    const light = new THREE.PointLight(0xffffff, 100.0); // To tell the computer that im using a HEX number, include that 0x in front of the color. 0xffffff is white. 1.0 is the intensity of the light.
    light.position.set(2, 5, 5); // x, y, z position of the light.
    light.castShadow = true;
    scene.add(light);
    return light;
}

function loadFont(url) {
    return new Promise((resolve, reject) => {
        const loader = new FontLoader();
        loader.load(url, resolve, undefined, reject);
    });
}

function createText(font, textString, size, color){
    const shapes = font.generateShapes(textString, size);
    const geometry = new THREE.ShapeGeometry(shapes);
    const material = new THREE.MeshBasicMaterial({ color: color });
    const text = new THREE.Mesh(geometry, material);
    return text;
}


// Create the skateboard mesh
function createSkateboard(scene, boardColor, wheelColor) {
    const board = createBoard(boardColor);
    const wheels = createWheels(wheelColor);
    const trucks = createTrucks();

    const skateboard = new THREE.Group();
    skateboard.add(board, ...wheels, ...trucks);

    scene.add(skateboard);
    return skateboard;
}

function createBoard(color) {
    const geometry = new THREE.BoxGeometry(1, 0.1, 0.3);
    const material = new THREE.MeshStandardMaterial({ color });
    const board = new THREE.Mesh(geometry, material);
    board.position.y = 0.15;
    board.castShadow = true;
    board.receiveShadow = true;
    return board;
}

function createWheels(color) {
    const wheelGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.1, 32);
    const wheelMaterial = new THREE.MeshStandardMaterial({ color });

    const wheelPositions = [
        { x: -0.4, y: 0.05, z: 0.1 },
        { x: 0.4, y: 0.05, z: 0.1 },
        { x: -0.4, y: 0.05, z: -0.1 },
        { x: 0.4, y: 0.05, z: -0.1 },
    ];

    const wheels = wheelPositions.map(position => {
        const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
        wheel.position.set(position.x, position.y, position.z);
        wheel.rotation.y = Math.PI / 2;
        wheel.rotation.z = Math.PI / 2;
        wheel.castShadow = true;
        wheel.receiveShadow = true;
        return wheel;
    });
    
    return wheels;
}

function createTrucks() {
    const truckGeometry = new THREE.BoxGeometry(0.02, 0.02, 0.2);
    const truckMaterial = new THREE.MeshStandardMaterial({ color: "silver" });

    const truckPositions = [
        { x: -0.4, y: 0.1, z: 0 },
        { x: 0.4, y: 0.1, z: 0 },
    ];

    const trucks = truckPositions.map(position => {
        const truck = new THREE.Mesh(truckGeometry, truckMaterial);
        truck.position.set(position.x, position.y, position.z);
        truck.castShadow = true;
        truck.receiveShadow = true;
        return truck;
    });

    return trucks;
}


// Create the cube mesh
function createCube(scene) {
    const geometry = new THREE.BoxGeometry(2, 2, 2);
    const material = new THREE.MeshStandardMaterial({ color: "red" });
    const cube = new THREE.Mesh(geometry, material);
    cube.position.y = 1;
    cube.castShadow = true;
    cube.receiveShadow = true;
    scene.add(cube);
    return cube;
}

// Create the plane mesh
function createPlane(scene) {
    const planeGeometry = new THREE.PlaneGeometry(50, 50);
    const planeMaterial = new THREE.MeshStandardMaterial({ color: "gray", side: THREE.DoubleSide });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = Math.PI / 2;
    plane.receiveShadow = true;
    scene.add(plane);
    return plane;
}

// Set up the scene, camera, renderer, controls, light, cube, plane, and rectangle and other objects in the scene
// Assuming controls is an instance of THREE.OrbitControls
//scene setup
const scene = setupScene();
// camera setup
let camera = setupCamera();
// renderer setup
const renderer = setupRenderer();
// controls setup
let controls = setupControls(camera, renderer);
// light setup
const light1 = setupLight(scene);
// Second light setup
const light2 = setupLight(scene);
light2.position.set(-2, 5, -5);
// Create the cube by calling the create cube function.
const cube = createCube(scene);
// Create the plane by calling the create plane function.
const plane = createPlane(scene);
// Create the skateboard by calling the create skateboard function. Then add the colors of it to the skateboard in the scene.
const skateboard1 = createSkateboard(scene, "Red", "Green");
const skateboard2 = createSkateboard(scene, "Blue", "Yellow");
const skateboard3 = createSkateboard(scene, "Purple", "Orange");
const skateboard4 = createSkateboard(scene, "Black", "White");
// Position of the first skateboard on the z-axis
skateboard1.position.set(-.5, .5, 3);
// Position of the second skateboard the 3 axis's.
skateboard2.position.set(cube.position.x + 1.2, 1.5, -.9); skateboard2.rotation.z = Math.PI / 2;
// Position of the third skateboard the 3 axis's.
skateboard3.position.set(cube.position.x + 1.2, 1.5, .9); skateboard3.rotation.z = Math.PI / 2
;// Position of the second skateboard on the z-axis 
// Position of the fourth skateboard on the z-axis
skateboard4.position.set(cube.position.x - 1.2, 1.4, 0); skateboard4.rotation.z = Math.PI / -2;

// call the setupSecondCamera function to set up the second camera that will be used when the user clicks on the skateboard.

let secondCamera = setupSecondCamera();

// Call the third camera function to setup the third camera that will be used when the user clicks on the skateboard.
let thirdCamera = setupThirdCamera();

// Create a raycaster and a mouse vector

const raycaster = new THREE.Raycaster();
// Create a mouse vector

const mouse = new THREE.Vector2();

// Load the font from its path. Then create the text and add it to the scene.

function loadAndCreateText(fontPath, textString, size, color, position, rotationY) {
    loadFont(fontPath)
        .then(font => {
            const text = createText(font, textString, size, color);
            text.position.set(...position);
            if (rotationY !== undefined) {
                text.rotation.y = rotationY;
            }
            scene.add(text);
        })
        .catch(error => {
            console.error('Error loading font:', error);
        });
}

// Now you can create text with a single function call
loadAndCreateText(
    '/node_modules/three/examples/fonts/helvetiker_regular.typeface.json',
    'Project Text.',
    0.3,
    'green',
    [-1.3, 2, 1]
);

loadAndCreateText(
    '/node_modules/three/examples/fonts/helvetiker_regular.typeface.json',
    'Wasup Gamers',
    0.4,
    'orange',
    [1.1, 2, 2],
    Math.PI / 2
);

loadAndCreateText(
    '/node_modules/three/examples/fonts/helvetiker_regular.typeface.json',
    ' Oh shit what it do',
    0.3,
    'purple',
    [-1, 2, -2],
    -Math.PI / 2
);

// This is the function that will be called when the user clicks on the skateboard.

window.addEventListener('click', (event) => {
    // Update the mouse vector with the mouse's normalized device coordinates (-1 to +1)
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Update the raycaster's ray with the camera and mouse position
    raycaster.setFromCamera(mouse, camera);

    // Calculate objects intersecting the raycaster's ray
    const intersects = raycaster.intersectObjects(scene.children, true);

    // Check if any of the skateboards is among the intersected objects
    for (let i = 0; i < intersects.length; i++) {
        if (intersects[i].object.parent === skateboard1) {
            // Create a tween that interpolates the position and rotation of the first camera to the position and rotation of the second camera
            new Tween.Tween(camera.position)
                .to(secondCamera.position, 2000) // 2000 ms = 2 seconds
                .onUpdate(() => camera.lookAt(cube.position))
                .start();

            new Tween.Tween(camera.rotation)
                .to({ x: secondCamera.rotation.x, y: secondCamera.rotation.y, z: secondCamera.rotation.z }, 2000)
                .onUpdate(() => camera.lookAt(cube.position))
                .start();
            console.log('Camera rotated to the second camera angle, and is looking at the right side of the cube.');

            // Disable the controls
            controls.enabled = false;

        } else if (intersects[i].object.parent === skateboard2) {
            // Create a tween that interpolates the position and rotation of the second camera to the position and rotation of the third camera
            new Tween.Tween(camera.position)
                .to(thirdCamera.position, 2000)
                .onUpdate(() => camera.lookAt(cube.position))
                .start();

            new Tween.Tween(camera.rotation)
                .to({ x: thirdCamera.rotation.x, y: thirdCamera.rotation.y, z: thirdCamera.rotation.z }, 2000)
                .onUpdate(() => camera.lookAt(cube.position))
                .start();
            console.log('Camera rotated to the third camera angle, and is looking at the left side of the cube.');

            // Disable the controls
            controls.enabled = false;

        } else if (intersects[i].object.parent === skateboard3 || intersects[i].object.parent === skateboard4) {
            // Create a tween that interpolates the position and rotation of the third camera to the position and rotation of the first camera
            new Tween.Tween(camera.position)
                .to(setupCamera().position, 2000)
                .onUpdate(() => camera.lookAt(cube.position))
                .start();

            new Tween.Tween(camera.rotation)
                .to({ x: setupCamera().rotation.x, y: setupCamera().rotation.y, z: setupCamera().rotation.z }, 2000)
                .onUpdate(() => camera.lookAt(cube.position))
                .start();
            console.log('Camera rotated back to the first camera view. looking at the front of the cube.');

            // Update the controls with the new camera and enable them
            controls = setupControls(camera, renderer, controls, true);
        }
    }
}, false);

// Render the scene and update the position of the rectangle
function render() {
    requestAnimationFrame(render);
    Tween.update();
    renderer.render(scene, camera);
}

// Start rendering
render();
