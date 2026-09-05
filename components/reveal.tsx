"use client";

import { m } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Reveal de seção: só opacity + translate curto, uma vez.
 * A preferência de movimento reduzido é tratada pelo MotionConfig do provider,
 * então a árvore renderizada é idêntica no servidor e no cliente.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 18,
  x = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  /** Deslocamento lateral de entrada — usado para quebrar listas repetitivas. */
  x?: number;
}) {
  return (
    <m.div
      className={className}
      initial={{ opacity: 0, y, x }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 0.61, 0.36, 1] }}
    >
      {children}
    </m.div>
  );
}
