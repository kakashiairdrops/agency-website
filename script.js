// ========================================
// AURA STUDIO — Interactions
// ========================================

const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ========================================
// CUSTOM CURSOR
// ========================================
const cursor = document.getElementById('cursor');
let mx = -100, my = -100, cx = -100, cy = -100;

const hoverTargets = 'a, button, .service, .voice, .join__card, input, select';

if (window.matchMedia('(hover: hover)').matches) {
  window.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
  });

  (function loop() {
    cx += (mx - cx) * 0.16;
    cy += (my - cy) * 0.16;
    cursor.style.left = cx + 'px';
    cursor.style.top = cy + 'px';
    requestAnimationFrame(loop);
  })();

  document.querySelectorAll(hoverTargets).forEach((el) => {
    el.addEventListener('mouseenter', () => cursor.classList.add('is-hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('is-hover'));
  });
}

// ========================================
// NAVBAR SOLID + SCROLL PROGRESS
// ========================================
const nav = document.querySelector('.nav');
const progress = document.getElementById('progress');

function onScroll() {
  const y = window.scrollY;
  nav.classList.toggle('is-solid', y > 40);

  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (y / docHeight) * 100 : 0;
  progress.style.width = pct + '%';
}

window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// ========================================
// MOBILE NAV
// ========================================
const burger = document.getElementById('navBurger');
const navLinks = document.getElementById('navLinks');

burger.addEventListener('click', () => {
  burger.classList.toggle('is-open');
  navLinks.classList.toggle('is-open');
});

navLinks.querySelectorAll('a').forEach((a) => {
  a.addEventListener('click', () => {
    burger.classList.remove('is-open');
    navLinks.classList.remove('is-open');
  });
});

// ========================================
// HERO WORD ROTATION
// ========================================
if (!prefersReduced) {
  const word = document.getElementById('wordRotate');
  if (word) {
    const words = ['craftwork.', 'motion.', 'brands.', 'systems.', 'stories.'];
    let i = 0;
    setInterval(() => {
      i = (i + 1) % words.length;
      word.textContent = words[i];
    }, 2800);
  }
}

// ========================================
// SCROLL REVEAL
// ========================================
const revealItems = document.querySelectorAll('.service, .process__item, .voice, .join__card, .work__item');

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-in');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

revealItems.forEach((el) => revealObserver.observe(el));

// ========================================
// ANIMATED COUNTERS
// ========================================
function animateCounter(el) {
  const target = parseInt(el.dataset.count, 10);
  const suffix = el.dataset.suffix || '';
  const duration = 1600;
  const start = performance.now();

  function frame(now) {
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.floor(eased * target).toLocaleString() + suffix;
    if (p < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);

document.querySelectorAll('.hstat__num[data-count]').forEach((el) => counterObserver.observe(el));

// ========================================
// FAQ ACCORDION
// ========================================
document.querySelectorAll('.faq__item').forEach((item) => {
  const q = item.querySelector('.faq__q');
  const a = item.querySelector('.faq__a');

  q.addEventListener('click', () => {
    const isOpen = item.classList.contains('is-open');

    // close all
    document.querySelectorAll('.faq__item').forEach((other) => {
      other.classList.remove('is-open');
      other.querySelector('.faq__a').style.maxHeight = null;
    });

    if (!isOpen) {
      item.classList.add('is-open');
      a.style.maxHeight = a.scrollHeight + 'px';
    }
  });
});

// ========================================
// NEWSLETTER
// ========================================
function handleNews(e) {
  e.preventDefault();
  const form = e.target;
  const input = form.querySelector('input');
  showToast(`You're on the list${input.value ? ' — ' + input.value : ''}. Speak soon.`);
  form.reset();
}

// ========================================
// BACK TO TOP
// ========================================
const backTop = document.getElementById('backTop');
if (backTop) {
  backTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ========================================
// SCROLL SPY — ACTIVE NAV LINK
// ========================================
const navAnchors = document.querySelectorAll('.nav__links a[href^="#"]');

function setActiveLink(id) {
  navAnchors.forEach((a) => {
    a.classList.toggle('is-active', a.getAttribute('href') === '#' + id);
  });
}

const spySections = ['work', 'services', 'process', 'voices', 'faq', 'join'];
const spyObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.id === 'top' ? 'work' : entry.target.id;
        setActiveLink(id);
      }
    });
  },
  { rootMargin: '-45% 0px -50% 0px' }
);

spySections.forEach((id) => {
  const sec = document.getElementById(id);
  if (sec) spyObserver.observe(sec);
});

// ========================================
// HERO TITLE PARALLAX (subtle tilt on mouse)
// ========================================
if (window.matchMedia('(hover: hover)').matches && !prefersReduced) {
  const heroTitle = document.querySelector('.hero__title');
  const heroStats = document.querySelector('.hero__stats');

  window.addEventListener('mousemove', (e) => {
    const nx = (e.clientX / window.innerWidth - 0.5);
    const ny = (e.clientY / window.innerHeight - 0.5);
    if (heroTitle) {
      heroTitle.style.transform = `translate(${nx * -18}px, ${ny * -10}px)`;
    }
    if (heroStats) {
      heroStats.style.transform = `translate(${nx * 10}px, ${ny * 6}px)`;
    }
  }, { passive: true });
}

// ========================================
// FOOTER BIG TEXT — MARQUEE SCRUB
// ========================================
// (Decorative parallax on footer title)
if (window.matchMedia('(hover: hover)').matches && !prefersReduced) {
  const footerBig = document.querySelector('.footer__big');
  if (footerBig) {
    window.addEventListener('scroll', () => {
      const rect = footerBig.getBoundingClientRect();
      const center = rect.top + rect.height / 2;
      const viewCenter = window.innerHeight / 2;
      const offset = (viewCenter - center) * 0.06;
      footerBig.style.transform = `translateY(${offset}px)`;
    }, { passive: true });
  }
}

// ========================================
// MODAL
// ========================================
const modal = document.getElementById('modal');
const modalClose = document.getElementById('modalClose');
const modalTitle = document.getElementById('modalTitle');
const modalSub = document.getElementById('modalSub');
const skillsBlock = document.getElementById('skillsBlock');

let currentRole = 'hire';

function openModal(role) {
  currentRole = role;
  if (role === 'talent') {
    modalTitle.textContent = 'Join the studio';
    modalSub.textContent = 'Show us your craft — we\u2019ll introduce you to fitting projects.';
    skillsBlock.style.display = 'flex';
  } else {
    modalTitle.textContent = 'Start your project';
    modalSub.textContent = 'Tell us a little about yourself — we\u2019ll reply within a day.';
    skillsBlock.style.display = 'none';
  }
  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

document.querySelectorAll('.join__card').forEach((card) => {
  card.addEventListener('click', () => openModal(card.dataset.role));
});

modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => {
  if (e.target === modal) closeModal();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

// ========================================
// FORM HANDLER
// ========================================
function handleSignup(e) {
  e.preventDefault();
  const nameInput = document.querySelector('#signupForm input[type=text]');
  const name = nameInput ? nameInput.value.trim() : '';
  closeModal();
  showToast(
    currentRole === 'talent'
      ? `Welcome\u2019s ${name || 'there'} — we\u2019ll be in touch about fitting projects.`
      : `Thanks${name ? ', ' + name : ''}! We\u2019ll reply within a day.`
  );
  e.target.reset();
}

// ========================================
// TOAST
// ========================================
let toastTimer;
function showToast(msg) {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toastMsg');
  toastMsg.textContent = msg;
  toast.classList.add('is-show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('is-show'), 4000);
}
