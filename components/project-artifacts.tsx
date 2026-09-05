/**
 * Artefatos técnicos dos projetos: diagramas de linha fina, no espírito de
 * gravura de manual de engenharia.
 *
 * REGRA: cada elemento aqui corresponde a algo escrito na descrição real do
 * projeto em `content/portfolio.ts`. Nada de arquitetura inventada — quando os
 * dados não sustentam um diagrama, `ProjectArtifact` devolve null e a seção
 * simplesmente não mostra artefato nenhum.
 */

const STROKE = "rgba(221,209,183,.34)";
const BRASS = "rgba(209,173,103,.85)";
const BRASS_DIM = "rgba(177,138,72,.5)";

type ArtifactProps = { className?: string };

function Frame({
  children,
  label,
  viewBox,
  className = "",
}: {
  children: React.ReactNode;
  label: string;
  viewBox: string;
  className?: string;
}) {
  return (
    <figure className={`w-full ${className}`}>
      <svg
        viewBox={viewBox}
        className="w-full"
        role="img"
        aria-label={label}
        preserveAspectRatio="xMidYMid meet"
      >
        {children}
      </svg>
    </figure>
  );
}

/** Etiqueta em mono, do mesmo tamanho ótico das marcações editoriais da página. */
function Tag({
  x,
  y,
  children,
  anchor = "middle",
  brass = false,
}: {
  x: number;
  y: number;
  children: string;
  anchor?: "start" | "middle" | "end";
  brass?: boolean;
}) {
  return (
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      fill={brass ? BRASS : "rgba(169,158,136,.9)"}
      fontSize="7.5"
      letterSpacing="1.1"
      style={{ fontFamily: "var(--font-mono), monospace", textTransform: "uppercase" }}
    >
      {children}
    </text>
  );
}

function Node({ x, y, r = 4.5 }: { x: number; y: number; r?: number }) {
  return <circle cx={x} cy={y} r={r} fill="#090b0a" stroke={BRASS} strokeWidth="1" />;
}

/**
 * Sara_core — pipeline de voz descrito literalmente nos dados:
 * "Vosk PT-BR → Gemini/Grok → síntese", com grounding em PostgreSQL.
 */
function SaraCoreArtifact({ className }: ArtifactProps) {
  const y = 34;
  const stops: [number, string][] = [
    [34, "Vosk PT-BR"],
    [124, "Gemini / Grok"],
    [214, "Síntese"],
  ];

  return (
    <Frame
      viewBox="0 0 260 104"
      label="Pipeline de voz do Sara_core: Vosk PT-BR, Gemini ou Grok, síntese, com grounding em PostgreSQL."
      className={className}
    >
      <g stroke={STROKE} fill="none" strokeWidth="1">
        <line x1="8" y1={y} x2="248" y2={y} />
        {/* grounding: sai do estágio do LLM e desce para o banco */}
        <path d={`M124 ${y + 6} L124 72`} strokeDasharray="3 3" />
        <line x1="66" y1="72" x2="182" y2="72" />
      </g>

      {stops.map(([x, label]) => (
        <g key={label}>
          <Node x={x} y={y} />
          <Tag x={x} y={y - 13}>
            {label}
          </Tag>
        </g>
      ))}

      {/* setas de fluxo */}
      <g fill={BRASS_DIM}>
        <path d={`M76 ${y - 3} l6 3 -6 3 z`} />
        <path d={`M166 ${y - 3} l6 3 -6 3 z`} />
      </g>

      <rect x="66" y="63" width="116" height="18" fill="#090b0a" stroke={BRASS_DIM} strokeWidth="1" />
      <Tag x={124} y={75} brass>
        PostgreSQL · grounding
      </Tag>
    </Frame>
  );
}

/**
 * Arvore-binaria-java — os dados nomeiam a estrutura (BST) e a complexidade
 * O(log n). Os nós ficam sem rótulo de propósito: qualquer valor concreto
 * seria invenção.
 */
function BstArtifact({ className }: ArtifactProps) {
  const edges: [number, number, number, number][] = [
    [130, 22, 78, 56],
    [130, 22, 182, 56],
    [78, 56, 46, 88],
    [78, 56, 110, 88],
    [182, 56, 214, 88],
  ];
  const nodes: [number, number][] = [
    [130, 22],
    [78, 56],
    [182, 56],
    [46, 88],
    [110, 88],
    [214, 88],
  ];

  return (
    <Frame
      viewBox="0 0 260 104"
      label="Árvore binária de busca com raiz, dois níveis de filhos e busca em O(log n)."
      className={className}
    >
      <g stroke={STROKE} strokeWidth="1" fill="none">
        {edges.map(([x1, y1, x2, y2]) => (
          <line key={`${x1}-${y1}-${x2}-${y2}`} x1={x1} y1={y1} x2={x2} y2={y2} />
        ))}
      </g>
      {nodes.map(([x, y]) => (
        <Node key={`${x}-${y}`} x={x} y={y} r={5} />
      ))}
      {/* caminho de busca destacado: raiz → esquerda → esquerda */}
      <g stroke={BRASS} strokeWidth="1.2" fill="none">
        <line x1="130" y1="22" x2="78" y2="56" />
        <line x1="78" y1="56" x2="46" y2="88" />
      </g>
      <Tag x={252} y={26} anchor="end" brass>
        O(log n)
      </Tag>
    </Frame>
  );
}

