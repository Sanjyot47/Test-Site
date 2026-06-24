/* ═══════════════════════════════════════════════
   SCRIPT.JS — Sanjyot Portfolio
   ═══════════════════════════════════════════════ */

'use strict';

/* ─────────── 1. SCROLL REVEAL (Intersection Observer) ─────────── */
(function initReveal() {
  const els = document.querySelectorAll('.reveal');

  if (els.length === 0) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal--visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  els.forEach((el) => {
    // Skip hero reveal items (they're visible on load)
    if (el.closest('.hero')) return;
    observer.observe(el);
  });
})();


/* ─────────── 2. NAV SCROLL SHADOW ─────────── */
(function initNavShadow() {
  const nav = document.querySelector('.nav');
  if (!nav) return;

  const onScroll = () => {
    nav.classList.toggle('nav--scrolled', window.scrollY > 50);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // set initial state
})();


/* ─────────── 3. MOBILE MENU TOGGLE ─────────── */
(function initMobileMenu() {
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  const navLinks = document.querySelectorAll('.nav__link');

  if (!toggle || !links) return;

  const open = () => {
    toggle.setAttribute('aria-expanded', 'true');
    links.classList.add('nav__links--open');
    document.body.style.overflow = 'hidden';
  };

  const close = () => {
    toggle.setAttribute('aria-expanded', 'false');
    links.classList.remove('nav__links--open');
    document.body.style.overflow = '';
  };

  toggle.addEventListener('click', () => {
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    isOpen ? close() : open();
  });

  // Close on link click
  navLinks.forEach((link) => {
    link.addEventListener('click', close);
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      close();
    }
  });

  // Close on click outside
  document.addEventListener('click', (e) => {
    if (
      toggle.getAttribute('aria-expanded') === 'true' &&
      !links.contains(e.target) &&
      !toggle.contains(e.target)
    ) {
      close();
    }
  });
})();


/* ─────────── 4. MOUSE-TRACKING GRADIENT ORB ─────────── */
(function initOrb() {
  const orb = document.getElementById('heroOrb');
  if (!orb) return;

  let rafId = null;
  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;

  const onMouseMove = (e) => {
    const rect = orb.parentElement.getBoundingClientRect();
    // Normalize mouse position relative to the hero section
    targetX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    targetY = ((e.clientY - rect.top) / rect.height) * 2 - 1;
  };

  const animate = () => {
    // Smooth interpolation
    currentX += (targetX - currentX) * 0.05;
    currentY += (targetY - currentY) * 0.05;

    const offsetX = currentX * 60;
    const offsetY = currentY * 40;
    orb.style.transform = `translate(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px))`;

    rafId = requestAnimationFrame(animate);
  };

  document.addEventListener('mousemove', onMouseMove, { passive: true });
  animate();

  // Cleanup just in case (though page lifecycle generally handles it)
  window.addEventListener('beforeunload', () => {
    if (rafId) cancelAnimationFrame(rafId);
    document.removeEventListener('mousemove', onMouseMove);
  });
})();


/* ─────────── 5. SMOOTH SCROLL FOR ANCHOR LINKS (progressive enhancement) ─────────── */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      const navHeight = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--nav-height') || 70,
        10
      );

      const targetPos = target.getBoundingClientRect().top + window.scrollY - navHeight;

      window.scrollTo({
        top: targetPos,
        behavior: 'smooth',
      });
    });
  });
})();
