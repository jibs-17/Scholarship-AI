import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { BrandLogo } from "@/components/BrandLogo";
import { PoweredBy } from "@/components/PoweredBy";
import { getPublicSiteUrl } from "@/lib/siteUrl";

const nunito = Nunito({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-nunito",
});

const siteUrl = getPublicSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "ScholarShip AI | Scholarships for every student",
  description:
    "Discover scholarships that match you — quick, friendly, and built for students everywhere.",
  openGraph: {
    title: "ScholarShip AI | Scholarships for every student",
    description:
      "Discover scholarships that match you — quick, friendly, and built for students everywhere.",
    url: siteUrl,
    siteName: "ScholarShip AI",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/scholarship-logo.png",
        width: 512,
        height: 512,
        alt: "ScholarShip AI",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ScholarShip AI",
    description:
      "Discover scholarships that match you — quick, friendly, and built for students everywhere.",
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={nunito.variable}>
      <body
        className={`min-h-screen bg-page-gradient font-sans text-slate-900 antialiased ${nunito.className}`}
      >
        <header className="sticky top-0 z-30 border-b border-brand-mist/20 bg-white/90 shadow-sm backdrop-blur-md">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 md:px-6 md:py-4">
            <div className="flex min-w-0 items-center gap-3">
              <BrandLogo size="sm" priority />
              <div className="min-w-0 leading-tight">
                <span className="block truncate text-lg font-extrabold tracking-tight text-brand-navy md:text-xl">
                  ScholarShip AI
                </span>
                <span className="hidden text-xs font-semibold text-brand-mist sm:block">
                  Big dreams, little forms ✨
                </span>
              </div>
            </div>
            <span className="shrink-0 rounded-full bg-gradient-to-r from-sky-100 via-violet-100 to-amber-100 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wide text-brand-navy shadow-sm ring-2 ring-white sm:text-[11px] md:text-xs">
              Built for Cursor Hackathon 2026
            </span>
          </div>
        </header>
        <Providers>{children}</Providers>
        <PoweredBy />
      </body>
    </html>
  );
}