/**
 * BotDiscord — os três provedores são nomeados nos dados (Gemini, Groq, Poe),
 * assim como o fallback em rate limit e o cache por hash SHA-256.
 */
function BotDiscordArtifact({ className }: ArtifactProps) {
  const providers = ["Gemini", "Groq", "Poe"];

  return (
    <Frame
      viewBox="0 0 260 104"
      label="Roteamento entre três provedores de LLM com fallback em rate limit e cache por hash SHA-256."
      className={className}
    >
      <g stroke={STROKE} fill="none" strokeWidth="1">
        <line x1="10" y1="52" x2="52" y2="52" />
        {providers.map((_, i) => {
          const y = 22 + i * 30;
          return <path key={i} d={`M76 52 L96 52 L96 ${y} L128 ${y}`} />;
        })}
        {/* fallback: desce de um provedor ao seguinte */}
        <path d="M186 22 L204 22 L204 52 L186 52" strokeDasharray="3 3" />
        <path d="M186 52 L204 52 L204 82 L186 82" strokeDasharray="3 3" />
      </g>

      <rect x="52" y="44" width="24" height="16" fill="#090b0a" stroke={BRASS_DIM} strokeWidth="1" />
      <Tag x={31} y={48} anchor="middle">
        Cache
      </Tag>
      <Tag x={31} y={62} anchor="middle">
        SHA-256
      </Tag>

      {providers.map((name, i) => {
        const y = 22 + i * 30;
        return (
          <g key={name}>
            <rect
              x="128"
              y={y - 9}
              width="58"
              height="18"
              fill="#090b0a"
              stroke={i === 0 ? BRASS : BRASS_DIM}
              strokeWidth="1"
            />
            <Tag x={157} y={y + 3} brass={i === 0}>
              {name}
            </Tag>
          </g>
        );
      })}

      <Tag x={252} y={100} anchor="end">
        Fallback em rate limit
      </Tag>
    </Frame>
  );
}

/**
 * FlappyBird — os dados dizem que o NEAT "evolui pesos e topologia da rede sem
 * arquitetura pré-definida". Desenhar uma camada oculta fixa seria inventar
 * arquitetura: aqui aparecem só as entradas reais, a saída, e o miolo marcado
 * como topologia que evolui.
 */
function NeatArtifact({ className }: ArtifactProps) {
  const inputs: [number, string][] = [
    [26, "Posição Y"],
    [62, "Distância"],
  ];

  return (
    <Frame
      viewBox="0 0 260 104"
      label="Rede NEAT: entradas de posição Y e distância até a abertura, topologia que evolui, uma saída."
      className={className}
    >
      {/* região de topologia variável — tracejada porque não é pré-definida */}
      <rect
        x="96"
        y="16"
        width="76"
        height="72"
        fill="none"
        stroke={BRASS_DIM}
        strokeWidth="1"
        strokeDasharray="4 4"
      />

      <g stroke={STROKE} fill="none" strokeWidth="1">
        {inputs.map(([y]) => (
          <line key={y} x1="76" y1={y + 18} x2="96" y2={y + 18} />
        ))}
        <line x1="172" y1="52" x2="196" y2="52" />
      </g>

      {inputs.map(([y, label]) => (
        <g key={label}>
          <Node x={76} y={y + 18} />
          <Tag x={68} y={y + 21} anchor="end">
            {label}
          </Tag>
        </g>
      ))}

      <Tag x={134} y={49} brass>
        Topologia
      </Tag>
      <Tag x={134} y={62}>
        evolui
      </Tag>

      <Node x={196} y={52} r={5} />
      <Tag x={206} y={55} anchor="start">
        Saída
      </Tag>

      <Tag x={134} y={99}>
        100 agentes / geração
      </Tag>
    </Frame>
  );
}

const ARTIFACTS: Record<string, (props: ArtifactProps) => React.JSX.Element> = {
  Sara_core: SaraCoreArtifact,
  "Arvore-binaria-java": BstArtifact,
  BotDiscord: BotDiscordArtifact,
  FlappyBird: NeatArtifact,
};

export function ProjectArtifact({
  title,
  className,
}: {
  title: string;
  className?: string;
}) {
  const Artifact = ARTIFACTS[title];
  if (!Artifact) return null;
  return <Artifact className={className} />;
}
