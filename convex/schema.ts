import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export default defineSchema({
  users: defineTable({
    userId: v.string(),
    name: v.string(),
    email: v.string(),
    imageUrl: v.optional(v.string()),
    role: v.string(), // "customer", "admin"
    preferences: v.optional(
      v.object({
        carType: v.optional(v.string()),
        preferredServices: v.optional(v.array(v.string())),
        preferredDays: v.optional(v.array(v.string())),
        preferredTimes: v.optional(v.array(v.string())),
      }),
    ),
  }).index("by_userId", ["userId"]),

  services: defineTable({
    name: v.string(),
    description: v.string(),
    duration: v.number(), // in minutes
    price: v.number(),
    imageUrl: v.optional(v.string()),
    category: v.string(), // "interior", "exterior", "full", etc.
    isActive: v.boolean(),
  }),

  appointments: defineTable({
    userId: v.string(),
    serviceId: v.id("services"),
    date: v.string(), // YYYY-MM-DD
    startTime: v.string(), // HH:MM in 24h format
    endTime: v.string(), // HH:MM in 24h format
    status: v.string(), // "scheduled", "completed", "cancelled"
    notes: v.optional(v.string()),
    carDetails: v.object({
      make: v.string(),
      model: v.string(),
      year: v.string(),
      color: v.optional(v.string()),
    }),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_date", ["date"])
    .index("by_status", ["status"]),

  availability: defineTable({
    date: v.string(), // YYYY-MM-DD
    slots: v.array(
      v.object({
        startTime: v.string(), // HH:MM in 24h format
        endTime: v.string(), // HH:MM in 24h format
        isAvailable: v.boolean(),
      }),
    ),
  }).index("by_date", ["date"]),

  conversations: defineTable({
    userId: v.string(),
    messages: v.array(
      v.object({
        role: v.string(), // "user", "assistant"
        content: v.string(),
        timestamp: v.number(),
      }),
    ),
    appointmentId: v.optional(v.id("appointments")),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_userId", ["userId"]),
})

