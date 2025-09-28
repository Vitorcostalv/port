const docEl = document.documentElement;
const root = document.documentElement;
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
const storedTheme = localStorage.getItem('vc-theme');

const applyTheme = theme => {
  const next = theme || (prefersDark.matches ? 'dark' : 'light');
  root.setAttribute('data-theme', next);
  document.body.dataset.theme = next;
  localStorage.setItem('vc-theme', next);
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
  { name: 'HTML & CSS', category: 'frontend', description: 'Layout responsivo em grid 12 colunas, tokens e acessibilidade.', proof: 'Landing pages estáticas performáticas com foco em UI/DX.' },
  { name: 'JavaScript', category: 'frontend', description: 'Microinterações, animações leves e gerenciamento de estado nativo.', proof: 'Tema, progress bar, drawers e filtros sem libs.' },
  { name: 'React', category: 'frontend', description: 'Componentes reutilizáveis e hooks específicos para CRUD.', proof: 'Grid e modais genéricos com TanStack Table e contextos.' },
  { name: 'TypeScript', category: 'frontend', description: 'Types utilitários, generics e contratos seguros.', proof: 'Sem any no grid; validação de props e helpers Cypress.' },
  { name: 'Styled-Components', category: 'frontend', description: 'Tokens, temas e variantes escaláveis.', proof: 'Design system com dark/light e pads consistentes.' },
  { name: 'TanStack React-Table', category: 'frontend', description: 'Colunas dinâmicas, filtros hora-only e virtualização.', proof: 'CRUD acelerado e derivação instantânea em VTT.' },
  { name: 'Recharts', category: 'frontend', description: 'Dashboards acessíveis com tooltips personalizados.', proof: 'KPIs financeiros e gráficos de impacto entregues ao squad.' },
  { name: 'Node.js', category: 'runtime', description: 'APIs leves para protótipos e scripts de automação.', proof: 'Endpoints auxiliares e integrações com Supabase.' },
  { name: 'Express', category: 'runtime', description: 'Rotas REST, middlewares e autenticação básica.', proof: 'Mock de serviços para testes locais e provas de conceito.' },
  { name: 'Java (básico)', category: 'runtime', description: 'POO, coleções e fundamentos de API.', proof: 'Projetos acadêmicos com foco em estruturação de dados.' },
  { name: 'Supabase (Postgres)', category: 'db', description: 'RLS, policies e SQL voltado a finanças.', proof: 'Finanças Lite com segurança por usuário e enums.' },
  { name: 'MySQL', category: 'db', description: 'Modelagem relacional e consultas otimizadas.', proof: 'Projetos acadêmicos e migrações simples.' },
  { name: 'Cypress', category: 'tests', description: 'Fluxos CRUD, filtros e validação de toasts.', proof: 'Suite por tipo com helpers como pickFromCombo.' },
  { name: 'Zod', category: 'tests', description: 'Validação de dados e schemas compartilhados.', proof: 'Formulários React com feedback instantâneo.' },
  { name: 'Prisma', category: 'tooling', description: 'ORM tipado, migrations e seeds.', proof: 'APIs Node com schemas sincronizados ao DB.' },
  { name: 'Vite', category: 'tooling', description: 'Bundler rápido com TS, lint e testes integrados.', proof: 'Setup DX para projetos React internos.' },
  { name: 'PostCSS', category: 'tooling', description: 'Pipelines de estilos, nesting e autoprefixer.', proof: 'Build otimizado para design systems.' },
  { name: 'Three.js', category: 'others', description: 'Cena 3D, física básica e interações.', proof: "Newton's Cannon com controle de velocidade e colisão." },
  { name: 'Git/GitHub', category: 'others', description: 'Fluxo GitFlow, PRs e code review.', proof: 'Commits enxutos, templates e automações simples.' }
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
    links: [
      { label: 'Overview interno', url: '#' }
    ],
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
    links: [
      { label: 'Checklist de testes', url: '#' }
    ],
    images: ['assets/cypress-suite.svg']
  },
  newton: {
    title: 'Newton’s Cannon 3D',
    problem: 'Explorar física orbital de forma interativa e visual.',
    solution: 'Cena Three.js com slider de velocidade, pausa em colisão e UI mínima.',
    result: 'Aprendizado sobre física básica, controle de cena e UX de controles 3D.',
    stack: ['HTML/CSS/JS', 'Three.js'],
    role: 'Conceito, código e UI.',
    highlights: [
      'Slider que ajusta velocidade orbital',
      'Colisão pausa e destaca trajetória',
      'HUD minimalista com foco na leitura'
    ],
    links: [
      { label: 'Repo', url: '#' }
    ],
    images: ['assets/newtons-cannon.svg']
  }
};

const drawer = document.querySelector('.drawer');
const drawerContent = drawer?.querySelector('.drawer__inner');

const openDrawer = key => {
  if (!drawer || !drawerContent) return;
  const data = projectData[key];
  if (!data) return;
  const highlightsMarkup = data.highlights?.length
    ? `<section><h3>Destaques</h3><ul class="project__highlights">${data.highlights.map(item => `<li>${item}</li>`).join('')}</ul></section>`
    : '';
  const linksMarkup = data.links?.length
    ? `<section><h3>Links</h3><ul class="project__links">${data.links.map(link => `<li><a href="${link.url}" target="_blank" rel="noopener">${link.label}</a></li>`).join('')}</ul></section>`
    : '';
  const roleMarkup = data.role ? `<section><h3>Meu papel</h3><p>${data.role}</p></section>` : '';
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
    ${roleMarkup}
    <section>
      <h3>Stack utilizada</h3>
      <div class="chip-list">${data.stack.map(item => `<span class="chip">${item}</span>`).join('')}</div>
    </section>
    ${highlightsMarkup}
    <section>
      <h3>Evidências</h3>
      <div class="project__gallery">${data.images.map(src => `<img src="${src}" alt="${data.title}" loading="lazy" decoding="async">`).join('')}</div>
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
