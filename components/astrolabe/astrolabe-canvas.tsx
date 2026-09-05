"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const BRASS = 0xb18a48;
const BRASS_HI = 0xd1ad67;
const PATINA = 0x6d6a4e;

const MAX_TILT_X = THREE.MathUtils.degToRad(3);
const MAX_TILT_Y = THREE.MathUtils.degToRad(5);

/** Repouso inclinado: frontal demais lê como adesivo, não como instrumento. */
const REST_X = THREE.MathUtils.degToRad(-6);
const REST_Y = THREE.MathUtils.degToRad(-10);
const REST_Z = THREE.MathUtils.degToRad(3);

/**
 * Velocidades dos mecanismos, em rad/s. Todas absurdamente lentas de propósito:
 * a mais rápida leva ~4 minutos para uma volta. O instrumento não "gira" —
 * depois de alguns segundos parado é que se percebe que está vivo.
 */
const SPEED = {
  mater: 0.0015,
  reteOuter: -0.01,
  reteMid: 0.026,
  reteInner: -0.019,
  alidadeSweep: 0.055, // rad/s da fase da oscilação
};
const ALIDADE_REST = THREE.MathUtils.degToRad(-24);
const ALIDADE_AMPLITUDE = THREE.MathUtils.degToRad(2.2);

/**
 * Deslocamento total (em radianos) que cada andar do mecanismo acumula ao
 * longo de todo o trilho de scroll do hero. Sentidos e magnitudes diferentes:
 * é o contraste entre os andares que faz o instrumento parecer articulado, não
 * uma imagem girando. Somado ao idle — nunca substitui.
 */
const SCROLL_SWEEP = {
  mater: 0.18,
  reteOuter: 0.52,
  reteMid: -0.86,
  reteInner: 1.34,
  alidade: -0.3,
};

/** Profundidade: o instrumento recua alguns décimos ao longo do trilho. */
const SCROLL_DEPTH = -0.85;
const SCROLL_TILT = THREE.MathUtils.degToRad(4);

/** Ruído de valor determinístico — mesma textura em todo render, inclusive no poster. */
function makeNoise(seed: number) {
  const hash = (x: number, y: number) => {
    const n = Math.sin(x * 127.1 + y * 311.7 + seed) * 43758.5453;
    return n - Math.floor(n);
  };
  const smooth = (t: number) => t * t * (3 - 2 * t);

  return (x: number, y: number) => {
    const xi = Math.floor(x);
    const yi = Math.floor(y);
    const xf = smooth(x - xi);
    const yf = smooth(y - yi);
    const a = hash(xi, yi);
    const b = hash(xi + 1, yi);
    const c = hash(xi, yi + 1);
    const d = hash(xi + 1, yi + 1);
    return (a + (b - a) * xf) * (1 - yf) + (c + (d - c) * xf) * yf;
  };
}

function fbm(noise: (x: number, y: number) => number, x: number, y: number, octaves = 4) {
  let value = 0;
  let amplitude = 0.5;
  let frequency = 1;
  for (let i = 0; i < octaves; i += 1) {
    value += noise(x * frequency, y * frequency) * amplitude;
    frequency *= 2.1;
    amplitude *= 0.5;
  }
  return value;
}

/**
 * Desgaste do bronze, gerado em canvas 256² — nenhum byte de textura na rede.
 *
 * Dá a proporção pedida: base de bronze escuro envelhecido, manchas de brass
 * médio, fios lustrados onde a peça foi manuseada e pontos raros de oxidação.
 *
 * - `surface`: canal G = roughness, canal B = metalness — exatamente os canais
 *   que o three lê em roughnessMap/metalnessMap. É dado, não cor: fica linear.
 * - `tint`: variação de cor, em sRGB.
 */
