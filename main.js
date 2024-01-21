import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
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

function setupFourthCamera() {
    let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = -6;
    camera.position.y = 1.5; // Height of the Camera.
    camera.position.x = -10; // Change the position to look at the scene from a different angle
    // look at the cube from what would the the right side of it.
    // Rotate the camera
    return camera;
}

function setupFithCamera() {
    let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 15;
    camera.position.y = 3;
    camera.position.x = 7;
    camera.rotation.y = -Math.PI / 2;
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
    const planeGeometry = new THREE.PlaneGeometry(59, 59);
    const planeMaterial = new THREE.MeshStandardMaterial({ color: "gray", side: THREE.DoubleSide });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = Math.PI / 2;
    plane.receiveShadow = true;
    scene.add(plane);
    return plane;
}

function createShelf() {
    // Create a group to hold the parts of the shelf
    const shelfGroup = new THREE.Group();

    // Create a box geometry for the shelves
    const shelfGeometry = new THREE.BoxGeometry(4, 0.1, 1.5);

    // Create a mesh material for the shelves
    const shelfMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });

    // Create and position the shelves
    for (let i = 0; i < 3; i++) {
        const shelf = new THREE.Mesh(shelfGeometry, shelfMaterial);
        shelf.position.y = i * 1.5 - 1; // Adjust this to position the shelves correctly
        shelf.castShadow = true;
        shelf.receiveShadow = true;
        shelfGroup.add(shelf);
    }

    // Create a box geometry for the sides
    const sideGeometry = new THREE.BoxGeometry(0.1, 5, 1);

    // Create and position the sides
    for (let i = 0; i < 2; i++) {
        const side = new THREE.Mesh(sideGeometry, shelfMaterial);
        side.position.x = i * 1.5 - 0.7; // Adjust this to position the sides correctly
        side.castShadow = true;
        side.receiveShadow  = true;
        shelfGroup.add(side);
    }

    return shelfGroup;
}

function createLampPost(lightColor) {
    // Create a group to hold the parts of the lamp post
    const lampPostGroup = new THREE.Group();

    // Create a cylinder geometry for the post
    const postGeometry = new THREE.CylinderGeometry(0.1, 0.1, 3, 32);

    // Create a mesh material for the post
    const postMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 })

    // Create and position the post
    const post = new THREE.Mesh(postGeometry, postMaterial);
    post.castShadow = true; // Enable casting shadows
    post.receiveShadow = true; // Enable receiving shadows
    lampPostGroup.add(post);

    // Create a sphere geometry for the light
    const lightGeometry = new THREE.SphereGeometry(0.5, 32, 32);

    // Create a mesh material for the light
    const lightMaterial = new THREE.MeshToonMaterial({ color: lightColor, transparent: true, opacity: 1 });
    // Create and position the light sphere
    const lightSphere = new THREE.Mesh(lightGeometry, lightMaterial);
    lightSphere.position.y = 1.5; // Adjust this to position the light sphere correctly
    lightSphere.castShadow = true; // Enable casting shadows
    lightSphere.receiveShadow = true; // Enable receiving shadows
    lampPostGroup.add(lightSphere);

    // Create a point light
    const pointLight = new THREE.PointLight(lightColor, 50, 32);
    pointLight.position.set(0, 1.5, 0); // Position the light at the same position as the light sphere
    pointLight.castShadow = true; // Enable casting shadows
    lampPostGroup.add(pointLight);

    return lampPostGroup;

}

