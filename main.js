import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Tween } from '@tweenjs/tween.js';




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
    camera.position.z = 5;
    camera.position.y = 5;
    camera.position.x = 5; // Change the position to look at the scene from a different angle
    // look at the cube from what would the the right side of it.
    camera.lookAt(cube.position); // Look at the cube
    
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
function setupControls(camera, renderer) {
    const controls = new OrbitControls(camera, renderer.domElement);
    return controls;
}

// Set up the light
function setupLight(scene) {
    const light = new THREE.PointLight(0xffffff, 100.0); // To tell the computer that im using a HEX number, include that 0x in front of the color. 0xffffff is white. 1.0 is the intensity of the light.
    light.position.set(1, 5, 5); // x, y, z position of the light.
    light.castShadow = true;
    scene.add(light);
    return light;
}


// Create the skateboard mesh
function createSkateboard(scene, boardColor, wheelColor) {
    // Create the board
    const boardGeometry = new THREE.BoxGeometry(1, 0.1, 0.3);
    let boardMaterial = new THREE.MeshStandardMaterial({ color: boardColor });
    const board = new THREE.Mesh(boardGeometry, boardMaterial);
    board.position.y = 0.15;
    board.castShadow = true;
    board.receiveShadow = true;

    // Create the wheels
    const wheelGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.1, 32);
    let wheelMaterial = new THREE.MeshStandardMaterial({ color: wheelColor });
    const wheel1 = new THREE.Mesh(wheelGeometry, wheelMaterial);
    wheel1.position.set(-0.4, 0.05, 0.1);
    wheel1.rotation.y = Math.PI / 2;
    wheel1.rotation.z = Math.PI / 2;
    wheel1.castShadow = true;
    wheel1.receiveShadow = true;

    const wheel2 = wheel1.clone();
    wheel2.position.x = 0.4;

    const wheel3 = wheel1.clone();
    wheel3.position.z = -0.1;

    const wheel4 = wheel2.clone();
    wheel4.position.z = -0.1;

    // Create the trucks
    const truckGeometry = new THREE.BoxGeometry(0.02, 0.02, 0.2);
    const truckMaterial = new THREE.MeshStandardMaterial({ color: "silver" });
    const truck1 = new THREE.Mesh(truckGeometry, truckMaterial);
    truck1.position.set(-0.4, 0.1, 0);
    truck1.castShadow = true;
    truck1.receiveShadow = true;

    const truck2 = truck1.clone();
    truck2.position.x = 0.4;

    // Create a group and add the board, wheels, and trucks to it
    const skateboard = new THREE.Group();
    skateboard.add(board);
    skateboard.add(wheel1);
    skateboard.add(wheel2);
    skateboard.add(wheel3);
    skateboard.add(wheel4);
    skateboard.add(truck1);
    skateboard.add(truck2);

    scene.add(skateboard);
    return skateboard;
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
const scene = setupScene();
let camera = setupCamera();
const renderer = setupRenderer();
const controls = setupControls(camera, renderer);
const light = setupLight(scene);
const cube = createCube(scene);
const plane = createPlane(scene);
const skateboard1 = createSkateboard(scene, "Red", "Green");
const skateboard2 = createSkateboard(scene, "Blue", "Yellow");
const skateboard3 = createSkateboard(scene, "Purple", "Orange");
skateboard1.position.set(-.5, .5, 1.5);

skateboard2.position.set(1, .5, 2);

skateboard3.position.set(1, .5, 1);
let secondCamera = setupSecondCamera();
// Create a raycaster and a mouse vector
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// In the click event handler
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
        if (intersects[i].object.parent === skateboard1 || intersects[i].object.parent === skateboard2 || intersects[i].object.parent === skateboard3) {
            // Switch to the second camera
            camera = secondCamera;
        }
    }
}, false);

// Render the scene and update the position of the rectangle
function render() {
    requestAnimationFrame(render);
    renderer.render(scene, camera);
}

// Start rendering
render();
