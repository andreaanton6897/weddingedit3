import type { Metadata } from "next";
import { PageHeader } from "@/components/page-bits";
import { SettingsView } from "./settings-view";

export const metadata: Metadata = { title: "Settings" };

export default function SettingsPage() {
  return (
    <>
      <PageHeader title="Settings" intro="Your wedding preferences, regional settings and data." />
      <SettingsView />
    </>
  );
}
