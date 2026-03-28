"use client";

import { Check, Link2 } from "lucide-react";
import { useCallback, useState } from "react";

/** Copies the current page URL (works on Vercel and any public host). */
export function SharePublicLink() {
  const [copied, setCopied] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const copy = useCallback(async () => {
    setErr(null);
    try {
      const url =
        typeof window !== "undefined"
          ? `${window.location.origin}${window.location.pathname}`
          : "";
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setErr("Could not copy — try selecting the address bar instead.");
    }
  }, []);

  return (
    <div className="mx-auto mt-6 flex max-w-xl flex-col items-center gap-2">
      <button
        type="button"
        onClick={copy}
        className="inline-flex items-center gap-2 rounded-full border-2 border-violet-200 bg-white/90 px-4 py-2 text-sm font-extrabold text-violet-800 shadow-sm transition hover:border-violet-300 hover:bg-violet-50/80"
      >
        {copied ? (
          <>
            <Check className="h-4 w-4 text-emerald-600" aria-hidden />
            Link copied
          </>
        ) : (
          <>
            <Link2 className="h-4 w-4" aria-hidden />
            Copy link to share
          </>
        )}
      </button>
      {err ? (
        <p className="text-center text-xs font-semibold text-amber-800">{err}</p>
      ) : null}
      <p className="text-center text-[11px] font-semibold text-slate-500">
        Share this page publicly — anyone with the link can use ScholarShip AI.
      </p>
    </div>
  );
}
