// ============================================
// SEPIIA - THREE.JS SNOWFLAKE ANIMATION
// ============================================

let camera, scene, renderer;
const particlesArr = [];

// Color cycle for gradual transitions
const colorCycle = ['#595235', '#1F1E0C', '#A4391E', '#8A743F', '#F9DD7F', '#605034'];
let currentColorIndex = 0;
let nextColorIndex = 1;
let lerpAmount = 0;
const lerpSpeed = 0.002;

let mouseX = 0, mouseY = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

const textureLoader = new THREE.TextureLoader();
const sprite1 = textureLoader.load('/js/snowflake1.png');
const sprite3 = textureLoader.load('/js/snowflake3.png');
const sprite4 = textureLoader.load('/js/snowflake4.png');
const sprite5 = textureLoader.load('/js/snowflake5.png');

// Snowflake parameters: [color, sprite, size]
const parameters = [
  ['#595235', sprite3, 17],
  ['#1F1E0C', sprite4, 15],
  ['#A4391E', sprite1, 10],
  ['#8A743F', sprite4, 8],
  ['#F9DD7F', sprite5, 5],
  ['#605034', sprite1, 12]
];

init();
animate();

function init() {
  // Camera
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 2000);
  camera.position.z = 1000;

  // Scene with fog
  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x000000, 0.0008);

  // Geometry - points scattered in 3D space
  const geometry = new THREE.BufferGeometry();
  const vertices = [];
  for (let i = 0; i < 5000; i++) {
    vertices.push(
      Math.random() * 2000 - 1000,
      Math.random() * 2000 - 1000,
      Math.random() * 2000 - 1000
    );
  }
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

  // Create snowflakes with different sprites and sizes
  for (let i = 0; i < parameters.length; i++) {
    const [colorHex, sprite, size] = parameters[i];

    const material = new THREE.PointsMaterial({
      size,
      map: sprite,
      blending: THREE.AdditiveBlending,
      depthTest: false,
      transparent: true
    });

    material.color.set(colorHex);

    const particles = new THREE.Points(geometry, material);
    particles.rotation.x = Math.random() * 6;
    particles.rotation.y = Math.random() * 6;
    particles.rotation.z = Math.random() * 6;

    scene.add(particles);
    particlesArr.push(particles);
  }

  // Renderer
  renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  
  const container = document.getElementById('threejs-background');
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 1);
  renderer.setAnimationLoop(animate);
  
  // Ensure canvas doesn't affect layout
  renderer.domElement.style.position = 'fixed';
  renderer.domElement.style.top = '0';
  renderer.domElement.style.left = '0';
  renderer.domElement.style.width = '100%';
  renderer.domElement.style.height = '100%';
  renderer.domElement.style.pointerEvents = 'none';
  
  container.appendChild(renderer.domElement);

  // Event listeners
  document.body.style.touchAction = 'none';
  document.body.addEventListener('pointermove', onPointerMove);
  window.addEventListener('resize', onWindowResize);
}

function onWindowResize() {
  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function onPointerMove(event) {
  if (event.isPrimary === false) return;
  mouseX = event.clientX - windowHalfX;
  mouseY = event.clientY - windowHalfY;
}

function animate() {
  render();
}

function render() {
  const time = Date.now() * 0.00005;

  // Smooth camera movement following mouse
  camera.position.x += (mouseX - camera.position.x) * 0.05;
  camera.position.y += (-mouseY - camera.position.y) * 0.05;
  camera.lookAt(scene.position);

  // Colors for gradual transition
  const color1 = new THREE.Color(colorCycle[currentColorIndex]);
  const color2 = new THREE.Color(colorCycle[nextColorIndex]);

  // Update all snowflake colors
  for (let i = 0; i < particlesArr.length; i++) {
    const particle = particlesArr[i];
    particle.rotation.y = time * (i < 4 ? i + 1 : -(i + 1));
    particle.material.color.copy(color1).lerp(color2, lerpAmount);
  }

  // Gradual color transition
  lerpAmount += lerpSpeed;
  if (lerpAmount >= 1) {
    lerpAmount = 0;
    currentColorIndex = nextColorIndex;
    nextColorIndex = (nextColorIndex + 1) % colorCycle.length;
  }

  renderer.render(scene, camera);
}