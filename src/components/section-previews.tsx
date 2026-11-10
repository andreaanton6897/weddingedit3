"use client";

/*
  Phase 1 previews of each workspace section. They show the layout with
  clearly labelled sample data. In Phases 2 and 3 each one is replaced by the
  real version that reads and writes the bride's own records.
*/
import { Check, Clock, Images, Users } from "lucide-react";
import { EmptyState } from "./page-bits";
import { useProfile } from "@/lib/use-profile";
import { sampleData } from "@/lib/sample-data";
import { formatDay, formatMoney } from "@/lib/format";
import { SampleTag } from "./brand";

function useSample() {
  const { loaded, profile } = useProfile();
  // Sample dates depend on "today", so only build them in the browser.
  const currency = profile?.currency ?? "GBP";
  if (!loaded) return { loaded: false as const, currency, data: null };
  return { loaded: true as const, currency, data: sampleData(profile?.budget ?? null) };
}

function Loading() {
  return <div className="h-64 animate-pulse rounded-[var(--radius-card)] bg-ivory" aria-label="Loading" />;
}

export function ChecklistPreview() {
  const { loaded, data } = useSample();
  if (!loaded || !data) return <Loading />;
  const groups = [
    { label: "Done", items: data.tasks.filter((t) => t.done) },
    { label: "This month", items: data.tasks.filter((t) => !t.done).slice(0, 3) },
    { label: "Next month", items: data.tasks.filter((t) => !t.done).slice(3) },
  ];
  return (
    <div className="space-y-10">
      {groups.map((g) => (
        <section key={g.label}>
          <div className="mb-3 flex items-baseline justify-between border-b border-champagne pb-2">
            <h2 className="text-[26px]">{g.label}</h2>
            <SampleTag />
          </div>
          <ul className="divide-y divide-linen">
            {g.items.map((t) => (
              <li key={t.id} className="flex items-center gap-4 py-3.5">
                <span aria-label={t.done ? "Done" : "Not done"} className={`grid size-5 shrink-0 place-items-center rounded-full border ${t.done ? "border-sage bg-sage text-white" : "border-champagne-deep"}`}>
                  {t.done && <Check className="size-3" />}
                </span>
                <p className={`flex-1 text-[15.5px] ${t.done ? "text-taupe line-through decoration-champagne-deep" : ""}`}>{t.title}</p>
                <p className="hidden text-[13.5px] text-taupe sm:block">{t.area}</p>
                <p className="w-16 text-right text-[13.5px] text-taupe">{formatDay(t.due, "short")}</p>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

export function BudgetPreview() {
  const { loaded, data, currency } = useSample();
  if (!loaded || !data) return <Loading />;
  const m = (n: number) => formatMoney(n, currency);
  return (
    <div className="overflow-x-auto rounded-[var(--radius-card)] border border-linen bg-white">
      <table className="w-full min-w-[640px] text-left text-[14.5px]">
        <caption className="sr-only">Budget by category (sample data)</caption>
        <thead className="border-b border-linen text-[13px] text-taupe">
          <tr>
            <th className="px-5 py-3 font-normal">Category <SampleTag className="ml-2" /></th>
            <th className="px-5 py-3 text-right font-normal">Estimate</th>
            <th className="px-5 py-3 text-right font-normal">Agreed</th>
            <th className="px-5 py-3 text-right font-normal">Paid</th>
            <th className="px-5 py-3 text-right font-normal">Still to pay</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-linen tabular-nums">
          {data.budgetLines.map((l) => (
            <tr key={l.category}>
              <td className="px-5 py-3.5">{l.category}</td>
              <td className="px-5 py-3.5 text-right text-taupe">{m(l.estimated)}</td>
              <td className="px-5 py-3.5 text-right">{l.agreed !== null ? m(l.agreed) : <span className="text-taupe">Not booked</span>}</td>
              <td className="px-5 py-3.5 text-right">{l.paid ? m(l.paid) : "–"}</td>
              <td className="px-5 py-3.5 text-right">{l.agreed !== null ? m(l.agreed - l.paid) : "–"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const statusStyle = {
  booked: { label: "Booked", cls: "bg-ink text-white" },
  shortlisted: { label: "Shortlisted", cls: "border border-champagne-deep text-champagne-deep" },
  enquired: { label: "Enquiry sent", cls: "bg-ivory text-ink-soft" },
};

export function SuppliersPreview() {
  const { loaded, data, currency } = useSample();
  if (!loaded || !data) return <Loading />;
  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {data.suppliers.map((s) => (
        <li key={s.id} className="rounded-[var(--radius-card)] border border-linen bg-white p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[13px] text-taupe">{s.category}</p>
              <h2 className="mt-1 text-[24px]">{s.name}</h2>
            </div>
            <SampleTag />
          </div>
          <div className="mt-4 flex items-center justify-between text-[14px]">
            <span className={`rounded-full px-3 py-1 ${statusStyle[s.status].cls}`}>{statusStyle[s.status].label}</span>
            <span className="tabular-nums text-taupe">
              {s.agreed !== null ? `${formatMoney(s.paid, currency)} of ${formatMoney(s.agreed, currency)} paid` : "No quote yet"}
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
}

export function CalendarPreview() {
  const { loaded, data } = useSample();
  if (!loaded || !data) return <Loading />;
  return (
    <ul className="divide-y divide-linen rounded-[var(--radius-card)] border border-linen bg-white">
      {data.events.map((e) => (
        <li key={e.id} className="flex items-center gap-5 px-5 py-4">
          <div className="w-14 shrink-0 text-center">
            <p className="font-serif text-[30px] leading-none">{formatDay(e.date, "short").split(" ")[0]}</p>
            <p className="text-[12.5px] text-taupe">{formatDay(e.date, "short").split(" ")[1]}</p>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[15.5px]">{e.title}</p>
            <p className="text-[13.5px] text-taupe">{e.kind}{e.time ? `, ${e.time}` : ", all day"}</p>
          </div>
          <SampleTag />
        </li>
      ))}
    </ul>
  );
}

export function GuestsEmpty() {
  return (
    <EmptyState icon={<Users className="size-5" strokeWidth={1.5} />} title="Your guest list will live here" body="Add guests by household, with plus ones, children, meal choices, allergies and accessibility needs, and follow every RSVP from invited to accepted. Guest details stay private to your wedding." />
  );
}

export function MoodboardsEmpty() {
  return (
    <EmptyState icon={<Images className="size-5" strokeWidth={1.5} />} title="Your moodboards will live here" body="Create boards for your dress, flowers, tablescapes and more. Upload images, add notes to each one and build colour palettes from your favourites." />
  );
}

export function RunSheetEmpty() {
  return (
    <EmptyState icon={<Clock className="size-5" strokeWidth={1.5} />} title="Your wedding-day schedule will live here" body="Plan the day minute by minute, with locations, suppliers and who's responsible. Reorder it in seconds, then print it or share a clean copy with your bridal party and suppliers." />
  );
}
