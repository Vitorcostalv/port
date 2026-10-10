/**
 * Fonte única de conteúdo do portfólio.
 * Todo o texto aqui é real e veio da versão anterior — não inventar dados.
 */

export const person = {
  name: "Vitor Costa",
  roles: ["Fullstack Developer", "Software Engineer", "Programming Enthusiast"],
  availability: "Aberto a novas vagas",
  headline: "Desenvolvo aplicações web.",
  standfirst:
    "React, TypeScript, APIs e IA.",
  email: "VitorCostalv@proton.me",
  github: "https://github.com/Vitorcostalv",
  linkedin: "https://www.linkedin.com/in/vitorcostalv/",
  cv: "/assets/Vitor_Costa_Developer.pdf",
} as const;

export const navItems = [
  { label: "Sobre", href: "#sobre" },
  { label: "Stack", href: "#stack" },
  { label: "Experiência", href: "#experiencia" },
  { label: "Projetos", href: "#projetos" },
  { label: "Contato", href: "#contato" },
] as const;

export const about = {
  title: "Web e integrações com IA.",
  body: "Trabalho com React, TypeScript e APIs. Também desenvolvo integrações com IA usando RAG e MCP.",
} as const;

export type StackCategory =
  | "frontend"
  | "backend"
  | "database"
  | "devops"
  | "linux"
  | "quality"
  | "ai";

export type Tech = {
  name: string;
  category: StackCategory;
  icon: string;
};

export const techStack: Tech[] = [
  { name: "React", category: "frontend", icon: "/icons/react.svg" },
  { name: "Next.js", category: "frontend", icon: "/icons/nextdotjs.svg" },
  { name: "Tailwind CSS", category: "frontend", icon: "/icons/tailwindcss.svg" },
  { name: "TypeScript", category: "frontend", icon: "/icons/typescript.svg" },
  { name: "Vue.js", category: "frontend", icon: "/icons/vuedotjs.svg" },
  { name: "Laravel", category: "backend", icon: "/icons/laravel.svg" },
  { name: "Django", category: "backend", icon: "/icons/django.svg" },
  { name: "Java", category: "backend", icon: "/icons/openjdk.svg" },
  { name: "Go", category: "backend", icon: "/icons/go.svg" },
  { name: "Node.js", category: "backend", icon: "/icons/nodedotjs.svg" },
  { name: "NestJS", category: "backend", icon: "/icons/nestjs.svg" },
  { name: "PostgreSQL", category: "database", icon: "/icons/postgresql.svg" },
  { name: "MySQL", category: "database", icon: "/icons/mysql.svg" },
  { name: "Firebase", category: "database", icon: "/icons/firebase.svg" },
  { name: "Supabase", category: "database", icon: "/icons/supabase.svg" },
  { name: "Docker", category: "devops", icon: "/icons/docker.svg" },
  { name: "Ubuntu", category: "linux", icon: "/icons/ubuntu.svg" },
  { name: "Debian", category: "linux", icon: "/icons/debian.svg" },
  { name: "Cypress", category: "quality", icon: "/icons/cypress.svg" },
  { name: "Jasmine", category: "quality", icon: "/icons/jasmine.svg" },
  { name: "MCP", category: "ai", icon: "/icons/modelcontextprotocol.svg" },
  { name: "RAG", category: "ai", icon: "/icons/rag.svg" },
];

export const stackCategories: { value: StackCategory; label: string }[] = [
  { value: "frontend", label: "Front-end" },
  { value: "backend", label: "Back-end" },
  { value: "database", label: "Banco" },
  { value: "devops", label: "DevOps" },
  { value: "linux", label: "Linux" },
  { value: "quality", label: "Testes" },
  { value: "ai", label: "IA e integrações" },
];

