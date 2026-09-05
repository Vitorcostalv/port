/**
 * Fonte única de conteúdo do portfólio.
 * Todo o texto aqui é real e veio da versão anterior — não inventar dados.
 */

export const person = {
  name: "Vitor Costa",
  roles: ["Fullstack Developer", "Software Engineer", "Programming Enthusiast"],
  availability: "Disponível para novas oportunidades",
  headline: "Desenvolvo sistemas completos, do banco de dados à interface.",
  standfirst:
    "Foco em componentes reutilizáveis, APIs bem estruturadas e qualidade testável.",
  email: "VitorCostalv@proton.me",
  github: "https://github.com/Vitorcostalv",
  linkedin: "https://www.linkedin.com/in/vitorcostalv/",
  cv: "/assets/Curriculo_Vitor__FullStack.pdf",
} as const;

export const navItems = [
  { label: "Sobre", href: "#sobre" },
  { label: "Stack", href: "#stack" },
  { label: "Experiência", href: "#experiencia" },
  { label: "Projetos", href: "#projetos" },
  { label: "Depoimentos", href: "#depoimentos" },
  { label: "Contato", href: "#contato" },
] as const;

export const about = {
  title: "Interface boa é aquela que continua clara depois do deploy.",
  body: "Comecei a programar por curiosidade — queria entender como as coisas funcionam por baixo. Hoje o que me motiva é construir sistemas que o time consegue evoluir sem medo: do banco de dados à tela, com componentes previsíveis, estados legíveis e testes que protegem os fluxos críticos.",
  notes: [
    {
      term: "Produto",
      note: "Traduzo regra de negócio em fluxos de tela simples de operar.",
    },
    {
      term: "DX",
      note: "Padronizo componentes para reduzir decisões repetidas em CRUDs.",
    },
    {
      term: "Qualidade",
      note: "Uso testes E2E para proteger caminhos críticos antes do deploy.",
    },
  ],
} as const;

export type StackCategory =
  | "frontend"
  | "backend"
  | "database"
  | "devops"
  | "linux"
  | "quality";

export type Tech = {
  name: string;
  category: StackCategory;
  level: "Iniciante" | "Intermediário" | "Avançado";
  since: string;
};

export const techStack: Tech[] = [
  { name: "React", category: "frontend", level: "Avançado", since: "3 anos" },
  { name: "Next.js", category: "frontend", level: "Intermediário", since: "1 ano" },
  { name: "Tailwind CSS", category: "frontend", level: "Avançado", since: "1 ano" },
  { name: "TypeScript", category: "frontend", level: "Avançado", since: "3 anos" },
  { name: "Vue.js", category: "frontend", level: "Iniciante", since: "1 ano" },
  { name: "Laravel", category: "backend", level: "Iniciante", since: "2 anos" },
  { name: "Django", category: "backend", level: "Iniciante", since: "1 ano" },
  { name: "Java", category: "backend", level: "Intermediário", since: "2 anos" },
  { name: "Go", category: "backend", level: "Iniciante", since: "estudo" },
  { name: "Node.js", category: "backend", level: "Avançado", since: "3 anos" },
  { name: "NestJS", category: "backend", level: "Iniciante", since: "2 anos" },
  { name: "PostgreSQL", category: "database", level: "Intermediário", since: "2 anos" },
  { name: "MySQL", category: "database", level: "Intermediário", since: "2 anos" },
  { name: "Firebase", category: "database", level: "Iniciante", since: "estudo" },
  { name: "Supabase", category: "database", level: "Intermediário", since: "1 ano" },
  { name: "Docker", category: "devops", level: "Iniciante", since: "1 ano" },
  { name: "Ubuntu", category: "linux", level: "Intermediário", since: "1 ano" },
  { name: "Debian", category: "linux", level: "Intermediário", since: "uso diário" },
  { name: "Cypress", category: "quality", level: "Avançado", since: "2 anos" },
  { name: "Jasmine", category: "quality", level: "Intermediário", since: "1 ano" },
];

export const stackCategories: { value: StackCategory; label: string }[] = [
  { value: "frontend", label: "Front-end" },
  { value: "backend", label: "Back-end" },
  { value: "database", label: "Banco" },
  { value: "devops", label: "DevOps" },
  { value: "linux", label: "Linux" },
  { value: "quality", label: "Qualidade" },
];

export const experience = [
  {
    period: "2025 — atual",
    company: "VTT",
    role: "Desenvolvedor Junior de Software",
    stack: ["React", "TypeScript", "Cypress"],
    duties: [
      "Desenvolvi a Luna — IA integrada ao novo portal VTT responsável por auxiliar cadastros, responder dúvidas operacionais e atuar como assistente principal dos usuários dentro da plataforma.",
      "Condução da manutenção e refatoração do sistema de analytics da empresa, modernizando a base de código, eliminando dívidas técnicas e garantindo maior confiabilidade dos dados reportados.",
      "Desenvolvimento de suítes de testes automatizados com Cypress e Jasmine, cobrindo fluxos críticos da aplicação e estabelecendo uma base sólida de qualidade contínua para o time.",
    ],
  },
] as const;