function createExhibit(x, y, z,) {
    // Create the geometry for the display exhibit
    const exhibitGeometry = new THREE.BoxGeometry(3, 4, 6);

    // Create the material for the display exhibit
    const exhibitMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xffffff, // white
        transparent: true,
        transmission: 0.8, // High transmission for glass-like effect
        roughness: 0, // Low roughness for glass-like effect
        clearcoat: 1, // High clearcoat for glass-like effect
        clearcoatRoughness: 0 // Low clearcoat roughness for glass-like effect
    });



    // Create the display exhibit
    const exhibit = new THREE.Mesh(exhibitGeometry, exhibitMaterial);

    // Create the geometry for the bottom
    const bottomGeometry = new THREE.BoxGeometry(3, 1, 6);// Make sure this is around the same size as the exhibit geometry.
    
    // Create the material for the bottom
    const bottomMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xffffff, // white
        transparent: false
    });

    
    // Create the bottom
    const bottom = new THREE.Mesh(bottomGeometry, bottomMaterial);
    // Position the bottom just below the exhibit
    bottom.position.set(x, y - 1.5, z);

    // Position the exhibit in the scene
    exhibit.position.set(x, y, z);



    
    // Create a group to hold the exhibit and the bottom
    const group = new THREE.Group();
    group.add(exhibit);
    group.add(bottom);
    // Return the group
    return group;
}



// Set up the scene, camera, renderer, controls, light, cube, plane, and other objects in the scene here.
// MAKE SURE TO ADD AFTER THE SCENE IS SETUP.

// Scene setup
const scene = setupScene();

// Camera setup
const camera = setupCamera();

// Renderer setup
const renderer = setupRenderer();

// Controls setup
const controls = setupControls(camera, renderer);

// Light setup
const light1 = setupLight(scene);
const light2 = setupLight(scene);
const light3 = setupLight(scene);
light3.position.set(15, 5, 15);
light1.position.set(2, 5, 5);
light2.position.set(-2, 5, -5);

// Create the cube
const cube = createCube(scene);

// Create the plane
const plane = createPlane(scene);

// Create the skateboards
const skateboard1 = createSkateboard(scene, "Red", "Green");
const skateboard2 = createSkateboard(scene, "Blue", "Yellow");
const skateboard3 = createSkateboard(scene, "Purple", "Orange");
const skateboard4 = createSkateboard(scene, "Black", "White");

const skateboard5 = createSkateboard(scene, "Yellow", "Blue");

const skateboard6 = createSkateboard(scene, "White", "Green");


// Position the skateboards
skateboard1.position.set(-0.5, 0.5, 3);
skateboard2.position.set(cube.position.x + 1.2, 1.5, -0.9);
skateboard2.rotation.z = Math.PI / 2;
skateboard3.position.set(cube.position.x + 1.2, 1.5, 0.9);
skateboard3.rotation.z = Math.PI / 2;
skateboard4.position.set(cube.position.x - 1.2, 1.4, -.9);
skateboard4.rotation.z = Math.PI / -2;

skateboard5.position.set(cube.position.x - 1.2, 1.4, .9);
skateboard5.rotation.z = Math.PI / -2;

// Setup the 6th skateboard on the shelf
skateboard6.position.set(-10, 1.5, -10);
skateboard6.rotation.x = Math.PI / 6;

//setup a 7th skateboard on the shelf.
const skateboard7 = createSkateboard(scene, "Red", "Green");
skateboard7.position.set(-10, 3, -10);
skateboard7.rotation.x = Math.PI / 6;


// Set up the second camera
const secondCamera = setupSecondCamera();

// Set up the third camera
const thirdCamera = setupThirdCamera();
// setup the fourth camera
const fourthCamera = setupFourthCamera();
// setup the fith camera. 
const FithCamera = setupFithCamera();

// Create a raycaster and a mouse vector
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Create and position the shelf
const shelf = createShelf();
shelf.position.set(-10, 1.5, -10);
scene.add(shelf);
// Create the colored lamp post variables.
const redLampPost = createLampPost(0xFF0000);
const blueLampPost = createLampPost(0x0000FF);
const greenLampPost = createLampPost(0x00FF00);
const yellowLampPost = createLampPost(0xFFFF00);
const orangeLampPost = createLampPost(0xC04000);
const purpleLampPost = createLampPost(0x800080);

// The add them to the scene. And then place them in the correct positions.
scene.add(redLampPost, blueLampPost, greenLampPost, yellowLampPost, orangeLampPost, purpleLampPost);
redLampPost.position.set(20, 1.5, -10);
blueLampPost.position.set(20, 1.5, 10);
greenLampPost.position.set(-20, 1.5, 10);
yellowLampPost.position.set(-20, 1.5, -10);
orangeLampPost.position.set(0, 1.5, 20);
purpleLampPost.position.set(0, 1.5, -20);

