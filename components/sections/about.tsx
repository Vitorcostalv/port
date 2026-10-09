import { Reveal } from "@/components/reveal";
import { SceneWord } from "@/components/scene-word";
import { about } from "@/content/portfolio";

export function About() {
  return (
    <section id="sobre" className="defer-paint py-16 sm:py-28">
      <div className="shell">
        <SceneWord index="01" className="lg:pl-[8%]">Sobre</SceneWord>
        <div className="mt-10 grid gap-6 lg:mt-16 lg:grid-cols-12 lg:gap-x-10">
          <Reveal className="lg:col-span-5">
            <h3 className="display text-[clamp(1.9rem,6.4vw,2.8rem)]">{about.title}</h3>
          </Reveal>
          <Reveal className="lg:col-span-6 lg:col-start-7" delay={0.16}>
            <p className="prose-measure">{about.body}</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
