  import {
      initializeApp
  } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
  import {
      getDatabase,
      ref,
      push,
      query,
      orderByChild,
      onValue, 
      set,
      runTransaction
  } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-database.js";

  const firebaseConfig = {
      apiKey: "AIzaSyBNM0mRlVcg7NaKoLbKpXchkM9FbLT09h8",
      authDomain: "mdt-alihkwan.firebaseapp.com",
      databaseURL: "https://mdt-alihkwan-default-rtdb.asia-southeast1.firebasedatabase.app",
      projectId: "mdt-alihkwan",
      storageBucket: "mdt-alihkwan.firebasestorage.app",
      messagingSenderId: "984999928991",
      appId: "1:984999928991:web:de038c926a8341e794eeaa"
  };

  const app = initializeApp(firebaseConfig);
  const db = getDatabase(app);

  const rsvpForm = document.getElementById("rsvpForm");
  const rsvpList = document.getElementById("rsvpList");
  const replyForm = document.getElementById("replyForm");
  let currentReplyKey = null; // simpan key yang mau dibalas

  // ==========================================================
// 🔹 Fungsi utilitas umum
// ==========================================================

// Ambil inisial dari nama, max 2 huruf
function getInitials(nama) {
  if (!nama || nama.trim() === "") return "HA"; // default Hamba Allah
  const words = nama.trim().split(" ");
  let initials = words[0].charAt(0).toUpperCase();
  if (words.length > 1) {
    initials += words[1].charAt(0).toUpperCase();
  }
  return initials;
}

// Ambil warna random subtle
function getRandomBg() {
  const colors = [
    "primary-subtle",
    "success-subtle",
    "danger-subtle",
    "warning-subtle",
    "info-subtle",
    "secondary-subtle"
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

  // 🔹 Fungsi format relative time (Indonesia)
  function formatRelativeTime(timestamp) {
      const now = new Date();
      const waktu = new Date(timestamp);
      const diffMs = now - waktu;
      const diffSec = Math.floor(diffMs / 1000);
      const diffMin = Math.floor(diffSec / 60);
      const diffHour = Math.floor(diffMin / 60);
      const diffDay = Math.floor(diffHour / 24);

      if (diffSec < 60) return "baru saja";
      if (diffMin < 60) return `${diffMin} menit lalu`;
      if (diffHour < 24) return `${diffHour} jam lalu`;
      if (diffDay === 1) return `Kemarin ${waktu.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}`;
      if (diffDay < 7) return `${diffDay} hari lalu`;

      return waktu.toLocaleString("id-ID", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit"
      });
  }

  // ==========================================================
  // 🔹 BAGIAN RSVP (ucapan + status hadir) → TIDAK DIUBAH
  // ==========================================================
  rsvpForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const nama = document.getElementById("nama").value;
      const status = document.getElementById("status").value;
      const ucapan = document.getElementById("ucapan").value;
      const jenisKelamin = document.querySelector('input[name="jenisKelamin"]:checked')?.value || "lainnya";

      push(ref(db, "rsvp"), {
          nama,
          status,
          ucapan,
          jenisKelamin,
          waktu: Date.now()
      });

      rsvpForm.reset();
      bootstrap.Modal.getInstance(document.getElementById("rsvpModal")).hide();
  });

  const rsvpQuery = query(ref(db, "rsvp"), orderByChild("waktu"));

