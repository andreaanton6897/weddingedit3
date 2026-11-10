import type { Metadata } from "next";
import { PageHeader, StageNote } from "@/components/page-bits";
import { ChecklistPreview } from "@/components/section-previews";

export const metadata: Metadata = { title: "Checklist" };

export default function ChecklistPage() {
  return (
    <>
      <PageHeader title="Checklist" intro="Everything to do, in the order it matters, arranged around your date." />
      <StageNote>Preview with sample tasks. In Phase 2 your checklist is built from your answers, with stages from 18 months out to the day itself, and you can add, edit, complete and filter tasks.</StageNote>
      <ChecklistPreview />
    </>
  );
}
