"use client";

import emailjs from "@emailjs/browser";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { FormEvent, useEffect, useState } from "react";

const navItems = [
  { label: "Sobre", href: "#sobre" },
  { label: "Stack", href: "#stack" },
  { label: "Experiência", href: "#experiencia" },
  { label: "Projetos", href: "#projetos" },
  { label: "Depoimentos", href: "#depoimentos" },
  { label: "Contato", href: "#contato" },
];

const roles = ["Fullstack Developer", "Software Engineer", "Programming Enthusiast"];

const techStack = [
  {
    name: "React",
    icon: "skill-icons:react-dark",
    category: "frontend",
    level: "Avançado",
    since: "3 anos",
  },
  {
    name: "Next.js",
    icon: "devicon:nextjs",
    category: "frontend",
    level: "Intermediário",
    since: "1 ano",
  },
  {
    name: "Tailwind CSS",
    icon: "logos:tailwindcss-icon",
    category: "frontend",
    level: "Avançado",
    since: "1 ano",
  },
  {
    name: "TypeScript",
    icon: "skill-icons:typescript",
    category: "frontend",
    level: "Avançado",
    since: "3 anos",
  },
  {
    name: "Vue.js",
    icon: "devicon:vuejs",
    category: "frontend",
    level: "Iniciante",
    since: "1 ano",
  },
  {
    name: "Laravel",
    icon: "devicon:laravel",
    category: "backend",
    level: "Iniciante",
    since: "2 anos",
  },
  {
    name: "Django",
    icon: "material-icon-theme:django",
    category: "backend",
    level: "Iniciante",
    since: "1 ano",
  },
  {
    name: "Java",
    icon: "devicon:java",
    category: "backend",
    level: "Intermediário",
    since: "2 anos",
  },
  {
    name: "Go",
    icon: "devicon:go",
    category: "backend",
    level: "Iniciante",
    since: "estudo",
  },
  {
    name: "Node.js",
    icon: "devicon:nodejs",
    category: "backend",
    level: "Avançado",
    since: "3 anos",
  },
  {
    name: "NestJS",
    icon: "devicon:nestjs",
    category: "backend",
    level: "Iniciante",
    since: "2 anos",
  },
  {
    name: "PostgreSQL",
    icon: "logos:postgresql",
    category: "database",
    level: "Intermediário",
    since: "2 anos",
  },
  {
    name: "MySQL",
    icon: "devicon:mysql",
    category: "database",
    level: "Intermediário",
    since: "2 anos",
  },
  {
    name: "Firebase",
    icon: "vscode-icons:file-type-firebase",
    category: "database",
    level: "Iniciante",
    since: "estudo",
  },
  {
    name: "Supabase",
    icon: "logos:supabase-icon",
    category: "database",
    level: "Intermediário",
    since: "1 ano",
  },
  {
    name: "Docker",
    icon: "devicon:docker",
    category: "devops",
    level: "Iniciante",
    since: "1 ano",
  },
  {
    name: "Ubuntu",
    icon: "devicon:ubuntu",
    category: "linux",
    level: "Intermediário",
    since: "1 ano",
  },
  {
    name: "Debian",
    icon: "devicon:debian",
    category: "linux",
    level: "Intermediário",
    since: "uso diário",
  },
  {
    name: "Cypress",
    icon: "skill-icons:cypress-dark",
    category: "quality",
    level: "Avançado",
    since: "2 anos",
  },
  {
    name: "Jasmine",
    icon: "devicon:jasmine",
    category: "quality",
    level: "Intermediário",
    since: "1 ano",
  },
];

const stackCategories = [
  { value: "frontend", label: "Front-end" },
  { value: "backend", label: "Back-end" },
  { value: "database", label: "Banco" },
  { value: "devops", label: "DevOps" },
  { value: "linux", label: "Linux" },
  { value: "quality", label: "Qualidade" },
];

