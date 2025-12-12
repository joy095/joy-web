"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import Link from "next/link";

export default function PremiumRoundedScrollButton() {
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<SVGPathElement>(null);
  const textWaveRef = useRef<SVGPathElement>(null);
  const textPathRef = useRef<SVGTextPathElement>(null);
  const linesContainerRef = useRef<HTMLDivElement>(null);
  const strokeRef = useRef<number>(1.2); // Dynamic stroke width

  const state = useRef({ velocity: 0, direction: 1 });
  const raf = useRef<number | null>(null);
  const amplitude = useRef(0);
  const DAMPING = 0.5;

  const baseTextWave = "M68,60 Q120,52 172,60";
  const initialShape =
    `M20,25 H220 a25,25 0 0 1 25,25 V70 a25,25 0 0 1 -25,25 H20 a25,25 0 0 1 -25,-25 V50 a25,25 0 0 1 25,-25 Z`
      .replace(/\s+/g, " ")
      .trim();

  const createBaseShape = (amp: number) => {
    const w = state.current.direction * amp * 1.6;
    return `M20,25 Q120,${
      25 + w
    } 220,25 a25,25 0 0 1 25,25 V70 a25,25 0 0 1 -25,25 Q120,${
      95 + w
    } 20,95 a25,25 0 0 1 -25,-25 V50 a25,25 0 0 1 25,-25 Z`
      .replace(/\s+/g, " ")
      .trim();
  };

  const createTextWave = (amp: number) => {
    const w = state.current.direction * amp;
    return `M68,60 Q120,${60 + w * 2.5} 172,60`;
  };

  const tick = () => {
    amplitude.current =
      amplitude.current * DAMPING + state.current.velocity * 0.08;
    const absAmp = Math.abs(amplitude.current);

    gsap.set(buttonRef.current, { attr: { d: createBaseShape(absAmp) } });
    gsap.set(textWaveRef.current, { attr: { d: createTextWave(absAmp) } });
    gsap.set(containerRef.current, {
      y: gsap.utils.clamp(-12, 12, state.current.velocity * 0.1),
      rotate: gsap.utils.clamp(-0.6, 0.6, state.current.velocity * 0.0015),
    });

    // Dynamic stroke width based on activity
    const targetStroke = Math.abs(state.current.velocity) > 5 ? 2.8 : 1.2;
    strokeRef.current += (targetStroke - strokeRef.current) * 0.2;
    gsap.set(buttonRef.current, { attr: { strokeWidth: strokeRef.current } });

    if (absAmp > 0.3 || Math.abs(state.current.velocity) > 2) {
      raf.current = requestAnimationFrame(tick);
    } else {
      gsap.to(buttonRef.current, {
        attr: { d: initialShape },
        duration: 1.6,
        ease: "elastic.out(1.4, 0.3)",
      });
      gsap.to(textWaveRef.current, {
        attr: { d: baseTextWave },
        duration: 1.6,
        ease: "elastic.out(1.4, 0.3)",
      });
      gsap.to(containerRef.current, {
        y: 0,
        rotate: 0,
        duration: 1.6,
        ease: "elastic.out(1.4, 0.35)",
      });
      gsap.to(buttonRef.current, {
        attr: { strokeWidth: 1.2 },
        duration: 1.6,
        ease: "elastic.out(1, 0.3)",
      });
      amplitude.current = 0;
      state.current.velocity = 0;
    }
  };

  useEffect(() => {
    if (!linesContainerRef.current) return;

    const container = linesContainerRef.current;
    const colors = [
      "#ff2d75",
      "#ff7c43",
      "#ffd633",
      "#43ffa8",
      "#33b5ff",
      "#cc4dff",
      "#ffffff",
    ];
    const totalLines = 50;
    const lines: {
      el: HTMLDivElement;
      y: number;
      speed: number;
      active: boolean;
    }[] = [];

    // Perfectly positioned inside the rounded button
    for (let i = 0; i < totalLines; i++) {
      const el = document.createElement("div");
      const initialY = gsap.utils.random(-100, 100);

      el.style.cssText = `
        position: absolute;
        left: ${gsap.utils.random(12, 88)}%;
        width: ${gsap.utils.random(1.3, 2.4)}px;
        height: ${gsap.utils.random(20, 38)}px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        border-radius: 4px;
        box-shadow: 0 0 12px rgba(255,255,255,0.7);
        opacity: 0;
        pointer-events: none;
        transform: translateY(${initialY}%);
      `;

      container.appendChild(el);

      lines.push({
        el,
        y: initialY,
        speed: gsap.utils.random(32, 68),
        active: false,
      });
    }

    let isScrolling = false;
    let scrollDir = 1;
    let speedMult = 0.25;
    let targetSpeed = 0.25;
    let lastY = window.scrollY;
    let scrollTimeout: NodeJS.Timeout;

    const idleCount = Math.floor(totalLines * 0.25); // Only ~25% visible when idle

    const updateLines = () => {
      const count = isScrolling ? totalLines : idleCount;
      const targetOpacity = isScrolling ? 0.92 : 0.18; // Very subtle when idle

      lines.forEach((line, i) => {
        const shouldShow = i < count;
        if (shouldShow !== line.active) {
          line.active = shouldShow;
          gsap.to(line.el, {
            opacity: shouldShow ? targetOpacity : 0,
            duration: 0.9,
            ease: "power2.out",
            delay: shouldShow ? gsap.utils.random(0, 0.25) : 0,
          });
        }
      });
    };

    const ticker = () => {
      speedMult += (targetSpeed - speedMult) * 0.15;

      lines.forEach((line) => {
        if (!line.active) return;

        const dir = isScrolling ? (scrollDir > 0 ? -1 : 1) : 1;
        line.y +=
          line.speed * dir * speedMult * gsap.ticker.deltaRatio(60) * 0.13;

        if (line.y > 140) line.y = -40;
        if (line.y < -140) line.y = 130;

        line.el.style.transform = `translateY(${line.y}%)`;
      });
    };

    gsap.ticker.add(ticker);

    const handleScroll = () => {
      const delta = window.scrollY - lastY;
      lastY = window.scrollY;
      if (Math.abs(delta) < 3) return;

      // Button physics
      state.current.velocity = delta * 0.95;
      state.current.direction = delta > 0 ? 1 : -1;
      if (!raf.current) raf.current = requestAnimationFrame(tick);

      // Text feedback
      if (textPathRef.current) {
        textPathRef.current.textContent =
          delta > 0 ? "Keep Going Down" : "Going Up Up";
        gsap.to(textPathRef.current, { opacity: 0.9, duration: 0.2 });
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          gsap.to(textPathRef.current, {
            opacity: 1,
            duration: 0.8,
            onComplete: () => {
              if (textPathRef.current)
                textPathRef.current.textContent = "View Works";
            },
          });
        }, 1000);
      }

      // Lines: active & bright on scroll
      isScrolling = true;
      scrollDir = delta > 0 ? 1 : -1;
      targetSpeed = 1.0;
      updateLines();

      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        isScrolling = false;
        targetSpeed = 0.25;
        updateLines();
      }, 220);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    updateLines();

    // Entrance
    gsap.fromTo(
      containerRef.current,
      { scale: 0.88, opacity: 0, filter: "blur(12px)" },
      {
        scale: 1,
        opacity: 1,
        filter: "blur(0px)",
        duration: 1.8,
        ease: "expo.out",
        delay: 0.5,
      }
    );

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(scrollTimeout);
      if (raf.current) cancelAnimationFrame(raf.current);
      gsap.ticker.remove(ticker);
      lines.forEach((l) => l.el.remove());
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed right-5 top-5 z-50 pointer-events-none select-none"
    >
      <div className="pointer-events-auto relative">
        {/* Perfectly masked falling lines */}
        <div
          ref={linesContainerRef}
          className="absolute inset-0 overflow-hidden rounded-full pointer-events-none"
          style={{
            maskImage:
              "radial-gradient(ellipse 95% 95% at 50% 50%, black 62%, transparent 96%)",
          }}
        />

        <svg
          width="240"
          height="100"
          viewBox="0 0 240 140"
          className="drop-shadow-2xl relative"
        >
          <defs>
            <filter id="glassGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="9" result="blur" />
              <feComponentTransfer in="blur" result="glow">
                <feFuncA type="linear" slope="7" intercept="-2.2" />
              </feComponentTransfer>
              <feMerge>
                <feMergeNode in="glow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <linearGradient id="dynamicGradient">
              <animateTransform
                attributeName="gradientTransform"
                type="rotate"
                from="0 0.5 0.5"
                to="360 0.5 0.5"
                dur="14s"
                repeatCount="indefinite"
              />
              <stop offset="0%" stopColor="#00d4ff" />
              <stop offset="33%" stopColor="#8eff9c" />
              <stop offset="66%" stopColor="#ffb366" />
              <stop offset="100%" stopColor="#ff6bcd" />
            </linearGradient>
          </defs>

          <path
            ref={buttonRef}
            d={initialShape}
            fill="rgba(255,255,255,0.985)"
            stroke="url(#dynamicGradient)"
            strokeWidth="1.2"
            filter="url(#glassGlow)"
          />
          <path ref={textWaveRef} id="textWave" d={baseTextWave} fill="none" />

          <Link href="/works" className="block">
            <text
              fontSize="18.5"
              fontWeight="800"
              fill="#0f172a"
              letterSpacing="1.1"
              textAnchor="middle"
              fontFamily="ui-sans-serif, system-ui, sans-serif"
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
