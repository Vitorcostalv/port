import { AstrolabeSeal } from "@/components/ornaments";
import { Reveal } from "@/components/reveal";
import { experience } from "@/content/portfolio";

export function Experience() {
  return (
    <section id="experiencia" className="defer-paint py-28 sm:py-36">
      <div className="shell">
        <Reveal className="lg:pl-[25%]">
          <p className="eyebrow">
            <span className="text-parchment-dim/60">03 </span>Experiência
          </p>
          <h2 className="display mt-6 max-w-[16ch] text-[clamp(2rem,7vw,3rem)]">
            Entrega com foco em manutenção.
          </h2>
          <p className="prose-measure mt-6 text-base">
            A narrativa aqui é simples: menos tela reescrita, mais padrão reutilizável e mais
            confiança nos fluxos críticos.
          </p>
        </Reveal>

        <ol className="mt-20">
          {experience.map((entry) => (
            <li key={`${entry.company}-${entry.period}`}>
              <Reveal className="grid gap-6 border-t border-[var(--rule)] pt-8 lg:grid-cols-12 lg:gap-x-10">
                {/* coluna de data, estreita */}
                <div className="flex items-start gap-4 lg:col-span-3 lg:flex-col lg:gap-5">
                  <AstrolabeSeal className="shrink-0" />
                  <p className="font-mono text-[0.6875rem] uppercase tracking-seal text-brass">
                    {entry.period}
                  </p>
                </div>

                <div className="lg:col-span-9">
                  <h3 className="display text-[clamp(2rem,6vw,3.2rem)]">{entry.company}</h3>
                  <p className="mt-2 font-mono text-[0.75rem] uppercase tracking-[0.2em] text-parchment-dim">
                    {entry.role}
                  </p>
                  <p className="mt-4 font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-brass/80">
                    {entry.stack.join("  ·  ")}
                  </p>

                  <div className="mt-10 grid gap-px bg-[var(--rule-faint)] lg:grid-cols-3">
                    {entry.duties.map((duty, index) => (
                      <div key={duty} className="bg-night pt-6 lg:px-6 lg:first:pl-0 lg:last:pr-0">
                        <p className="font-mono text-[0.625rem] tracking-[0.2em] text-brass">
                          {String(index + 1).padStart(2, "0")}
                        </p>
                        <p className="mt-3 text-sm leading-6 text-parchment-dim">{duty}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
