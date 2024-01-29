import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import Tween from '@tweenjs/tween.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';

// Set up the scene
function setupScene() {
    const scene = new THREE.Scene();
    return scene;
}

function setupCamera(x = 0, y = 5, z = 10, rotationY = 0) {
    let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(x, y, z);
    camera.rotation.y = rotationY;
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

function createText(font, textString, size, color) {
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



// Create the plane mesh
function createPlane(scene) {
    const planeGeometry = new THREE.PlaneGeometry(59, 59);
    const planeMaterial = new THREE.MeshStandardMaterial({ color: "gray", side: THREE.DoubleSide });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = Math.PI / 2;
    plane.receiveShadow = true;
    scene.add(plane);
    return plane;
}

// Create the post mesh
function createPost(scene) {
    const geometry = new THREE.BoxGeometry(0.2, 5, 0.2);
    const material = new THREE.MeshStandardMaterial({ color: "brown" });
    const post = new THREE.Mesh(geometry, material);
    post.position.y = 2.5; // Adjust this to position the post correctly
    post.position.x = -15;
    post.castShadow = true;
    post.receiveShadow = true;
    scene.add(post);
    return post;
}

// Create the sign mesh
function createSign(scene, post) {
    const geometry = new THREE.BoxGeometry(2, 1, 0.1);
    const material = new THREE.MeshStandardMaterial({ color: "white" });
    const sign = new THREE.Mesh(geometry, material);
    sign.position.y = 4; // Adjust this to position the sign correctly
    sign.position.x = post.position.x;
    sign.position.z = post.position.z;
    sign.castShadow = true;
    sign.receiveShadow = true;
    scene.add(sign);
    return sign;
}

function createShelf() {
    const shelfGroup = new THREE.Group();
    const shelfGeometry = new THREE.BoxGeometry(1, 0.1, 0.5);
    const shelfMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });

    for (let i = 0; i < 3; i++) {
        const shelf = new THREE.Mesh(shelfGeometry, shelfMaterial);
        shelf.position.y = i * 1.2 - 1;
        shelf.castShadow = true;
        shelf.receiveShadow = true;
        shelfGroup.add(shelf);
    }

    const sideGeometry = new THREE.BoxGeometry(0.1, 3, 0.5);

    for (let i = 0; i < 2; i++) {
        const side = new THREE.Mesh(sideGeometry, shelfMaterial);
        side.position.x = i * 1 - 0.5;
        side.castShadow = true;
        side.receiveShadow = true;
        shelfGroup.add(side);
    }

    return shelfGroup;
}

function createLampPost(postColor, lightColor) {
    const lampPostGroup = new THREE.Group();
    const postGeometry = new THREE.CylinderGeometry(0.1, 0.1, 3, 32);
    const postMaterial = new THREE.MeshStandardMaterial({ color: postColor });
    const post = new THREE.Mesh(postGeometry, postMaterial);
    post.castShadow = true;
    post.receiveShadow = true;
    lampPostGroup.add(post);

    const lightGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const lightMaterial = new THREE.MeshToonMaterial({ color: lightColor, transparent: true, opacity: 1 });
    const lightSphere = new THREE.Mesh(lightGeometry, lightMaterial);
    lightSphere.position.y = 1.5;
    lightSphere.castShadow = false;
    lightSphere.receiveShadow = false;
    lampPostGroup.add(lightSphere);

    const pointLight = new THREE.PointLight(lightColor, 50, 32);
    pointLight.position.set(0, 1.5, 0);
    pointLight.castShadow = false;
    lampPostGroup.add(pointLight);

    return lampPostGroup;
}


function createGlassExhibit() {
    const geometry = new THREE.BoxGeometry(8, 2, 2.5); // Adjust the size as needed
    const material = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        metalness: 0,
        roughness: 0,
        alphaTest: 0.5,
        opacity: 0.5, // This makes the material transparent
        transparent: true,
        reflectivity: 1 // This makes the material reflective
    });
    const exhibit = new THREE.Mesh(geometry, material);

    // Create the stand
    const standGeometry = new THREE.BoxGeometry(8, 0.2, 2.5); // Adjust the size as needed
    const standMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x555555, // Change the color as needed
        metalness: 0.8,
        roughness: 0.4
    });
    const stand = new THREE.Mesh(standGeometry, standMaterial);
    stand.position.y = -1.1; // Adjust the position as needed

    // Add the stand to the exhibit
    exhibit.add(stand);

    return exhibit;
}


function createBackWall() {
    const geometry = new THREE.PlaneGeometry(20, 15); // Adjust the size as needed
    const material = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide
    });
    const wall = new THREE.Mesh(geometry, material);
    wall.position.z = -15; // Adjust the position as needed
    wall.position.x = 3;
    return wall;
}

function disposeObject(object) {
    if (!object) return;

    // Remove the object from the scene
    scene.remove(object);

    // Dispose of the object's geometry
    if (object.geometry) {
        object.geometry.dispose();
    }

    // Dispose of the object's material
    if (object.material) {
        if (object.material instanceof THREE.MeshFaceMaterial || object.material instanceof THREE.MultiMaterial) {
            object.material.materials.forEach(function (mtrl, idx) {
                if (mtrl.map) mtrl.map.dispose();
                if (mtrl.lightMap) mtrl.lightMap.dispose();
                if (mtrl.bumpMap) mtrl.bumpMap.dispose();
                if (mtrl.normalMap) mtrl.normalMap.dispose();
                if (mtrl.specularMap) mtrl.specularMap.dispose();
                if (mtrl.envMap) mtrl.envMap.dispose();
                mtrl.dispose();    // disposes any programs associated with the material
            });
        }
        else {
            // Check if the material uses any textures, lightmaps, or envmaps.
            if (object.material.map) object.material.map.dispose();
            if (object.material.lightMap) object.material.lightMap.dispose();
            if (object.material.bumpMap) object.material.bumpMap.dispose();
            if (object.material.normalMap) object.material.normalMap.dispose();
            if (object.material.specularMap) object.material.specularMap.dispose();
            if (object.material.envMap) object.material.envMap.dispose();

            // Dispose of the material
            object.material.dispose();
        }
    }
}




