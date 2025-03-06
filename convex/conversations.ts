import { v } from "convex/values"
import { mutation, query, QueryCtx } from "./_generated/server"
import { Doc, Id } from "./_generated/dataModel"

export const createConversation = mutation({
    args: {
        userId: v.id("users"),
        organizationId: v.id("organizations"),
        tenantId: v.id("tenants"),
        initialMessage: v.string(),
        appointmentId: (v.id("appointments")),
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
            tenantId: args.tenantId,
            initialMessage: "",
            messageRead: false,
            messageSent: false,
            messageReceived: false,
            organizationId: args.organizationId,
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
    args: { userId: v.id("users") },
    handler: async (ctx: QueryCtx, args: { userId: Id<"users"> }): Promise<Doc<"conversations">[]> => {
        return ctx.db.query("conversations")
            .withIndex("by_user", q => q.eq("userId", args.userId))
            .order("desc")
            .collect();
    },
});


