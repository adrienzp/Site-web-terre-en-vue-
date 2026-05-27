// ── Navigation scroll ──
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// ── Mobile menu ──
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');
navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(a =>
  a.addEventListener('click', () => navLinks.classList.remove('open'))
);

// ── Hero parallax — hero text fades & lifts as you scroll ──
const heroContent = document.querySelector('.hero-content');
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  if (y < window.innerHeight && heroContent) {
    heroContent.style.transform = `translateY(${y * 0.14}px)`;
    heroContent.style.opacity   = String(1 - y / (window.innerHeight * 0.75));
  }
}, { passive: true });

// ── Gallery filter ──
const filterBtns   = document.querySelectorAll('.filter-btn');
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

// ── Lightbox ──
const lightbox        = document.getElementById('lightbox');
const lightboxImg     = document.getElementById('lightboxImg');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxClose   = document.getElementById('lightboxClose');
const lightboxPrev    = document.getElementById('lightboxPrev');
const lightboxNext    = document.getElementById('lightboxNext');

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

galleryItems.forEach(item => {
  item.addEventListener('click', () => {
    const visible = [...galleryItems].filter(i => !i.classList.contains('hidden'));
    openLightbox(visible.indexOf(item));
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
  if (e.key === 'Escape')     closeLightbox();
  if (e.key === 'ArrowRight') { currentIndex = (currentIndex + 1) % visibleItems.length; showLightboxItem(); }
  if (e.key === 'ArrowLeft')  { currentIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length; showLightboxItem(); }
});

// ── Contact form ──
const contactForm = document.getElementById('contactForm');
const formNote    = document.getElementById('formNote');
contactForm.addEventListener('submit', e => {
  e.preventDefault();
  const name    = contactForm.name.value.trim();
  const email   = contactForm.email.value.trim();
  const message = contactForm.message.value.trim();
  if (!name || !email || !message) {
    formNote.textContent = 'Merci de remplir tous les champs obligatoires.';
    return;
  }
  formNote.textContent = 'Merci pour votre message ! Je vous répondrai dans les plus brefs délais.';
  contactForm.reset();
});

// ── Animated number counter ──
function animateCounter(el, target, duration = 1400) {
  if (!/^\d+$/.test(target)) return;
  const end   = parseInt(target, 10);
  const start = performance.now();
  (function tick(now) {
    const p     = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(eased * end);
    if (p < 1) requestAnimationFrame(tick);
  })(start);
}

const figureNumbers = document.querySelectorAll('.figure-number');
const counterObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    animateCounter(e.target, e.target.dataset.target);
    counterObs.unobserve(e.target);
  });
}, { threshold: 0.6 });

figureNumbers.forEach(el => {
  el.dataset.target = el.textContent;
  counterObs.observe(el);
});

// ── Section reveals (slide/fade/scale) ──
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('visible');
    revealObs.unobserve(e.target);
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

// ── Gallery stagger reveal ──
const itemArr = [...galleryItems];
itemArr.forEach(item => {
  item.style.opacity   = '0';
  item.style.transform = 'translateY(22px)';
  item.style.transition = 'opacity 0.55s ease, transform 0.55s ease, box-shadow 0.35s ease, border-color 0.35s ease';
});

const galleryObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const idx = itemArr.indexOf(e.target);
    setTimeout(() => {
      e.target.style.opacity   = '1';
      e.target.style.transform = 'none';
    }, (idx % 8) * 70);
    galleryObs.unobserve(e.target);
  });
}, { threshold: 0.06 });

itemArr.forEach(item => galleryObs.observe(item));
