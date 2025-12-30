// ============================================
// MOVEL - THREE.JS SPRITE ANIMATION
// ============================================

let scene, camera, renderer;
let sprites = [];

init();
animate();

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xffffff); // White background

  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
  camera.position.z = 500;

  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);

  // Canvas is fixed behind content
  renderer.domElement.style.position = "fixed";
  renderer.domElement.style.top = "0";
  renderer.domElement.style.left = "0";
  renderer.domElement.style.zIndex = "-1";

  document.body.appendChild(renderer.domElement);

  const loader = new THREE.TextureLoader();
  const texture = loader.load('/js/sprite.png');

  const material = new THREE.SpriteMaterial({ map: texture, transparent: true });

  // Create 100 sprites with random positions and pulse speeds
  for (let i = 0; i < 100; i++) {
    const sprite = new THREE.Sprite(material.clone());

    sprite.position.set(
      THREE.MathUtils.randFloatSpread(window.innerWidth * 1.5),
      THREE.MathUtils.randFloatSpread(window.innerHeight * 1),
      THREE.MathUtils.randFloatSpread(300)
    );

    const baseScale = THREE.MathUtils.randFloat(40, 40);
    sprite.scale.set(baseScale * 5, baseScale * 5, 1);

    sprite.userData = {
      baseScale,
      pulseSpeed: THREE.MathUtils.randFloat(1, 2),
      phase: Math.random() * Math.PI * 2
    };

    scene.add(sprite);
    sprites.push(sprite);
  }

  window.addEventListener('resize', onWindowResize);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);

  const time = performance.now() * 0.002;

  // Pulse effect for each sprite
  sprites.forEach(sprite => {
    const scale = sprite.userData.baseScale + Math.sin(time * sprite.userData.pulseSpeed + sprite.userData.phase) * 5;
    sprite.scale.set(scale, scale, 1);
  });

  renderer.render(scene, camera);
}