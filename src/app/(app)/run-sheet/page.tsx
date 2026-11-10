import type { Metadata } from "next";
import { PageHeader, StageNote } from "@/components/page-bits";
import { RunSheetEmpty } from "@/components/section-previews";

export const metadata: Metadata = { title: "Run sheet" };

export default function RunSheetPage() {
  return (
    <>
      <PageHeader title="Run sheet" intro="The day, beautifully timed, for you, your bridal party and suppliers." />
      <StageNote>The wedding-day run sheet, with printing and export, arrives in Phase 3.</StageNote>
      <RunSheetEmpty />
    </>
  );
}
