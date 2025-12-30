// ============================================
// THREE.JS PARTICLE ANIMATION
// ============================================

let scene, camera, renderer, particles;
let currentColor = new THREE.Color(1, 0.5, 0.4);
let targetColor = getWarmColor();

// Ensure different colors
while (targetColor.equals(currentColor)) {
  targetColor = getWarmColor();
}

// Mouse tracking
let mouseX = 0, mouseY = 0;
let targetX = 0, targetY = 0;
const windowHalf = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

document.addEventListener('mousemove', (event) => {
  mouseX = event.clientX - windowHalf.x;
  mouseY = event.clientY - windowHalf.y;
});

// Initialize
init();
animate();

function init() {
  scene = new THREE.Scene();
  const bgColor = 0x000000;
  scene.background = new THREE.Color(bgColor);
  scene.fog = new THREE.Fog(bgColor, 200, 1000);

  camera = new THREE.PerspectiveCamera(
    75, window.innerWidth / window.innerHeight, 1, 1000
  );
  camera.position.z = 400;

  const geometry = new THREE.BufferGeometry();
  const count = 4000;
  const positions = [];

  for (let i = 0; i < count; i++) {
    positions.push(
      (Math.random() * 2 - 1) * 500,
      (Math.random() * 2 - 1) * 500,
      (Math.random() * 2 - 1) * 500
    );
  }

  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

  const sprite = new THREE.TextureLoader().load('js/disc.png');

  const material = new THREE.PointsMaterial({
    size: 12,
    map: sprite,
    transparent: true,
    opacity: 1.0,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    color: currentColor.clone()
  });

  particles = new THREE.Points(geometry, material);
  scene.add(particles);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.getElementById('background').appendChild(renderer.domElement);

  window.addEventListener('resize', onWindowResize);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);

  targetX = mouseX * 0.001;
  targetY = mouseY * 0.001;

  particles.rotation.y += 0.001 + (targetX - particles.rotation.y) * 0.05;
  particles.rotation.x += (targetY - particles.rotation.x) * 0.05;

  currentColor.lerp(targetColor, 0.03);
  particles.material.color.set(currentColor);

  renderer.render(scene, camera);
}

setInterval(() => {
  targetColor = getWarmColor();
}, 5000);

function getWarmColor() {
  const warmColors = [
    new THREE.Color('#2F4A53'),
    new THREE.Color('#CACFA2'),
    new THREE.Color('#A0C7AE'),
    new THREE.Color('#42616D'),
    new THREE.Color('#294350'),
    new THREE.Color('#3E5A65'),
  ];
  return warmColors[Math.floor(Math.random() * warmColors.length)];
}

// ============================================
// VIDEO PLAYER - FIXED FOR MOBILE & SAFARI
// ============================================

document.addEventListener('DOMContentLoaded', function () {
  const wrapper = document.querySelector('.video-wrapper');
  if (!wrapper) return;

  const thumbnail = wrapper.querySelector('.video-thumbnail');
  const playButton = wrapper.querySelector('.play-button');
  const iframe = wrapper.querySelector('iframe');

  if (!thumbnail || !playButton || !iframe) return;

  // Hide iframe initially
  iframe.style.display = 'none';

  const VIDEO_DURATION_MS = 69050; // Уменьшил на 700ms для мобильных
  let resetTimer = null;
  let isPlaying = false;

  function resetVideo() {
    if (!isPlaying) return;
    
    isPlaying = false;
    
    // МГНОВЕННОЕ скрытие без transitions
    iframe.style.display = 'none';
    thumbnail.style.display = 'flex';
    
    // Останавливаем видео после скрытия
    setTimeout(() => {
      try {
        iframe.contentWindow.postMessage(
          '{"event":"command","func":"stopVideo","args":""}',
          '*'
        );
        iframe.src = '';
      } catch (e) {
        console.warn('Could not stop video:', e);
      }
    }, 300);
  }

  function startVideo() {
    if (isPlaying) return;
    
    isPlaying = true;

    if (resetTimer) {
      clearTimeout(resetTimer);
      resetTimer = null;
    }

    // Hide thumbnail first
    thumbnail.style.display = 'none';
    
    // Load iframe if not already loaded
    if (!iframe.src || iframe.src === '') {
      const videoSrc = iframe.getAttribute('data-src');
      iframe.src = videoSrc;
    }
    
    // Show iframe and it will autoplay
    setTimeout(() => {
      iframe.style.display = 'block';
    }, 200);

    // Auto-reset after video duration
    resetTimer = setTimeout(resetVideo, VIDEO_DURATION_MS);
  }

  // Click handlers
  thumbnail.addEventListener('click', startVideo);
  
  playButton.addEventListener('click', function (e) {
    e.stopPropagation();
    startVideo();
  });

  // Listen for YouTube player state changes
  window.addEventListener('message', function(e) {
    if (e.origin !== 'https://www.youtube.com') return;
    
    try {
      const data = JSON.parse(e.data);
      // If video ended (state 0), reset
      if (data.event === 'onStateChange' && data.info === 0) {
        resetVideo();
      }
    } catch (err) {
      // Ignore parsing errors
    }
  });
});