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
    const light = new THREE.PointLight(0xffffff, 750.0); // To tell the computer that im using a HEX number, include that 0x in front of the color. 0xffffff is white. 1.0 is the intensity of the light.
    light.position.set(1, 5, 5); // x, y, z position of the light.
    light.castShadow = true;
    scene.add(light);
    return light;
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

// Handle the mouse click event
function onMouseClick(event, camera, cube) {
    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children);
    for (let i = 0; i < intersects.length; i++) {
        if (intersects[i].object === cube) {
            const newPosition = new THREE.Vector3(0, 0, 10);
            new Tween(camera.position)
                .to(newPosition, 2000)
                .easing(TWEEN.Easing.Quadratic.Out)
                .start();
        }
    }
}

// Update the position of the rectangle
function updateRectanglePosition(rectangle, cube) {
    const radius = 5;
    const speed = 0.001;
    const angle = performance.now() * speed;
    rectangle.position.x = Math.cos(angle) * radius;
    rectangle.position.z = Math.sin(angle) * radius;
    rectangle.lookAt(cube.position);
}

// Set up the scene, camera, renderer, controls, light, cube, plane, and rectangle
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
