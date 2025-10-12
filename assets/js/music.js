const musicBtn = document.getElementById("musicBtn");
const openBtn = document.getElementById("openBtn");
const music = document.getElementById("bgMusic");
const qrBtn = document.getElementById("qrBtn");
let isMainPlaying = false;

function playMainMusic() {
  music.play();
  musicBtn.className = "bi bi-disc-fill spin";
  isMainPlaying = true;
}

function pauseMainMusic() {
  music.pause();
  musicBtn.className = "bi bi-play-fill";
  isMainPlaying = false;
}

musicBtn.addEventListener("click", () => {
  isMainPlaying ? pauseMainMusic() : playMainMusic();
});

openBtn.addEventListener("click", () => {
  playMainMusic();
  musicBtn.style.display = "inline-block";
  qrBtn.style.display = "inline-block";
});
musicBtn.style.display = "none";

// ===============================
// 🎓 MUSIC WISUDA
// ===============================
const musicWsdTrigger = document.getElementById("mscWisuda");
const musicWisuda = document.getElementById("mscWisudaAudio");
let isWisudaPlaying = false;

function playWisudaMusic() {
  pauseMainMusic(); // matikan musik utama
  musicWisuda.play();
  isWisudaPlaying = true;
}

function pauseWisudaMusic() {
  musicWisuda.pause();
  isWisudaPlaying = false;
}

// ===============================
// 🧭 DETEKSI PERPINDAHAN SECTION
// ===============================
// Misal: semua tombol navigasi bawah punya class `.navbot-btn`
const navButtons = document.querySelectorAll(".navbot-btn");

navButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const target = btn.getAttribute("data-target");

    if (target === "8") {
      // Masuk ke section Wisudawan
      playWisudaMusic();
    } else {
      // Pindah ke section lain
      if (isWisudaPlaying) pauseWisudaMusic();
      if (!isMainPlaying) playMainMusic();
    }
  });
});
