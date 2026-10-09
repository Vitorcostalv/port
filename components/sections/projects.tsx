import { ArrowUpRightIcon, GithubIcon } from "@/components/icons";
import { InView } from "@/components/in-view";
import { ProjectDialog } from "@/components/project-dialog";
import { ProjectPreview } from "@/components/project-preview";
import { NeuralNetwork } from "@/components/neural-network";
import { projects } from "@/content/portfolio";

export function Projects() {
  return (
    <section id="projetos" aria-labelledby="projetos-titulo" className="relative overflow-x-clip border-b border-[var(--rule-faint)] bg-stone-deep py-16 sm:py-24">
      <div className="shell relative">
        <div className="mb-8 grid items-center gap-6 border-b border-[var(--rule)] pb-8 sm:mb-12 lg:grid-cols-2">
          <div>
            <p className="eyebrow text-brass">Da ideia à aplicação</p>
            <h2 id="projetos-titulo" className="display mt-5 text-[clamp(2rem,6vw,3.5rem)]">Experimente o que construí.</h2>
            <p className="mt-5 max-w-[44ch] leading-7 text-parchment-dim">Calculadoras, redes neurais e dados. Três experiências para explorar direto no navegador.</p>
          </div>
          <NeuralNetwork />
        </div>
        <ul>
          {projects.map((project, index) => (
            <li key={project.github}>
              <InView amount={0.12} className="seq grid gap-8 border-b border-[var(--rule)] py-10 sm:gap-10 sm:py-16 lg:grid-cols-12 lg:items-center lg:gap-x-12">
                <div className="min-w-0 lg:col-span-5">
                  <p className="font-mono text-[0.625rem] uppercase tracking-[0.2em] text-brass">{String(index + 1).padStart(2, "0")} / Projeto pessoal</p>
                  <h3 className="display mt-5 text-[clamp(2.4rem,7vw,4.2rem)]">{project.title}</h3>
                  <p className="mt-6 max-w-[38ch] text-[1.0625rem] leading-[1.7] text-parchment-dim">{project.summary}</p>
                  <ul aria-label={`Tecnologias de ${project.title}`} className="mt-7 flex flex-wrap gap-x-5 gap-y-3">
                    {project.stack.map((item) => <li key={item} className="font-mono text-[0.625rem] uppercase tracking-[0.16em] text-parchment-dim">{item}</li>)}
                  </ul>
                  <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
                    <a href={project.demo} target="_blank" rel="noopener noreferrer" aria-label={`Abrir demo de ${project.title} em nova aba`} className="btn-brass">Abrir demo <ArrowUpRightIcon /></a>
                    <a href={project.github} target="_blank" rel="noopener noreferrer" aria-label={`Ver código de ${project.title} no GitHub`} className="link-draw inline-flex min-h-11 items-center gap-2 font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-parchment"><GithubIcon /> GitHub</a>
                    <ProjectDialog project={project} />
                  </div>
                </div>
                <div className="min-w-0 lg:col-span-7"><ProjectPreview project={project} /></div>
              </InView>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