onValue(rsvpQuery, (snapshot) => {
  rsvpList.innerHTML = "";
  let dataArr = [];
  let totalUcapan = 0;
  let totalReaction = 0;

  snapshot.forEach((child) => {
    const val = child.val();
    dataArr.push({
      key: child.key,
      ...val
    });
    totalUcapan++; // 🔹 hitung ucapan
  });

      // urutkan terbaru → terlama
      dataArr.reverse();

      dataArr.forEach((data) => {
          let badgeClass = "abu";
          let iconClass = "secondary";
          let icon = "";

          switch (data.status) {
              case "hadir":
                  badgeClass = "ijo";
                  iconClass = "success";
                  icon = `<i class="bi bi-check-circle-fill text-${iconClass}"></i>`;
                  break;
              case "tidak hadir":
                  badgeClass = "merah";
                  iconClass = "danger";
                  icon = `<i class="bi bi-x-circle-fill text-${iconClass}"></i>`;
                  break;
              case "masih bingung":
                  badgeClass = "abu";
                  iconClass = "secondary";
                  icon = `<i class="bi bi-question-circle-fill text-${iconClass}"></i>`;
                  break;
              case "insya Allah":
                  badgeClass = "biru";
                  iconClass = "primary";
                  icon = `<i class="bi bi-hand-thumbs-up-fill text-${iconClass}"></i>`;
                  break;
              default:
                  badgeClass = "abu";
                  iconClass = "secondary";
                  icon = `<i class="bi bi-dash-circle text-${iconClass}"></i>`;
          }


          const waktuTampil = formatRelativeTime(data.waktu);

          const card = `
  <div class="col-md-6 fade-up duration-2">
    <div class="card shadow-sm border-1 bg-${badgeClass}-subtle" 
         style="border-radius:10px;" 
         data-key="${data.key}">
      <div class="card-body px-1 py-2">
        <div class="container">
          <div class="row mb-0">
            <div class="col-2 mb-0 mt-1">
              <div class="foto-icon ms-0 d-flex align-items-center justify-content-center rounded-circle 
            bg-${getRandomBg()} text-dark"
     style="width:35px;height:35px;font-weight:bold;">
  ${getInitials(data.nama || data.munfiq)}
</div>
</div>
            <div class="col-10 text-start">
              <span class="card-title mb-0 fw-bold text-capitalize font-sedang">${data.nama}</span>
              <p class="text-${iconClass} text-capitalize font-kecil">${data.status}</p>
            </div>
          </div>
          <!-- Baris Ucapan -->
          <p class="text-start primary font-normal m-0">"${data.ucapan || "-"}"</p>

<div class="reaction-counts"></div>
<div class="reaction mt-2">
  <div class="emoji-list bg-primary-subtle rounded">
    <span class="emoji" data-emoji="❤️">❤️</span>
    <span class="emoji" data-emoji="😂">😂</span>
    <span class="emoji" data-emoji="😮">😮</span>
    <span class="emoji" data-emoji="😢">😢</span>
    <span class="emoji" data-emoji="👍">👍</span>
    <span class="emoji" data-emoji="🤲">🤲</span>
    <span class="emoji" data-emoji="🙏">🙏</span>
  </div>
</div>
  <!-- Counter jumlah reaction -->
  <div class="reaction-counts"></div>
          <div class="d-flex justify-content-between align-items-center abu">
            <button class="font-normal text-decoration-none btn text-primary border-0 p-0" 
                    data-bs-toggle="modal" data-bs-target="#replyModal">
              <i class="bi bi-reply-fill"></i> Balas
            </button>
            <button type="button" class="font-normal btn btn-reaction text-primary border-0 p-0">
                <i class="bi bi-hand-thumbs-up-fill"></i> Suka
            </button>
            <span class="font-kecil">${waktuTampil}</span>
          </div>
          <!-- Reply (hanya muncul kalau ada) -->
          ${data.reply ? `
            <div class="reply abu font-normal text-start mb-2">
              <p id="reply" class="secondary"><span class="fw-bold">@${data.nama}</span> ${data.reply}</p>
              <small class="font-kecil text-end d-block fst-italic" style="color:#9d9d9d;">- Panitia -</small>
            </div>` : ""}
        </div>
      </div>
    </div>
  </div>
`;
rsvpList.innerHTML += card;
      });

        // 🔹 Hitung total reaction dari path "reactions/rsvp"
  onValue(ref(db, "reactions/rsvp"), (snap) => {
    totalReaction = 0;
    if (snap.exists()) {
      const all = snap.val();
      Object.values(all).forEach(item => {
        Object.values(item).forEach(count => {
          totalReaction += count;
        });
      });
    }

    // 🔹 Tampilkan ringkasan
    document.getElementById("rsvpSummary").textContent =
      `Total Ucapan: ${totalUcapan} | Total Reaction: ${totalReaction}`;
  });
attachReactions("#rsvpList", "rsvp");
  });

  document.addEventListener("click", (e) => {
      if (e.target.closest("[data-bs-target='#replyModal']")) {
          const card = e.target.closest(".card");
          currentReplyKey = card.dataset.key;
      }
  });

  replyForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const replyText = document.getElementById("replyText").value.trim();
      if (!replyText || !currentReplyKey) return;

      const replyRef = ref(db, `rsvp/${currentReplyKey}/reply`);
      set(replyRef, replyText)
          .then(() => {
              bootstrap.Modal.getInstance(document.getElementById("replyModal")).hide();
              replyForm.reset();
          })
          .catch((err) => console.error("Error simpan reply:", err));
  });

