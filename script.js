/* ============================================================
   PANTHERA LEO — Lion Educational Website
   JavaScript
   ============================================================ */

(function () {
  'use strict';

  /* ── SCROLL PROGRESS ── */
  const progressBar = document.getElementById('scrollProgress');
  function updateScrollProgress() {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = pct + '%';
  }

  /* ── STICKY NAVBAR ── */
  const navbar = document.getElementById('navbar');
  function handleNavbar() {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  /* ── SCROLL REVEAL ── */
  const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );
  revealEls.forEach((el) => observer.observe(el));

  /* ── DARK / LIGHT MODE TOGGLE ── */
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon   = document.getElementById('themeIcon');
  const html        = document.documentElement;

  function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
    themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
    try { localStorage.setItem('pl-theme', theme); } catch (_) {}
  }

  // Load saved preference
  try {
    const saved = localStorage.getItem('pl-theme');
    if (saved) applyTheme(saved);
  } catch (_) {}

  themeToggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme') || 'dark';
    applyTheme(current === 'dark' ? 'light' : 'dark');
  });

  /* ── HAMBURGER MENU ── */
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  // Close menu on link click
  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  /* ── SMOOTH ANCHOR SCROLL (with offset for fixed nav) ── */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = navbar.offsetHeight + 16;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ── PARALLAX HERO IMAGE ── */
  const heroImg = document.querySelector('.hero-img');
  function parallaxHero() {
    if (!heroImg) return;
    const scrollY = window.scrollY;
    heroImg.style.transform = `scale(1.06) translateY(${scrollY * 0.15}px)`;
  }

  /* ── FACT CARD ENTRANCE STAGGER ── */
  const factCards = document.querySelectorAll('.fact-card');
  const factObserver = new IntersectionObserver(
    (entries, obs) => {
      if (entries.some(e => e.isIntersecting)) {
        factCards.forEach((card, i) => {
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, i * 80);
        });
        obs.disconnect();
      }
    },
    { threshold: 0.1 }
  );
  factCards.forEach((card) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(24px)';
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  });
  if (factCards.length) factObserver.observe(factCards[0].closest('.facts'));

  /* ── STAT CARDS NUMBER COUNT-UP ── */
  function parseNum(str) {
    return parseFloat(str.replace(/[^0-9.]/g, '')) || 0;
  }
  const statNums = document.querySelectorAll('.stat-num');
  let statsDone = false;
  const statsSection = document.querySelector('.about-stats');

  function countUp(el) {
    const raw = el.dataset.target || el.textContent;
    const span = el.querySelector('span');
    const suffix = span ? span.textContent : '';
    const target = parseNum(raw);
    if (!target) return;

    el.dataset.target = raw;
    const isDecimal = raw.includes('.');
    const duration = 1200;
    const steps = 50;
    const increment = target / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current = Math.min(current + increment, target);
      el.innerHTML = (isDecimal ? current.toFixed(1) : Math.floor(current)) + (suffix ? `<span>${suffix}</span>` : '');
      if (step >= steps) clearInterval(timer);
    }, duration / steps);
  }

  if (statsSection) {
    const statsObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !statsDone) {
          statsDone = true;
          statNums.forEach(countUp);
        }
      },
      { threshold: 0.3 }
    );
    statsObserver.observe(statsSection);
  }

  /* ── SCROLL EVENT MASTER ── */
  function onScroll() {
    updateScrollProgress();
    handleNavbar();
    if (window.innerWidth > 768) parallaxHero();
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', handleNavbar, { passive: true });

  // Initial calls
  onScroll();

})();
