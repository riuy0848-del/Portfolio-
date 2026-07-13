// Mobile nav toggle
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    navToggle.textContent = navLinks.classList.contains('open') ? '✕' : '☰';
  });
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.textContent = '☰';
    });
  });
}

// Reveal on scroll
const revealEls = document.querySelectorAll('.card, .pulse-item, .stat, .value-card, .timeline .row, .program-row');
if ('IntersectionObserver' in window) {
  revealEls.forEach(el => el.style.opacity = '0');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.transition = 'opacity .5s ease, transform .5s ease';
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => {
    el.style.transform = 'translateY(14px)';
    io.observe(el);
  });
}

// Campus image slider
const slider = document.getElementById('campusSlider');
if (slider) {
  const slides = slider.querySelectorAll('.slide');
  const dots = slider.querySelectorAll('.dot');
  const prevBtn = slider.querySelector('.prev');
  const nextBtn = slider.querySelector('.next');
  const slideNum = document.getElementById('slideNum');
  const slideOf = document.getElementById('slideOf');
  let current = 0;
  let timer;

  function goTo(index) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
    if (slideNum) slideNum.textContent = current + 1;
    if (slideOf) slideOf.textContent = String(current + 1).padStart(2, '0') + ' / ' + String(slides.length).padStart(2, '0');
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function startAutoplay() {
    timer = setInterval(next, 5000);
  }
  function resetAutoplay() {
    clearInterval(timer);
    startAutoplay();
  }

  nextBtn.addEventListener('click', () => { next(); resetAutoplay(); });
  prevBtn.addEventListener('click', () => { prev(); resetAutoplay(); });
  dots.forEach(dot => {
    dot.addEventListener('click', () => { goTo(parseInt(dot.dataset.index)); resetAutoplay(); });
  });

  startAutoplay();
}


const chips = document.querySelectorAll('.chip');
const rows = document.querySelectorAll('.program-row');
if (chips.length) {
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const f = chip.dataset.filter;
      rows.forEach(row => {
        row.style.display = (f === 'all' || row.dataset.dept === f) ? 'grid' : 'none';
      });
    });
  });
}

// Live "sheet date" stamp — sets current date in mono footer stamps
document.querySelectorAll('.js-date').forEach(el => {
  el.textContent = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' });
});
