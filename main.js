import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import Tween from '@tweenjs/tween.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { Text } from 'troika-three-text';

/*
 * This function sets up a new THREE.js scene.
 *
 * @returns {THREE.Scene} - The created scene.
 */
function setupScene() {
    const scene = new THREE.Scene();
    return scene;
}

/*
 * This function sets up a new THREE.js camera with a perspective projection.
 *
 * @param {number} x - The x-coordinate of the camera's position.
 * @param {number} y - The y-coordinate of the camera's position.
 * @param {number} z - The z-coordinate of the camera's position.
 * @param {number} rotationY - The rotation of the camera around the y-axis.
 * @returns {THREE.PerspectiveCamera} - The created camera.
 */
function setupCamera(x = 0, y = 5, z = 10, rotationY = 0) {
    let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(x, y, z);
    camera.rotation.y = rotationY;
    return camera;
}

/*
 * This function sets up a new THREE.js renderer with antialiasing.
 *
 * @returns {THREE.WebGLRenderer} - The created renderer.
 */
function setupRenderer() {
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    renderer.shadowMap.enabled = true;
    return renderer;
}

/*
 * This function sets up new OrbitControls for a given camera and renderer.
 *
 * @param {THREE.Camera} camera - The camera for which the controls will be set up.
 * @param {THREE.WebGLRenderer} renderer - The renderer for which the controls will be set up.
 * @param {OrbitControls} controls - The old controls to be disposed.
 * @param {boolean} enabled - Whether the controls should be enabled.
 * @returns {OrbitControls} - The created controls.
 */
function setupControls(camera, renderer, controls, enabled) {
    if (controls) {
        controls.dispose(); // Dispose of the old controls
    }
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enabled = enabled;
    return controls;
}

/*
 * This function sets up a new THREE.js point light and adds it to a given scene.
 *
 * @param {THREE.Scene} scene - The scene to which the light will be added.
 * @returns {THREE.PointLight} - The created light.
 */
function setupLight(scene) {
    // Create a white point light with an intensity of 100.0
    const light = new THREE.PointLight(0xffffff, 100.0);

    // Set the position of the light
    light.position.set(2, 5, 5);

    // Enable shadows for the light
    light.castShadow = true;

    // Add the light to the scene
    scene.add(light);

    // Return the light
    return light;
}





/*
 * This function creates a 3D model of a skateboard using the THREE.js library.
 *
 * @param {THREE.Scene} scene - The scene to which the skateboard will be added.
 * @param {string} boardColor - The color of the skateboard's board.
 * @param {string} wheelColor - The color of the skateboard's wheels.
 * @returns {THREE.Group} - The skateboard as a THREE.Group object.
 */
function createSkateboard(scene, boardColor, wheelColor) {
    // Create the board of the skateboard
    const board = createBoard(boardColor);

    // Create the wheels of the skateboard
    const wheels = createWheels(wheelColor);

    // Create the trucks of the skateboard
    const trucks = createTrucks();

    // Create a group to hold all the parts of the skateboard
    const skateboard = new THREE.Group();

    // Add the board, wheels, and trucks to the skateboard group
    skateboard.add(board, ...wheels, ...trucks);

    // Add the skateboard to the scene
    scene.add(skateboard);

    // Return the skateboard
    return skateboard;
}

/*
 * This function creates a 3D model of a board using the THREE.js library.
 *
 * @param {string} color - The color of the board.
 * @returns {THREE.Mesh} - The board as a THREE.Mesh object.
 */
