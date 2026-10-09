import Image from "next/image";
import { ArrowUpRightIcon } from "@/components/icons";
import type { Project } from "@/content/portfolio";

export function ProjectPreview({ project }: { project: Project }) {
  return (
    <a href={project.demo} target="_blank" rel="noopener noreferrer" aria-label={`Explorar demo de ${project.title} em nova aba`} className="group block overflow-hidden border border-[var(--rule)] bg-stone transition-colors duration-300 hover:border-brass focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brass-hi">
      <div className="flex min-h-11 items-center gap-3 border-b border-[var(--rule)] px-4 py-3">
        <span aria-hidden="true" className="flex shrink-0 gap-1.5">{[0, 1, 2].map((dot) => <span key={dot} className="size-1.5 rounded-full bg-brass/50" />)}</span>
        <span className="min-w-0 flex-1 truncate font-mono text-[0.625rem] text-parchment-dim">{new URL(project.demo).hostname}</span>
        <ArrowUpRightIcon size={14} />
      </div>
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image src={project.preview} alt={project.previewAlt} fill sizes="(min-width: 1024px) 55vw, 100vw" className="object-cover object-top transition-transform duration-500 motion-safe:group-hover:scale-[1.025]" />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[var(--rule)] px-4 py-3 font-mono text-[0.625rem] uppercase tracking-[0.12em]">
        <span className="text-parchment-dim">Preview da aplicação</span>
        <span className="inline-flex items-center gap-2 text-brass-hi">Explorar demo <ArrowUpRightIcon size={14} /></span>
      </div>
    </a>
  );
}
