    (function () {
        const slideEls = Array.from(document.querySelectorAll(".slide"));
        const openBtn = document.getElementById("openBtn");
        const navbot = document.getElementById("navbot");
        const navbotBtns = Array.from(navbot.querySelectorAll(".navbot-btn"));
        const total = slideEls.length;
        const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

        let currentIndex = 0;
        function goTo(index) {
            index = parseInt(index, 10);
            currentIndex = index;
            slideEls.forEach((s) => {
                const isActive = parseInt(s.dataset.index, 10) === index;

                if (isActive) {
                    s.style.display = "flex";
                    requestAnimationFrame(() => s.classList.add("active"));
                } else {
                    if (s.classList.contains("active")) {
                        s.classList.remove("active");
                        s.style.display = "none"; // langsung sembunyikan tanpa menunggu
                    } else {
                        s.style.display = "none"; // pastikan slide non-aktif lainnya juga tersembunyi
                    }
                }
            });

            // update navbot
            navbotBtns.forEach((btn) => {
                const target = parseInt(btn.dataset.target, 10);
                btn.classList.toggle("active", target === index);
            });

            // center scroll navbot
            if (!navbot.classList.contains("hidden")) {
                const activeBtn = navbotBtns.find((b) => parseInt(b.dataset.target, 10) === index);
                if (activeBtn) centernavbotButton(activeBtn);
            }
        }

        function centernavbotButton(btn) {
            const navbotRect = navbot.getBoundingClientRect();
            const btnRect = btn.getBoundingClientRect();
            const btnLeftWithinnavbot = btn.offsetLeft;
            const offset = btnLeftWithinnavbot - (navbot.clientWidth / 2 - btnRect.width / 2);
            const maxLeft = navbot.scrollWidth - navbot.clientWidth;
            const left = clamp(offset, 0, Math.max(0, maxLeft));
            navbot.scrollTo({
                left,
                behavior: "smooth",
            });
        }

        // tombol buka
        openBtn.addEventListener("click", () => {
            // Panggil fullscreen
            if (document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen();
            } else if (document.documentElement.webkitRequestFullscreen) {
                /* Safari */
                document.documentElement.webkitRequestFullscreen();
            } else if (document.documentElement.msRequestFullscreen) {
                /* IE11 */
                document.documentElement.msRequestFullscreen();
            }

            navbot.classList.remove("hidden");
            navbot.classList.add("visible");
            navbot.setAttribute("aria-hidden", "false");
            openBtn.style.display = "none";
            goTo(1);
        });

        // tombol navbot
        navbotBtns.forEach((btn) => {
            btn.addEventListener("click", () => {
                const target = parseInt(btn.dataset.target, 10);
                goTo(target);
            });
        });

        // init
        goTo(0);
        navbot.classList.add("hidden");
        navbot.classList.remove("visible");
        navbot.setAttribute("aria-hidden", "true");_

        // // ✅ auto slide setiap 10 detik
        // setInterval(() => {
        //   if (navbot.classList.contains('hidden')) return; // hanya jalan kalau navbot sudah tampil
        //   const next = currentIndex + 1;
        //   if (next >= total) {
        //     goTo(1); // balik ke awal (slide pertama setelah cover)
        //   } else {
        //     goTo(next);
        //   }
        // }, 10000);
    })();