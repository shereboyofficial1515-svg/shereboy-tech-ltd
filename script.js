/**
 * Animation Script for SHEREBOY TECH LTD Website
 * 
 * Integration Instructions:
 * 1. Include this script.js file in your HTML after all content, just before </body>.
 * 2. Ensure your HTML has the following structure/classes (add if missing):
 *    - Hero section: <section id="hero"> with <h1 class="hero-title"> for typing effect.
 *    - Sections: <section class="section"> for fade-up animations.
 *    - Cards: <div class="card"> for slide-in animations (services, projects, blogs, testimonials).
 *    - Sidebar: <nav id="sidebar"> with <button id="sidebar-toggle">.
 *    - Progress bar: Add <div id="scroll-progress"></div> at the top of body.
 *    - Navigation: <nav id="nav"> with <a href="#section-id"> for active highlighting.
 *    - Counters: <div class="counter" data-target="number"> for statistics.
 *    - Buttons: <button class="glow-btn"> for glowing buttons.
 *    - Images: <img class="zoom-img"> for zoom-on-scroll.
 *    - Background: <div class="glow-bg"> for parallax glow.
 *    - Particles: <div id="particles"> for floating particles.
 *    - Testimonial carousel: <div class="testimonial-carousel"> with slides.
 *    - Music cards: <div class="music-card"> with audio elements.
 *    - Form: <form id="contact-form"> with success/error messages.
 *    - WhatsApp button: <a id="whatsapp-float">.
 * 3. For smooth page transitions, add CSS transitions to body or main container.
 * 4. Test on mobile devices and adjust Intersection Observer thresholds if needed.
 * 
 * Extra UI Enhancement Ideas:
 * - Add subtle micro-interactions on hover for all interactive elements.
 * - Implement lazy loading for images to improve performance.
 * - Use CSS custom properties for easy theme color changes.
 * - Add a loading screen with fade-out animation on page load.
 * - Integrate with a CMS for dynamic content updates.
 */

// Inject necessary CSS animations
const css = `
/* Animation Styles */
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slideInLeft {
  from { opacity: 0; transform: translateX(-50px); }
  to { opacity: 1; transform: translateX(0); }
}

@keyframes slideInRight {
  from { opacity: 0; transform: translateX(50px); }
  to { opacity: 1; transform: translateX(0); }
}

@keyframes glowPulse {
  0%, 100% { box-shadow: 0 0 5px rgba(255, 215, 0, 0.5); }
  50% { box-shadow: 0 0 20px rgba(255, 215, 0, 0.8), 0 0 30px rgba(0, 123, 255, 0.4); }
}

@keyframes tiltHover {
  0% { transform: perspective(1000px) rotateX(0) rotateY(0); }
  25% { transform: perspective(1000px) rotateX(-5deg) rotateY(5deg); }
  50% { transform: perspective(1000px) rotateX(5deg) rotateY(-5deg); }
  75% { transform: perspective(1000px) rotateX(-2deg) rotateY(2deg); }
  100% { transform: perspective(1000px) rotateX(0) rotateY(0); }
}

@keyframes zoomIn {
  from { transform: scale(1); }
  to { transform: scale(1.1); }
}

@keyframes parallax {
  from { transform: translateY(0); }
  to { transform: translateY(-20px); }
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

@keyframes typing {
  from { width: 0; }
  to { width: 100%; }
}

@keyframes blink {
  50% { border-color: transparent; }
}

.section {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.section.reveal {
  opacity: 1;
  transform: translateY(0);
}

.card {
  opacity: 0;
  transform: translateX(-50px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.card.reveal {
  opacity: 1;
  transform: translateX(0);
}

.card:nth-child(even) {
  transform: translateX(50px);
}

.card:nth-child(even).reveal {
  transform: translateX(0);
}

.glow-btn {
  transition: box-shadow 0.3s ease;
}

.glow-btn:hover {
  animation: glowPulse 1s infinite;
}

.project-card:hover {
  animation: tiltHover 0.6s ease;
}

.zoom-img {
  transition: transform 0.3s ease;
}

.zoom-img.reveal {
  animation: zoomIn 0.6s ease;
}

.glow-bg {
  animation: parallax 2s ease-in-out infinite alternate;
}

.music-card.playing {
  animation: pulse 1s infinite;
}

#scroll-progress {
  position: fixed;
  top: 0;
  left: 0;
  width: 0%;
  height: 4px;
  background: linear-gradient(90deg, #ffd700, #007bff);
  z-index: 1000;
  transition: width 0.1s ease;
}

#sidebar {
  transform: translateX(-100%);
  transition: transform 0.3s ease;
}

#sidebar.open {
  transform: translateX(0);
}

.hero-title {
  overflow: hidden;
  border-right: 3px solid #ffd700;
  white-space: nowrap;
  animation: typing 3s steps(40, end), blink 0.75s step-end infinite;
}

.counter {
  font-size: 2rem;
  transition: all 0.5s ease;
}

.testimonial-carousel {
  overflow: hidden;
}

.testimonial-slide {
  display: none;
}

.testimonial-slide.active {
  display: block;
  animation: fadeUp 0.6s ease;
}

#particles {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: -1;
}

.particle {
  position: absolute;
  background: rgba(255, 215, 0, 0.1);
  border-radius: 50%;
  animation: float 10s infinite linear;
}

@keyframes float {
  0% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { transform: translateY(-100px) rotate(360deg); opacity: 0; }
}

@media (max-width: 768px) {
  .section, .card {
    transform: translateY(20px);
  }
  .card {
    transform: translateX(0);
  }
}
`;