// Set up the scene, camera, renderer, controls, light, cube, plane, and rectangle and other objects in the scene here.
// MAKE SURE TO ADD AFTER THE SCENE IS SETUP.
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
// Third light setup
// Create the cube by calling the create cube function.

// Create the plane by calling the create plane function.
const plane = createPlane(scene);
// Create the skateboard by calling the create skateboard function. Then add the colors of it to the skateboard in the scene.
const skateboard1 = createSkateboard(scene, "Red", "Green");
const skateboard2 = createSkateboard(scene, "Blue", "Yellow");
const skateboard3 = createSkateboard(scene, "Purple", "Orange");

const skateboard5 = createSkateboard(scene, "Black", "White");
const skateboard6 = createSkateboard(scene, "Green", "Green");
const skateboard7 = createSkateboard(scene, "Blue", "Blue");
const skateboard8 = createSkateboard(scene, "Purple", "Purple");
// Create the signpost
const post = createPost(scene);
const sign = createSign(scene, post);
// Position of the first skateboard on the z-axis
skateboard1.position.set(-.5, .5, 3);
// Position of the second skateboard the 3 axis's.


/**
 * Represents a glass exhibit for skateboards.
 * 
 * The glass exhibit is a display area where skateboards are showcased.
 * It provides a transparent enclosure to protect the skateboards while allowing viewers to see them.
 * 
 * @param {string} location - The placement or location of the glass exhibit.
 * @param {number} length - The length of the glass exhibit in lines of skateboards.
 * @param {number} width - The width of the glass exhibit in lines of skateboards.
 * @param {number} height - The height of the glass exhibit in lines of skateboards.
 * @returns {void}
 */
/**
 * Represents a glass exhibit.
 * 
 * @param {string} name - The name of the exhibit.
 * @param {number} capacity - The maximum capacity of the exhibit.
 * @param {string[]} items - The items displayed in the exhibit.
 * @returns {object} - The glass exhibit object.
 */
/*
function glassExhibit(name, capacity, items) {
    // Implementation goes here
}

/**
 * Represents the l lines of the skateboards.
 * 
 * @type {number}
 */
// var l = 10;
/**
 * Represents a glass exhibit.
 * @param {string} name - The name of the exhibit.
 * @param {number} capacity - The maximum capacity of the exhibit.
 * @param {string[]} skateboards - The lines of skateboards in the exhibit.
 * @returns {Object} - The glass exhibit object.
 */
/**
 * Creates a glass exhibit.
 * 
 * @returns {Object} The glass exhibit object.
 */
const glassExhibit = createGlassExhibit();
scene.add(glassExhibit);
glassExhibit.position.set(2, 1.5,-10);
const backWall = createBackWall();
scene.add(backWall);
skateboard5.position.set(-1, 1.5,-10);
skateboard5.rotation.x = Math.PI / 2;
skateboard6.position.set(1, 1.5,-10);
skateboard6.rotation.x = Math.PI / 2;
skateboard7.position.set(3, 1.5,-10);
skateboard7.rotation.x = Math.PI / 2;
skateboard8.position.set(5, 1.5,-10);
skateboard8.rotation.x = Math.PI / 2;



// call the setupSecondCamera function to set up the second camera that will be used when the user clicks on the skateboard.

let firstCamera  = setupCamera(8, 1, 0, Math.PI / 2);
// Call the third camera function to setup the third camera that will be used when the user clicks on the skateboard.
let secondCamera  = setupCamera(8, 1, 0, Math.PI / 2);

let thirdCamera  = setupCamera(0, 0, 0,);
// Rotate the third camera to look at the shop menu wall.
thirdCamera.lookAt(glassExhibit.position);// Create a raycaster and a mouse vector
const raycaster = new THREE.Raycaster();
// Create a mouse vector
const mouse = new THREE.Vector2();
// Call the shelf function to create the shelf, position it, and then add it to the scene for it to show up.
const shelf = createShelf();
shelf.position.set(-10, 1.5, -10);
scene.add(shelf);
// Create the lamp post and position it. Then add it to the scene.
const redLampPost = createLampPost(0x000000, 0xff0000); // Black post with red light
scene.add(redLampPost);
redLampPost.position.set(-5, 1.5, -10);
// Create the second lamp post and position it. Then add it to the scene.
const greenLampPost = createLampPost(0x000000, 0x00ff00); // Black post with green light
scene.add(greenLampPost);
greenLampPost.position.set(10,1.5,-10);
// Load the font from its path. Then create the text and add it to the scene.



disposeObject(skateboard2);
disposeObject(skateboard3);



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
    '/node_modules/three/examples/fonts/optimer_bold.typeface.json',

'Welcome to the shop menu. Enjoy your stay.',
0.5,
'red',
[-4, 5, -14],

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
            // Handle the click event for skateboard1
            // TODO: Add your code here

        } else if (intersects[i].object.parent === skateboard2) {
            // Handle the click event for skateboard2
            // TODO: Add your code here

        } else if (intersects[i].object.parent === skateboard3 || intersects[i].object.parent === skateboard1) {
            // Handle the click event for skateboard3 and skateboard4
            // TODO: Add your code here
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
