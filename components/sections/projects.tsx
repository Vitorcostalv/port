import { ArrowUpRightIcon, GithubIcon } from "@/components/icons";
import { EngravedPlate } from "@/components/ornaments";
import { ProjectArtifact } from "@/components/project-artifacts";
import { ProjectDialog } from "@/components/project-dialog";
import { Reveal } from "@/components/reveal";
import { projects } from "@/content/portfolio";

export function Projects() {
  const featured = projects.find((project) => project.featured);
  const rest = projects.filter((project) => !project.featured);

  return (
    <section
      id="projetos"
      className="defer-paint relative overflow-hidden border-y border-[var(--rule-faint)] bg-stone-deep py-28 sm:py-36"
    >
      {/* gravura parcialmente fora do grid, sangrando pela direita */}
      <EngravedPlate
        className="pointer-events-none absolute -right-40 top-20 hidden h-[46rem] w-[46rem] text-parchment opacity-[0.05] lg:block"
      />

      <div className="shell relative">
        <Reveal>
          <p className="eyebrow">
            <span className="text-parchment-dim/60">04 </span>Projetos
          </p>
          <h2 className="display mt-6 max-w-[20ch] text-[clamp(2rem,7vw,3rem)]">
            Projetos pessoais e estudos.
          </h2>
        </Reveal>

        {featured ? (
          <Reveal className="mt-16 border-t border-[var(--rule)] pt-10" delay={0.06}>
            <div className="grid gap-8 lg:grid-cols-12 lg:gap-x-10">
              <div className="lg:col-span-2">
                <p className="font-mono text-[0.625rem] uppercase tracking-seal text-brass">
                  Destaque
                </p>
              </div>

              <div className="lg:col-span-6">
                <h3 className="display text-[clamp(2.4rem,8vw,4.4rem)]">{featured.title}</h3>

                <p className="prose-measure mt-6 text-[1.125rem]">{featured.summary}</p>

                <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
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
              </div>

              {/* artefato técnico: o pipeline real, desenhado como gravura */}
              <div className="lg:col-span-4 lg:pt-4">
                <p className="font-mono text-[0.625rem] uppercase tracking-seal text-parchment-dim/60">
                  Pipeline
                </p>
                <ProjectArtifact title={featured.title} className="mt-5 max-w-[24rem]" />
              </div>
            </div>
          </Reveal>
        ) : null}

        {/* Demais projetos: lista editorial compacta, sem repetir o card do destaque */}
        <ul className="mt-20">
          {rest.map((project, index) => (
            <li key={project.title}>
              <Reveal
                delay={0.03 * index}
                className="grid gap-3 border-t border-[var(--rule-faint)] py-8 lg:grid-cols-12 lg:items-baseline lg:gap-x-10"
              >
                <p className="font-mono text-[0.625rem] tracking-[0.2em] text-brass lg:col-span-1">
                  {String(index + 2).padStart(2, "0")}
                </p>

                <div className="lg:col-span-3">
                  <h3 className="font-display text-2xl font-medium text-parchment">
                    {project.title}
                  </h3>
                  <ProjectArtifact
                    title={project.title}
                    className="mt-4 max-w-[15rem] opacity-90"
                  />
                </div>

                <p className="text-sm leading-6 text-parchment-dim lg:col-span-5">
                  {project.summary}
                </p>

                <div className="mt-2 flex flex-wrap items-center gap-x-6 gap-y-2 lg:col-span-3 lg:mt-0 lg:justify-end">
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
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
