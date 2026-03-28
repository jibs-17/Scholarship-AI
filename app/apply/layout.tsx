import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Apply | ScholarShip AI",
  description:
    "Fill in your details to get started with your scholarship application — clear labels and a calm, full-page form.",
};

export default function ApplyLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
