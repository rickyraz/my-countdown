import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const create = mutation({
    args: {
        title: v.string(),
        description: v.optional(v.string()),
        targetDate: v.string(),
    },
    handler: async (ctx, args) => {
        const now = new Date().toISOString();
        // const validated = countdownSchema.parse(args); //  The package "node:async_hooks" wasn't found on the file system but is built into node.

        return await ctx.db.insert("countdowns", {
            ...args,
            createdAt: now,
            updatedAt: now,
        });
    },
});

export const deletes = mutation({
    args: {
        _id: v.id("countdowns"),
        // _id: v.string(),
    },
    handler: async (ctx, args) => {
        return await ctx.db.delete(args._id);
        // return await ctx.db.delete(args._id as Id<"countdowns"> );
    },
});

export const list = query({
    handler: async (ctx) => {
        return await ctx.db.query("countdowns").collect();
    },
});