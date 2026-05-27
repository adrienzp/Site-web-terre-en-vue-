// Navigation scroll effect
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// Mobile menu
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => navLinks.classList.remove('open'));
});

// Gallery filter
const filterBtns = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    galleryItems.forEach(item => {
      const show = filter === 'all' || item.dataset.category === filter;
      item.classList.toggle('hidden', !show);
    });
  });
});

// Lightbox
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');

let visibleItems = [];
let currentIndex = 0;

function openLightbox(index) {
  visibleItems = [...galleryItems].filter(i => !i.classList.contains('hidden'));
  currentIndex = index;
  showLightboxItem();
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function showLightboxItem() {
  const item = visibleItems[currentIndex];
  if (!item) return;
  const img = item.querySelector('img');
  const cap = item.querySelector('.gallery-caption');
  lightboxImg.src = img.src;
  lightboxImg.alt = img.alt;
  lightboxCaption.textContent = cap ? cap.textContent : '';
}

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

galleryItems.forEach((item, i) => {
  item.addEventListener('click', () => {
    const visible = [...galleryItems].filter(it => !it.classList.contains('hidden'));
    const visIdx = visible.indexOf(item);
    openLightbox(visIdx);
  });
});

lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });

lightboxNext.addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % visibleItems.length;
  showLightboxItem();
});
lightboxPrev.addEventListener('click', () => {
  currentIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length;
  showLightboxItem();
});

document.addEventListener('keydown', e => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowRight') { currentIndex = (currentIndex + 1) % visibleItems.length; showLightboxItem(); }
  if (e.key === 'ArrowLeft') { currentIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length; showLightboxItem(); }
});

// Contact form (simple, no backend — affiche un message)
const contactForm = document.getElementById('contactForm');
const formNote = document.getElementById('formNote');

contactForm.addEventListener('submit', e => {
  e.preventDefault();
  const name = contactForm.name.value.trim();
  const email = contactForm.email.value.trim();
  const message = contactForm.message.value.trim();
  if (!name || !email || !message) {
    formNote.textContent = 'Merci de remplir tous les champs obligatoires.';
    return;
  }
  formNote.textContent = 'Merci pour votre message ! Je vous répondrai dans les plus brefs délais.';
  contactForm.reset();
});

// Intersection Observer — apparition au scroll
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.opacity = '1';
      e.target.style.transform = 'translateY(0)';
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.gallery-item, .intro-grid, .univers-grid, .contact-grid').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
  observer.observe(el);
});
