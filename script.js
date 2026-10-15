/**
 * Six Thinking Hats: Scenario 2 - Vanilla JavaScript
 * Handles Theme Toggle, Scroll Progress, Scroll Spy, Mobile Navigation,
 * IntersectionObserver Animations, and Back-to-Top Floating Button.
 */

document.addEventListener('DOMContentLoaded', () => {
  // -------------------------------------------------------------------------
  // 1. Theme Management (Light / Dark Mode with System Preference Fallback)
  // -------------------------------------------------------------------------
  const themeToggleBtn = document.getElementById('theme-toggle');
  const storageKey = 'six-hats-theme-preference';

  // Determine initial theme
  function getPreferredTheme() {
    const savedTheme = localStorage.getItem(storageKey);
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme;
    }
    // Default to system setting
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    if (themeToggleBtn) {
      themeToggleBtn.setAttribute(
        'aria-label',
        theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
      );
      themeToggleBtn.setAttribute(
        'title',
        theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
      );
    }
  }

  // Initial application
  let currentTheme = getPreferredTheme();
  applyTheme(currentTheme);

  // Toggle button click listener
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
      localStorage.setItem(storageKey, currentTheme);
      applyTheme(currentTheme);
    });
  }

  // Listen for system theme changes if user hasn't set explicit override
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem(storageKey)) {
        currentTheme = e.matches ? 'dark' : 'light';
        applyTheme(currentTheme);
      }
    });
  }

  // -------------------------------------------------------------------------
  // 2. Scroll Progress Bar & Back to Top Button Visibility
  // -------------------------------------------------------------------------
  const progressBar = document.getElementById('scroll-progress-bar');
  const backToTopBtn = document.getElementById('back-to-top');

  function handleScroll() {
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    const totalDocHeight = document.documentElement.scrollHeight - window.innerHeight;

    // Progress bar width
    if (progressBar && totalDocHeight > 0) {
      const progressPercent = Math.min(100, Math.max(0, (scrollY / totalDocHeight) * 100));
      progressBar.style.width = `${progressPercent}%`;
    }

    // Back to top button visibility threshold (300px)
    if (backToTopBtn) {
      if (scrollY > 300) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  // Initial run
  handleScroll();

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // -------------------------------------------------------------------------
  // 3. Mobile Navigation Menu Toggle
  // -------------------------------------------------------------------------
  const navToggle = document.getElementById('nav-toggle');
  const primaryNav = document.getElementById('primary-nav');
  const navLinks = document.querySelectorAll('.nav-link');

  function openMobileNav() {
    if (navToggle && primaryNav) {
      navToggle.setAttribute('aria-expanded', 'true');
      navToggle.classList.add('open');
      primaryNav.classList.add('open');
      document.body.style.overflow = 'hidden'; // prevent background scrolling
    }
  }

  function closeMobileNav() {
    if (navToggle && primaryNav) {
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.classList.remove('open');
      primaryNav.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  if (navToggle && primaryNav) {
    navToggle.addEventListener('click', () => {
      const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
      if (isOpen) {
        closeMobileNav();
      } else {
        openMobileNav();
      }
    });

    // Close when clicking nav links
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        closeMobileNav();
      });
    });

    // Close with Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && primaryNav.classList.contains('open')) {
        closeMobileNav();
        navToggle.focus();
      }
    });
  }

  // -------------------------------------------------------------------------
  // 4. Scroll Spy Navigation Highlight
  // -------------------------------------------------------------------------
  const sections = [
    { id: 'white-hat', navLink: document.querySelector('.nav-link[data-hat="white"]') },
    { id: 'blue-hat', navLink: document.querySelector('.nav-link[data-hat="blue"]') },
    { id: 'red-hat', navLink: document.querySelector('.nav-link[data-hat="red"]') },
    { id: 'black-hat', navLink: document.querySelector('.nav-link[data-hat="black"]') },
    { id: 'yellow-hat', navLink: document.querySelector('.nav-link[data-hat="yellow"]') },
    { id: 'green-hat', navLink: document.querySelector('.nav-link[data-hat="green"]') },
    { id: 'closing-hat', navLink: document.querySelector('.nav-link[data-hat="conclusion"]') }
  ];

  function updateScrollSpy() {
    const scrollPos = window.scrollY || document.documentElement.scrollTop;
    const navOffset = 110; // offset below sticky header
    const windowBottom = scrollPos + window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    // Check if user has reached bottom of page (highlight conclusion)
    if (windowBottom >= documentHeight - 60) {
      navLinks.forEach((link) => link.classList.remove('active'));
      const conclusionLink = document.querySelector('.nav-link[data-hat="conclusion"]');
      if (conclusionLink) conclusionLink.classList.add('active');
      return;
    }

    let activeSection = null;

    for (let i = 0; i < sections.length; i++) {
      const sectionEl = document.getElementById(sections[i].id);
      if (!sectionEl) continue;

      const top = sectionEl.offsetTop - navOffset;
      const height = sectionEl.offsetHeight;

      if (scrollPos >= top && scrollPos < top + height) {
        activeSection = sections[i];
      }
    }

    navLinks.forEach((link) => link.classList.remove('active'));

    if (activeSection && activeSection.navLink) {
      activeSection.navLink.classList.add('active');
    }
  }

  window.addEventListener('scroll', updateScrollSpy, { passive: true });
  // Initial run
  updateScrollSpy();

  // -------------------------------------------------------------------------
  // 5. Scroll Reveal Animations (IntersectionObserver with Reduced Motion Support)
  // -------------------------------------------------------------------------
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealElements = document.querySelectorAll('.reveal');

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    // If user prefers reduced motion or browser lacks support, reveal all immediately
    revealElements.forEach((el) => el.classList.add('revealed'));
  } else {
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -40px 0px',
      threshold: 0.1
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target); // Reveal only once for performance
        }
      });
    }, observerOptions);

    revealElements.forEach((el) => {
      revealObserver.observe(el);
    });
  }
});
