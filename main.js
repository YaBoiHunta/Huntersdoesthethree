import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Tween } from '@tweenjs/tween.js';
// setup the secene of hte 3D world.
const scene = new THREE.Scene();
// setup the camera for the view.
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
// setup the renderer for the scene.

const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
const loader = new GLTFLoader();

// Sets up the red box gemoetry. And then adds it to the scene.
const geometry = new THREE.BoxGeometry(2, 2, 2); // This is where you would adjust the size of the cube. X, Y, Z
const material = new THREE.MeshStandardMaterial({ color: "red" });
const cube = new THREE.Mesh(geometry, material);
// This is where you would add your adjustments to the cube.

// Define the geometry for the rectangle. Adjust the dimensions as needed.
const rectangleGeometry = new THREE.BoxGeometry(10, 1, 4);

// Define the material for the rectangle.
const rectangleMaterial = new THREE.MeshStandardMaterial({ color: "purple" });

// Create the rectangle mesh.
const rectangle = new THREE.Mesh(rectangleGeometry, rectangleMaterial);

// Position the rectangle on top of the cube.
rectangle.position.y = 2 + 1/2; // cube's top y-coordinate + half of rectangle's height

// Add the rectangle to the scene.
scene.add(rectangle);

// this Sets where the cube is located.
cube.position.y = 1;
scene.add(cube);
// This sets where the camera is located.
camera.position.z = 10;
// This sets up the grid size.
const size = 50;
const divisions = 50;
const gridHelper = new THREE.GridHelper(size, divisions);
// Then add it to the scene.
scene.add(gridHelper);

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Create a directional light. 
const light = new THREE.DirectionalLight(0xffffff, 1.0);

// Set its postion
light.position.set(2, 2, 2);
// Enable the shadow casting for this light.
light.castShadow = true;

// add it to the scene
scene.add(light);

cube.castShadow = true;
cube.receiveShadow = true;


// Mouse click function 
/**
 * Handles the mouse click event.
 * 
 * @param {MouseEvent} event - The mouse click event object.
 */
function onMouseClick(event) {
    // calculate mouse position in normalized device coordinates
    // (-1 to +1) for both components
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    if (intersects[i].object === cube) {
        // create a new position for the camera
        const newPosition = new THREE.Vector3(0, 0, 10);
    
        // create a tween for the camera's position
        new Tween(camera.position)
            .to(newPosition, 2000) // transition over 2000 milliseconds
            .easing(TWEEN.Easing.Quadratic.Out) // use easing for a smoother transition
            .start();
    }

    // update the picking ray with the camera and mouse position
    raycaster.setFromCamera(mouse, camera);

    // calculate objects intersecting the picking ray
    const intersects = raycaster.intersectObjects(scene.children);

    for (let i = 0; i < intersects.length; i++) {
        // check if the intersected object is our cube
        if (intersects[i].object === cube) {
            // transition to a different camera angle
            camera.position.set(0, 0, 10); // set to desired position
            camera.lookAt(cube.position); // make the camera look at the cube
        }
    }
}

window.addEventListener('click', onMouseClick, false);


function render() {
    requestAnimationFrame(render);
// this is where we would calculate the new postion of the rectangle.
    const radius = 5; // the radius of the circle that the rectangle will move along.
    const speed = 0.001; // THe speed of what the rectangle will move at.
    const angle = performance.now() * speed; // This is the angle that the rectangle will move at.
    rectangle.position.x = Math.cos(angle) * radius;
    rectangle.position.z = Math.sin(angle) * radius;
    renderer.render(scene, camera);
    renderer.shadowMap.enabled = true;
    
    rectangle.lookAt(cube.position);

    renderer.render(scene, camera);
}

render();





