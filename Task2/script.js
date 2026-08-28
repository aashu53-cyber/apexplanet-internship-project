document.addEventListener('DOMContentLoaded', () => {

  /* --- 1. Mobile Hamburger Menu Toggle --- */
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
  }

  /* --- 2. Dark/Light Mode Toggle with LocalStorage --- */
  const themeToggleBtn = document.getElementById('themeToggle');
  const currentTheme = localStorage.getItem('theme') || 'light';

  if (currentTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    if (themeToggleBtn) themeToggleBtn.textContent = '☀️ Light Mode';
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      let theme = document.documentElement.getAttribute('data-theme');
      if (theme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
        themeToggleBtn.textContent = '🌙 Dark Mode';
      } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        themeToggleBtn.textContent = '☀️ Light Mode';
      }
    });
  }

  /* --- 3. Back to Top Button --- */
  const backToTopBtn = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      backToTopBtn.style.display = 'block';
    } else {
      backToTopBtn.style.display = 'none';
    }
  });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* --- 4. Image Slider / Carousel --- */
  let slideIndex = 0;
  const slides = document.querySelectorAll('.carousel-slide');

  function showSlide(index) {
    if (!slides.length) return;
    slides.forEach(slide => slide.classList.remove('active'));
    if (index >= slides.length) slideIndex = 0;
    if (index < 0) slideIndex = slides.length - 1;
    slides[slideIndex].classList.add('active');
  }

  window.moveSlide = function(n) {
    showSlide(slideIndex += n);
  };

  if (slides.length > 0) {
    showSlide(slideIndex);
    setInterval(() => {
      slideIndex++;
      showSlide(slideIndex);
    }, 4000);
  }

  /* --- 5. Modal Popup Controls --- */
  const modalTrigger = document.getElementById('modalTrigger');
  const modalOverlay = document.getElementById('modalOverlay');
  const modalClose = document.getElementById('modalClose');

  if (modalTrigger && modalOverlay) {
    modalTrigger.addEventListener('click', () => {
      modalOverlay.classList.add('open');
    });

    const closeModal = () => modalOverlay.classList.remove('open');

    if (modalClose) modalClose.addEventListener('click', closeModal);

    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });
  }

  /* --- 6. Real-Time Form Validation --- */
  const form = document.getElementById('contactForm');
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const phoneInput = document.getElementById('phone');

  function setError(input, message) {
    input.classList.remove('success');
    input.classList.add('error');
    const errorDiv = input.nextElementSibling;
    if (errorDiv && errorDiv.classList.contains('error-message')) {
      errorDiv.textContent = message;
      errorDiv.style.display = 'block';
    }
  }

  function setSuccess(input) {
    input.classList.remove('error');
    input.classList.add('success');
    const errorDiv = input.nextElementSibling;
    if (errorDiv && errorDiv.classList.contains('error-message')) {
      errorDiv.style.display = 'none';
    }
  }

  if (nameInput) {
    nameInput.addEventListener('keyup', () => {
      if (nameInput.value.trim().length < 3) {
        setError(nameInput, 'Name must be at least 3 characters long.');
      } else {
        setSuccess(nameInput);
      }
    });
  }

  if (emailInput) {
    emailInput.addEventListener('keyup', () => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailInput.value.trim())) {
        setError(emailInput, 'Please enter a valid email address.');
      } else {
        setSuccess(emailInput);
      }
    });
  }

  if (phoneInput) {
    phoneInput.addEventListener('keyup', () => {
      const phoneRegex = /^[0-9]{10}$/;
      if (!phoneRegex.test(phoneInput.value.trim())) {
        setError(phoneInput, 'Please enter a valid 10-digit phone number.');
      } else {
        setSuccess(phoneInput);
      }
    });
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (nameInput.classList.contains('success') && 
          emailInput.classList.contains('success') && 
          phoneInput.classList.contains('success')) {
        alert('Form submitted successfully!');
        form.reset();
        [nameInput, emailInput, phoneInput].forEach(inp => inp.classList.remove('success'));
      } else {
        alert('Please fill out all fields correctly before submitting.');
      }
    });
  }

  /* --- 7. Animated Counters & Manual Increment/Decrement Controls --- */
  const statsSection = document.getElementById('statsSection');
  const counters = document.querySelectorAll('.counter');
  let animated = false;

  function runCounters() {
    counters.forEach(counter => {
      const target = +counter.getAttribute('data-target');
      let count = 0;
      const speed = Math.max(target / 40, 1);
      
      const updateCount = () => {
        count += speed;
        if (count < target) {
          counter.textContent = Math.ceil(count);
          setTimeout(updateCount, 25);
        } else {
          counter.textContent = target;
        }
      };
      updateCount();
    });
  }

  if (statsSection) {
    const observer = new IntersectionObserver((entries, observerInstance) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !animated) {
          runCounters();
          animated = true;
          observerInstance.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    observer.observe(statsSection);
  }

  // Manual increase / decrease button functionality
  const counterCards = document.querySelectorAll('.counter-card');
  counterCards.forEach(card => {
    const counterDisplay = card.querySelector('.counter');
    const increaseBtn = card.querySelector('.increase-btn');
    const decreaseBtn = card.querySelector('.decrease-btn');

    if (increaseBtn && decreaseBtn && counterDisplay) {
      increaseBtn.addEventListener('click', () => {
        let currentValue = parseInt(counterDisplay.textContent) || 0;
        counterDisplay.textContent = currentValue + 1;
      });

      decreaseBtn.addEventListener('click', () => {
        let currentValue = parseInt(counterDisplay.textContent) || 0;
        if (currentValue > 0) {
          counterDisplay.textContent = currentValue - 1;
        }
      });
    }
  });

});