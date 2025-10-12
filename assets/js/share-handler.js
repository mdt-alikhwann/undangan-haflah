  //share generator
  const generateBtn = document.getElementById('generateShareBtn');
  const nameInput = document.getElementById('shareNameInput');

  generateBtn.addEventListener('click', () => {
    const nama = nameInput.value.trim();
    if (!nama) {
      alert('Nama penerima tidak boleh kosong!');
      return;
    }

    const namaAcara = "Haflah Akhirussanah & Wisuda MDT AL-IKHWAN 2025";
    const baseUrl = "https://mdt-alikhwann.github.io/undangan-haflah";

    const urlParam = `${baseUrl}?nama=${encodeURIComponent(nama)}`;

    // Kalimat ajakan yang lebih indah
    const pesan = `Assalamu'alaikum ${nama} 👋\n\nAyo ikuti dan hadirilah momen bahagia ini ${namaAcara}.\n\nUndangan dan informasi lengkap dapat dilihat melalui klik tautan berikut:\n${urlParam}\n\nKami menantikan kehadiranmu di acara penuh berkah ini 🌿`;

    const waUrl = `https://wa.me/?text=${encodeURIComponent(pesan)}`;
    window.open(waUrl, '_blank');

    const shareModal = bootstrap.Modal.getInstance(document.getElementById('shareModal'));
    shareModal.hide();
    nameInput.value = '';
  });