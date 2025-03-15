import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";
import { gsap } from "https://cdn.skypack.dev/gsap";

const camera = new THREE.PerspectiveCamera(
  15,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

camera.position.z = 250;

const scene = new THREE.Scene();
let kharaayo;
let mixer;
const loader = new GLTFLoader();
loader.load(
  "assets/kharaayo.glb",
  function (gltf) {
    kharaayo = gltf.scene;
    scene.add(kharaayo);

    mixer = new THREE.AnimationMixer(kharaayo);
    mixer.clipAction(gltf.animations[0]).play();
    modelMove();
  },
  function (xhr) {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  function (error) {
    console.log("An error happened");
  }
);

const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("3dcontainer").appendChild(renderer.domElement);

const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
scene.add(ambientLight);

const topLight = new THREE.DirectionalLight(0xffffff, 1);
topLight.position.set(500, 500, 500);
scene.add(topLight);

// renderer.render(scene, camera); but this will render only once and will not render any model because it executes before the model is loaded properly
// So we need to use animate function to render the scene continuously
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  if (mixer) {
    mixer.update(0.01); // Update the animation mixer with the time delta between frames to play the animation smoothly
  }
}
animate();

let positionArray = [
  {
    id: "banner",
    position: { x: 0, y: -10, z: 50 },
    rotation: { x: 0, y: -1, z: 0 },
  },
  {
    id: "intro tech",
    position: { x: 30, y: -10, z: -5 },
    rotation: { x: 0, y: 1.5, z: 0 },
  },
  {
    id: "description edu",
    position: { x: -40, y: -10, z: -5 },
    rotation: { x: 0, y: -1.5, z: 0 },
  },
  {
    id: "intro agency",
    position: { x: 30, y: -10, z: -5 },
    rotation: { x: 0, y: 1.5, z: 0 },
  },
  {
    id: "contact",
    position: { x: -5, y: -10, z: 50 },
    rotation: { x: 0.3, y: -0.5, z: 0 },
  },
];

const modelMove = () => {
  const sections = document.querySelectorAll(".section");
  let currentSection = 0;
  sections.forEach((section) => {
    const rect = section.getBoundingClientRect(); // Get the bounding rectangle of the section that means the position of the section in the viewport
    if (
      rect.top <= window.innerHeight / 2 &&
      rect.bottom >= window.innerHeight / 2
    ) {
      currentSection = section.id;
    }
  });

  console.log("currentSection", currentSection);

  let position_active = positionArray.findIndex(
    (val) => val.id == currentSection
  );

  if (position_active >= 0) {
    let new_coordinates = positionArray[position_active];
    gsap.to(kharaayo.position, {
      x: new_coordinates.position.x,
      y: new_coordinates.position.y,
      z: new_coordinates.position.z,
      duration: 3,
      ease: "power1.out",
    });
    gsap.to(kharaayo.rotation, {
      x: new_coordinates.rotation.x,
      y: new_coordinates.rotation.y,
      z: new_coordinates.rotation.z,
      duration: 1,
      ease: "power1.out",
    });
  }
};

window.addEventListener("scroll", () => {
  if (kharaayo) {
    modelMove();
  }
});

window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});
