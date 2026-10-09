import Image from "next/image";
import { InView } from "@/components/in-view";
import { Reveal } from "@/components/reveal";
import { stackCategories, techStack } from "@/content/portfolio";

export function Stack() {
  return (
    <section id="stack" aria-labelledby="stack-titulo" className="defer-paint border-y border-[var(--rule-faint)] bg-stone-deep py-16 sm:py-24">
      <div className="shell">
        <Reveal>
          <h2 id="stack-titulo" className="display text-[clamp(2rem,7vw,3rem)]">Stack</h2>
        </Reveal>
        <div className="mt-8 sm:mt-12">
          {stackCategories.map((category) => (
            <InView key={category.value} amount={0.12} className="grid gap-y-4 border-t border-[var(--rule)] py-6 lg:grid-cols-12 lg:gap-x-10">
              <h3 className="font-mono text-[0.6875rem] uppercase leading-6 tracking-seal text-brass lg:col-span-3">{category.label}</h3>
              <ul className="seq grid grid-cols-2 gap-x-4 sm:grid-cols-3 lg:col-span-9">
                {techStack.filter((tech) => tech.category === category.value).map((tech) => (
                  <li key={tech.name} className="flex min-w-0 items-center gap-3 py-3">
                    <Image src={tech.icon} alt="" width={24} height={24} className="shrink-0" />
                    <span className="text-sm leading-5 text-parchment sm:text-base">{tech.name}</span>
                  </li>
                ))}
              </ul>
            </InView>
          ))}
        </div>
      </div>
    </section>
  );
}
