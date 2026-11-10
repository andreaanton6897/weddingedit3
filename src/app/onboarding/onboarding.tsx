"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";
import { Wordmark, buttonClass } from "@/components/brand";
import { Photo } from "@/components/photo";
import { Celebration } from "@/components/celebration";
import type { PhotoAvailability, PhotoKey } from "@/lib/photos";
import {
  ATMOSPHERES, BUDGET_AREAS, CEREMONY_TYPES, COLOUR_PALETTES, COUNTRIES, COUNTRY_CURRENCY, CURRENCIES,
  GUEST_RANGES, HELP_AREAS, OUTSTANDING, PLANNER_HELP, PLANNING_STAGES, PRIORITIES, STYLES,
  SUPPLIER_TYPES, WORRIES, emptyProfile, loadProfile, saveProfile, type CurrencyCode, type WeddingProfile,
} from "@/lib/wedding-profile";
import { daysUntil, formatDay, todayISO } from "@/lib/format";
import { headline } from "@/lib/personalise";

const CHAPTERS: { title: string; photo: PhotoKey; screens: number }[] = [
  { title: "Your wedding", photo: "venue", screens: 3 },
  { title: "Your aesthetic", photo: "florals", screens: 3 },
  { title: "Your budget", photo: "stationery", screens: 2 },
  { title: "Your progress", photo: "tablescape", screens: 2 },
  { title: "Your priorities", photo: "details", screens: 2 },
];
const CHAPTER_START = CHAPTERS.reduce<number[]>((acc, c, i) => [...acc, i === 0 ? 0 : acc[i - 1] + CHAPTERS[i - 1].screens], []);
const TOTAL = CHAPTERS.reduce((n, c) => n + c.screens, 0);
const chapterOf = (screen: number) => CHAPTER_START.findLastIndex((s) => screen >= s);

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export function Onboarding({ photos }: { photos: PhotoAvailability }) {
  const router = useRouter();
  const [screen, setScreen] = useState(0);
  const [p, setP] = useState<WeddingProfile>(emptyProfile);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState<"idle" | "saved" | "failed">("idle");
  const [editingChapter, setEditingChapter] = useState<number | null>(null);
  const [done, setDone] = useState(false);
  const [currencyTouched, setCurrencyTouched] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);

  // Load any earlier answers, and open a specific chapter when editing from settings.
  useEffect(() => {
    const existing = loadProfile();
    const chapterParam = Number(new URLSearchParams(window.location.search).get("chapter"));
    /* eslint-disable react-hooks/set-state-in-effect -- reading browser-only state after mount */
    if (existing) {
      setP(existing);
      // Treat the currency as her own choice only if it differs from her country's usual one.
      setCurrencyTouched(existing.currency !== (COUNTRY_CURRENCY[existing.country ?? ""] ?? "GBP"));
    }
    // Next.js may keep this page alive in the background, so reset its state each time it opens.
    setDone(false);
    setError(null);
    if (chapterParam >= 1 && chapterParam <= CHAPTERS.length) {
      setEditingChapter(chapterParam - 1);
      setScreen(CHAPTER_START[chapterParam - 1]);
    } else {
      setEditingChapter(null);
      setScreen(0);
    }
    setLoaded(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  // Automatic saving: every change is written to this browser shortly after it's made.
  useEffect(() => {
    if (!loaded) return;
    const t = setTimeout(() => setSaved(saveProfile(p) ? "saved" : "failed"), 350);
    return () => clearTimeout(t);
  }, [p, loaded]);

  // Move focus to the new question so screen readers and keyboards follow along.
  useEffect(() => {
    if (loaded) headingRef.current?.focus();
  }, [screen, loaded]);

  const set = <K extends keyof WeddingProfile>(key: K, value: WeddingProfile[K]) => {
    setError(null);
    setP((prev) => ({ ...prev, [key]: value }));
  };
  const toggle = (key: "styles" | "colours" | "atmosphere" | "spendPriorities" | "saveAreas" | "bookedSuppliers" | "outstanding" | "topPriorities" | "worries" | "helpAreas", value: string, max?: number) => {
    setError(null);
    setP((prev) => {
      const list = prev[key];
      if (list.includes(value)) return { ...prev, [key]: list.filter((v) => v !== value) };
      if (max && list.length >= max) {
        setError(`Choose up to ${max}. Remove one to pick another.`);
        return prev;
      }
      return { ...prev, [key]: [...list, value] };
    });
  };

  // "Venue booked" is asked twice; keep both answers in step.
  const setVenue = (booked: boolean) => {
    setError(null);
    setP((prev) => ({
      ...prev,
      venueBooked: booked,
      bookedSuppliers: booked
        ? prev.bookedSuppliers.includes("Venue") ? prev.bookedSuppliers : ["Venue", ...prev.bookedSuppliers]
        : prev.bookedSuppliers.filter((s) => s !== "Venue"),
    }));
  };

  function validate(): string | null {
    if (screen === 0 && p.dateStatus === "set") {
      if (!p.weddingDate) return "Choose your date, or select another option.";
      const d = daysUntil(p.weddingDate);
      if (d === null || d < 0) return "That date has already passed. Choose a future date.";
    }
    if (screen === 2 && p.guestCount !== null && (!Number.isInteger(p.guestCount) || p.guestCount < 1 || p.guestCount > 2000))
      return "Guest numbers should be a whole number between 1 and 2,000.";
    if (screen === 6) {
      if (p.budget !== null && (!(p.budget > 0) || p.budget > 10_000_000)) return "Budget should be more than 0. A rough figure is fine.";
      if (p.spentStatus === "yes" && p.alreadySpent !== null && !(p.alreadySpent >= 0)) return "The amount already spent can't be negative.";
      if (p.spentStatus === "yes" && p.alreadySpent !== null && p.budget !== null && p.alreadySpent > p.budget) return "You've spent more than your total budget. Check both figures.";
    }
    return null;
  }

  function go(to: number) {
    setError(null);
    if (to < 0) return router.push(editingChapter !== null ? "/settings" : "/");
    if (editingChapter !== null && chapterOf(to) !== editingChapter) {
      saveProfile(p);
      return router.push("/settings?saved=1");
    }
    if (to >= TOTAL) return finish();
    setScreen(to);
    window.scrollTo({ top: 0 });
  }

  function next() {
    const problem = validate();
    if (problem) return setError(problem);
    go(screen + 1);
  }

  function finish() {
    const completed = { ...p, completedAt: p.completedAt ?? new Date().toISOString() };
    if (!saveProfile(completed)) {
      setSaved("failed");
      return setError("Your browser blocked saving. Check that cookies and site data are allowed, then try again.");
    }
    setP(completed);
    setDone(true);
    window.scrollTo({ top: 0 });
  }

  const chapter = chapterOf(screen);
  const name = p.name?.trim();

  if (done) {
    return (
      <div className="flex min-h-dvh flex-col bg-white">
        <Celebration />
        <header className="mx-auto w-full max-w-6xl px-5 py-6 sm:px-8"><Wordmark className="text-[26px]" /></header>
        <main className="mx-auto grid w-full max-w-6xl flex-1 items-center gap-12 px-5 pb-16 sm:px-8 lg:grid-cols-2">
          <div>
            <p className="font-serif text-[20px] italic text-taupe">{name ? `Thank you, ${name}.` : "Thank you."}</p>
            <h1 className="mt-4 text-[52px] leading-[0.95] sm:text-[80px]">Your edit is ready.</h1>
            <p className="mt-6 max-w-[30rem] font-serif text-[22px] italic leading-snug text-ink-soft">{headline(p)}</p>
            <p className="mt-5 max-w-[30rem] text-[16px] text-ink/70">
              We&rsquo;ve used your answers to shape your dashboard and next steps. You can change any answer later in Settings.
            </p>
            <button type="button" onClick={() => router.push("/dashboard")} className={buttonClass("primary", "mt-10")}>
              Open my dashboard
            </button>
          </div>
          <Photo name="hero" available={photos.hero} priority className="aspect-[4/5] w-full rounded-[var(--radius-card)]" />
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh flex-col bg-white">
      <header className="sticky top-0 z-20 border-b border-linen bg-white/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <Wordmark className="text-[22px] sm:text-[26px]" />
          <p className="flex items-center gap-1.5 text-[13px] text-taupe" aria-live="polite">
            {saved === "saved" && <><Check className="size-3.5 text-sage" /> Saved</>}
            {saved === "failed" && <span className="text-rose">Not saved</span>}
          </p>
        </div>
        <nav aria-label="Chapters" className="mx-auto w-full max-w-6xl px-5 sm:px-8">
          <ol className="hidden grid-cols-5 gap-4 md:grid">
            {CHAPTERS.map((c, i) => {
              const state = i < chapter ? "done" : i === chapter ? "current" : "todo";
              const canJump = editingChapter === null && i <= chapter;
              return (
                <li key={c.title}>
                  <button
                    type="button"
                    disabled={!canJump}
                    onClick={() => go(CHAPTER_START[i])}
                    aria-current={state === "current" ? "step" : undefined}
                    className={`w-full border-t-2 pb-3 pt-2 text-left text-[13px] transition-colors ${state === "current" ? "border-ink text-ink" : state === "done" ? "border-sage text-ink/70 hover:text-ink" : "border-linen text-taupe"} disabled:cursor-default`}
                  >
                    <span className="font-serif italic">Chapter {i + 1}</span>
                    <span className="block font-[500]">{c.title}</span>
                  </button>
                </li>
              );
            })}
          </ol>
          <div className="pb-3 md:hidden">
            <p className="text-[13px]"><span className="font-serif italic text-taupe">Chapter {chapter + 1} of 5</span> <span className="font-[500]">{CHAPTERS[chapter].title}</span></p>
            <div className="mt-2 h-[2px] bg-linen"><div className="h-[2px] bg-ink transition-all duration-500" style={{ width: `${((screen + 1) / TOTAL) * 100}%` }} /></div>
          </div>
        </nav>
      </header>

      <main className="mx-auto grid w-full max-w-6xl flex-1 gap-12 px-5 pb-12 pt-10 sm:px-8 sm:pt-14 lg:grid-cols-[1fr_340px]">
        <form className="flex min-w-0 flex-col" onSubmit={(e) => { e.preventDefault(); next(); }} noValidate>
          <div className="flex-1">
            {screen === 0 && (
              <Question headingRef={headingRef} title="Congratulations. Let's begin with you." hint="Everything here is optional. Skip whatever you haven't decided.">
                <TextField id="name" label="What should we call you?" value={p.name} onChange={(v) => set("name", v)} placeholder="Your first name" autoComplete="given-name" />
                <Group label="Have you chosen a date?">
                  <div className="grid gap-3 sm:grid-cols-3">
                    <OptionCard on={p.dateStatus === "set"} onClick={() => set("dateStatus", "set")} title="Yes" hint="We have a date" />
                    <OptionCard on={p.dateStatus === "roughly"} onClick={() => set("dateStatus", "roughly")} title="Roughly" hint="A month or season" />
                    <OptionCard on={p.dateStatus === "undecided"} onClick={() => set("dateStatus", "undecided")} title="Not yet" hint="Still deciding" />
                  </div>
                </Group>
                {p.dateStatus === "set" && (
                  <Field id="date" label="Your wedding date">
                    <input id="date" type="date" min={todayISO()} value={p.weddingDate ?? ""} onChange={(e) => set("weddingDate", e.target.value || null)} className={inputClass} />
                    {p.weddingDate && (daysUntil(p.weddingDate) ?? -1) >= 0 && (
                      <p className="mt-3 font-serif text-[22px] italic text-ink-soft">{formatDay(p.weddingDate)}, in {daysUntil(p.weddingDate)} days.</p>
                    )}
                  </Field>
                )}
                {p.dateStatus === "roughly" && <MonthPicker value={p.roughMonth} onChange={(v) => set("roughMonth", v)} />}
              </Question>
            )}

            {screen === 1 && (
              <Question headingRef={headingRef} title={`Where are you getting married${name ? `, ${name}` : ""}?`} hint="This shapes your currency, your checklist and the traditions that apply to you.">
                <Field id="country" label="Country">
                  <select
                    id="country"
                    value={p.country ?? ""}
                    onChange={(e) => {
                      const c = e.target.value || null;
                      set("country", c);
                      // Follow the country's currency unless she has already chosen a different one herself.
                      const previousDefault = COUNTRY_CURRENCY[p.country ?? ""] ?? "GBP";
                      if (c && COUNTRY_CURRENCY[c] && (!currencyTouched || p.currency === previousDefault)) set("currency", COUNTRY_CURRENCY[c]);
                    }}
                    className={inputClass}
                  >
                    <option value="">Choose a country</option>
                    {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </Field>
                <TextField id="location" label="Town, city or region" value={p.location} onChange={(v) => set("location", v)} placeholder="e.g. Lake Como" />
                <Group label="Is it a local or destination wedding?">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <OptionCard on={p.weddingKind === "local"} onClick={() => set("weddingKind", "local")} title="Local" hint="Close to where we live" />
                    <OptionCard on={p.weddingKind === "destination"} onClick={() => set("weddingKind", "destination")} title="Destination" hint="Most guests will travel" />
                  </div>
                </Group>
              </Question>
            )}

            {screen === 2 && (
              <Question headingRef={headingRef} title="What kind of wedding, and how many guests?" hint="Rough numbers are perfect.">
                <Group label="Ceremony">
                  <Chips options={CEREMONY_TYPES} selected={p.ceremonyType ? [p.ceremonyType] : []} onToggle={(v) => set("ceremonyType", p.ceremonyType === v ? null : v)} single />
                </Group>
                <Group label="Guests">
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {GUEST_RANGES.map((g) => (
                      <OptionCard key={g.value} on={p.guestRange === g.value} onClick={() => set("guestRange", p.guestRange === g.value ? null : g.value)} title={g.label} hint={g.hint} />
                    ))}
                  </div>
                </Group>
                <Field id="guests" label="Exact number, if you know it (optional)">
                  <input id="guests" type="number" inputMode="numeric" min={1} max={2000} value={p.guestCount ?? ""} onChange={(e) => set("guestCount", e.target.value === "" ? null : Number(e.target.value))} className={inputClass} placeholder="e.g. 90" />
                </Field>
              </Question>
            )}

            {screen === 3 && (
              <Question headingRef={headingRef} title="How would you describe your style?" hint="Choose as many as feel right.">
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {STYLES.map((s) => {
                    const on = p.styles.includes(s.value);
                    return (
                      <button key={s.value} type="button" aria-pressed={on} onClick={() => toggle("styles", s.value)} className="group text-left">
                        <span className={`relative block overflow-hidden rounded-[var(--radius-card)] ring-offset-2 ring-offset-white transition-shadow ${on ? "ring-2 ring-ink" : "ring-1 ring-linen group-hover:ring-ink/40"}`}>
                          <Photo name={s.photo} available={photos[s.photo]} label={false} zoom decorative className="aspect-[4/5] w-full" sizes="(min-width: 640px) 25vw, 50vw" />
                          {on && <span className="absolute right-2 top-2 grid size-7 place-items-center rounded-full bg-ink text-white"><Check className="size-4" /></span>}
                        </span>
                        <span className={`mt-2 block font-serif text-[20px] ${on ? "italic" : ""}`}>{s.value}</span>
                      </button>
                    );
                  })}
                </div>
                <TextField id="style-other" label="Something else? Describe it in a few words" value={p.styleOther} onChange={(v) => set("styleOther", v)} placeholder="e.g. Art deco glamour" />
              </Question>
            )}

            {screen === 4 && (
              <Question headingRef={headingRef} title="Colours and atmosphere" hint="Pick the palettes you're drawn to and the feeling you want guests to remember.">
                <Group label="Colours you're considering">
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {COLOUR_PALETTES.map((c) => {
                      const on = p.colours.includes(c.value);
                      return (
                        <button key={c.value} type="button" aria-pressed={on} onClick={() => toggle("colours", c.value)} className={`rounded-[var(--radius-card)] border p-3 text-left transition-colors ${on ? "border-ink" : "border-linen hover:border-ink/40"}`}>
                          <span className="flex h-14 overflow-hidden rounded-[3px]" aria-hidden>
                            {c.swatches.map((sw) => <span key={sw} className="flex-1 border-r border-white/40 last:border-0" style={{ background: sw }} />)}
                          </span>
                          <span className="mt-2 flex items-center justify-between gap-2 text-[14px]">
                            {c.value}
                            {on && <Check className="size-4 shrink-0" />}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </Group>
                <Group label="Atmosphere">
                  <Chips options={ATMOSPHERES} selected={p.atmosphere} onToggle={(v) => toggle("atmosphere", v)} />
                </Group>
              </Question>
            )}

            {screen === 5 && (
              <Question headingRef={headingRef} title="Would you like a moodboard?" hint="You'll be able to upload inspiration images and build colour palettes in your moodboards.">
                <div className="grid gap-3 sm:grid-cols-2">
                  <OptionCard on={p.wantsMoodboard === true} onClick={() => set("wantsMoodboard", true)} title="Yes, start one for me" hint="We'll begin with your styles and colours" />
                  <OptionCard on={p.wantsMoodboard === false} onClick={() => set("wantsMoodboard", false)} title="Maybe later" hint="You can add one any time" />
                </div>
                <p className="text-[14px] text-taupe">Image uploads open when moodboards are built in a later phase. For now we&rsquo;ll remember your choice.</p>
              </Question>
            )}

            {screen === 6 && (
              <Question headingRef={headingRef} title="Let's talk budget." hint="Estimates are fine. Everything stays private to you.">
                <div className="grid gap-6 sm:grid-cols-[1fr_1.2fr]">
                  <Field id="currency" label="Currency">
                    <select id="currency" value={p.currency} onChange={(e) => { setCurrencyTouched(true); set("currency", e.target.value as CurrencyCode); }} className={inputClass}>
                      {CURRENCIES.map((c) => <option key={c.code} value={c.code}>{c.label}</option>)}
                    </select>
                  </Field>
                  <Field id="budget" label="Total wedding budget">
                    <input id="budget" type="number" inputMode="decimal" min={1} step="any" value={p.budget ?? ""} onChange={(e) => set("budget", e.target.value === "" ? null : Number(e.target.value))} className={inputClass} placeholder="e.g. 25000" />
                  </Field>
                </div>
                <Group label="Have you already spent money on the wedding?">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <OptionCard on={p.spentStatus === "yes"} onClick={() => set("spentStatus", "yes")} title="Yes" hint="Deposits or purchases" />
                    <OptionCard on={p.spentStatus === "no"} onClick={() => { set("spentStatus", "no"); set("alreadySpent", null); }} title="Not yet" hint="Nothing paid so far" />
                  </div>
                </Group>
                {p.spentStatus === "yes" && (
                  <Field id="spent" label="Roughly how much?">
                    <input id="spent" type="number" inputMode="decimal" min={0} step="any" value={p.alreadySpent ?? ""} onChange={(e) => set("alreadySpent", e.target.value === "" ? null : Number(e.target.value))} className={inputClass} placeholder="e.g. 2500" />
                  </Field>
                )}
              </Question>
            )}

            {screen === 7 && (
              <Question headingRef={headingRef} title="Where should the money go?" hint="This helps us put the right things first in your budget.">
                <Group label="Your biggest spending priorities (up to 3)">
                  <Chips options={BUDGET_AREAS} selected={p.spendPriorities} onToggle={(v) => toggle("spendPriorities", v, 3)} />
                </Group>
                <Group label="Where would you like to save?">
                  <Chips options={BUDGET_AREAS} selected={p.saveAreas} onToggle={(v) => toggle("saveAreas", v)} />
                </Group>
              </Question>
            )}

            {screen === 8 && (
              <Question headingRef={headingRef} title="How far along are you?" hint="We'll start your checklist from where you are, not from the beginning.">
                <div className="grid gap-3 sm:grid-cols-2">
                  {PLANNING_STAGES.map((s) => (
                    <OptionCard key={s.value} on={p.planningStage === s.value} onClick={() => set("planningStage", s.value)} title={s.label} hint={s.hint} />
                  ))}
                </div>
                <Group label="Have you booked your venue?">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <OptionCard on={p.venueBooked === true} onClick={() => setVenue(true)} title="Yes, it's booked" />
                    <OptionCard on={p.venueBooked === false} onClick={() => setVenue(false)} title="Not yet" />
                  </div>
                </Group>
                <Group label="Are you working with a wedding planner?">
                  <Chips options={PLANNER_HELP.map((h) => h.label)} selected={PLANNER_HELP.filter((h) => h.value === p.plannerHelp).map((h) => h.label)} onToggle={(label) => { const v = PLANNER_HELP.find((h) => h.label === label)!.value; set("plannerHelp", p.plannerHelp === v ? null : v); }} single />
                </Group>
              </Question>
            )}

            {screen === 9 && (
              <Question headingRef={headingRef} title="What's booked, and what's still to do?" hint="Booked suppliers will appear in your supplier manager.">
                <Group label="Suppliers you've already booked">
                  <Chips options={SUPPLIER_TYPES} selected={p.bookedSuppliers} onToggle={(v) => (v === "Venue" ? setVenue(!p.bookedSuppliers.includes("Venue")) : toggle("bookedSuppliers", v))} />
                </Group>
                <Group label="Important things still outstanding">
                  <Chips options={OUTSTANDING} selected={p.outstanding} onToggle={(v) => toggle("outstanding", v)} />
                </Group>
              </Question>
            )}

            {screen === 10 && (
              <Question headingRef={headingRef} title="What matters most to you?" hint="Your three biggest priorities shape your dashboard.">
                <Group label="Choose up to three">
                  <Chips options={PRIORITIES} selected={p.topPriorities} onToggle={(v) => toggle("topPriorities", v, 3)} />
                </Group>
                <Group label="How do you like to plan?">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <OptionCard on={p.planningStyle === "detailed"} onClick={() => set("planningStyle", "detailed")} title="Detailed checklists" hint="Every task, with a due date" />
                    <OptionCard on={p.planningStyle === "flexible"} onClick={() => set("planningStyle", "flexible")} title="Flexible and light" hint="The essentials, in the right order" />
                  </div>
                </Group>
              </Question>
            )}

            {screen === 11 && (
              <Question headingRef={headingRef} title="Last of all, how are you feeling?" hint="Tell us what you're excited about and what's on your mind.">
                <TextField id="excited" label="What are you most excited about?" value={p.excitedAbout} onChange={(v) => set("excitedAbout", v)} placeholder="e.g. Dancing with everyone we love" />
                <Group label="Anything you're worried about?">
                  <Chips options={WORRIES} selected={p.worries} onToggle={(v) => toggle("worries", v)} />
                </Group>
                <Group label="Where would you like the most help organising?">
                  <Chips options={HELP_AREAS} selected={p.helpAreas} onToggle={(v) => toggle("helpAreas", v)} />
                </Group>
              </Question>
            )}

            {error && <p role="alert" className="mt-8 rounded-[var(--radius-control)] bg-rose-soft px-4 py-3 text-[14.5px] text-rose">{error}</p>}
          </div>

          <div className="mt-12 flex items-center justify-between gap-3 border-t border-linen pt-6">
            <button type="button" onClick={() => go(screen - 1)} className="inline-flex h-12 items-center gap-2 px-1 text-[15px] text-taupe transition-colors hover:text-ink">
              <ArrowLeft className="size-4" /> {editingChapter !== null && screen === CHAPTER_START[editingChapter] ? "Cancel" : "Back"}
            </button>
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => go(screen + 1)} className="h-12 px-4 text-[15px] text-taupe transition-colors hover:text-ink">Skip</button>
              <button type="submit" className={buttonClass("primary")}>
                {editingChapter !== null && chapterOf(screen + 1) !== editingChapter ? "Save changes" : screen === TOTAL - 1 ? "Finish" : "Continue"}
              </button>
            </div>
          </div>
          <p className="mt-6 text-center text-[13px] text-taupe lg:text-left">
            Your answers save automatically in this browser. Accounts arrive in the next phase.{" "}
            {editingChapter === null && <Link href="/" className="underline decoration-linen underline-offset-4 hover:text-ink">Leave for now</Link>}
          </p>
        </form>

        <aside className="hidden lg:block" aria-hidden>
          <div className="sticky top-44">
            <Photo name={CHAPTERS[chapter].photo} available={photos[CHAPTERS[chapter].photo]} className="aspect-[3/4] w-full rounded-[var(--radius-card)]" sizes="340px" />
            <p className="mt-3 font-serif text-[15px] italic text-taupe">Chapter {chapter + 1}: {CHAPTERS[chapter].title}</p>
          </div>
        </aside>
      </main>
    </div>
  );
}

// ---------- Small building blocks ----------

const inputClass =
  "h-13 w-full rounded-[var(--radius-control)] border border-linen bg-white px-4 text-[17px] text-ink placeholder:text-taupe/60 outline-none transition-colors hover:border-ink/40 focus:border-ink";

function Question({ title, hint, children, headingRef }: { title: string; hint: string; children: React.ReactNode; headingRef: React.RefObject<HTMLHeadingElement | null> }) {
  return (
    <div>
      <h1 ref={headingRef} tabIndex={-1} className="text-[42px] leading-[0.98] outline-none sm:text-[60px]">{title}</h1>
      <p className="mt-4 max-w-[34rem] font-serif text-[20px] italic leading-snug text-ink-soft">{hint}</p>
      <div className="mt-10 space-y-9">{children}</div>
    </div>
  );
}

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <fieldset>
      <legend className="mb-3 text-[15px] font-[500]">{label}</legend>
      {children}
    </fieldset>
  );
}

function Field({ id, label, children }: { id: string; label: string; children: React.ReactNode }) {
  return (
    <div className="max-w-[34rem]">
      <label htmlFor={id} className="mb-2 block text-[15px] font-[500]">{label}</label>
      {children}
    </div>
  );
}

function TextField({ id, label, value, onChange, placeholder, autoComplete }: {
  id: string; label: string; value: string | null; onChange: (v: string | null) => void; placeholder?: string; autoComplete?: string;
}) {
  return (
    <Field id={id} label={label}>
      <input id={id} value={value ?? ""} onChange={(e) => onChange(e.target.value || null)} placeholder={placeholder} autoComplete={autoComplete} maxLength={80} className={inputClass} />
    </Field>
  );
}

function OptionCard({ on, onClick, title, hint }: { on: boolean; onClick: () => void; title: string; hint?: string }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className={`relative rounded-[var(--radius-card)] border px-5 py-4 text-left transition-all duration-200 ${on ? "border-ink bg-ink text-white" : "border-linen bg-white hover:-translate-y-0.5 hover:border-ink/40 hover:shadow-soft"}`}
    >
      <span className="block font-serif text-[22px] leading-tight">{title}</span>
      {hint && <span className={`mt-1 block text-[14px] ${on ? "text-white/70" : "text-taupe"}`}>{hint}</span>}
      {on && <Check className="absolute right-4 top-4 size-4" />}
    </button>
  );
}

function Chips({ options, selected, onToggle, single = false }: { options: string[]; selected: string[]; onToggle: (v: string) => void; single?: boolean }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => {
        const on = selected.includes(o);
        return (
          <button
            key={o}
            type="button"
            aria-pressed={on}
            onClick={() => onToggle(o)}
            className={`inline-flex h-11 items-center gap-1.5 rounded-full border px-4 text-[15px] transition-colors ${on ? "border-ink bg-ink text-white" : "border-linen bg-white text-ink hover:border-ink/50"}`}
          >
            {on && !single && <Check className="size-3.5" />}
            {o}
          </button>
        );
      })}
    </div>
  );
}

function MonthPicker({ value, onChange }: { value: string | null; onChange: (v: string | null) => void }) {
  const thisYear = new Date().getFullYear();
  const [y, m] = value ? value.split("-") : ["", ""];
  const update = (year: string, month: string) => onChange(year && month ? `${year}-${month}` : null);
  return (
    <div className="grid max-w-[34rem] grid-cols-2 gap-4">
      <Field id="rough-month" label="Month">
        <select id="rough-month" value={m} onChange={(e) => update(y || String(thisYear + 1), e.target.value)} className={inputClass}>
          <option value="">Choose</option>
          {MONTHS.map((name, i) => <option key={name} value={String(i + 1).padStart(2, "0")}>{name}</option>)}
        </select>
      </Field>
      <Field id="rough-year" label="Year">
        <select id="rough-year" value={y} onChange={(e) => update(e.target.value, m || "06")} className={inputClass}>
          <option value="">Choose</option>
          {[0, 1, 2, 3].map((n) => <option key={n} value={String(thisYear + n)}>{thisYear + n}</option>)}
        </select>
      </Field>
    </div>
  );
}
