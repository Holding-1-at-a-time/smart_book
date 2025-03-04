import { v } from "convex/values"
import { mutation, query } from "./_generated/server"

export const createAppointment = mutation({
    args: {
        userId: v.string(),
        serviceId: v.id("services"),
        date: v.string(),
        startTime: v.string(),
        endTime: v.string(),
        notes: v.optional(v.string()),
        carDetails: v.object({
            make: v.string(),
            model: v.string(),
            year: v.string(),
            color: v.optional(v.string()),
        }),
    },
    handler: async (ctx, args) => {
        // Check if the slot is available
        const availability = await ctx.db
            .query("availability")
            .withIndex("by_date", (q) => q.eq("date", args.date))
            .first()

        if (!availability) {
            throw new Error("No availability for this date")
        }

        const slot = availability.slots.find(
            (slot) => slot.startTime === args.startTime && slot.endTime === args.endTime && slot.isAvailable,
        )

        if (!slot) {
            throw new Error("This time slot is not available")
        }

        // Create the appointment
        const appointmentId = await ctx.db.insert("appointments", {
            userId: args.userId,
            serviceId: args.serviceId,
            date: args.date,
            startTime: args.startTime,
            endTime: args.endTime,
            status: "scheduled",
            notes: args.notes,
            carDetails: args.carDetails,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        })

        // Update the availability
        const updatedSlots = availability.slots.map((slot) => {
            if (slot.startTime === args.startTime && slot.endTime === args.endTime) {
                return { ...slot, isAvailable: false }
            }
            return slot
        })

        await ctx.db.patch(availability._id, {
            slots: updatedSlots,
        })

        return appointmentId
    },
})

export const getUserAppointments = query({
    args: { userId: v.string() },
    handler: async (ctx, args) => {
        return ctx.db
            .query("appointments")
            .withIndex("by_userId", (q) => q.eq("userId", args.userId))
            .collect()
    },
})

export const getAppointmentsByDate = query({
    args: { date: v.string() },
    handler: async (ctx, args) => {
        return ctx.db
            .query("appointments")
            .withIndex("by_date", (q) => q.eq("date", args.date))
            .collect()
    },
})

export const updateAppointmentStatus = mutation({
    args: {
        appointmentId: v.id("appointments"),
        status: v.string(),
    },
    handler: async (ctx, args) => {
        return ctx.db.patch(args.appointmentId, {
            status: args.status,
            updatedAt: Date.now(),
        })
    },
})

export const cancelAppointment = mutation({
    args: {
        appointmentId: v.id("appointments"),
    },
    handler: async (ctx, args) => {
        const appointment = await ctx.db.get(args.appointmentId)

        if (!appointment) {
            throw new Error("Appointment not found")
        }

        // Update appointment status
        await ctx.db.patch(args.appointmentId, {
            status: "cancelled",
            updatedAt: Date.now(),
        })

        // Make the slot available again
        const availability = await ctx.db
            .query("availability")
            .withIndex("by_date", (q) => q.eq("date", appointment.date))
            .first()

        if (availability) {
            const updatedSlots = availability.slots.map((slot) => {
                if (slot.startTime === appointment.startTime && slot.endTime === appointment.endTime) {
                    return { ...slot, isAvailable: true }
                }
                return slot
            })

            await ctx.db.patch(availability._id, {
                slots: updatedSlots,
            })
        }

        return args.appointmentId
    },
})

