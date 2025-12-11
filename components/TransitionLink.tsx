"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { PropsWithChildren } from "react";

export default function TransitionLink({
  href,
  children,
  className,
}: PropsWithChildren<{ href: string; className?: string }>) {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();

    document.startViewTransition(() => {
      router.push(href);
    });
  };

  return (
    <Link href={href} onClick={handleClick} className={className}>
      {children}
    </Link>
  );
}
