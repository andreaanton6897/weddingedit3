import type { Metadata } from "next";
import { ButtonLink } from "@/components/brand";
import { Photo } from "@/components/photo";
import { photoAvailability } from "@/lib/photo-availability";
import { STEPS } from "@/lib/site-content";

export const metadata: Metadata = { title: "How it works" };

const CHAPTERS = [
  ["Your wedding", "Date, location, ceremony and guests"],
  ["Your aesthetic", "Style, colours and atmosphere"],
  ["Your budget", "Total, currency and priorities"],
  ["Your progress", "What's booked and what's left"],
  ["Your priorities", "What matters most, and how you like to plan"],
];

export default function HowItWorksPage() {
  const photos = photoAvailability();
  return (
    <>
      <section className="mx-auto max-w-7xl px-5 pb-16 pt-14 sm:px-8 lg:pt-20">
        <p className="font-serif text-[19px] italic text-taupe">How it works</p>
        <h1 className="mt-3 max-w-[50rem] text-[52px] leading-[0.94] sm:text-[88px]">Four steps to a calmer engagement.</h1>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-20 sm:px-8">
        <ol className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <li key={s.title}>
              <Photo name={s.photo} available={photos[s.photo]} label={false} zoom className="aspect-[3/4] w-full rounded-[var(--radius-card)]" sizes="(min-width: 1024px) 25vw, 50vw" />
              <p className="mt-5 font-serif text-[56px] leading-none">{i + 1}</p>
              <h2 className="mt-3 font-sans text-[18px] font-[600] leading-snug tracking-normal">{s.title}</h2>
              <p className="mt-2 text-[15.5px] text-ink/75">{s.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="bg-ivory">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 sm:px-8 lg:grid-cols-12 lg:py-28">
          <div className="lg:col-span-5">
            <h2 className="text-[42px] leading-[0.98] sm:text-[60px]">Five short chapters about you.</h2>
            <p className="mt-6 text-[16.5px] leading-relaxed text-ink/75">Like a magazine getting to know its cover star, without the endless form. Answers save as you go, you can skip anything, and you can come back and change them at any time.</p>
          </div>
          <ol className="lg:col-span-6 lg:col-start-7">
            {CHAPTERS.map(([title, body], i) => (
              <li key={title} className="grid grid-cols-[4rem_1fr] items-baseline border-b border-linen py-5 first:border-t first:border-ink">
                <span className="font-serif text-[15px] italic text-taupe">Chapter {i + 1}</span>
                <span><span className="block font-serif text-[26px]">{title}</span><span className="block text-[15px] text-ink/70">{body}</span></span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 text-center sm:px-8">
        <h2 className="text-[40px] sm:text-[56px]">It takes about five minutes.</h2>
        <ButtonLink href="/onboarding" className="mt-8">Start chapter one</ButtonLink>
      </section>
    </>
  );
}
