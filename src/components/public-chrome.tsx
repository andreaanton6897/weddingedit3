"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { ButtonLink, Wordmark } from "./brand";

const LINKS = [
  { href: "/features", label: "Features" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
];

export function PublicHeader() {
  const path = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- close the menu after navigating
    setOpen(false);
  }, [path]);

  return (
    <header className="sticky top-0 z-40 border-b border-linen bg-white/95 backdrop-blur">
      <div className="mx-auto grid max-w-7xl grid-cols-[auto_1fr_auto] items-center gap-3 px-4 py-4 sm:gap-4 sm:px-8 md:py-5 lg:grid-cols-[1fr_auto_1fr]">
        <nav aria-label="Main" className="hidden items-center gap-7 lg:flex">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} aria-current={path === l.href ? "page" : undefined}
              className={`relative text-[14.5px] transition-colors after:absolute after:-bottom-1 after:left-0 after:h-px after:bg-ink after:transition-all ${path === l.href ? "text-ink after:w-full" : "text-ink-soft after:w-0 hover:text-ink hover:after:w-full"}`}>
              {l.label}
            </Link>
          ))}
        </nav>
        <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-controls="mobile-menu" className="-ml-2 grid size-10 place-items-center justify-self-start text-ink lg:hidden" aria-label={open ? "Close menu" : "Open menu"}>
          {open ? <X className="size-5" strokeWidth={1.5} /> : <Menu className="size-5" strokeWidth={1.5} />}
        </button>
        <Wordmark className="justify-self-start text-[18px] min-[360px]:text-[21px] sm:justify-self-center sm:text-[24px] md:text-[34px]" />
        <div className="flex justify-end">
          <ButtonLink href="/onboarding" className="h-10! whitespace-nowrap px-3! text-[12.5px] min-[360px]:px-3.5! min-[360px]:text-[13px] sm:px-5! sm:text-[13.5px]">Start planning</ButtonLink>
        </div>
      </div>
      {open && (
        <nav id="mobile-menu" aria-label="Main" className="border-t border-linen bg-white px-5 pb-6 pt-2 lg:hidden">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="block border-b border-linen py-4 font-serif text-[26px]">{l.label}</Link>
          ))}
        </nav>
      )}
    </header>
  );
}

export function PublicFooter() {
  return (
    <footer className="border-t border-linen bg-ivory">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Wordmark className="text-[30px]" />
          <p className="mt-3 max-w-[22rem] font-serif text-[18px] italic text-ink-soft">Your wedding, beautifully organised.</p>
        </div>
        <nav aria-label="Footer" className="grid gap-2 text-[15px]">
          {LINKS.map((l) => <Link key={l.href} href={l.href} className="text-ink-soft hover:text-ink">{l.label}</Link>)}
        </nav>
        <div className="text-[15px] text-ink-soft">
          <p>Free during early testing.</p>
          <Link href="/onboarding" className="mt-2 inline-block text-ink underline decoration-champagne-deep underline-offset-4">Start planning</Link>
        </div>
      </div>
    </footer>
  );
}
