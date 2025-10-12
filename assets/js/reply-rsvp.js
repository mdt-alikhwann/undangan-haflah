    const btnActivate = document.getElementById("btn-activate");
    const btnReply = document.getElementById("btn-reply");
    const PASSWORD = "balesmin";
    btnActivate.addEventListener("click", () => {
        const input = prompt("Masukkan sandi untuk mengaktifkan tombol:");

        if (input === PASSWORD) {
            btnReply.classList.remove("disabled");
            btnReply.removeAttribute("disabled");

            btnActivate.innerHTML = `
            <i class="bi bi-unlock-fill"></i> Tombol aktif`;
            btnActivate.classList.replace("btn-outline-secondary", "btn-outline-success");
            btnActivate.setAttribute("disabled", true); // biar ngga bisa ditekan lagi
        } else {
            alert("Sandi salah, coba lagi!");
        }
    });