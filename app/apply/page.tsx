"use client";

import { ApplyScholarshipForm } from "@/components/ApplyScholarshipForm";
import { BrandLogo } from "@/components/BrandLogo";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { ArrowLeft } from "lucide-react";

function ApplyPageContent() {
  const searchParams = useSearchParams();
  const title = searchParams.get("title")?.trim() ?? "";
  const url = searchParams.get("url")?.trim() ?? "";

  if (!title || !url) {
    return (
      <main className="mx-auto max-w-2xl px-4 pb-24 pt-10 md:px-6">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm font-extrabold text-violet-700 underline-offset-4 hover:underline"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back to ScholarShip AI
        </Link>
        <div className="rounded-3xl border-4 border-amber-200 bg-amber-50/90 p-8 text-center shadow-playful">
          <p className="text-lg font-extrabold text-brand-navy">
            We need a scholarship to apply for
          </p>
          <p className="mt-2 text-sm font-semibold text-slate-600">
            Search from the home page and tap &quot;Let&apos;s apply!&quot; on a
            card — or pick a scholarship first.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-4 pb-28 pt-8 md:px-6 md:pt-12">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-2 text-sm font-extrabold text-violet-700 underline-offset-4 hover:underline"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Back to search
      </Link>

      <div className="mb-8 text-center md:mb-10">
        <div className="mb-4 flex justify-center">
          <BrandLogo size="md" />
        </div>
        <h1 className="text-balance text-3xl font-extrabold tracking-tight text-brand-navy md:text-4xl">
          Apply for this scholarship
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-base font-semibold text-slate-600 md:text-lg">
          Take your time — every field has a clear label. Required items are
          marked with <span className="text-red-600">*</span>.
        </p>
      </div>

      <ApplyScholarshipForm
        scholarshipTitle={title}
        officialUrl={url}
        variant="page"
      />
    </main>
  );
}

export default function ApplyPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto max-w-3xl px-4 py-16 text-center text-sm font-semibold text-slate-600">
          Loading application form…
        </main>
      }
    >
      <ApplyPageContent />
    </Suspense>
  );
}