// ====================== REACTION EMOJI (paste di sini) ======================
/*
  Pastikan di import firebase-database Anda ada runTransaction:
  import { ..., onValue, set, runTransaction } from ".../firebase-database.js";
*/

const EMOJIS = ["🙂","❤️","😂","😮","😢","👍","🤲","🙏"];

// render counts ke UI (menggunakan urutan EMOJIS)
function renderReactionsCounts(cardEl, data) {
  const countsDiv = cardEl.querySelector(".reaction-counts");
  if (!countsDiv) return;
  countsDiv.innerHTML = "";
  EMOJIS.forEach(emoji => {
    const count = (data && data[emoji]) ? data[emoji] : 0;
    if (count > 0) {
      countsDiv.innerHTML += `<span class="me-1">${emoji} ${count}</span>`;
    }
  });
}

// pastikan ada .emoji-list di dalam card; kalau belum buat otomatis
function ensureEmojiList(cardEl) {
  let list = cardEl.querySelector(".emoji-list");
  if (list) return list;

  list = document.createElement("div");
  list.className = "emoji-list";        // CSS sudah ada dari mas sebelumnya
  list.style.display = "none";

  EMOJIS.forEach(e => {
    const span = document.createElement("span");
    span.className = "emoji";
    span.dataset.emoji = e;
    span.textContent = e;
    list.appendChild(span);
  });

  // coba sisipkan setelah tombol .btn-reaction jika ada, else append ke card-body
  const btn = cardEl.querySelector(".btn-reaction");
  if (btn) btn.insertAdjacentElement("afterend", list);
  else cardEl.querySelector(".card-body")?.appendChild(list) ?? cardEl.appendChild(list);

  return list;
}

// inisialisasi reaction untuk 1 card (tipe: "rsvp" atau "konfirmasi")
function initReactionForCard(cardEl, tipe = "rsvp") {
  if (!cardEl || cardEl.dataset.reactionInit) return;
  const key = cardEl.dataset.key;
  if (!key) return; // kalau nggak ada key, skip

  const btn = cardEl.querySelector(".btn-reaction");
  const list = ensureEmojiList(cardEl);
  const countsDiv = cardEl.querySelector(".reaction-counts");

  // realtime listener untuk seluruh emoji di item ini
  const reactionPath = `reactions/${tipe}/${key}`;
  onValue(ref(db, reactionPath), (snap) => {
    renderReactionsCounts(cardEl, snap.exists() ? snap.val() : {});
  });

  // toggle show/hide (pakai class .show untuk animasi css)
  if (btn) {
    btn.addEventListener("click", (ev) => {
      ev.stopPropagation();
      if (list.classList.contains("show")) {
        list.classList.remove("show");
        setTimeout(() => (list.style.display = "none"), 250);
      } else {
        list.style.display = "flex";
        setTimeout(() => list.classList.add("show"), 10);
      }
    });
  }

  // klik emoji → increment atomik pakai runTransaction
  list.querySelectorAll(".emoji").forEach(el => {
    el.addEventListener("click", (ev) => {
      ev.stopPropagation();
      const emoji = el.dataset.emoji;
      const emojiRef = ref(db, `${reactionPath}/${emoji}`);
      // increment atomik
      runTransaction(emojiRef, (current) => {
        return (current || 0) + 1;
      }).catch(err => console.error("reaction transaction error:", err));

      // tutup list
      list.classList.remove("show");
      setTimeout(() => (list.style.display = "none"), 250);
    });
  });

  cardEl.dataset.reactionInit = "1";
}

