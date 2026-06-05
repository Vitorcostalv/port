"use client";

import emailjs from "@emailjs/browser";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { FormEvent, useEffect, useMemo, useState } from "react";

const navItems = [
  { label: "Sobre", href: "#sobre" },
  { label: "Stack", href: "#stack" },
  { label: "Experiência", href: "#experiencia" },
  { label: "Projetos", href: "#projetos" },
  { label: "Contato", href: "#contato" },
];

const roles = ["Web Developer", "Programming Enthusiast", "Software Engineer"];

const techCategories = [
  { label: "Todos", value: "all" },
  { label: "Front-end", value: "frontend" },
  { label: "Back-end", value: "backend" },
  { label: "Banco", value: "database" },
  { label: "DevOps", value: "devops" },
  { label: "Linux", value: "linux" },
  { label: "Qualidade", value: "quality" },
];

const techStack = [
  {
    name: "React",
    icon: "skill-icons:react-dark",
    category: "frontend",
    level: "Intermediário",
    since: "2 anos",
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
    level: "Intermediário",
    since: "1 ano",
  },
  {
    name: "TypeScript",
    icon: "skill-icons:typescript",
    category: "frontend",
    level: "Intermediário",
    since: "2 anos",
  },
  {
    name: "Vue.js",
    icon: "devicon:vuejs",
    category: "frontend",
    level: "Iniciante",
    since: "estudo",
  },
  {
    name: "Laravel",
    icon: "devicon:laravel",
    category: "backend",
    level: "Iniciante",
    since: "estudo",
  },
  {
    name: "Django",
    icon: "material-icon-theme:django",
    category: "backend",
    level: "Iniciante",
    since: "estudo",
  },
  {
    name: "Java",
    icon: "devicon:java",
    category: "backend",
    level: "Iniciante",
    since: "estudo",
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
    level: "Intermediário",
    since: "1 ano",
  },
  {
    name: "NestJS",
    icon: "devicon:nestjs",
    category: "backend",
    level: "Iniciante",
    since: "estudo",
  },
  {
    name: "PostgreSQL",
    icon: "logos:postgresql",
    category: "database",
    level: "Intermediário",
    since: "1 ano",
  },
  {
    name: "MySQL",
    icon: "devicon:mysql",
    category: "database",
    level: "Intermediário",
    since: "1 ano",
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
    since: "estudo",
  },
  {
    name: "Ubuntu",
    icon: "devicon:ubuntu",
    category: "linux",
    level: "Intermediário",
    since: "uso diário",
  },
  {
    name: "Debian",
    icon: "devicon:debian",
    category: "linux",
    level: "Iniciante",
    since: "estudo",
  },
  {
    name: "Cypress",
    icon: "skill-icons:cypress-dark",
    category: "quality",
    level: "Intermediário",
    since: "1 ano",
  },
];

const projects = [
  {
    title: "Grid & Modais Genéricos",
    type: "Componente interno",
    image: "/assets/genericGrid.png",
    description:
      "Base reutilizável para CRUDs com filtros, modais de criação/edição, clone e derivação.",
    features: [
      "Estados padronizados para tabelas e formulários",
      "Combos dinâmicos e filtros hora-only",
      "Fluxo previsível para squads manterem telas novas",
    ],
    stack: ["React", "TypeScript", "TanStack Table", "Styled-Components"],
    impact: "-42% tempo para criar novas telas",
  },
  {
    title: "Suíte de Testes E2E",
    type: "Qualidade em produção",
    image: "/assets/Suite de Testes E2E.png",
    description:
      "Organização de testes Cypress para cobrir fluxos críticos de CRUD, filtros e modais.",
    features: [
      "Helpers para combos, toasts e fechamento de modais",
      "Cobertura por tipo de fluxo: create, update e filter",
      "Triagem mais rápida de regressões antes do deploy",
    ],
    stack: ["Cypress", "TypeScript", "React"],
    impact: "+9pp de cobertura E2E nos fluxos acompanhados",
  },
  {
    title: "Finanças Lite",
    type: "App pessoal",
    image: "/assets/finance-life.png",
    description:
      "Aplicação para controlar contas, categorias e transferências com segurança por usuário.",
    features: [
      "Modelagem com enums e policies RLS",
      "Autenticação e isolamento de dados por usuário",
      "Interface focada em lançamentos e filtros rápidos",
    ],
    stack: ["React", "Supabase", "PostgreSQL", "TypeScript"],
    impact: "Base pronta para evoluir produto financeiro pessoal",
  },
  {
    title: "Newton's Cannon 3D",
    type: "Experimento interativo",
    image: "/assets/canhão.png",
    description:
      "Simulação visual do canhão de Newton com órbitas, colisões e controle de velocidade.",
    features: [
      "Cena 3D com parâmetros ajustáveis",
      "Pausa automática em colisão",
      "UI mínima para manter foco no experimento",
    ],
    stack: ["Three.js", "JavaScript", "CSS"],
    impact: "Estudo aplicado de física, renderização e UX de controles",
  },
];

