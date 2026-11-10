import Link from "next/link";

/** The masthead. Scales with the font-size set on it. */
export function Wordmark({ href = "/", className = "" }: { href?: string; className?: string }) {
  return (
    <Link
      href={href}
      className={`inline-flex items-baseline gap-[0.22em] whitespace-nowrap font-serif leading-none tracking-[-0.025em] text-ink ${className}`}
      aria-label="The Wedding Edit, home"
    >
      <span className="text-[0.55em] italic tracking-normal text-taupe">The</span>
      <span>Wedding Edit</span>
    </Link>
  );
}

type Variant = "primary" | "secondary" | "quiet";

const base =
  "inline-flex items-center justify-center gap-2 rounded-[var(--radius-control)] h-12 text-[14.5px] font-[500] tracking-[0.02em] transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
const variants: Record<Variant, string> = {
  primary: "px-7 bg-ink text-ivory hover:bg-ink-soft",
  secondary: "px-7 border border-ink text-ink hover:bg-ink hover:text-ivory",
  quiet: "text-ink underline decoration-champagne-deep decoration-1 underline-offset-[6px] hover:decoration-ink",
};

export function buttonClass(variant: Variant = "primary", extra = "") {
  return `${base} ${variants[variant]} ${extra}`;
}

export function ButtonLink({ href, variant = "primary", className = "", children }: {
  href: string; variant?: Variant; className?: string; children: React.ReactNode;
}) {
  return (
    <Link href={href} className={buttonClass(variant, className)}>
      {children}
    </Link>
  );
}

export function SampleTag({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center border border-champagne px-1.5 py-[1px] font-serif text-[11.5px] italic text-champagne-deep ${className}`}
      title="Demonstration data — not your real information"
    >
      Sample
    </span>
  );
}
