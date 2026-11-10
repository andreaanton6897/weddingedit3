# The Wedding Edit — Plan

Updated 10 November 2026, after the change of direction: no AI. The Wedding Edit is now a premium, magazine-style wedding planning platform with rule-based personalisation, sold as a free plan plus a one-off upgrade.

---

## 1. What changed

- **Removed:** the AI planner page, the approval screen, all AI wording, and the four AI tables (`chat_conversations`, `chat_messages`, `proposed_actions`, `approved_actions`).
- **Kept:** the technology stack, the Bodoni magazine typography, the responsive layouts, the privacy-tested database approach.
- **Added in Phase 1:** a white editorial design with a photo system, five public pages, navigation for all eight planning areas, the five-chapter onboarding with autosave, a personalised dashboard, and a Wedding preferences section in Settings.

## 2. Technology (unchanged, now cheaper)

| Part | Choice | Cost while building |
|---|---|---|
| Website and app | Next.js 16, TypeScript, Tailwind CSS | Free |
| Fonts | Bodoni Moda (headings) + Hanken Grotesk (everything else), self-hosted | Free |
| Database, accounts, image storage | Supabase (PostgreSQL, Auth, Storage, Row Level Security) | Free plan |
| Hosting | Vercel | Free plan |
| Code storage | GitHub | Free |
| Payments | Stripe Checkout (Phase 4) | No monthly fee |

With no AI, there are no per-message costs at all.

## 3. Running costs (USD, before tax)

- **While building and testing:** $0 a month.
- **Once you sell The Complete Edit:** about **$45 a month** in fixed costs, plus Stripe's fee on each sale.
  - Vercel Pro: $20 a month. The free Hobby plan is for non-commercial use only.
  - Supabase Pro: from $25 a month. Free projects pause after a week without activity.
- **Break-even:** at £24.99 per sale, roughly **2–3 sales a month** cover the fixed costs.
- **Moodboard storage:** image storage grows with uploads. We'll check Supabase's storage allowance and set a sensible per-wedding upload limit before Phase 3.

## 4. Site map

**Public:** Home, Features, How it works, Pricing, About, and Sign up / Log in (Phase 2).

**Workspace:**

| Area | Phase it becomes fully working |
|---|---|
| Dashboard | Personalised now; live data in Phase 2 |
| Checklist and timeline | 2 |
| Budget planner | 2 |
| Suppliers and bookings | 2 (comparison in 3) |
| Calendar | 2 |
| Guests and RSVPs | 3 |
| Moodboards | 3 |
| Wedding-day run sheet | 3 |
| Settings and Wedding preferences | Now |

**Navigation:**
- **Desktop:** a sidebar with all eight areas, and Settings at the bottom.
- **Phone:** tabs for Dashboard, Checklist, Budget and Suppliers, with **More** holding Guests, Calendar, Moodboards, Run sheet and Settings.

## 5. Personalisation (rule-based, no AI)

Rules live in `src/lib/personalise.ts`, written as plain "if this, then that". Today they drive:

- **Dashboard headline:** "Your romantic destination wedding in Lake Como is taking shape."
- **Up to five next steps**, in priority order, for example:
  - Date undecided: settle on a date.
  - Venue not booked: book the venue. For a destination wedding, shortlist venues abroad instead.
  - Venue already booked: no venue step.
  - Budget-conscious (priority, worries or saving areas): set category budgets, and the budget moves to the top of the dashboard.
  - Destination: legal requirements, plus guest travel and accommodation.
  - Top priorities: book that supplier if it isn't booked yet.
  - Large wedding: start the guest list now. Smaller weddings: draft the guest list once the venue is booked.
  - Short engagement (under 9 months): the timeline is flagged as shortened.
- **Booking progress:** how many of eight key suppliers are booked.

In Phase 2 the same rules choose which checklist template tasks to add: destination, small, large, ceremony type and short engagement.

## 6. Database

The full SQL, with comments, is in `supabase/schema.sql`. I tested it on PostgreSQL 16:

- A second bride can't see, change, delete or add to another bride's wedding.
- **Free plan limits are enforced by the database.** Free accounts can save at most 5 suppliers. Guests, moodboards, images and the run sheet can be added only with The Complete Edit.
- **Purchases can only be recorded by the server** after Stripe confirms payment. A browser can't grant itself access, and the same payment can't be recorded twice.
- A payment can't be marked paid without a paid date.
- Deleting a wedding deletes everything attached to it. Moodboard image files also need deleting from storage; the account-deletion step in Phase 2 will do this.

**Tables:**
- profiles, weddings, wedding_members, wedding_preferences
- purchases
- suppliers, supplier_comparisons, supplier_comparison_items
- budget_categories, budget_items, payments
- tasks, guests, calendar_events
- moodboards, moodboard_images
- wedding_day_events

## 7. Roadmap

**Phase 1 — Brand and design. Done.** White editorial design system with a photo system, public pages, responsive navigation, five-chapter onboarding with autosave and rule-based personalisation, Wedding preferences. Tested on desktop and phone. Answers are saved in the browser for now.

**Phase 2 — Core planning.**
- *You create:* a free Supabase account.
- *I build:*
  - Sign up and log in.
  - Moving onboarding answers into the database.
  - A real dashboard.
  - Checklist with templates.
  - Budget and payments.
  - Suppliers.
  - Calendar with `.ics` export.
  - Delete-my-account.

**Phase 3 — Additional features.**
- Guest list and RSVPs.
- Moodboards with uploads and palettes.
- Wedding-day run sheet with reordering, printing and export.
- Supplier comparison.

**Phase 4 — Monetisation.**
- *You create:* a Stripe account.
- *I build:*
  - The Complete Edit checkout.
  - Payment confirmation.
  - Purchase history.
  - Free and paid access in the app (already enforced in the database).

**Phase 5 — Testing and launch.**
- Full testing: security, international settings, payments in test mode.
- Privacy policy and terms.
- Testing with real brides.
- Upgrading Vercel and Supabase.

## 8. Decisions and risks for you

1. **Photography.** This is the biggest gap. The design needs real photos to feel luxurious. See the shot list in the README. Use your own photos, a photographer's with written permission, or licensed stock.
2. **Access period and refunds for The Complete Edit.** For example: access until 12 months after the wedding date, and refunds within 14 days. These must be on the pricing page before you charge. UK consumer law has rules on digital content refunds, so check them.
3. **Privacy law.** The app stores personal details, including other people's: guests' allergies and accessibility needs. You'll need a privacy policy and terms, and will likely need to register with the ICO. A short consultation before launch is worth it.
4. **The name.** Search the UK IPO trademark register, and check domain and social handles, before spending on branding.
5. **Partner access.** Should a bride be able to invite her partner or a bridesmaid? The database already supports it.
