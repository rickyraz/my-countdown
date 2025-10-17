import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    tasks: defineTable({
        text: v.string(),
        isCompleted: v.boolean(),
        _creationTime: v.number(),
    }),
    countdowns: defineTable({
        title: v.string(),
        description: v.optional(v.string()),
        targetDate: v.string(),
        createdAt: v.string(),
        updatedAt: v.string(),
    }),
    
});