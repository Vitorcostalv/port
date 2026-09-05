import { Reveal } from "@/components/reveal";
import { OrnamentRule } from "@/components/ornaments";
import { stackCategories, techStack } from "@/content/portfolio";

const LEVEL_STEPS: Record<string, number> = {
  Iniciante: 1,
  Intermediário: 2,
  Avançado: 3,
};

/** Três marcas: preenchidas conforme o nível declarado. Não é barra de progresso —
 *  é a mesma informação textual, gravada. */
function LevelMark({ level }: { level: string }) {
  const filled = LEVEL_STEPS[level] ?? 0;
  return (
    <span className="inline-flex items-center gap-[3px]" aria-hidden>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className={`block h-2.5 w-px ${i < filled ? "bg-brass-hi" : "bg-[var(--rule)]"}`}
        />
      ))}
    </span>
  );
}

export function Stack() {
  return (
    <section id="stack" className="defer-paint border-y border-[var(--rule-faint)] bg-stone-deep py-28 sm:py-36">
      <div className="shell">
        <Reveal>
          <p className="eyebrow">
            <span className="text-parchment-dim/60">02 </span>Índice técnico
          </p>
          <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
            <h2 className="display max-w-[18ch] text-[clamp(2rem,7vw,3rem)]">
              Stack com contexto, nível e uso real.
            </h2>
            <p className="max-w-[38ch] text-sm leading-6 text-parchment-dim lg:pb-3">
              Tecnologias organizadas por categoria com nível declarado e tempo de uso para dar
              contexto real a cada item.
            </p>
          </div>
        </Reveal>

        <OrnamentRule className="mt-12" offset={0.68} />

        <div className="mt-4">
          {stackCategories.map((category, categoryIndex) => {
            const items = techStack.filter((tech) => tech.category === category.value);
            if (items.length === 0) return null;

            return (
              <Reveal
                key={category.value}
                delay={0.04}
                className="grid gap-y-4 border-t border-[var(--rule-faint)] py-8 lg:grid-cols-12 lg:gap-x-10"
              >
                <div className="lg:col-span-3">
                  <h3 className="flex items-baseline gap-3 font-mono text-[0.6875rem] uppercase tracking-seal text-brass">
                    <span className="text-parchment-dim/50">
                      {String(categoryIndex + 1).padStart(2, "0")}
                    </span>
                    {category.label}
                  </h3>
                </div>

                <ul className="lg:col-span-9">
                  {items.map((tech) => (
                    <li
                      key={tech.name}
                      className="flex flex-wrap items-baseline gap-x-4 gap-y-1 border-b border-[var(--rule-faint)] py-3 last:border-b-0"
                    >
                      <span className="font-display text-[1.4rem] font-medium leading-snug text-parchment">
                        {tech.name}
                      </span>

                      {/* fio pontilhado de índice — só decorativo, some no mobile */}
                      <span
                        className="hidden h-px flex-1 translate-y-[-0.2em] border-b border-dotted border-[var(--rule)] sm:block"
                        aria-hidden
                      />

                      <span className="flex items-center gap-2.5 font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-parchment-dim/85">
                        <LevelMark level={tech.level} />
                        {tech.level}
                      </span>

                      <span className="w-[8rem] font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-parchment-dim/70 sm:text-right">
                        {tech.since}
                      </span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
