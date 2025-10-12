    // 🔹 Countdown Timer Elegan
    const targetDate = new Date("2025-12-12T08:00:00").getTime();

    function updateCountdown() {
        const now = new Date().getTime();
        let distance = targetDate - now;
        if (distance < 0) {
            document.getElementById("countdown").innerHTML =
                "<span class='fw-bold text-success'>Acara telah dimulai 🎉</span>";

            return;
        }
        let days = Math.floor(distance / (1000 * 60 * 60 * 24));
        let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((distance % (1000 * 60)) / 1000);
        let html = "";
        if (days > 0) {
            html += `

      <div class="count-box">
        <div class="count-number">${days}</div>
        <div class="count-label">Hari</div>
      </div>`;
        }

        html += `
    <div class="count-box">
      <div class="count-number">${hours}</div>
      <div class="count-label">Jam</div>
    </div>
    <div class="count-box">
      <div class="count-number">${minutes}</div>
      <div class="count-label">Menit</div>
    </div>

    <div class="count-box">
      <div class="count-number">${seconds}</div>
      <div class="count-label">Detik</div>
    </div>`;
        document.getElementById("countdown").innerHTML = html;
    }
    setInterval(updateCountdown, 1000);
    updateCountdown();