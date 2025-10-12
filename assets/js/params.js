document.addEventListener("DOMContentLoaded", () => {
        const params = new URLSearchParams(window.location.search);
        const namaParam = params.get("nama") || "Tamu Undangan";
        function capitalizeWords(str) {
            return str
                .toLowerCase()
                .split(" ")
                .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                .join(" ");
        }

        const namaTamu = capitalizeWords(namaParam);
        const namaEl = document.getElementById("namatamu");
        if (namaEl) {
            namaEl.textContent = namaTamu;
        }
        // loading + curtain tetap sama

        setTimeout(() => {
            const loading = document.getElementById("loading");
            loading.classList.add("fade-out");
            setTimeout(() => {
                loading.style.display = "none";
                const curtain = document.getElementById("curtain");
                curtain.style.display = "flex";
                requestAnimationFrame(() => {
                    curtain.classList.add("open");
                });
                setTimeout(() => {
                    curtain.style.display = "none";
                }, 1200);
            }, 500);
        }, 1700);

        // 🔹 Modal QR listener

        const qrModalEl = document.getElementById("qrModal");

        qrModalEl.addEventListener("shown.bs.modal", function () {
            const qrContainer = document.getElementById("qrcode");
            qrContainer.innerHTML = "";

            new QRCode(qrContainer, {
                text: namaTamu,
                width: 200,
                height: 200,
            });
            document.getElementById("qrNama").textContent = namaTamu;
            const now = new Date();
            const jam = now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
            const tanggal = now.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
            document.getElementById("qrWaktu").textContent = `${tanggal}, ${jam}`;
        });
    });