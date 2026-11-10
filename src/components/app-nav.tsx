"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  Home, ListChecks, Wallet, Store, Users, CalendarDays, Images, Clock, Settings, MoreHorizontal, X,
} from "lucide-react";
import { Wordmark } from "./brand";

export const NAV = [
  { href: "/dashboard", label: "Dashboard", Icon: Home },
  { href: "/checklist", label: "Checklist", Icon: ListChecks },
  { href: "/budget", label: "Budget", Icon: Wallet },
  { href: "/suppliers", label: "Suppliers", Icon: Store },
  { href: "/guests", label: "Guests", Icon: Users },
  { href: "/calendar", label: "Calendar", Icon: CalendarDays },
  { href: "/moodboards", label: "Moodboards", Icon: Images },
  { href: "/run-sheet", label: "Run sheet", Icon: Clock },
];
const SETTINGS = { href: "/settings", label: "Settings", Icon: Settings };

const isActive = (path: string, href: string) => path === href || path.startsWith(href + "/");

function SideLink({ href, label, Icon, on }: { href: string; label: string; Icon: typeof Home; on: boolean }) {
  return (
    <Link
      href={href}
      aria-current={on ? "page" : undefined}
      className={`group flex items-center gap-3 rounded-[var(--radius-control)] px-3 py-2.5 text-[15px] transition-colors ${on ? "bg-ink text-white" : "text-ink/70 hover:bg-ivory hover:text-ink"}`}
    >
      <Icon className={`size-[18px] transition-transform group-hover:scale-105 ${on ? "text-white" : "text-taupe group-hover:text-ink"}`} strokeWidth={1.5} />
      {label}
    </Link>
  );
}

export function Sidebar() {
  const path = usePathname();
  return (
    <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col border-r border-linen bg-white px-4 py-7 lg:flex">
      <Wordmark href="/dashboard" className="px-3 text-[25px]" />
      <nav aria-label="Wedding workspace" className="mt-9 flex flex-col gap-1">
        {NAV.map((n) => <SideLink key={n.href} {...n} on={isActive(path, n.href)} />)}
      </nav>
      <div className="mt-auto border-t border-linen pt-4">
        <SideLink {...SETTINGS} on={isActive(path, SETTINGS.href)} />
      </div>
    </aside>
  );
}

export function MobileTopBar() {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-linen bg-white/95 px-5 py-3.5 backdrop-blur lg:hidden">
      <Wordmark href="/dashboard" className="text-[22px]" />
      <Link href="/settings" aria-label="Settings" className="grid size-10 place-items-center rounded-full text-taupe hover:bg-ivory">
        <Settings className="size-5" strokeWidth={1.5} />
      </Link>
    </header>
  );
}

export function MobileTabBar() {
  const path = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- close menu on navigation
    setMoreOpen(false);
  }, [path]);
  useEffect(() => {
    if (!moreOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMoreOpen(false);
    window.addEventListener("keydown", onKey);
    sheetRef.current?.querySelector("a")?.focus();
    return () => window.removeEventListener("keydown", onKey);
  }, [moreOpen]);

  const tabs = NAV.slice(0, 4);
  const moreItems = [...NAV.slice(4), SETTINGS];
  const moreActive = moreItems.some((m) => isActive(path, m.href));

  return (
    <>
      {moreOpen && <div className="fixed inset-0 z-40 bg-ink/25 lg:hidden" onClick={() => setMoreOpen(false)} aria-hidden />}
      {moreOpen && (
        <div ref={sheetRef} role="dialog" aria-label="More sections" className="fixed inset-x-3 bottom-[calc(76px+env(safe-area-inset-bottom))] z-50 rounded-[var(--radius-card)] border border-linen bg-white p-2 shadow-lift lg:hidden">
          {moreItems.map(({ href, label, Icon }) => (
            <Link key={href} href={href} aria-current={isActive(path, href) ? "page" : undefined} className="flex items-center gap-3 rounded-[var(--radius-control)] px-4 py-3.5 text-[16px] hover:bg-ivory aria-[current=page]:font-[500]">
              <Icon className="size-5 text-taupe" strokeWidth={1.5} /> {label}
            </Link>
          ))}
        </div>
      )}
      <nav aria-label="Wedding workspace" className="fixed inset-x-0 bottom-0 z-50 border-t border-linen bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden">
        <ul className="mx-auto grid h-[68px] max-w-lg grid-cols-5">
          {tabs.map(({ href, label, Icon }) => {
            const on = isActive(path, href);
            return (
              <li key={href}>
                <Link href={href} aria-current={on ? "page" : undefined} className={`flex h-full flex-col items-center justify-center gap-1 text-[11.5px] ${on ? "font-[600] text-ink" : "text-taupe"}`}>
                  <Icon className="size-5" strokeWidth={on ? 1.9 : 1.5} />
                  {label}
                </Link>
              </li>
            );
          })}
          <li>
            <button type="button" onClick={() => setMoreOpen((o) => !o)} aria-expanded={moreOpen} className={`flex h-full w-full flex-col items-center justify-center gap-1 text-[11.5px] ${moreActive || moreOpen ? "font-[600] text-ink" : "text-taupe"}`}>
              {moreOpen ? <X className="size-5" strokeWidth={1.5} /> : <MoreHorizontal className="size-5" strokeWidth={1.5} />}
              More
            </button>
          </li>
        </ul>
      </nav>
    </>
  );
}
