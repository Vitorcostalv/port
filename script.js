const docEl = document.documentElement;
const root = document.documentElement;
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const storedTheme = localStorage.getItem('vc-theme');

const applyTheme = (theme) => {
  const next = theme || (prefersDark.matches ? 'dark' : 'light');
  root.setAttribute('data-theme', next);
  document.body.dataset.theme = next;
  localStorage.setItem('vc-theme', next);
  const toggle = document.querySelector('.theme-toggle');
  if (toggle) toggle.setAttribute('aria-pressed', String(next === 'dark'));
};

applyTheme(storedTheme);

prefersDark.addEventListener('change', (event) => {
  // só segue o sistema se não houver tema salvo
  if (!localStorage.getItem('vc-theme')) {
    applyTheme(event.matches ? 'dark' : 'light');
  }
});

document.querySelector('.theme-toggle')?.addEventListener('click', () => {
  const current = root.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  applyTheme(next);
});

// Navigation toggle
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav__links');

navToggle?.addEventListener('click', () => {
  const expanded = navToggle.getAttribute('aria-expanded') === 'true';
  navToggle.setAttribute('aria-expanded', String(!expanded));
  navLinks?.classList.toggle('is-open');
});

navLinks?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navToggle?.setAttribute('aria-expanded', 'false');
    navLinks.classList.remove('is-open');
  });
});

// Scroll progress bar
const progressBar = document.querySelector('.progress-bar');
const updateProgress = () => {
  const scrollTop = window.scrollY;
  const docHeight = docEl.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  if (progressBar) progressBar.style.width = `${progress}%`;
};
window.addEventListener('scroll', updateProgress, { passive: true });
updateProgress();

// Ripple effect
const createRipple = (event) => {
  const button = event.currentTarget;
  const rect = button.getBoundingClientRect();
  const ripple = document.createElement('span');
  const size = Math.max(rect.width, rect.height);
  ripple.className = 'ripple';
  ripple.style.width = ripple.style.height = `${size}px`;
  ripple.style.left = `${event.clientX - rect.left - size / 2}px`;
  ripple.style.top = `${event.clientY - rect.top - size / 2}px`;
  button.appendChild(ripple);
  setTimeout(() => ripple.remove(), 600);
};
document.querySelectorAll('[data-ripple]').forEach((button) => {
  button.addEventListener('click', createRipple);
});

// Hero ticker
const tickerRoot = document.querySelector('.hero__ticker');
if (tickerRoot) {
  const textEl = tickerRoot.querySelector('.hero__ticker-text');
  const terms = (tickerRoot.dataset.terms || '')
    .split('|')
    .map((term) => term.trim())
    .filter(Boolean);
  let termIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let tickerTimer;

  const setTickerText = (value) => {
    if (textEl) textEl.textContent = value;
  };

  function runTicker() {
    if (!textEl || prefersReducedMotion.matches || terms.length <= 1) return;
    const current = terms[termIndex] || '';
    if (!isDeleting) {
      charIndex = Math.min(charIndex + 1, current.length);
      setTickerText(current.slice(0, charIndex));
      if (charIndex === current.length) {
        isDeleting = true;
        scheduleTicker(1500);
        return;
      }
    } else {
      charIndex = Math.max(charIndex - 1, 0);
      setTickerText(current.slice(0, charIndex));
      if (charIndex === 0) {
        isDeleting = false;
        termIndex = (termIndex + 1) % terms.length;
        scheduleTicker(320);
        return;
      }
    }
    scheduleTicker(isDeleting ? 65 : 110);
  }

  function scheduleTicker(delay = 0) {
    window.clearTimeout(tickerTimer);
    tickerTimer = window.setTimeout(runTicker, delay);
  }

  function resetTicker() {
    window.clearTimeout(tickerTimer);
    if (!textEl || terms.length === 0) return;
    if (prefersReducedMotion.matches || terms.length === 1) {
      setTickerText(terms[0]);
      return;
    }
    termIndex = 0;
    charIndex = 0;
    isDeleting = false;
    setTickerText('');
    scheduleTicker(160);
  }

  resetTicker();

  prefersReducedMotion.addEventListener('change', () => {
    resetTicker();
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      window.clearTimeout(tickerTimer);
    } else if (!prefersReducedMotion.matches && terms.length > 1) {
      scheduleTicker(260);
    }
  });
}

