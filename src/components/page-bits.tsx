import { Info } from "lucide-react";

export function PageHeader({ title, intro, children }: { title: string; intro?: string; children?: React.ReactNode }) {
  return (
    <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-[48px] leading-[0.95] sm:text-[68px]">{title}</h1>
        {intro && <p className="mt-4 max-w-[36rem] font-serif text-[19px] italic leading-snug text-ink-soft">{intro}</p>}
      </div>
      {children}
    </div>
  );
}

/** An honest note about what this phase of the product can and can't do yet. */
export function StageNote({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-10 flex items-start gap-3 rounded-[var(--radius-control)] bg-ivory px-4 py-3 text-[14.5px] text-ink/80">
      <Info className="mt-[3px] size-4 shrink-0 text-champagne-deep" strokeWidth={1.75} aria-hidden />
      <span>{children}</span>
    </p>
  );
}

/** A card section on the dashboard and inner pages. */
export function Panel({ title, action, children, className = "" }: { title: string; action?: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <section className={`rounded-[var(--radius-card)] border border-linen bg-white p-6 transition-shadow hover:shadow-soft ${className}`}>
      <div className="mb-5 flex items-baseline justify-between gap-3">
        <h2 className="text-[28px] sm:text-[30px]">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

/** A guiding empty state: what goes here and why it helps. */
export function EmptyState({ icon, title, body, children }: { icon: React.ReactNode; title: string; body: string; children?: React.ReactNode }) {
  return (
    <div className="rounded-[var(--radius-card)] border border-dashed border-champagne bg-ivory/60 px-6 py-14 text-center">
      <div className="mx-auto grid size-12 place-items-center rounded-full bg-white text-champagne-deep shadow-soft">{icon}</div>
      <h2 className="mt-5 text-[30px]">{title}</h2>
      <p className="mx-auto mt-3 max-w-[30rem] text-[15.5px] text-ink/70">{body}</p>
      {children}
    </div>
  );
}
