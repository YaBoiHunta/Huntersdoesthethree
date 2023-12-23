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
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 10;
    camera.position.y = 5;
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
function createSkateboard(scene) {
    // Create the board
    const boardGeometry = new THREE.BoxGeometry(1, 0.1, 0.3);
    const boardMaterial = new THREE.MeshStandardMaterial({ color: "Red" });
    const board = new THREE.Mesh(boardGeometry, boardMaterial);
    board.position.y = 0.15;
    board.castShadow = true;
    board.receiveShadow = true;

    // Create the wheels
    const wheelGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.1, 32);
    const wheelMaterial = new THREE.MeshStandardMaterial({ color: "green" });
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

// Create the function.
function createLampPost(scene) {
    const postGeometry = new THREE.CylinderGeometry(.5, 1, 6);
    const postMaterial = new THREE.MeshStandardMaterial({ color: "silver" });
    const post = new THREE.Mesh(postGeometry, postMaterial);
    post.position.y = 3;
    post.position.z = 10;
    post.castShadow = true;
    post.receiveShadow = true;
    
    // Create the light at the top of the post.
    const postLight = new THREE.PointLight(0xffffff, 1.0);
    light.position.y = 10;
    light.position.z = 10;
    light.castShadow = true;

    // Create a group and add the post and light to it.
    const lampPost = new THREE.Group();
    lampPost.add(post);
    lampPost.add(postLight);  
    
    scene.add(lampPost);
    return lampPost;
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
// Create the torus mesh
function createTorus(scene) {
    const geometry = new THREE.TorusGeometry(3, .16, 16, 100);
    const material = new THREE.MeshStandardMaterial({ color: "blue" });
    const torus = new THREE.Mesh(geometry, material);
    torus.position.y = 2;
    torus.castShadow = true;
    torus.receiveShadow = true;
    scene.add(torus);
    return torus;
}

// Create the gem mesh
function createGem(scene) {
    const geometry = new THREE.OctahedronGeometry(1);
    const material = new THREE.MeshStandardMaterial({ color: "cyan" });
    const gem = new THREE.Mesh(geometry, material);
    gem.position.y = 6; // Adjust this value to place the gem on top of the torus
    gem.castShadow = true;
    gem.receiveShadow = true;
    scene.add(gem);
    return gem;
}

// Create the plane mesh
function createPlane(scene) {
    const planeGeometry = new THREE.PlaneGeometry(20, 20);
    const planeMaterial = new THREE.MeshStandardMaterial({ color: "gray", side: THREE.DoubleSide });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = Math.PI / 2;
    plane.receiveShadow = true;
    scene.add(plane);
    return plane;
}


// Create the rectangle mesh
function createRectangle(scene, cube, plane) {
    const rectangleGeometry = new THREE.BoxGeometry(10, 1, 4);
    const rectangleMaterial = new THREE.MeshStandardMaterial({ color: "purple" });
    const rectangle = new THREE.Mesh(rectangleGeometry, rectangleMaterial);
    rectangle.position.y = cube.position.y + 1 / 2;
    rectangle.position.z = plane.position.z;
    scene.add(rectangle);
    return rectangle;
}


// Update the position of the rectangle
function updateRectanglePosition(rectangle, cube) {
    const radius = 5;
    const speed = .001;
    const angle = performance.now() * speed;
    rectangle.position.x = Math.cos(angle) * radius;
    rectangle.position.z = Math.sin(angle) * radius;
    rectangle.lookAt(cube.position);
}

// Set up the scene, camera, renderer, controls, light, cube, plane, and rectangle and other objects in the scene
const scene = setupScene();
const camera = setupCamera();
const renderer = setupRenderer();
const controls = setupControls(camera, renderer);
const light = setupLight(scene);
const cube = createCube(scene);
const plane = createPlane(scene);
const rectangle = createRectangle(scene, cube, plane);
const torus = createTorus(scene);
const gem = createGem(scene);
const skateboard1 = createSkateboard(scene);
skateboard1.position.set(-3, .5, 2);
const skateboard2 = createSkateboard(scene);
skateboard2.position.set(3, .5, 2);
const skateboard3 = createSkateboard(scene);
skateboard3.position.set(1, .5, 4);

const lampPost = createLampPost(scene);




// Handle the mouse click event
window.addEventListener('click', (event) => {
    onMouseClick(event, camera, cube);
}, false);

// Render the scene and update the position of the rectangle
function render() {
    requestAnimationFrame(render);
    updateRectanglePosition(rectangle, cube);
    renderer.render(scene, camera);
}

// Start rendering
render();
