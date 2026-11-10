/* Words used across the public pages, kept in one place so they stay consistent. */
import type { PhotoKey } from "./photos";

export const AREAS: { key: string; name: string; line: string; body: string; points: string[]; photo: PhotoKey; free: string }[] = [
  {
    key: "dashboard", name: "Your dashboard", line: "Everything at a glance, written for you.",
    body: "A personal front page for your wedding: the countdown, where your budget stands, what's due next and the suppliers you've booked, shaped by your answers.",
    points: ["Countdown, date and location", "Budget, paid and outstanding", "Personalised next steps", "Recently booked suppliers"],
    photo: "hero", free: "Included",
  },
  {
    key: "budget", name: "Budget planner", line: "See exactly where the money is going.",
    body: "Estimates, quotes, agreed costs and payments kept clearly apart, in your own currency. A quote is never counted as money spent, and nothing is marked paid until you say so.",
    points: ["Custom categories", "Deposits and balances", "Payment deadlines", "Progress at a glance"],
    photo: "stationery", free: "Basic",
  },
  {
    key: "checklist", name: "Checklist and timeline", line: "The right task at the right time.",
    body: "From 18 months out to the morning itself, arranged around your date. Destination, small, large and short-engagement weddings each get their own version.",
    points: ["Tasks by stage", "Your own tasks and notes", "Upcoming and overdue", "Filters by category"],
    photo: "details", free: "Basic",
  },
  {
    key: "suppliers", name: "Suppliers and bookings", line: "From first enquiry to final payment.",
    body: "Every venue, photographer and florist in one place, with quotes, contracts, deposits and balances. Compare quotes side by side before you commit.",
    points: ["Researching to booked", "Quotes and contracts", "Side-by-side comparison", "Balances and deadlines"],
    photo: "venue", free: "Limited",
  },
  {
    key: "guests", name: "Guests and RSVPs", line: "Every guest, every detail, handled kindly.",
    body: "Households, plus ones, children, meal choices, allergies and accessibility needs, with RSVP status for everyone.",
    points: ["Households and groups", "Dietary and accessibility", "Meal choices", "RSVP tracking"],
    photo: "tablescape", free: "Complete Edit",
  },
  {
    key: "calendar", name: "Wedding calendar", line: "Fittings, tastings and deadlines in one diary.",
    body: "A monthly view of every appointment and payment deadline, linked to the task or payment it belongs to, ready to add to your phone's calendar.",
    points: ["Monthly view", "Linked to tasks and payments", "Export to your calendar", "Wedding milestones"],
    photo: "dress", free: "Complete Edit",
  },
  {
    key: "moodboards", name: "Moodboards", line: "Your own wedding magazine.",
    body: "Collect inspiration by category, add notes to every image and build the colour palettes that tie it all together.",
    points: ["Multiple boards", "Image notes", "Colour palettes", "Organised by category"],
    photo: "florals", free: "Complete Edit",
  },
  {
    key: "run-sheet", name: "Wedding-day run sheet", line: "The day, beautifully timed.",
    body: "A clear schedule for you, your bridal party and suppliers: who, what, where and when. Reorder it in seconds, then print or share it.",
    points: ["Times and locations", "Suppliers and responsibilities", "Reorder events", "Print and export"],
    photo: "destination", free: "Complete Edit",
  },
];

export const STEPS = [
  { title: "Tell us about your wedding", body: "Five short chapters about your date, style, budget, progress and priorities. Skip anything you haven't decided.", photo: "venue" as PhotoKey },
  { title: "Get a plan made for you", body: "Your dashboard, checklist and next steps adapt to your answers, whether it's an intimate elopement or a destination celebration.", photo: "stationery" as PhotoKey },
  { title: "Keep everything in one place", body: "Track your budget, suppliers, guests and appointments as you go. Everything stays connected.", photo: "tablescape" as PhotoKey },
  { title: "Enjoy the day", body: "Print your run sheet, share it with the people who need it, and leave the remembering to us.", photo: "details" as PhotoKey },
];

export const PLANS = {
  free: {
    name: "The Essentials", price: "£0", note: "Free, always",
    items: ["Your dashboard and countdown", "Starter checklist", "Basic budget planner", "Up to 5 supplier records", "Planning progress"],
  },
  complete: {
    name: "The Complete Edit", price: "£24.99", note: "One payment. No subscription.",
    items: ["Fully personalised dashboard", "Complete checklist and timeline", "Advanced budget and payment planner", "Unlimited suppliers and quote comparison", "Guest list and RSVPs", "Wedding calendar", "Moodboards", "Wedding-day run sheet", "Printing and exports"],
  },
};

export const COMPARISON: [string, string | boolean, string | boolean][] = [
  ["Dashboard and countdown", "Basic", "Fully personalised"],
  ["Checklist and timeline", "Starter", "Complete, with templates"],
  ["Budget planner", "Basic", "Advanced, with payments"],
  ["Suppliers", "Up to 5", "Unlimited, with comparison"],
  ["Guest list and RSVPs", false, true],
  ["Wedding calendar", false, true],
  ["Moodboards", false, true],
  ["Wedding-day run sheet", false, true],
  ["Printing and exports", false, true],
];

export const PRICING_FAQS = [
  { q: "Is it really a one-off payment?", a: "Yes. The Complete Edit is a single payment, not a subscription. There's nothing to cancel." },
  { q: "How long do I keep access?", a: "We'll publish the exact access period, refund policy and full terms before paid plans open. Nobody will be charged during early testing." },
  { q: "Can I start free and upgrade later?", a: "Yes. Everything you add on the free plan stays exactly where it is when you upgrade." },
  { q: "Is my information private?", a: "Your wedding is visible only to your account. Guest details stay within your wedding, we never sell your data, and you can delete everything whenever you like." },
  { q: "Does it work outside the UK?", a: "Yes. Choose your currency, country and date format, and your checklist adapts. We don't assume every wedding follows the same traditions." },
];
