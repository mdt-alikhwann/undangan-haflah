  // efek daun
    const leafWrapper = document.getElementById("leaf-wrapper");
    function createLeaf() {
        const leaf = document.createElement("div");
        leaf.classList.add("leaf");
        // Ukuran acak
        const size = 10 + Math.random() * 5;
        leaf.style.width = size + "px";
        leaf.style.height = size + "px";
        leaf.style.left = Math.random() * 100 + "vw";
        leaf.style.top = "0px";

        // Durasi animasi acak
        const duration = 6 + Math.random() * 5;
        leaf.style.animation = `fall3D ${duration}s linear forwards`;
        leafWrapper.appendChild(leaf);
        setTimeout(() => leaf.remove(), duration * 1000);
    }

    // Generate daun tiap 0.3 detik secara acak
    setInterval(() => {
        if (Math.random() > 0.4) createLeaf();
    }, 300);
  