import type { Metadata } from "next";
import { PageHeader, StageNote } from "@/components/page-bits";
import { BudgetPreview } from "@/components/section-previews";

export const metadata: Metadata = { title: "Budget" };

export default function BudgetPage() {
  return (
    <>
      <PageHeader title="Budget" intro="Estimates, quotes, agreed costs and payments, kept clearly apart." />
      <StageNote>Preview with sample figures in your currency. Adding categories, quotes, agreed costs and payments arrives in Phase 2.</StageNote>
      <BudgetPreview />
    </>
  );
}
