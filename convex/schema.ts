import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  scholarships: defineTable({
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
  }),
});
