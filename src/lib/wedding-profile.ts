/*
  The bride's wedding preferences, collected in the five onboarding
  chapters and editable later under Settings → Wedding preferences.

  PHASE 1 NOTE: until accounts arrive in Phase 2, answers are stored only
  in this browser (localStorage) and saved automatically as she answers.
  Nothing is sent to a server. In Phase 2 the same shape is saved to the
  `weddings` and `wedding_preferences` tables in Supabase.
*/
import type { PhotoKey } from "./photos";

// ---------- Option lists ----------

export const CURRENCIES = [
  { code: "GBP", label: "British pound (£)" },
  { code: "EUR", label: "Euro (€)" },
  { code: "USD", label: "US dollar ($)" },
  { code: "CAD", label: "Canadian dollar (CA$)" },
  { code: "AUD", label: "Australian dollar (A$)" },
  { code: "NZD", label: "New Zealand dollar (NZ$)" },
  { code: "CHF", label: "Swiss franc (CHF)" },
  { code: "SEK", label: "Swedish krona (kr)" },
  { code: "NOK", label: "Norwegian krone (kr)" },
  { code: "DKK", label: "Danish krone (kr)" },
  { code: "ZAR", label: "South African rand (R)" },
  { code: "INR", label: "Indian rupee (₹)" },
  { code: "AED", label: "UAE dirham (AED)" },
  { code: "SGD", label: "Singapore dollar (S$)" },
] as const;
export type CurrencyCode = (typeof CURRENCIES)[number]["code"];

export const COUNTRIES = [
  "United Kingdom", "Ireland", "United States", "Canada", "Australia",
  "New Zealand", "France", "Italy", "Spain", "Portugal", "Greece",
  "Germany", "Netherlands", "Switzerland", "Sweden", "Norway", "Denmark",
  "South Africa", "India", "United Arab Emirates", "Singapore", "Mexico",
  "Other",
];

export const COUNTRY_CURRENCY: Record<string, CurrencyCode> = {
  "United Kingdom": "GBP", Ireland: "EUR", "United States": "USD", Canada: "CAD",
  Australia: "AUD", "New Zealand": "NZD", France: "EUR", Italy: "EUR", Spain: "EUR",
  Portugal: "EUR", Greece: "EUR", Germany: "EUR", Netherlands: "EUR", Switzerland: "CHF",
  Sweden: "SEK", Norway: "NOK", Denmark: "DKK", "South Africa": "ZAR", India: "INR",
  "United Arab Emirates": "AED", Singapore: "SGD",
};

export const CEREMONY_TYPES = ["Civil", "Religious", "Celebrant-led", "Symbolic", "More than one ceremony", "Not decided yet"];

export const GUEST_RANGES = [
  { value: "intimate", label: "Intimate", hint: "Under 30" },
  { value: "small", label: "Small", hint: "30 to 80" },
  { value: "medium", label: "Medium", hint: "80 to 150" },
  { value: "large", label: "Large", hint: "Over 150" },
] as const;
export type GuestRange = (typeof GUEST_RANGES)[number]["value"];

export const STYLES: { value: string; photo: PhotoKey }[] = [
  { value: "Romantic", photo: "style-romantic" },
  { value: "Modern", photo: "style-modern" },
  { value: "Classic", photo: "style-classic" },
  { value: "Minimalist", photo: "style-minimalist" },
  { value: "Luxury", photo: "style-luxury" },
  { value: "Rustic", photo: "style-rustic" },
  { value: "Bohemian", photo: "style-bohemian" },
  { value: "Traditional", photo: "style-traditional" },
];

export const COLOUR_PALETTES: { value: string; swatches: string[] }[] = [
  { value: "Ivory and white", swatches: ["#fffdf8", "#f3ece0", "#e6dccb"] },
  { value: "Blush and nude", swatches: ["#f1ddd6", "#e3c3b7", "#cfa595"] },
  { value: "Sage and greenery", swatches: ["#dfe5d6", "#a9b79a", "#6b775f"] },
  { value: "Terracotta and rust", swatches: ["#e9c9b2", "#c47e5a", "#8f4c33"] },
  { value: "Black and white", swatches: ["#ffffff", "#9c9a96", "#161311"] },
  { value: "Navy and gold", swatches: ["#d4bb83", "#33405e", "#1d2538"] },
  { value: "Jewel tones", swatches: ["#5a2a4a", "#24524a", "#8a6a22"] },
  { value: "Soft pastels", swatches: ["#e6e1f0", "#dcebe4", "#f4e5d3"] },
];

export const ATMOSPHERES = ["Relaxed", "Elegant", "Party all night", "Intimate", "Glamorous", "Garden party", "Family-focused", "Fun and playful"];

export const BUDGET_AREAS = [
  "Venue", "Food and drink", "Photography", "Videography", "Dress and outfits", "Flowers and styling",
  "Music and entertainment", "Hair and makeup", "Stationery", "Cake", "Transport", "Guest accommodation",
];

