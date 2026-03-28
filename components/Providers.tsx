"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ReactNode, useMemo } from "react";

export function Providers({ children }: { children: ReactNode }) {
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL?.trim();

  const client = useMemo(() => {
    if (!convexUrl) return null;
    return new ConvexReactClient(convexUrl);
  }, [convexUrl]);

  if (!convexUrl || !client) {
    return (
      <main className="mx-auto max-w-lg px-4 py-16 text-center md:py-24">
        <p className="text-lg font-extrabold text-brand-navy">
          Backend not connected
        </p>
        <p className="mt-3 text-sm font-semibold leading-relaxed text-slate-600">
          Add{" "}
          <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs text-brand-navy">
            NEXT_PUBLIC_CONVEX_URL
          </code>{" "}
          to your environment (from{" "}
          <code className="rounded bg-slate-100 px-1 font-mono text-xs">
            npx convex dev
          </code>{" "}
          or the Convex dashboard), then restart or redeploy. Scholarships load
          through Convex actions.
        </p>
      </main>
    );
  }

  return <ConvexProvider client={client}>{children}</ConvexProvider>;
}
