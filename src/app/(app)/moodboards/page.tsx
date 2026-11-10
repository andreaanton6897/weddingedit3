import type { Metadata } from "next";
import { PageHeader, StageNote } from "@/components/page-bits";
import { MoodboardsEmpty } from "@/components/section-previews";

export const metadata: Metadata = { title: "Moodboards" };

export default function MoodboardsPage() {
  return (
    <>
      <PageHeader title="Moodboards" intro="Your own wedding magazine: inspiration, notes and colour palettes." />
      <StageNote>Moodboards and image uploads arrive in Phase 3.</StageNote>
      <MoodboardsEmpty />
    </>
  );
}