function createBoard(color) {
    // Define the size of the board
    const boardSize = { width: 1, height: 0.1, depth: 0.3 };

    // Define the position of the board
    const boardPosition = { x: 0, y: boardSize.height / 2, z: 0 };

    // Create the material for the board: a standard material with the specified color
    const boardMaterial = new THREE.MeshStandardMaterial({ color });

    // Create the geometry for the board: a box with the defined size
    const boardGeometry = new THREE.BoxGeometry(boardSize.width, boardSize.height, boardSize.depth);

    // Create the board mesh by combining the geometry and material
    const board = new THREE.Mesh(boardGeometry, boardMaterial);

    // Position the board at the defined position
    board.position.set(boardPosition.x, boardPosition.y, boardPosition.z);

    // Enable shadows for the board
    board.castShadow = true;
    board.receiveShadow = true;

    // Return the board
    return board;
}

/*
 * This function creates 3D models of wheels using the THREE.js library.
 *
 * @param {string} color - The color of the wheels.
 * @returns {Array<THREE.Mesh>} - An array of wheels as THREE.Mesh objects.
 */
function createWheels(color) {
    // Define the size of the wheels
    const wheelSize = { radius: 0.05, height: 0.1 };

    // Define the positions of the wheels
    const wheelPositions = [
        { x: -0.45, y: -wheelSize.height / 2, z: 0.15 },
        { x: 0.45, y: -wheelSize.height / 2, z: 0.15 },
        { x: -0.45, y: -wheelSize.height / 2, z: -0.15 },
        { x: 0.45, y: -wheelSize.height / 2, z: -0.15 },
    ];

    // Create the material for the wheels: a standard material with the specified color
    const wheelMaterial = new THREE.MeshStandardMaterial({ color });

    // Create the wheels
    const wheels = wheelPositions.map(position => {
        // Create the geometry for the wheel: a cylinder with the defined size
        const wheelGeometry = new THREE.CylinderGeometry(wheelSize.radius, wheelSize.radius, wheelSize.height, 32);

        // Create the wheel mesh by combining the geometry and material
        const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);

        // Position the wheel at the defined position
        wheel.position.set(position.x, position.y, position.z);

        // Rotate the wheel by 90 degrees around the y-axis and z-axis (to make it horizontal)
        wheel.rotation.y = Math.PI / 2;
        wheel.rotation.z = Math.PI / 2;

        // Enable shadows for the wheel
        wheel.castShadow = true;
        wheel.receiveShadow = true;

        // Return the wheel
        return wheel;
    });

    // Return the wheels
    return wheels;
}

/*
 * This function creates 3D models of trucks using the THREE.js library.
 *
 * @returns {Array<THREE.Mesh>} - An array of trucks as THREE.Mesh objects.
 */
function createTrucks() {
    // Define the size of the trucks
    const truckSize = { width: 0.02, height: 0.02, depth: 0.2 };

    // Define the positions of the trucks
    const truckPositions = [
        { x: -0.4, y: truckSize.height / 2, z: 0 },
        { x: 0.4, y: truckSize.height / 2, z: 0 },
    ];

    // Create the material for the trucks: a standard material with gray color
    const truckMaterial = new THREE.MeshStandardMaterial({ color: "Gray" });

    // Create the trucks
    const trucks = truckPositions.map(position => {
        // Create the geometry for the truck: a box with the defined size
        const truckGeometry = new THREE.BoxGeometry(truckSize.width, truckSize.height, truckSize.depth);

        // Create the truck mesh by combining the geometry and material
        const truck = new THREE.Mesh(truckGeometry, truckMaterial);

        // Position the truck at the defined position
        truck.position.set(position.x, position.y, position.z);

        // Enable shadows for the truck
        truck.castShadow = true;
        truck.receiveShadow = true;

        // Return the truck
        return truck;
    });

    // Return the trucks
    return trucks;
}


/*
 * This function creates a 3D model of a plane using the THREE.js library.
 *
 * @param {THREE.Scene} scene - The scene to which the plane will be added.
 * @returns {THREE.Mesh} - The plane as a THREE.Mesh object.
 */