const exhibit1 = createExhibit(15, 1.5, 15);
scene.add(exhibit1);


// Lets create a new plane that will be the backboard for the text. Behind the exhibit display.
const textPlaneGeometry = new THREE.PlaneGeometry(15, 15);
const textPlaneMaterial = new THREE.MeshStandardMaterial({ color: "Green", side: THREE.DoubleSide });
const textPlane = new THREE.Mesh(textPlaneGeometry, textPlaneMaterial);
textPlane.position.set(20, 3, 15);
textPlane.rotation.y = Math.PI / 2;

scene.add(textPlane);





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
    'Project Text.',// This is where you put the text strings.
    0.3,// Text size here.
    'green', // Color goes here.
    [-1.3, 2, 1] // This is then where the text is placed.
);

loadAndCreateText(
    '/node_modules/three/examples/fonts/helvetiker_regular.typeface.json',
    'Wasup Gamers',// This is where you put the text strings.
    0.4,// Text size here.
    'orange', // Color goes here.
    [1.1, 2, 2], // This is then where the text is placed.
    Math.PI / 2
);

loadAndCreateText(
    '/node_modules/three/examples/fonts/helvetiker_regular.typeface.json',
    ' Oh shit what it do',// This is where you put the text strings.
    0.3,// Text size here.
    'purple', // Color goes here.
    [-1, 2, -2], // This is then where the text is placed.
    -Math.PI / 2
);

loadAndCreateText(
    '/node_modules/three/examples/fonts/helvetiker_regular.typeface.json',
    ' I built a shelf here',// This is where you put the text strings.
    0.4,// Text size here.
    'Red', // Color goes here.
    [-12, 4, -9], // This is then where the text is placed.
);

loadAndCreateText(
    '/node_modules/three/examples/fonts/helvetiker_bold.typeface.json',
    'Shop menu',
    0.9,
    'Red',
    [19.9, 9, 10], 
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
            controls.enabled = true;


        } else if (intersects[i].object.parent === skateboard5) {
            // Create a tween that interpolates the position and rotation of the camera to the position and rotation of the fourth camera
            new Tween.Tween(camera.position)
                .to(fourthCamera.position, 2000)
                .onUpdate(() => camera.lookAt(shelf.position))
                .start();

            new Tween.Tween(camera.rotation)
                .to({ x: fourthCamera.rotation.x, y: fourthCamera.rotation.y, z: fourthCamera.rotation.z }, 2000)
                .start();
            console.log('Camera rotated to the fourth camera angle, and is looking at the shelf.');

            // Disable the controls
            controls.enabled = false;
        
        } else if (intersects[i].object.parent === skateboard6) 
        // Them move back to the first camera then give the user the controls back.
        {
            // Create a tween that interpolates the position and rotation of the fourth camera to the position and rotation of the first camera
            new Tween.Tween(camera.position)
                .to(setupCamera().position, 2000)
                .onUpdate(() => camera.lookAt(cube.position))
                .start();

            new Tween.Tween(camera.rotation)
                .to({ x: setupCamera().rotation.x, y: setupCamera().rotation.y, z: setupCamera().rotation.z }, 2000)
                .onUpdate(() => camera.lookAt(cube.position))
                .start();
            console.log('Camera rotated back to the first camera view. looking at the front of the cube.');

            controls.enabled = true;
        }else if (intersects[i].object.parent === skateboard7) {
            // Create a tween that interpolates the position and rotation of the camera to the position and rotation of the fourth camera
            new Tween.Tween(camera.position)
                .to(FithCamera.position, 2000)
                .onUpdate(() => camera.lookAt(shelf.position))
                .start();
        
            new Tween.Tween(camera.rotation)
                .to({ x: FithCamera.rotation.x, y: FithCamera.rotation.y, z: FithCamera.rotation.z }, 2000)
                .start();
            console.log('Camera rotated to the fourth camera angle, and is looking at the shelf.');
        
            // Disable the controls
            controls.enabled = false;
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
