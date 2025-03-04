import { v } from "convex/values"
import { mutation, query } from "./_generated/server"

export const createUser = mutation({
    args: {
        userId: v.string(),
        name: v.string(),
        email: v.string(),
        imageUrl: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const existingUser = await ctx.db
            .query("users")
            .withIndex("by_userId", (q) => q.eq("userId", args.userId))
            .first()

        if (existingUser) {
            return existingUser._id
        }

        return ctx.db.insert("users", {
            userId: args.userId,
            name: args.name,
            email: args.email,
            imageUrl: args.imageUrl,
            role: "customer", // Default role
        })
    },
})

export const getUser = query({
    args: { userId: v.string() },
    handler: async (ctx, args) => {
        return ctx.db
            .query("users")
            .withIndex("by_userId", (q) => q.eq("userId", args.userId))
            .first()
    },
})

export const updateUserPreferences = mutation({
    args: {
        userId: v.string(),
        preferences: v.object({
            carType: v.optional(v.string()),
            preferredServices: v.optional(v.array(v.string())),
            preferredDays: v.optional(v.array(v.string())),
            preferredTimes: v.optional(v.array(v.string())),
        }),
    },
    handler: async (ctx, args) => {
        const user = await ctx.db
            .query("users")
            .withIndex("by_userId", (q) => q.eq("userId", args.userId))
            .first()

        if (!user) {
            throw new Error("User not found")
        }

        return ctx.db.patch(user._id, {
            preferences: args.preferences,
        })
    },
})