function createPlane(scene) {
    // Create the geometry for the plane: a plane with dimensions 59x59
    const planeGeometry = new THREE.PlaneGeometry(59, 59);

    // Create the material for the plane: a standard material with gray color, and both sides of the material are rendered
    const planeMaterial = new THREE.MeshStandardMaterial({ color: "gray", side: THREE.DoubleSide });

    // Create the plane mesh by combining the geometry and material
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);

    // Rotate the plane by 90 degrees around the x-axis (to make it horizontal)
    plane.rotation.x = Math.PI / 2;

    // Enable shadows for the plane
    plane.receiveShadow = true;

    // Add the plane to the scene
    scene.add(plane);

    // Return the plane
    return plane;
}

/*
 * This function creates a 3D model of a post using the THREE.js library.
 *
 * @param {THREE.Scene} scene - The scene to which the post will be added.
 * @returns {THREE.Mesh} - The post as a THREE.Mesh object.
 */
function createPost(scene) {
    // Create the geometry for the post: a box with dimensions 0.2x5x0.2
    const geometry = new THREE.BoxGeometry(0.2, 5, 0.2);

    // Create the material for the post: a standard material with brown color
    const material = new THREE.MeshStandardMaterial({ color: "brown" });

    // Create the post mesh by combining the geometry and material
    const post = new THREE.Mesh(geometry, material);

    // Position the post at the coordinates (-15, 2.5, 0)
    post.position.y = 2.5; // Adjust this to position the post correctly
    post.position.x = -15;

    // Enable shadows for the post
    post.castShadow = true;
    post.receiveShadow = true;

    // Add the post to the scene
    scene.add(post);

    // Return the post
    return post;
}

/*
 * This function creates a 3D model of a sign using the THREE.js library.
 *
 * @param {THREE.Scene} scene - The scene to which the sign will be added.
 * @param {THREE.Mesh} post - The post to which the sign will be attached.
 * @returns {THREE.Mesh} - The sign as a THREE.Mesh object.
 */
function createSign(scene, post) {
    // Create the geometry for the sign: a box with dimensions 2x1x0.1
    const geometry = new THREE.BoxGeometry(2, 1, 0.1);

    // Create the material for the sign: a standard material with white color
    const material = new THREE.MeshStandardMaterial({ color: "white" });

    // Create the sign mesh by combining the geometry and material
    const sign = new THREE.Mesh(geometry, material);

    // Position the sign at the same x and z coordinates as the post, and at a height of 4 units
    sign.position.y = 4; // Adjust this to position the sign correctly
    sign.position.x = post.position.x;
    sign.position.z = post.position.z;

    // Enable shadows for the sign
    sign.castShadow = true;
    sign.receiveShadow = true;

    // Add the sign to the scene
    scene.add(sign);

    // Return the sign
    return sign;
}

// This function creates a 3D model of a wall shelf using Three.js
function createWallShelf() {
    // Create a new group to hold the parts of the shelf
    const shelfGroup = new THREE.Group();

    // Define the geometry for the shelves. This creates a box shape with dimensions 5x0.2x0.2.
    const shelfGeometry = new THREE.BoxGeometry(5, 0.2, 2);

    // Define the material for the shelves. This creates a standard material with a brown color.
    const shelfMaterial = new THREE.MeshToonMaterial({ color: 0x8B4513 });

    // Create 3 shelves and add them to the shelf group
    for (let i = 0; i < 3; i++) {
        // Create a new mesh with the shelf geometry and material
        const shelf = new THREE.Mesh(shelfGeometry, shelfMaterial);

        // Position the shelf vertically, with a spacing of 1.2 units between each shelf
        shelf.position.y = i * 1.2;

        // Enable shadows for the shelf
        shelf.castShadow = true;
        shelf.receiveShadow = true;

        // Add the shelf to the shelf group
        shelfGroup.add(shelf);
    }

    // Define the geometry for the back of the shelf. This creates a box shape with dimensions 5x3x0.1.
    const backGeometry = new THREE.BoxGeometry(5, 3, 0.1);

    // Create the back and add it to the shelf group
    const back = new THREE.Mesh(backGeometry, shelfMaterial);

    // Position the back at y=1.2 (halfway up the height of the shelf) and z=-0.15 (slightly behind the center of the shelf)
    back.position.set(0, 1.2, -0.15);

    // Enable shadows for the back
    back.castShadow = true;
    back.receiveShadow = true;

    // Add the back to the shelf group
    shelfGroup.add(back);

    // Return the shelf group, which now contains the 3 shelves, 2 sides, and back
    return shelfGroup;
}
/*
 * This function creates a 3D model of a lamp post using the THREE.js library.
 *
 * @param {number} postColor - The color of the lamp post.
 * @param {number} lightColor - The color of the light emitted by the lamp.
 * @returns {THREE.Group} - A group of THREE.js objects that together form the lamp post.
 */
