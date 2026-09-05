"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Media query como fonte externa: `useSyncExternalStore` evita o padrão
 * `useEffect + setState` que pisca na hidratação. O snapshot de servidor é
 * sempre `false` — a coreografia de scroll é enriquecimento, então o HTML
 * nasce no estado estático e o desktop assume depois.
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    [query],
  );

  const getSnapshot = useCallback(() => window.matchMedia(query).matches, [query]);

  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}

/**
 * Verdadeiro só onde a coreografia completa faz sentido: tela larga e sem
 * `prefers-reduced-motion`. No mobile e em movimento reduzido as seções
 * mantêm tipografia, hierarquia, SVG e conteúdo — sem scrubbing nem parallax.
 */
export function useSceneMotion(): boolean {
  return useMediaQuery("(min-width: 1024px) and (prefers-reduced-motion: no-preference)");
}