const metrics = [
  { value: "-42%", label: "tempo p/ nova tela" },
  { value: "+33%", label: "componentes reutilizáveis" },
  { value: "+9pp", label: "cobertura E2E" },
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
            Disponível para desafios 2026
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
            Front-end developer que transforma CRUDs complexos em interfaces previsíveis,
            testáveis e fáceis de manter.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-9 flex flex-col gap-3 sm:flex-row">
            <MotionLink href="https://github.com/Vitorcostalv" label="GitHub" icon="skill-icons:github-dark" />
            <MotionLink href="https://www.linkedin.com/in/vitor-costa-b177a5312/" label="LinkedIn" icon="skill-icons:linkedin" />
            <MotionLink href="/assets/Curriculo.pdf" label="Baixar CV" icon="solar:download-bold" download />
          </motion.div>
        </motion.div>

        <motion.div
          initial={false}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="glass-card relative rounded-[2rem] p-5"
        >
          <div className="absolute -right-10 -top-10 size-32 rounded-full bg-acid-400/15 blur-2xl" />
          <div className="rounded-[1.5rem] border border-white/10 bg-ink-900/86 p-5 light:border-slate-200 light:bg-white">
            <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4 light:border-slate-200">
              <div>
                <p className="text-sm font-bold text-steel-100 light:text-ink-900">Impacto recente</p>
                <p className="text-xs text-steel-500 light:text-slate-500">Métricas de contexto interno</p>
              </div>
              <Icon icon="solar:chart-bold" className="text-acid-400" width={28} height={28} />
            </div>
            <div className="mt-5 grid gap-3">
              {metrics.map((metric) => (
                <div key={metric.label} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 light:border-slate-200 light:bg-slate-50">
                  <p className="font-display text-3xl font-extrabold text-acid-400">{metric.value}</p>
                  <p className="mt-1 text-sm text-steel-300 light:text-slate-600">{metric.label}</p>
                </div>
              ))}
            </div>
            <p className="mt-5 text-xs leading-5 text-steel-500 light:text-slate-500">
              Nota: métricas estimadas a partir de tarefas internas similares antes/depois
              da padronização de grid, modais e testes E2E.
            </p>
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
          copy="Meu foco é construir telas internas que diminuem retrabalho: componentes previsíveis, estados legíveis, testes de fluxo e documentação suficiente para o time seguir evoluindo."
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
  const [active, setActive] = useState("all");
  const visibleTech = useMemo(
    () => (active === "all" ? techStack : techStack.filter((tech) => tech.category === active)),
    [active],
  );

  return (
    <section id="stack" className="border-y border-white/10 bg-white/[0.025] py-24 light:border-slate-200 light:bg-slate-50">
      <div className="section-shell">
        <SectionHeader
          eyebrow="Tech Arsenal"
          title="Stack com contexto, nível e uso real."
          copy="A filtragem continua, mas cada tecnologia agora aparece com logo oficial, nível declarado e tempo de uso para evitar lista solta sem contexto."
        />

        <div className="mb-8 flex flex-wrap gap-2">
          {techCategories.map((category) => (
            <button
              key={category.value}
              type="button"
              onClick={() => setActive(category.value)}
              className={`rounded-full border px-4 py-2 text-sm font-bold transition-all duration-300 ${
                active === category.value
                  ? "border-acid-400 bg-acid-400 text-ink-950"
                  : "border-white/10 bg-white/[0.05] text-steel-300 hover:border-acid-400/50 light:border-slate-200 light:bg-white light:text-slate-700"
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        <motion.div
          key={active}
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {visibleTech.map((tech) => (
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
              <h3 className="mt-5 font-display text-lg font-bold text-steel-100 light:text-ink-900">{tech.name}</h3>
              <p className="mt-2 text-sm text-steel-500 light:text-slate-500">{tech.since}</p>
            </motion.article>
          ))}
        </motion.div>
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
              Padronização de CRUDs com grid e modais reutilizáveis.
            </li>
            <li className="rounded-2xl bg-white/[0.04] p-4 light:bg-slate-50">
              Estruturação de testes E2E com helpers para fluxos recorrentes.
            </li>
            <li className="rounded-2xl bg-white/[0.04] p-4 light:bg-slate-50">
              Apoio em dashboards e componentes para manter consistência visual.
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
          title="Cases com problema, feature e impacto."
          copy="Os cards mantêm o diferencial das métricas, mas agora explicam o que cada projeto faz antes de vender o resultado."
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
              className="glass-card overflow-hidden rounded-[2rem]"
            >
              <img src={project.image} alt="" className="h-56 w-full object-cover" />
              <div className="p-6">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="font-display text-2xl font-extrabold text-steel-100 light:text-ink-900">{project.title}</h3>
                  <span className="rounded-full bg-acid-400/10 px-3 py-1 text-xs font-bold text-acid-400">
                    {project.type}
                  </span>
                </div>
                <p className="mt-4 leading-7 text-steel-300 light:text-slate-600">{project.description}</p>

                <div className="mt-6">
                  <p className="text-sm font-extrabold text-steel-100 light:text-ink-900">Key Features</p>
                  <ul className="mt-3 grid gap-2 text-sm text-steel-300 light:text-slate-600">
                    {project.features.map((feature) => (
                      <li key={feature} className="flex gap-2">
                        <Icon icon="solar:check-circle-bold" className="mt-0.5 shrink-0 text-acid-400" width={18} height={18} />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                  {project.stack.map((item) => (
                    <span key={item} className="rounded-full border border-white/10 px-3 py-1 text-xs font-bold text-steel-300 light:border-slate-200 light:text-slate-600">
                      {item}
                    </span>
                  ))}
                </div>

                <p className="mt-6 rounded-2xl border border-acid-400/25 bg-acid-400/10 p-4 font-bold text-acid-400">
                  {project.impact}
                </p>
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
    <section id="contato" className="py-24">
      <div className="section-shell">
        <SectionHeader
          eyebrow="Contato"
          title="Vamos transformar regra complexa em interface previsível."
          copy="Use o formulário com EmailJS, email direto ou LinkedIn. Sem QR Code e sem roadmap antigo ocupando espaço."
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
              ["LinkedIn", "vitor-costa-b177a5312", "https://www.linkedin.com/in/vitor-costa-b177a5312/", "skill-icons:linkedin"],
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