function createWearMaps() {
  const size = 256;
  const noise = makeNoise(17.3);

  const surfaceCanvas = document.createElement("canvas");
  surfaceCanvas.width = surfaceCanvas.height = size;
  const surfaceCtx = surfaceCanvas.getContext("2d")!;
  const surfaceData = surfaceCtx.createImageData(size, size);

  const tintCanvas = document.createElement("canvas");
  tintCanvas.width = tintCanvas.height = size;
  const tintCtx = tintCanvas.getContext("2d")!;
  const tintData = tintCtx.createImageData(size, size);

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const u = (x / size) * 6;
      const v = (y / size) * 6;

      const grain = fbm(noise, u, v); // manchas largas
      const fine = fbm(noise, u * 5.5, v * 5.5, 3); // sujeira fina
      const polish = fbm(noise, u * 2.2 + 40, v * 2.2 + 40, 3); // faixas de desgaste

      // ~10%: fios lustrados pelo manuseio — lisos e bem metálicos
      const worn = polish > 0.63 ? (polish - 0.63) / 0.37 : 0;
      // ~5%: oxidação — fosca e pouco metálica
      const oxide = grain < 0.3 && fine > 0.52 ? (0.3 - grain) / 0.3 : 0;

      const roughness = Math.min(
        0.94,
        Math.max(0.22, 0.66 - worn * 0.3 + oxide * 0.26 + (fine - 0.5) * 0.12),
      );
      const metalness = Math.min(
        0.95,
        Math.max(0.15, 0.62 + worn * 0.26 - oxide * 0.4 + (grain - 0.5) * 0.1),
      );

      const i = (y * size + x) * 4;
      surfaceData.data[i] = 255;
      surfaceData.data[i + 1] = Math.round(roughness * 255);
      surfaceData.data[i + 2] = Math.round(metalness * 255);
      surfaceData.data[i + 3] = 255;

      // O tint MODULA o bronze, não o recolore: fica quase neutro, senão
      // multiplica a cor do material e o instrumento vira terracota.
      const shade = Math.min(1.06, 0.8 + grain * 0.2 + worn * 0.22);
      let r = 238 * shade;
      let g = 234 * shade;
      let b = 226 * shade;
      if (oxide > 0) {
        const k = oxide * 0.5;
        r += (150 - r) * k;
        g += (168 - g) * k;
        b += (138 - b) * k;
      }
      tintData.data[i] = Math.min(255, r);
      tintData.data[i + 1] = Math.min(255, g);
      tintData.data[i + 2] = Math.min(255, b);
      tintData.data[i + 3] = 255;
    }
  }

  surfaceCtx.putImageData(surfaceData, 0, 0);
  tintCtx.putImageData(tintData, 0, 0);

  const surface = new THREE.CanvasTexture(surfaceCanvas);
  surface.colorSpace = THREE.NoColorSpace;
  surface.wrapS = surface.wrapT = THREE.RepeatWrapping;

  const tint = new THREE.CanvasTexture(tintCanvas);
  tint.colorSpace = THREE.SRGBColorSpace;
  tint.wrapS = tint.wrapT = THREE.RepeatWrapping;

  return { surface, tint };
}

/**
 * Gravação da mater: círculos graduados + um grafo discreto de nós e arestas,
 * que lê como diagrama de engenharia sem virar "circuito neon".
 * Gerada em canvas 512² — nenhum byte de textura trafega pela rede.
 */
