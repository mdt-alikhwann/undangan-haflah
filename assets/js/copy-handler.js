  // Ambil semua tombol salin
  const salinButtons = document.querySelectorAll('#rekening .btn-outline-secondary');

  salinButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Ambil elemen nomor rekening (teks sebelum tombol)
      const rekeningNumber = button.previousElementSibling.textContent.trim();

      // Salin ke clipboard
      navigator.clipboard.writeText(rekeningNumber).then(() => {
        // Tampilkan alert konfirmasi
        alert(`Nomor rekening ${rekeningNumber} telah disalin ✅`);
      }).catch(err => {
        console.error('Gagal menyalin: ', err);
      });
    });
  });
  