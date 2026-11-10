# The Wedding Edit

*Your wedding, beautifully organised.*

A premium, magazine-style wedding planning platform for brides.

---

## Progress

| Phase | What | Status |
|---|---|---|
| 1 | Brand and design: white editorial design system, photo system, public site (Home, Features, How it works, Pricing, About), navigation for all eight areas, five-chapter onboarding with autosave, personalised dashboard, Wedding preferences | **Done and tested** |
| 1 | Database schema with privacy and paid-access rules (`supabase/schema.sql`) | **Written and tested locally**, not yet in Supabase |
| 2 | Accounts, checklist, budget, suppliers, calendar | Next |
| 3 | Guests and RSVPs, moodboards, run sheet, supplier comparison, printing | Not started |
| 4 | Free and paid packages with Stripe | Not started |
| 5 | Testing and launch | Not started |

**What works today:**
- All five public pages, on desktop and phone.
- **Onboarding:**
  - Five chapters, each with short screens.
  - Saves automatically as you go.
  - Skip, Back, and jump to an earlier chapter.
  - Image-based style cards and colour palettes.
  - A celebration when you finish.
- **Dashboard,** built entirely from your answers:
  - A personalised headline and countdown.
  - Wedding details.
  - Rule-based next steps.
  - Budget.
  - Booking progress.
  - Your aesthetic.
  - Booked suppliers.
- **Settings:**
  - Wedding preferences, where you can edit any chapter.
  - Date format and time zone.
  - Delete my details.

**What doesn't work yet** (and the app says so on each page):
- Accounts.
- Saving tasks, budget items, suppliers, events or guests.
- Moodboard uploads.
- The run sheet.
- Payments.

For now, answers are stored in the browser only.

See `docs/PLAN.md` for costs, the database, the roadmap and decisions.

---

## Adding photographs

The site is designed around photography. Until a photo is added, each spot shows a labelled frame saying which shot it needs.

1. Use only photos you own or have a licence for.
2. Save each photo in the `public/images` folder with the exact file name below. JPG is best: around 2000px on the long side, under 500 KB.
3. Rebuild the site (Vercel does this automatically when you upload to GitHub). Each photo replaces its frame.

| File name | Shot | Shape |
|---|---|---|
| `hero.jpg` | Editorial bridal portrait, natural light, modern gown | Portrait |
| `tablescape.jpg` | Candlelit tablescape, ivory linen | Landscape |
| `florals.jpg` | Loose seasonal florals | Landscape |
| `stationery.jpg` | Invitation suite flat lay | Landscape |
| `venue.jpg` | Venue or garden ceremony set-up | Landscape |
| `destination.jpg` | Destination setting, coast or terrace | Landscape |
| `details.jpg` | Rings and accessories detail | Landscape |
| `dress.jpg` | Wedding dress, bright room | Landscape |
| `style-romantic.jpg` | Romantic styling | Portrait |
| `style-modern.jpg` | Modern styling | Portrait |
| `style-classic.jpg` | Classic styling | Portrait |
| `style-minimalist.jpg` | Minimalist styling | Portrait |
| `style-luxury.jpg` | Luxury styling | Portrait |
| `style-rustic.jpg` | Rustic styling | Portrait |
| `style-bohemian.jpg` | Bohemian styling | Portrait |
| `style-traditional.jpg` | Traditional styling | Portrait |

The list lives in `src/lib/photos.ts`, where you can also change the descriptions.

---

## Running it on your computer

You only need to do steps 1–2 once.

1. Install **Node.js** (free) from https://nodejs.org. Choose the **LTS** version.
2. Optional: install the **VS Code** editor from https://code.visualstudio.com.
3. Open a terminal in the project folder:
   - **Mac:** open Terminal, type `cd ` with a space after it, drag the folder in, then press Enter.
   - **Windows:** in the folder's address bar, type `cmd` and press Enter.
4. Run `npm install`. This takes a minute or two.
5. Run `npm run dev`.
6. Open **http://localhost:3000**.

Press `Ctrl + C` in the terminal to stop it. If you see red error text, copy it all and paste it to Claude.

---

## Where things are

| Location | What it contains |
|---|---|
| `src/app/(public)/` | Home, Features, How it works, Pricing, About |
| `src/app/onboarding/` | The five-chapter questionnaire |
| `src/app/(app)/dashboard/` | The personalised dashboard |
| `src/app/(app)/checklist`, `budget`, `suppliers`, `guests`, `calendar`, `moodboards`, `run-sheet` | Workspace areas (previews for now) |
| `src/app/(app)/settings/` | Wedding preferences, regional settings, data |
| `src/app/globals.css` | Colours, fonts and effects (the design system) |
| `src/lib/wedding-profile.ts` | Onboarding questions, options and saving |
| `src/lib/personalise.ts` | The personalisation rules |
| `src/lib/site-content.ts` | Words used on the public pages, including pricing |
| `src/lib/photos.ts` | The photo list |
| `supabase/schema.sql` | Database tables, privacy rules and paid-access rules |
| `docs/PLAN.md` | Plan, costs, roadmap, decisions |
