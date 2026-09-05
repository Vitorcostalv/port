import { InView } from "@/components/in-view";
import { OrnamentRule } from "@/components/ornaments";
import { Reveal } from "@/components/reveal";
import { testimonials } from "@/content/portfolio";

/**
 * Cada bloco ocupa uma faixa diferente da página e o do meio alinha à direita.
 * A quebra é só o suficiente para o olho não ler três blocos idênticos —
 * nada de masonry.
 */
const LAYOUT = [
  { box: "lg:ml-0 lg:mr-[26%]", quote: "text-[clamp(1.5rem,3.9vw,2.15rem)]", align: "", x: -22 },
  { box: "lg:ml-[26%] lg:mr-0", quote: "text-[clamp(1.3rem,3.2vw,1.75rem)]", align: "lg:text-right", x: 26 },
  { box: "lg:ml-[10%] lg:mr-[16%]", quote: "text-[clamp(1.4rem,3.5vw,1.95rem)]", align: "", x: -14 },
];

export function Testimonials() {
  return (
    <section id="depoimentos" className="defer-paint py-28 sm:py-36">
      <div className="shell">
        <Reveal className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="eyebrow">
              <span className="text-parchment-dim/60">05 </span>Depoimentos
            </p>
            <h2 className="display mt-6 max-w-[20ch] text-[clamp(2rem,7vw,3rem)]">
              O que dizem quem trabalhou comigo.
            </h2>
          </div>
          <p className="max-w-[34ch] text-sm leading-6 text-parchment-dim lg:pb-3 lg:text-right">
            Feedbacks de colegas e orientadores sobre colaboração, entrega e qualidade técnica.
          </p>
        </Reveal>

        <InView className="mt-14">
          <OrnamentRule className="rule-sweep" offset={0.24} />
        </InView>

        <div className="mt-6">
          {testimonials.map((item, index) => (
            <Reveal
              key={item.name}
              delay={0.04 * index}
              y={12}
              x={LAYOUT[index % LAYOUT.length].x}
              className={`border-t border-[var(--rule-faint)] py-12 ${LAYOUT[index % LAYOUT.length].box}`}
            >
              <figure className={`relative ${LAYOUT[index % LAYOUT.length].align}`}>
                <span
                  className={`pointer-events-none absolute -top-8 select-none font-display text-[7rem] leading-none text-brass/25 sm:-top-10 sm:text-[9rem] ${
                    LAYOUT[index % LAYOUT.length].align
                      ? "-left-1 sm:left-auto sm:-right-6"
                      : "-left-1 sm:-left-8"
                  }`}
                  aria-hidden
                >
                  &ldquo;
                </span>

                <blockquote
                  className={`relative font-display font-light leading-[1.45] text-parchment ${
                    LAYOUT[index % LAYOUT.length].quote
                  }`}
                >
                  {item.text}
                </blockquote>

                <figcaption
                  className={`mt-8 flex flex-wrap items-baseline gap-x-4 gap-y-1 ${
                    LAYOUT[index % LAYOUT.length].align ? "lg:justify-end" : ""
                  }`}
                >
                  <span className="h-px w-10 translate-y-[-0.3em] bg-brass" aria-hidden />
                  <span className="font-mono text-[0.75rem] uppercase tracking-[0.18em] text-parchment">
                    {item.name}
                  </span>
                  <span className="font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-parchment-dim/80">
                    {item.company ? `${item.role} · ${item.company}` : item.role}
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