export const experience = [
  {
    period: "2025 — outubro de 2026",
    company: "VTT",
    role: "Desenvolvedor Junior de Software",
    stack: ["React", "TypeScript", "Cypress"],
    duties: [
      "Desenvolvi a Luna, assistente de IA do portal VTT para cadastros e dúvidas dos usuários.",
      "Fiz a manutenção e a refatoração do sistema de analytics da empresa.",
      "Criei testes automatizados com Cypress e Jasmine para os principais fluxos do portal.",
    ],
  },
  {
    period: "Último semestre",
    company: "Universidade Cruzeiro do Sul",
    role: "Bacharelado em Ciência da Computação",
    stack: ["Formação acadêmica"],
    duties: [
      "Atualmente cursando o último semestre da graduação em Ciência da Computação.",
    ],
  },
] as const;

export type Project = {
  title: string;
  summary: string;
  description: string;
  stack: string[];
  github: string;
  demo: string;
  preview: string;
  previewAlt: string;
};

export const projects: Project[] = [
  {
    title: "SONDA",
    summary: "Investigue a segurança e a qualidade de websites com evidências reais.",
    description: "Observatório digital que analisa HTTPS, headers, cookies e HTML de páginas públicas. A versão online funciona sem Docker, com relatórios privados, histórico, projetos, comparação e exportação JSON/PDF. Mostra a cobertura da análise e as verificações inconclusivas. O modo completo opcional usa um navegador isolado para screenshots e acessibilidade automatizada.",
    stack: ["Next.js", "TypeScript", "React", "Vercel Blob", "Playwright", "Vitest"],
    github: "https://github.com/Vitorcostalv/sonda",
    demo: "https://sonda-snowy.vercel.app/",
    preview: "/projects/sonda.png",
    previewAlt: "SONDA com radar orbital, formulário de diagnóstico de websites e módulos de segurança, privacidade, acessibilidade, performance e SEO.",
  },
  {
    title: "CLT vs PJ",
    summary: "Compare o valor líquido de propostas CLT e PJ.",
    description: "Calcula descontos, impostos e o ponto de equilíbrio entre CLT e PJ. Permite compartilhar a comparação pela URL.",
    stack: ["Next.js", "TypeScript", "React", "Vitest"],
    github: "https://github.com/Vitorcostalv/clt-vs-pj",
    demo: "https://clt-vs-pj-alpha.vercel.app/",
    preview: "/projects/clt-vs-pj.png",
    previewAlt: "Calculadora CLT vs PJ com comparação de propostas, holerite e guia do Simples Nacional.",
  },
  {
    title: "Fósforo",
    summary: "Redes neurais aprendendo a jogar Flappy Bird.",
    description: "Simulação com NEAT, visualização das redes e gráficos de evolução. Permite ajustar o treino, editar fases e jogar contra a IA.",
    stack: ["Next.js", "TypeScript", "Canvas", "Web Workers", "NEAT"],
    github: "https://github.com/Vitorcostalv/fosforo",
    demo: "https://fosforo-lab.vercel.app/",
    preview: "/projects/fosforo.png",
    previewAlt: "Laboratório Fósforo com simulação de pássaros, rede neural, gráficos e parâmetros de evolução.",
  },
  {
    title: "Tarja",
    summary: "Identifique dados pessoais e sensíveis em schemas SQL.",
    description: "Analisa schemas MySQL, sinaliza possíveis dados pessoais e sensíveis e gera um rascunho de inventário. Mostra o motivo de cada classificação para revisão.",
    stack: ["Next.js", "TypeScript", "MySQL / DDL", "Vitest"],
    github: "https://github.com/Vitorcostalv/tarja",
    demo: "https://tarja-lgpd.vercel.app/",
    preview: "/projects/tarja.png",
    previewAlt: "Tarja analisando colunas de um schema SQL com categorias, confiança e explicação de um dado sensível.",
  },
];

export const contactChannels = [
  { label: "Email direto", value: person.email, href: `mailto:${person.email}` },
  { label: "LinkedIn", value: "vitorcostalv", href: person.linkedin },
  { label: "GitHub", value: "Vitorcostalv", href: person.github },
] as const;
