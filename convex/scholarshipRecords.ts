import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const saveResults = mutation({
  args: {
    studentProfile: v.string(),
    district: v.string(),
    course: v.string(),
    income: v.optional(v.string()),
    results: v.array(
      v.object({
        title: v.string(),
        url: v.string(),
        summary: v.string(),
        matchPercent: v.number(),
        deadline: v.union(v.string(), v.null()),
      })
    ),
    createdAt: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("scholarships", {
      studentProfile: args.studentProfile,
      district: args.district,
      course: args.course,
      income: args.income,
      results: args.results,
      createdAt: args.createdAt,
    });
  },
});

export const getHistory = query({
  args: {},
  handler: async (ctx) => {
    const rows = await ctx.db.query("scholarships").collect();
    rows.sort((a, b) => b.createdAt - a.createdAt);
    return rows.slice(0, 10);
  },
});

/** Extra matches from past saved searches (by URL), excluding URLs already shown. */
export const getAdditionalScholarships = query({
  args: {
    excludeUrls: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const exclude = new Set(args.excludeUrls);
    const rows = await ctx.db.query("scholarships").collect();
    rows.sort((a, b) => b.createdAt - a.createdAt);

    const out: Array<{
      title: string;
      url: string;
      summary: string;
      matchPercent: number;
      deadline: string | null;
    }> = [];
    const seen = new Set<string>(exclude);

    for (const row of rows) {
      for (const r of row.results) {
        if (seen.has(r.url)) continue;
        seen.add(r.url);
        out.push({
          title: r.title,
          url: r.url,
          summary: r.summary,
          matchPercent: r.matchPercent,
          deadline: r.deadline,
        });
        if (out.length >= 6) {
          return out;
        }
      }
    }
    return out;
  },
});
