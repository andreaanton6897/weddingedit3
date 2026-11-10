"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { useProfile } from "@/lib/use-profile";
import {
  CURRENCIES, GUEST_RANGES, PLANNER_HELP, PLANNING_STAGES, clearProfile, saveProfile, type WeddingProfile,
} from "@/lib/wedding-profile";
import { formatDay, formatMoney, formatMonth } from "@/lib/format";
import { ButtonLink, buttonClass } from "@/components/brand";
import { Panel } from "@/components/page-bits";

const TIME_ZONES = [
  "Europe/London", "Europe/Dublin", "Europe/Paris", "Europe/Rome", "Europe/Madrid", "Europe/Lisbon", "Europe/Athens",
  "Europe/Berlin", "Europe/Amsterdam", "Europe/Zurich", "Europe/Stockholm", "America/New_York", "America/Chicago",
  "America/Denver", "America/Los_Angeles", "America/Toronto", "America/Mexico_City", "Australia/Sydney", "Australia/Perth",
  "Pacific/Auckland", "Africa/Johannesburg", "Asia/Dubai", "Asia/Kolkata", "Asia/Singapore", "UTC",
];

const list = (xs: (string | null | undefined)[]) => xs.filter(Boolean).join(", ") || null;

function chapters(p: WeddingProfile): { title: string; rows: [string, string | null][] }[] {
  return [
    { title: "Your wedding", rows: [
      ["Name", p.name],
      ["Date", p.dateStatus === "set" && p.weddingDate ? formatDay(p.weddingDate) : p.dateStatus === "roughly" && p.roughMonth ? `Around ${formatMonth(p.roughMonth)}` : p.dateStatus === "undecided" ? "Not decided yet" : null],
      ["Where", list([p.location, p.country])],
      ["Local or destination", p.weddingKind === "destination" ? "Destination" : p.weddingKind === "local" ? "Local" : null],
      ["Ceremony", p.ceremonyType],
      ["Guests", p.guestCount ? `About ${p.guestCount}` : GUEST_RANGES.find((g) => g.value === p.guestRange)?.label ?? null],
    ] },
    { title: "Your aesthetic", rows: [
      ["Style", list([...p.styles, p.styleOther])],
      ["Colours", list(p.colours)],
      ["Atmosphere", list(p.atmosphere)],
      ["Moodboard", p.wantsMoodboard === true ? "Yes, start one" : p.wantsMoodboard === false ? "Maybe later" : null],
    ] },
    { title: "Your budget", rows: [
      ["Total budget", p.budget ? formatMoney(p.budget, p.currency) : null],
      ["Currency", CURRENCIES.find((c) => c.code === p.currency)?.label ?? p.currency],
      ["Already spent", p.spentStatus === "no" ? "Nothing yet" : p.spentStatus === "yes" ? (p.alreadySpent ? formatMoney(p.alreadySpent, p.currency) : "Yes") : null],
      ["Spending priorities", list(p.spendPriorities)],
      ["Saving on", list(p.saveAreas)],
    ] },
    { title: "Your progress", rows: [
      ["Planning stage", PLANNING_STAGES.find((s) => s.value === p.planningStage)?.label ?? null],
      ["Venue", p.venueBooked === true ? "Booked" : p.venueBooked === false ? "Not booked yet" : null],
      ["Booked suppliers", list(p.bookedSuppliers)],
      ["Wedding planner", PLANNER_HELP.find((h) => h.value === p.plannerHelp)?.label ?? null],
      ["Still outstanding", list(p.outstanding)],
    ] },
    { title: "Your priorities", rows: [
      ["Top priorities", list(p.topPriorities)],
      ["Planning style", p.planningStyle === "detailed" ? "Detailed checklists" : p.planningStyle === "flexible" ? "Flexible and light" : null],
      ["Excited about", p.excitedAbout],
      ["Worries", list(p.worries)],
      ["Help with", list(p.helpAreas)],
    ] },
  ];
}

