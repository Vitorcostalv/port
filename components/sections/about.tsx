import { Reveal } from "@/components/reveal";
import { about } from "@/content/portfolio";

export function About() {
  return (
    <section id="sobre" className="defer-paint py-28 sm:py-36">
      <div className="shell">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-x-10">
          <Reveal className="lg:col-span-5">
            <p className="eyebrow">
              <span className="text-parchment-dim/60">01 </span>Sobre
            </p>
            <h2 className="display mt-6 text-[clamp(2rem,7vw,3rem)] lg:text-[clamp(2.2rem,3.4vw,3.4rem)]">
              {about.title}
            </h2>
          </Reveal>

          {/* Texto principal deslocado: começa na coluna 7, nunca alinhado ao título */}
          <Reveal className="lg:col-span-6 lg:col-start-7 lg:pt-3" delay={0.08}>
            <p className="prose-measure text-[1.125rem] leading-[1.75]">{about.body}</p>
          </Reveal>

          {/* Marginalia: notas curtas, não cards */}
          <Reveal className="lg:col-span-9 lg:col-start-4" delay={0.14}>
            <dl className="mt-4 grid gap-x-10 gap-y-7 sm:grid-cols-3">
              {about.notes.map((note) => (
                <div key={note.term} className="border-t border-[var(--rule)] pt-4">
                  <dt className="font-mono text-[0.625rem] uppercase tracking-seal text-brass">
                    {note.term}
                  </dt>
                  <dd className="mt-3 text-sm leading-6 text-parchment-dim">{note.note}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
