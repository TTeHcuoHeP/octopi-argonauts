import Link from "next/link";
import { footerLegalLinks, navLinks, site } from "@/data/site";
import { CompassMark } from "@/components/graphics/CompassMark";

export function Footer() {
  // Static so the page prerenders fully; update alongside the yearly program.
  const year = 2026;

  return (
    <footer className="border-t border-line bg-ocean-deep">
      <div className="site-container py-16 md:py-20">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="flex items-center gap-3 text-gold">
              <CompassMark className="h-8 w-8" />
              <span className="monument text-sm text-limestone">
                Argonauts <span className="text-gold">2027</span>
              </span>
            </div>
            <p className="mt-6 max-w-sm font-display text-2xl italic leading-snug text-limestone-soft">
              The Ultimate Tournament Poker Study Group.
            </p>
            <p className="eyebrow-muted mt-8">
              Supported by <span className="text-limestone">{site.supporter}</span>
            </p>
          </div>

          <nav aria-label="Footer" className="md:col-span-4 md:col-start-7">
            <p className="eyebrow mb-6">Navigate</p>
            <ul className="grid grid-cols-2 gap-x-8 gap-y-3">
              {navLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="font-sans text-sm text-limestone-soft transition-colors hover:text-gold"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-2">
            <p className="eyebrow mb-6">Legal</p>
            <ul className="space-y-3">
              {footerLegalLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="font-sans text-sm text-limestone-soft transition-colors hover:text-gold"
                    aria-disabled={item.href === "#"}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="rule mt-16" />

        <div className="mt-8 flex flex-col gap-4 text-xs text-stone sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.supporter}. All rights reserved.
          </p>
          <p className="tracking-[0.2em] uppercase">Invitation only · Limited to 40</p>
        </div>
      </div>
    </footer>
  );
}
