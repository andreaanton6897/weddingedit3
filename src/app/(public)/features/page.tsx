import type { Metadata } from "next";
import { Check } from "lucide-react";
import { ButtonLink } from "@/components/brand";
import { Photo } from "@/components/photo";
import { photoAvailability } from "@/lib/photo-availability";
import { AREAS } from "@/lib/site-content";

export const metadata: Metadata = { title: "Features" };

export default function FeaturesPage() {
  const photos = photoAvailability();
  return (
    <>
      <section className="mx-auto max-w-7xl px-5 pb-12 pt-14 sm:px-8 lg:pt-20">
        <p className="font-serif text-[19px] italic text-taupe">Features</p>
        <h1 className="mt-3 max-w-[56rem] text-[52px] leading-[0.94] sm:text-[88px]">Eight sections. One beautiful place.</h1>
        <p className="mt-6 max-w-[38rem] text-[18px] leading-relaxed text-ink/75">Every part of your wedding, connected. Add a supplier and their payments appear in your budget and calendar. Change your date and your checklist follows.</p>
        <nav aria-label="Sections" className="mt-10 flex flex-wrap gap-2">
          {AREAS.map((a) => (
            <a key={a.key} href={`#${a.key}`} className="rounded-full border border-linen px-4 py-2 text-[14px] transition-colors hover:border-ink">{a.name}</a>
          ))}
        </nav>
      </section>

      <div className="mx-auto max-w-7xl px-5 pb-20 sm:px-8 lg:pb-28">
        {AREAS.map((a, i) => (
          <section key={a.key} id={a.key} className="grid scroll-mt-28 items-center gap-10 border-t border-ink py-14 lg:grid-cols-12 lg:py-20">
            <div className={`lg:col-span-5 ${i % 2 ? "lg:order-2 lg:col-start-8" : ""}`}>
              <p className="font-serif text-[17px] italic text-taupe">{a.line}</p>
              <h2 className="mt-2 text-[40px] leading-[0.98] sm:text-[56px]">{a.name}</h2>
              <p className="mt-5 text-[16.5px] leading-relaxed text-ink/75">{a.body}</p>
              <ul className="mt-6 grid gap-2.5 text-[15px] sm:grid-cols-2">
                {a.points.map((pt) => <li key={pt} className="flex gap-2.5"><Check className="mt-1 size-4 shrink-0 text-sage" />{pt}</li>)}
              </ul>
              <p className="mt-6 text-[13.5px] text-taupe">
                {a.free === "Complete Edit" ? "Included in The Complete Edit" : a.free === "Included" ? "Included in both packages" : `Free: ${a.free.toLowerCase()}. Complete Edit: everything.`}
              </p>
            </div>
            <div className={`lg:col-span-6 ${i % 2 ? "lg:order-1 lg:col-start-1" : "lg:col-start-7"}`}>
              <Photo name={a.photo} available={photos[a.photo]} zoom className="aspect-[4/3] w-full rounded-[var(--radius-card)]" sizes="(min-width: 1024px) 50vw, 100vw" />
            </div>
          </section>
        ))}
        <div className="border-t border-ink pt-12 text-center">
          <h2 className="text-[40px] sm:text-[56px]">Ready when you are.</h2>
          <ButtonLink href="/onboarding" className="mt-8">Start planning free</ButtonLink>
        </div>
      </div>
    </>
  );
}
