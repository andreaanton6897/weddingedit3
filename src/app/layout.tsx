import type { Metadata, Viewport } from "next";
import "@fontsource-variable/bodoni-moda/opsz.css";
import "@fontsource-variable/bodoni-moda/opsz-italic.css";
import "@fontsource-variable/hanken-grotesk";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "The Wedding Edit — Your wedding, beautifully organised",
    template: "%s · The Wedding Edit",
  },
  description:
    "A beautiful, practical wedding planning platform: your budget, checklist, suppliers, guests, calendar, moodboards and wedding-day schedule in one place.",
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