const projects = [
  {
    title: "Sara_core",
    description:
      "TCC fullstack solo: pipeline de voz (Vosk PT-BR → Gemini/Grok → síntese) com grounding em PostgreSQL e política anti-injeção no system prompt. Motor de ecossistema procedural com classificação climática (Köppen), árvores de comportamento para fauna e visualização 3D em tempo real via Three.js — ciclo dia/noite, chuva, milhares de agentes instanciados. TypeScript monorepo (Node/Express + React 18), observabilidade com Pino.",
    github: "https://github.com/Vitorcostalv/Sara_core",
  },
  {
    title: "Arvore-binaria-java",
    description:
      "Sistema bancário em Java com Árvore Binária de Busca (BST) como estrutura central — contas armazenadas e recuperadas em O(log n), com inserção, remoção e travessias in/pre/post-order. Projeto funcional com menu interativo via terminal.",
    github: "https://github.com/Vitorcostalv/Arvore-binaria-java",
  },
  {
    title: "BotDiscord",
    description:
      "Bot de Discord em TypeScript com roteamento inteligente entre 3 provedores de LLM (Gemini, Groq, Poe) — fallback automático em rate limit e cache por hash SHA-256. Recomendações de jogos e filmes com PRNG determinístico que nunca repete sugestões já avaliadas. Inclui perfis com XP, conquistas, cards de perfil gerados em PNG via canvas e ranking de reviews por servidor. Persistência em SQLite com migrations, deploy no Railway.",
    github: "https://github.com/Vitorcostalv/BotDiscord",
  },
  {
    title: "FlappyBird",
    description:
      "Flappy Bird com IA que aprende a jogar via NEAT — algoritmo que evolui pesos e topologia da rede neural sem arquitetura pré-definida. 100 agentes treinam em paralelo por geração com função de fitness de três sinais: +0.1 por frame sobrevivido, +5 por cano ultrapassado, −1 por colisão. Entradas da rede: posição Y do pássaro e distâncias até a abertura do próximo obstáculo. Colisão por pixel-perfect masking. Suporta modo humano e modo IA com indicador de geração em tela. Python · Pygame · NEAT-Python.",
    github: "https://github.com/Vitorcostalv/FlappyBird",
  },
];

const testimonials = [
  {
    name: "Ana Paula Rodrigues",
    role: "Tech Lead · VTT",
    text: "O Vitor entregou a Luna com uma maturidade que não esperávamos de um dev júnior. Ele pensou no fluxo do usuário, na segurança das respostas da IA e na integração com o portal — não precisamos revisar o core nem uma vez depois do merge.",
    initials: "AP",
  },
  {
    name: "Lucas Mendes",
    role: "Desenvolvedor Sênior · VTT",
    text: "A refatoração do analytics foi um trabalho sólido: ele mapeou os pontos críticos, documentou as decisões e entregou algo que o time consegue manter. A cobertura de testes que ele estruturou com Cypress e Jasmine deu uma confiança real nas releases.",
    initials: "LM",
  },
  {
    name: "Prof. Carlos Siqueira",
    role: "Orientador de TCC",
    text: "O Sara_core é um dos projetos de TCC mais completos que orientei. Pipeline de voz, grounding com segurança no LLM e simulação ecológica em tempo real — tudo integrado e funcionando. Vitor tem clareza técnica e sabe transformar conceito em sistema real.",
    initials: "CS",
  },
];


const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.08,
    },
  },
};

const viewport = { once: true, amount: 0.1 };

function TypewriterRoles() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const fade = window.setTimeout(() => setVisible(false), 1900);
    const swap = window.setTimeout(() => {
      setIndex((current) => (current + 1) % roles.length);
      setVisible(true);
    }, 2250);

    return () => {
      window.clearTimeout(fade);
      window.clearTimeout(swap);
    };
  }, [index]);

  return (
    <span
      className={`inline-block text-acid-400 transition-all duration-500 ${
        visible ? "translate-y-0 opacity-100" : "translate-y-1 opacity-70"
      }`}
    >
      {roles[index]}
    </span>
  );
}

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = mounted ? resolvedTheme !== "light" : true;

  return (
    <button
      type="button"
      aria-label="Alternar tema"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="grid size-11 place-items-center rounded-2xl border border-white/10 bg-white/[0.06] text-steel-100 transition-colors duration-300 hover:border-acid-400/60 hover:text-acid-400 dark:bg-white/[0.06] light:border-slate-200 light:bg-white light:text-ink-900"
    >
      <Icon icon={isDark ? "solar:sun-bold" : "solar:moon-bold"} width={20} height={20} />
    </button>
  );
}