// fungsi bantu untuk attach semua card di dalam container (tipe: "rsvp" atau "konfirmasi")
function attachReactions(containerSelector = "#rsvpList", tipe = "rsvp") {
  document.querySelectorAll(`${containerSelector} .card[data-key]`).forEach(card => {
    initReactionForCard(card, tipe);
  });
}
// ================== Listener global sekali saja ==================
document.addEventListener("click", (e) => {
  document.querySelectorAll(".emoji-list.show").forEach(list => {
    // kalau klik bukan di dalam emoji-list dan bukan tombol react
    if (!list.contains(e.target) && !e.target.classList.contains("btn-reaction")) {
      list.classList.remove("show");
      setTimeout(() => (list.style.display = "none"), 250);
    }
  });
});

// ====================== END REACTION EMOJI ======================

  // ==========================================================
  // 🔹 BAGIAN KONFIRMASI (Infaq/Shodaqoh) → TAMBAHAN BARU
  // ==========================================================
  const konfirmasiForm = document.getElementById("konfirmasiForm");
  const konfirmasiList = document.getElementById("konfirmasiList");

  // Fungsi format rupiah
  function formatRupiah(angka) {
      return new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
          minimumFractionDigits: 0
      }).format(angka || 0);
  }

  // Simpan konfirmasi
  konfirmasiForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const munfiq = document.getElementById("munfiq").value || "Hamba Allah";
      const banktujuan = document.getElementById("banktujuan").value;
      const nominal = parseInt(document.getElementById("nominal").value) || 0;

      push(ref(db, "konfirmasi"), {
          munfiq,
          banktujuan,
          nominal,
          waktu: Date.now()
      });

      konfirmasiForm.reset();
      bootstrap.Modal.getInstance(document.getElementById("konfirmasiModal")).hide();

      
    // ✅ Pesan WhatsApp (santai & akrab, 1 paragraf)
    const pesan = `Assalamu'alaikum, saya *${munfiq}*, baru saja transfer infaq Rp ${nominal} ke  ${banktujuan}, mohon dicek ya, semoga bermanfaat 🙏`;

    // ✅ Redirect ke WhatsApp
    const url = `https://wa.me/6285156850068?text=${encodeURIComponent(pesan)}`;
    window.open(url, "_blank");
  });

  // Query konfirmasi
  const konfirmasiQuery = query(ref(db, "konfirmasi"), orderByChild("waktu"));