const style = document.createElement('style');
style.textContent = css;
document.head.appendChild(style);

// Utility functions
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function throttle(func, limit) {
  let inThrottle;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  }
}

// Intersection Observer for reveal animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('reveal');
    }
  });
}, observerOptions);

// Initialize animations on DOM load
document.addEventListener('DOMContentLoaded', () => {
  // Reveal sections
  document.querySelectorAll('.section').forEach(section => observer.observe(section));

  // Reveal cards with stagger
  const cards = document.querySelectorAll('.card');
  cards.forEach((card, index) => {
    observer.observe(card);
    card.style.transitionDelay = `${index * 0.1}s`;
  });

  // Scroll progress indicator
  const progressBar = document.getElementById('scroll-progress');
  if (progressBar) {
    window.addEventListener('scroll', throttle(() => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.body.offsetHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      progressBar.style.width = scrollPercent + '%';
    }, 10));
  }

  // Active navigation highlighting
  const navLinks = document.querySelectorAll('#nav a');
  const sections = document.querySelectorAll('section[id]');
  if (navLinks.length && sections.length) {
    window.addEventListener('scroll', debounce(() => {
      let current = '';
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (pageYOffset >= sectionTop - 60) {
          current = section.getAttribute('id');
        }
      });
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').includes(current)) {
          link.classList.add('active');
        }
      });
    }, 100));
  }

  // Counter animation
  const counters = document.querySelectorAll('.counter');
  counters.forEach(counter => {
    const target = +counter.getAttribute('data-target');
    const increment = target / 200;
    let count = 0;
    const updateCount = () => {
      if (count < target) {
        count += increment;
        counter.innerText = Math.ceil(count);
        requestAnimationFrame(updateCount);
      } else {
        counter.innerText = target;
      }
    };
    observer.observe(counter);
    counter.addEventListener('animationstart', updateCount, { once: true });
  });

  // Sidebar toggle
  const sidebar = document.getElementById('sidebar');
  const toggle = document.getElementById('sidebar-toggle');
  if (sidebar && toggle) {
    toggle.addEventListener('click', () => {
      sidebar.classList.toggle('open');
    });
  }

  // Zoom on scroll for images
  document.querySelectorAll('.zoom-img').forEach(img => observer.observe(img));

  // Parallax glow background
  document.querySelectorAll('.glow-bg').forEach(bg => observer.observe(bg));

  // Testimonial carousel
  const carousel = document.querySelector('.testimonial-carousel');
  if (carousel) {
    const slides = carousel.querySelectorAll('.testimonial-slide');
    let currentSlide = 0;
    const nextSlide = () => {
      slides[currentSlide].classList.remove('active');
      currentSlide = (currentSlide + 1) % slides.length;
      slides[currentSlide].classList.add('active');
    };
    setInterval(nextSlide, 5000);
    slides[0].classList.add('active');
  }

  // Music card pulse
  document.querySelectorAll('.music-card audio').forEach(audio => {
    audio.addEventListener('play', () => {
      audio.closest('.music-card').classList.add('playing');
    });
    audio.addEventListener('pause', () => {
      audio.closest('.music-card').classList.remove('playing');
    });
  });

  // Form animations
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      // Simulate form submission
      const successMsg = document.createElement('div');
      successMsg.textContent = 'Message sent successfully!';
      successMsg.style.cssText = 'color: #344247; animation: fadeUp 0.5s ease;';
      form.appendChild(successMsg);
      setTimeout(() => successMsg.remove(), 3000);
    });
  }

  // Floating particles
  const particlesContainer = document.getElementById('particles');
  if (particlesContainer) {
    for (let i = 0; i < 50; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.width = particle.style.height = Math.random() * 5 + 2 + 'px';
      particle.style.animationDelay = Math.random() * 10 + 's';
      particlesContainer.appendChild(particle);
    }
  }

  // Floating WhatsApp button
  // const whatsappBtn = document.getElementById('whatsapp-float');
  // if (whatsappBtn) {
  //  window.addEventListener('scroll', throttle(() => {
  //    whatsappBtn.style.transform = `translateY(${window.pageYOffset * 0.5}px)`;
  //  }, 10));}

  // Page transitions (basic fade)
  window.addEventListener('beforeunload', () => {
    document.body.style.opacity = '0';
  });
});
const faqSearch = document.getElementById("faq");

// SEARCH FUNCTIONALITY FOR FAQ
const searchInput = document.getElementById("faq");
const faqItems = document.querySelectorAll(".details-content");

searchInput.addEventListener("keyup", function () {

  let searchValue = searchInput.value.toLowerCase();

  faqItems.forEach(function (item) {

    let text = item.innerText.toLowerCase();

    if (text.includes(searchValue)) {
      item.style.display = "block";
    } else {
      item.style.display = "none";
    }

  });

});
// BLOG SEARCH FUNCTIONALITY


// Live search on every keystroke
searchInput?.addEventListener('input', e => filterCards(e.target.value));

// Also support Enter key
searchInput?.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    searchInput.value = '';
    filterCards('');
  }
});
window.addEventListener("load", () => {

  const loader = document.getElementById("loader-wrapper");

  loader.style.opacity = "0";

  setTimeout(() => {
    loader.style.display = "none";
  }, 700);

});

// Performance optimization: Use requestAnimationFrame for heavy animations
// All animations are optimized with CSS transitions and Intersection Observer for lazy loading