// Hero tilt effect
const heroTiltCard = document.querySelector('.hero__profile-card[data-tilt]');
if (heroTiltCard) {
  const layers = heroTiltCard.querySelectorAll('[data-depth]');
  let tiltAttached = false;

  const applyTilt = (event) => {
    const rect = heroTiltCard.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    const rotateX = (0.5 - y) * 12;
    const rotateY = (x - 0.5) * 12;
    heroTiltCard.style.setProperty('--tilt-rotate-x', `${rotateX.toFixed(2)}deg`);
    heroTiltCard.style.setProperty('--tilt-rotate-y', `${rotateY.toFixed(2)}deg`);

    layers.forEach((layer) => {
      const depth = Number(layer.dataset.depth) || 1;
      const translateX = (x - 0.5) * depth * 14;
      const translateY = (y - 0.5) * depth * 14;
      layer.style.transform = `translate3d(${translateX}px, ${translateY}px, ${depth * 5}px)`;
    });
  };

  const resetTilt = () => {
    heroTiltCard.style.setProperty('--tilt-rotate-x', '0deg');
    heroTiltCard.style.setProperty('--tilt-rotate-y', '0deg');
    layers.forEach((layer) => {
      layer.style.transform = 'translate3d(0, 0, 0)';
    });
  };

  const attachTilt = () => {
    if (tiltAttached) return;
    heroTiltCard.addEventListener('pointermove', applyTilt);
    heroTiltCard.addEventListener('pointerleave', resetTilt);
    heroTiltCard.addEventListener('pointerup', resetTilt);
    tiltAttached = true;
  };

  const detachTilt = () => {
    if (!tiltAttached) return;
    heroTiltCard.removeEventListener('pointermove', applyTilt);
    heroTiltCard.removeEventListener('pointerleave', resetTilt);
    heroTiltCard.removeEventListener('pointerup', resetTilt);
    tiltAttached = false;
    resetTilt();
  };

  if (!prefersReducedMotion.matches) {
    attachTilt();
  }

  prefersReducedMotion.addEventListener('change', (event) => {
    if (event.matches) {
      detachTilt();
    } else {
      attachTilt();
    }
  });
}

// Intersection reveal animations
const revealElements = document.querySelectorAll('[data-reveal]');
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.2 }
);
revealElements.forEach((el) => observer.observe(el));

// Counters
const counters = document.querySelectorAll('.counter');
const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const valueEl = el.querySelector('.counter__value');
        const target = Number(el.dataset.target) || 0;
        const duration = 1600;
        const start = performance.now();

        const step = (now) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased =
            progress < 0.5
              ? 4 * progress * progress * progress
              : (progress - 1) * (2 * progress - 2) * (2 * progress - 2) + 1;
          if (valueEl) valueEl.textContent = Math.round(target * eased);
          if (progress < 1) requestAnimationFrame(step);
        };

        requestAnimationFrame(step);
        counterObserver.unobserve(el);
      }
    });
  },
  { threshold: 0.35 }
);
counters.forEach((counter) => counterObserver.observe(counter));

// Results timeline tabs
const timelinePanel = document.querySelector('.results-panel--timeline');
if (timelinePanel) {
  const tabButtons = timelinePanel.querySelectorAll('.results-tab');
  const chartRanges = timelinePanel.querySelectorAll('.chart-range');
  const stats = timelinePanel.querySelectorAll('.results-panel__stat');
  const badges = timelinePanel.querySelectorAll('.results-panel__badge');

  const updateRange = (range) => {
    if (!range) return;
    timelinePanel.dataset.activeRange = range;
    tabButtons.forEach((tab) => {
      const isActive = tab.dataset.range === range;
      tab.classList.toggle('is-active', isActive);
      tab.setAttribute('aria-selected', String(isActive));
    });
    chartRanges.forEach((group) => {
      const isActive = group.dataset.range === range;
      group.classList.toggle('is-active', isActive);
      group.setAttribute('aria-hidden', String(!isActive));
    });
    stats.forEach((stat) => {
      const isActive = stat.dataset.range === range;
      stat.hidden = !isActive;
    });
    badges.forEach((badge) => {
      const isActive = badge.dataset.range === range;
      badge.hidden = !isActive;
    });
  };

  updateRange(timelinePanel.dataset.activeRange || '30d');

  tabButtons.forEach((tab) => {
    tab.addEventListener('click', (event) => {
      event.preventDefault();
      updateRange(tab.dataset.range);
    });
    tab.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        updateRange(tab.dataset.range);
      }
    });
  });
}

