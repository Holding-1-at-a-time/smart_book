import { v } from "convex/values"
import { mutation, query } from "./_generated/server"

export const createConversation = mutation({
    args: {
        userId: v.string(),
        initialMessage: v.string(),
        appointmentId: v.optional(v.id("appointments")),
    },
    handler: async (ctx, args) => {
        return ctx.db.insert("conversations", {
            userId: args.userId,
            messages: [
                {
                    role: "user",
                    content: args.initialMessage,
                    timestamp: Date.now(),
                },
            ],
            appointmentId: args.appointmentId,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        })
    },
})

export const addMessageToConversation = mutation({
    args: {
        conversationId: v.id("conversations"),
        role: v.string(),
        content: v.string(),
    },
    handler: async (ctx, args) => {
        const conversation = await ctx.db.get(args.conversationId)

        if (!conversation) {
            throw new Error("Conversation not found")
        }

        const updatedMessages = [
            ...conversation.messages,
            {
                role: args.role,
                content: args.content,
                timestamp: Date.now(),
            },
        ]

        return ctx.db.patch(args.conversationId, {
            messages: updatedMessages,
            updatedAt: Date.now(),
        })
    },
})

export const getUserConversations = query({
    args: { userId: v.string() },
    handler: async (ctx, args) => {
        return ctx.db
            .query("conversations")
            .withIndex("by_userId", (q) => q.eq("userId", args.userId))
            .collect()
    },
})

