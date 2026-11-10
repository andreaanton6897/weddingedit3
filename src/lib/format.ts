/* Small helpers for money and dates, so formatting is consistent everywhere. */

export function formatMoney(amount: number, currency: string, opts?: { exact?: boolean }) {
  try {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency,
      maximumFractionDigits: opts?.exact ? 2 : 0,
      minimumFractionDigits: opts?.exact ? 2 : 0,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString("en-GB")}`;
  }
}

/** Parse a YYYY-MM-DD string as a calendar date (no time-zone shifting). */
export function parseDay(day: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(day);
  if (!m) return null;
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  return Number.isNaN(d.getTime()) ? null : d;
}

export function formatDay(day: string, style: "long" | "short" = "long") {
  const d = parseDay(day);
  if (!d) return day;
  return d.toLocaleDateString("en-GB", style === "long"
    ? { weekday: "long", day: "numeric", month: "long", year: "numeric" }
    : { day: "numeric", month: "short" });
}

/** Whole days from today until the given calendar day (negative if past). */
export function daysUntil(day: string, today = new Date()) {
  const d = parseDay(day);
  if (!d) return null;
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  return Math.round((d.getTime() - start.getTime()) / 86_400_000);
}

export function todayISO(today = new Date()) {
  const y = today.getFullYear();
  const m = String(today.getMonth() + 1).padStart(2, "0");
  const d = String(today.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Add whole days to a YYYY-MM-DD string. */
export function addDays(day: string, n: number) {
  const d = parseDay(day) ?? new Date();
  d.setDate(d.getDate() + n);
  return todayISO(d);
}

/** "2027-09" → "September 2027" */
export function formatMonth(month: string) {
  const m = /^(\d{4})-(\d{2})$/.exec(month);
  if (!m) return month;
  return new Date(Number(m[1]), Number(m[2]) - 1, 1).toLocaleDateString("en-GB", { month: "long", year: "numeric" });
}
