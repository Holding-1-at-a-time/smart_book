import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export default defineSchema({
  /**
   * The users table represents a customer of the detailing business.
   * It contains information about the user, such as their name, email, and role.
   * It also contains information about the user's preferences, such as their car type and preferred services.
   * The user's role can be either "customer", "admin", or "detailer".
   */
  users: defineTable({
    organizationId: v.id("organizations"),
    userId: v.string(),
    name: v.string(),
    email: v.string(),
    tokenIdentifier: v.string(),
    imageUrl: v.optional(v.string()),
    role: v.object({ customer: v.boolean(), admin: v.boolean(), detailer: v.boolean() }), // "customer", "admin"
    preferences: v.optional(
      v.object({
        carType: v.optional(v.string()),
        preferredServices: v.optional(v.array(v.string())),
        preferredDays: v.optional(v.array(v.string())),
        preferredTimes: v.optional(v.array(v.string())),
      }),
    ),
    clerkId: v.string(), // new field
    picture: v.optional(v.string()), // new field
    nickname: v.string(), // new field
    userType: v.string(), // new field
    created_at: v.string(), // new field
    given_name: v.string(), // new field
    last_login: v.string(), // new field
    updated_at: v.string(), // new field
    family_name: v.string(), // new field
    loyalty_tier: v.string(), // new field
    phone_number: v.string(), // new field
    special_notes: v.string(), // new field
    email_verified: v.boolean(), // new field
    total_bookings: v.number(), // new field
    default_tenant_id: v.string(), // new field
    userOrganizations: v.array(v.object({ // new field
      organizationId: v.id("organizations"),
      role: v.string(),
    })),
    preferred_language: v.string(), // new field
    vehicle_preferences: v.object({ // new field
      VIN: v.string(),
      make: v.string(),
      year: v.string(),
      color: v.string(),
      model: v.string(),
    }),
    marketing_preferences: v.object({ // new field
      sms_opt_in: v.boolean(),
      email_opt_in: v.boolean(),
    }),
    phone_number_verified: v.boolean(), // new field
    preferred_detailer_id: v.string(), // new field
  })

    .index("by_orgId", ["organizationId"])
    .index("by_userId", ["userId"])
    .index("by_orgId_and_userId", ["organizationId", "userId"])
    .index("by_email_and_tokenIdentifier", ["email", "tokenIdentifier"])
    .index("by_userId_and_token_and_orgId", ["userId", "tokenIdentifier", "organizationId"])
    .index("by_tokenIdentifier", ["tokenIdentifier"])
    .index("by_userId", ["userId"]),

  /**
   * The organizations table represents the many-to-many relationship between users and organizations.
   * A user can belong to multiple organizations, and an organization can have multiple users.
   *
   * @property userId - The ID of the user.
   * @property organizationId - The ID of the organization.
   * @property role - The role of the user in the organization, for example "admin", "detailer", etc.
   */
  organizations: defineTable({
    userId: v.id("users"),
    serviceId: v.id("services"),
    appointmentId: v.id("appointments"),
    tenantId: v.id("tenants"), // new field
    orgEmail: v.string(),
    orgLogoImageUrl: v.optional(v.string()),
    orgAddress: v.optional(v.string()),
    orgPhone: v.optional(v.string()),
    orgDescription: v.optional(v.string()),
    orgIsActive: v.boolean(),
    orgVerified: v.boolean(),
    orgName: v.string(), // new field
    orgRole: v.string(), // new field
    orgSlug: v.string(), // new field
    tenantName: v.string(), // new field
  })
    .index("by_organizationName", ["orgName"])
    .index("by_organizationEmail", ["orgEmail"])
    .index("by_organizationPhone", ["orgPhone"]),

  /**
   * Represents a service offered by an organization.
   *
   * A service is associated with an organization and has a name, description, duration, base price, and an optional image URL.
   * The duration is in minutes and the price is in cents.
   * The category can be one of "interior", "exterior", "full", "paint_Correction", "ceramic_Coating".
   * The service can be active or inactive.
   */
  services: defineTable({
    organizationId: v.id("organizations"),
    userId: v.id("users"),
    tenantId: v.id("tenants"),
    serviceName: v.string(),
    serviceDescription: v.string(),
    duration: v.number(), // in minutes
    basePrice: v.number(),
    imageUrl: v.optional(v.string()),
    category: v.union(v.literal("interior"), v.literal("exterior"), v.literal("full"), v.literal("paint_Correction"), v.literal("ceramic_Coating")),
    isActive: v.boolean(),
  }).index("by_serviceName", ["serviceName"])
    .index("by_basePrice", ["basePrice"])
    .index("by_category", ["category"])
    .index("by_duration", ["duration"])
    .index("by_category", ["category"])
    .index("by_orgId", ["organizationId"]),

  /**
   * Represents an appointment scheduled by a user.
   *
   * An appointment is associated with a user, a service, and an organization.
   * It contains the date, start and end times, and the status of the appointment.
   * The status can be "scheduled", "completed", or "cancelled".
   * Additionally, it contains the car details and any notes left by the user.
   */
  appointments: defineTable({
    organizationId: v.id("organizations"),
    userId: v.id("users"),
    serviceId: v.id("services"),
    tenantId: v.id("tenants"),
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
    .index("by_orgId", ["organizationId"])
    .index("by_userId", ["userId"])
    .index("by_date", ["date"])
    .index("by_status", ["status"]),

  /**
   * Availability represents the availability of a service on a given date.
   * It contains a list of available slots for that date.
   */
  availability: defineTable({
    organizationId: v.id("organizations"),
    serviceId: v.id("services"),
    userId: v.id("users"),
    tenantId: v.id("tenants"),
    appointmentId: v.id("appointments"),
    date: v.string(), // YYYY-MM-DD
    slots: v.array(
      v.object({
        startTime: v.string(), // HH:MM in 24h format
        endTime: v.string(), // HH:MM in 24h format
        isAvailable: v.boolean(),
      }),
    ),
  }).index("by_date", ["date"])
    .index("by_orgId", ["organizationId"]),

  /**
   * Represents the conversations table in the database.
   *
   * A conversation is associated with an organization and a user.
   *
   * @property organizationId - The ID of the organization associated with the conversation.
   * @property userId - The ID of the user associated with the conversation.
   * @property messages - An array of messages in the conversation, with each message containing a role and content.
   * @property appointmentId - The ID of the appointment associated with the conversation, if any.
   * @property createdAt - The timestamp when the conversation was created.
   * @property updatedAt - The timestamp when the conversation was last updated.
   */
  conversations: defineTable({
    organizationId: v.id("organizations"),
    userId: v.id("users"),
    tenantId: v.id("tenants"),
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
  }).index("by_userId", ["userId"])
    .index("by_orgId", ["organizationId"])
    .index("by_appointmentId", ["appointmentId"]),

  /**
   * Represents the tenants table in the database.
   *
   * A tenant is associated with an organization and has unique identifiers.
   *
   * @property organizationId - The ID of the organization associated with the tenant.
   * @property id - The unique identifier for the tenant.
   * @property name - The name of the tenant.
   * @property slug - A URL-friendly version of the tenant's name.
   */
  tenants: defineTable({
    organizationId: v.id("organizations"),
    id: v.string(),
    name: v.string(),
    slug: v.string(),
  }).index("by_orgId", ["organizationId"])
    .index("by_id", ["id"])
    .index("by_slug", ["slug"]),


  /**
   * Represents a many-to-many relationship between users and tenants.
   *
   * A user can belong to multiple tenants, and a tenant can have multiple users.
   *
   * @property userId - The ID of the user.
   * @property tenantId - The ID of the tenant.
   * @property role - The role of the user in the tenant. For example, "admin", "detailer", etc.
   * @property created_at - The timestamp when the user was added to the tenant.
   */
  user_tenants: defineTable({
    userId: v.id("users"),
    organizationId: v.id("organizations"),
    tenantId: v.id("tenants"),
    role: v.string(),
    created_at: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_organizationId", ["organizationId"])
    .index("by_tenantId", ["tenantId"]),

});