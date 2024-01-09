import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Tween } from '@tweenjs/tween.js';
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
    camera.position.y = 1;
    camera.position.x = 5; // Change the position to look at the scene from a different angle
    // look at the cube from what would the the right side of it.
    // Rotate the camera
    camera.rotation.y = Math.PI / 2;

    
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
    light.position.set(1, 5, 5); // x, y, z position of the light.
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

function createText(font, textString, size, color) {
    const shapes = font.generateShapes(textString, size);
    const geometry = new THREE.ShapeGeometry(shapes);
    const material = new THREE.MeshBasicMaterial({ color: color });
    const text = new THREE.Mesh(geometry, material);
    return text;
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
    // wheel positions
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
light2.position.set(3, 5, -5);
// Create the cube by calling the create cube function.
const cube = createCube(scene);
// Create the plane by calling the create plane function.
const plane = createPlane(scene);
// Create the skateboard by calling the create skateboard function. Then add the colors of it to the skateboard in the scene.
const skateboard1 = createSkateboard(scene, "Red", "Green");
const skateboard2 = createSkateboard(scene, "Blue", "Yellow");
const skateboard3 = createSkateboard(scene, "Purple", "Orange");
// Position of the first skateboard on the z-axis
skateboard1.position.set(-.5, .5, 3);
// Position of the second skateboard the 3 axis's.
skateboard2.position.x = cube.position.x + 1.2;
skateboard2.rotation.z = Math.PI / 2;
skateboard2.position.y = 1.5;
skateboard2.position.z = -.9; // Position of the first skateboard on the z-axis
// Position of the third skateboard the 3 axis's.
skateboard3.position.x = cube.position.x + 1.2;
skateboard3.rotation.z = Math.PI /2;
skateboard3.position.y = 1.5;
skateboard3.position.z = .9; // Position of the second skateboard on the z-axis
// call the setupSecondCamera function to set up the second camera that will be used when the user clicks on the skateboard.

let secondCamera = setupSecondCamera();

// Create a raycaster and a mouse vector

const raycaster = new THREE.Raycaster();
// Create a mouse vector

const mouse = new THREE.Vector2();

// Load the font from its path. Then create the text and add it to the scene.

loadFont('/node_modules/three/examples/fonts/helvetiker_regular.typeface.json')
    .then(font => {
        const text = createText(font, 'Project Text.', .3,'green');
        text.position.set(-1.2, 2, 1);
        scene.add(text);
    })
    .catch(error => {
        console.error('Error loading fontt:', error);
    });
    
// Call the load font function, to then load the font and the text onto the scene using the createText function on line 63-76. 

loadFont('/node_modules/three/examples/fonts/helvetiker_regular.typeface.json')
    .then(font => {
        const text = createText(font, 'Wasup Gamers', 0.4,'orange');
        text.position.set(1.1, 2, 2);
        text.rotation.y = Math.PI / 2;
        scene.add(text);
    })
    .catch(error => {
        console.error('Error loading fontt:', error);
    });

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
    if (intersects[i].object.parent === skateboard1 || intersects[i].object.parent === skateboard2) {
        // Switch to the second camera
        camera = secondCamera;

        // Disable the controls
        controls.enabled = false;
    } else if (intersects[i].object.parent === skateboard3) {
        // Switch back to the first camera
        camera = setupCamera();

        // Update the controls with the new camera and enable them
        controls = setupControls(camera, renderer, controls, true);
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
