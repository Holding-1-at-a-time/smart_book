import { v } from "convex/values";
import { Doc, Id } from "./_generated/dataModel";
import { mutation, query, QueryCtx, MutationCtx } from "./_generated/server";



/**
 * Creates a new service in the database.
 *
 * @param ctx - The Convex mutation context.
 * @param args - The arguments to create a service.
 * @returns A promise that resolves to the created service.
 */
export const createService = mutation({
    args: {
        organizationId: v.id("organizations"),
        serviceId: v.string(),
        serviceName: v.string(),
        serviceDescription: v.string(),
        duration: v.number(), // in minutes
        basePrice: v.number(),
        imageUrl: v.optional(v.string()),
        category: v.union(
            v.literal("interior"),
            v.literal("exterior"),
            v.literal("full"),
            v.literal("paint_Correction"),
            v.literal("ceramic_Coating")
        ),
        isActive: v.boolean(),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("services", args);
    },
});
/**
 * Gets all active services from the database.
 *
 * @param ctx - The Convex query context.
 * @returns A promise that resolves to an array of all active services.
 */
export const getAllActiveServices = query({
    handler: async ( args, ctx) => {
        return await ctx.db.query("services").withIndex("by_orgId", (q) => q.eq("organizationId", args.organizationId)).withIndex("by isActive", (q) => q.eq("isActive", true)).all();
    },
});

/**
 * Retrieves a list of services based on the provided filters.
 *
 * @param ctx - The Convex query context.
 * @param args - The filter arguments.
 * @returns A promise that resolves to a list of services.
 */

/**
 * Gets a service by its ID.
 *
 * @param ctx - The Convex query context.
 * @param args - The service ID.
 * @returns A promise that resolves to the service.
 */
/**
 * Gets a service by its ID.
 *
 * @param ctx - The Convex query context.
 * @param args - The service ID.
 * @returns A promise that resolves to the service.
 */

export const getServiceById = query({
    args: {
        serviceId: v.string(),
    },
    handler: async (ctx: QueryCtx, args: { serviceId: Id<"services"> }): Promise<Doc<"services"> | null> => {
        const result = await ctx.db.get(args.serviceId);
        if (!result) {
            throw new Error(`Service with ID ${args.serviceId} not found`);
        }
        return result;
    },
});

/**
 * Updates a service in the database.
 *
 * @param ctx - The Convex mutation context.
 * @param args - The service ID and the fields to update.
 * @returns A promise that resolves to the updated service.
 */
export const updateService = mutation({
    args: {
        /**
         * The ID of the service to update.
         */
        serviceId: v.id("services"),
        /**
         * The name of the service.
         */
        name: v.optional(v.string()),
        /**
         * The description of the service.
         */
        description: v.optional(v.string()),
        /**
         * The duration of the service in minutes.
         */
        duration: v.optional(v.number()),
        /**
         * The price of the service in dollars.
         */
        price: v.optional(v.number()),
        /**
         * The image URL for the service.
         */
        imageUrl: v.optional(v.string()),
        /**
         * The category of the service.
         */
        category: v.optional(v.string()),
        /**
         * Whether the service is active or not.
         */
        isActive: v.optional(v.boolean()),
    },
    handler: async (ctx: MutationCtx, args: { serviceId: Id<"services">; name?: string; description?: string; duration?: number; price?: number; imageUrl?: string; category?: string; isActive?: boolean }): Promise<unknown> => {
        const { serviceId, ...fields } = args;

        // Define the allowed categories
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const allowedCategories = ["interior", "exterior", "full", "paint_Correction", "ceramic_Coating"] as const;

        // Use a type guard to ensure the category is one of the allowed values
        const category = fields.category as typeof allowedCategories[number] | undefined;

        return ctx.db.patch(serviceId, { ...fields, category });
    },
});