import { OrnamentRule } from "@/components/ornaments";
import { person } from "@/content/portfolio";

export function SiteFooter() {
  return (
    <footer className="pb-14 pt-4">
      <div className="shell">
        <OrnamentRule offset={0.5} />
        <div className="mt-8 flex flex-col gap-3 font-mono text-[0.625rem] uppercase tracking-[0.18em] text-parchment-dim/70 sm:flex-row sm:items-center sm:justify-between">
          <p>Feito com React/TypeScript + Tailwind.</p>
          <p>© 2026 {person.name}.</p>
        </div>
      </div>
    </footer>
  );
}
