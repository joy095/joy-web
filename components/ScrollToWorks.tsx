"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ScrollToWorks() {
  const router = useRouter();

  useEffect(() => {
    let triggered = false;

    const handleScroll = () => {
      if (triggered) return;

      const y = window.scrollY;

      if (y > 600) {
        triggered = true;

        document.startViewTransition(() => {
          router.push("/works"); // No page refresh
        });
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [router]);

  return null;
}