// Stack & skills
const stackGrid = document.querySelector('.stack__grid');
const stackPanel = document.querySelector('.stack__panel');
const stackDetails = stackPanel?.querySelector('.stack__details');

const skills = [
  { name: 'HTML & CSS', category: 'frontend', description: 'Layout responsivo (grid 12 col), tokens e acessibilidade.', proof: 'Landing pages estáticas performáticas com foco em UI/DX.' },
  { name: 'JavaScript', category: 'frontend', description: 'Microinterações, animações leves e estado nativo.', proof: 'Tema, progress bar, drawers e filtros sem libs.' },
  { name: 'React', category: 'frontend', description: 'Componentes reutilizáveis e hooks para CRUD.', proof: 'Grid e modais genéricos com TanStack Table e contextos.' },
  { name: 'TypeScript', category: 'frontend', description: 'Types utilitários, generics e contratos seguros.', proof: 'Sem any no grid; validação de props e helpers Cypress.' },
  { name: 'Styled-Components', category: 'frontend', description: 'Tokens, temas e variantes escaláveis.', proof: 'Design system com dark/light e pads consistentes.' },
  { name: 'TanStack React-Table', category: 'frontend', description: 'Colunas dinâmicas, filtros hora-only e virtualização.', proof: 'CRUD acelerado e derivação em VTT.' },
  { name: 'Recharts', category: 'frontend', description: 'Dashboards acessíveis e tooltips custom.', proof: 'KPIs e gráficos de impacto para o squad.' },
  { name: 'Node.js', category: 'runtime', description: 'APIs leves e scripts.', proof: 'Endpoints auxiliares e integrações com Supabase.' },
  { name: 'Express', category: 'runtime', description: 'Rotas REST e middlewares.', proof: 'Mocks p/ testes locais e POCs.' },
  { name: 'Java', category: 'runtime', description: 'POO, coleções e fundamentos.', proof: 'Projetos acadêmicos focados em estrutura de dados.' },
  { name: 'Supabase (Postgres)', category: 'db', description: 'RLS, policies e SQL voltado a finanças.', proof: 'Finanças Lite com segurança por usuário e enums.' },
  { name: 'MySQL', category: 'db', description: 'Modelagem relacional e consultas.', proof: 'Projetos acadêmicos e migrações simples.' },
  { name: 'Cypress', category: 'tests', description: 'Fluxos CRUD, filtros e toasts.', proof: 'Suite por tipo com helpers como pickFromCombo.' },
  { name: 'Zod', category: 'tests', description: 'Validação e schemas compartilhados.', proof: 'Forms React com feedback instantâneo.' },
  { name: 'Prisma', category: 'tooling', description: 'ORM tipado, migrations e seeds.', proof: 'APIs Node com schemas sincronizados ao DB.' },
  { name: 'Vite', category: 'tooling', description: 'Bundler rápido com TS e lint.', proof: 'DX redonda em projetos React internos.' },
  { name: 'PostCSS', category: 'tooling', description: 'Pipeline de estilos (nesting/autoprefixer).', proof: 'Build otimizado para design systems.' },
  { name: 'Three.js', category: 'others', description: 'Cena 3D, física básica e interações.', proof: "Newton's Cannon com controle de velocidade e colisão." },
  { name: 'Git/GitHub', category: 'others', description: 'GitFlow, PRs e review.', proof: 'Commits enxutos, templates e automações simples.' }
];

const renderSkills = (category = 'all') => {
  if (!stackGrid) return;
  stackGrid.innerHTML = '';
  const filtered = category === 'all' ? skills : skills.filter((s) => s.category === category);
  filtered.forEach((skill) => {
    const card = document.createElement('article');
    card.className = 'stack__item';
    card.setAttribute('tabindex', '0');
    card.dataset.name = skill.name;
    card.innerHTML = `<h3>${skill.name}</h3><p class="muted">${skill.description}</p>`;
    card.addEventListener('click', () => showSkillDetails(skill));
    card.addEventListener('keypress', (event) => {
      if (event.key === 'Enter') showSkillDetails(skill);
    });
    stackGrid.appendChild(card);
  });
};

const showSkillDetails = (skill) => {
  if (!stackDetails) return;
  stackDetails.innerHTML = `<strong>${skill.name}</strong> · ${skill.description}<br><span>${skill.proof}</span>`;
};

renderSkills();