function createEngravingTexture(): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const c = size / 2;

  ctx.fillStyle = "#2b2418";
  ctx.fillRect(0, 0, size, size);

  const wash = ctx.createRadialGradient(c * 0.8, c * 0.7, 10, c, c, c);
  wash.addColorStop(0, "rgba(209,173,103,0.20)");
  wash.addColorStop(1, "rgba(40,34,22,0.35)");
  ctx.fillStyle = wash;
  ctx.fillRect(0, 0, size, size);

  // manchas de envelhecimento também na placa gravada
  const noise = makeNoise(4.1);
  const patinaCanvas = document.createElement("canvas");
  patinaCanvas.width = patinaCanvas.height = size;
  const patinaCtx = patinaCanvas.getContext("2d")!;
  const patinaData = patinaCtx.createImageData(size, size);
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const n = fbm(noise, (x / size) * 5, (y / size) * 5, 3);
      const i = (y * size + x) * 4;
      patinaData.data[i] = 60;
      patinaData.data[i + 1] = 66;
      patinaData.data[i + 2] = 48;
      patinaData.data[i + 3] = Math.max(0, n - 0.55) * 150;
    }
  }
  patinaCtx.putImageData(patinaData, 0, 0);
  ctx.drawImage(patinaCanvas, 0, 0);

  ctx.strokeStyle = "rgba(221,209,183,0.42)";
  ctx.lineWidth = 1;

  for (const r of [232, 206, 176, 130, 92, 54]) {
    ctx.beginPath();
    ctx.arc(c, c, r, 0, Math.PI * 2);
    ctx.stroke();
  }

  for (let deg = 0; deg < 360; deg += 5) {
    const a = (deg * Math.PI) / 180;
    const long = deg % 15 === 0;
    ctx.globalAlpha = long ? 0.55 : 0.3;
    ctx.beginPath();
    ctx.moveTo(c + Math.cos(a) * 206, c + Math.sin(a) * 206);
    ctx.lineTo(c + Math.cos(a) * (long ? 232 : 222), c + Math.sin(a) * (long ? 232 : 222));
    ctx.stroke();
  }
  ctx.globalAlpha = 1;

  ctx.strokeStyle = "rgba(221,209,183,0.18)";
  for (let i = 0; i < 8; i += 1) {
    const a = (i * Math.PI) / 4;
    ctx.beginPath();
    ctx.moveTo(c + Math.cos(a) * 54, c + Math.sin(a) * 54);
    ctx.lineTo(c + Math.cos(a) * 206, c + Math.sin(a) * 206);
    ctx.stroke();
  }

  const nodes: [number, number][] = [
    [-96, -58],
    [-30, -104],
    [46, -70],
    [96, 6],
    [40, 86],
    [-46, 96],
    [-104, 26],
    [0, 0],
  ];
  ctx.strokeStyle = "rgba(209,173,103,0.5)";
  ctx.lineWidth = 1.2;
  for (let i = 0; i < nodes.length - 1; i += 1) {
    const [x1, y1] = nodes[i];
    const [x2, y2] = nodes[(i + 1) % (nodes.length - 1)];
    ctx.beginPath();
    ctx.moveTo(c + x1, c + y1);
    ctx.lineTo(c + x1, c + (y1 + y2) / 2);
    ctx.lineTo(c + x2, c + (y1 + y2) / 2);
    ctx.lineTo(c + x2, c + y2);
    ctx.stroke();
  }
  for (const [x, y] of nodes) {
    ctx.beginPath();
    ctx.arc(c + x, c + y, 4.5, 0, Math.PI * 2);
    ctx.fillStyle = "#2b2418";
    ctx.fill();
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 2;
  return texture;
}

/**
 * Ambiente equiretangular 64×32 gerado em memória: vela quente embaixo à
 * esquerda, luar frio em cima. Não é HDRI nem environment pesado — são 8KB de
 * dados e um único passe de PMREM. Metal PBR não tem componente difusa: sem
 * nenhuma reflexão o bronze renderiza preto, por mais luzes que existam.
 */
function createEnvironment(renderer: THREE.WebGLRenderer): THREE.Texture {
  const w = 64;
  const h = 32;
  const data = new Uint8Array(w * h * 4);

  for (let y = 0; y < h; y += 1) {
    const t = y / (h - 1); // 0 = topo
    for (let x = 0; x < w; x += 1) {
      const u = x / (w - 1);

      // luar: mancha fria alta, à esquerda (mesma direção da janela do vídeo)
      const moon = Math.max(0, 1 - Math.hypot((u - 0.3) * 2.2, (t - 0.12) * 3.4)) ** 2;
      // vela: mancha quente baixa, mais à esquerda ainda
      const candle = Math.max(0, 1 - Math.hypot((u - 0.2) * 2.6, (t - 0.72) * 2.8)) ** 2;

      const i = (y * w + x) * 4;
      data[i] = Math.min(255, 16 + moon * 92 + candle * 190);
      data[i + 1] = Math.min(255, 17 + moon * 108 + candle * 132);
      data[i + 2] = Math.min(255, 21 + moon * 150 + candle * 62);
      data[i + 3] = 255;
    }
  }

  const source = new THREE.DataTexture(data, w, h, THREE.RGBAFormat);
  source.mapping = THREE.EquirectangularReflectionMapping;
  source.colorSpace = THREE.SRGBColorSpace;
  source.needsUpdate = true;

  const pmrem = new THREE.PMREMGenerator(renderer);
  const environment = pmrem.fromEquirectangular(source).texture;
  pmrem.dispose();
  source.dispose();

  return environment;
}

