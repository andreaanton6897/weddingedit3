import Link from "next/link";
import { Check } from "lucide-react";
import { ButtonLink } from "@/components/brand";
import { Photo } from "@/components/photo";
import { BudgetPreview, ChecklistPreview, CountdownPreview, RunSheetPreview } from "@/components/product-previews";
import { photoAvailability } from "@/lib/photo-availability";
import { AREAS, PLANS } from "@/lib/site-content";

const SCATTERED = ["spreadsheets", "notebooks", "screenshots", "notes apps", "the family group chat", "a dozen planning documents"];

const PERSONAL = [
  ["A destination wedding", "Travel, accommodation and guest logistics, plus a reminder to check legal requirements"],
  ["An intimate wedding", "A lighter checklist without the tasks only big weddings need"],
  ["A large wedding", "Guest-list and seating tasks brought forward"],
  ["A short engagement", "Deadlines rearranged to fit the time you have"],
  ["A venue already booked", "No more reminders to book a venue"],
  ["A careful budget", "Budget and payment deadlines put first on your dashboard"],
];

const SPREADS = [
  { title: "Know where every penny is going.", body: "Estimates, quotes, agreed costs and payments are kept clearly apart, in your currency. A quote is never counted as spent, and nothing is marked paid until you confirm it.", photo: "stationery" as const, preview: <BudgetPreview />, href: "/features#budget" },
  { title: "The right task at the right time.", body: "A checklist arranged around your date, from eighteen months out to the morning itself. Add your own tasks, set priorities and see what's coming up at a glance.", photo: "details" as const, preview: <ChecklistPreview />, href: "/features#checklist" },
  { title: "The day, beautifully timed.", body: "Build your wedding-day schedule minute by minute, with locations, suppliers and who's responsible. Print it for the bridal party or share it with suppliers.", photo: "tablescape" as const, preview: <RunSheetPreview />, href: "/features#run-sheet" },
];

