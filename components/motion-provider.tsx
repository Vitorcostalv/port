"use client";

import { LazyMotion, MotionConfig, domAnimation } from "framer-motion";

/**
 * `domAnimation` carrega só opacity/transform/gestos — nada de layout animation
 * ou drag entra no bundle.
 *
 * `reducedMotion="user"` respeita a preferência do sistema sem trocar a árvore
 * renderizada: ramificar por media query entre servidor e cliente produz
 * hydration mismatch em quem tem "reduzir movimento" ligado.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domAnimation}>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
