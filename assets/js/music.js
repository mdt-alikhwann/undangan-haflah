    const musicBtn = document.getElementById("musicBtn");
    const openBtn = document.getElementById("openBtn");
    const music = document.getElementById("bgMusic");
    const qrBtn = document.getElementById("qrBtn");
    let isPlaying = false;
    // Fungsi toggle musik

    function toggleMusic() {
        if (isPlaying) {
            music.pause();
            musicBtn.className = "bi bi-play-fill";
        } else {
            music.play();
            musicBtn.className = "bi bi-disc-fill spin";
        }
        isPlaying = !isPlaying;
    }

    // klik tombol musik
    musicBtn.addEventListener("click", toggleMusic);
    openBtn.addEventListener("click", () => {
        toggleMusic();
        musicBtn.style.display = "inline-block";
        qrBtn.style.display = "inline-block";
    });
    musicBtn.style.display = "none";