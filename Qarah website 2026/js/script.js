const toggle = document.querySelector('.nav-toggle');
const menu = document.querySelector('.nav-list');
const navLinks = document.querySelectorAll('.nav-list a');

if (toggle && menu) {
  toggle.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });
}

if (navLinks.length) {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const currentHash = window.location.hash;

  navLinks.forEach((link) => {
    const href = link.getAttribute('href') || '';
    const [linkPathRaw, linkHash = ''] = href.split('#');
    const linkPath = (linkPathRaw || '').split('/').pop();
    const normalizedLinkHash = linkHash ? `#${linkHash}` : '';

    if (
      (currentPath === 'index.html' && (linkPath === '' || href === '#' || linkPath === 'index.html')) ||
      (linkPath &&
        linkPath === currentPath &&
        (normalizedLinkHash === currentHash || (!normalizedLinkHash && !currentHash)))
    ) {
      navLinks.forEach((item) => item.classList.remove('active'));
      link.classList.add('active');
    }

    link.addEventListener('click', () => {
      navLinks.forEach((item) => item.classList.remove('active'));
      link.classList.add('active');
    });
  });
}

const heroTitle = document.querySelector('.hero-copy h1');
if (heroTitle) {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReducedMotion) {
    const fullText = heroTitle.innerHTML.replace(/<br\s*\/?>/gi, '\n');
    heroTitle.innerHTML = '';
    heroTitle.classList.add('typing-title');

    let charIndex = 0;
    const typeDelay = 80;

    const typeNext = () => {
      const typed = fullText.slice(0, charIndex).replace(/\n/g, '<br>');
      heroTitle.innerHTML = typed;

      if (charIndex < fullText.length) {
        charIndex += 1;
        window.setTimeout(typeNext, typeDelay);
      }
    };

    typeNext();
  }
}

const teamGrid = document.querySelector('.team-grid');
const teamCards = teamGrid ? Array.from(teamGrid.querySelectorAll('.team-card')) : [];
if (teamCards.length) {
  let timers = [];

  const clearTypingTimers = () => {
    timers.forEach((timerId) => window.clearTimeout(timerId));
    timers = [];
  };

  const typeText = (element, text, speed, done) => {
    element.textContent = '';
    let idx = 0;

    const tick = () => {
      element.textContent = text.slice(0, idx);
      if (idx < text.length) {
        idx += 1;
        const timerId = window.setTimeout(tick, speed);
        timers.push(timerId);
      } else if (done) {
        done();
      }
    };

    tick();
  };

  const resetCards = () => {
    clearTypingTimers();
    teamGrid.classList.remove('team-focused');
    teamCards.forEach((card) => {
      card.classList.remove('team-card-expanded', 'team-card-hidden');
      card.setAttribute('aria-expanded', 'false');
      const roleEl = card.querySelector('.team-role');
      const bioEl = card.querySelector('.team-bio');
      if (roleEl) roleEl.textContent = '';
      if (bioEl) bioEl.textContent = '';
    });
  };

  const expandCard = (card) => {
    const isAlreadyExpanded = card.classList.contains('team-card-expanded');
    resetCards();
    if (isAlreadyExpanded) return;

    teamGrid.classList.add('team-focused');
    teamCards.forEach((item) => {
      if (item !== card) item.classList.add('team-card-hidden');
    });

    card.classList.add('team-card-expanded');
    card.setAttribute('aria-expanded', 'true');

    const roleEl = card.querySelector('.team-role');
    const bioEl = card.querySelector('.team-bio');
    const roleText = card.dataset.role || '';
    const bioText = card.dataset.bio || '';

    if (roleEl && bioEl) {
      typeText(roleEl, roleText, 28, () => typeText(bioEl, bioText, 14));
    }
  };

  teamCards.forEach((card) => {
    card.addEventListener('click', () => expandCard(card));
    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        expandCard(card);
      }
    });
  });
}

const animatedSelectors = [
  { selector: '.site-header', direction: 'up' },
  { selector: '.hero-copy', direction: 'left' },
  { selector: '.hero-visual', direction: 'right' },
  { selector: '.hero-actions .btn', direction: 'left' },
  { selector: '.pill', direction: 'right' },
  { selector: '.hash', direction: 'right' },
  { selector: '.scan-card', direction: 'up' },
  { selector: '.brands-title', direction: 'up' },
  { selector: '.brand-card', direction: 'up' },
  { selector: '.process-row', direction: 'up' },
  { selector: '.services-hero h1', direction: 'right' },
  { selector: '.services-grid .service-card:nth-child(odd)', direction: 'left' },
  { selector: '.services-grid .service-card:nth-child(even)', direction: 'right' },
  { selector: '.chair-wrap', direction: 'up' },
  { selector: '.about-hero h1', direction: 'right' },
  { selector: '.about-copy p', direction: 'up' },
  { selector: '.team-card', direction: 'up' },
  { selector: '.contact-hero h1', direction: 'right' },
  { selector: '.contact-form', direction: 'left' },
  { selector: '.contact-info', direction: 'right' },
  { selector: '.portfolio-hero h1', direction: 'right' },
  { selector: '.portfolio-grid .label-single', direction: 'left' },
  { selector: '.portfolio-grid .label-second', direction: 'right' },
  { selector: '.portfolio-grid .label-third', direction: 'left' },
  { selector: '.portfolio-grid .label-fourth', direction: 'right' },
  { selector: '.portfolio-grid .label-fifth', direction: 'left' }
];

const animationTargets = [];
const seenTargets = new Set();

animatedSelectors.forEach(({ selector, direction }) => {
  document.querySelectorAll(selector).forEach((element) => {
    if (!seenTargets.has(element)) {
      seenTargets.add(element);
      animationTargets.push({ element, direction });
    }
  });
});

const currentPath = window.location.pathname.split('/').pop() || 'index.html';
const isHomePage = currentPath === 'index.html' || currentPath === '';
if (isHomePage) {
  let sideIndex = 0;
  animationTargets.forEach((target) => {
    if (target.direction === 'up') {
      target.direction = sideIndex % 2 === 0 ? 'left' : 'right';
      sideIndex += 1;
    }
  });
}

if (animationTargets.length) {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  animationTargets.forEach(({ element, direction }, index) => {
    element.classList.add('reveal');
    element.classList.add(`reveal-${direction}`);
    element.style.setProperty('--reveal-delay', `${(index % 6) * 70}ms`);
  });

  if (prefersReducedMotion) {
    animationTargets.forEach(({ element }) => element.classList.add('in-view'));
  } else {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16, rootMargin: '0px 0px -8% 0px' }
    );

    animationTargets.forEach(({ element }) => observer.observe(element));
  }
}

const experienceCounter = document.querySelector('.exp-number');
if (experienceCounter) {
  const target = 15;
  const duration = 1100;
  const startTime = performance.now();

  const tickCounter = (now) => {
    const progress = Math.min((now - startTime) / duration, 1);
    const value = Math.floor(progress * target);
    experienceCounter.textContent = `${value}+`;

    if (progress < 1) {
      window.requestAnimationFrame(tickCounter);
    } else {
      experienceCounter.textContent = `${target}+`;
    }
  };

  experienceCounter.textContent = '0+';
  window.requestAnimationFrame(tickCounter);
}