function buildAstrolabe(engraving: THREE.CanvasTexture) {
  const group = new THREE.Group();
  const { surface, tint } = createWearMaps();
  const disposables: { dispose(): void }[] = [engraving, surface, tint];

  /** roughness/metalness viram multiplicadores: a variação vem dos mapas. */
  const wear = {
    roughnessMap: surface,
    metalnessMap: surface,
    roughness: 1,
    metalness: 1,
  };

  const brass = new THREE.MeshStandardMaterial({ color: BRASS, map: tint, ...wear });
  const brassHi = new THREE.MeshStandardMaterial({ color: BRASS_HI, map: tint, ...wear });
  const patina = new THREE.MeshStandardMaterial({
    color: PATINA,
    map: tint,
    roughnessMap: surface,
    metalnessMap: surface,
    roughness: 1.25,
    metalness: 0.7,
  });
  const plate = new THREE.MeshStandardMaterial({
    map: engraving,
    color: 0xffffff,
    roughnessMap: surface,
    metalnessMap: surface,
    roughness: 1.1,
    metalness: 0.75,
  });
  disposables.push(brass, brassHi, patina, plate);

  // ---- Mater: disco gravado + aro externo (praticamente imóvel) ----
  const mater = new THREE.Group();
  group.add(mater);

  const plateGeo = new THREE.CircleGeometry(1.5, 72);
  const plateMesh = new THREE.Mesh(plateGeo, plate);
  plateMesh.position.z = -0.06;
  mater.add(plateMesh);
  disposables.push(plateGeo);

  const limbGeo = new THREE.TorusGeometry(1.55, 0.075, 8, 96);
  mater.add(new THREE.Mesh(limbGeo, brass));
  disposables.push(limbGeo);

  const tickGeo = new THREE.BoxGeometry(0.016, 0.1, 0.03);
  const ticks = new THREE.InstancedMesh(tickGeo, brassHi, 72);
  const dummy = new THREE.Object3D();
  for (let i = 0; i < 72; i += 1) {
    const a = (i / 72) * Math.PI * 2;
    dummy.position.set(Math.cos(a) * 1.42, Math.sin(a) * 1.42, 0.02);
    dummy.rotation.set(0, 0, a - Math.PI / 2);
    dummy.scale.set(1, i % 6 === 0 ? 1.6 : 1, 1);
    dummy.updateMatrix();
    ticks.setMatrixAt(i, dummy.matrix);
  }
  ticks.instanceMatrix.needsUpdate = true;
  mater.add(ticks);
  disposables.push(tickGeo, ticks);

  // ---- Rete em três andares, cada um com seu próprio movimento ----
  const reteOuter = new THREE.Group();
  const reteMid = new THREE.Group();
  const reteInner = new THREE.Group();
  group.add(reteOuter, reteMid, reteInner);

  function ring(parent: THREE.Group, r: number, tube: number, x: number, y: number) {
    const geo = new THREE.TorusGeometry(r, tube, 6, 72);
    const mesh = new THREE.Mesh(geo, brassHi);
    mesh.position.set(x, y, 0.06);
    parent.add(mesh);
    disposables.push(geo);
  }

  ring(reteOuter, 1.16, 0.028, 0, 0);
  ring(reteMid, 0.94, 0.02, -0.1, 0.28);
  ring(reteInner, 0.74, 0.024, 0.3, 0.12);
  ring(reteInner, 0.48, 0.022, -0.36, -0.22);

  // Ponteiros de estrela no aro externo — são eles que tornam a rotação legível
  const pointerGeo = new THREE.ConeGeometry(0.045, 0.19, 4);
  for (let i = 0; i < 5; i += 1) {
    const a = (i / 5) * Math.PI * 2 + 0.4;
    const mesh = new THREE.Mesh(pointerGeo, brassHi);
    mesh.position.set(Math.cos(a) * 1.16, Math.sin(a) * 1.16, 0.06);
    mesh.rotation.z = a - Math.PI / 2;
    reteOuter.add(mesh);
  }
  disposables.push(pointerGeo);

  // Nós nos aros internos: sem eles um toro girando parece parado
  const nodeGeo = new THREE.BoxGeometry(0.055, 0.055, 0.055);
  const nodePlan = [
    { parent: reteMid, r: 0.94, ox: -0.1, oy: 0.28 },
    { parent: reteInner, r: 0.74, ox: 0.3, oy: 0.12 },
  ];
  for (const { parent, r, ox, oy } of nodePlan) {
    for (let i = 0; i < 3; i += 1) {
      const a = (i / 3) * Math.PI * 2 + 1.1;
      const mesh = new THREE.Mesh(nodeGeo, brass);
      mesh.position.set(ox + Math.cos(a) * r, oy + Math.sin(a) * r, 0.06);
      mesh.rotation.z = a;
      parent.add(mesh);
    }
  }
  disposables.push(nodeGeo);

  // ---- Alidade: régua de visada, oscila devagar como se fosse ajustada ----
  const alidade = new THREE.Group();
  alidade.position.z = 0.13;
  alidade.rotation.z = ALIDADE_REST;
  group.add(alidade);

  const alidadeGeo = new THREE.BoxGeometry(2.86, 0.075, 0.035);
  const alidadeBar = new THREE.Mesh(alidadeGeo, brass);
  alidade.add(alidadeBar);
  disposables.push(alidadeGeo);

  const pinnuleGeo = new THREE.BoxGeometry(0.075, 0.2, 0.035);
  for (const sx of [-1.2, 1.2]) {
    const pinnule = new THREE.Mesh(pinnuleGeo, brassHi);
    pinnule.position.set(sx, 0, 0);
    alidadeBar.add(pinnule);
  }
  disposables.push(pinnuleGeo);

  // ---- Eixo e argola de suspensão ----
  const hubGeo = new THREE.CylinderGeometry(0.085, 0.1, 0.34, 16);
  const hub = new THREE.Mesh(hubGeo, brassHi);
  hub.rotation.x = Math.PI / 2;
  hub.position.z = 0.14;
  group.add(hub);
  disposables.push(hubGeo);

  const throneGeo = new THREE.TorusGeometry(0.15, 0.038, 6, 28);
  const throne = new THREE.Mesh(throneGeo, patina);
  throne.position.set(0, 1.74, 0);
  group.add(throne);
  disposables.push(throneGeo);

  const shackleGeo = new THREE.BoxGeometry(0.13, 0.16, 0.09);
  const shackle = new THREE.Mesh(shackleGeo, brass);
  shackle.position.set(0, 1.58, 0);
  group.add(shackle);
  disposables.push(shackleGeo);

  return { group, mater, reteOuter, reteMid, reteInner, alidade, disposables };
}

