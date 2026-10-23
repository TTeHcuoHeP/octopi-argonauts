"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { APPLY_URL, navLinks } from "@/data/site";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

/**
 * Transparent header that gains a translucent Deep Ocean surface after scrolling,
 * hides on scroll-down and returns on scroll-up. Mobile menu is a full-screen sheet.
 */
export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        setScrolled(y > 24);
        const delta = y - lastY;
        if (Math.abs(delta) > 6) {
          setHidden(delta > 0 && y > 160);
          lastY = y;
        }
        ticking = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[transform,background-color,border-color,backdrop-filter] duration-700 ease-luxe",
          hidden && !open ? "-translate-y-full" : "translate-y-0",
          scrolled || open
            ? "border-b border-line bg-ocean/85 backdrop-blur-md"
            : "border-b border-transparent bg-transparent",
        )}
      >
        <div className="site-container flex h-[var(--header-height)] items-center justify-between">
          <Link href="#top" className="flex shrink-0 items-center" aria-label="Octopi Poker — back to top">
            <Image
              src="/logos/Brand%20Logo.svg"
              alt=""
              width={105}
              height={35}
              priority
              className="h-8 w-auto md:h-9"
            />
          </Link>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-9">
              {navLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="relative font-sans text-[0.6875rem] font-medium uppercase tracking-[0.22em] text-limestone-soft transition-colors duration-500 hover:text-gold after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-gold after:transition-transform after:duration-500 after:ease-luxe hover:after:scale-x-100"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-4">
            <div className="hidden sm:block">
              <Button href={APPLY_URL} size="md">
                Apply to Join
              </Button>
            </div>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className="flex h-11 w-11 items-center justify-center text-limestone transition-colors hover:text-gold lg:hidden"
            >
              {open ? <X className="h-5 w-5" strokeWidth={1.5} /> : <Menu className="h-5 w-5" strokeWidth={1.5} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={cn(
          "fixed inset-0 z-40 flex flex-col bg-ocean-deep/97 pt-[var(--header-height)] transition-opacity duration-500 ease-luxe lg:hidden",
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        )}
        aria-hidden={!open}
      >
        <nav aria-label="Mobile" className="site-container flex flex-1 flex-col justify-center">
          <ul className="space-y-1">
            {navLinks.map((item, i) => (
              <li key={item.href} className="border-b border-line">
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  tabIndex={open ? 0 : -1}
                  className="flex items-baseline justify-between py-5 font-display text-3xl text-limestone transition-colors hover:text-gold"
                >
                  <span>{item.label}</span>
                  <span className="font-sans text-[0.625rem] tracking-[0.3em] text-stone">
                    0{i + 1}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-10">
            <Button href={APPLY_URL} size="lg" className="w-full" tabIndex={open ? 0 : -1}>
              Apply to Join
            </Button>
            <p className="eyebrow-muted mt-6 text-center">
              Applications open Nov 1 – Dec 31, 2026
            </p>
          </div>
        </nav>
      </div>
    </>
  );
}
