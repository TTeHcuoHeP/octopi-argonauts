import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "ghost" | "link";
type Size = "md" | "lg";

type ButtonProps = {
  href?: string;
  variant?: Variant;
  size?: Size;
  external?: boolean;
  children: ReactNode;
  className?: string;
} & Omit<ComponentPropsWithoutRef<"a">, "href" | "children">;

const base =
  "group relative inline-flex items-center justify-center gap-3 whitespace-nowrap font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.28em] transition-colors duration-500 ease-luxe focus-visible:outline-1 focus-visible:outline-gold focus-visible:outline-offset-4";

const variants: Record<Variant, string> = {
  primary:
    "bg-gold text-ocean-deep hover:bg-gold-light active:bg-gold-dim [&_svg]:transition-transform [&_svg]:duration-500 hover:[&_svg]:translate-x-1",
  ghost:
    "border border-line-gold text-limestone hover:border-gold hover:text-gold [&_svg]:transition-transform [&_svg]:duration-500 hover:[&_svg]:translate-x-1",
  link: "text-gold hover:text-gold-light underline-offset-8 hover:underline",
};

const sizes: Record<Size, string> = {
  md: "h-12 px-7",
  lg: "h-14 px-9",
};

export function Button({
  href = "#",
  variant = "primary",
  size = "md",
  external,
  children,
  className,
  ...rest
}: ButtonProps) {
  const classes = cn(base, variants[variant], variant !== "link" && sizes[size], className);
  const isExternal = external ?? href.startsWith("http");

  if (isExternal) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes} {...rest}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} {...rest}>
      {children}
    </Link>
  );
}
