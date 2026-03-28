"use client";

import type { ScholarshipResult } from "@/lib/types";
import { normalizeExternalUrl } from "@/lib/url";
import { CalendarDays, Sparkles } from "lucide-react";
import Link from "next/link";

function matchBadgeClass(percent: number): string {
  if (percent >= 85) {
    return "bg-gradient-to-r from-amber-100 to-yellow-100 text-violet-900 ring-2 ring-amber-300";
  }
  if (percent >= 70) {
    return "bg-sky-100 text-brand-navy ring-2 ring-sky-200";
  }
  return "bg-slate-100 text-slate-700 ring-2 ring-slate-200";
}

interface ScholarshipCardProps {
  scholarship: ScholarshipResult;
  /** e.g. "Quick pick" while loading, "Your match" when personalized */
  resultLabel?: string;
}

export function ScholarshipCard({
  scholarship,
  resultLabel,
}: ScholarshipCardProps) {
  const { title, url, summary, matchPercent, deadline } = scholarship;
  const safeUrl = normalizeExternalUrl(url);
  const applyHref = `/apply?title=${encodeURIComponent(title)}&url=${encodeURIComponent(safeUrl)}`;

  return (
    <article
      className="group relative flex h-full flex-col overflow-hidden rounded-3xl border-4 border-white bg-gradient-to-br from-white via-sky-50/40 to-violet-50/50 p-5 shadow-playful transition duration-200 hover:-translate-y-1 hover:shadow-lg md:p-6"
    >
      <div className="pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full bg-gradient-to-br from-sky-200/40 to-pink-200/40 blur-2xl transition group-hover:opacity-80" />
      {resultLabel ? (
        <div className="relative mb-1">
          <span className="inline-flex rounded-full bg-gradient-to-r from-amber-100 via-yellow-50 to-amber-100 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-amber-900 shadow-sm ring-1 ring-amber-200/80">
            {resultLabel}
          </span>
        </div>
      ) : null}
      <div className="relative flex flex-wrap items-start justify-between gap-3">
        <h3 className="max-w-[85%] text-lg font-extrabold leading-snug tracking-tight text-brand-navy md:text-xl">
          {title}
        </h3>
        <span
          className={`inline-flex shrink-0 items-center rounded-full px-3 py-1 text-xs font-extrabold ${matchBadgeClass(matchPercent)}`}
        >
          ⭐ {matchPercent}% match
        </span>
      </div>

      <div className="relative mt-4 rounded-2xl border-2 border-dashed border-violet-200 bg-white/80 px-4 py-3">
        <div className="mb-1 flex items-center gap-2 text-xs font-extrabold uppercase tracking-wide text-violet-700">
          <Sparkles className="h-4 w-4 text-amber-500" aria-hidden />
          Smart summary
        </div>
        <p className="text-sm font-semibold leading-relaxed text-slate-700">
          {summary}
        </p>
      </div>

      {deadline ? (
        <div className="relative mt-3 flex items-center gap-2 text-sm font-bold text-slate-600">
          <CalendarDays className="h-4 w-4 shrink-0 text-sky-500" />
          <span>
            <span className="text-brand-navy">Last date:</span> {deadline}
          </span>
        </div>
      ) : null}

      <div className="relative mt-5 flex flex-1 flex-col justify-end gap-2">
        <Link
          href={applyHref}
          className="inline-flex w-full items-center justify-center rounded-full bg-btn-fun px-4 py-3.5 text-center text-base font-extrabold text-white shadow-playful transition hover:-translate-y-0.5 hover:brightness-105"
        >
          🎉 Let’s apply!
        </Link>
        <a
          href={safeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-center text-xs font-extrabold text-violet-600 underline-offset-2 hover:underline"
        >
          Visit the official website
        </a>
      </div>
    </article>
  );
}
