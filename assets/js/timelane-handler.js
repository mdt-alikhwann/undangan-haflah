// 🔹 Data rundown acara — tinggal ubah isi array ini
const rundownData = [
  { time: "07.30", 
  title: "Registrasi Tamu", 
  desc: "Panitia" },
  
  { time: "08.00", 
  title: "Pembukaan Acara", 
  desc: "MC & Panitia" },
  
  { time: "08.30", 
  title: "Sambutan Ketua Panitia", 
  desc: "Ketua Panitia" },
  
  { time: "09.00", 
  title: "Sambutan Tamu Kehormatan", 
  desc: "Perwakilan Tamu" },
  
  { time: "10.00", 
  title: "Pertunjukan Seni", 
  desc: "Tim Hiburan" },
  
  { time: "11.30", 
  title: "Penutupan & Doa", 
  desc: "MC" }
];

// 🔹 Render otomatis ke dalam container
const timelineContainer = document.getElementById("timelineContainer");

timelineContainer.innerHTML = rundownData
  .map((item, index) => `
    <div class="timeline-item fade-up duration-${index + 1}">
      <div class="time">${item.time}</div>
      <div class="content">
        <h6>${item.title}</h6>
        <p class="font-sedang abu">${item.desc}</p>
      </div>
    </div>
    ${index < rundownData.length - 1 ? '<hr class="hr" />' : ''}
  `)
  .join("");