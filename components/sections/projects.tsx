import { ArrowUpRightIcon, GithubIcon } from "@/components/icons";
import { InView } from "@/components/in-view";
import { EngravedPlate } from "@/components/ornaments";
import { ProjectArtifact } from "@/components/project-artifacts";
import { ProjectDialog } from "@/components/project-dialog";
import { Reveal } from "@/components/reveal";
import { projects } from "@/content/portfolio";

/**
 * Cada projeto é uma cena, não um card: nenhuma caixa, nenhuma sombra, nenhum
 * fundo próprio. O que separa um do outro é o filete, a assimetria da coluna e
 * o diagrama técnico sendo desenhado na entrada.
 *
 * O cabeçalho da seção vive na banda pergaminho (`ProjectsOverture`), logo
 * acima — aqui a leitura começa direto no destaque.
 */
export function Projects() {
  const featured = projects.find((project) => project.featured);
  const rest = projects.filter((project) => !project.featured);

  return (
    <section
      id="projetos"
      className="relative overflow-x-clip border-b border-[var(--rule-faint)] bg-stone-deep py-24 sm:py-32"
    >
      {/* gravura parcialmente fora do grid, sangrando pela direita */}
      <EngravedPlate className="pointer-events-none absolute -right-40 top-20 hidden h-[46rem] w-[46rem] text-parchment opacity-[0.05] lg:block" />

      <div className="shell relative">
        {featured ? (
          <div className="grid gap-10 lg:grid-cols-12 lg:items-start lg:gap-x-10">
            {/* Coluna de identificação: presa enquanto a cena passa ao lado.
                É o segundo e último sticky prolongado do site. */}
            <Reveal className="lg:col-span-4 lg:sticky lg:top-[calc(var(--header-h)+3.5rem)] lg:self-start">
              <p className="font-mono text-[0.625rem] uppercase tracking-seal text-brass">
                Destaque
              </p>

              <h3 className="display mt-6 text-[clamp(2.6rem,10vw,4.6rem)]">{featured.title}</h3>

              <ul className="mt-8 flex flex-wrap gap-x-5 gap-y-2">
                {featured.stack.map((item) => (
                  <li
                    key={item}
                    className="font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-parchment-dim/80"
                  >
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
                <a
                  href={featured.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-brass"
                >
                  <GithubIcon />
                  Ver no GitHub
                  <ArrowUpRightIcon />
                </a>
                <ProjectDialog project={featured} />
              </div>
            </Reveal>

            <div className="lg:col-span-7 lg:col-start-6">
              <Reveal>
                <p className="prose-measure text-[clamp(1.2rem,2.4vw,1.6rem)] leading-[1.55] text-parchment">
                  {featured.summary}
                </p>
              </Reveal>

              {/* artefato técnico em escala de cena: o pipeline real, gravado */}
              <div className="mt-14 border-t border-[var(--rule)] pt-8">
                <p className="font-mono text-[0.625rem] uppercase tracking-seal text-parchment-dim/60">
                  Pipeline
                </p>
                <ProjectArtifact title={featured.title} className="mt-8" />
              </div>
            </div>
          </div>
        ) : null}

        {/* Demais projetos: cenas menores, alternando a faixa que ocupam. */}
        <ul className="mt-28 sm:mt-36">
          {rest.map((project, index) => {
            const shifted = index % 2 === 1;
            return (
              <li key={project.title}>
                <InView
                  amount={0.12}
                  className={`seq border-t border-[var(--rule)] py-14 sm:py-20 ${
                    shifted ? "lg:ml-[16%]" : "lg:mr-[12%]"
                  }`}
                  style={
                    {
                      "--seq-step": "90ms",
                      "--seq-x": shifted ? "-18px" : "18px",
                      "--seq-y": "10px",
                    } as React.CSSProperties
                  }
                >
                  <p className="font-mono text-[0.625rem] tracking-[0.2em] text-brass">
                    {String(index + 2).padStart(2, "0")}
                  </p>

                  <h3 className="display mt-5 text-[clamp(2rem,7vw,3.4rem)]">{project.title}</h3>

                  <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:gap-x-10">
                    <p className="text-[1.0625rem] leading-[1.7] text-parchment-dim lg:col-span-6">
                      {project.summary}
                    </p>

                    <div className="lg:col-span-5 lg:col-start-8">
                      <ProjectArtifact title={project.title} className="max-w-[22rem]" />
                    </div>
                  </div>

                  <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3">
                    <ProjectDialog project={project} />
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-draw inline-flex min-h-11 items-center gap-1.5 pb-0.5 font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-parchment transition-colors duration-300 hover:text-brass-hi"
                    >
                      GitHub
                      <ArrowUpRightIcon size={12} />
                    </a>
                  </div>
                </InView>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