function createLampPost(postColor, lightColor) {
    // Create a new group to hold the parts of the lamp post
    const lampPostGroup = new THREE.Group();

    // Create the geometry for the post: a cylinder with a radius of 0.1, a height of 3, and 32 radial segments
    const postGeometry = new THREE.CylinderGeometry(0.1, 0.1, 3, 32);

    // Create the material for the post: a standard material with the specified color
    const postMaterial = new THREE.MeshStandardMaterial({ color: postColor });

    // Create the post mesh by combining the geometry and material, and enable shadows
    const post = new THREE.Mesh(postGeometry, postMaterial);
    post.castShadow = true;
    post.receiveShadow = true;

    // Add the post to the lamp post group
    lampPostGroup.add(post);

    // Create the geometry for the light: a sphere with a radius of 0.5 and 32 segments in both the azimuthal and polar directions
    const lightGeometry = new THREE.SphereGeometry(0.5, 32, 32);

    // Create the material for the light: a toon material with the specified color, fully opaque
    const lightMaterial = new THREE.MeshToonMaterial({ color: lightColor, transparent: true, opacity: 1 });

    // Create the light sphere mesh by combining the geometry and material, and set its position
    const lightSphere = new THREE.Mesh(lightGeometry, lightMaterial);
    lightSphere.position.y = 1.5;
    lightSphere.castShadow = false;
    lightSphere.receiveShadow = false;

    // Add the light sphere to the lamp post group
    lampPostGroup.add(lightSphere);

    // Create a point light with the specified color, a distance of 50, and a decay of 32, and set its position
    const pointLight = new THREE.PointLight(lightColor, 50, 32);
    pointLight.position.set(0, 1.5, 0);
    pointLight.castShadow = false;

    // Add the point light to the lamp post group
    lampPostGroup.add(pointLight);

    // Return the lamp post group
    return lampPostGroup;
}

// Function to create a hat
function createHat(x, y, z) {
    // Define the color of the hat
    const hatColor = 0x000000; // black

    // Create a group to hold the parts of the hat
    const hat = new THREE.Group();

    // Create the crown of the hat
    const crownGeometry = new THREE.ConeGeometry(0.2, 0.3, 32);
    const crownMaterial = new THREE.MeshStandardMaterial({ color: hatColor, shininess: 100 });
    const crown = new THREE.Mesh(crownGeometry, crownMaterial);
    hat.add(crown);

    // Create the brim of the hat
    const brimGeometry = new THREE.TorusGeometry(0.3, 0.10, 16, 100, Math.PI * 2);
    const brimMaterial = new THREE.MeshPhongMaterial({ color: hatColor, shininess: 100 });
    const brim = new THREE.Mesh(brimGeometry, brimMaterial);
    brim.rotation.x = Math.PI / 2; // rotate the brim to make it horizontal
    brim.position.y = -0.15; // position the brim slightly below the crown
    hat.add(brim);

    // Position the hat
    hat.position.set(x, y, z);

    return hat;
}