onValue(konfirmasiQuery, (snapshot) => {
  konfirmasiList.innerHTML = "";
  let dataArr = [];
  let totalNominal = 0; // 🔹 jangan lupa reset dulu setiap kali refresh data

  snapshot.forEach((child) => {
    const val = child.val(); // 🔹 ambil isi child
    dataArr.push({
      key: child.key,
      ...val
    });
                  // 🔹 jumlahkan nominal
        totalNominal += parseInt(val.nominal) || 0;
      });

      dataArr.reverse();

      dataArr.forEach((data) => {
          const waktuTampil = formatRelativeTime(data.waktu);

          const card = `
  <div class="col-md-6 fade-up duration-2">
    <div class="card my-2 shadow-sm border-1 bg-ijo-subtle" data-key="${data.key}" style="border-radius:7px;">
      <div class="card-body p-2">
        <div class="container">
          <div class="row mb-0">
            <div class="col-2 mb-0 mt-1">
              <div class="foto-icon ms-0 d-flex align-items-center justify-content-center rounded-circle 
                          bg-${getRandomBg()} text-dark"
                  style="width:35px;height:35px;font-weight:bold;">
                ${getInitials(data.nama || data.munfiq)}
              </div>
              </div>
            <div class="col-10 text-start">
              <span class="card-title mb-1 fw-bold text-capitalize font-sedang">${data.munfiq}</span>
              <p class="abu text-capitalize font-kecil">${waktuTampil}</p>
            </div>

          </div>
          <p class="text-start abu font-normal m-0">
            Telah mengirimkan Infaq/ Shodaqoh sebesar <span class="fw-bold">${formatRupiah(data.nominal)}</span>
            via ${data.banktujuan}.
          </p>
<div class="reaction-counts"></div>
<div class="reaction mt-2">
  <div class="emoji-list bg-primary-subtle rounded">
    <span class="emoji" data-emoji="❤️">❤️</span>
    <span class="emoji" data-emoji="😂">😂</span>
    <span class="emoji" data-emoji="😮">😮</span>
    <span class="emoji" data-emoji="😢">😢</span>
    <span class="emoji" data-emoji="👍">👍</span>
    <span class="emoji" data-emoji="🤲">🤲</span>
    <span class="emoji" data-emoji="🙏">🙏</span>
  </div>
</div>
            <button type="button" class="font-normal btn btn-reaction text-primary border-0 p-0">
                <i class="bi bi-hand-thumbs-up-fill"></i> Suka
            </button>
        </div>
      </div>
    </div>
  </div>`;
          konfirmasiList.innerHTML += card;
      });
          // 🔹 Update total ke UI
    document.getElementById("totalInfaq").textContent = 
      `${formatRupiah(totalNominal)}`;

          attachReactions("#konfirmasiList", "konfirmasi");
  });

  // TOMBOL BUKA UNDANGAN
  const coverbtn = document.getElementById('openBtn');
  coverbtn.addEventListener('click', function() {
      document.body.style.overflow = 'auto'; // aktifkan scroll
      document.querySelectorAll('section').forEach(sec => {
          sec.style.visibility = 'visible';
          sec.style.opacity = '1';
      });

  });


//carousel 
    const participants = [
      {
        id: 1,
        name: 'Ahmad Fadhil',
        anakdari: 'Bin',
        bin: 'Bpk Tukimin',
        kelas:'kelas ulya', 
        photo: 'putra1.jpg',
        notes: 'Hafalan 5 Juz — Terima kasih atas bimbingan ustadz & ustadzah.'
      },
      {
        id: 2,
        name: 'Nur Aisyah',
        anakdari: 'Binti',
        bin: 'bpk karno',
        kelas:'kelas ulya',
        photo: 'putri.jpg',
        notes: 'Juara 1 Lomba Pidato Arab. Semoga ilmu bermanfaat dunia akhirat.'
      },
      {
        id: 3,
        name: 'Budi Santoso',
        anakdari: 'bin',
        bin: 'bpk bilal',
        kelas:'kelas ulya',
        photo: 'putra2.jpg',
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
  
  //daun2
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
  
  
  //foto overlay 
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const uploadtwb = document.getElementById('uploadtwb');
    const downloadBtn = document.getElementById('download');
    const shareBtn = document.getElementById('share');

    const frame = new Image();
    frame.src = 'twbmdt.png'; // pastikan path benar
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
https://domainmu.com/`;

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          files: [file],
          url: 'https://domainmu.com/',
        });
      } catch (err) {
        console.warn('Share dibatalkan:', err);
      }
    } else {
      // Fallback jika browser tidak mendukung Web Share API dengan file
      const shareUrl = 'https://domainmu.com/';
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
