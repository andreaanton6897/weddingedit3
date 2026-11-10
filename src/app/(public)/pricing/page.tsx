import type { Metadata } from "next";
import { Check, Minus } from "lucide-react";
import { ButtonLink } from "@/components/brand";
import { COMPARISON, PLANS, PRICING_FAQS } from "@/lib/site-content";

export const metadata: Metadata = { title: "Pricing" };

export default function PricingPage() {
  return (
    <>
      <section className="mx-auto max-w-7xl px-5 pb-12 pt-14 sm:px-8 lg:pt-20">
        <p className="font-serif text-[19px] italic text-taupe">Pricing</p>
        <h1 className="mt-3 max-w-[50rem] text-[52px] leading-[0.94] sm:text-[88px]">Start free. Upgrade once.</h1>
        <p className="mt-6 max-w-[36rem] text-[18px] leading-relaxed text-ink/75">Free while we&rsquo;re in early testing. These are the packages we plan to offer, so you know what to expect. Nobody is charged during testing.</p>
      </section>

      <section className="mx-auto grid max-w-7xl gap-5 px-5 sm:px-8 lg:grid-cols-2">
        {[PLANS.free, PLANS.complete].map((plan, i) => (
          <div key={plan.name} className={`flex flex-col rounded-[var(--radius-card)] p-8 sm:p-10 ${i ? "bg-ink text-white" : "border border-linen"}`}>
            <h2 className="font-serif text-[34px] italic">{plan.name}</h2>
            <p className="mt-5 font-serif text-[72px] leading-none">{plan.price}</p>
            <p className={`mt-3 text-[15px] ${i ? "text-white/70" : "text-taupe"}`}>{plan.note}</p>
            <ul className={`mt-8 flex-1 space-y-3 border-t pt-6 text-[15.5px] ${i ? "border-white/20 text-white/85" : "border-linen text-ink/80"}`}>
              {plan.items.map((x) => <li key={x} className="flex gap-2.5"><Check className={`mt-1 size-4 shrink-0 ${i ? "text-champagne" : "text-sage"}`} />{x}</li>)}
            </ul>
            <ButtonLink href="/onboarding" variant={i ? "secondary" : "primary"} className={`mt-10 ${i ? "border-white text-white hover:bg-white hover:text-ink" : ""}`}>
              {i ? "Start free, upgrade later" : "Start planning free"}
            </ButtonLink>
          </div>
        ))}
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
        <h2 className="text-[40px] sm:text-[56px]">Side by side</h2>
        <div className="mt-10 overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-[15px]">
            <thead>
              <tr className="border-b border-ink">
                <th className="py-4 font-normal text-taupe">Feature</th>
                <th className="py-4 font-serif text-[20px] font-normal italic">The Essentials</th>
                <th className="py-4 font-serif text-[20px] font-normal italic">The Complete Edit</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON.map(([feature, free, complete]) => (
                <tr key={feature} className="border-b border-linen">
                  <td className="py-4 pr-4">{feature}</td>
                  {[free, complete].map((v, i) => (
                    <td key={i} className="py-4 pr-4 text-ink/80">
                      {v === true ? <Check className="size-5 text-sage" aria-label="Included" /> : v === false ? <Minus className="size-5 text-linen" aria-label="Not included" /> : v}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="border-t border-linen bg-ivory">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-20 sm:px-8 lg:grid-cols-12 lg:py-28">
          <h2 className="text-[40px] sm:text-[56px] lg:col-span-4">Questions</h2>
          <div className="border-t border-ink lg:col-span-7 lg:col-start-6">
            {PRICING_FAQS.map((f) => (
              <details key={f.q} className="group border-b border-linen py-6">
                <summary className="flex cursor-pointer list-none items-baseline justify-between gap-6 font-serif text-[22px] leading-snug [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <span aria-hidden className="font-sans text-[22px] font-light leading-none text-champagne-deep transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 max-w-[38rem] text-[15.5px] text-ink/75">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
