import type { Metadata } from "next";
import { PageHeader, StageNote } from "@/components/page-bits";
import { SuppliersPreview } from "@/components/section-previews";

export const metadata: Metadata = { title: "Suppliers" };

export default function SuppliersPage() {
  return (
    <>
      <PageHeader title="Suppliers" intro="From first enquiry to final payment, every supplier in one place." />
      <StageNote>Preview with sample suppliers. Saving your own arrives in Phase 2, and comparing quotes side by side in Phase 3.</StageNote>
      <SuppliersPreview />
    </>
  );
}
