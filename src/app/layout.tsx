import type { Metadata } from "next";
import { DM_Mono, Instrument_Sans } from "next/font/google";
import "./globals.css";

const instrumentSans = Instrument_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

const dmMono = DM_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Specs or Wearability? | Aidan O'Driscoll",
  description: "What separates loved wearables from regretted ones: an analysis of Amazon reviews of fitness trackers and smartwatches.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${instrumentSans.variable} ${dmMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
