"use client";

import { useRef } from "react";
import gsap from "gsap";
import Link from "next/link";
import { useGSAP } from "@gsap/react";

export default function PremiumRoundedScrollButton() {
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<SVGPathElement>(null);
  const textWaveRef = useRef<SVGPathElement>(null);
  const textPathRef = useRef<SVGTextPathElement>(null);

  const state = useRef({ velocity: 0, direction: 1 });
  const raf = useRef<number | null>(null);

  // Spring physics
  const amplitude = useRef(0);
  const DAMPING = 0.5;

  // Base text wave (resting state)
  const baseTextWave = "M68,60 Q120,52 172,60";

  // Clean initial rounded rectangle
  const initialShape = `
    M20,25
    H220
    a25,25 0 0 1 25,25
    V70
    a25,25 0 0 1 -25,25
    H20
    a25,25 0 0 1 -25,-25
    V50
    a25,25 0 0 1 25,-25
    Z
  `;

  // Dynamic warped shape - consistent height, more padding room
  const createBaseShape = (amp: number) => {
    const w = state.current.direction * amp;
    const warpStrength = 1.6; // Reduced for controlled deformation

    const topMidY = 25 + w * warpStrength;
    const bottomMidY = 95 + w * warpStrength;

    return `
    M20,25
    Q120,${topMidY} 220,25
    a25,25 0 0 1 25,25
    V70
    a25,25 0 0 1 -25,25
    Q120,${bottomMidY} 20,95
    a25,25 0 0 1 -25,-25
    V50
    a25,25 0 0 1 25,-25
    Z
  `
      .replace(/\s+/g, " ")
      .trim();
  };

  // Text wave deformation
  const createTextWave = (amp: number) => {
    const w = state.current.direction * amp;
    return `M68,60 Q120,${60 + w * 2.5} 172,60`;
  };

  const tick = () => {
    amplitude.current *= DAMPING;
    amplitude.current += state.current.velocity * 0.08;

    const absAmp = Math.abs(amplitude.current);

    gsap.set(buttonRef.current, { attr: { d: createBaseShape(absAmp) } });
    gsap.set(textWaveRef.current, { attr: { d: createTextWave(absAmp) } });

    gsap.set(containerRef.current, {
      y: gsap.utils.clamp(-12, 12, state.current.velocity * 0.1),
      rotate: gsap.utils.clamp(-0.6, 0.6, state.current.velocity * 0.0015),
    });

    if (absAmp > 0.3 || Math.abs(state.current.velocity) > 2) {
      raf.current = requestAnimationFrame(tick);
    } else {
      // Return to default state
      gsap.to(buttonRef.current, {
        attr: { d: initialShape },
        duration: 1.5,
        ease: "elastic.out(1.4, 0.3)",
      });

      gsap.to(textWaveRef.current, {
        attr: { d: baseTextWave },
        duration: 1.5,
        ease: "elastic.out(1.4, 0.3)",
      });

      gsap.to(containerRef.current, {
        y: 0,
        rotate: 0,
        duration: 1.5,
        ease: "elastic.out(1.4, 0.35)",
      });

      amplitude.current = 0;
      state.current.velocity = 0;
    }
  };

  useGSAP(() => {
    let lastY = window.scrollY;
    let timeout: NodeJS.Timeout;

    const onScroll = () => {
      const currentY = window.scrollY;
      const delta = currentY - lastY;
      lastY = currentY;

      if (Math.abs(delta) < 2) return;

      state.current.velocity = delta;
      state.current.direction = delta > 0 ? 1 : -1;

      if (textPathRef.current) {
        textPathRef.current.textContent = delta > 0 ? "Keep Going" : "Going Up";
        gsap.to(textPathRef.current, { opacity: 0.85, duration: 0.2 });
      }

      clearTimeout(timeout);
      timeout = setTimeout(() => {
        gsap.to(textPathRef.current, {
          opacity: 1,
          duration: 0.8,
          onComplete: () => {
            if (textPathRef.current)
              textPathRef.current.textContent = "View Works";
          },
        });
      }, 900);

      if (!raf.current) raf.current = requestAnimationFrame(tick);
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    // Entrance animation
    gsap.fromTo(
      containerRef.current,
      { scale: 0.88, opacity: 0, filter: "blur(12px)" },
      {
        scale: 1,
        opacity: 1,
        filter: "blur(0px)",
        duration: 1.8,
        ease: "expo.out",
      }
    );

    return () => {
      window.removeEventListener("scroll", onScroll);
      clearTimeout(timeout);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed right-3 top-2 z-50 pointer-events-none"
    >
      <div className="pointer-events-auto">
        <svg
          width="240"
          height="100"
          viewBox="0 0 240 140"
          className="drop-shadow-2xl"
        >
          {/* Dynamic glass button */}
          <path
            ref={buttonRef}
            d={initialShape}
            fill="rgba(255, 255, 255, 0.97)"
            stroke="rgba(180, 180, 255, 0.4)"
            strokeWidth="1.6"
            filter="url(#glassGlow)"
          />

          {/* Text wave path */}
          <path ref={textWaveRef} id="textWave" d={baseTextWave} fill="none" />

          {/* Glass glow filter */}
          <defs>
            <filter id="glassGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="10" result="blur" />
              <feComponentTransfer in="blur" result="glow">
                <feFuncA type="linear" slope="6" intercept="-2" />
              </feComponentTransfer>
              <feMerge>
                <feMergeNode in="glow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Text */}
          <Link href="/works" className="block">
            <text
              fontSize="18"
              fontWeight="700"
              fill="#0f172a"
              letterSpacing="0.8"
              textAnchor="middle"
              fontFamily="ui-sans-serif, system-ui, -apple-system, sans-serif"
            >
              <textPath
                ref={textPathRef}
                href="#textWave"
                startOffset="50%"
                className="select-none"
              >
                View Works
              </textPath>
            </text>
          </Link>
        </svg>
      </div>
    </div>
  );
}