export default function Home() {
  const photos = photoAvailability();
  return (
    <>
      {/* Opening spread */}
      <section className="mx-auto grid max-w-7xl gap-12 px-5 pb-20 pt-10 sm:px-8 lg:grid-cols-12 lg:items-center lg:gap-10 lg:pb-28 lg:pt-14">
        <div className="lg:col-span-6">
          <p className="font-serif text-[19px] italic text-taupe">The wedding planning platform</p>
          <h1 className="mt-4 text-[56px] leading-[0.92] sm:text-[84px] xl:text-[100px]">Your wedding, beautifully organised.</h1>
          <p className="mt-7 max-w-[32rem] text-[18px] leading-relaxed text-ink/75">
            Your budget, checklist, suppliers, guests, calendar, moodboards and wedding-day schedule, together in one beautiful place and shaped around your wedding.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
            <ButtonLink href="/onboarding">Start planning free</ButtonLink>
            <ButtonLink href="/features" variant="quiet" className="h-auto">See every feature</ButtonLink>
          </div>
          <ul className="mt-9 flex flex-wrap gap-x-6 gap-y-2 text-[14px] text-ink-soft">
            {["Free to start", "One payment for everything", "No subscription"].map((t) => (
              <li key={t} className="flex items-center gap-2"><Check className="size-4 text-sage" />{t}</li>
            ))}
          </ul>
        </div>
        <div className="relative lg:col-span-6">
          <Photo name="hero" available={photos.hero} priority className="aspect-[4/5] w-full rounded-[var(--radius-card)] sm:aspect-[5/6]" sizes="(min-width: 1024px) 45vw, 100vw" />
          <CountdownPreview className="absolute -bottom-6 left-4 w-[220px] sm:-left-8 sm:bottom-10 sm:w-[240px]" />
        </div>
      </section>

      {/* The problem */}
      <section className="bg-ivory">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-20 sm:px-8 lg:grid-cols-12 lg:py-24">
          <h2 className="text-[42px] leading-[0.98] sm:text-[60px] lg:col-span-5">Planning a wedding shouldn&rsquo;t mean ten different places.</h2>
          <div className="lg:col-span-6 lg:col-start-7">
            <p className="drop-cap text-[18px] leading-[1.75] text-ink/80">
              Most weddings are planned across{" "}
              {SCATTERED.map((s, i) => (
                <span key={s}>
                  <span className="font-serif text-[20px] italic text-ink line-through decoration-champagne-deep decoration-1">{s}</span>
                  {i < SCATTERED.length - 2 ? ", " : i === SCATTERED.length - 2 ? " and " : ". "}
                </span>
              ))}
              Payments slip, tasks get forgotten and you end up remembering everything. The Wedding Edit brings it all into one place that&rsquo;s a pleasure to open.
            </p>
          </div>
        </div>
      </section>

      {/* Feature spreads */}
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
        <div className="max-w-[40rem]">
          <h2 className="text-[42px] leading-[0.98] sm:text-[64px]">Everything in one beautiful place.</h2>
          <p className="mt-5 font-serif text-[21px] italic leading-snug text-ink-soft">Eight connected sections, designed to be as lovely to use as they are practical.</p>
        </div>
        <div className="mt-16 space-y-20 lg:space-y-28">
          {SPREADS.map((s, i) => (
            <article key={s.title} className="grid items-center gap-10 lg:grid-cols-12">
              <div className={`relative lg:col-span-7 ${i % 2 ? "lg:order-2 lg:col-start-6" : ""}`}>
                <Photo name={s.photo} available={photos[s.photo]} className="aspect-[4/3] w-full rounded-[var(--radius-card)]" sizes="(min-width: 1024px) 55vw, 100vw" />
                <div className={`relative -mt-24 px-4 sm:absolute sm:bottom-8 sm:mt-0 sm:w-[340px] sm:px-0 ${i % 2 ? "sm:left-8" : "sm:right-8"}`}>{s.preview}</div>
              </div>
              <div className={`lg:col-span-4 ${i % 2 ? "lg:order-1 lg:col-start-1" : "lg:col-start-9"}`}>
                <h3 className="text-[36px] leading-[1] sm:text-[44px]">{s.title}</h3>
                <p className="mt-5 text-[16.5px] leading-relaxed text-ink/75">{s.body}</p>
                <ButtonLink href={s.href} variant="quiet" className="mt-6 h-auto">Read more</ButtonLink>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-24 border-t border-ink pt-10">
          <h3 className="font-serif text-[30px]">In your edit</h3>
          <ul className="mt-6 grid gap-x-10 sm:grid-cols-2 lg:grid-cols-4">
            {AREAS.map((a) => (
              <li key={a.key} className="border-b border-linen">
                <Link href={`/features#${a.key}`} className="group block py-4">
                  <span className="block font-serif text-[22px] transition-colors group-hover:italic">{a.name}</span>
                  <span className="block text-[14px] text-taupe">{a.line}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Personalisation */}
      <section className="bg-ivory">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 sm:px-8 lg:grid-cols-12 lg:py-28">
          <div className="lg:col-span-5">
            <h2 className="text-[42px] leading-[0.98] sm:text-[60px]">Made around your wedding, not anyone else&rsquo;s.</h2>
            <p className="mt-6 text-[16.5px] leading-relaxed text-ink/75">
              Five short chapters about your date, style, budget, progress and priorities. Your answers shape your dashboard, checklist and next steps, and you can change them whenever plans change.
            </p>
            <ButtonLink href="/how-it-works" variant="quiet" className="mt-6 h-auto">How it works</ButtonLink>
          </div>
          <dl className="lg:col-span-6 lg:col-start-7">
            <div className="grid grid-cols-[1fr_1.4fr] gap-6 border-b border-ink pb-3 text-[13px] text-taupe">
              <dt>If you&rsquo;re planning</dt><dd>Your plan includes</dd>
            </div>
            {PERSONAL.map(([when, then]) => (
              <div key={when} className="grid grid-cols-[1fr_1.4fr] gap-6 border-b border-linen py-4">
                <dt className="font-serif text-[20px] leading-snug">{when}</dt>
                <dd className="text-[15px] text-ink/75">{then}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Packages */}
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
        <div className="grid gap-6 lg:grid-cols-12">
          <h2 className="text-[42px] leading-[0.98] sm:text-[64px] lg:col-span-6">Start free. Upgrade once.</h2>
          <p className="max-w-[30rem] self-end text-[16.5px] text-ink/75 lg:col-span-5 lg:col-start-8">Begin with the essentials at no cost. When you&rsquo;re ready for everything, it&rsquo;s a single payment with no subscription.</p>
        </div>
        <div className="mt-12 grid gap-5 lg:grid-cols-2">
          {[PLANS.free, PLANS.complete].map((plan, i) => (
            <div key={plan.name} className={`flex flex-col rounded-[var(--radius-card)] p-8 sm:p-10 ${i ? "bg-ink text-white" : "border border-linen"}`}>
              <h3 className="font-serif text-[32px] italic">{plan.name}</h3>
              <p className="mt-5 font-serif text-[64px] leading-none">{plan.price}</p>
              <p className={`mt-3 text-[14.5px] ${i ? "text-white/70" : "text-taupe"}`}>{plan.note}</p>
              <ul className={`mt-8 grid gap-3 border-t pt-6 text-[15px] sm:grid-cols-2 ${i ? "border-white/20 text-white/85" : "border-linen text-ink/80"}`}>
                {plan.items.slice(0, 6).map((x) => <li key={x} className="flex gap-2.5"><Check className={`mt-1 size-4 shrink-0 ${i ? "text-champagne" : "text-sage"}`} />{x}</li>)}
              </ul>
            </div>
          ))}
        </div>
        <ButtonLink href="/pricing" variant="quiet" className="mt-8 h-auto">Compare the packages</ButtonLink>
      </section>

      {/* Closing */}
      <section className="mx-auto max-w-7xl px-5 pb-20 sm:px-8 lg:pb-28">
        <div className="grid overflow-hidden rounded-[var(--radius-card)] bg-ink text-white lg:grid-cols-2">
          <Photo name="florals" available={photos.florals} className="aspect-[4/3] w-full lg:aspect-auto lg:min-h-[480px]" sizes="(min-width: 1024px) 50vw, 100vw" />
          <div className="flex flex-col justify-center p-8 sm:p-14">
            <h2 className="text-[46px] leading-[0.95] sm:text-[68px]">Begin your edit.</h2>
            <p className="mt-5 max-w-[26rem] font-serif text-[20px] italic leading-snug text-white/75">Five short chapters, about five minutes. Skip anything you haven&rsquo;t decided yet.</p>
            <Link href="/onboarding" className="mt-9 inline-flex h-12 w-fit items-center rounded-[var(--radius-control)] bg-white px-8 text-[14.5px] font-[500] tracking-[0.02em] text-ink transition-colors hover:bg-cream">
              Start planning free
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
