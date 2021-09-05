console.clear();

//{{{{{{{{{{{{{{{{{{{{{{{{{{{{}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}
//{{{{{{{{{{{{{{{{{{{{{{{{{THREE.JS TIME}}}}}}}}}}}}}}}}}}}}}}}}}
//{{{{{{{{{{{{{{{{{{{{{{{{{{{{}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}
import { GLTFLoader } from './GLTFLoader.js';

//{{{{{{{{{{{{{{{{{{{{{{{GLOBAL VARIABLES}}}}}}}}}}}}}}}}}}}}}}}
let camera, scene, renderer, mask, ambientLight, directionalLight, mesh;

const container = document.getElementById("canvas");
let canvasWidth = container.clientWidth;
let canvasHeight = 350;

let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;

//+(window.innerHeight / 7); fixes offset so mask looks straight ahead
let windowHalfX = (window.innerWidth / 2) + (window.innerHeight / 7);
let windowHalfY = (canvasHeight / 2) + (window.innerWidth / 7);

init();
animate();

//{{{{{{{{{{{{{{{{{{{{{{{{{INITIALISE}}}}}}}}}}}}}}}}}}}}}}}}}
function init() {
  //{{{{{{{{{{{{{{{{{{{{{SETTING THE SCENE}}}}}}}}}}}}}}}}}}}}}
  scene = new THREE.Scene();
  scene.background = ""
  //uncomment below to see canvas bg for debugging...
  //scene.background = new THREE.Color(0xdddddd);

  //{{{{{{{{{{{{{{{{{{SETTING UP THE CAMERA}}}}}}}}}}}}}}}}}}}}
  camera = new THREE.PerspectiveCamera(
    40, 
    canvasWidth / canvasHeight, 
    0.01, 
    1000
  );
  camera.position.set(11,0,33)

  //{{{{{{{{{{{{{{{{{{{SETTING UP THE CANVAS}}}}}}}}}}}}}}}}}}}}
  renderer = new THREE.WebGLRenderer({antialias:true, alpha:true});
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(canvasWidth, canvasHeight);
  renderer.setClearColor( 0x000000, 0 );
  container.appendChild(renderer.domElement);

  //{{{{{{{{{{{{{{{{{{{{{{{{{LIGHTING}}}}}}}}}}}}}}}}}}}}}}}}}}}
  ambientLight = new THREE.AmbientLight(0xffffff, 2);
  scene.add(ambientLight);
  directionalLight = new THREE.DirectionalLight(0xffffff, 2);
  directionalLight.position.set(0, -5, 100).normalize();//test on phone if z=100 is slowing it down
  scene.add(directionalLight);

  //{{{{{{{{{{{{{{{{{{LOAD & POSITION MASK OBJ}}}}}}}}}}}}}}}}}}
  const loader = new GLTFLoader();
  loader.load("./models/scene.gltf", function(gltf) {
    mask = gltf.scene;
    scene.add(mask);
    mask.scale.set(1,1,1);
 
    mask.position.x = 13.5;   //Position (x = right+, left-)
    mask.position.y = -20;    //Position (y = up+, down-)
    //mask.position.z = -10;  //Position (z = forward+, back-)
    
    mask.rotateZ(0.02);
    mask.rotateY(1.5);
    mask.rotateX(0.01);

    mask.rotation.x = 2; //forces the mask to spin up loading
    mask.rotation.y = 0;
  });

  //{{{{{{{{{{{{{{{{{{{{{{EVENT LISTENERS}}}}}}}}}}}}}}}}}}}}}}}
  window.addEventListener( 'resize', onWindowResize, false );
  document.addEventListener( 'mousemove', onDocumentMouseMove, false );
  //uncomment below to zoom in & out for debugging...
  //document.addEventListener( 'wheel', onMouseWheel, false );
}

//{{{{{{{{{{{{{{{{{{{{{{{{{{{{ANIMATE}}}}}}}}}}}}}}}}}}}}}}}}}}}}
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  render();
}

//{{{{{{{{{{{{TWEAK CANVAS, CAMERA UPON WINDOW RESIZE}}}}}}}}}}}}
function onWindowResize() {
  windowHalfX = (window.innerWidth / 2) + (window.innerHeight / 7);
  windowHalfY = (canvasHeight / 2) + (window.innerWidth / 7);

  camera.aspect = container.clientWidth / canvasHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, canvasHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  
  //uncomment below for debugging...
  //console.log('it worked!');
  //console.log(container.clientWidth);
}

//{{{{{{{{{{{{{{{{TWEAK CANVAS, CAMERA UPON RESIZE}}}}}}}}}}}}}}}}
function onDocumentMouseMove( event ) {
  //uncomment below for debugging to get mouse position in console...
  //console.log(event.clientX);
  //console.log(event.clientY);
  mouseX = ( event.clientX - windowHalfX );
  mouseY = ( event.clientY - windowHalfY );
}

//{{{{{{{{{{{{ZOOM IN & OUT WITH SCROLL FOR DEBUGGING}}}}}}}}}}}}
//uncomment event listener in 'init()' to use...
function onMouseWheel( event ) {
  //moves camera along z-axis
  camera.position.z += event.deltaY * 0.1; 
}

//{{{{{{{{{{{{{RENDER NEW SCENE EVERYTIME MOUSE MOVES}}}}}}}}}}}}
//mask follows mouse
function render() {
  targetX = mouseX * .0009;
  targetY = mouseY * .0009;
  
  if ( mask ) {
    mask.rotation.y += 0.1 * ( targetX - mask.rotation.y);
    mask.rotation.x += 0.1 * ( targetY - mask.rotation.x );
  }

  if ( mesh ) {
    mesh.rotation.y += 0.1 * ( targetX - mesh.rotation.y);
    mesh.rotation.x += 0.1 * ( targetY - mesh.rotation.x );
  }

  renderer.render( scene, camera );
}

/*
OUT OF SCOPE FOR NOW...
TDOO: rotate head with touch / gyroscope on phone?
*/
