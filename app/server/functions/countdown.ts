import 'temporal-polyfill/global'
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../convex/_generated/api";
import { createServerFn } from "@tanstack/react-start";
import { zodValidator } from '@tanstack/zod-adapter'
import { z } from "zod";
import { Id } from "../../../convex/_generated/dataModel";


const convex = new ConvexHttpClient(process.env.VITE_CONVEX_URL!);
// const convex = new ConvexHttpClient(import.meta.env.VITE_CONVEX_URL);

export const countdownSchema = z.object({
    title: z.string().min(1, "Title required"),
    description: z.string().optional(),
    targetDate: z
        .string()
        .transform((val, ctx) => {
            // Coba langsung validasi apakah string ISO valid
            try {
                // Jika sudah ISO valid
                Temporal.Instant.from(val)
                return val
            } catch {
                // Kalau bukan ISO, coba parse pakai Date
                const parsed = new Date(val)
                if (isNaN(parsed.getTime())) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: "Invalid date format",
                    })
                    return z.NEVER
                }
                // Kembalikan ISO string yang valid
                return parsed.toISOString()
            }
        })
        .refine(
            (val) => {
                try {
                    Temporal.Instant.from(val)
                    return true
                } catch {
                    return false
                }
            },
            { message: "Invalid ISO date string" }
        ),
});

export const countdownDocSchema = countdownSchema.extend({
    _id: z.string(),
    _creationTime: z.number(),
});

const deleteSchema = z.object({
    id: z.string(),
});

export type Countdown = z.infer<typeof countdownDocSchema>;
export type CountdownInput = z.infer<typeof countdownSchema>;

export const getCountdowns = createServerFn({ method: "GET" }).handler(async () => {
    const data = await convex.query(api.countdowns.list);
    return data.map(doc => ({
        ...doc,
        _id: doc._id,
    }));
});

export const createCountdown = createServerFn({ method: "POST" })
    .inputValidator(zodValidator(countdownSchema))
    .handler(async ({ data }) => {
        await convex.mutation(api.countdowns.create, data);
        return { success: true };
    });


export const deleteCountdown = createServerFn({ method: "POST" })
    .inputValidator(zodValidator(deleteSchema))
    .handler(async ({ data }) => {
        await convex.mutation(api.countdowns.deletes, {
            _id: data.id as Id<"countdowns">
        });
        return { success: true };
    });