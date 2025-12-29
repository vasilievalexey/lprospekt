// Инициализация базовых переменных
let scene, camera, renderer, particles;

// Цвет всех точек — будет медленно меняться
let currentColor = new THREE.Color(1, 0.5, 0.4); // начальный тёплый цвет
let targetColor = getWarmColor(); 
while (targetColor.equals(currentColor)) {
  targetColor = getWarmColor(); // избежать совпадения цветов
}

// Переменные для вращения по движению мышки
let mouseX = 0, mouseY = 0;
let targetX = 0, targetY = 0;
const windowHalf = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

// Слушаем движения мыши
document.addEventListener('mousemove', (event) => {
  mouseX = event.clientX - windowHalf.x;
  mouseY = event.clientY - windowHalf.y;
});

// Запуск сцены
init();
animate();

// Функция инициализации сцены
function init() {
  // Создаём сцену и фон
  scene = new THREE.Scene();
  const bgColor = 0x000000; // общий фон
  scene.background = new THREE.Color(bgColor);
  scene.fog = new THREE.Fog(bgColor, 200, 1000); // лёгкий туман

  // Камера с перспективой
  camera = new THREE.PerspectiveCamera(
    75, window.innerWidth / window.innerHeight, 1, 1000
  );
  camera.position.z = 400;

  // Генерация геометрии для точек
  const geometry = new THREE.BufferGeometry();
  const count = 4000; // количество частиц
  const positions = [];

  for (let i = 0; i < count; i++) {
    positions.push(
      (Math.random() * 2 - 1) * 500,
      (Math.random() * 2 - 1) * 500,
      (Math.random() * 2 - 1) * 500
    );
  }

  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

  // Загружаем текстуру для частиц (маленький диск)
  const sprite = new THREE.TextureLoader().load('js/disc.png');

  // Настройка материала для точек
  const material = new THREE.PointsMaterial({
    size: 12,                     // размер шарика
    map: sprite,                  // текстура круга
    transparent: true,
    opacity: 1.0,                 // мягкость
    depthWrite: false,           // отключаем отрисовку глубины
    blending: THREE.AdditiveBlending, // свечение
    color: currentColor.clone()  // начальный общий цвет
  });

  // Объединяем геометрию и материал
  particles = new THREE.Points(geometry, material);
  scene.add(particles);

  // Рендерер и добавление на страницу
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('background').appendChild(renderer.domElement);

  // Обработка ресайза окна
  window.addEventListener('resize', onWindowResize);
}

// Обработка изменения размеров окна
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// Главный цикл анимации
function animate() {
  requestAnimationFrame(animate);

  // Плавное вращение на основе мышки
  targetX = mouseX * 0.001;
  targetY = mouseY * 0.001;

  particles.rotation.y += 0.001 + (targetX - particles.rotation.y) * 0.05;
  particles.rotation.x += (targetY - particles.rotation.x) * 0.05;

  // Плавный переход к целевому цвету
  currentColor.lerp(targetColor, 0.03); //делает плавный переход между цветами. Чем выше параметр (от 0 до 1), тем быстрее он происходит
  particles.material.color.set(currentColor);

  // Рендер сцены
  renderer.render(scene, camera);
}

// Каждые 5 секунд меняем целевой цвет
setInterval(() => {
  targetColor = getWarmColor();
}, 5000);

// Функция выбора одного из цветов кружков
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
// L PROSPEKT: клик по кастомной кнопке Play
// ============================================
document.addEventListener('DOMContentLoaded', function () {
  const wrapper = document.querySelector('.video-wrapper');
  if (!wrapper) return;

  const thumbnail = wrapper.querySelector('.video-thumbnail');
  const iframe = wrapper.querySelector('iframe');
  if (!thumbnail || !iframe) return;

  const baseSrc = iframe.dataset.src || iframe.getAttribute('data-src');
  if (!baseSrc) return;

  thumbnail.addEventListener('click', function () {
    // Показываем iframe и запускаем видео
    iframe.style.display = 'block';
    iframe.src = baseSrc + (baseSrc.includes('?') ? '&' : '?') + 'autoplay=1';
    thumbnail.style.display = 'none';

    // Примерная длительность видео в миллисекундах (поставь своё значение)
    const VIDEO_DURATION_MS = 69000; // 80 секунд, подгони под длину клипа

    // Через VIDEO_DURATION_MS возвращаемся к чёрному экрану с play
    setTimeout(function () {
      iframe.style.display = 'none';
      iframe.src = ''; // сбросить, чтобы при следующем клике началось с начала
      thumbnail.style.display = 'flex';
    }, VIDEO_DURATION_MS);
  });
});
