/*
  DEMONSTRATION DATA — used in Stage 1 only, and always shown with a
  "Sample" label in the interface. Dates are generated relative to today
  so the preview never looks stale. Amounts are scaled to the bride's own
  budget so the numbers feel proportionate.
  This file is deleted when real data arrives in Stage 2.
*/
import { addDays, todayISO } from "./format";

const SAMPLE_BUDGET = 25000;

export type SampleTask = { id: string; title: string; due: string; priority: "high" | "normal"; done: boolean; area: string };
export type SampleSupplier = { id: string; name: string; category: string; status: "booked" | "shortlisted" | "enquired"; agreed: number | null; paid: number };
export type SamplePayment = { id: string; label: string; supplier: string; amount: number; due: string };
export type SampleEvent = { id: string; title: string; date: string; time?: string; kind: string };
export type SampleBudgetLine = { category: string; estimated: number; agreed: number | null; paid: number };

export function sampleData(budget: number | null) {
  const t = todayISO();
  const scale = (budget && budget > 0 ? budget : SAMPLE_BUDGET) / SAMPLE_BUDGET;
  const money = (n: number) => Math.round((n * scale) / 10) * 10;

  const budgetLines: SampleBudgetLine[] = [
    { category: "Venue", estimated: money(8000), agreed: money(7800), paid: money(2500) },
    { category: "Catering", estimated: money(5500), agreed: null, paid: 0 },
    { category: "Photographer", estimated: money(1800), agreed: money(1800), paid: money(500) },
    { category: "Flowers", estimated: money(1500), agreed: null, paid: 0 },
    { category: "Dress and alterations", estimated: money(2000), agreed: money(1650), paid: money(825) },
    { category: "Hair and makeup", estimated: money(600), agreed: null, paid: 0 },
    { category: "Entertainment", estimated: money(1200), agreed: money(1100), paid: money(250) },
    { category: "Stationery", estimated: money(450), agreed: null, paid: 0 },
  ];

  const tasks: SampleTask[] = [
    { id: "t1", title: "Send save-the-dates", due: addDays(t, 6), priority: "high", done: false, area: "Guests" },
    { id: "t2", title: "Shortlist three florists", due: addDays(t, 12), priority: "normal", done: false, area: "Suppliers" },
    { id: "t3", title: "Book a menu tasting", due: addDays(t, 18), priority: "normal", done: false, area: "Catering" },
    { id: "t4", title: "Decide on ceremony readings", due: addDays(t, 30), priority: "normal", done: false, area: "Ceremony" },
    { id: "t5", title: "Book photographer", due: addDays(t, -4), priority: "high", done: true, area: "Suppliers" },
    { id: "t6", title: "Confirm venue and date", due: addDays(t, -40), priority: "high", done: true, area: "Venue" },
    { id: "t7", title: "Set the overall budget", due: addDays(t, -60), priority: "high", done: true, area: "Budget" },
  ];

  const suppliers: SampleSupplier[] = [
    { id: "s1", name: "Hartwell House Barn", category: "Venue", status: "booked", agreed: money(7800), paid: money(2500) },
    { id: "s2", name: "Clara Moss Photography", category: "Photographer", status: "booked", agreed: money(1800), paid: money(500) },
    { id: "s3", name: "The Quartet Collective", category: "Entertainment", status: "booked", agreed: money(1100), paid: money(250) },
    { id: "s4", name: "Wild Meadow Flowers", category: "Florist", status: "shortlisted", agreed: null, paid: 0 },
  ];

  const payments: SamplePayment[] = [
    { id: "p1", label: "Second instalment", supplier: "Hartwell House Barn", amount: money(2650), due: addDays(t, 21) },
    { id: "p2", label: "Final dress balance", supplier: "Atelier Rowe", amount: money(825), due: addDays(t, 44) },
    { id: "p3", label: "Balance", supplier: "The Quartet Collective", amount: money(850), due: addDays(t, 75) },
  ];

  const events: SampleEvent[] = [
    { id: "e1", title: "First dress fitting", date: addDays(t, 9), time: "11:00", kind: "Fitting" },
    { id: "e2", title: "Florist consultation", date: addDays(t, 14), time: "15:30", kind: "Meeting" },
    { id: "e3", title: "Venue instalment due", date: addDays(t, 21), kind: "Payment" },
    { id: "e4", title: "Menu tasting", date: addDays(t, 27), time: "18:00", kind: "Tasting" },
  ];

  return { budgetLines, tasks, suppliers, payments, events, sampleWeddingDate: addDays(t, 268) };
}
