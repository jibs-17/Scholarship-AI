"use client";

import { normalizeExternalUrl } from "@/lib/url";
import { FileText, Loader2 } from "lucide-react";
import { useId, useState } from "react";

type ApplyScholarshipFormProps = {
  scholarshipTitle: string;
  officialUrl: string;
  /** Wider spacing and section headings for the standalone apply page */
  variant?: "page" | "compact";
};

export function ApplyScholarshipForm({
  scholarshipTitle,
  officialUrl,
  variant = "compact",
}: ApplyScholarshipFormProps) {
  const titleId = useId();
  const formId = useId();
  const [step, setStep] = useState<"form" | "success">("form");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [tenthMarks, setTenthMarks] = useState("");
  const [marksCardFile, setMarksCardFile] = useState<File | null>(null);
  const [incomeProof, setIncomeProof] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const safeUrl = normalizeExternalUrl(officialUrl);
  const isPage = variant === "page";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!fullName.trim() || !email.trim()) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 650));
    setSubmitting(false);
    setStep("success");
  }

  function openOfficialSite() {
    window.open(safeUrl, "_blank", "noopener,noreferrer");
  }

  const fieldClass =
    "w-full rounded-xl border border-slate-200 px-3 py-2.5 text-base outline-none ring-brand-navy/15 focus:border-brand-mist focus:ring-2 md:text-sm";
  const labelClass = "mb-1.5 block text-sm font-semibold text-brand-navy";

  if (step === "success") {
    return (
      <div
        className={
          isPage
            ? "rounded-3xl border-4 border-sky-200 bg-gradient-to-b from-white to-amber-50/40 p-8 shadow-playful md:p-10"
            : "space-y-4 px-5 py-8 text-center"
        }
      >
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-sky-200 to-violet-200 text-3xl shadow-inner">
          🌟
        </div>
        <p
          id={titleId}
          className="text-lg font-extrabold leading-relaxed text-brand-navy md:text-xl"
        >
          We’ll keep searching scholarships for you — you’ll be contacted when
          we find something new!
        </p>
        <p className="text-sm font-semibold text-slate-600">
          (Demo: in a real app we’d save this safely and message you or your
          parents.)
        </p>
        <div className="flex flex-col gap-3 pt-4 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={openOfficialSite}
            className="rounded-full bg-gradient-to-r from-brand-gold to-brand-gold-deep px-6 py-3 text-sm font-bold text-white shadow-gold-glow"
          >
            Continue on official site
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={
        isPage
          ? "rounded-3xl border-4 border-sky-200 bg-gradient-to-b from-white to-amber-50/40 shadow-playful"
          : ""
      }
    >
      <div
        className={
          isPage
            ? "border-b-2 border-sky-100 bg-gradient-to-r from-sky-50/80 to-violet-50/80 px-6 py-5 md:px-8"
            : "flex items-start justify-between gap-3 border-b-2 border-sky-100 bg-gradient-to-r from-sky-50/80 to-violet-50/80 px-5 py-4"
        }
      >
        <div>
          <h2
            id={titleId}
            className="text-xl font-extrabold text-brand-navy md:text-2xl"
          >
            📝 Tell us about you
          </h2>
          <p className="mt-2 text-sm font-semibold text-slate-600 md:text-base">
            {scholarshipTitle}
          </p>
        </div>
      </div>

      <form
        id={formId}
        onSubmit={handleSubmit}
        className={isPage ? "space-y-8 px-6 py-8 md:px-8 md:py-10" : "space-y-4 px-5 py-5"}
      >
        <p
          className="text-sm font-semibold leading-relaxed text-slate-600 md:text-base"
          id={`${formId}-intro`}
        >
          Ask a grown-up to help if you need. Fill each section at your own pace
          — you can still open the real scholarship website anytime below.
        </p>

        <fieldset className="space-y-4 rounded-2xl border-2 border-violet-100 bg-white/60 p-4 md:p-5">
          <legend className="px-1 text-sm font-extrabold uppercase tracking-wide text-violet-800">
            Contact
          </legend>

          <div>
            <label htmlFor="apply-name" className={labelClass}>
              Full name <span className="text-red-600">*</span>
            </label>
            <input
              id="apply-name"
              name="fullName"
              required
              autoComplete="name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className={fieldClass}
              placeholder="As on your marks sheet"
              aria-required="true"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="apply-email" className={labelClass}>
                Email <span className="text-red-600">*</span>
              </label>
              <input
                id="apply-email"
                name="email"
                type="email"
                required
                autoComplete="email"
                inputMode="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={fieldClass}
                placeholder="you@example.com"
                aria-required="true"
              />
            </div>
            <div>
              <label htmlFor="apply-phone" className={labelClass}>
                Phone (WhatsApp)
              </label>
              <input
                id="apply-phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                inputMode="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={fieldClass}
                placeholder="+91 …"
              />
            </div>
          </div>
        </fieldset>

        <fieldset className="space-y-4 rounded-2xl border-2 border-sky-100 bg-white/60 p-4 md:p-5">
          <legend className="px-1 text-sm font-extrabold uppercase tracking-wide text-sky-800">
            Academic
          </legend>
          <div>
            <label htmlFor="apply-10th" className={labelClass}>
              Class 10th marks / CGPA
            </label>
            <input
              id="apply-10th"
              name="tenthMarks"
              value={tenthMarks}
              onChange={(e) => setTenthMarks(e.target.value)}
              className={fieldClass}
              placeholder="e.g. 92% or 9.2 CGPA"
              autoComplete="off"
            />
          </div>
        </fieldset>

        <fieldset className="space-y-4 rounded-2xl border-2 border-amber-100 bg-white/60 p-4 md:p-5">
          <legend className="px-1 text-sm font-extrabold uppercase tracking-wide text-amber-900">
            Documents
          </legend>

          <div>
            <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-brand-navy">
              <FileText className="h-4 w-4 text-brand-mist" aria-hidden />
              10th marks card (PDF / image)
            </span>
            <label className="flex cursor-pointer flex-col rounded-xl border-2 border-dashed border-brand-mist/40 bg-brand-mist/5 px-4 py-6 text-center transition hover:border-brand-mist hover:bg-brand-mist/10">
              <input
                type="file"
                name="marksCard"
                accept=".pdf,image/*"
                className="sr-only"
                onChange={(e) =>
                  setMarksCardFile(e.target.files?.[0] ?? null)
                }
              />
              <span className="text-sm font-medium text-brand-navy">
                {marksCardFile ? marksCardFile.name : "Tap to upload"}
              </span>
              <span className="mt-1 text-xs text-slate-500">
                Optional for this demo — helps us verify eligibility later
              </span>
            </label>
          </div>

          <div>
            <span className="mb-2 block text-sm font-semibold text-brand-navy">
              Income certificate (if applicable)
            </span>
            <label className="flex cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm text-brand-navy transition hover:bg-white">
              <input
                type="file"
                name="incomeProof"
                accept=".pdf,image/*"
                className="sr-only"
                onChange={(e) =>
                  setIncomeProof(e.target.files?.[0] ?? null)
                }
              />
              {incomeProof
                ? incomeProof.name
                : "Upload income proof (optional)"}
            </label>
          </div>
        </fieldset>

        <div className="flex flex-col gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={openOfficialSite}
            className="order-2 rounded-full border border-brand-mist/50 px-5 py-3 text-sm font-semibold text-brand-navy transition hover:bg-slate-50 sm:order-1"
          >
            Open official portal
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="order-1 inline-flex items-center justify-center gap-2 rounded-full bg-btn-fun px-6 py-3.5 text-base font-extrabold text-white shadow-playful transition hover:brightness-105 disabled:opacity-70 sm:order-2"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                Saving…
              </>
            ) : (
              "✅ Send & keep me posted"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
