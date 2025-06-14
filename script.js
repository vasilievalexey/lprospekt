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
  const sprite = new THREE.TextureLoader().load('https://threejs.org/examples/textures/sprites/disc.png');

  // Настройка материала для точек
  const material = new THREE.PointsMaterial({
    size: 14,                     // размер шарика
    map: sprite,                  // текстура круга
    transparent: false,
    alphaTest: 0.5,
    opacity: 1.0,                 // мягкость
    depthWrite: true,           // отключаем отрисовку глубины
    blending: THREE.AdditiveBlending, // свечение
    color: currentColor.clone()  // начальный общий цвет
  });

  // Объединяем геометрию и материал
  particles = new THREE.Points(geometry, material);
  scene.add(particles);

  // Рендерер и добавление на страницу
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

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

// Функция выбора одного из тёплых цветов кружков
function getWarmColor() {
  const warmColors = [
    new THREE.Color('#3a5f81'), // тёмно-синий с зеленью
    new THREE.Color('#2a2e45'), // серо-синий
    new THREE.Color('#4f87a2'), // голубовато-синий
    new THREE.Color('#d88c6d'), // оранжево-терракотовый
    new THREE.Color('#e6a14b'), // тусклый жёлто-оранжевый
    new THREE.Color('#bfa46f'), // грязноватый жёлтый
  ];
  return warmColors[Math.floor(Math.random() * warmColors.length)];
}
