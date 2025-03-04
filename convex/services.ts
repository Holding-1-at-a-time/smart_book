import { v } from "convex/values"
import { mutation, query } from "./_generated/server"

export const createService = mutation({
    args: {
        name: v.string(),
        description: v.string(),
        duration: v.number(),
        price: v.number(),
        imageUrl: v.optional(v.string()),
        category: v.string(),
    },
    handler: async (ctx, args) => {
        return ctx.db.insert("services", {
            ...args,
            isActive: true,
        })
    },
})

export const getAllServices = query({
    handler: async (ctx) => {
        return ctx.db
            .query("services")
            .filter((q) => q.eq(q.field("isActive"), true))
            .collect()
    },
})

export const getServiceById = query({
    args: { serviceId: v.id("services") },
    handler: async (ctx, args) => {
        return ctx.db.get(args.serviceId)
    },
})

export const updateService = mutation({
    args: {
        serviceId: v.id("services"),
        name: v.optional(v.string()),
        description: v.optional(v.string()),
        duration: v.optional(v.number()),
        price: v.optional(v.number()),
        imageUrl: v.optional(v.string()),
        category: v.optional(v.string()),
        isActive: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        const { serviceId, ...fields } = args
        return ctx.db.patch(serviceId, fields)
    },
})

