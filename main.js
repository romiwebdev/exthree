// Mobile Menu Toggle
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');

mobileMenuButton.addEventListener('click', () => {
  mobileMenu.classList.toggle('hidden');
});

// Smooth Scroll for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();

    const targetId = this.getAttribute('href');
    const targetElement = document.querySelector(targetId);

    if (targetElement) {
      // Close mobile menu if open
      mobileMenu.classList.add('hidden');

      window.scrollTo({
        top: targetElement.offsetTop - 80,
        behavior: 'smooth'
      });
    }
  });
});

// Back to Top Button
const backToTopButton = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
  if (window.pageYOffset > 300) {
    backToTopButton.classList.remove('opacity-0', 'invisible');
    backToTopButton.classList.add('opacity-100', 'visible');
  } else {
    backToTopButton.classList.remove('opacity-100', 'visible');
    backToTopButton.classList.add('opacity-0', 'invisible');
  }
});

backToTopButton.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

// Scroll Animation with Intersection Observer
const fadeElements = document.querySelectorAll('.fade-in');
const slideUpElements = document.querySelectorAll('.slide-up');

const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      fadeObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

const slideUpObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      slideUpObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

fadeElements.forEach(element => {
  fadeObserver.observe(element);
});

slideUpElements.forEach(element => {
  slideUpObserver.observe(element);
});

// Gallery Data and Configuration
const galeriPerPage = 8;
let currentPageGaleri = 1;

// DOM Elements
const galeriContainer = document.getElementById('galeri-container');
const paginationContainer = document.getElementById('pagination');
const galleryModal = document.getElementById('gallery-modal');
const modalImageContainer = document.getElementById('modal-image-container');
const imageCaption = document.getElementById('image-caption');
const imageIndexDisplay = document.getElementById('image-index');
const closeModalButton = document.getElementById('close-modal');
const prevGalleryButton = document.getElementById('prev-gallery-btn');
const nextGalleryButton = document.getElementById('next-gallery-btn');
const loadMoreButton = document.getElementById('load-more-btn');

let currentImageIndex = 0;

// Initialize Gallery
function initGallery() {
  renderGaleri();
  initModal();
  setupEventListeners();
}

// Render Gallery Items
function renderGaleri() {
  const startIndex = (currentPageGaleri - 1) * galeriPerPage;
  const endIndex = startIndex + galeriPerPage;
  const pageGaleri = galeriData.slice(startIndex, endIndex);

  galeriContainer.innerHTML = '';

  pageGaleri.forEach((item, index) => {
    const galleryItem = document.createElement('div');
    galleryItem.className = 'gallery-item relative rounded-lg overflow-hidden shadow-md cursor-pointer group';
    galleryItem.dataset.index = startIndex + index;

    galleryItem.innerHTML = `
      <img src="${item.src}" alt="${item.alt}" class="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105" />
      <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
        <i class="fas fa-search-plus text-white opacity-0 group-hover:opacity-100 transform scale-90 group-hover:scale-110 transition-all duration-300"></i>
      </div>
    `;

    galeriContainer.appendChild(galleryItem);
  });

  renderPagination();
}

// Render Pagination
function renderPagination() {
  const totalPages = Math.ceil(galeriData.length / galeriPerPage);
  paginationContainer.innerHTML = '';

  for (let i = 1; i <= totalPages; i++) {
    const pageButton = document.createElement('button');
    pageButton.textContent = i;
    pageButton.className = `px-3 py-1 mx-1 rounded-full ${i === currentPageGaleri ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`;
    pageButton.addEventListener('click', () => {
      currentPageGaleri = i;
      renderGaleri();
    });
    paginationContainer.appendChild(pageButton);
  }
}

// Initialize Modal
function initModal() {
  modalImageContainer.innerHTML = '';
  galeriData.forEach((image, index) => {
    const imgWrapper = document.createElement('div');
    imgWrapper.className = 'w-full flex-shrink-0';
    imgWrapper.style.width = '100%';

    const imgElement = document.createElement('img');
    imgElement.src = image.src;
    imgElement.alt = image.alt;
    imgElement.className = 'w-full h-auto mx-auto rounded-lg';
    imgElement.style.maxHeight = '70vh';

    imgWrapper.appendChild(imgElement);
    modalImageContainer.appendChild(imgWrapper);
  });
}

