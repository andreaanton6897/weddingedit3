import type { Metadata } from "next";
import { PageHeader, StageNote } from "@/components/page-bits";
import { CalendarPreview } from "@/components/section-previews";

export const metadata: Metadata = { title: "Calendar" };

export default function CalendarPage() {
  return (
    <>
      <PageHeader title="Calendar" intro="Fittings, tastings, meetings and payment deadlines, in your time zone." />
      <StageNote>Preview with sample dates. A monthly view, adding events and exporting to your phone&rsquo;s calendar arrive in Phase 2.</StageNote>
      <CalendarPreview />
    </>
  );
}