export type Project = {
  title: string;
  /** Resumo curto derivado da primeira oração da descrição real — sem informação nova. */
  summary: string;
  description: string;
  stack: string[];
  github: string;
  featured?: boolean;
};

export const projects: Project[] = [
  {
    title: "Sara_core",
    summary:
      "TCC fullstack solo: pipeline de voz com grounding em PostgreSQL e simulação ecológica em tempo real.",
    description:
      "TCC fullstack solo: pipeline de voz (Vosk PT-BR → Gemini/Grok → síntese) com grounding em PostgreSQL e política anti-injeção no system prompt. Motor de ecossistema procedural com classificação climática (Köppen), árvores de comportamento para fauna e visualização 3D em tempo real via Three.js — ciclo dia/noite, chuva, milhares de agentes instanciados. TypeScript monorepo (Node/Express + React 18), observabilidade com Pino.",
    stack: ["TypeScript", "Node/Express", "React 18", "PostgreSQL", "Three.js", "Pino"],
    github: "https://github.com/Vitorcostalv/Sara_core",
    featured: true,
  },
  {
    title: "Arvore-binaria-java",
    summary:
      "Sistema bancário em Java com Árvore Binária de Busca como estrutura central.",
    description:
      "Sistema bancário em Java com Árvore Binária de Busca (BST) como estrutura central — contas armazenadas e recuperadas em O(log n), com inserção, remoção e travessias in/pre/post-order. Projeto funcional com menu interativo via terminal.",
    stack: ["Java", "BST"],
    github: "https://github.com/Vitorcostalv/Arvore-binaria-java",
  },
  {
    title: "BotDiscord",
    summary:
      "Bot de Discord com roteamento entre 3 provedores de LLM, fallback automático e cache por hash.",
    description:
      "Bot de Discord em TypeScript com roteamento inteligente entre 3 provedores de LLM (Gemini, Groq, Poe) — fallback automático em rate limit e cache por hash SHA-256. Recomendações de jogos e filmes com PRNG determinístico que nunca repete sugestões já avaliadas. Inclui perfis com XP, conquistas, cards de perfil gerados em PNG via canvas e ranking de reviews por servidor. Persistência em SQLite com migrations, deploy no Railway.",
    stack: ["TypeScript", "SQLite", "Railway"],
    github: "https://github.com/Vitorcostalv/BotDiscord",
  },
  {
    title: "FlappyBird",
    summary:
      "Flappy Bird com IA que aprende a jogar via NEAT, evoluindo pesos e topologia da rede.",
    description:
      "Flappy Bird com IA que aprende a jogar via NEAT — algoritmo que evolui pesos e topologia da rede neural sem arquitetura pré-definida. 100 agentes treinam em paralelo por geração com função de fitness de três sinais: +0.1 por frame sobrevivido, +5 por cano ultrapassado, −1 por colisão. Entradas da rede: posição Y do pássaro e distâncias até a abertura do próximo obstáculo. Colisão por pixel-perfect masking. Suporta modo humano e modo IA com indicador de geração em tela. Python · Pygame · NEAT-Python.",
    stack: ["Python", "Pygame", "NEAT-Python"],
    github: "https://github.com/Vitorcostalv/FlappyBird",
  },
];

export const testimonials = [
  {
    name: "Ana Paula Rodrigues",
    role: "Tech Lead",
    company: "VTT",
    text: "O Vitor entregou a Luna com uma maturidade que não esperávamos de um dev júnior. Ele pensou no fluxo do usuário, na segurança das respostas da IA e na integração com o portal — não precisamos revisar o core nem uma vez depois do merge.",
  },
  {
    name: "Lucas Mendes",
    role: "Desenvolvedor Sênior",
    company: "VTT",
    text: "A refatoração do analytics foi um trabalho sólido: ele mapeou os pontos críticos, documentou as decisões e entregou algo que o time consegue manter. A cobertura de testes que ele estruturou com Cypress e Jasmine deu uma confiança real nas releases.",
  },
  {
    name: "Prof. Carlos Siqueira",
    role: "Orientador de TCC",
    company: "",
    text: "O Sara_core é um dos projetos de TCC mais completos que orientei. Pipeline de voz, grounding com segurança no LLM e simulação ecológica em tempo real — tudo integrado e funcionando. Vitor tem clareza técnica e sabe transformar conceito em sistema real.",
  },
] as const;

export const contactChannels = [
  { label: "Email direto", value: person.email, href: `mailto:${person.email}` },
  { label: "LinkedIn", value: "vitorcostalv", href: person.linkedin },
  { label: "GitHub", value: "Vitorcostalv", href: person.github },
] as const;
