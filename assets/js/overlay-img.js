  //foto overlay 
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const uploadtwb = document.getElementById('uploadtwb');
    const downloadBtn = document.getElementById('download');
    const shareBtn = document.getElementById('share');

    const frame = new Image();
    frame.src = 'assets/img/twbmdt.webp'; // pastikan path benar
    let frameReady = false;
    frame.onload = () => { frameReady = true; draw(); };

    let userImg = null;
    let imgX = 0, imgY = 0;
    let imgScale = 1;
    let imgRotation = 0;
    let original = {};

    uploadtwb.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const img = new Image();
        img.onload = () => {
          userImg = img;
          imgScale = Math.max(canvas.width / img.width, canvas.height / img.height);
          imgRotation = 0;
          imgX = canvas.width / 2;
          imgY = canvas.height / 2;
          original = { imgScale, imgRotation, imgX, imgY };
          draw();
        };
        img.src = ev.target.result;
      };
      reader.readAsDataURL(file);
    });

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (userImg) {
        ctx.save();
        ctx.translate(imgX, imgY);
        ctx.rotate(imgRotation);
        ctx.scale(imgScale, imgScale);
        ctx.drawImage(userImg, -userImg.width / 2, -userImg.height / 2);
        ctx.restore();
      }

      if (frameReady) {
        ctx.drawImage(frame, 0, 0, canvas.width, canvas.height);
      }
    }

    // --- DESKTOP DRAG ---
    let isDragging = false;
    let startX = 0, startY = 0;
    canvas.addEventListener('mousedown', (e) => {
      if (!userImg) return;
      isDragging = true;
      startX = e.offsetX - imgX;
      startY = e.offsetY - imgY;
    });
    canvas.addEventListener('mousemove', (e) => {
      if (isDragging) {
        imgX = e.offsetX - startX;
        imgY = e.offsetY - startY;
        draw();
      }
    });
    canvas.addEventListener('mouseup', () => isDragging = false);
    canvas.addEventListener('mouseleave', () => isDragging = false);
    canvas.addEventListener('wheel', (e) => {
      if (!userImg) return;
      e.preventDefault();
      const factor = e.deltaY < 0 ? 1.05 : 0.95;
      imgScale *= factor;
      draw();
    });

    // --- TOUCH GESTURE ---
    let lastTouchDist = null;
    let lastTouchAngle = null;
    let isTouchDragging = false;
    let touchStartX = 0, touchStartY = 0;

    canvas.addEventListener('touchstart', (e) => {
      if (!userImg) return;
      if (e.touches.length === 1) {
        isTouchDragging = true;
        touchStartX = e.touches[0].clientX - imgX;
        touchStartY = e.touches[0].clientY - imgY;
      } else if (e.touches.length === 2) {
        isTouchDragging = false;
        lastTouchDist = getTouchDistance(e.touches);
        lastTouchAngle = getTouchAngle(e.touches);
      }
    });

    canvas.addEventListener('touchmove', (e) => {
      if (!userImg) return;
      e.preventDefault();

      if (e.touches.length === 1 && isTouchDragging) {
        imgX = e.touches[0].clientX - touchStartX;
        imgY = e.touches[0].clientY - touchStartY;
        draw();
      } else if (e.touches.length === 2) {
        const newDist = getTouchDistance(e.touches);
        const newAngle = getTouchAngle(e.touches);

        if (lastTouchDist) {
          imgScale *= newDist / lastTouchDist;
        }
        if (lastTouchAngle !== null) {
          imgRotation += (newAngle - lastTouchAngle);
        }

        lastTouchDist = newDist;
        lastTouchAngle = newAngle;
        draw();
      }
    });

    canvas.addEventListener('touchend', () => {
      lastTouchDist = null;
      lastTouchAngle = null;
      isTouchDragging = false;
    });

    function getTouchDistance(touches) {
      const dx = touches[0].clientX - touches[1].clientX;
      const dy = touches[0].clientY - touches[1].clientY;
      return Math.sqrt(dx * dx + dy * dy);
    }

    function getTouchAngle(touches) {
      const dx = touches[1].clientX - touches[0].clientX;
      const dy = touches[1].clientY - touches[0].clientY;
      return Math.atan2(dy, dx);
    }

    // --- DOWNLOAD ---
    downloadBtn.addEventListener('click', () => {
      const link = document.createElement('a');
      link.download = 'Haflah & Wisuda MDT AL-IKHWAN.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    });


  // --- BAGIKAN ---
  shareBtn.addEventListener('click', async () => {
    const dataUrl = canvas.toDataURL('image/png');
    const blob = await (await fetch(dataUrl)).blob();
    const file = new File([blob], 'Haflah & Wisuda MDT AL-IKHWAN.png', { type: 'image/png' });

    const shareTitle = 'Haflah & Wisuda Santri MDT Al-Ikhwan Margasari';
    const shareText = `🌿✨ Yuk rayakan momen istimewa Haflah & Wisuda Santri MDT Al-Ikhwan Margasari! 
Saya sudah pasang overlay foto, giliran kamu sekarang 😍📸
Buka undangannya di sini 👇
https://mdt-alikhwann.github.io/undangan-haflah`;

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          files: [file],
          url: 'https://mdt-alikhwann.github.io/undangan-haflah',
        });
      } catch (err) {
        console.warn('Share dibatalkan:', err);
      }
    } else {
      // Fallback jika browser tidak mendukung Web Share API dengan file
      const shareUrl = 'https://mdt-alikhwann.github.io/undangan-haflah';
      const fallbackText = `${shareText}\n\n${shareUrl}`;
      if (navigator.share) {
        try {
          await navigator.share({
            title: shareTitle,
            text: fallbackText,
            url: shareUrl,
          });
        } catch (err) {
          console.warn('Share dibatalkan:', err);
        }
      } else {
        alert('Browser tidak mendukung fitur bagikan langsung. Silakan download manual.');
      }
    }

  });