function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-ink-950/76 backdrop-blur-2xl light:border-slate-200 light:bg-white/86">
      <nav className="section-shell flex h-20 items-center justify-between">
        <a href="#hero" className="font-display text-2xl font-extrabold tracking-[0.18em]">
          VC
        </a>

        <div className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-xl px-4 py-2 text-sm font-bold text-steel-300 transition-colors duration-300 hover:bg-white/8 hover:text-steel-100 light:text-slate-600 light:hover:bg-slate-100 light:hover:text-ink-900"
            >
              {item.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <button
            type="button"
            className="grid size-11 place-items-center rounded-2xl border border-white/10 bg-white/[0.06] text-steel-100 lg:hidden"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            <Icon icon={open ? "solar:close-circle-bold" : "solar:hamburger-menu-line-duotone"} width={24} height={24} />
          </button>
        </div>
      </nav>

      {open ? (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="section-shell pb-5 lg:hidden"
        >
          <div className="glass-card grid gap-1 rounded-3xl p-3">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-2xl px-4 py-3 text-sm font-bold text-steel-200 transition-colors hover:bg-white/10 light:text-slate-700 light:hover:bg-slate-100"
              >
                {item.label}
              </a>
            ))}
          </div>
        </motion.div>
      ) : null}
    </header>
  );
}

function Hero() {
  return (
    <section id="hero" className="relative overflow-hidden pt-32 sm:pt-36">
      <div className="absolute inset-0 -z-10 bg-ink-950 light:bg-[#f6f8fb]" />
      <div className="absolute inset-0 -z-10 bg-grid bg-[size:36px_36px] opacity-40" />
      <div className="absolute left-1/2 top-16 -z-10 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-acid-400/10 blur-3xl" />

      <div className="section-shell grid min-h-[calc(100vh-80px)] items-center gap-10 pb-24 lg:grid-cols-[1.08fr_.92fr]">
        <motion.div initial={false} animate="visible" variants={stagger} className="max-w-3xl">
          <motion.div
            variants={fadeUp}
            className="inline-flex items-center gap-3 rounded-full border border-acid-400/30 bg-acid-400/10 px-4 py-2 text-sm font-bold text-acid-400"
          >
            <span className="relative flex size-2.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-acid-400 opacity-70" />
              <span className="relative inline-flex size-2.5 rounded-full bg-acid-400" />
            </span>
            Disponível para novas oportunidades
          </motion.div>

          <motion.p variants={fadeUp} className="mt-8 text-sm font-bold uppercase tracking-[0.3em] text-steel-300 light:text-slate-500">
            Vitor Costa
          </motion.p>

          <motion.h1
            variants={fadeUp}
            className="mt-4 font-display text-5xl font-extrabold leading-[1.02] tracking-normal text-steel-100 sm:text-7xl lg:text-8xl light:text-ink-900"
          >
            <TypewriterRoles />
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-7 max-w-2xl text-xl leading-8 text-steel-300 light:text-slate-600"
          >
            Desenvolvo sistemas completos, do banco de dados à interface — com foco em
            componentes reutilizáveis, APIs bem estruturadas e qualidade testável.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-9 flex flex-col gap-3 sm:flex-row">
            <MotionLink href="https://github.com/Vitorcostalv" label="GitHub" icon="skill-icons:github-dark" />
            <MotionLink href="https://www.linkedin.com/in/vitorcostalv/" label="LinkedIn" icon="skill-icons:linkedin" />
            <MotionLink href="/assets/Curriculo_Vitor__FullStack.pdf" label="Baixar CV" icon="solar:download-bold" download />
          </motion.div>
        </motion.div>

        <motion.div
          initial={false}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="relative flex items-center justify-center"
        >
          <div className="absolute -right-10 -top-10 size-48 rounded-full bg-acid-400/15 blur-3xl" />
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 light:border-slate-200">
            <img
              src="/assets/Perfil_foto.png"
              alt="Vitor Costa"
              className="h-auto w-full max-w-sm object-cover"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function MotionLink({
  href,
  label,
  icon,
  download,
}: {
  href: string;
  label: string;
  icon: string;
  download?: boolean;
}) {
  return (
    <motion.a
      href={href}
      target={download ? undefined : "_blank"}
      rel={download ? undefined : "noopener noreferrer"}
      download={download}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.97 }}
      className="inline-flex min-h-12 items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/[0.07] px-5 py-3 text-sm font-extrabold text-steel-100 transition-colors hover:border-acid-400/60 hover:bg-acid-400/10 light:border-slate-200 light:bg-white light:text-ink-900 light:hover:border-acid-500/60"
    >
      <Icon icon={icon} width={22} height={22} />
      {label}
      {!download ? <Icon icon="solar:arrow-right-up-linear" width={17} height={17} /> : null}
    </motion.a>
  );
}

