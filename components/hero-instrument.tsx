"use client";

import { m, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { AstrolabeStage } from "@/components/astrolabe/astrolabe-stage";
import { CornerMark } from "@/components/ornaments";
import { useSceneMotion } from "@/lib/motion-mode";

/**
 * O astrolábio como assinatura da experiência, não como ilustração do hero.
 *
 * Desktop: a camada é `absolute` sobre todo o trilho do hero (~130vh) e o
 * instrumento fica `sticky` no topo, cortado pela borda direita da viewport. O
 * scroll conduz x/scale/opacity aqui (transform e opacity apenas) e, em
 * paralelo, alimenta um ref lido dentro do rAF do Three.js — os anéis giram em
 * sentidos diferentes sem que nenhum frame passe pelo React.
 *
 * Mobile / movimento reduzido: bloco comum no fluxo, sem scrubbing e sem
 * sticky. O instrumento continua lá, só não viaja.
 */
export function HeroInstrument() {
  const trackRef = useRef<HTMLDivElement>(null);
  const scene = useSceneMotion();

  // Progresso do trilho: 0 quando o topo do hero encosta no topo da viewport,
  // 1 quando o rodapé do hero passa por lá.
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end start"],
  });

  // Ponte para o WebGL: MotionValue → ref. Nenhum setState, nenhum rerender.
  const progressRef = useRef(0);
  useMotionValueEvent(scrollYProgress, "change", (value) => {
    progressRef.current = scene ? value : 0;
  });

  const x = useTransform(scrollYProgress, [0, 1], ["0%", "9%"]);
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "-7%"]);
  const scale = useTransform(scrollYProgress, [0, 0.62, 1], [1, 1.11, 1.16]);
  const opacity = useTransform(scrollYProgress, [0, 0.66, 1], [1, 0.92, 0.42]);

  return (
    <div
      ref={trackRef}
      // No mobile o instrumento é um bloco em fluxo e precisa da mesma
      // sangria lateral do `.shell`, senão as cruzes de registro são cortadas.
      className="mt-14 px-5 sm:mt-16 sm:px-8 lg:pointer-events-none lg:absolute lg:inset-0 lg:z-0 lg:mt-0 lg:px-0"
    >
      <div className="lg:sticky lg:top-0 lg:h-screen">
        {/* Posicionamento fica neste nível; o m.div de dentro só recebe
            transform do scroll, para os dois não brigarem pela mesma matriz. */}
        <div className="relative lg:absolute lg:right-[-13%] lg:top-1/2 lg:w-[62vw] lg:max-w-[60rem] lg:-translate-y-[46%] xl:right-[-9%] xl:w-[55vw]">
          <m.div
            className="relative"
            style={scene ? { x, y, scale, opacity } : undefined}
          >
            <CornerMark className="absolute -left-2 -top-2 z-10" />
            <CornerMark className="absolute -bottom-2 -right-2 z-10" />
            <AstrolabeStage
              className="mx-auto max-w-[34rem] lg:mx-0 lg:max-w-none"
              progressRef={progressRef}
            />
          </m.div>
        </div>
      </div>
    </div>
  );
}