export function SettingsView() {
  const { loaded, profile } = useProfile();
  const [p, setP] = useState<WeddingProfile | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [deleted, setDeleted] = useState<"deleted" | "failed" | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- copy loaded profile into editable state
    if (loaded) setP(profile);
    if (new URLSearchParams(window.location.search).get("saved") === "1") setNotice("Your changes have been saved.");
  }, [loaded, profile]);

  if (!loaded) return <div className="h-64 animate-pulse rounded-[var(--radius-card)] bg-ivory" aria-label="Loading" />;

  if (deleted === "deleted") {
    return (
      <Panel title="Your details have been deleted">
        <p role="status" className="text-[15.5px] text-ink/75">Everything you entered has been removed from this browser.</p>
        <ButtonLink href="/onboarding" className="mt-6">Start again</ButtonLink>
      </Panel>
    );
  }

  if (!p) {
    return (
      <Panel title="No details saved yet">
        <p className="text-[15.5px] text-ink/75">Answer five short chapters to set up your wedding.</p>
        <ButtonLink href="/onboarding" className="mt-6">Start planning</ButtonLink>
      </Panel>
    );
  }

  function updateRegional(changes: Partial<WeddingProfile>) {
    if (!p) return;
    const next = { ...p, ...changes };
    setP(next);
    setNotice(saveProfile(next) ? "Saved." : "Your browser blocked saving. Check that site data is allowed.");
  }

  return (
    <div className="space-y-12">
      {notice && (
        <p role="status" className="flex items-center gap-2 rounded-[var(--radius-control)] bg-sage-soft px-4 py-3 text-[14.5px] text-sage-dark">
          <Check className="size-4" /> {notice}
        </p>
      )}

      <section aria-labelledby="prefs">
        <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-ink pb-3">
          <h2 id="prefs" className="text-[34px]">Wedding preferences</h2>
          <p className="text-[14px] text-taupe">Change any answer. Your dashboard updates straight away.</p>
        </div>
        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          {chapters(p).map((c, i) => (
            <Panel key={c.title} title={c.title} action={<Link href={`/onboarding?chapter=${i + 1}`} className="text-[14px] text-ink underline decoration-champagne-deep underline-offset-4 hover:decoration-ink">Edit</Link>}>
              <dl className="divide-y divide-linen">
                {c.rows.map(([k, v]) => (
                  <div key={k} className="grid grid-cols-[9rem_1fr] gap-4 py-2.5 text-[14.5px]">
                    <dt className="text-taupe">{k}</dt>
                    <dd className={v ? "" : "text-taupe/70"}>{v ?? "Not answered"}</dd>
                  </div>
                ))}
              </dl>
            </Panel>
          ))}
        </div>
      </section>

      <section aria-labelledby="regional" className="grid gap-5 lg:grid-cols-2">
        <Panel title="Regional settings">
          <div className="space-y-5">
            <div>
              <label htmlFor="date-format" className="mb-2 block text-[14.5px] font-[500]">Date format</label>
              <select id="date-format" value={p.dateFormat} onChange={(e) => updateRegional({ dateFormat: e.target.value as WeddingProfile["dateFormat"] })} className="h-12 w-full rounded-[var(--radius-control)] border border-linen bg-white px-3 text-[15px] focus:border-ink focus:outline-none">
                <option value="DD/MM/YYYY">DD/MM/YYYY (31/12/2027)</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY (12/31/2027)</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD (2027-12-31)</option>
              </select>
            </div>
            <div>
              <label htmlFor="tz" className="mb-2 block text-[14.5px] font-[500]">Time zone</label>
              <select id="tz" value={p.timeZone || "UTC"} onChange={(e) => updateRegional({ timeZone: e.target.value })} className="h-12 w-full rounded-[var(--radius-control)] border border-linen bg-white px-3 text-[15px] focus:border-ink focus:outline-none">
                {[...new Set([p.timeZone || "UTC", ...TIME_ZONES])].map((tz) => <option key={tz} value={tz}>{tz.replace(/_/g, " ")}</option>)}
              </select>
            </div>
            <p className="text-[14px] text-taupe">Currency is set in <Link href="/onboarding?chapter=3" className="text-ink underline decoration-champagne-deep underline-offset-4">Your budget</Link>.</p>
          </div>
        </Panel>

        <Panel title="Your data">
          <p className="text-[15px] text-ink/75">
            Right now your answers are stored only in this browser, on this device. Nothing has been sent to our servers. Accounts arrive in the next phase.
          </p>
          {!confirming ? (
            <button type="button" onClick={() => setConfirming(true)} className={buttonClass("secondary", "mt-6 border-rose/40 text-rose hover:bg-rose-soft hover:text-rose")}>
              Delete my details
            </button>
          ) : (
            <div className="mt-6 rounded-[var(--radius-control)] bg-rose-soft p-4">
              <p className="text-[14.5px] text-rose">This removes everything you entered. It can&rsquo;t be undone.</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <button type="button" onClick={() => setDeleted(clearProfile() ? "deleted" : "failed")} className="h-10 rounded-[var(--radius-control)] bg-rose px-5 text-[14px] text-white">
                  Yes, delete everything
                </button>
                <button type="button" onClick={() => setConfirming(false)} className="h-10 rounded-[var(--radius-control)] px-4 text-[14px] text-ink">
                  Keep my details
                </button>
              </div>
              {deleted === "failed" && <p role="alert" className="mt-3 text-[14px] text-rose">Your browser blocked the deletion. Try clearing site data for this page in your browser settings.</p>}
            </div>
          )}
        </Panel>
      </section>
    </div>
  );
}
