//carousel 
    const participants = [
      {
        id: 1,
        name: 'Ahmad Fadhil',
        anakdari: 'Bin',
        bin: 'Bpk Tukimin',
        kelas:'kelas ulya', 
        photo: 'assets/wisudawan/putra1.jpg',
        notes: 'Hafalan 5 Juz — Terima kasih atas bimbingan ustadz & ustadzah.'
      },
      {
        id: 2,
        name: 'Nur Aisyah',
        anakdari: 'Binti',
        bin: 'bpk karno',
        kelas:'kelas ulya',
        photo: 'assets/wisudawan/putri.jpg',
        notes: 'Juara 1 Lomba Pidato Arab. Semoga ilmu bermanfaat dunia akhirat.'
      },
      {
        id: 3,
        name: 'Budi Santoso',
        anakdari: 'bin',
        bin: 'bpk bilal',
        kelas:'kelas ulya',
        photo: 'assets/wisudawan/putra2.jpg',
        notes: 'Hafalan 10 Juz — Alhamdulillah, jazakumullahu khairan.'
      }
    ];

    let currentIndex = 0;
    let autoSlideInterval;
    const wrapper = document.getElementById('card-wrapper');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const dotsContainer = document.getElementById('dots');

    function renderDots() {
      dotsContainer.innerHTML = '';
      participants.forEach((_, idx) => {
        const dot = document.createElement('div');
        dot.className = 'dot' + (idx === currentIndex ? ' active' : '');
        dot.addEventListener('click', () => goToSlide(idx));
        dotsContainer.appendChild(dot);
      });
    }

    function renderCard(index, animate = true) {
      const p = participants[index];

      if (animate) {
        wrapper.classList.remove('fade-in');
        wrapper.classList.add('fade-out');
        setTimeout(() => {
          updateCardContent(p);
          wrapper.classList.remove('fade-out');
          wrapper.classList.add('fade-in');
        }, 450);
      } else {
        updateCardContent(p);
      }

      renderDots();
    }

    function updateCardContent(p) {
      wrapper.innerHTML = `
        <div class="flip-card">
          <div class="flip-inner">
            <div class="flip-face card-front">
              <img src="${p.photo}" alt="${p.name}">
              <div class="primary font-besar fw-bold text-capitalize">${p.name}</div>
              <div class="abu font-sedang text-capitalize"><span class="font-normal">${p.anakdari}</span></br><span class="font-sedang">${p.bin}</span></div>
            </div>
            <div class="flip-face card-back">
              <h5 class="mb-1 primary font-besar fw-bold text-capitalize">${p.name}</h5>
              <div class="abu mb-2 font-sedang text-capitalize">${p.kelas}</div>
              <div class="font-sedang">${p.notes}</div>
            </div>
          </div>
        </div>
      `;
      const flipCard = wrapper.querySelector('.flip-card');
      flipCard.addEventListener('click', () => {
        flipCard.classList.toggle('is-flipped');
      });
    }

    function showNext() {
      currentIndex = (currentIndex + 1) % participants.length;
      renderCard(currentIndex);
    }

    function showPrev() {
      currentIndex = (currentIndex - 1 + participants.length) % participants.length;
      renderCard(currentIndex);
    }

    function goToSlide(index) {
      currentIndex = index;
      renderCard(currentIndex);
      resetAutoSlide();
    }

    function startAutoSlide() {
      autoSlideInterval = setInterval(showNext, 12000);
    }

    function resetAutoSlide() {
      clearInterval(autoSlideInterval);
      startAutoSlide();
    }

    prevBtn.addEventListener('click', () => {
      showPrev();
      resetAutoSlide();
    });
    nextBtn.addEventListener('click', () => {
      showNext();
      resetAutoSlide();
    });

    renderCard(currentIndex, false);
    renderDots();
    startAutoSlide(); 