export default function AstrolabeCanvas({
  onReady,
  className,
  progressRef,
}: {
  onReady?: () => void;
  className?: string;
  /**
   * Progresso de scroll 0→1, escrito fora do React (MotionValue) e lido aqui
   * dentro do rAF. Um ref em vez de uma prop de valor: o Three.js nunca
   * provoca rerender e o React nunca provoca frame.
   */
  progressRef?: { current: number };
}) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "low-power",
      });
    } catch {
      return;
    }

    const maxDpr = coarse ? 1 : 1.5;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, maxDpr));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.NoToneMapping;

    const canvas = renderer.domElement;
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.display = "block";
    canvas.setAttribute("aria-hidden", "true");
    host.appendChild(canvas);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 40);
    camera.position.set(0, 0, 7.2);

    // Rig de três luzes, sem sombras: o instrumento precisa parecer estar no
    // mesmo cômodo do vídeo — vela quente à esquerda, luar frio pela janela.
    const ambient = new THREE.AmbientLight(0x2b3128, 0.4);
    scene.add(ambient);

    const candle = new THREE.DirectionalLight(0xffcc9c, 1.85);
    candle.position.set(-3.2, -0.8, 3.6);
    scene.add(candle);

    const moon = new THREE.DirectionalLight(0xa8bcd8, 1.25);
    moon.position.set(-1.6, 3.4, 0.9);
    scene.add(moon);

    const environment = createEnvironment(renderer);
    scene.environment = environment;
    scene.environmentIntensity = 0.62;

    const engraving = createEngravingTexture();
    const { group, mater, reteOuter, reteMid, reteInner, alidade, disposables } =
      buildAstrolabe(engraving);
    disposables.push(environment);
    scene.add(group);

    let width = 0;
    let height = 0;

    function resize() {
      const rect = host!.getBoundingClientRect();
      const w = Math.max(1, Math.round(rect.width));
      const h = Math.max(1, Math.round(rect.height));
      if (w === width && h === height) return;
      width = w;
      height = h;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.position.z = w / h < 0.9 ? 8.4 : 7.2;
      camera.updateProjectionMatrix();
    }

    resize();

    const pointer = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };

    function onPointerMove(event: PointerEvent) {
      const rect = host!.getBoundingClientRect();
      pointer.x = THREE.MathUtils.clamp(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        -1,
        1,
      );
      pointer.y = THREE.MathUtils.clamp(
        ((event.clientY - rect.top) / rect.height) * 2 - 1,
        -1,
        1,
      );
    }

    function onPointerLeave() {
      pointer.x = 0;
      pointer.y = 0;
    }

    if (!reduced && !coarse) {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      host.addEventListener("pointerleave", onPointerLeave);
    }

    let raf = 0;
    let last = 0;
    let clock = 0;
    let inView = false;
    let ready = false;

    // Rotação de repouso acumulada, separada do offset de scroll: somar os dois
    // no fim mantém o idle contínuo mesmo enquanto o usuário rola.
    const idle = { mater: 0, outer: 0, mid: 0, inner: 0 };
    // Progresso amortecido: scroll rápido não teleporta o mecanismo.
    let progress = 0;

    function frame(now: number) {
      const dt = last ? Math.min((now - last) / 1000, 0.05) : 0.016;
      last = now;

      if (!reduced) {
        clock += dt;

        // Mecanismos independentes: cada andar no seu próprio ritmo e sentido.
        idle.mater += SPEED.mater * dt;
        idle.outer += SPEED.reteOuter * dt;
        idle.mid += SPEED.reteMid * dt;
        idle.inner += SPEED.reteInner * dt;

        // O conjunto inteiro é que responde ao ponteiro, com amortecimento.
        const damp = Math.min(dt * 2.4, 1);
        current.x += (pointer.y * MAX_TILT_X - current.x) * damp;
        current.y += (pointer.x * MAX_TILT_Y - current.y) * damp;

        const target = progressRef ? progressRef.current : 0;
        progress += (target - progress) * Math.min(dt * 3.4, 1);
      }

      mater.rotation.z = idle.mater + progress * SCROLL_SWEEP.mater;
      reteOuter.rotation.z = idle.outer + progress * SCROLL_SWEEP.reteOuter;
      reteMid.rotation.z = idle.mid + progress * SCROLL_SWEEP.reteMid;
      reteInner.rotation.z = idle.inner + progress * SCROLL_SWEEP.reteInner;
      alidade.rotation.z =
        ALIDADE_REST +
        (reduced ? 0 : Math.sin(clock * SPEED.alidadeSweep) * ALIDADE_AMPLITUDE) +
        progress * SCROLL_SWEEP.alidade;

      group.rotation.x = REST_X + current.x + progress * SCROLL_TILT;
      group.rotation.y = REST_Y + current.y;
      group.rotation.z = REST_Z;
      group.position.z = progress * SCROLL_DEPTH;

      renderer.render(scene, camera);

      if (!ready) {
        ready = true;
        onReady?.();
      }

      raf = requestAnimationFrame(frame);
    }

    function start() {
      if (raf || !inView || document.hidden) return;
      last = 0;
      raf = requestAnimationFrame(frame);
    }

    function stop() {
      if (!raf) return;
      cancelAnimationFrame(raf);
      raf = 0;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        if (inView) start();
        else stop();
      },
      { threshold: 0.05 },
    );
    io.observe(host);

    function onVisibility() {
      if (document.hidden) stop();
      else start();
    }
    document.addEventListener("visibilitychange", onVisibility);

    const ro = new ResizeObserver(() => {
      resize();
      if (!raf) renderer.render(scene, camera);
    });
    ro.observe(host);

    function onContextLost(event: Event) {
      event.preventDefault();
      stop();
    }
    canvas.addEventListener("webglcontextlost", onContextLost);

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointermove", onPointerMove);
      host.removeEventListener("pointerleave", onPointerLeave);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      for (const item of disposables) item.dispose();
      renderer.dispose();
      canvas.remove();
    };
  }, [onReady, progressRef]);

  return <div ref={hostRef} className={className} aria-hidden />;
}
