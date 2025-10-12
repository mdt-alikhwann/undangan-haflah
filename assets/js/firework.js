const canvas = document.getElementById("fireworks");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

class Firework {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = canvas.height;
    this.targetY = canvas.height * 0.25 + Math.random() * (canvas.height * 0.2);
    this.color = `hsl(${Math.random() * 360}, 100%, 70%)`;
    this.speed = 1.6 + Math.random() * 1;
    this.dx = (Math.random() - 0.5) * 0.6; // 🔹 biar sedikit melengkung
    this.trail = [];
    this.exploded = false;
  }

  update() {
    this.trail.push({ x: this.x, y: this.y });
    if (this.trail.length > 6) this.trail.shift(); // 🔹 jejak pendek
    this.x += this.dx;
    this.y -= this.speed;

    if (this.y <= this.targetY && !this.exploded) {
      this.explode();
      this.exploded = true;
    }
  }

  draw() {
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    for (let i = this.trail.length - 1; i >= 0; i--) {
      const t = this.trail[i];
      ctx.lineTo(t.x, t.y);
    }
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 1; // 🔹 tipis biar gak kayak lidi
    ctx.stroke();
  }

  explode() {
    for (let i = 0; i < 70; i++) {
      particles.push(new Particle(this.x, this.y, this.color));
    }

    // 🔹 Tambahkan percikan jatuh pelan dari ledakan
    for (let i = 0; i < 15; i++) {
      sparks.push(new Spark(this.x, this.y, this.color));
    }
  }
}

class Particle {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.angle = Math.random() * Math.PI * 2;
    this.speed = Math.random() * 2.5 + 0.5; // 🔹 partikel lebih lambat
    this.alpha = 1;
    this.decay = 0.004 + Math.random() * 0.006; // 🔹 opacity memudar perlahan
    this.gravity = 0.02;
  }

  update() {
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed + this.gravity;
    this.alpha -= this.decay;
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = this.alpha * 0.7;
    ctx.beginPath();
    ctx.arc(this.x, this.y, 1, 0, Math.PI * 2); // 🔹 bola kecil
    ctx.fillStyle = this.color;
    ctx.shadowBlur = 12;
    ctx.shadowColor = this.color;
    ctx.fill();
    ctx.restore();
  }
}

// 🔹 Percikan jatuh pelan setelah ledakan
class Spark {
  constructor(x, y, color) {
    this.x = x + (Math.random() - 0.5) * 30;
    this.y = y;
    this.color = color;
    this.speedY = Math.random() * 1 + 0.5;
    this.alpha = 1;
    this.decay = 0.01 + Math.random() * 0.01;
  }

  update() {
    this.y += this.speedY;
    this.alpha -= this.decay;
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = this.alpha * 0.5;
    ctx.beginPath();
    ctx.arc(this.x, this.y, 1, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.restore();
  }
}

let fireworks = [];
let particles = [];
let sparks = [];
let running = false;
let animationFrame;

function animateFireworks() {
  if (!running) return;
  animationFrame = requestAnimationFrame(animateFireworks);

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "rgba(0, 0, 0, 0)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (Math.random() < 0.03) {
    fireworks.push(new Firework());
  }

  fireworks.forEach((f, i) => {
    f.update();
    f.draw();
    if (f.exploded) fireworks.splice(i, 1);
  });

  particles.forEach((p, i) => {
    p.update();
    p.draw();
    if (p.alpha <= 0) particles.splice(i, 1);
  });

  sparks.forEach((s, i) => {
    s.update();
    s.draw();
    if (s.alpha <= 0) sparks.splice(i, 1);
  });
}

// 🔹 Start & Stop
function startFireworks() {
  if (running) return;
  running = true;
  canvas.style.opacity = 1;
  animateFireworks();
}

function stopFireworks() {
  running = false;
  fireworks = [];
  particles = [];
  sparks = [];
  cancelAnimationFrame(animationFrame);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  canvas.style.opacity = 0;
}

// 🎯 AUTO TRIGGER BERDASARKAN DATA-TARGET
const navButtons = document.querySelectorAll(".navbot-btn");

navButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const target = btn.getAttribute("data-target");

    if (target === "8") {
      startFireworks();   // aktifkan di section Wisuda
    } else {
      stopFireworks();    // matikan di section lain
    }
  });
});