// Function to create a wax bar
function createWaxBar(x, y, z) {
    // Create the geometry for the wax bar
    const barGeometry = new THREE.BoxGeometry(0.5, 0.3, 0.05);

    // Create the material for the wax bar
    const barMaterial = new THREE.MeshPhongMaterial({ color: 0xFFFFFF, shininess: 100 }); // white color for wax bar

    // Create the wax bar
    const bar = new THREE.Mesh(barGeometry, barMaterial);

    // Position the wax bar
    bar.position.set(x, y, z);

    return bar;
}


// Function to create a high-quality coat hanger
function createHanger(x, y, z) {
    // Create a group to hold the parts of the hanger
    const hanger = new THREE.Group();

    // Create the body of the hanger
    const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-0.15, 0, 0),
        new THREE.Vector3(-0.05, 0.05, 0),
        new THREE.Vector3(0.05, 0.05, 0),
        new THREE.Vector3(0.15, 0, 0)
    ]);
    const bodyGeometry = new THREE.TubeGeometry(curve, 20, 0.01, 8, false);
    const bodyMaterial = new THREE.MeshPhongMaterial({ color: 0x808080, shininess: 100 }); // grey color for body
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    hanger.add(body);

    // Create the hook of the hanger
    const hookGeometry = new THREE.CylinderGeometry(0.01, 0.01, 0.1, 32);
    const hookMaterial = new THREE.MeshPhongMaterial({ color: 0x808080, shininess: 100 }); // grey color for hook
    const hook = new THREE.Mesh(hookGeometry, hookMaterial);
    hook.position.y = 0.05; // position the hook above the body
    hanger.add(hook);

    // Position the hanger
    hanger.position.set(x, y, z);

    return hanger;
}

// Function to create a T-shirt
function createTShirt(x, y, z) {
    // Create the body of the T-shirt
    const bodyGeometry = new THREE.BoxGeometry(0.2, 0.3, 0.02);
    const bodyMaterial = new THREE.MeshLambertMaterial({ color: 0xFF0000 }); // red color for body
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);

    // Create the sleeves of the T-shirt
    const sleeveGeometry = new THREE.BoxGeometry(0.08, 0.12, 0.02);
    const sleeveMaterial = new THREE.MeshLambertMaterial({ color: 0xFF0000 }); // red color for sleeves
    const leftSleeve = new THREE.Mesh(sleeveGeometry, sleeveMaterial);
    leftSleeve.position.set(-0.15, 0, 0);
    body.add(leftSleeve);
    const rightSleeve = leftSleeve.clone();
    rightSleeve.position.set(0.15, 0, 0);
    body.add(rightSleeve);

    // Position the T-shirt
    body.position.set(x, y, z);

    return body;
}



// Function to create a bar
function createBar(x, y, z, length) {
    // Create the geometry for the bar
    const barGeometry = new THREE.CylinderGeometry(0.01, 0.01, length, 90);

    // Create the material for the bar
    const barMaterial = new THREE.MeshPhongMaterial({ color: 0x808080, shininess: 100 }); // grey color for bar

    // Create the bar
    const bar = new THREE.Mesh(barGeometry, barMaterial);

    // Rotate the bar to make it horizontal
    bar.rotation.x = Math.PI / 2;

    // Position the bar
    bar.position.set(x, y, z);

    return bar;
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


/*
 * This function creates a back wall using THREE.js.
 *
 * @returns {THREE.Mesh} - The created back wall as a THREE.Mesh object.
 */
function createBackWall() {
    // Create a plane geometry with a width of 20 and a height of 15
    const geometry = new THREE.PlaneGeometry(20, 15);

    // Create a physical material with a color of white and double-sided rendering
    const material = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide
    });

    // Create a mesh from the geometry and material
    const wall = new THREE.Mesh(geometry, material);

    // Set the position of the wall
    wall.position.z = -15;
    wall.position.x = 3;

    // Return the wall
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
// Lets add the shelf to the scene
const shelf = createWallShelf();
scene.add(shelf);
shelf.position.set(-4.5, 2, -14.5);
// Add the hats to the shelf and scene.
const hat1 = createHat(-4.5, 2.4, -14);
const hat2 = createHat(-4.5, 3.5, -14);
const hat3 = createHat(-3, 2.4, -14);
const hat4 = createHat(-3, 3.5, -14);
scene.add(hat1, hat2, hat3, hat4);
// Add the coat hangers to the shelf and scene.
const hanger1 = createHanger(-9, 2, 7);
scene.add(hanger1);

