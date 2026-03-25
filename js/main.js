/* ── Nav: always opaque ──────────────────────────────── */
const nav = document.querySelector('.site-nav');

/* ── Mobile nav toggle ──────────────────────────────── */
const navToggle = document.querySelector('.nav-toggle');
const mobileMenu = document.querySelector('.mobile-menu');
if (navToggle && mobileMenu) {
  navToggle.addEventListener('click', () => mobileMenu.classList.toggle('open'));
  document.addEventListener('click', (e) => {
    if (!navToggle.contains(e.target) && !mobileMenu.contains(e.target)) {
      mobileMenu.classList.remove('open');
    }
  });
}

/* ── Parallax ───────────────────────────────────────── */
// Disable on mobile/touch devices and iOS (where fixed doesn't work well)
const supportsParallax = !('ontouchstart' in window) && window.innerWidth > 768;

if (supportsParallax) {
  const parallaxEls = document.querySelectorAll('.hero-bg, .cta-banner-bg');
  let ticking = false;

  function runParallax() {
    const scrollY = window.scrollY;
    parallaxEls.forEach(el => {
      const parent = el.parentElement;
      const rect = parent.getBoundingClientRect();
      // Only animate elements near the viewport
      if (rect.bottom < -200 || rect.top > window.innerHeight + 200) return;
      const offset = (scrollY - (scrollY + rect.top)) * 0.35;
      el.style.transform = `translateY(${offset}px)`;
    });
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(runParallax);
      ticking = true;
    }
  }, { passive: true });
  runParallax();
}

/* ── Scroll-triggered fade-up ───────────────────────── */
const fadeSelectors = [
  '.split', '.pricing-card', '.testimonial', '.blog-card',
  '.team-card', '.service-card', '.stat', '.process-item',
  '.practice-card', '.section-title', '.section-subtitle',
  '.pack-desc', '.faq-list', '.contact-grid', '.booking-placeholder'
];
const fadeEls = document.querySelectorAll(fadeSelectors.join(', '));

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger siblings
      const siblings = [...entry.target.parentElement.children].filter(
        c => c.classList.contains('fade-up')
      );
      const idx = siblings.indexOf(entry.target);
      entry.target.style.transitionDelay = `${idx * 80}ms`;
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -48px 0px' });

fadeEls.forEach(el => {
  el.classList.add('fade-up');
  observer.observe(el);
});

/* ── Stats counter animation ────────────────────────── */
function animateCounter(el, target, suffix) {
  const duration = 1400;
  const start = performance.now();
  function tick(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target) + suffix;
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const raw = el.textContent.trim();
    const num = parseInt(raw.replace(/\D/g, ''), 10);
    const suffix = raw.replace(/[\d]/g, '');
    animateCounter(el, num, suffix);
    statObserver.unobserve(el);
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-num').forEach(el => statObserver.observe(el));

/* ── FAQ accordion (animated max-height) ────────────── */
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(el => el.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

/* ── Active nav link ────────────────────────────────── */
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(link => {
  const href = link.getAttribute('href');
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    link.classList.add('active');
  }
});
