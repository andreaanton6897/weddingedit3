"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Check, ArrowUpRight, CalendarDays, Sparkles } from "lucide-react";
import { useProfile } from "@/lib/use-profile";
import { daysUntil, formatDay, formatMoney } from "@/lib/format";
import { bookingProgress, dateLine, headline, isBudgetConscious, nextSteps, KEY_BOOKINGS } from "@/lib/personalise";
import { COLOUR_PALETTES, GUEST_RANGES } from "@/lib/wedding-profile";
import { NAV } from "@/components/app-nav";
import { Panel } from "@/components/page-bits";
import { ButtonLink } from "@/components/brand";

function greetingFor(hour: number) {
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export function Dashboard() {
  const { loaded, profile: p } = useProfile();
  const [hour, setHour] = useState<number | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- browser-only value
    setHour(new Date().getHours());
  }, []);

  if (!loaded) return <div className="h-[60vh] animate-pulse rounded-[var(--radius-card)] bg-ivory" aria-label="Loading your dashboard" />;

  if (!p) {
    return (
      <div className="mx-auto max-w-2xl py-16 text-center">
        <p className="font-serif text-[20px] italic text-taupe">Welcome to The Wedding Edit</p>
        <h1 className="mt-4 text-[48px] leading-[0.95] sm:text-[68px]">Let&rsquo;s make this yours.</h1>
        <p className="mx-auto mt-5 max-w-[30rem] text-[16.5px] text-ink/70">Answer five short chapters about your wedding and your dashboard, checklist and next steps will be shaped around you.</p>
        <ButtonLink href="/onboarding" className="mt-9">Start chapter one</ButtonLink>
      </div>
    );
  }

  const days = p.dateStatus === "set" && p.weddingDate ? daysUntil(p.weddingDate) : null;
  const steps = nextSteps(p);
  const progress = bookingProgress(p);
  const budgetFirst = isBudgetConscious(p);
  const money = (n: number) => formatMoney(n, p.currency);
  const spent = p.spentStatus === "yes" && p.alreadySpent ? p.alreadySpent : 0;
  const guestLabel = p.guestCount ? `About ${p.guestCount}` : GUEST_RANGES.find((g) => g.value === p.guestRange)?.hint ?? null;
  const palettes = COLOUR_PALETTES.filter((c) => p.colours.includes(c.value));

  const details: [string, string | null][] = [
    ["Date", p.dateStatus === "set" && p.weddingDate ? formatDay(p.weddingDate) : dateLine(p)],
    ["Where", [p.location, p.country !== "Other" ? p.country : null].filter(Boolean).join(", ") || null],
    ["Guests", guestLabel],
    ["Ceremony", p.ceremonyType],
    ["Style", p.styles.length ? p.styles.join(", ") : p.styleOther],
  ];

  const budgetPanel = (
    <Panel title="Budget" className={budgetFirst ? "lg:col-span-2" : ""} action={<Link href="/budget" className="text-[14px] text-taupe hover:text-ink">Open</Link>}>
      {p.budget ? (
        <>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[13.5px] text-taupe">Left to spend</p>
              <p className="font-serif text-[52px] leading-none tracking-[-0.03em]">{money(p.budget - spent)}</p>
            </div>
            <p className="text-right text-[14px] text-taupe">of {money(p.budget)}</p>
          </div>
          <div className="mt-5 h-2 overflow-hidden rounded-full bg-linen" role="img" aria-label={`${Math.round((spent / p.budget) * 100)}% of the budget spent`}>
            <div className="h-full rounded-full bg-ink transition-all duration-700" style={{ width: `${Math.min(100, (spent / p.budget) * 100)}%` }} />
          </div>
          <dl className="mt-5 grid grid-cols-2 gap-4 text-[14.5px]">
            <div><dt className="text-taupe">Paid so far</dt><dd className="mt-0.5 font-[500] tabular-nums">{money(spent)}</dd></div>
            <div><dt className="text-taupe">Spending priorities</dt><dd className="mt-0.5">{p.spendPriorities.length ? p.spendPriorities.join(", ") : "Not chosen yet"}</dd></div>
          </dl>
          {budgetFirst && p.saveAreas.length > 0 && <p className="mt-4 border-t border-linen pt-4 text-[14px] text-ink/70">Saving on: {p.saveAreas.join(", ")}.</p>}
        </>
      ) : (
        <p className="text-[15px] text-ink/70">
          No total budget yet. <Link href="/onboarding?chapter=3" className="text-ink underline decoration-champagne-deep underline-offset-4">Add your budget</Link> to see what&rsquo;s left to spend.
        </p>
      )}
    </Panel>
  );

  const stepsPanel = (
        <Panel title="Next steps" className="lg:col-span-2" action={<span className="text-[13.5px] text-taupe">Based on your answers</span>}>
          <ol className="divide-y divide-linen">
            {steps.map((s, i) => (
              <li key={s.id}>
                <Link href={s.href} className="group flex items-start gap-4 py-4">
                  <span className="font-serif text-[26px] leading-none text-champagne-deep">{i + 1}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[16.5px] font-[500]">{s.title}</span>
                    <span className="mt-0.5 block text-[14.5px] text-ink/65">{s.why}</span>
                  </span>
                  <ArrowUpRight className="mt-1 size-4 shrink-0 text-taupe transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink" />
                </Link>
              </li>
            ))}
          </ol>
        </Panel>
  );

  const bookingsPanel = (
        <Panel title="Bookings">
          <p className="font-serif text-[52px] leading-none tracking-[-0.03em]">{progress.done}<span className="text-[26px] text-taupe"> of {progress.total}</span></p>
          <p className="mt-2 text-[14px] text-taupe">key bookings made</p>
          <div className="mt-4 flex gap-1" aria-hidden>
            {KEY_BOOKINGS.map((k) => <span key={k} className={`h-1.5 flex-1 rounded-full ${progress.booked.includes(k) ? "bg-sage" : "bg-linen"}`} />)}
          </div>
          <ul className="mt-5 grid grid-cols-2 gap-x-3 gap-y-2 text-[14px]">
            {KEY_BOOKINGS.map((k) => {
              const done = progress.booked.includes(k);
              return (
                <li key={k} className={`flex items-center gap-2 ${done ? "" : "text-taupe"}`}>
                  {done ? <Check className="size-3.5 shrink-0 text-sage" /> : <span className="size-3.5 shrink-0 rounded-full border border-linen" aria-hidden />}
                  <span className="truncate">{k}</span>
                </li>
              );
            })}
          </ul>
        </Panel>
  );

  const aestheticPanel = (
        <Panel title="Your aesthetic" action={<Link href="/onboarding?chapter=2" className="text-[14px] text-taupe hover:text-ink">Edit</Link>}>
          {palettes.length || p.styles.length || p.atmosphere.length || p.styleOther ? (
            <>
              {palettes.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {palettes.map((c) => (
                    <span key={c.value} className="flex h-10 w-20 overflow-hidden rounded-[3px] ring-1 ring-linen" title={c.value}>
                      {c.swatches.map((sw) => <span key={sw} className="flex-1" style={{ background: sw }} />)}
                    </span>
                  ))}
                </div>
              )}
              {(p.styles.length > 0 || p.styleOther) && <p className="mt-4 font-serif text-[22px] italic leading-snug">{[...p.styles, p.styleOther].filter(Boolean).join(", ")}</p>}
              {p.atmosphere.length > 0 && <p className="mt-2 text-[14.5px] text-ink/70">Feeling: {p.atmosphere.join(", ").toLowerCase()}</p>}
            </>
          ) : (
            <p className="text-[15px] text-ink/70">Choose your styles and colours and they&rsquo;ll appear here.</p>
          )}
        </Panel>
  );

  const bookedPanel = (
        <Panel title="Booked" action={<Link href="/suppliers" className="text-[14px] text-taupe hover:text-ink">Suppliers</Link>}>
          {p.bookedSuppliers.length ? (
            <ul className="space-y-3">
              {p.bookedSuppliers.map((s) => (
                <li key={s} className="flex items-center justify-between gap-3 text-[15px]">
                  <span>{s}</span>
                  <span className="rounded-full bg-ink px-2.5 py-0.5 text-[12px] text-white">Booked</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-[15px] text-ink/70">Nothing booked yet. That&rsquo;s exactly where most weddings start.</p>
          )}
        </Panel>
  );

  return (
    <div>
      {/* Opening */}
      <section className="mb-10 grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <p className="font-serif text-[19px] italic text-ink-soft">{hour !== null ? greetingFor(hour) : "Hello"}{p.name ? `, ${p.name}` : ""}.</p>
          <h1 className="mt-3 max-w-[40rem] text-[42px] leading-[0.98] sm:text-[60px]">{headline(p)}</h1>
          <p className="mt-4 text-[16px] text-ink/70">Here&rsquo;s what to focus on next.</p>
        </div>
        <div className="md:text-right">
          {days !== null && days >= 0 && p.weddingDate ? (
            <>
              <p className="font-serif text-[96px] leading-[0.8] tracking-[-0.04em] sm:text-[140px]">{days}</p>
              <p className="mt-3 font-serif text-[18px] italic text-ink-soft">{days === 1 ? "day" : "days"} to go</p>
            </>
          ) : (
            <div className="max-w-[16rem] md:ml-auto">
              <CalendarDays className="size-6 text-champagne-deep md:ml-auto" strokeWidth={1.5} />
              <p className="mt-2 font-serif text-[30px] italic leading-tight">{dateLine(p)}</p>
            </div>
          )}
        </div>
      </section>

      {/* Wedding details, like a magazine's credits line */}
      <dl className="mb-10 grid grid-cols-2 gap-x-6 gap-y-4 border-y border-ink py-5 sm:grid-cols-3 lg:grid-cols-5">
        {details.map(([k, v]) => (
          <div key={k}>
            <dt className="text-[12.5px] text-taupe">{k}</dt>
            <dd className={`mt-0.5 text-[15px] ${v ? "" : "text-taupe"}`}>{v ?? "Not decided"}</dd>
          </div>
        ))}
      </dl>

      <div className="grid gap-5 lg:grid-cols-3">
        {budgetFirst ? (
          <>
            {budgetPanel}
            {bookingsPanel}
            {stepsPanel}
            {aestheticPanel}
            {bookedPanel}
          </>
        ) : (
          <>
            {stepsPanel}
            {bookingsPanel}
            {budgetPanel}
            {aestheticPanel}
            {bookedPanel}
          </>
        )}
        <Panel title="Coming up" className={budgetFirst ? "lg:col-span-2" : "lg:col-span-3"}>
          <div className="flex gap-3 text-[15px] text-ink/70">
            <Sparkles className="mt-0.5 size-5 shrink-0 text-champagne-deep" strokeWidth={1.5} />
            <p>Your upcoming tasks, appointments and payment deadlines will appear here once you start adding them.</p>
          </div>
        </Panel>
      </div>

      {/* Quick access */}
      <section className="mt-12">
        <h2 className="text-[30px]">Your edit</h2>
        <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {NAV.filter((n) => n.href !== "/dashboard").map(({ href, label, Icon }) => (
            <li key={href}>
              <Link href={href} className="group flex h-full items-center gap-3 rounded-[var(--radius-card)] border border-linen bg-white px-4 py-4 transition-all hover:-translate-y-0.5 hover:border-ink/30 hover:shadow-soft">
                <Icon className="size-5 text-taupe transition-colors group-hover:text-ink" strokeWidth={1.5} />
                <span className="text-[15px]">{label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
