"use client";

import { m } from "framer-motion";
import { HeroInstrument } from "@/components/hero-instrument";
import { ArrowUpRightIcon, DownloadIcon, GithubIcon, LinkedinIcon } from "@/components/icons";
import { person } from "@/content/portfolio";

/**
 * O hero é um trilho, não uma tela.
 *
 * No desktop a coluna editorial ocupa o topo, os links descem ~52vh e o filete
 * fecha lá embaixo: isso dá ~130vh de percurso durante os quais o astrolábio
 * fica preso (sticky) e é conduzido pelo scroll. No mobile todos os offsets de
 * viewport somem e volta a ser uma seção comum, na ordem de leitura.
 */
export function Hero() {
  // Sem ramificar por media query: o MotionConfig do provider cuida do
  // prefers-reduced-motion, e a árvore fica igual no servidor e no cliente.
  const enter = (delay: number) => ({
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, delay, ease: [0.22, 0.61, 0.36, 1] as const },
  });

  return (
    // `overflow-x-clip` e não `overflow-hidden`: `clip` recorta a sangria do
    // instrumento sem criar contêiner de rolagem — se criasse, o sticky de
    // dentro passaria a grudar nele em vez de na viewport.
    <section
      id="hero"
      className="relative overflow-x-clip pt-[calc(var(--header-h)+2.5rem)] sm:pt-[calc(var(--header-h)+4rem)]"
    >
      <div className="shell relative z-10">
        <div className="grid lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-6">
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

            {/* Headline oversized: continua sendo o maior elemento da página. */}
            <m.h1
              {...enter(0.3)}
              className="display mt-8 text-balance text-[clamp(2.4rem,10vw,4.8rem)] sm:text-[clamp(3.2rem,7.4vw,5.8rem)]"
            >
              {person.headline}
            </m.h1>

            <m.p {...enter(0.85)} className="prose-measure mt-8">
              {person.standfirst}
            </m.p>

            {/* Segundo tempo da coluna: só aparece meia viewport depois, e é ele
                que estica o trilho do instrumento no desktop. */}
            <m.div {...enter(1.05)} className="mt-10 flex flex-wrap gap-3 lg:mt-[52vh]">
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
        </div>
      </div>

      {/* Instrumento: no desktop vira camada sobre todo o trilho acima. */}
      <HeroInstrument />

      {/* filete de fechamento do hero, deslocado do centro */}
      <div className="shell relative z-10 mt-16 sm:mt-20">
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
