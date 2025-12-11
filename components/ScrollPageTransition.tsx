// components/ScrollPageTransition.tsx
import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import WorksSection from "./WorksSection";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface ScrollPageTransitionProps {
  children: React.ReactNode;
  id: string;
  className?: string;
}

export default function ScrollPageTransition({
  children,
  id,
  className = "",
}: ScrollPageTransitionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    // Create timeline for entrance animation
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top center",
        end: "bottom center",
        scrub: true,
      },
    });

    tl.fromTo(
      section,
      {
        opacity: 0.3,
        scale: 0.9,
      },
      {
        opacity: 1,
        scale: 1,
        duration: 1.5,
        ease: "power2.out",
      }
    );

    tlRef.current = tl;

    return () => {
      if (tlRef.current) {
        tlRef.current.kill();
      }
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id={id}
      className={`min-h-screen flex items-center justify-center ${className}`}
    >
      {children}
    </section>
  );
}

// Usage in your page
function WorksPage() {
  return (
    <>
      <ScrollPageTransition
        id="intro"
        className="bg-gradient-to-b from-blue-50 to-indigo-100"
      >
        <div className="text-center">
          <h1 className="text-5xl font-bold">Our Works</h1>
          <p className="mt-4">Showcasing our best projects</p>
        </div>
      </ScrollPageTransition>

      <WorksSection />
    </>
  );
}
