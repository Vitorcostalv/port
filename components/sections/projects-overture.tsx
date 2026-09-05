"use client";

import { m, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useSceneMotion } from "@/lib/motion-mode";

/**
 * A única inversão de cor do site: pergaminho envelhecido sobre tinta quase
 * preta, entre a Experiência e os Projetos. Não é light mode — é uma cena
 * narrativa, e o escuro volta logo depois.
 *
 * A palavra atravessa a viewport horizontalmente conduzida pelo scroll (só
 * `x`/`scale`, nunca left/width). No mobile e em movimento reduzido ela fica
 * parada e grande, sem trilho sticky.
 */
export function ProjectsOverture() {
  const ref = useRef<HTMLElement>(null);
  const scene = useSceneMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const x = useTransform(scrollYProgress, [0, 1], ["9%", "-21%"]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.94, 1.02, 1.08]);

  return (
    <section
      ref={ref}
      aria-labelledby="projetos-abertura"
      className="band-light relative overflow-x-clip py-24 sm:py-28 lg:h-[142vh] lg:py-0"
    >
      <div className="lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:justify-center lg:py-[12vh]">
        <div className="shell">
          <p className="eyebrow">
            <span className="opacity-60">04 </span>Abertura
          </p>
        </div>

        {/* ~120vw de tipografia: o corte pelas bordas é a composição. */}
        <m.p
          aria-hidden
          style={scene ? { x, scale } : undefined}
          className="mt-8 whitespace-nowrap font-display text-[clamp(4.6rem,29vw,24rem)] font-medium leading-[0.8] tracking-[-0.04em] lg:mt-10"
        >
          Projetos
        </m.p>

        <div className="shell mt-8 lg:mt-12">
          <div className="flex flex-col gap-5 border-t border-[var(--rule)] pt-6 lg:flex-row lg:items-baseline lg:justify-between">
            <h2 id="projetos-abertura" className="font-display text-[clamp(1.5rem,4vw,2.4rem)] font-medium leading-tight">
              Projetos pessoais e estudos.
            </h2>
            <p className="max-w-[34ch] font-mono text-[0.6875rem] uppercase leading-6 tracking-[0.16em] opacity-70">
              Quatro repositórios, cada um com o diagrama do que realmente roda por dentro.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
