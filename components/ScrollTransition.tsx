"use client";

import { useEffect, useState } from "react";
import { ViewTransition } from "react";

export default function ScrollViewTransition() {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const handler = () => {
      const scrollY = window.scrollY;

      if (scrollY > 250 && !active) {
        document.startViewTransition(() => {
          setActive(true);
        });
      }

      if (scrollY <= 250 && active) {
        document.startViewTransition(() => {
          setActive(false);
        });
      }
    };

    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, [active]);

  return (
    <div>
      <div className="h-[150vh] bg-gray-100 flex items-center justify-center">
        <h1 className="text-5xl font-bold">Scroll Down</h1>
      </div>

      <ViewTransition>
        <div
          className={`h-screen flex items-center justify-center transition-all duration-500 
            ${active ? "bg-purple-500 text-white" : "bg-blue-500 text-white"}`}
        >
          <h1 className="text-5xl font-bold">
            {active ? "Transition Activated" : "Original View"}
          </h1>
        </div>
      </ViewTransition>
    </div>
  );
}