const filterButtons = document.querySelectorAll('.stack__filters .chip');
filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    filterButtons.forEach((btn) => btn.classList.remove('is-active'));
    button.classList.add('is-active');
    renderSkills(button.dataset.category);
    const firstSkill = skills.find((s) => (button.dataset.category === 'all' ? true : s.category === button.dataset.category));
    if (firstSkill) showSkillDetails(firstSkill);
  });
});

if (filterButtons.length) {
  const active = document.querySelector('.stack__filters .chip.is-active');
  const defaultCategory = active?.dataset.category || 'all';
  renderSkills(defaultCategory);
  const firstSkill = skills.find((s) => (defaultCategory === 'all' ? true : s.category === defaultCategory));
  if (firstSkill) showSkillDetails(firstSkill);
}

// Project drawer
const projectData = {
  financas: {
    title: 'Finanças Lite',
    problem: 'Controlar contas, categorias e transferências mantendo segurança por usuário.',
    solution: 'Schema Supabase com enums de tipo de conta, policies RLS e UI focada em lançamentos rápidos.',
    result: 'Base sólida para app pessoal com autenticação e segurança no banco.',
    stack: ['HTML/CSS/JS', 'Supabase', 'Postgres', 'RLS', 'SQL'],
    role: 'Tudo: modelagem, UI e integração.',
    highlights: [
      'Contas, categorias e transferências claras',
      'Policies RLS específicas por usuário',
      'Fluxo de lançamento direto sem ruído'
    ],
    links: [
      { label: 'Repo', url: '#' },
      { label: 'Demo', url: '#' }
    ],
    images: ['assets/financas-lite.svg']
  },
  grid: {
    title: 'Grid & Modais Genéricos — VTT',
    problem: 'Telas CRUD demoravam por falta de padrões e filtros reaproveitáveis.',
    solution: 'Componentes Create/Update/Clone/Derivação com TanStack Table, combos dinâmicos e validação única.',
    result: 'Telas novas com menos esforço e DX previsível para quem opera o grid.',
    stack: ['React', 'TypeScript', 'Styled-Components', 'TanStack React-Table', 'Recharts'],
    role: 'Implementação de componentes e ajustes de UX.',
    highlights: [
      'Clone com seleção de PK',
      'Filtros apenas hora e combos dinâmicos',
      'Personalização de colunas conforme perfil'
    ],
    links: [{ label: 'Overview interno', url: '#' }],
    images: ['assets/generic-grid.svg']
  },
  suite: {
    title: 'Suite de Testes E2E — VTT',
    problem: 'Regressões em fluxos CRUD e filtros estratégicos comprometiam releases.',
    solution: 'Bateria Cypress organizada por tipo (create, update, filter) com helpers como pickFromCombo.',
    result: 'Releases com mais confiança e bugs triados mais rápido.',
    stack: ['Cypress', 'TypeScript'],
    role: 'Escrita e manutenção dos testes e utilitários.',
    highlights: [
      'Helpers para combos e validação de toasts',
      'Fechamento seguro de modais e intercepts',
      'Dashboard diário de status verde'
    ],
    links: [{ label: 'Checklist de testes', url: '#' }],
    images: ['assets/cypress-suite.svg']
  },
  newton: {
    title: 'Newton’s Cannon 3D',
    problem: 'Explorar física orbital de forma interativa e visual.',
    solution: 'Cena Three.js com slider de velocidade, pausa em colisão e UI mínima.',
    result: 'Aprendizado sobre física básica, controle de cena e UX de controles 3D.',
    stack: ['HTML/CSS/JS', 'Three.js'],
    role: 'Conceito, código e UI.',
    highlights: ['Slider que ajusta velocidade orbital', 'Colisão pausa e destaca trajetória', 'HUD minimalista com foco na leitura'],
    links: [{ label: 'Repo', url: '#' }],
    images: ['assets/newtons-cannon.svg']
  }
};

const drawer = document.querySelector('.drawer');
const drawerContent = drawer?.querySelector('.drawer__inner');

