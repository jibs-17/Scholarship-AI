"use client";

import { BookOpen, IndianRupee, Loader2, MapPin } from "lucide-react";
import { FormEvent, useState } from "react";

export interface SearchFormValues {
  district: string;
  course: string;
  income: string;
}

interface SearchFormProps {
  onSubmit: (values: SearchFormValues) => void;
  loading: boolean;
}

export function SearchForm({ onSubmit, loading }: SearchFormProps) {
  const [district, setDistrict] = useState("");
  const [course, setCourse] = useState("");
  const [income, setIncome] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!district.trim() || !course.trim() || loading) return;
    onSubmit({
      district: district.trim(),
      course: course.trim(),
      income: income.trim(),
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-xl rounded-3xl border-4 border-white bg-gradient-to-br from-amber-50/90 via-white to-sky-50/90 p-6 shadow-playful md:p-8"
    >
      <p className="mb-5 text-center text-sm font-bold text-brand-navy">
        Answer 2 quick things — then we go search for you! 🚀
      </p>
      <div className="space-y-5">
        <div>
          <label
            htmlFor="district"
            className="mb-2 flex items-center gap-2 text-sm font-extrabold text-brand-navy"
          >
            <MapPin className="h-4 w-4 text-sky-500" aria-hidden />
            City or area
          </label>
          <p className="mb-1.5 text-xs font-semibold text-slate-500">
            Where you study or live (any country is OK!)
          </p>
          <input
            id="district"
            name="district"
            type="text"
            required
            autoComplete="address-level2"
            placeholder="e.g. Mumbai, Nairobi, London…"
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            className="w-full rounded-2xl border-2 border-sky-100 bg-white/90 px-4 py-3.5 text-base font-semibold text-slate-800 outline-none ring-violet-200 transition placeholder:font-normal placeholder:text-slate-400 focus:border-violet-300 focus:ring-4"
          />
        </div>

        <div>
          <label
            htmlFor="course"
            className="mb-2 flex items-center gap-2 text-sm font-extrabold text-brand-navy"
          >
            <BookOpen className="h-4 w-4 text-violet-500" aria-hidden />
            What do you want to study?
          </label>
          <input
            id="course"
            name="course"
            type="text"
            required
            placeholder="e.g. Class 10, Science, B.Com, coding…"
            value={course}
            onChange={(e) => setCourse(e.target.value)}
            className="w-full rounded-2xl border-2 border-violet-100 bg-white/90 px-4 py-3.5 text-base font-semibold text-slate-800 outline-none ring-violet-200 transition placeholder:font-normal placeholder:text-slate-400 focus:border-sky-300 focus:ring-4"
          />
        </div>

        <div>
          <label
            htmlFor="income"
            className="mb-2 flex items-center gap-2 text-sm font-extrabold text-brand-navy"
          >
            <IndianRupee className="h-4 w-4 text-amber-500" aria-hidden />
            Family income (optional)
          </label>
          <p className="mb-1.5 text-xs font-semibold text-slate-500">
            Helps find need-based awards — skip if you’re not sure
          </p>
          <input
            id="income"
            name="income"
            type="text"
            autoComplete="off"
            placeholder="e.g. ₹2,40,000 / year"
            value={income}
            onChange={(e) => setIncome(e.target.value)}
            className="w-full rounded-2xl border-2 border-amber-100 bg-white/90 px-4 py-3.5 text-base font-semibold text-slate-800 outline-none ring-amber-100 transition placeholder:font-normal placeholder:text-slate-400 focus:border-amber-300 focus:ring-4"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-btn-fun py-4 text-base font-extrabold text-white shadow-playful transition hover:-translate-y-1 hover:brightness-105 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
        >
          {loading ? (
            <>
              <Loader2 className="h-6 w-6 animate-spin" aria-hidden />
              Hunting for scholarships…
            </>
          ) : (
            <>🌈 Find scholarships for me!</>
          )}
        </button>
      </div>
    </form>
  );
}
