"use client";

import { useRef } from "react";
import gsap from "gsap";
import Link from "next/link";
import { useGSAP } from "@gsap/react";

export default function PremiumRoundedScrollButton() {
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<SVGPathElement>(null);
  const topWaveRef = useRef<SVGPathElement>(null);
  const bottomWaveRef = useRef<SVGPathElement>(null);
  const textWaveRef = useRef<SVGPathElement>(null);
  const textPathRef = useRef<SVGTextPathElement>(null);

  const state = useRef({ velocity: 0, direction: 1 });

  const raf = useRef<number | null>(null);

  // Super smooth spring physics
  const amplitude = useRef(0);
  const SPRING = 0.2;
  const DAMPING = 0.88;

  // Clean rounded rectangle base (like Figma border-radius: 32px)
  const baseShape =
    "M40,12 h160 a32,32 0 0 1 32,32 v32 a32,32 0 0 1 -32,32 h-160 a32,32 0 0 1 -32,-32 v-32 a32,32 0 0 1 32,-32 z";

  const baseTopWave = "M68,34 L172,34";
  const baseBottomWave = "M68,66 L172,66";
  const baseTextWave = "M68,28 Q120,20 172,28";

  const createPaths = (amp: number) => {
    const w = state.current.direction * amp;

    return {
      top: `M68,34 Q120,${34 + w * 3.6} 172,34`,
      bottom: `M68,66 Q120,${66 + w * 3.6} 172,66`,
      text: `M68,28 Q120,${28 + w * 3} 172,28`,
    };
  };

  const tick = () => {
    // Spring physics for amplitude
    amplitude.current *= DAMPING;
    amplitude.current += state.current.velocity * 0.08;

    const { top, bottom, text } = createPaths(Math.abs(amplitude.current));

    gsap.set(topWaveRef.current, { attr: { d: top } });
    gsap.set(bottomWaveRef.current, { attr: { d: bottom } });
    gsap.set(textWaveRef.current, { attr: { d: text } });

    // Subtle float + micro tilt
    gsap.set(containerRef.current, {
      y: gsap.utils.clamp(-14, 14, state.current.velocity * 0.11),
      rotate: gsap.utils.clamp(-0.6, 0.6, state.current.velocity * 0.0018),
    });

    if (
      Math.abs(amplitude.current) > 0.5 ||
      Math.abs(state.current.velocity) > 4
    ) {
      raf.current = requestAnimationFrame(tick);
    } else {
      // Elegant reset
      gsap.to(containerRef.current, {
        y: 0,
        rotate: 0,
        duration: 1.8,
        ease: "elastic.out(1.6, 0.35)",
      });
      gsap.to(
        [topWaveRef.current, bottomWaveRef.current, textWaveRef.current],
        {
          attr: { d: [baseTopWave, baseBottomWave, baseTextWave] },
          duration: 1.9,
          ease: "elastic.out(1.js(1.5, 0.3)",
          stagger: 0.04,
        }
      );
      amplitude.current = 0;
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
        gsap.to(textPathRef.current, { opacity: 0.9, duration: 0.2 });
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

    // Beautiful entrance
    gsap.fromTo(
      containerRef.current,
      { scale: 0.9, opacity: 0, filter: "blur(10px)" },
      {
        scale: 1,
        opacity: 1,
        filter: "blur(0px)",
        duration: 1.6,
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
      className="fixed right-8 top-1/2 -translate-y-1/2 z-50 pointer-events-none"
    >
      <div className="pointer-events-auto">
        <svg
          width="240"
          height="110"
          viewBox="0 0 240 110"
          className="drop-shadow-2xl"
        >
          {/* Clean rounded glass button */}
          <path
            ref={buttonRef}
            d={baseShape}
            fill="rgba(255, 255, 255, 0.97)"
            stroke="rgba(180, 180, 255, 0.4)"
            strokeWidth="1.6"
            filter="url(#glassGlow)"
          />

          {/* Flowing accent waves */}
          <path
            ref={topWaveRef}
            d={baseTopWave}
            stroke="url(#waveTop)"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
          />
          <path
            ref={bottomWaveRef}
            d={baseBottomWave}
            stroke="url(#waveBottom)"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
          />

          {/* Text wave path */}
          <path ref={textWaveRef} id="textWave" d={baseTextWave} fill="none" />

          {/* Premium glassmorphic effects */}
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

            <linearGradient id="waveTop">
              <stop offset="0%" stopColor="#a78bfa">
                <animate
                  attributeName="stopColor"
                  values="#a78bfa;#c084fc;#e0a8ff;#a78bfa"
                  dur="4.5s"
                  repeatCount="indefinite"
                />
              </stop>
              <stop offset="100%" stopColor="#60a5fa" />
            </linearGradient>

            <linearGradient id="waveBottom">
              <stop offset="0%" stopColor="#f87171" />
              <stop offset="100%" stopColor="#fb923c">
                <animate
                  attributeName="stopColor"
                  values="#fb923c;#fdba74;#fb923c"
                  dur="5s"
                  repeatCount="indefinite"
                />
              </stop>
            </linearGradient>
          </defs>

          {/* Crisp modern text */}
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
