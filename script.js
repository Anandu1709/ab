// Dark/Light Mode Toggle
const toggleBtn = document.querySelector('.toggle-theme');
const body = document.body;
const THEME_KEY = 'theme-mode';

function setTheme(mode) {
  if (mode === 'dark') {
    body.classList.add('dark');
  } else {
    body.classList.remove('dark');
  }
  localStorage.setItem(THEME_KEY, mode);
}

// Initial theme
const savedTheme = localStorage.getItem(THEME_KEY);
if (savedTheme) setTheme(savedTheme);
else if (window.matchMedia('(prefers-color-scheme: dark)').matches) setTheme('dark');

// Toggle theme on button click
if (toggleBtn) {
  toggleBtn.addEventListener('click', () => {
    const isDark = body.classList.toggle('dark');
    localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light');
  });
}

// Smooth scroll for nav links
const navLinks = document.querySelectorAll('.nav-links a');
navLinks.forEach(link => {
  link.addEventListener('click', e => {
    const href = link.getAttribute('href');
    if (href.startsWith('#')) {
      e.preventDefault();
      document.querySelector(href).scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// Scroll animations
const animatedEls = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right, .fade-in-up');
const observer = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.animationPlayState = 'running';
      entry.target.classList.add('animated');
      obs.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

animatedEls.forEach(el => {
  el.style.animationPlayState = 'paused';
  observer.observe(el);
});

// Section fade-in pop animation
const sectionFades = document.querySelectorAll('.section-fade');
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // Animate skill bars if in skills section
      if (entry.target.classList.contains('skills-section')) {
        const bars = entry.target.querySelectorAll('.skill-bar');
        bars.forEach(bar => {
          const barWidth = bar.style.getPropertyValue('--bar-width');
          if (barWidth && !bar.classList.contains('animated')) {
            bar.classList.add('animated');
            bar.style.width = barWidth;
          }
        });
      }
      sectionObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
sectionFades.forEach(sec => sectionObserver.observe(sec));

// Set all skill bars to width 0 initially
window.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    document.getElementById('loader-bg').classList.add('fade-out');
    setTimeout(() => {
      document.getElementById('loader-bg').style.display = 'none';
    }, 700);
  }, 2200); // Adjust duration for full animation
  document.querySelectorAll('.skill-bar').forEach(bar => {
    bar.style.width = '0%';
  });
});
