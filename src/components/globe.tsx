import { useEffect, useRef, useState } from "react";
import createGlobe, { type COBEOptions } from "cobe";
import { cn } from "@/lib/utils";
import { BRASIL, PAISES_ACORDO, DESTAQUES_SLUGS } from "@/data/paises-coords";

// Paleta casada com tokens Premium Dark + Gold
// paper ~ #0a0a0a, accent gold ~ oklch(0.78 0.13 80)
const PAPER: {
  base: [number, number, number];
  marker: [number, number, number];
  glow: [number, number, number];
  brightness: number;
} = {
  // base dark com leve tom quente, markers e glow em gold
  base: [0.34, 0.29, 0.20],
  marker: [0.86, 0.68, 0.28],
  glow: [0.55, 0.42, 0.18],
  brightness: 1.6,
};

// Wine — variante mais avermelhada (mantida para compat)
const WINE: typeof PAPER = {
  base: [0.18, 0.10, 0.10],
  marker: [0.86, 0.68, 0.28],
  glow: [0.55, 0.22, 0.18],
  brightness: 0.6,
};

const MARKERS: COBEOptions["markers"] = [
  // Brasil — âncora
  { location: [BRASIL.lat, BRASIL.lng], size: 0.12 },
  ...PAISES_ACORDO.map((p) => ({
    location: [p.lat, p.lng] as [number, number],
    size: DESTAQUES_SLUGS.has(p.slug) ? 0.08 : 0.05,
  })),
];

const BASE_CONFIG: COBEOptions = {
  width: 800,
  height: 800,
  devicePixelRatio: 2,
  phi: 0,
  theta: 0.25,
  dark: 0.25,
  diffuse: 0.85,
  mapSamples: 16000,
  mapBrightness: 1.15,
  baseColor: PAPER.base,
  markerColor: PAPER.marker,
  glowColor: PAPER.glow,
  markers: MARKERS,
};

export function Globe({
  className,
  config,
  tint = "paper",
  mapSamples,
}: {
  className?: string;
  config?: COBEOptions;
  tint?: "paper" | "wine";
  mapSamples?: number;
}) {
  const palette = tint === "wine" ? WINE : PAPER;
  const resolvedConfig: COBEOptions = config ?? {
    ...BASE_CONFIG,
    baseColor: palette.base,
    markerColor: palette.marker,
    glowColor: palette.glow,
    mapBrightness: palette.brightness,
    ...(mapSamples ? { mapSamples } : {}),
  };
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pointerInteracting = useRef<number | null>(null);
  const pointerInteractionMovement = useRef(0);
  const phiRef = useRef(0);
  const widthRef = useRef(0);
  const [r, setR] = useState(0);

  const updatePointerInteraction = (value: number | null) => {
    pointerInteracting.current = value;
    if (canvasRef.current) {
      canvasRef.current.style.cursor = value !== null ? "grabbing" : "grab";
    }
  };

  const updateMovement = (clientX: number) => {
    if (pointerInteracting.current !== null) {
      const delta = clientX - pointerInteracting.current;
      pointerInteractionMovement.current = delta;
      setR(delta / 200);
    }
  };

  useEffect(() => {
    if (typeof window === "undefined" || !canvasRef.current) return;

    const onResize = () => {
      if (canvasRef.current) widthRef.current = canvasRef.current.offsetWidth;
    };
    window.addEventListener("resize", onResize);
    onResize();

    let raf = 0;
    const globe = createGlobe(canvasRef.current, {
      ...resolvedConfig,
      width: widthRef.current * 2,
      height: widthRef.current * 2,
      phi: 0,
    });

    const tick = () => {
      if (pointerInteracting.current === null) phiRef.current += 0.0035;
      globe.update({
        phi: phiRef.current + r,
        width: widthRef.current * 2,
        height: widthRef.current * 2,
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const el = canvasRef.current;
    setTimeout(() => {
      if (el) el.style.opacity = "1";
    }, 0);

    return () => {
      cancelAnimationFrame(raf);
      globe.destroy();
      window.removeEventListener("resize", onResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [r]);

  return (
    <div
      className={cn(
        "relative aspect-square w-full",
        className,
      )}
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="h-full w-full opacity-0 transition-opacity duration-700 [contain:layout_paint_size]"
        style={{ cursor: "grab" }}
        onPointerDown={(e) =>
          updatePointerInteraction(e.clientX - pointerInteractionMovement.current)
        }
        onPointerUp={() => updatePointerInteraction(null)}
        onPointerOut={() => updatePointerInteraction(null)}
        onMouseMove={(e) => updateMovement(e.clientX)}
        onTouchMove={(e) => e.touches[0] && updateMovement(e.touches[0].clientX)}
      />
    </div>
  );
}
