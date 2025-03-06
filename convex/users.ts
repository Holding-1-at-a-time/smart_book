import { v } from "convex/values";
import { mutation, MutationCtx, query, QueryCtx } from "./_generated/server";


/**
 * Creates a new user in the database, with a default role of Detailer.
 *
 * @param ctx - The Convex mutation context.
 * @param args - The arguments to create a user:
 *   - `userId`: the ID of the user
 *   - `name`: the name of the user
 *   - `email`: the email of the user
 *   - `imageUrl`: the image URL of the user (optional, default `null`)
 * @returns The ID of the created user.
 */
export const createUser = mutation({
    args: {
        userId: v.id("users"),
        organizationId: v.id("organizations"),
        tenantId: v.id("tenants"),
        name: v.string(),
        email: v.string(),
        imageUrl: v.optional(v.string()),
        vehiclePreferences: v.array(v.string()),
        marketingPreferences: v.array(v.string()),
    },
    handler: async (ctx, args) => {
        const userExists = await ctx.db.query("users").withIndex("by_userId", q => q.eq("userId", args.userId)).first();
        if (userExists) {
            throw new Error("User already exists");
        }

        const now = new Date().toISOString();
        return ctx.db.insert("users", {
            userId: "" + args.userId,
            name: args.name,
            email: args.email,
            organizationId: args.organizationId,
            tokenIdentifier: "",
            role: { customer: true, admin: false, detailer: false },
            clerkId: "",
            nickname: "",
            userType: "",
            created_at: now,
            given_name: args.name.split(' ')[0] || "",
            last_login: "",
            updated_at: now,
            family_name: args.name.split(' ').slice(1).join(' ') || "",
            loyalty_tier: "",
            phone_number: "",
            special_notes: "",
            email_verified: false,
            total_bookings: 0,
            default_tenant_id: "",
            userOrganizations: [],
            preferred_language: "",
            phone_number_verified: false,
            preferred_detailer_id: "",
            vehicle_preferences: (function() {
                if (!args.vehiclePreferences || args.vehiclePreferences.length !== 5) {
                    throw new Error("Expected vehiclePreferences array to contain exactly 5 elements");
                }
                return {
                    VIN: args.vehiclePreferences[0],
                    make: args.vehiclePreferences[1],
                    year: args.vehiclePreferences[2],
                    color: args.vehiclePreferences[3],
                    model: args.vehiclePreferences[4],
                };
            })(),
            marketing_preferences: {
                sms_opt_in: false,
                email_opt_in: false,
            },
        });
    },
});


export const getCurrentUserId = query({
    args: {
        organizationId: v.id("organizations"),
        userId: v.id("users"),
    },
    /**
     * Returns the ID of the user with the given `userId`.
     *
     * @param ctx - The Convex query context.
     * @param userId - The ID of the user to retrieve.
     * @returns The ID of the user, or `null` if no user is found.
     */
    handler: async (ctx: QueryCtx, { userId }: { userId: string }): Promise<string | null> => {
        const user = await ctx.db
            .query("users")
            .withIndex("by_userId", (q) => q.eq("userId", userId))
            .first();
        return user ? user.userId : null;
    },
});

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

    handler: async (ctx: MutationCtx, args: { userId: string; preferences: unknown }) => { // Add types
        const user = await ctx.db
            .query("users")
            .withIndex("by_userId", (q) => q.eq("userId", args.userId)) // Use args.userId
            .first()

        if (!user) {
            throw new Error("User not found")
        }

        return await ctx.db.patch(user._id, { // Use await
        })
    },
});
