"use client";

import { SearchForm, type SearchFormValues } from "@/components/SearchForm";
import { ScholarshipCard } from "@/components/ScholarshipCard";
import { SCHOLARSHIP_DEMO_FALLBACK } from "@/lib/fallbackScholarships";
import type { ScholarshipResult } from "@/lib/types";
import { api } from "@/convex/_generated/api";
import { useAction, useQuery } from "convex/react";
import { BrandLogo } from "@/components/BrandLogo";
import { SharePublicLink } from "@/components/SharePublicLink";
import { Loader2, Sparkles } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

const PREVIEW_STAGGER_MS = [80, 380, 720] as const;
/** After personalized results land, wait this long then ask Convex for more from history. */
const EXTRAS_DELAY_MS = 1200;

export default function HomePage() {
  const findScholarships = useAction(api.scholarships.findScholarships);

  const [loading, setLoading] = useState(false);
  /** Personalized rows from the server — when set, replaces preview */
  const [finalResults, setFinalResults] = useState<ScholarshipResult[] | null>(
    null
  );
  /** How many quick-preview cards to show (1–3) while the API runs */
  const [previewCount, setPreviewCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  /** Unlocks Convex `getAdditionalScholarships` after a short pause once we have AI results. */
  const [extrasReady, setExtrasReady] = useState(false);

  const timerRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    if (!finalResults?.length) {
      setExtrasReady(false);
      return;
    }
    const id = setTimeout(() => setExtrasReady(true), EXTRAS_DELAY_MS);
    return () => clearTimeout(id);
  }, [finalResults]);

  const additionalScholarships = useQuery(
    api.scholarshipRecords.getAdditionalScholarships,
    extrasReady && finalResults && finalResults.length > 0
      ? { excludeUrls: finalResults.map((r) => r.url) }
      : "skip"
  );

  const clearStaggerTimers = useCallback(() => {
    timerRef.current.forEach(clearTimeout);
    timerRef.current = [];
  }, []);

  async function handleSearch(values: SearchFormValues) {
    clearStaggerTimers();
    setError(null);
    setFinalResults(null);
    setPreviewCount(0);
    setLoading(true);

    PREVIEW_STAGGER_MS.forEach((delay, i) => {
      const id = setTimeout(() => {
        setPreviewCount(i + 1);
      }, delay);
      timerRef.current.push(id);
    });

    try {
      const incomeOpt =
        values.income.trim() === "" ? undefined : values.income.trim();
      const rows = await findScholarships({
        district: values.district,
        course: values.course,
        income: incomeOpt,
      });
      clearStaggerTimers();
      setFinalResults(rows);
    } catch (e) {
      console.error("findScholarships failed:", e);
      clearStaggerTimers();
      setPreviewCount(3);
      setError(
        "Showing quick ideas below while we reconnect — your personalized list will be back soon."
      );
      setFinalResults(null);
    } finally {
      setLoading(false);
    }
  }

  const showGrid = previewCount > 0 || (finalResults && finalResults.length > 0);
  const baseList: ScholarshipResult[] =
    finalResults && finalResults.length > 0
      ? finalResults
      : SCHOLARSHIP_DEMO_FALLBACK.slice(0, previewCount);
  const displayList: ScholarshipResult[] =
    finalResults && finalResults.length > 0 && additionalScholarships
      ? [...baseList, ...additionalScholarships]
      : baseList;
  const isPreviewMode = !finalResults || finalResults.length === 0;
  const loadingMoreFromConvex =
    Boolean(finalResults?.length) &&
    extrasReady &&
    additionalScholarships === undefined;

  return (
    <main className="mx-auto max-w-6xl px-4 pb-28 pt-6 md:px-6 md:pt-10">
      <section className="mb-10 text-center md:mb-12">
        <div className="mx-auto mb-5 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 -m-8 animate-pulse rounded-full bg-gradient-to-r from-sky-200/40 via-violet-200/40 to-amber-200/40 blur-2xl" />
            <div className="relative motion-safe:animate-wiggle">
              <BrandLogo size="lg" priority className="relative" />
            </div>
          </div>
        </div>

        <div className="mb-3 inline-flex items-center gap-2 rounded-full border-2 border-white bg-gradient-to-r from-sky-50 via-violet-50 to-amber-50 px-4 py-2 text-xs font-extrabold text-brand-navy shadow-playful">
          <Sparkles className="h-4 w-4 text-amber-500" aria-hidden />
          For students everywhere · Scholarships made simple
        </div>
        <h1 className="text-balance bg-gradient-to-r from-brand-navy via-violet-700 to-sky-600 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent md:text-5xl">
          ScholarShip AI
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-lg font-bold text-slate-700 md:text-xl">
          Your friendly scholarship finder — type where you are &amp; what you
          love to study!
        </p>
        <p className="mx-auto mt-2 max-w-lg text-base font-semibold text-slate-500">
          🎓 No boring forms first — we search for you. Parents can help too!
        </p>
      </section>

      <div className="mx-auto flex max-w-xl justify-center">
        <SearchForm onSubmit={handleSearch} loading={loading} />
      </div>

      <SharePublicLink />

      {error ? (
        <p
          className="mx-auto mt-6 max-w-xl rounded-2xl border-2 border-amber-200 bg-amber-50/90 px-4 py-3 text-center text-sm font-bold text-amber-900"
          role="alert"
        >
          {error}
        </p>
      ) : null}

      {loading && previewCount >= 1 && isPreviewMode ? (
        <div
          className="mx-auto mt-8 flex max-w-2xl items-center justify-center gap-2 rounded-2xl border-2 border-violet-200 bg-violet-50/90 px-4 py-3 text-sm font-bold text-violet-900 shadow-sm"
          role="status"
          aria-live="polite"
        >
          <Loader2 className="h-5 w-5 shrink-0 animate-spin text-violet-600" />
          Sharpening your full list — hang tight…
        </div>
      ) : null}

      {loadingMoreFromConvex ? (
        <div
          className="mx-auto mt-6 flex max-w-2xl items-center justify-center gap-2 rounded-2xl border-2 border-sky-200 bg-sky-50/90 px-4 py-3 text-sm font-bold text-sky-900 shadow-sm"
          role="status"
          aria-live="polite"
        >
          <Loader2 className="h-5 w-5 shrink-0 animate-spin text-sky-600" />
          Loading more from your saved searches…
        </div>
      ) : null}

      <section className="mt-8 md:mt-10">
        <h2 className="sr-only">Scholarship results</h2>
        {showGrid ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {displayList.map((s, idx) => {
              const isExtra =
                !isPreviewMode &&
                finalResults &&
                idx >= finalResults.length;
              return (
                <div
                  key={`${isPreviewMode ? "p" : "f"}-${idx}-${s.title}-${s.url}`}
                  className="motion-safe:animate-card-in"
                  style={{ animationDelay: `${idx * 70}ms` }}
                >
                  <ScholarshipCard
                    scholarship={s}
                    resultLabel={
                      isPreviewMode
                        ? "⚡ Quick pick"
                        : isExtra
                          ? "📚 From your past searches"
                          : "✨ Matched for you"
                    }
                  />
                </div>
              );
            })}
          </div>
        ) : (
          <div className="mx-auto max-w-lg rounded-3xl border-4 border-dashed border-sky-200 bg-white/80 px-6 py-10 text-center shadow-playful">
            <p className="text-lg font-bold text-brand-navy">
              Ready when you are!
            </p>
            <p className="mt-2 text-base font-semibold leading-relaxed text-slate-600">
              Tell us your{" "}
              <span className="text-violet-600">city or town</span> and your{" "}
              <span className="text-sky-600">dream course</span>, then tap the
              rainbow button to see matches.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
