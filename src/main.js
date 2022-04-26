import { OrbitControls } from "https://cdn.skypack.dev/three@0.132.2/examples/jsm/controls/OrbitControls.js";
import * as THREE from "https://cdn.skypack.dev/three@0.132.2";

// Création de la scène

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf0f0f0);
const renderer = new THREE.WebGLRenderer();

// Création de la caméra

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  10000
);

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

// Création du plan
// Création de la grille

const gridHelper = new THREE.GridHelper(1000, 20);
scene.add(gridHelper);

const geometry = new THREE.PlaneGeometry(1000, 1000);
geometry.rotateX(-Math.PI / 2);

const plane = new THREE.Mesh(
  geometry,
  new THREE.MeshBasicMaterial({ visible: false })
);
scene.add(plane);

const objects = [];
objects.push(plane);

/////

// Création des controles de caméra

const controls = new OrbitControls(camera, renderer.domElement);
controls.minDistance = 250;
controls.maxDistance = 1000;
controls.enablePan = false;

controls.maxPolarAngle = Math.PI / 2.5;

// Initialisation de la caméra

camera.position.z = 500;
camera.position.y = 250;
camera.lookAt(0, 0, 0);

// Gestion de la cellule ciblée

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

document.addEventListener("pointermove", onPointerMove);
document.addEventListener("pointerdown", onPointerDown);
document.addEventListener("pointerdown", moveCharacter);

const cubeGeo = new THREE.BoxGeometry(50, 50, 50);
const cubeMaterial = new THREE.MeshLambertMaterial({
  color: 0xfeb74c,
  map: new THREE.TextureLoader().load("src/assets/Brick_Block.webp"),
});

const rollOverGeo = new THREE.BoxGeometry(50, 1, 50);
rollOverGeo.translate(0, -25, 0);
const rollOverMaterial = new THREE.MeshBasicMaterial({
  color: 0xff0000,
  opacity: 0.5,
  transparent: true,
});
const rollOverMesh = new THREE.Mesh(rollOverGeo, rollOverMaterial);
scene.add(rollOverMesh);

// Déplacement du personnage

function moveCharacter(event) {
    
}

// Affichage au survol

function onPointerMove(event) {
  pointer.set(
    (event.clientX / window.innerWidth) * 2 - 1,
    -(event.clientY / window.innerHeight) * 2 + 1
  );

  raycaster.setFromCamera(pointer, camera);

  const intersects = raycaster.intersectObjects(objects, false);

  if (intersects.length > 0) {
    const intersect = intersects[0];

    rollOverMesh.position.copy(intersect.point).add(intersect.face.normal);
    rollOverMesh.position
      .divideScalar(50)
      .floor()
      .multiplyScalar(50)
      .addScalar(25);

    render();
  }
}

// Ajout d'un objet au clic

function onPointerDown(event) {
  pointer.set(
    (event.clientX / window.innerWidth) * 2 - 1,
    -(event.clientY / window.innerHeight) * 2 + 1
  );

  raycaster.setFromCamera(pointer, camera);

  const intersects = raycaster.intersectObjects(objects, false);

  if (intersects.length > 0) {
    const intersect = intersects[0];

    const voxel = new THREE.Mesh(cubeGeo, cubeMaterial);
    voxel.position.copy(intersect.point).add(intersect.face.normal);
    voxel.position.divideScalar(50).floor().multiplyScalar(50).addScalar(25);
    scene.add(voxel);

    objects.push(voxel);

    render();
  }
}

// Lumière

const ambientLight = new THREE.AmbientLight(0x606060);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff);
directionalLight.position.set(1, 0.75, 0.5).normalize();
scene.add(directionalLight);

function render() {
  // update the picking ray with the camera and pointer position
  raycaster.setFromCamera(pointer, camera);

  // calculate objects intersecting the picking ray
  const intersects = raycaster.intersectObjects(scene.children);

  for (let i = 0; i < intersects.length; i++) {
    intersects[i].object.material.color.set(0xff0000);
  }

  renderer.render(scene, camera);
}

window.requestAnimationFrame(render);

function animate() {
  requestAnimationFrame(animate);

  // required if controls.enableDamping or controls.autoRotate are set to true

  renderer.render(scene, camera);
}

animate();
