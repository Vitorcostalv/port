"use client";

import { useEffect, useRef, type ReactNode } from "react";

type Tag = "div" | "section" | "figure" | "ul" | "ol" | "li" | "dl";

/**
 * Marca `data-in="true"` uma única vez, quando o bloco entra na viewport.
 *
 * A animação em si é 100% CSS (`.seq`, `.draw-path`, `.rule-sweep` em
 * globals.css). O JS aqui é um IntersectionObserver que dispara uma vez e se
 * desconecta: nenhum estado de React, nenhum rerender, nada por frame.
 */
export function InView({
  children,
  className = "",
  as: Element = "div",
  amount = 0.2,
  style,
}: {
  children: ReactNode;
  className?: string;
  as?: Tag;
  /** Fração visível necessária para disparar (0–1). */
  amount?: number;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || node.dataset.in === "true") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        node.dataset.in = "true";
        observer.disconnect();
      },
      { threshold: Math.min(amount, 1), rootMargin: "0px 0px -6% 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [amount]);

  return (
    <Element
      ref={ref as React.Ref<never>}
      data-in="false"
      className={className}
      style={style}
    >
      {children}
    </Element>
  );
}
