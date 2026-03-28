"use node";

import { v } from "convex/values";
import { action } from "./_generated/server";
import { api } from "./_generated/api";

export interface ScholarshipResult {
  title: string;
  url: string;
  summary: string;
  matchPercent: number;
  deadline: string | null;
}

const DEMO_FALLBACK: ScholarshipResult[] = [
  {
    title: "National Scholarship Portal — Top central schemes",
    url: "https://scholarships.gov.in",
    summary:
      "India’s one-stop portal for national and state scholarships — great starting point for students across the country.",
    matchPercent: 93,
    deadline: "March 31, 2026",
  },
  {
    title: "National Means-cum-Merit Scholarship (NMMSS)",
    url: "https://scholarships.gov.in",
    summary:
      "For students with family income below ₹3.5L/year — supports continuation of secondary education nationwide.",
    matchPercent: 85,
    deadline: "April 15, 2026",
  },
  {
    title: "Central Sector Scheme of Scholarships for College & University",
    url: "https://scholarships.gov.in",
    summary:
      "Merit-based aid for higher education — check eligibility by income and course anywhere in India.",
    matchPercent: 78,
    deadline: "May 1, 2026",
  },
];

function buildStudentProfile(args: {
  district: string;
  course: string;
  income?: string;
}): string {
  const incomePart = args.income?.trim()
    ? args.income.trim()
    : "not disclosed";
  return `Student based in or near: ${args.district}. Field of study / level: ${args.course}. Annual family income: ${incomePart}.`;
}

async function callExa(
  district: string,
  course: string
): Promise<{ ok: boolean; context: string }> {
  const apiKey = process.env.EXA_API_KEY;
  if (!apiKey) {
    return { ok: false, context: "" };
  }
  const queryText = `scholarship grant funding students India ${district} ${course} 2025 2026 government college school merit`;
  const res = await fetch("https://api.exa.ai/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
    },
    body: JSON.stringify({
      query: queryText,
      numResults: 6,
      useAutoprompt: true,
      contents: {
        text: {
          maxCharacters: 800,
        },
      },
    }),
  });
  if (!res.ok) {
    return { ok: false, context: "" };
  }
  const data = (await res.json()) as {
    results?: Array<{
      title?: string;
      url?: string;
      text?: string;
    }>;
  };
  const results = data.results ?? [];
  const context = results
    .map((r) => {
      const rec = r as Record<string, unknown>;
      const text =
        typeof rec.text === "string"
          ? rec.text
          : typeof rec.content === "string"
            ? rec.content
            : "";
      return JSON.stringify({
        title: r.title ?? "",
        url: r.url ?? "",
        text,
      });
    })
    .join("\n");
  return { ok: true, context };
}

function stripJsonFence(text: string): string {
  const t = text.trim();
  if (t.startsWith("```")) {
    return t.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
  }
  return t;
}

function clampMatchPercent(n: number): number {
  if (Number.isNaN(n)) return 75;
  return Math.min(99, Math.max(50, Math.round(n)));
}

/** Parses model output; keeps 1–3 valid rows (relaxed bounds vs. rejecting the whole response). */
function parseOpenAIResults(raw: string): ScholarshipResult[] | null {
  const cleaned = stripJsonFence(raw);
  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    return null;
  }
  if (!Array.isArray(parsed)) {
    return null;
  }
  const out: ScholarshipResult[] = [];
  for (const item of parsed) {
    if (!item || typeof item !== "object") continue;
    const o = item as Record<string, unknown>;
    const title = typeof o.title === "string" ? o.title : null;
    const url = typeof o.url === "string" ? o.url : null;
    const summary = typeof o.summary === "string" ? o.summary : null;
    const rawPct =
      typeof o.matchPercent === "number"
        ? o.matchPercent
        : typeof o.matchPercent === "string"
          ? parseFloat(o.matchPercent)
          : NaN;
    let deadline: string | null = null;
    if (o.deadline === null || o.deadline === undefined) {
      deadline = null;
    } else if (typeof o.deadline === "string") {
      deadline = o.deadline;
    }
    if (!title?.trim() || !url?.trim() || !summary?.trim()) {
      continue;
    }
    out.push({
      title: title.trim(),
      url: url.trim(),
      summary: summary.trim(),
      matchPercent: clampMatchPercent(rawPct),
      deadline,
    });
    if (out.length >= 3) break;
  }
  return out.length > 0 ? out : null;
}

/** Always return exactly 3 cards: AI hits first, then pad from demo without duplicate URLs. */
function mergeWithDemoFallback(ai: ScholarshipResult[] | null): ScholarshipResult[] {
  const seen = new Set<string>();
  const out: ScholarshipResult[] = [];
  for (const row of ai ?? []) {
    if (out.length >= 3) break;
    if (seen.has(row.url)) continue;
    seen.add(row.url);
    out.push(row);
  }
  for (const row of DEMO_FALLBACK) {
    if (out.length >= 3) break;
    if (seen.has(row.url)) continue;
    seen.add(row.url);
    out.push(row);
  }
  return out.slice(0, 3);
}

async function callOpenAI(
  studentProfile: string,
  exaContext: string
): Promise<ScholarshipResult[] | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return null;
  }
  const userPrompt = `Given the student profile and these search results, return a JSON array of exactly the 3 best matching scholarships. Schemes may be India-focused or international — pick what best fits the student's location and course.

Student profile:
${studentProfile}

Search results (from web):
${exaContext || "(none)"}

Return ONLY a JSON array (no markdown, no prose) of exactly 3 objects. Each object must have:
- title: string
- url: string (prefer URLs from search results; otherwise a plausible official URL)
- summary: string (one sentence explaining why it fits this student)
- matchPercent: number between 50 and 99 (integer)
- deadline: string or null`;

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      temperature: 0.35,
      messages: [
        {
          role: "system",
          content:
            "You respond with only valid JSON: an array of exactly 3 scholarship objects. No markdown fences.",
        },
        { role: "user", content: userPrompt },
      ],
    }),
  });
  if (!res.ok) {
    return null;
  }
  const data = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const content = data.choices?.[0]?.message?.content;
  if (!content || typeof content !== "string") {
    return null;
  }
  const parsed = parseOpenAIResults(content);
  return parsed;
}

export const findScholarships = action({
  args: {
    district: v.string(),
    course: v.string(),
    income: v.optional(v.string()),
  },
  handler: async (ctx, args): Promise<ScholarshipResult[]> => {
    const studentProfile = buildStudentProfile(args);
    let exaContext = "";
    try {
      const exa = await callExa(args.district, args.course);
      if (exa.ok) {
        exaContext = exa.context;
      }
    } catch {
      exaContext = "";
    }

    let aiResults: ScholarshipResult[] | null = null;
    try {
      aiResults = await callOpenAI(studentProfile, exaContext);
    } catch {
      aiResults = null;
    }

    const finalResults = mergeWithDemoFallback(aiResults);

    try {
      await ctx.runMutation(api.scholarshipRecords.saveResults, {
        studentProfile,
        district: args.district,
        course: args.course,
        income: args.income,
        results: finalResults,
        createdAt: Date.now(),
      });
    } catch {
      // Saving history must not fail the search — user still gets results.
    }

    return finalResults;
  },
});
