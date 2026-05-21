import { useEffect, useRef, useState } from "react";
import createGlobe, { type COBEOptions } from "cobe";
import { cn } from "@/lib/utils";
import { BRASIL, PAISES_ACORDO, DESTAQUES_SLUGS } from "@/data/paises-coords";

// Paleta casada com tokens Paper & Ink
// base paper ~ #f5f3ee, accent-ink (wine) ~ #7a1f1f
const BASE: [number, number, number] = [0.72, 0.68, 0.62];
const MARKER: [number, number, number] = [0.55, 0.1, 0.1];
const GLOW: [number, number, number] = [0.78, 0.74, 0.68];

const MARKERS: COBEOptions["markers"] = [
  // Brasil — âncora
  { location: [BRASIL.lat, BRASIL.lng], size: 0.12 },
  ...PAISES_ACORDO.map((p) => ({
    location: [p.lat, p.lng] as [number, number],
    size: DESTAQUES_SLUGS.has(p.slug) ? 0.08 : 0.05,
  })),
];

const GLOBE_CONFIG: COBEOptions = {
  width: 800,
  height: 800,
  devicePixelRatio: 2,
  phi: 0,
  theta: 0.25,
  dark: 0,
  diffuse: 0.5,
  mapSamples: 16000,
  mapBrightness: 1.3,
  baseColor: BASE,
  markerColor: MARKER,
  glowColor: GLOW,
  markers: MARKERS,
};

export function Globe({
  className,
  config = GLOBE_CONFIG,
}: {
  className?: string;
  config?: COBEOptions;
}) {
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
      ...config,
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
        "relative mx-auto aspect-square w-full max-w-[280px] sm:max-w-[420px] lg:max-w-[640px]",
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
