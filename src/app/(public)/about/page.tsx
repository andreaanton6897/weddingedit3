import type { Metadata } from "next";
import { ButtonLink } from "@/components/brand";
import { Photo } from "@/components/photo";
import { photoAvailability } from "@/lib/photo-availability";

export const metadata: Metadata = { title: "About" };

const BELIEFS = [
  ["Beautiful and practical", "Planning tools can be a pleasure to open. Good design makes the practical parts easier, not harder."],
  ["Your wedding, your way", "No assumptions about traditions, timelines or budgets. Every wedding is planned around the couple's own choices."],
  ["Clear about money", "Estimates, quotes and payments are kept apart, so the numbers always tell the truth."],
  ["Private by default", "Your wedding is yours. We never sell your information, and you can delete it whenever you like."],
];

export default function AboutPage() {
  const photos = photoAvailability();
  return (
    <>
      <section className="mx-auto grid max-w-7xl gap-12 px-5 pb-20 pt-14 sm:px-8 lg:grid-cols-12 lg:items-end lg:pt-20">
        <div className="lg:col-span-7">
          <p className="font-serif text-[19px] italic text-taupe">About</p>
          <h1 className="mt-3 text-[52px] leading-[0.94] sm:text-[88px]">A wedding magazine you can plan in.</h1>
        </div>
        <p className="font-serif text-[22px] italic leading-snug text-ink-soft lg:col-span-4 lg:col-start-9">
          The Wedding Edit was created for brides who want the organisation of a planner and the beauty of a magazine, in one place.
        </p>
      </section>

      <Photo name="tablescape" available={photos.tablescape} className="mx-auto aspect-[16/9] max-w-7xl sm:rounded-[var(--radius-card)]" sizes="100vw" />

      <section className="mx-auto grid max-w-7xl gap-12 px-5 py-20 sm:px-8 lg:grid-cols-12 lg:py-28">
        <div className="lg:col-span-5">
          <p className="drop-cap text-[18px] leading-[1.75] text-ink/80">
            Planning a wedding means hundreds of decisions, scattered across spreadsheets, notes, screenshots and emails. Most planning tools solve that with something functional but forgettable. We think the place you plan your wedding should feel as considered as the wedding itself: calm to open, easy to use, and lovely to look at. So we built one.
          </p>
        </div>
        <dl className="grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:col-span-6 lg:col-start-7">
          {BELIEFS.map(([title, body]) => (
            <div key={title} className="border-t border-ink pt-4">
              <dt className="font-serif text-[24px]">{title}</dt>
              <dd className="mt-2 text-[15.5px] text-ink/75">{body}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-20 text-center sm:px-8">
        <ButtonLink href="/onboarding">Start planning free</ButtonLink>
      </section>
    </>
  );
}
