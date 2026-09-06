/**
 * Portfolio — Interactions & Animations
 * Custom cursor, scroll reveals, nav behavior
 */

(function () {
  'use strict';

  /* ------------------------------------------
     Feature detection & reduced motion
     ------------------------------------------ */
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const isMobile = window.innerWidth <= 768;

  /* ------------------------------------------
     Custom Cursor
     ------------------------------------------ */
  function initCursor() {
    if (prefersReducedMotion || isTouchDevice || isMobile) {
      document.body.classList.add('no-cursor');
      return;
    }

    const cursor = document.querySelector('.cursor');
    const dot = cursor.querySelector('.cursor__dot');
    const ring = cursor.querySelector('.cursor__ring');

    if (!cursor) return;

    let mouseX = 0;
    let mouseY = 0;
    let dotX = 0;
    let dotY = 0;
    let ringX = 0;
    let ringY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    // Hover targets
    const hoverTargets = document.querySelectorAll(
      'a, button, [data-cursor="hover"], .project-card'
    );

    hoverTargets.forEach((el) => {
      el.addEventListener('mouseenter', () => cursor.classList.add('is-hovering'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('is-hovering'));
    });

    document.addEventListener('mousedown', () => cursor.classList.add('is-clicking'));
    document.addEventListener('mouseup', () => cursor.classList.remove('is-clicking'));

    // Hide cursor when leaving viewport
    document.addEventListener('mouseleave', () => {
      cursor.style.opacity = '0';
    });

    document.addEventListener('mouseenter', () => {
      cursor.style.opacity = '1';
    });

    // Smooth lag animation loop
    function animateCursor() {
      // Dot follows closely
      dotX += (mouseX - dotX) * 0.35;
      dotY += (mouseY - dotY) * 0.35;

      // Ring lags behind for elegant feel
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;

      dot.style.left = `${dotX}px`;
      dot.style.top = `${dotY}px`;
      ring.style.left = `${ringX}px`;
      ring.style.top = `${ringY}px`;

      requestAnimationFrame(animateCursor);
    }

    animateCursor();
  }

  /* ------------------------------------------
     Scroll Reveal (Intersection Observer)
     ------------------------------------------ */
  function initScrollReveal() {
    const reveals = document.querySelectorAll('[data-reveal]');

    if (prefersReducedMotion) {
      reveals.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    reveals.forEach((el) => observer.observe(el));

    // Trigger hero reveals immediately on load
    const heroReveals = document.querySelectorAll('.hero [data-reveal]');
    requestAnimationFrame(() => {
      heroReveals.forEach((el) => el.classList.add('is-visible'));
    });
  }

  /* ------------------------------------------
     Sticky Header
     ------------------------------------------ */
  function initHeader() {
    const header = document.getElementById('header');
    if (!header) return;

    let lastScroll = 0;

    function onScroll() {
      const currentScroll = window.scrollY;
      header.classList.toggle('is-scrolled', currentScroll > 50);
      lastScroll = currentScroll;
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ------------------------------------------
     Active Nav Link (scroll spy)
     ------------------------------------------ */
  function initNavSpy() {
    const sections = document.querySelectorAll('section[id], footer[id]');
    const navLinks = document.querySelectorAll('.nav__link');

    if (!sections.length || !navLinks.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinks.forEach((link) => {
              link.classList.toggle(
                'is-active',
                link.getAttribute('href') === `#${id}`
              );
            });
          }
        });
      },
      {
        threshold: 0.3,
        rootMargin: '-80px 0px -50% 0px',
      }
    );

    sections.forEach((section) => observer.observe(section));
  }

  /* ------------------------------------------
     Mobile Navigation
     ------------------------------------------ */
  function initMobileNav() {
    const toggle = document.querySelector('.nav__toggle');
    const menu = document.getElementById('nav-menu');
    const links = menu.querySelectorAll('.nav__link');

    if (!toggle || !menu) return;

    function closeMenu() {
      toggle.setAttribute('aria-expanded', 'false');
      menu.classList.remove('is-open');
      document.body.style.overflow = '';
    }

    toggle.addEventListener('click', () => {
      const isOpen = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!isOpen));
      menu.classList.toggle('is-open');
      document.body.style.overflow = isOpen ? '' : 'hidden';
    });

    links.forEach((link) => {
      link.addEventListener('click', closeMenu);
    });

    // Close on escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMenu();
    });
  }

  /* ------------------------------------------
     Smooth anchor scrolling offset for fixed header
     ------------------------------------------ */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', (e) => {
        const targetId = anchor.getAttribute('href');
        if (targetId === '#') return;

        const target = document.querySelector(targetId);
        if (!target) return;

        e.preventDefault();

        const headerHeight = parseInt(
          getComputedStyle(document.documentElement).getPropertyValue('--header-height'),
          10
        ) || 72;

        const top = target.getBoundingClientRect().top + window.scrollY - headerHeight;

        window.scrollTo({
          top,
          behavior: prefersReducedMotion ? 'auto' : 'smooth',
        });
      });
    });
  }

  /* ------------------------------------------
     Initialize
     ------------------------------------------ */
  function init() {
    initCursor();
    initScrollReveal();
    initHeader();
    initNavSpy();
    initMobileNav();
    initSmoothScroll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
