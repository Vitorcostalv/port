"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

type Props = {
  /** Sempre visível — desenhado imediatamente, antes de qualquer vídeo. */
  poster: string;
  /** Opcionais. Sem eles o componente é só o poster. */
  webm?: string;
  mp4?: string;
  /** Falso em aparelhos onde o custo do vídeo não se justifica. */
  allowVideo?: boolean;
  className?: string;
  /** Aplicado ao poster e ao vídeo — modo de composição, recorte, filtros. */
  mediaClassName?: string;
};

/** Vídeo só é permitido fora de reduced-motion e fora de Save-Data. */
function probeMotionAllowed() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } })
    .connection;
  return !connection?.saveData;
}

let motionProbe: boolean | undefined;
const subscribeMotion = (onChange: () => void) => {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  const listener = () => {
    motionProbe = probeMotionAllowed();
    onChange();
  };
  query.addEventListener("change", listener);
  return () => query.removeEventListener("change", listener);
};
const readMotion = () => {
  if (motionProbe === undefined) motionProbe = probeMotionAllowed();
  return motionProbe;
};
const serverMotion = () => false;

/**
 * Fundo cinemagraph. Decorativo: aria-hidden, nunca carrega informação.
 *
 * O poster aparece de imediato. O <video> só é montado quando o elemento entra
 * na viewport E o navegador fica ocioso — assim os megabytes do arquivo nunca
 * competem com o LCP. Fora da viewport ou com a aba oculta, ele pausa.
 */
export function CinematicBackground({
  poster,
  webm,
  mp4,
  allowVideo = true,
  className = "",
  mediaClassName = "",
}: Props) {
  const [mountVideo, setMountVideo] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const hostRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const hasSources = Boolean(webm || mp4);
  const motionAllowed = useSyncExternalStore(subscribeMotion, readMotion, serverMotion);
  const wanted = hasSources && allowVideo && motionAllowed;

  // Monta o vídeo tarde: só quando visível e com o navegador ocioso.
  useEffect(() => {
    const host = hostRef.current;
    if (!wanted || !host) return;

    let idleHandle: number | undefined;
    const cancelIdle = window.cancelIdleCallback ?? window.clearTimeout;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const schedule =
          window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 1200));
        idleHandle = schedule(() => setMountVideo(true), { timeout: 4000 }) as number;
      },
      { threshold: 0.1 },
    );
    observer.observe(host);

    return () => {
      observer.disconnect();
      if (idleHandle !== undefined) cancelIdle(idleHandle);
    };
  }, [wanted]);

  // Pausa fora da viewport e com a aba em background — vídeo invisível é gasto puro.
  useEffect(() => {
    const video = videoRef.current;
    const host = hostRef.current;
    if (!mountVideo || !video || !host) return;

    let onScreen = true;

    function sync() {
      if (!video) return;
      if (onScreen && !document.hidden) void video.play().catch(() => undefined);
      else video.pause();
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        sync();
      },
      { threshold: 0.05 },
    );
    observer.observe(host);
    document.addEventListener("visibilitychange", sync);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, [mountVideo]);

  return (
    <div
      ref={hostRef}
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={poster}
        alt=""
        aria-hidden
        decoding="async"
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${mediaClassName} ${
          videoReady ? "opacity-0" : "opacity-100"
        }`}
      />

      {mountVideo ? (
        <video
          ref={videoRef}
          poster={poster}
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          onCanPlay={() => setVideoReady(true)}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${mediaClassName} ${
            videoReady ? "opacity-100" : "opacity-0"
          }`}
        >
          {webm ? <source src={webm} type="video/webm" /> : null}
          {mp4 ? <source src={mp4} type="video/mp4" /> : null}
        </video>
      ) : null}
    </div>
  );
}
