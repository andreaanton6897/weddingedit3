/*
  Illustrations of the product for the marketing pages. They use example
  figures and are captioned as examples, so nobody mistakes them for data.
*/
import { Check } from "lucide-react";

function Frame({ title, children, className = "" }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-[var(--radius-card)] border border-linen bg-white p-5 shadow-lift sm:p-6 ${className}`}>
      <p className="font-serif text-[24px] leading-none">{title}</p>
      <div className="mt-4">{children}</div>
    </div>
  );
}

export function CountdownPreview({ className = "" }: { className?: string }) {
  return (
    <div className={`rounded-[var(--radius-card)] bg-white/95 p-5 shadow-lift backdrop-blur ${className}`}>
      <p className="font-serif text-[64px] leading-[0.8] tracking-[-0.04em]">214</p>
      <p className="mt-2 font-serif text-[15px] italic text-ink-soft">days until 12 June</p>
      <div className="mt-4 h-[3px] bg-linen"><div className="h-[3px] w-[62%] bg-sage" /></div>
      <p className="mt-2 text-[12.5px] text-taupe">5 of 8 key bookings made</p>
    </div>
  );
}

export function BudgetPreview({ className = "" }: { className?: string }) {
  const rows = [
    { label: "Venue", agreed: "£7,800", paid: 0.35 },
    { label: "Photography", agreed: "£1,800", paid: 0.28 },
    { label: "Flowers", agreed: "£1,450", paid: 0.0 },
    { label: "Dress", agreed: "£1,650", paid: 0.5 },
  ];
  return (
    <Frame title="Budget" className={className}>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-[12.5px] text-taupe">Left to spend</p>
          <p className="font-serif text-[40px] leading-none tracking-[-0.03em]">£9,420</p>
        </div>
        <p className="text-right text-[12.5px] text-taupe">of £25,000</p>
      </div>
      <div className="mt-4 flex h-1.5 overflow-hidden rounded-full bg-linen">
        <div className="bg-ink" style={{ width: "24%" }} />
        <div className="bg-champagne-deep" style={{ width: "38%" }} />
      </div>
      <ul className="mt-5 space-y-3 text-[14px]">
        {rows.map((r) => (
          <li key={r.label}>
            <div className="flex justify-between"><span>{r.label}</span><span className="tabular-nums">{r.agreed}</span></div>
            <div className="mt-1.5 h-[3px] bg-linen"><div className="h-[3px] bg-sage" style={{ width: `${r.paid * 100}%` }} /></div>
          </li>
        ))}
      </ul>
    </Frame>
  );
}

export function ChecklistPreview({ className = "" }: { className?: string }) {
  const tasks = [
    { t: "Book the photographer", done: true },
    { t: "Send save-the-dates", done: true },
    { t: "Choose the florist", done: false, due: "Due Fri" },
    { t: "Arrange guest accommodation", done: false, due: "Next week" },
  ];
  return (
    <Frame title="This month" className={className}>
      <ul className="space-y-3 text-[14.5px]">
        {tasks.map((x) => (
          <li key={x.t} className="flex items-center gap-3">
            <span className={`grid size-5 shrink-0 place-items-center rounded-full border ${x.done ? "border-sage bg-sage text-white" : "border-ink/40"}`}>
              {x.done && <Check className="size-3" />}
            </span>
            <span className={`flex-1 ${x.done ? "text-taupe line-through decoration-champagne-deep" : ""}`}>{x.t}</span>
            {x.due && <span className="text-[12.5px] text-taupe">{x.due}</span>}
          </li>
        ))}
      </ul>
    </Frame>
  );
}

export function RunSheetPreview({ className = "" }: { className?: string }) {
  const rows = [
    ["13:00", "Ceremony", "The orangery"],
    ["13:45", "Drinks and canapés", "South lawn"],
    ["15:30", "Wedding breakfast", "The barn"],
    ["19:30", "First dance", "The barn"],
  ];
  return (
    <Frame title="The day" className={className}>
      <ol className="space-y-0">
        {rows.map(([time, what, where]) => (
          <li key={time} className="grid grid-cols-[3.5rem_1fr] gap-3 border-t border-linen py-2.5 first:border-0">
            <span className="font-serif text-[18px] tabular-nums">{time}</span>
            <span><span className="block text-[14.5px]">{what}</span><span className="block text-[12.5px] text-taupe">{where}</span></span>
          </li>
        ))}
      </ol>
    </Frame>
  );
}

export function SupplierPreview({ className = "" }: { className?: string }) {
  const rows = [
    ["Photographer", "Clara Moss", "Booked"],
    ["Florist", "Wild Meadow", "Quote received"],
    ["Band", "The Quartet", "Enquiry sent"],
  ];
  return (
    <Frame title="Suppliers" className={className}>
      <ul className="space-y-3">
        {rows.map(([cat, name, status]) => (
          <li key={name} className="flex items-center justify-between gap-3">
            <span><span className="block text-[12.5px] text-taupe">{cat}</span><span className="block text-[14.5px]">{name}</span></span>
            <span className={`rounded-full px-2.5 py-0.5 text-[12px] ${status === "Booked" ? "bg-ink text-white" : "border border-linen text-ink-soft"}`}>{status}</span>
          </li>
        ))}
      </ul>
    </Frame>
  );
}
