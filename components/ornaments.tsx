/**
 * Ornamentos geométricos e abstratos: astrolábio, cartografia, gravura técnica.
 * Todos são SVG inline, sem preenchimento pesado e sem brasão figurativo.
 */

/** Filete horizontal com nó de instrumento fora do centro (assimetria proposital). */
export function OrnamentRule({
  className = "",
  offset = 0.32,
}: {
  className?: string;
  offset?: number;
}) {
  const x = Math.round(offset * 1000);
  return (
    <svg
      viewBox="0 0 1000 16"
      preserveAspectRatio="none"
      className={`h-4 w-full text-brass ${className}`}
      aria-hidden
      focusable="false"
    >
      <line x1="0" y1="8" x2={x - 26} y2="8" stroke="rgba(221,209,183,.14)" strokeWidth="1" />
      <line x1={x + 26} y1="8" x2="1000" y2="8" stroke="rgba(221,209,183,.14)" strokeWidth="1" />
      <circle cx={x} cy="8" r="6.5" fill="none" stroke="currentColor" strokeWidth="1" opacity=".75" />
      <circle cx={x} cy="8" r="1.6" fill="currentColor" opacity=".8" />
      <line x1={x - 13} y1="4" x2={x - 13} y2="12" stroke="rgba(221,209,183,.14)" strokeWidth="1" />
      <line x1={x + 13} y1="4" x2={x + 13} y2="12" stroke="rgba(221,209,183,.14)" strokeWidth="1" />
    </svg>
  );
}

/** Selo/medalhão mínimo — marcador de item de timeline. */
export function AstrolabeSeal({ className = "", size = 34 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 34 34"
      className={`text-brass ${className}`}
      aria-hidden
      focusable="false"
    >
      <circle cx="17" cy="17" r="16" fill="none" stroke="rgba(221,209,183,.14)" />
      <circle cx="17" cy="17" r="11" fill="none" stroke="currentColor" strokeWidth="1" opacity=".7" />
      <circle cx="17" cy="17" r="2" fill="currentColor" opacity=".85" />
      {/* alidade */}
      <line x1="17" y1="4" x2="17" y2="30" stroke="currentColor" strokeWidth=".75" opacity=".45" />
      <line x1="4" y1="17" x2="30" y2="17" stroke="currentColor" strokeWidth=".75" opacity=".45" />
      {/* graduação em quadrantes */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
        <line
          key={deg}
          x1="17"
          y1="1.5"
          x2="17"
          y2="4.5"
          stroke="currentColor"
          strokeWidth=".9"
          opacity=".55"
          transform={`rotate(${deg} 17 17)`}
        />
      ))}
    </svg>
  );
}

/** Marca cartográfica de canto — cruz de registro fina. */
export function CornerMark({ className = "" }: { className?: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      className={`text-brass/50 ${className}`}
      aria-hidden
      focusable="false"
    >
      <path d="M8 0v16M0 8h16" stroke="currentColor" strokeWidth=".8" />
      <circle cx="8" cy="8" r="3.2" fill="none" stroke="currentColor" strokeWidth=".8" />
    </svg>
  );
}

/**
 * Placa gravada de fundo: círculos concêntricos graduados + retículo,
 * como o dorso de uma mater de astrolábio. Decorativa, opacidade muito baixa.
 */
export function EngravedPlate({ className = "" }: { className?: string }) {
  const ticks = Array.from({ length: 72 }, (_, i) => i * 5);
  return (
    <svg
      viewBox="0 0 400 400"
      className={className}
      aria-hidden
      focusable="false"
    >
      <g stroke="currentColor" fill="none">
        <circle cx="200" cy="200" r="196" strokeWidth=".7" opacity=".5" />
        <circle cx="200" cy="200" r="168" strokeWidth=".7" opacity=".35" />
        <circle cx="200" cy="200" r="118" strokeWidth=".7" opacity=".3" />
        <circle cx="200" cy="200" r="72" strokeWidth=".7" opacity=".25" />
        <line x1="4" y1="200" x2="396" y2="200" strokeWidth=".6" opacity=".22" />
        <line x1="200" y1="4" x2="200" y2="396" strokeWidth=".6" opacity=".22" />
        <line x1="61" y1="61" x2="339" y2="339" strokeWidth=".5" opacity=".14" />
        <line x1="339" y1="61" x2="61" y2="339" strokeWidth=".5" opacity=".14" />
        {ticks.map((deg) => (
          <line
            key={deg}
            x1="200"
            y1="168"
            x2="200"
            y2={deg % 15 === 0 ? 178 : 174}
            strokeWidth=".6"
            opacity={deg % 15 === 0 ? 0.4 : 0.2}
            transform={`rotate(${deg} 200 200)`}
          />
        ))}
      </g>
    </svg>
  );
}
