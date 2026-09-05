import { InView } from "@/components/in-view";
import { Reveal } from "@/components/reveal";
import { SceneWord } from "@/components/scene-word";
import { about } from "@/content/portfolio";

/**
 * Ordem de entrada deliberada: palavra de transição → headline → parágrafo →
 * marginalia. As notas continuam sendo uma lista de definição, nunca cards.
 */
export function About() {
  return (
    <section id="sobre" className="defer-paint pb-28 pt-24 sm:pb-36 sm:pt-32">
      <div className="shell">
        {/* Transição tipográfica que separa o hero da primeira cena. */}
        <SceneWord index="01" className="lg:pl-[8%]">
          Sobre
        </SceneWord>

        <div className="mt-16 grid gap-12 lg:mt-24 lg:grid-cols-12 lg:gap-x-10">
          <Reveal className="lg:col-span-5">
            <h3 className="display text-[clamp(1.9rem,6.4vw,2.8rem)] lg:text-[clamp(2rem,3.2vw,3.1rem)]">
              {about.title}
            </h3>
          </Reveal>

          {/* Texto principal deslocado: começa na coluna 7, nunca alinhado ao título */}
          <Reveal className="lg:col-span-6 lg:col-start-7 lg:pt-3" delay={0.16}>
            <p className="prose-measure text-[1.125rem] leading-[1.75]">{about.body}</p>
          </Reveal>

          {/* Marginalia: notas curtas em cascata, entram por último */}
          <InView as="dl" className="seq mt-4 grid gap-x-10 gap-y-7 sm:grid-cols-3 lg:col-span-9 lg:col-start-4">
            {about.notes.map((note) => (
              <div key={note.term} className="border-t border-[var(--rule)] pt-4">
                <dt className="font-mono text-[0.625rem] uppercase tracking-seal text-brass">
                  {note.term}
                </dt>
                <dd className="mt-3 text-sm leading-6 text-parchment-dim">{note.note}</dd>
              </div>
            ))}
          </InView>
        </div>
      </div>
    </section>
  );
}
