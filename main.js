import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Tween } from '@tweenjs/tween.js';

// Global variables
let moveForward = false;
let moveBackward = false;
let direction = 0; // The direction the skateboard is facing, in radians
let speed = 0.1;
let turnSpeed = 0.2; // How fast the skateboard turns

// Set up the scene
function setupScene() {
    const scene = new THREE.Scene();
    return scene;
}

// Set up the camera
function setupCamera() {
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 10;
    camera.position.y = 5;
    return camera;
}

// Light setup 
function setupLights(scene) {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
}

// Set up the renderer
function setupRenderer() {
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    renderer.shadowMap.enabled = true;
    return renderer;
}

// Set up the mouse controlers for the use to move around the screen with.
function setupControls(camera, renderer) {
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0, 0);
    controls.update();
    return controls;
}

// Create the plane
function createPlane(scene) {
    const planeGeometry = new THREE.PlaneGeometry(100, 100, 1, 1);
    const planeMaterial = new THREE.MeshStandardMaterial({ color: "red" });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.receiveShadow = true;
    plane.rotation.x = -Math.PI / 2;
    scene.add(plane);
}

// Create the skateboard mesh
function createSkateboard(scene) {
    // Create the board
    const boardGeometry = new THREE.BoxGeometry(0.3, 0.1, 1); // Swapped the x and z dimensions
    const boardMaterial = new THREE.MeshStandardMaterial({ color: "Yellow" });
    const board = new THREE.Mesh(boardGeometry, boardMaterial);
    board.position.y = 0.15;
    board.castShadow = true;
    board.receiveShadow = true;

    // Create the wheels
    const wheelGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.1, 32);
    const wheelMaterial = new THREE.MeshStandardMaterial({ color: "green" });
    const wheel1 = new THREE.Mesh(wheelGeometry, wheelMaterial);
    wheel1.position.set(0.1, 0.05, -0.4); // Swapped the x and z positions
    wheel1.rotation.z = Math.PI / 2; // Rotated the wheel 90 degrees around the x-axis
    wheel1.castShadow = true;
    wheel1.receiveShadow = true;

    const wheel2 = wheel1.clone();
    wheel2.position.z = 0.4;

    const wheel3 = wheel1.clone();
    wheel3.position.x = -0.1;

    const wheel4 = wheel2.clone();
    wheel4.position.x = -0.1;

    // Create the trucks
    const truckGeometry = new THREE.BoxGeometry(0.02, 0.02, 0.2);
    const truckMaterial = new THREE.MeshStandardMaterial({ color: "silver" });
    const truck1 = new THREE.Mesh(truckGeometry, truckMaterial);
    truck1.position.set(0, 0.1, -0.4); // Swapped the x and z positions
    truck1.rotation.set(0, Math.PI / 2, 0); // Rotated the truck 90 degrees around the y-axis
    truck1.castShadow = true;
    truck1.receiveShadow = true;

    const truck2 = truck1.clone();
    truck2.position.z = 0.4;

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


// Create the door mesh
function createDoor(scene) {
    // Create the door panels
    const doorGeometry = new THREE.BoxGeometry(1, 2, 0.1);
    const doorMaterial = new THREE.MeshStandardMaterial({ color: "gray" });

    // Left door panel
    const leftDoor = new THREE.Mesh(doorGeometry, doorMaterial);
    leftDoor.position.set(-0.5, 1, 0);

    // Right door panel
    const rightDoor = new THREE.Mesh(doorGeometry, doorMaterial);
    rightDoor.position.set(0.5, 1, 0);

    // Rotate the door panels to crack open the door
    leftDoor.rotation.y = -Math.PI / 4; // Rotate 45 degrees counter-clockwise
    rightDoor.rotation.y = Math.PI / 4; // Rotate 45 degrees clockwise

    // Create a group and add the door panels to it
    const door = new THREE.Group();
    door.add(leftDoor, rightDoor);

    // Add the door to the scene
    scene.add(door);
    return door;
}

// Create the ground
function createGround(scene) {
    const groundGeometry = new THREE.PlaneGeometry(100, 100);
    const groundMaterial = new THREE.MeshStandardMaterial({ color: 'gray' });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2; // Rotate the ground to be horizontal
    scene.add(ground);
    return ground;
}

// Create a bowl
function createBowl(scene, position) {
    const bowlGeometry = new THREE.CylinderGeometry(5, 5, 1, 32);
    const bowlMaterial = new THREE.MeshStandardMaterial({ color: 'gray' });
    const bowl = new THREE.Mesh(bowlGeometry, bowlMaterial);
    bowl.position.set(position.x, position.y, position.z); // Adjust position as needed
    scene.add(bowl);
    return bowl;
}

// Create a ramp
function createRamp(scene, position) {
    const rampGeometry = new THREE.BoxGeometry(1, 0.1, 5);
    const rampMaterial = new THREE.MeshStandardMaterial({ color: 'gray' });
    const ramp = new THREE.Mesh(rampGeometry, rampMaterial);
    ramp.position.set(position.x, position.y, position.z); // Adjust position as needed
    scene.add(ramp);
    return ramp;
}

// Create a lamp
function createLamp(scene, position) {
    const lampPostGeometry = new THREE.CylinderGeometry(0.1, 0.1, 2, 32);
    const lampPostMaterial = new THREE.MeshStandardMaterial({ color: 'gray' });
    const lampPost = new THREE.Mesh(lampPostGeometry, lampPostMaterial);
    lampPost.position.set(position.x, position.y, position.z); // Adjust position as needed

    const light = new THREE.PointLight(0xffffff, 1, 100);
    light.position.set(position.x, position.y + 2, position.z); // Position the light at the top of the lamp post

    scene.add(lampPost, light);
    return { lampPost, light };
}

// Update the direction based on the arrow keys
function handleKeyDown(event) {
    switch (event.key) {
        case 'ArrowLeft':
            direction += turnSpeed;
            break;
        case 'ArrowRight':
            direction -= turnSpeed;
            break;
        case 'ArrowUp':
            moveForward = true;
            break;
        case 'ArrowDown':
            moveBackward = true;
            break;
    }
}

// Update the direction based on the arrow keys
function handleKeyUp(event) {
    switch (event.key) {
        case 'ArrowUp':
            moveForward = false;
            break;
        case 'ArrowDown':
            moveBackward = false;
            break;
    }
}

// Update the skateboard's position
function updateSkateboardPosition(skateboard) {
    if (moveForward) {
        skateboard.position.x -= speed * Math.sin(direction);
        skateboard.position.z -= speed * Math.cos(direction);
    }
    if (moveBackward) {
        skateboard.position.x += speed * Math.sin(direction);
        skateboard.position.z += speed * Math.cos(direction);
    }
    skateboard.rotation.y = direction;
}

// Initialize the scene, renderer, camera, controls, skateboard, and other elements
function init() {
    const scene = setupScene();
    const renderer = setupRenderer();
    const camera = setupCamera();
    const controls = setupControls(camera, renderer);
    const skateboard = createSkateboard(scene);
    createPlane(scene);
    setupLights(scene);
    createDoor(scene);
    

    // Add event listeners for keydown and keyup events
    window.addEventListener('keydown', handleKeyDown, false);
    window.addEventListener('keyup', handleKeyUp, false);

    // Render the scene by calling the animation function
    function animate() {
        requestAnimationFrame(animate);
        updateSkateboardPosition(skateboard);
        renderer.render(scene, camera);
    }
    animate();
}

// Call the init function to start the application
init();
