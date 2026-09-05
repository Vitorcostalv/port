"use client";

import { m } from "framer-motion";
import { AstrolabeStage } from "@/components/astrolabe/astrolabe-stage";
import { ArrowUpRightIcon, DownloadIcon, GithubIcon, LinkedinIcon } from "@/components/icons";
import { CornerMark } from "@/components/ornaments";
import { person } from "@/content/portfolio";

export function Hero() {
  // Sem ramificar por media query: o MotionConfig do provider cuida do
  // prefers-reduced-motion, e a árvore fica igual no servidor e no cliente.
  const enter = (delay: number) => ({
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, delay, ease: [0.22, 0.61, 0.36, 1] as const },
  });

  return (
    <section id="hero" className="relative pt-[calc(var(--header-h)+2.5rem)] sm:pt-[calc(var(--header-h)+4rem)]">
      <div className="shell">
        <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-10">
          {/* Coluna editorial — primeira no DOM e primeira na tela do celular */}
          <div className="lg:col-span-6 lg:pb-16">
            <m.div {...enter(0.15)} className="flex items-center gap-3">
              <span className="size-1.5 rounded-full bg-brass" aria-hidden />
              <p className="font-mono text-[0.6875rem] uppercase tracking-seal text-brass">
                {person.availability}
              </p>
            </m.div>

            <m.p
              {...enter(0.2)}
              className="mt-9 font-display text-3xl font-light tracking-[0.02em] text-parchment"
            >
              {person.name}
            </m.p>

            <m.p
              {...enter(0.85)}
              className="mt-2 font-mono text-[0.6875rem] uppercase tracking-[0.22em] text-parchment-dim"
            >
              {person.roles.join(" · ")}
            </m.p>

            <m.h1
              {...enter(0.3)}
              className="display mt-8 text-balance text-[clamp(2.2rem,9.4vw,4.6rem)] sm:text-[clamp(3rem,7vw,5.4rem)]"
            >
              {person.headline}
            </m.h1>

            <m.p {...enter(0.85)} className="prose-measure mt-8">
              {person.standfirst}
            </m.p>

            <m.div {...enter(1.05)} className="mt-10 flex flex-wrap gap-3">
              <a
                href={person.github}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-brass"
              >
                <GithubIcon />
                GitHub
                <ArrowUpRightIcon />
              </a>
              <a
                href={person.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-brass"
              >
                <LinkedinIcon />
                LinkedIn
                <ArrowUpRightIcon />
              </a>
              <a href={person.cv} download className="btn-brass">
                <DownloadIcon />
                Currículo
              </a>
            </m.div>
          </div>

          {/* Instrumento — fora do grid de texto, deslocado e sangrando à direita */}
          {/* A cena e o instrumento têm coreografia própria, em CSS
              (.anim-scene entra em 0.15s, .anim-instrument em 0.55s).
              Animar de novo aqui duplicaria o fade. */}
          <div className="relative w-full lg:col-span-6 lg:col-start-7 lg:-mr-6 xl:-mr-16">
            <CornerMark className="absolute -left-2 -top-2 z-10" />
            <CornerMark className="absolute -bottom-2 -right-2 z-10" />
            <AstrolabeStage />
          </div>
        </div>
      </div>

      {/* filete de fechamento do hero, deslocado do centro */}
      <div className="shell mt-16 sm:mt-20">
        <div className="flex items-center gap-6">
          <span className="font-mono text-[0.625rem] uppercase tracking-seal text-parchment-dim/70">
            Rolar
          </span>
          <span className="h-px flex-1 bg-[var(--rule)]" aria-hidden />
        </div>
      </div>
    </section>
  );
}