// Update Modal Display
function updateModal() {
  const offset = -currentImageIndex * 100;
  modalImageContainer.style.transform = `translateX(${offset}%)`;
  imageCaption.textContent = galeriData[currentImageIndex].caption;
  imageIndexDisplay.textContent = `${currentImageIndex + 1} / ${galeriData.length}`;
}

// Open Modal
function openModal(index) {
  currentImageIndex = index;
  updateModal();
  galleryModal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

// Close Modal
function closeModal() {
  galleryModal.classList.add('hidden');
  document.body.style.overflow = 'auto';
}

// Setup Event Listeners
function setupEventListeners() {
  // Gallery item click
  galeriContainer.addEventListener('click', (e) => {
    const galleryItem = e.target.closest('.gallery-item');
    if (galleryItem) {
      openModal(parseInt(galleryItem.dataset.index));
    }
  });

  // Modal controls
  closeModalButton.addEventListener('click', closeModal);

  prevGalleryButton.addEventListener('click', () => {
    currentImageIndex = (currentImageIndex - 1 + galeriData.length) % galeriData.length;
    updateModal();
  });

  nextGalleryButton.addEventListener('click', () => {
    currentImageIndex = (currentImageIndex + 1) % galeriData.length;
    updateModal();
  });

  // Close modal when clicking outside
  galleryModal.addEventListener('click', (e) => {
    if (e.target === galleryModal) {
      closeModal();
    }
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!galleryModal.classList.contains('hidden')) {
      if (e.key === 'ArrowLeft') {
        currentImageIndex = (currentImageIndex - 1 + galeriData.length) % galeriData.length;
        updateModal();
      } else if (e.key === 'ArrowRight') {
        currentImageIndex = (currentImageIndex + 1) % galeriData.length;
        updateModal();
      } else if (e.key === 'Escape') {
        closeModal();
      }
    }
  });

  // Load more button
  if (loadMoreButton) {
    loadMoreButton.addEventListener('click', () => {
      const totalPages = Math.ceil(galeriData.length / galeriPerPage);
      if (currentPageGaleri < totalPages) {
        currentPageGaleri++;
        renderGaleri();
      }
    });
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initGallery);


// DAFTAR ANGGOTA KELAS
let currentPage = 1;
const perPage = 8;

function renderSiswa() {
  const container = document.getElementById("siswa-container");
  container.innerHTML = "";

  const start = (currentPage - 1) * perPage;
  const pageData = siswa.slice(start, start + perPage);

  pageData.forEach((s) => {
    const card = document.createElement("div");
    card.className = "bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl";
    card.innerHTML = `
      <div class="${s.color} h-32 flex items-center justify-center">
        <i class="fas fa-user-graduate text-6xl ${s.icon}"></i>
      </div>
      <div class="p-6">
        <h3 class="text-xl font-semibold text-gray-800">${s.nama}</h3>
        <p class="text-gray-600 text-sm mb-2 flex items-center">
          <i class="fas fa-heart text-red-400 mr-2"></i> ${s.hobi}
        </p>
        <p class="text-gray-500 text-sm flex items-start">
          <i class="fas fa-quote-left text-gray-300 mr-2 mt-1 text-xs"></i> ${s.deskripsi}
        </p>
      </div>
    `;
    container.appendChild(card);
  });
}

document.getElementById("prev-btn").addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    renderSiswa();
  }
});

document.getElementById("next-btn").addEventListener("click", () => {
  if (currentPage * perPage < siswa.length) {
    currentPage++;
    renderSiswa();
  }
});

renderSiswa();

