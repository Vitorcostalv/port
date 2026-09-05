"use client";

import dynamic from "next/dynamic";
import { useCallback, useState, useSyncExternalStore } from "react";
import { CinematicBackground } from "@/components/cinematic-background";
import { EngravedPlate } from "@/components/ornaments";

const POSTER = "/media/astrolabe-poster.webp";

// Three.js vive só neste chunk: nada de WebGL no bundle inicial.
const AstrolabeCanvas = dynamic(() => import("./astrolabe-canvas"), {
  ssr: false,
  loading: () => null,
});

/** Aparelho fraco, tela estreita ou sem WebGL: fica só o poster. */
function canRun3D(): boolean {
  if (typeof window === "undefined") return false;

  const nav = navigator as Navigator & {
    deviceMemory?: number;
    connection?: { saveData?: boolean };
  };

  if (nav.connection?.saveData) return false;
  if (typeof nav.deviceMemory === "number" && nav.deviceMemory < 4) return false;
  if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) return false;

  const coarse = window.matchMedia("(pointer: coarse)").matches;
  if (coarse && window.innerWidth < 768) return false;

  try {
    const probe = document.createElement("canvas");
    const gl =
      probe.getContext("webgl2") ||
      probe.getContext("webgl") ||
      probe.getContext("experimental-webgl");
    if (!gl) return false;
    const lose = (gl as WebGLRenderingContext).getExtension("WEBGL_lose_context");
    lose?.loseContext();
    return true;
  } catch {
    return false;
  }
}

// Sonda de capacidade: roda uma única vez, no cliente, e nunca durante o SSR.
let probed: boolean | undefined;
const subscribeNever = () => () => undefined;
const readCapability = () => {
  if (probed === undefined) probed = canRun3D();
  return probed;
};
const serverCapability = () => false;

export function AstrolabeStage() {
  const use3D = useSyncExternalStore(subscribeNever, readCapability, serverCapability);
  const [canvasReady, setCanvasReady] = useState(false);

  const handleReady = useCallback(() => setCanvasReady(true), []);

  return (
    <div
      // aspect-ratio fixo nos dois breakpoints: o canvas nunca empurra layout.
      // Sem `isolate`: a composição em screen precisa alcançar o fundo da seção
      // para que a pedra escura do vídeo desapareça de verdade.
      // Com `overflow-hidden`: a gravura de fundo tem 112% e escaparia da caixa,
      // gerando 1px de overflow horizontal em telas estreitas. A máscara já
      // fecha dentro do box, então o clip não reintroduz borda visível.
      className="relative mx-auto aspect-square w-full max-w-[34rem] overflow-hidden sm:aspect-[4/5] lg:mr-0 lg:aspect-square"
    >
      {/* 1. cinemagraph medieval, composto em `screen`: o escuro dissolve no
             fundo e só luar, vela e papiro emergem. A máscara elíptica
             irregular remove qualquer borda reconhecível. O vídeo viaja junto
             com o 3D — aparelho sem WebGL não paga os megabytes do mp4. */}
      <CinematicBackground
        poster="/media/candlelit-study-poster.webp"
        mp4="/media/candlelit-study-loop.mp4"
        allowVideo={use3D}
        className="scene-mask anim-scene"
        mediaClassName="scene-blend object-[40%_36%] scale-[1.12] contrast-[1.2] brightness-[1.1] saturate-[0.85]"
      />

      {/* gravura de fundo — placa graduada, quase imperceptível */}
      <EngravedPlate className="anim-scene absolute left-1/2 top-1/2 h-[112%] w-[112%] -translate-x-1/2 -translate-y-1/2 text-parchment opacity-[0.07]" />

      {/* 2 e 3. instrumento: emerge depois da cena, como uma peça só. */}
      <div className="anim-instrument absolute inset-0">
        {/* poster estático do próprio astrolábio: sempre presente, é o fallback */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={POSTER}
          alt=""
          aria-hidden
          decoding="async"
          fetchPriority={use3D ? "low" : "high"}
          className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-700 ${
            canvasReady ? "opacity-0" : "opacity-100"
          }`}
        />

        {/* canvas Three.js transparente por cima */}
        {use3D ? (
          <AstrolabeCanvas
            onReady={handleReady}
            className={`absolute inset-0 h-full w-full transition-opacity duration-700 ${
              canvasReady ? "opacity-100" : "opacity-0"
            }`}
          />
        ) : null}
      </div>
    </div>
  );
}
