import type { Metadata } from "next";
import { photoAvailability } from "@/lib/photo-availability";
import { Onboarding } from "./onboarding";

export const metadata: Metadata = { title: "Start planning" };

export default function OnboardingPage() {
  return <Onboarding photos={photoAvailability()} />;
}
