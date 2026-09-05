"use client";

import { m } from "framer-motion";

/**
 * Transição tipográfica entre cenas: a palavra da seção entra oversized.
 *
 * `letter-spacing` é propriedade de layout, então é animado UMA vez, numa
 * transição discreta de 0.9s — nunca preso ao scroll. `contain: layout` fecha o
 * reflow dentro do próprio elemento. Fora isso só transform e opacity.
 *
 * Com `prefers-reduced-motion` o MotionConfig do provider reduz a transição a
 * opacidade, e a palavra aparece no estado final.
 */
export function SceneWord({
  children,
  index,
  className = "",
  size = "text-[clamp(3.2rem,14vw,9.5rem)]",
}: {
  children: string;
  /** Número editorial da seção, em mono. */
  index: string;
  className?: string;
  size?: string;
}) {
  return (
    <div className={className}>
      <m.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.5, ease: [0.22, 0.61, 0.36, 1] }}
        className="eyebrow"
      >
        {index}
      </m.p>

      <m.h2
        initial={{ opacity: 0, scale: 0.92, letterSpacing: "0.16em" }}
        whileInView={{ opacity: 1, scale: 1, letterSpacing: "-0.025em" }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.9, ease: [0.22, 0.61, 0.36, 1] }}
        style={{ contain: "layout", transformOrigin: "left center" }}
        className={`display mt-5 leading-[0.86] ${size}`}
      >
        {children}
      </m.h2>
    </div>
  );
}