export const PLANNING_STAGES = [
  { value: "just-engaged", label: "Just engaged", hint: "Nothing booked yet" },
  { value: "early", label: "Getting started", hint: "Looking at venues and dates" },
  { value: "underway", label: "Well underway", hint: "Venue booked, choosing suppliers" },
  { value: "final", label: "The final stretch", hint: "Details, RSVPs and timings" },
] as const;
export type PlanningStage = (typeof PLANNING_STAGES)[number]["value"];

export const SUPPLIER_TYPES = [
  "Venue", "Photographer", "Videographer", "Florist", "Caterer", "Cake", "Hair and makeup",
  "Entertainment", "Celebrant or officiant", "Transport", "Stationery", "Accommodation",
];

export const PLANNER_HELP = [
  { value: "none", label: "No, we're planning it ourselves" },
  { value: "full", label: "Yes, a full planner" },
  { value: "day", label: "Yes, on the day only" },
  { value: "considering", label: "Thinking about it" },
] as const;
export type PlannerHelp = (typeof PLANNER_HELP)[number]["value"];

export const OUTSTANDING = [
  "Choosing a date", "Finding a venue", "Booking suppliers", "The guest list", "Invitations",
  "The dress", "Ceremony details", "Wedding-day timings", "Guest travel",
];

export const PRIORITIES = [
  "The venue", "Food and drink", "Photography", "The dress", "Flowers and styling",
  "Music and the party", "Guest experience", "Staying on budget", "A stress-free day",
];

export const WORRIES = [
  "Going over budget", "The guest list", "Family expectations", "Running out of time",
  "Finding the right suppliers", "Making decisions", "Keeping track of everything", "The day itself",
];

export const HELP_AREAS = [
  "Budget and payments", "Checklist and deadlines", "Suppliers", "Guests and RSVPs",
  "Calendar and appointments", "Inspiration and styling", "The wedding-day schedule",
];

// ---------- The saved answers ----------

export type WeddingProfile = {
  // Chapter 1: your wedding
  name: string | null;
  dateStatus: "set" | "roughly" | "undecided" | null;
  weddingDate: string | null;  // YYYY-MM-DD, when set
  roughMonth: string | null;   // YYYY-MM, when roughly known
  country: string | null;
  location: string | null;
  weddingKind: "local" | "destination" | null;
  ceremonyType: string | null;
  guestRange: GuestRange | null;
  guestCount: number | null;

  // Chapter 2: aesthetic
  styles: string[];
  styleOther: string | null;
  colours: string[];
  atmosphere: string[];
  wantsMoodboard: boolean | null;

  // Chapter 3: budget
  currency: CurrencyCode;
  budget: number | null;
  spentStatus: "yes" | "no" | null;
  alreadySpent: number | null;
  spendPriorities: string[];
  saveAreas: string[];

  // Chapter 4: progress
  planningStage: PlanningStage | null;
  venueBooked: boolean | null;
  bookedSuppliers: string[];
  plannerHelp: PlannerHelp | null;
  outstanding: string[];

  // Chapter 5: priorities
  topPriorities: string[];
  excitedAbout: string | null;
  worries: string[];
  helpAreas: string[];
  planningStyle: "detailed" | "flexible" | null;

  // Settings
  timeZone: string;
  dateFormat: "DD/MM/YYYY" | "MM/DD/YYYY" | "YYYY-MM-DD";
  createdAt: string;
  completedAt: string | null;
};

const STORAGE_KEY = "twe.profile.v2";

export function emptyProfile(): WeddingProfile {
  // timeZone and createdAt are filled in on first save, in the browser.
  return {
    name: null, dateStatus: null, weddingDate: null, roughMonth: null, country: null, location: null,
    weddingKind: null, ceremonyType: null, guestRange: null, guestCount: null,
    styles: [], styleOther: null, colours: [], atmosphere: [], wantsMoodboard: null,
    currency: "GBP", budget: null, spentStatus: null, alreadySpent: null, spendPriorities: [], saveAreas: [],
    planningStage: null, venueBooked: null, bookedSuppliers: [], plannerHelp: null, outstanding: [],
    topPriorities: [], excitedAbout: null, worries: [], helpAreas: [], planningStyle: null,
    timeZone: "", dateFormat: "DD/MM/YYYY", createdAt: "", completedAt: null,
  };
}

/** The bride's time zone, read from her browser. Call only in the browser. */
export function browserTimeZone() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  } catch {
    return "UTC";
  }
}

export function loadProfile(): WeddingProfile | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) return null;
    return { ...emptyProfile(), ...parsed } as WeddingProfile;
  } catch {
    return null;
  }
}

export function saveProfile(profile: WeddingProfile): boolean {
  try {
    const toSave: WeddingProfile = {
      ...profile,
      timeZone: profile.timeZone || browserTimeZone(),
      createdAt: profile.createdAt || new Date().toISOString(),
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    return true;
  } catch {
    return false;
  }
}

export function clearProfile(): boolean {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
    window.localStorage.removeItem("twe.profile.v1"); // tidy up the older preview version
    return true;
  } catch {
    return false;
  }
}