function renderPrestasi() {
  const container = document.getElementById('timeline-container');
  const mobileContainer = document.getElementById('timeline-container-mobile');

  // Kosongkan container
  container.innerHTML = '';
  mobileContainer.innerHTML = '';

  prestasiData.forEach((prestasi, index) => {
    const delay = index * 0.15;

    // Render untuk desktop
    const desktopItem = document.createElement('div');
    desktopItem.className = `relative flex ${prestasi.position === 'left' ? 'justify-start' : 'justify-end'} w-full slide-up`;
    desktopItem.style.transitionDelay = `${delay}s`;
    desktopItem.innerHTML = createDesktopItem(prestasi);
    container.appendChild(desktopItem);

    // Render untuk mobile
    const mobileItem = document.createElement('div');
    mobileItem.className = `relative slide-up`;
    mobileItem.style.transitionDelay = `${delay}s`;
    mobileItem.innerHTML = createMobileItem(prestasi, index);
    mobileContainer.appendChild(mobileItem);
  });
}

function createDesktopItem(prestasi) {
  return `
      <div class="w-full md:w-1/2 px-4">
          <div class="${prestasi.color} p-5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 relative group">
              <div class="absolute -top-3 -left-3 w-6 h-6 rounded-full ${prestasi.color} border-4 border-white"></div>
              <div class="flex items-start">
                  <i class="fas ${prestasi.icon} ${prestasi.textColor} text-xl mt-1 mr-3"></i>
                  <div class="flex-1">
                      <h3 class="font-bold ${prestasi.textColor} text-lg">${prestasi.title}</h3>
                      <p class="text-sm text-gray-600 mb-2">${prestasi.level}</p>
                      <div class="space-y-1 text-sm text-gray-600 border-t pt-2 mt-2">
                          ${createDetailItems(prestasi)}
                      </div>
                  </div>
              </div>
          </div>
      </div>
  `;
}

function createMobileItem(prestasi, index) {
  return `
      <div class="relative bg-white rounded-xl shadow-lg overflow-hidden border-l-4 ${prestasi.textColor.replace('text', 'border')}">
          <div class="absolute -left-10 top-5 w-8 h-8 rounded-full ${prestasi.color} flex items-center justify-center text-white">
              <i class="fas ${prestasi.icon}"></i>
          </div>
          <div class="p-4">
              <div class="flex items-center mb-2">
                  <h3 class="font-bold ${prestasi.textColor} text-lg flex-1">${prestasi.title}</h3>
                  <span class="text-xs ${prestasi.textColor} bg-white bg-opacity-30 px-2 py-1 rounded-full">${index + 1}</span>
              </div>
              <p class="text-xs text-gray-500 mb-3">${prestasi.level}</p>
              <div class="space-y-2 text-sm">
                  ${createDetailItems(prestasi, true)}
              </div>
          </div>
      </div>
  `;
}

function createDetailItems(prestasi, isMobile = false) {
  return `
      <div class="flex items-center ${isMobile ? 'text-xs' : ''}">
          <i class="fas ${prestasi.isTeam ? 'fa-users' : 'fa-user'} ${prestasi.iconColor} mr-2 w-4"></i>
          <span>${prestasi.peserta}</span>
      </div>
      <div class="flex items-center ${isMobile ? 'text-xs' : ''}">
          <i class="fas fa-calendar-alt ${prestasi.iconColor} mr-2 w-4"></i>
          <span>${prestasi.date}</span>
      </div>
      <div class="flex ${isMobile ? 'text-xs' : ''}">
          <i class="fas fa-award ${prestasi.iconColor} mt-0.5 mr-2 w-4 flex-shrink-0"></i>
          <span>${prestasi.detail}</span>
      </div>
  `;
}

// Aktifkan animasi saat scroll
function activateAnimations() {
  const prestasiSection = document.getElementById('prestasi');
  const timelineItems = document.querySelectorAll('.timeline-item');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        timelineItems.forEach(item => {
          item.classList.add('visible');
        });
      }
    });
  }, { threshold: 0.1 });

  observer.observe(prestasiSection);
}

document.addEventListener('DOMContentLoaded', () => {
  renderPrestasi();
  activateAnimations();
});


// Panggil fungsi render saat halaman dimuat
document.addEventListener('DOMContentLoaded', () => {
  renderPrestasi();

  // Tambahkan class visible untuk animasi
  setTimeout(() => {
    document.querySelectorAll('.slide-up').forEach(el => {
      el.classList.add('visible');
    });
  }, 100);
});