const hanger2 = createHanger(-9, 2, -2);
scene.add(hanger2);

const hanger3 = createHanger(-9, 2, 0);
scene.add(hanger3);

const hanger4 = createHanger(-9, 2, 2);
scene.add(hanger4);

const hanger5 = createHanger(-9, 2, 5);
scene.add(hanger5);

// Add the bar to the scene
let bar = createBar(-9, 2, 4, 8);
scene.add(bar);
// Create a T-shirt and add it to a hanger
const tShirt1 = createTShirt(0, 0, 0);
hanger1.add(tShirt1);
const tShirt2 = createTShirt(0, 0, 0);
const tShirt3 = createTShirt(0, 0, 0);
const tShirt4 = createTShirt(0, 0, 0);
const tShirt5 = createTShirt(0, 0, 0);
hanger2.add(tShirt2);
hanger3.add(tShirt3);
hanger4.add(tShirt4);
hanger5.add(tShirt5);

// Create a wax bar and add it to the scene
const waxBar = createWaxBar(-4, 4.5, -14);
scene.add(waxBar);




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
// Define the colors for the wheels
const colors = ["Black", "Red", "Blue", "Green", "Purple", "Yellow"];

// Iterate over the colors
// Define an array of colors for the wheels
const wheelColors = ["Black", "Red", "Blue", "Green"];

// We will create a set of wheels for each color
for (let colorIndex = 0; colorIndex < wheelColors.length; colorIndex++) {
    // Get the current color
    const currentColor = wheelColors[colorIndex];

    // We will create four wheels of each color
    for (let wheelNumber = 0; wheelNumber < 4; wheelNumber++) {
        // Create a wheel with the current color
        const wheel = createWheels(currentColor)[0];

        // Set the position of the wheel
        // The x position is offset based on the wheel number
        // The y position is constant
        // The z position is offset based on the color index
        wheel.position.set(2 + wheelNumber * 0.15, 1.5, -10 - colorIndex * 0.1);

        // Rotate the wheel 90 degrees around the x-axis
        wheel.rotation.x = Math.PI / 2;

        // Add the wheel to the scene
        scene.add(wheel);
    }
}
// call the setupSecondCamera function to set up the second camera that will be used when the user clicks on the skateboard.
// Setup cameras
let firstCamera = setupCamera(4, 4, 10, Math.PI / 2);
let currentCamera = firstCamera; // Initialize currentCamera to firstCamera
let secondCamera = setupCamera(0, 15, 10, Math.PI / 2);
scene.add(firstCamera);
scene.add(secondCamera);
let thirdCamera = setupCamera(0, 0, 0);
thirdCamera.lookAt(glassExhibit.position);


let overHeadLight = setupLight(scene);
overHeadLight.position.set(1, 10, -7);
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

// Create a Text instance
const text = new Text();
// Set properties to define the text
text.text = 'Welcome to the skateboard shop'; // Set the text to display
text.fontSize = 0.5; // Set the font size
text.color = 0x9966FF; // Set the color
// Synchronize the text's properties to its mesh
text.sync();
// Position the text on the back wall of the exhibit
text.position.set(-1, 5, -14);

// Add the text to the scene
scene.add(text);
// Create a strawberry lamp post with increased brightness and position it in the scene
createAndPositionLampPost(0xffffff, 0xff0000, [-8, 1.5, -10], 0.53);

// Create a strawberry lamp post with decreased brightness and position it in the scene
createAndPositionLampPost(0xffffff, 0xff00ff, [13, 1.5, -10], 0.5);

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
