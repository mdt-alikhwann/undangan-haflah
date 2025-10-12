const galeriData = [
  {
    url: "https://shopee.co.id/inspirasi-shopee/wp-content/uploads/2023/11/lirik-seventeen-jkt48.jpg",
    alt: "Lirik Seventeen - JKT48"
  },
  {
    url: "https://picsum.photos/400/300?random=2",
    alt: "Acara Kenangan Indah"
  },
  {
    url: "https://picsum.photos/400/300?random=3",
    alt: "Momen Bahagia Bersama"
  }
];

// Render galeri otomati9s
const galleryContainer = document.getElementById("galleryContainer");
galleryContainer.innerHTML = galeriData.map((item, index) => `
  <div class="col-6 col-md-4 fade-up duration-${index + 1}">
    <img
      src="${item.url}"
      alt="${item.alt}"
      class="img-fluid rounded shadow-sm gallery-thumb"
      data-bs-toggle="modal"
      data-bs-target="#lightboxModal"
    />
  </div>
`).join("");

// Event handler untuk lightbox
document.addEventListener("click", function (e) {
  const img = e.target.closest("[data-bs-target='#lightboxModal']");
  if (img) {
    e.preventDefault();
    const imgSrc = img.getAttribute("src");
    const caption = img.getAttribute("alt") || "";
    document.getElementById("lightboxImage").src = imgSrc;
    document.getElementById("lightboxCaption").textContent = caption;
  }
});