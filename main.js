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
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
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
    const boardSize = { width: 1, height: 0.1, depth: 0.3 };
    const boardPosition = { x: 0, y: boardSize.height / 2, z: 0 };
    const boardMaterial = new THREE.MeshStandardMaterial({ color });

    const boardGeometry = new THREE.BoxGeometry(boardSize.width, boardSize.height, boardSize.depth);
    const board = new THREE.Mesh(boardGeometry, boardMaterial);
    board.position.set(boardPosition.x, boardPosition.y, boardPosition.z);
    board.castShadow = true;
    board.receiveShadow = true;

    return board;
}

function createWheels(color) {
    const wheelSize = { radius: 0.05, height: 0.1 };
    const wheelPositions = [
        { x: -0.45, y: -wheelSize.height / 2, z: 0.15 },
        { x: 0.45, y: -wheelSize.height / 2, z: 0.15 },
        { x: -0.45, y: -wheelSize.height / 2, z: -0.15 },
        { x: 0.45, y: -wheelSize.height / 2, z: -0.15 },
    ];
    const wheelMaterial = new THREE.MeshStandardMaterial({ color });

    const wheels = wheelPositions.map(position => {
        const wheelGeometry = new THREE.CylinderGeometry(wheelSize.radius, wheelSize.radius, wheelSize.height, 32);
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
    const truckSize = { width: 0.02, height: 0.02, depth: 0.2 };
    const truckPositions = [
        { x: -0.4, y: truckSize.height / 2, z: 0 },
        { x: 0.4, y: truckSize.height / 2, z: 0 },
    ];
    const truckMaterial = new THREE.MeshStandardMaterial({ color: "Gray" });

    const trucks = truckPositions.map(position => {
        const truckGeometry = new THREE.BoxGeometry(truckSize.width, truckSize.height, truckSize.depth);
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

// This function creates a 3D model of a shelf using Three.js
function createShelf() {
    // Create a new group to hold the parts of the shelf
    const shelfGroup = new THREE.Group();

    // Define the geometry for the shelves. This creates a box shape with dimensions 1x0.1x0.5.
    const shelfGeometry = new THREE.BoxGeometry(1, 0.1, 0.5);

    // Define the material for the shelves. This creates a standard material with a brown color.
    const shelfMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });

    // Create 3 shelves and add them to the shelf group
    for (let i = 0; i < 3; i++) {
        // Create a new mesh with the shelf geometry and material
        const shelf = new THREE.Mesh(shelfGeometry, shelfMaterial);

        // Position the shelf vertically, with a spacing of 1.2 units between each shelf
        shelf.position.y = i * 1.2 - 1;

        // Enable shadows for the shelf
        shelf.castShadow = true;
        shelf.receiveShadow = true;

        // Add the shelf to the shelf group
        shelfGroup.add(shelf);
    }

    // Define the geometry for the sides of the shelf. This creates a box shape with dimensions 0.1x3x0.5.
    const sideGeometry = new THREE.BoxGeometry(0.1, 3, 0.5);

    // Create 2 sides and add them to the shelf group
    for (let i = 0; i < 2; i++) {
        // Create a new mesh with the side geometry and material
        const side = new THREE.Mesh(sideGeometry, shelfMaterial);

        // Position the side horizontally, with one side at x=-0.5 and the other at x=0.5
        side.position.x = i * 1 - 0.5;

        // Enable shadows for the side
        side.castShadow = true;
        side.receiveShadow = true;

        // Add the side to the shelf group
        shelfGroup.add(side);
    }

    // Return the shelf group, which now contains the 3 shelves and 2 sides
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
function createTipBowl() {
    // Define the points for the shape of the bowl
    const points = [];
    for (let i = 0; i < 10; ++i) {
        points.push(new THREE.Vector2(Math.sin(i * 0.2) * 0.3 + 0.3, (i - 5) * 0.08));
    }

    // Create the LatheGeometry using these points
    const geometry = new THREE.LatheGeometry(points);

    // Create a MeshPhysicalMaterial with the desired color and double-sided
    const material = new THREE.MeshPhysicalMaterial({ color: 0x0000ff, side: THREE.DoubleSide }); // Blue color

    // Create a Mesh using the geometry and material
    const bowl = new THREE.Mesh(geometry, material);

    // Position the bowl on top of the exhibit
    bowl.position.y = 2.756; // Adjust the position as needed
    bowl.position.z = -10; // Adjust the position as needed

    // Scale down the bowl
    bowl.scale.set(0.5, 0.5, 0.5);

    return bowl;
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
// Set up the scene, camera, renderer, controls, light, cube, plane, and rectangle and other objects in the scene here.
// MAKE SURE TO ADD AFTER THE SCENE IS SETUP.
//scene setup


const scene = setupScene();
// camera setup
let camera = setupCamera();
// renderer setup
const renderer = setupRenderer();
// controls setup
let controls = setupControls(camera, renderer);

// Create the cube by calling the create cube function.

// Create the plane by calling the create plane function.
const plane = createPlane(scene);
// Create the skateboard by calling the create skateboard function. Then add the colors of it to the skateboard in the scene.

const skateboard1 = createSkateboard(scene, "Black", "White");
const skateboard2 = createSkateboard(scene, "Green", "Green");
const skateboard3 = createSkateboard(scene, "Blue", "Blue");
const skateboard4 = createSkateboard(scene, "Purple", "Purple");
// Create the signpost
const post = createPost(scene);
const sign = createSign(scene, post);

const blueBowl = createTipBowl();
blueBowl.name = "tipBowl1"; // adds a identifier to the bowl
scene.add(blueBowl);
const redBowl = createTipBowl();
redBowl.position.x = 5; // Adjust the position as needed
redBowl.position.z = -10; // Adjust the position as needed
redBowl.name = "tipBowl2"; // adds a identifier to the bowl
scene.add(redBowl);

redBowl.material.color.set(0xff0000); // Set the color to red

const glassExhibit = createGlassExhibit();
scene.add(glassExhibit);
glassExhibit.position.set(2, 1.5,-10);
const backWall = createBackWall();
scene.add(backWall);
skateboard1.position.set(-1, 2.5, -14.5,);
skateboard2.position.set(1, 2.5, -14.5,);
skateboard3.position.set(3, 2.5, -14.5,);
skateboard4.position.set(5, 2.5, -14.5,);

// Rotate the skateboards
skateboard1.rotation.x = Math.PI /4; // Rotate 45 degrees around the x-axis
skateboard1.rotation.y = Math.PI /2; // Rotate 90 degrees around the y-axis

// Apply the same rotation to other skateboards
skateboard2.rotation.x = skateboard1.rotation.x;
skateboard2.rotation.y = skateboard1.rotation.y;

skateboard3.rotation.x = skateboard1.rotation.x;
skateboard3.rotation.y = skateboard1.rotation.y;

skateboard4.rotation.x = skateboard1.rotation.x;
skateboard4.rotation.y = skateboard1.rotation.y;

skateboard1.name = "skateboard1"; // Add a identifier to the skateboard.
skateboard2.name = "skateboard2"; // Add a identifier to the skateboard.
skateboard3.name = "skateboard3"; // Add a identifier to the skateboard.
skateboard4.name = "skateboard4"; // Add a identifier to the skateboard.

scene.add(skateboard1, skateboard2, skateboard3, skateboard4);
// call the setupSecondCamera function to set up the second camera that will be used when the user clicks on the skateboard.
// Setup cameras
let firstCamera = setupCamera(9, 4, 10, Math.PI / 2);
let currentCamera = firstCamera; // Initialize currentCamera to firstCamera
let secondCamera = setupCamera(0, 15, 10, Math.PI / 2);
scene.add(firstCamera);
scene.add(secondCamera);
let thirdCamera = setupCamera(0, 0, 0);
thirdCamera.lookAt(glassExhibit.position);


let overHeadLight = setupLight(scene);
overHeadLight.position.set(1, 6, -7);
// Create a raycaster and a mouse vector


// Function to create and position a lamp post
function createAndPositionLampPost(baseColor, lightColor, position, intensity) {
    const lampPost = createLampPost(baseColor, lightColor); // baseColor instead of color
    // Create a light source and set its intensity
    let light = new THREE.PointLight(lightColor, intensity);
    lampPost.add(light); // Add the light to the lampPost
    lampPost.position.set(...position);
    scene.add(lampPost);
}
// Create and position objects
const shelf = createShelf();
shelf.position.set(-10, 1.5, -10);
scene.add(shelf);

createAndPositionLampPost(0x000000, 0xff0000, [-5, 1.5, -10], 0.53); // Red lamp post with increased brightness
createAndPositionLampPost(0x000000, 0x00ff00, [10, 1.5, -10], 0.5); // Green lamp post with decreased brightness

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

loadAndCreateText(
    '/node_modules/three/examples/fonts/optimer_bold.typeface.json', // The path to the font file
'Welcome to the shop menu. Enjoy your stay.',// The text to display in the scene. You can change this to whatever you want. Or copy this as a layout for your own text.
0.5, // The size of the text
'red', // The color of the text
[-4, 5, -14], // The cordiantes of the text on the x, y, and z axis. You can change this to position the text wherever you want.
);

function moveCameraTo(targetPosition, lookAtPosition, duration = 2000) {
    new Tween.Tween(camera.position)
        .to({
            x: targetPosition.x,
            y: targetPosition.y,
            z: targetPosition.z
        }, duration)
        .easing(Tween.Easing.Quadratic.Out)
        .onUpdate(() => {
            camera.lookAt(lookAtPosition);
        })
        .onComplete(() => {
            controls.enabled = false;
        })
        .start();
}

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Add an event listener for the mouse click event
window.addEventListener('click', (event) => {
    // Normalize the mouse position from -1 to 1
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Update the picking ray with the camera and mouse position
    raycaster.setFromCamera(mouse, camera);

    // Calculate objects intersecting the picking ray
    const intersects = raycaster.intersectObjects(scene.children);

    for (let i = 0; i < intersects.length; i++) {
        if (intersects[i].object.name === "tipBowl1") {
            console.log('Tip bowl 1 has been clicked');
            const targetPosition = new THREE.Vector3(1, 4, -6);
            const lookAtPosition = new THREE.Vector3(1, 4, -10);
            moveCameraTo(targetPosition, lookAtPosition);
            break;
        } else if (intersects[i].object.name === "tipBowl2") {
            console.log('Tip bowl 2 has been clicked');
            const targetPosition = new THREE.Vector3(0, 4, 9); // Update as needed
            const lookAtPosition = new THREE.Vector3(0, 4, -12); // Update as needed
            moveCameraTo(targetPosition, lookAtPosition);
            break;
            // Then give the user the controls back. This will allow the user to move the camera around.

         }
        }
    }
);


// Render the scene and update the position of the rectangle
function render() {
    requestAnimationFrame(render);
    Tween.update();
    renderer.render(scene, camera);
}

render(); // Start the render loop