function SectionHeader({
  eyebrow,
  title,
  copy,
}: {
  eyebrow: string;
  title: string;
  copy: string;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      variants={fadeUp}
      transition={{ duration: 0.55 }}
      className="mb-10 max-w-3xl"
    >
      <p className="section-label">{eyebrow}</p>
      <h2 className="section-title">{title}</h2>
      <p className="mt-4 text-lg leading-8 text-steel-300 light:text-slate-600">{copy}</p>
    </motion.div>
  );
}

function About() {
  return (
    <section id="sobre" className="py-24">
      <div className="section-shell">
        <SectionHeader
          eyebrow="Sobre"
          title="Interface boa é aquela que continua clara depois do deploy."
          copy="Comecei a programar por curiosidade — queria entender como as coisas funcionam por baixo. Hoje o que me motiva é construir sistemas que o time consegue evoluir sem medo: do banco de dados à tela, com componentes previsíveis, estados legíveis e testes que protegem os fluxos críticos."
        />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          variants={stagger}
          className="grid gap-4 md:grid-cols-3"
        >
          {[
            ["Produto", "Traduzo regra de negócio em fluxos de tela simples de operar."],
            ["DX", "Padronizo componentes para reduzir decisões repetidas em CRUDs."],
            ["Qualidade", "Uso testes E2E para proteger caminhos críticos antes do deploy."],
          ].map(([title, copy]) => (
            <motion.article key={title} variants={fadeUp} className="glass-card rounded-3xl p-6">
              <Icon icon="solar:shield-check-bold" className="text-acid-400" width={28} height={28} />
              <h3 className="mt-5 font-display text-xl font-bold text-steel-100 light:text-ink-900">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-steel-300 light:text-slate-600">{copy}</p>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function Stack() {
  return (
    <section id="stack" className="border-y border-white/10 bg-white/[0.025] py-24 light:border-slate-200 light:bg-slate-50">
      <div className="section-shell">
        <SectionHeader
          eyebrow="Tech Arsenal"
          title="Stack com contexto, nível e uso real."
          copy="Tecnologias organizadas por categoria com nível declarado e tempo de uso para dar contexto real a cada item."
        />

        <div className="flex flex-col gap-14">
          {stackCategories.map((cat) => {
            const techs = techStack.filter((t) => t.category === cat.value);
            return (
              <motion.div
                key={cat.value}
                initial="hidden"
                whileInView="visible"
                viewport={viewport}
                variants={stagger}
              >
                <p className="mb-5 text-xs font-bold uppercase tracking-[0.25em] text-acid-400">
                  {cat.label}
                </p>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {techs.map((tech) => (
                    <motion.article
                      key={tech.name}
                      variants={fadeUp}
                      whileHover={{ y: -5 }}
                      className="group/icon glass-card rounded-3xl p-5"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <Icon
                          icon={tech.icon}
                          width={48}
                          height={48}
                          className="transition-transform duration-300 group-hover/icon:rotate-3 group-hover/icon:scale-110"
                        />
                        <span className="rounded-full border border-acid-400/30 bg-acid-400/10 px-3 py-1 text-xs font-bold text-acid-400">
                          {tech.level}
                        </span>
                      </div>
                      <h3 className="mt-5 font-display text-lg font-bold text-steel-100 light:text-ink-900">
                        {tech.name}
                      </h3>
                      <p className="mt-2 text-sm text-steel-500 light:text-slate-500">{tech.since}</p>
                    </motion.article>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Experience() {
  return (
    <section id="experiencia" className="py-24">
      <div className="section-shell">
        <SectionHeader
          eyebrow="Experiência"
          title="Entrega com foco em manutenção."
          copy="A narrativa aqui é simples: menos tela reescrita, mais padrão reutilizável e mais confiança nos fluxos críticos."
        />

        <motion.article
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          variants={fadeUp}
          className="glass-card rounded-[2rem] p-6 md:p-8"
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-acid-400">2025 - atual</p>
              <h3 className="mt-3 font-display text-2xl font-extrabold text-steel-100 light:text-ink-900">
                VTT · Desenvolvedor Junior de Software
              </h3>
            </div>
            <span className="w-fit rounded-full border border-white/10 px-4 py-2 text-sm font-bold text-steel-300 light:border-slate-200 light:text-slate-600">
              React / TypeScript / Cypress
            </span>
          </div>
          <ul className="mt-7 grid gap-4 text-steel-300 light:text-slate-600 md:grid-cols-3">
            <li className="rounded-2xl bg-white/[0.04] p-4 light:bg-slate-50">
              Desenvolvi a Luna — IA integrada ao novo portal VTT responsável por auxiliar cadastros, responder dúvidas operacionais e atuar como assistente principal dos usuários dentro da plataforma.
            </li>
            <li className="rounded-2xl bg-white/[0.04] p-4 light:bg-slate-50">
              Condução da manutenção e refatoração do sistema de analytics da empresa, modernizando a base de código, eliminando dívidas técnicas e garantindo maior confiabilidade dos dados reportados.
            </li>
            <li className="rounded-2xl bg-white/[0.04] p-4 light:bg-slate-50">
              Desenvolvimento de suítes de testes automatizados com Cypress e Jasmine, cobrindo fluxos críticos da aplicação e estabelecendo uma base sólida de qualidade contínua para o time.
            </li>
          </ul>
        </motion.article>
      </div>
    </section>
  );
}

function Projects() {
  return (
    <section id="projetos" className="border-y border-white/10 bg-white/[0.025] py-24 light:border-slate-200 light:bg-slate-50">
      <div className="section-shell">
        <SectionHeader
          eyebrow="Projetos"
          title="Projetos pessoais e estudos."
          copy="Uma seleção de projetos de aprendizado, experimentos e trabalhos acadêmicos desenvolvidos fora do ambiente profissional."
        />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          variants={stagger}
          className="grid gap-5 lg:grid-cols-2"
        >
          {projects.map((project) => (
            <motion.article
              key={project.title}
              variants={fadeUp}
              whileHover={{ y: -4 }}
              className="glass-card flex flex-col rounded-[2rem] p-6"
            >
              <h3 className="font-display text-2xl font-extrabold text-steel-100 light:text-ink-900">
                {project.title}
              </h3>
              <p className="mt-4 flex-1 leading-7 text-steel-300 light:text-slate-600">
                {project.description}
              </p>
              <motion.a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="mt-6 inline-flex w-fit min-h-11 items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.07] px-5 py-3 text-sm font-extrabold text-steel-100 transition-colors hover:border-acid-400/60 hover:bg-acid-400/10 light:border-slate-200 light:bg-white light:text-ink-900 light:hover:border-acid-500/60"
              >
                <Icon icon="skill-icons:github-dark" width={20} height={20} />
                Ver no GitHub
                <Icon icon="solar:arrow-right-up-linear" width={16} height={16} />
              </motion.a>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section id="depoimentos" className="py-24">
      <div className="section-shell">
        <SectionHeader
          eyebrow="Depoimentos"
          title="O que dizem quem trabalhou comigo."
          copy="Feedbacks de colegas e orientadores sobre colaboração, entrega e qualidade técnica."
        />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          variants={stagger}
          className="grid gap-5 lg:grid-cols-3"
        >
          {testimonials.map((t) => (
            <motion.article
              key={t.name}
              variants={fadeUp}
              whileHover={{ y: -4 }}
              className="glass-card flex flex-col gap-5 rounded-[2rem] p-6"
            >
              <Icon icon="solar:quote-up-bold" className="text-acid-400/60" width={28} height={28} />
              <p className="flex-1 leading-7 text-steel-300 light:text-slate-600">{t.text}</p>
              <div className="flex items-center gap-3 border-t border-white/10 pt-5 light:border-slate-200">
                <div className="grid size-10 shrink-0 place-items-center rounded-full bg-acid-400/15 font-display text-sm font-extrabold text-acid-400">
                  {t.initials}
                </div>
                <div>
                  <p className="font-bold text-steel-100 light:text-ink-900">{t.name}</p>
                  <p className="text-xs text-steel-500 light:text-slate-500">{t.role}</p>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function Contact() {
  const [status, setStatus] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

    if (!serviceId || !templateId || !publicKey) {
      const data = new FormData(form);
      const subject = encodeURIComponent(String(data.get("subject") || "Contato pelo portfólio"));
      const body = encodeURIComponent(
        `Nome: ${data.get("name")}\nEmail: ${data.get("email")}\n\n${data.get("message")}`,
      );
      window.location.href = `mailto:VitorCostalv@proton.me?subject=${subject}&body=${body}`;
      setStatus("EmailJS não configurado. Abrindo email direto.");
      return;
    }

    setStatus("Enviando...");

    try {
      await emailjs.sendForm(serviceId, templateId, form, { publicKey });
      form.reset();
      setStatus("Mensagem enviada.");
    } catch {
      setStatus("Falha no envio. Use o email direto ou LinkedIn.");
    }
  }

  return (
    <section id="contato" className="border-t border-white/10 py-24 light:border-slate-200">
      <div className="section-shell">
        <SectionHeader
          eyebrow="Contato"
          title="Vamos transformar regra complexa em interface previsível."
          copy="Use o formulário com EmailJS, email direto ou LinkedIn."
        />

        <div className="grid gap-6 lg:grid-cols-[1fr_.8fr]">
          <motion.form
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={fadeUp}
            onSubmit={handleSubmit}
            className="glass-card grid gap-4 rounded-[2rem] p-6"
          >
            <label className="grid gap-2 text-sm font-bold text-steel-200 light:text-slate-700">
              Nome
              <input name="name" required className="rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 font-medium outline-none transition-colors focus:border-acid-400 light:border-slate-200 light:bg-white" />
            </label>
            <label className="grid gap-2 text-sm font-bold text-steel-200 light:text-slate-700">
              Email
              <input name="email" type="email" required className="rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 font-medium outline-none transition-colors focus:border-acid-400 light:border-slate-200 light:bg-white" />
            </label>
            <label className="grid gap-2 text-sm font-bold text-steel-200 light:text-slate-700">
              Assunto
              <input name="subject" required className="rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 font-medium outline-none transition-colors focus:border-acid-400 light:border-slate-200 light:bg-white" />
            </label>
            <label className="grid gap-2 text-sm font-bold text-steel-200 light:text-slate-700">
              Mensagem
              <textarea name="message" required rows={5} className="resize-none rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 font-medium outline-none transition-colors focus:border-acid-400 light:border-slate-200 light:bg-white" />
            </label>
            <motion.button
              type="submit"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-acid-400 px-5 py-3 text-sm font-extrabold text-ink-950"
            >
              <Icon icon="solar:letter-bold" width={20} height={20} />
              Enviar mensagem
            </motion.button>
            <p className="min-h-5 text-sm font-bold text-acid-400">{status}</p>
          </motion.form>

          <motion.aside
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={stagger}
            className="grid gap-4"
          >
            {[
              ["Email direto", "VitorCostalv@proton.me", "mailto:VitorCostalv@proton.me", "solar:letter-bold"],
              ["LinkedIn", "vitorcostalv", "https://www.linkedin.com/in/vitorcostalv/", "skill-icons:linkedin"],
              ["GitHub", "Vitorcostalv", "https://github.com/Vitorcostalv", "skill-icons:github-dark"],
            ].map(([title, value, href, icon]) => (
              <motion.a
                key={title}
                variants={fadeUp}
                whileHover={{ x: 4 }}
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="glass-card flex items-center gap-4 rounded-3xl p-5"
              >
                <Icon icon={icon} width={34} height={34} />
                <span>
                  <span className="block font-display text-lg font-bold text-steel-100 light:text-ink-900">{title}</span>
                  <span className="text-sm text-steel-500 light:text-slate-500">{value}</span>
                </span>
              </motion.a>
            ))}
          </motion.aside>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <About />
      <Stack />
      <Experience />
      <Projects />
      <Testimonials />
      <Contact />
      <footer className="border-t border-white/10 py-8 light:border-slate-200">
        <div className="section-shell flex flex-col gap-2 text-sm text-steel-500 light:text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>Feito com React/TypeScript + Tailwind.</p>
          <p>© 2026 Vitor Costa.</p>
        </div>
      </footer>
    </main>
  );
}
