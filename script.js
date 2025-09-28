const docEl = document.documentElement;
const root = document.documentElement;
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
const storedTheme = localStorage.getItem('gm-theme');

const applyTheme = theme => {
  const next = theme || (prefersDark.matches ? 'dark' : 'light');
  root.setAttribute('data-theme', next);
  document.body.dataset.theme = next;
  localStorage.setItem('gm-theme', next);
  const toggle = document.querySelector('.theme-toggle');
  if (toggle) {
    toggle.setAttribute('aria-pressed', String(next === 'dark'));
  }
};

applyTheme(storedTheme);

prefersDark.addEventListener('change', event => {
  if (!storedTheme) {
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

navLinks?.querySelectorAll('a').forEach(link => {
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
  progressBar.style.width = `${progress}%`;
};
window.addEventListener('scroll', updateProgress, { passive: true });
updateProgress();

// Ripple effect
const createRipple = event => {
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

document.querySelectorAll('[data-ripple]').forEach(button => {
  button.addEventListener('click', createRipple);
});

// Intersection reveal animations
const revealElements = document.querySelectorAll('[data-reveal]');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.2,
});

revealElements.forEach(el => observer.observe(el));

// Counters
const counters = document.querySelectorAll('.counter');
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const valueEl = el.querySelector('.counter__value');
      const target = Number(el.dataset.target) || 0;
      const duration = 1600;
      const start = performance.now();

      const step = now => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = progress < 0.5 ? 4 * progress * progress * progress : (progress - 1) * (2 * progress - 2) * (2 * progress - 2) + 1;
        valueEl.textContent = Math.round(target * eased);
        if (progress < 1) requestAnimationFrame(step);
      };

      requestAnimationFrame(step);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.35 });

counters.forEach(counter => counterObserver.observe(counter));

// Stack & skills
const stackGrid = document.querySelector('.stack__grid');
const stackPanel = document.querySelector('.stack__panel');
const stackDetails = stackPanel?.querySelector('.stack__details');

const skills = [
  { name: 'React', category: 'frontend', description: 'Componentização orientada a hooks, server components experimentais e integração com TanStack Table.', proof: 'Grid genérico, dashboards responsivos e formulários dinâmicos.' },
  { name: 'TypeScript', category: 'frontend', description: 'Modelagem de tipos utilitários, generics para modais reutilizáveis e segurança nas integrações.', proof: 'Zero any no grid, automação de contratos e DX melhorado.' },
  { name: 'TanStack Table', category: 'frontend', description: 'Colunas dinâmicas, filtros custom e virtualização de 10k+ linhas.', proof: 'CRUD acelerado com derivação instantânea.' },
  { name: 'Styled Components', category: 'frontend', description: 'Design system token-based, theming, variantes e dark/light.', proof: 'Tokens reutilizados em 10+ componentes com consistência visual.' },
  { name: 'Cypress', category: 'tests', description: 'Fluxos críticos com intercept, seeds Supabase e monitoramento em CI.', proof: 'Suite diária cobrindo onboarding, billing e cadastros.' },
  { name: 'Supabase', category: 'db', description: 'RLS, RPC functions, storage e policies.', proof: 'Finanças Lite com dados seguros e consistentes.' },
  { name: 'Recharts', category: 'frontend', description: 'Charts acessíveis com foco em contraste e tooltips custom.', proof: 'Métricas de finanças e indicadores em real-time.' },
  { name: 'Playwright', category: 'tests', description: 'Comparativos com Cypress e smoke tests cross-browser.', proof: 'Migração planejada para cenários paralelos.' },
  { name: 'Figma Tokens', category: 'tools', description: 'Tokens sincronizados com código via style-dictionary.', proof: 'Handoff rápido entre design e dev.' },
  { name: 'Notion + Linear', category: 'tools', description: 'Organização de roadmap, changelog e documentação viva.', proof: 'Squad com rituais previsíveis e histórico rastreável.' }
];

const renderSkills = (category = 'all') => {
  if (!stackGrid) return;
  stackGrid.innerHTML = '';
  const filtered = category === 'all' ? skills : skills.filter(skill => skill.category === category);
  filtered.forEach(skill => {
    const card = document.createElement('article');
    card.className = 'stack__item';
    card.setAttribute('tabindex', '0');
    card.dataset.name = skill.name;
    card.innerHTML = `<h3>${skill.name}</h3><p class="muted">${skill.description}</p>`;
    card.addEventListener('click', () => showSkillDetails(skill));
    card.addEventListener('keypress', event => {
      if (event.key === 'Enter') {
        showSkillDetails(skill);
      }
    });
    stackGrid.appendChild(card);
  });
};

const showSkillDetails = skill => {
  if (!stackDetails) return;
  stackDetails.innerHTML = `<strong>${skill.name}</strong> · ${skill.description}<br><span>${skill.proof}</span>`;
};

renderSkills();

const filterButtons = document.querySelectorAll('.stack__filters .chip');

filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    filterButtons.forEach(btn => btn.classList.remove('is-active'));
    button.classList.add('is-active');
    renderSkills(button.dataset.category);
    const firstSkill = skills.find(skill => button.dataset.category === 'all' ? true : skill.category === button.dataset.category);
    if (firstSkill) showSkillDetails(firstSkill);
  });
});

if (filterButtons.length) {
  const active = document.querySelector('.stack__filters .chip.is-active');
  const defaultCategory = active?.dataset.category || 'all';
  renderSkills(defaultCategory);
  const firstSkill = skills.find(skill => defaultCategory === 'all' ? true : skill.category === defaultCategory);
  if (firstSkill) showSkillDetails(firstSkill);
}

// Project drawer
const projectData = {
  financas: {
    title: 'Finanças Lite',
    problem: 'Gestores precisavam consolidar contas, categorias e transferências com segurança multiusuário.',
    solution: 'Modelagem Supabase com RLS, interface de contas com drag-and-drop e grid com filtros por período.',
    result: '+32% velocidade no lançamento de transferências e redução de tickets de suporte.',
    stack: ['React', 'TypeScript', 'Supabase', 'TanStack Table', 'Styled Components'],
    images: ['assets/financas-lite.svg']
  },
  grid: {
    title: 'Generic Grid & Modals',
    problem: 'Criar novas telas levava dias por falta de componentes padronizados e filtros reutilizáveis.',
    solution: 'Grid declarativo com schema JSON, modais dinâmicos Create/Update/Clone e validação unificada.',
    result: '45% de redução no tempo de entrega e documentação DX para o squad.',
    stack: ['React', 'TypeScript', 'TanStack Table', 'Zod', 'Cypress'],
    images: ['assets/generic-grid.svg']
  },
  helper: {
    title: 'Mass Effect Codex Helper',
    problem: 'Jogadores perdiam tempo comparando builds e lendo informação fragmentada em wikis.',
    solution: 'Interface com busca instantânea, visão comparativa e atalhos acessíveis.',
    result: 'Sessões mais curtas e aumento de retenção no protótipo público.',
    stack: ['React', 'TypeScript', 'IndexedDB', 'Accessibility'],
    images: ['assets/mass-effect-helper.svg']
  }
};

const drawer = document.querySelector('.drawer');
const drawerContent = drawer?.querySelector('.drawer__inner');

const openDrawer = key => {
  if (!drawer || !drawerContent) return;
  const data = projectData[key];
  if (!data) return;
  drawerContent.innerHTML = `
    <header>
      <h2>${data.title}</h2>
      <div class="badge badge--accent">Case</div>
    </header>
    <section>
      <h3>Problema</h3>
      <p>${data.problem}</p>
    </section>
    <section>
      <h3>Solução</h3>
      <p>${data.solution}</p>
    </section>
    <section>
      <h3>Resultado</h3>
      <p>${data.result}</p>
    </section>
    <section>
      <h3>Stack utilizada</h3>
      <div class="chip-list">${data.stack.map(item => `<span class="chip">${item}</span>`).join('')}</div>
    </section>
    <section>
      <h3>Evidências</h3>
      <div class="project__gallery">${data.images.map(src => `<img src="${src}" alt="${data.title}" loading="lazy" decoding="async">`).join('')}</div>
    </section>
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

drawer?.querySelectorAll('[data-close]').forEach(btn => {
  btn.addEventListener('click', closeDrawer);
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape') closeDrawer();
});

document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('click', () => openDrawer(card.dataset.project));
  card.addEventListener('keypress', event => {
    if (event.key === 'Enter') openDrawer(card.dataset.project);
  });
});

// Copy email
const copyButtons = document.querySelectorAll('[data-copy]');
const feedbackEl = document.querySelector('.contact__feedback');

copyButtons.forEach(button => {
  button.addEventListener('click', async () => {
    const value = button.dataset.copy;
    try {
      await navigator.clipboard.writeText(value);
      if (feedbackEl) {
        feedbackEl.textContent = 'E-mail copiado!';
        setTimeout(() => (feedbackEl.textContent = ''), 2400);
      }
    } catch (error) {
      if (feedbackEl) {
        feedbackEl.textContent = value;
      }
    }
  });
});

// Year
const year = document.getElementById('year');
year.textContent = new Date().getFullYear();

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
  particles.forEach(particle => {
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(127, 212, 255, ${particle.alpha})`;
    ctx.fill();
    particle.x += particle.speedX;
    particle.y += particle.speedY;
    if (particle.x > canvas.width) particle.x = 0;
    if (particle.x < 0) particle.x = canvas.width;
    if (particle.y > canvas.height) particle.y = 0;
    if (particle.y < 0) particle.y = canvas.height;
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
window.addEventListener('scroll', () => {
  if (!hero) return;
  const offset = window.scrollY * 0.1;
  hero.style.backgroundPosition = `center ${offset}px`;
}, { passive: true });

// Konami code easter egg
const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
let konamiIndex = 0;

document.addEventListener('keydown', event => {
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

// Lightbox keyboard trap when drawer is open
const trapFocus = event => {
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
