console.clear();

/* SETUP */
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  5000
);
camera.position.z = 500;

const renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

/* CONTROLS */
const controlsWebGL = new THREE.OrbitControls(camera, renderer.domElement);

/* TIMELINE */
const tl = gsap.timeline({
  repeat: -1,
  yoyo: true
});

/* 1. HEART PARTICLES */
const path = document.querySelector("path");
const length = path.getTotalLength();
const heartVertices = [];

for (let i = 0; i < length; i += 0.1) {
  const point = path.getPointAtLength(i);
  const vector = new THREE.Vector3(point.x, -point.y, 0);
  vector.x += (Math.random() - 0.5) * 30;
  vector.y += (Math.random() - 0.5) * 30;
  vector.z += (Math.random() - 0.5) * 70;
  
  // تحذيث موضع المركز
  vector.x -= 600 / 2;
  vector.y += 552 / 2;
  
  heartVertices.push(vector);

  tl.from(vector, {
      x: 0,
      y: 0,
      z: 0,
      ease: "power2.inOut",
      duration: "random(2, 5)"
    },
    i * 0.002
  );
}

const heartGeometry = new THREE.BufferGeometry().setFromPoints(heartVertices);
const heartMaterial = new THREE.PointsMaterial({ 
  color: 0xee5282, 
  blending: THREE.AdditiveBlending, 
  size: 3 
});
const heartParticles = new THREE.Points(heartGeometry, heartMaterial);
scene.add(heartParticles);

/* 2. TEXT PARTICLES ("RAWAN") */
function createTextPoints(text) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = 400;
  canvas.height = 200;

  ctx.font = 'Bold 70px Arial';
  ctx.fillStyle = 'white';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  const points = [];

  // أخذ العينات من قماش الرسم (Canvas)
  for (let y = 0; y < canvas.height; y += 3) {
    for (let x = 0; x < canvas.width; x += 3) {
      const alpha = data[(y * canvas.width + x) * 4 + 3];
      if (alpha > 128) {
        // توسيط النقاط داخل منتصف القلب
        const vector = new THREE.Vector3(
          (x - canvas.width / 2) * 1.5,
          -(y - canvas.height / 2) * 1.5,
          (Math.random() - 0.5) * 20
        );
        points.push(vector);
      }
    }
  }
  return points;
}

const textVertices = createTextPoints("RAWAN");
const textGeometry = new THREE.BufferGeometry().setFromPoints(textVertices);
const textMaterial = new THREE.PointsMaterial({
  color: 0xffffff, // لون أبيض ليكون بارزاً داخل القلب
  blending: THREE.AdditiveBlending,
  size: 3.5,
  transparent: true,
  opacity: 0
});

const textParticles = new THREE.Points(textGeometry, textMaterial);
scene.add(textParticles);

/* 3. ANIMATION FOR TEXT FADE IN / OUT */
gsap.to(textMaterial, {
  opacity: 1,
  duration: 2,
  repeat: -1,
  yoyo: true,
  ease: "power2.inOut",
  repeatDelay: 1
});

/* SCENE ROTATION */
gsap.fromTo(scene.rotation, {
  y: -0.2
}, {
  y: 0.2,
  repeat: -1,
  yoyo: true,
  ease: 'power2.inOut',
  duration: 3
});

/* RENDERING */
function render() {
  requestAnimationFrame(render);
  heartGeometry.setFromPoints(heartVertices);
  renderer.render(scene, camera);
}

/* EVENTS */
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener("resize", onWindowResize, false);

requestAnimationFrame(render);