import { v } from "convex/values"
import { mutation, query } from "./_generated/server"

export const createUser = mutation {
    args: {
        userId: string;
name: string;
email: string;
imageUrl ?: string | null;
},
},
/**
 * Creates a new user in the database, with a default role of Detailer.
 *
 * @param ctx - The Convex mutation context.
 * @param args - The arguments to create a user: `userId`, `name`, `email`, and `imageUrl` (optional).
 * @returns The ID of the created user.
 */
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
        imageUrl: args.imageUrl ?? null,
        role: "Detailer" as const, // Default role
        userOrganizations: [] as Array<{
            organizationId: string;
            role: string;
        }>,
        preferredLanguage: "" as const,
        preferredVehicle: {
            VIN: "" as const;
            make: "" as const;
            model: "" as const;
            year: "" as const;
            color: "" as const;
        },
        marketingPreferences: {
            smsOptIn: false as const;
            emailOptIn: false as const;
        },
        phoneNumberVerified: false as const,
        preferredDetailerId: null as string | null,
    }).then((user) => user._id)
    /**
     * Creates a new user in the database, with a default role of Detailer.
     *
     * @param ctx - The Convex mutation context.
     * @param args - The arguments to create a user.
     * @returns The ID of the created user.
     */

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

