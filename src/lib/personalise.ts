/*
  RULE-BASED PERSONALISATION
  Plain "if this, then that" rules using the bride's saved answers.
  No AI is involved. Each rule is written so it's easy to read and change.
*/
import { daysUntil, formatMonth } from "./format";
import type { WeddingProfile } from "./wedding-profile";

export type NextStep = { id: string; title: string; why: string; href: string };

/** How long until the wedding, in whole months, if we know the date. */
export function monthsToGo(p: WeddingProfile): number | null {
  const day = p.dateStatus === "set" ? p.weddingDate : p.dateStatus === "roughly" && p.roughMonth ? `${p.roughMonth}-15` : null;
  if (!day) return null;
  const d = daysUntil(day);
  return d === null ? null : Math.max(0, Math.floor(d / 30.4));
}

export function isShortEngagement(p: WeddingProfile) {
  const m = monthsToGo(p);
  return m !== null && m < 9;
}

export function isBudgetConscious(p: WeddingProfile) {
  return p.topPriorities.includes("Staying on budget") || p.saveAreas.length >= 2 || p.worries.includes("Going over budget");
}

export function isLarge(p: WeddingProfile) {
  return p.guestRange === "large" || (p.guestCount ?? 0) > 150;
}

export function isSmall(p: WeddingProfile) {
  return p.guestRange === "intimate" || (p.guestCount !== null && p.guestCount < 30);
}

/** "Your romantic destination wedding in Italy is taking shape." */
export function headline(p: WeddingProfile) {
  const style = p.styles[0]?.toLowerCase();
  const size = isSmall(p) ? "intimate" : null;
  const kind = p.weddingKind === "destination" ? "destination" : null;
  const words = [style ?? size, kind].filter(Boolean).join(" ");
  const where = p.location || p.country;
  const subject = `Your ${words ? words + " " : ""}wedding${where && where !== "Other" ? ` in ${where}` : ""}`;
  if (p.planningStage === "final") return `${subject} is almost here.`;
  if (p.planningStage === "just-engaged" || !p.planningStage) return `${subject} starts here.`;
  return `${subject} is taking shape.`;
}

/** A short line describing the date, for the dashboard. */
export function dateLine(p: WeddingProfile) {
  if (p.dateStatus === "roughly" && p.roughMonth) return `Planned for ${formatMonth(p.roughMonth)}`;
  if (p.dateStatus !== "set") return "Date to be decided";
  return null;
}

const SUPPLIER_STEPS: Record<string, { supplier: string; title: string }> = {
  "Photography": { supplier: "Photographer", title: "Book your photographer" },
  "Food and drink": { supplier: "Caterer", title: "Book your caterer" },
  "Flowers and styling": { supplier: "Florist", title: "Find your florist" },
  "Music and the party": { supplier: "Entertainment", title: "Book your band or DJ" },
  "The dress": { supplier: "", title: "Start dress appointments" },
};

/** Up to five next steps, most important first. */
export function nextSteps(p: WeddingProfile): NextStep[] {
  const steps: NextStep[] = [];
  const add = (s: NextStep) => { if (!steps.some((x) => x.id === s.id)) steps.push(s); };
  const short = isShortEngagement(p);
  const booked = new Set(p.bookedSuppliers);
  const venueDone = p.venueBooked === true || booked.has("Venue");

  if (p.dateStatus !== "set") {
    add({ id: "date", title: "Settle on your date", why: p.dateStatus === "roughly" ? "You have a season in mind. A fixed date lets you book your venue and suppliers." : "Most bookings depend on it. A season is a good place to start.", href: "/calendar" });
  }

  if (!venueDone) {
    add({
      id: "venue",
      title: p.weddingKind === "destination" ? "Shortlist venues abroad" : "Book your venue",
      why: p.weddingKind === "destination" ? "Ask about local suppliers and legal requirements at the same time." : "Your date, numbers and suppliers all follow from the venue.",
      href: "/suppliers",
    });
  }

  if (isBudgetConscious(p)) {
    add({ id: "budget", title: "Set a budget for each category", why: "Deciding the split now makes every later choice easier.", href: "/budget" });
  }

  if (p.weddingKind === "destination") {
    add({ id: "legal", title: "Check the legal requirements", why: `Marriage paperwork differs by country${p.country && p.country !== "Other" ? `, so check what ${p.country} asks for` : ""}. Some couples hold the legal ceremony at home.`, href: "/checklist" });
    add({ id: "travel", title: "Plan guest travel and accommodation", why: "Guests will need dates early to book flights and rooms.", href: "/guests" });
  }

  // The supplier she cares most about, if it isn't booked yet
  for (const priority of p.topPriorities) {
    const s = SUPPLIER_STEPS[priority];
    if (s && (!s.supplier || !booked.has(s.supplier))) {
      add({ id: `p-${priority}`, title: s.title, why: `You said ${priority.toLowerCase()} matters most, and the best book up early.`, href: s.supplier ? "/suppliers" : "/calendar" });
    }
  }

  if (isLarge(p)) {
    add({ id: "guests-large", title: "Start your guest list now", why: "With a big guest list, households and RSVPs take time to organise.", href: "/guests" });
  } else if (venueDone) {
    add({ id: "guests", title: "Draft your guest list", why: "It shapes your catering, stationery and budget.", href: "/guests" });
  }

  if (venueDone && !booked.has("Photographer") && !steps.some((s) => s.id === "p-Photography")) {
    add({ id: "photographer", title: "Book your photographer", why: "Popular photographers are often booked a year ahead.", href: "/suppliers" });
  }

  if (p.wantsMoodboard) {
    add({ id: "moodboard", title: "Start your first moodboard", why: "Collecting images early makes conversations with suppliers easier.", href: "/moodboards" });
  }

  if (p.planningStage === "final") {
    add({ id: "runsheet", title: "Draft your wedding-day schedule", why: "Share it with your suppliers and bridal party so everyone knows the plan.", href: "/run-sheet" });
  }

  add({ id: "checklist", title: short ? "Review your shortened timeline" : "Look through your checklist", why: short ? "With under nine months to go, the deadlines have been brought forward." : "It's arranged by how far away your wedding is.", href: "/checklist" });

  return steps.slice(0, 5);
}

/** The core bookings used for the progress measure on the dashboard. */
export const KEY_BOOKINGS = ["Venue", "Photographer", "Caterer", "Florist", "Entertainment", "Hair and makeup", "Celebrant", "Stationery"];

export function bookingProgress(p: WeddingProfile) {
  const booked = new Set(p.bookedSuppliers);
  if (p.venueBooked) booked.add("Venue");
  if (booked.has("Celebrant or officiant")) booked.add("Celebrant");
  const done = KEY_BOOKINGS.filter((k) => booked.has(k));
  return { done: done.length, total: KEY_BOOKINGS.length, booked: done };
}
