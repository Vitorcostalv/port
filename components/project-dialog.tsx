"use client";

import { Dialog } from "@base-ui/react/dialog";
import { ArrowUpRightIcon, CloseIcon, GithubIcon } from "@/components/icons";
import { AstrolabeSeal } from "@/components/ornaments";
import { ProjectArtifact } from "@/components/project-artifacts";
import type { Project } from "@/content/portfolio";

export function ProjectDialog({
  project,
  triggerClassName = "",
}: {
  project: Project;
  triggerClassName?: string;
}) {
  return (
    <Dialog.Root>
      <Dialog.Trigger
        className={`link-draw inline-flex min-h-11 items-center pb-0.5 font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-parchment-dim transition-colors duration-300 hover:text-brass-hi ${triggerClassName}`}
      >
        Ver detalhes
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-[60] bg-[rgba(9,11,10,0.86)] backdrop-blur-sm" />
        <Dialog.Popup className="fixed left-1/2 top-1/2 z-[70] max-h-[85svh] w-[min(46rem,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 overflow-y-auto border border-[var(--rule)] bg-stone p-6 outline-none sm:p-10">
          <div className="flex items-start justify-between gap-6">
            <div className="flex items-start gap-4">
              <AstrolabeSeal className="mt-1 shrink-0" size={28} />
              <div>
                <Dialog.Title className="display text-3xl sm:text-4xl">
                  {project.title}
                </Dialog.Title>
                <p className="mt-3 font-mono text-[0.625rem] uppercase tracking-[0.18em] text-brass">
                  {project.stack.join("  ·  ")}
                </p>
              </div>
            </div>

            <Dialog.Close
              className="grid size-11 shrink-0 place-items-center border border-[var(--rule)] text-parchment transition-colors duration-300 hover:border-brass hover:text-brass-hi"
              aria-label="Fechar detalhes"
            >
              <CloseIcon size={18} />
            </Dialog.Close>
          </div>

          <div className="mt-8 h-px w-full bg-[var(--rule)]" />

          <ProjectArtifact title={project.title} className="mx-auto mt-8 max-w-[26rem]" />

          <Dialog.Description className="mt-8 text-[1.0625rem] leading-[1.75] text-parchment-dim">
            {project.description}
          </Dialog.Description>

          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-brass mt-10"
          >
            <GithubIcon />
            Ver no GitHub
            <ArrowUpRightIcon />
          </a>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