const openDrawer = (key) => {
  if (!drawer || !drawerContent) return;
  const data = projectData[key];
  if (!data) return;

  const highlightsMarkup = data.highlights?.length
    ? `<section><h3>Destaques</h3><ul class="project__highlights">${data.highlights.map((i) => `<li>${i}</li>`).join('')}</ul></section>`
    : '';
  const linksMarkup = data.links?.length
    ? `<section><h3>Links</h3><ul class="project__links">${data.links
        .map((l) => `<li><a href="${l.url}" target="_blank" rel="noopener">${l.label}</a></li>`)
        .join('')}</ul></section>`
    : '';
  const roleMarkup = data.role ? `<section><h3>Meu papel</h3><p>${data.role}</p></section>` : '';

  drawerContent.innerHTML = `
    <header>
      <h2>${data.title}</h2>
      <div class="badge badge--accent">Case</div>
    </header>
    <section><h3>Problema</h3><p>${data.problem}</p></section>
    <section><h3>Solução</h3><p>${data.solution}</p></section>
    <section><h3>Resultado</h3><p>${data.result}</p></section>
    ${roleMarkup}
    <section>
      <h3>Stack utilizada</h3>
      <div class="chip-list">${data.stack.map((item) => `<span class="chip">${item}</span>`).join('')}</div>
    </section>
    ${highlightsMarkup}
    <section>
      <h3>Evidências</h3>
      <div class="project__gallery">${data.images
        .map((src) => `<img src="${src}" alt="${data.title}" loading="lazy" decoding="async">`)
        .join('')}</div>
    </section>
    ${linksMarkup}
  `;
  drawer.setAttribute('aria-hidden', 'false');
  drawer.classList.add('is-open');
  document.body.style.overflow = 'hidden';
};

const closeDrawer = () => {
  if (!drawer) return;
  drawer.classList.remove('is-open');
  drawer.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
};

drawer?.querySelectorAll('[data-close]').forEach((btn) => btn.addEventListener('click', closeDrawer));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeDrawer();
});
document.querySelectorAll('.project-card').forEach((card) => {
  card.addEventListener('click', () => openDrawer(card.dataset.project));
  card.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') openDrawer(card.dataset.project);
  });
});

// Copy email
const copyButtons = document.querySelectorAll('[data-copy]');
const feedbackEl = document.querySelector('.contact__feedback');
copyButtons.forEach((button) => {
  button.addEventListener('click', async () => {
    const value = button.dataset.copy;
    try {
      await navigator.clipboard.writeText(value);
      if (feedbackEl) {
        feedbackEl.textContent = 'E-mail copiado!';
        setTimeout(() => (feedbackEl.textContent = ''), 2400);
      }
    } catch {
      if (feedbackEl) feedbackEl.textContent = value;
    }
  });
});

// Year
const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

// Background canvas particles
const canvas = document.getElementById('bg-canvas');
const ctx = canvas?.getContext('2d');
let particles = [];

const resizeCanvas = () => {
  if (!canvas) return;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  particles = Array.from({ length: Math.min(160, Math.floor(canvas.width / 12)) }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: Math.random() * 1.4 + 0.4,
    alpha: Math.random() * 0.4 + 0.1,
    speedY: (Math.random() - 0.5) * 0.08,
    speedX: (Math.random() - 0.5) * 0.08
  }));
};

const drawParticles = () => {
  if (!ctx || !canvas) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach((p) => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(127, 212, 255, ${p.alpha})`;
    ctx.fill();
    p.x += p.speedX;
    p.y += p.speedY;
    if (p.x > canvas.width) p.x = 0;
    if (p.x < 0) p.x = canvas.width;
    if (p.y > canvas.height) p.y = 0;
    if (p.y < 0) p.y = canvas.height;
  });
  requestAnimationFrame(drawParticles);
};

if (canvas) {
  resizeCanvas();
  drawParticles();
  window.addEventListener('resize', resizeCanvas);
}

// Scroll reveal parallax
const hero = document.querySelector('.hero');
window.addEventListener(
  'scroll',
  () => {
    if (!hero) return;
    const offset = window.scrollY * 0.1;
    hero.style.backgroundPosition = `center ${offset}px`;
  },
  { passive: true }
);

// Konami code easter egg
const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;
document.addEventListener('keydown', (event) => {
  const key = event.key;
  if (key === KONAMI[konamiIndex]) {
    konamiIndex += 1;
    if (konamiIndex === KONAMI.length) {
      konamiIndex = 0;
      document.body.classList.add('konami-mode');
      setTimeout(() => document.body.classList.remove('konami-mode'), 10000);
    }
  } else {
    konamiIndex = 0;
  }
});

// Lightbox keyboard trap (drawer)
const trapFocus = (event) => {
  if (!drawer?.classList.contains('is-open')) return;
  const focusable = drawer.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (event.key !== 'Tab') return;
  if (event.shiftKey) {
    if (document.activeElement === first) {
      last.focus();
      event.preventDefault();
    }
  } else if (document.activeElement === last) {
    first.focus();
    event.preventDefault();
  }
};
document.addEventListener('keydown', trapFocus);
