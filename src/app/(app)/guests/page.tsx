import type { Metadata } from "next";
import { PageHeader, StageNote } from "@/components/page-bits";
import { GuestsEmpty } from "@/components/section-previews";

export const metadata: Metadata = { title: "Guests" };

export default function GuestsPage() {
  return (
    <>
      <PageHeader title="Guests" intro="Households, RSVPs and the details that help everyone enjoy the day." />
      <StageNote>The guest list and RSVP manager arrive in Phase 3.</StageNote>
      <GuestsEmpty />
    </>
  );
}
