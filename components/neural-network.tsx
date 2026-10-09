"use client";

import { useEffect, useRef } from "react";
import { useEnhancedGraphics } from "@/lib/graphics-mode";

const layers = [4, 6, 6, 3];
const nodes = layers.flatMap((count, layer) =>
  Array.from({ length: count }, (_, index) => ({
    layer,
    x: (layer - 1.5) * 1.8,
    y: (index - (count - 1) / 2) * 0.65,
    z: Math.sin(index * 1.7 + layer) * 0.5,
  })),
);
const edges = nodes.flatMap((from) =>
  nodes.filter((to) => to.layer === from.layer + 1).map((to) => ({ from, to })),
);

/** Decorative scene, loaded only when visible. The SVG remains usable without WebGL. */
export function NeuralNetwork() {
  const hostRef = useRef<HTMLDivElement>(null);
  const enabled = useEnhancedGraphics();

  useEffect(() => {
    const element = hostRef.current;
    if (!element || !enabled) return;
    const host: HTMLDivElement = element;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let disposed = false;
    let visible = false;
    let loading = false;
    let cleanupScene: (() => void) | undefined;
    let updateAnimation: (() => void) | undefined;

    async function initialize() {
      if (disposed || loading || cleanupScene || motion.matches) return;
      loading = true;
      try {
        const THREE = await import("three");
        if (disposed || motion.matches) return;
        let renderer: InstanceType<typeof THREE.WebGLRenderer>;
        try {
          renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, powerPreference: "low-power" });
        } catch {
          return;
        }
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 40);
        camera.position.z = 9;
        const network = new THREE.Group();
        network.rotation.set(0.12, -0.22, -0.06);
        scene.add(network);

        const nodeGeometry = new THREE.IcosahedronGeometry(0.085, 0);
        const nodeMaterial = new THREE.MeshBasicMaterial({ color: 0xd1ad67 });
        const signalMaterial = new THREE.MeshBasicMaterial({ color: 0xddd1b7 });
        const nodeMesh = new THREE.InstancedMesh(nodeGeometry, nodeMaterial, nodes.length);
        const transform = new THREE.Object3D();
        nodes.forEach(({ x, y, z }, index) => {
          transform.position.set(x, y, z);
          transform.updateMatrix();
          nodeMesh.setMatrixAt(index, transform.matrix);
        });
        nodeMesh.instanceMatrix.needsUpdate = true;
        network.add(nodeMesh);
        const positions = edges.flatMap(({ from, to }) => [from.x, from.y, from.z, to.x, to.y, to.z]);
        const lineGeometry = new THREE.BufferGeometry();
        lineGeometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
        const lineMaterial = new THREE.LineBasicMaterial({ color: 0xb18a48, transparent: true, opacity: 0.24 });
        network.add(new THREE.LineSegments(lineGeometry, lineMaterial));
        const signals = edges.filter((_, index) => index % 7 === 0);
        const signalMesh = new THREE.InstancedMesh(nodeGeometry, signalMaterial, signals.length);
        signalMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
        signalMesh.frustumCulled = false;
        network.add(signalMesh);
        const canvas = renderer.domElement;
        canvas.setAttribute("aria-hidden", "true");
        canvas.style.cssText = "position:absolute;inset:0;width:100%;height:100%;pointer-events:none";
        host.appendChild(canvas);
        let frame = 0;
        let previous = 0;
        let lost = false;
        const pointer = { x: 0, y: 0 };
        const render = (time: number) => {
          frame = 0;
          if (!visible || document.hidden || motion.matches || lost) return;
          if (time - previous >= (1000 / 30)) {
            previous = time;
            const seconds = time * 0.001;
            network.rotation.y = -0.22 + Math.sin(seconds * 0.3) * 0.18 + pointer.x * 0.18;
            network.rotation.x = 0.12 + Math.cos(seconds * 0.25) * 0.07 + pointer.y * 0.12;
            signals.forEach((edge, index) => {
              const progress = (seconds * 0.3 + index * 0.17) % 1;
              transform.position.set(
                edge.from.x + (edge.to.x - edge.from.x) * progress,
                edge.from.y + (edge.to.y - edge.from.y) * progress,
                edge.from.z + (edge.to.z - edge.from.z) * progress,
              );
              transform.scale.setScalar(0.55);
              transform.updateMatrix();
              signalMesh.setMatrixAt(index, transform.matrix);
            });
            signalMesh.instanceMatrix.needsUpdate = true;
            renderer.render(scene, camera);
          }
          frame = requestAnimationFrame(render);
        };
        updateAnimation = () => {
          cancelAnimationFrame(frame);
          frame = 0;
          if (visible && !document.hidden && !motion.matches && !lost) frame = requestAnimationFrame(render);
        };
        const resize = () => {
          renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.25));
          renderer.setSize(host.clientWidth, host.clientHeight, false);
          camera.aspect = host.clientWidth / Math.max(host.clientHeight, 1);
          camera.updateProjectionMatrix();
          if (!lost) renderer.render(scene, camera);
        };
        const resizeObserver = new ResizeObserver(resize);
        resizeObserver.observe(host);
        const onPointer = (event: PointerEvent) => {
          if (event.pointerType !== "mouse") return;
          const bounds = host.getBoundingClientRect();
          pointer.x = (event.clientX - bounds.left) / bounds.width - 0.5;
          pointer.y = (event.clientY - bounds.top) / bounds.height - 0.5;
        };
        const resetPointer = () => { pointer.x = 0; pointer.y = 0; };
        const onContextLost = (event: Event) => {
          event.preventDefault();
          lost = true;
          delete host.dataset.ready;
          updateAnimation?.();
        };
        const onContextRestored = () => {
          lost = false;
          resize();
          host.dataset.ready = "true";
          updateAnimation?.();
        };
        host.addEventListener("pointermove", onPointer);
        host.addEventListener("pointerleave", resetPointer);
        canvas.addEventListener("webglcontextlost", onContextLost);
        canvas.addEventListener("webglcontextrestored", onContextRestored);
        document.addEventListener("visibilitychange", updateAnimation);
        resize();
        host.dataset.ready = "true";
        cleanupScene = () => {
          cancelAnimationFrame(frame);
          resizeObserver.disconnect();
          host.removeEventListener("pointermove", onPointer);
          host.removeEventListener("pointerleave", resetPointer);
          canvas.removeEventListener("webglcontextlost", onContextLost);
          canvas.removeEventListener("webglcontextrestored", onContextRestored);
          document.removeEventListener("visibilitychange", updateAnimation!);
          nodeMesh.dispose();
          signalMesh.dispose();
          nodeGeometry.dispose();
          lineGeometry.dispose();
          nodeMaterial.dispose();
          signalMaterial.dispose();
          lineMaterial.dispose();
          renderer.dispose();
          renderer.forceContextLoss();
          canvas.remove();
          delete host.dataset.ready;
        };
        updateAnimation();
      } finally {
        loading = false;
      }
    }

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) void initialize().catch(() => {});
      updateAnimation?.();
    }, { threshold: 0.05 });
    observer.observe(host);
    return () => {
      disposed = true;
      observer.disconnect();
      cleanupScene?.();
    };
  }, [enabled]);

  return (
    <div className="min-w-0">
      <div ref={hostRef} aria-hidden="true" className="neural-network relative aspect-[2/1] w-full overflow-hidden">
        <svg viewBox="0 0 480 240" className="neural-fallback absolute inset-0 size-full text-brass">
          {edges.map(({ from, to }, index) => <line key={index} x1={240 + from.x * 55} y1={120 + from.y * 48} x2={240 + to.x * 55} y2={120 + to.y * 48} stroke="currentColor" strokeOpacity="0.24" />)}
          {nodes.map((node, index) => <circle key={index} cx={240 + node.x * 55} cy={120 + node.y * 48} r="4" fill="currentColor" />)}
        </svg>
      </div>
      <p className="text-center font-mono text-[0.5625rem] uppercase tracking-[0.18em] text-parchment-dim">Entradas / Conexões / Possibilidades</p>
    </div>
  );
}
