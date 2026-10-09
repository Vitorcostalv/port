"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { EngravedPlate } from "@/components/ornaments";
import { useEnhancedGraphics } from "@/lib/graphics-mode";

const POSTER = "/media/astrolabe-poster.webp";
const AstrolabeCanvas = dynamic(() => import("./astrolabe-canvas"), {
  ssr: false,
  loading: () => null,
});

type ProgressRef = { current: number };

function Instrument({ progressRef }: { progressRef?: ProgressRef }) {
  const [ready, setReady] = useState(false);
  const onReady = useCallback(() => setReady(true), []);
  const onUnavailable = useCallback(() => setReady(false), []);
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={POSTER} alt="" decoding="async" className={`absolute inset-0 size-full object-contain ${ready ? "opacity-0" : "opacity-100"}`} />
      <AstrolabeCanvas onReady={onReady} onUnavailable={onUnavailable} progressRef={progressRef} className={`absolute inset-0 size-full ${ready ? "opacity-100" : "opacity-0"}`} />
    </>
  );
}

export function AstrolabeStage({
  className = "mx-auto max-w-[34rem]",
  progressRef,
}: { className?: string; progressRef?: ProgressRef }) {
  const enabled = useEnhancedGraphics();
  const hostRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [idle, setIdle] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host || !enabled) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.05 });
    observer.observe(host);
    const schedule = window.requestIdleCallback ?? ((callback: () => void) => window.setTimeout(callback, 1200));
    const cancel = window.cancelIdleCallback ?? window.clearTimeout;
    const handle = schedule(() => setIdle(true), { timeout: 4000 });
    return () => { observer.disconnect(); cancel(handle); };
  }, [enabled]);

  return (
    <div ref={hostRef} aria-hidden="true" className={`relative aspect-square w-full overflow-hidden sm:aspect-[4/5] lg:aspect-square ${className}`}>
      {/* A still image preserves the atmosphere without decoding a looping video. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/media/candlelit-study-poster.webp" alt="" decoding="async" loading="lazy" className="scene-mask scene-blend absolute inset-0 size-full object-cover object-[40%_36%]" />
      <EngravedPlate className="absolute left-1/2 top-1/2 h-[112%] w-[112%] -translate-x-1/2 -translate-y-1/2 text-parchment opacity-[0.07]" />
      <div className="anim-instrument absolute inset-0">
        {enabled && visible && idle ? <Instrument progressRef={progressRef} /> : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={POSTER} alt="" decoding="async" loading="lazy" className="absolute inset-0 size-full object-contain" />
        )}
      </div>
    </div>
  );
}
