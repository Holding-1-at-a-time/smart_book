import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { mutation, MutationCtx, query } from "./_generated/server";

/**
 * Creates a new appointment in the database.
 *
 * @param ctx - The Convex mutation context.
 * @param args - The arguments to create an appointment:
 *   - `userId`: the ID of the user making the appointment
 *   - `serviceId`: the ID of the service booked
 *   - `organizationId`: the ID of the organization offering the service
 *   - `tenantId`: the ID of the tenant associated with the organization
 *   - `date`: the date of the appointment
 *   - `startTime`: the start time of the appointment
 *   - `endTime`: the end time of the appointment
 *   - `notes`: any notes left by the user
 *   - `carDetails`: the details of the car
 * @returns The ID of the created appointment.
 */
export const createAppointment = mutation({
    args: {
        userId: v.id("users"),
        serviceId: v.id("services"),
        organizationId: v.id("organizations"),
        tenantId: v.id("tenants"),
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
    /**
     * Handler for the mutation.
     *
     * @param ctx - The Convex mutation context.
     * @param args - The arguments to create an appointment.
     * @returns The ID of the created appointment.
     */
    handler: async (ctx: MutationCtx, args: {
        userId: Id<"users">;
        serviceId: Id<"services">;
        organizationId: Id<"organizations">;
        tenantId: Id<"tenants">;
        date: string;
        startTime: string;
        endTime: string;
        notes?: string | undefined;
        carDetails: {
            make: string;
            model: string;
            year: string;
            color?: string | undefined;
        };
    }): Promise<Id<"appointments">> => {
        // Find the availability for the given date
        const availability = await ctx.db.query("availability").filter(q => q.eq("date", args.date)).first();

        if (!availability) {
            // If no availability is found, throw an error
            throw new Error("No availability for this date");
        }

        // Find the index of the time slot in the availability
        const slotIndex = availability.slots.findIndex(
            (slot) => slot.startTime === args.startTime && slot.endTime === args.endTime && slot.isAvailable,
        );

        if (slotIndex === -1) {
            // If the time slot is not found or is not available, throw an error
            throw new Error("This time slot is not available");
        }

        // Create the appointment
        const appointmentId = await ctx.db.insert("appointments", {
            userId: args.userId,
            serviceId: args.serviceId,
            organizationId: args.organizationId,
            tenantId: args.tenantId,
            date: args.date,
            startTime: args.startTime,
            endTime: args.endTime,
            status: "scheduled",
            notes: args.notes,
            carDetails: args.carDetails,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        });

        // Update the availability to mark the time slot as unavailable
        const updatedSlots = [...availability.slots];
        updatedSlots[slotIndex] = { ...updatedSlots[slotIndex], isAvailable: false };
        await ctx.db.patch(availability._id, { slots: updatedSlots });

        // Return the ID of the created appointment
        return appointmentId;
    },
},
);

/**
 * Retrieves all appointments for a given user.
 * 
 * @param ctx - The Convex query context.
 * @param args - The arguments containing the user ID, organization ID, and tenant ID.
 * @returns A list of appointments for the given user.
 */
export const getUserAppointments = query({
    args: {
        userId: v.id("users"),
        organizationId: v.id("organizations"),
        tenantId: v.id("tenants"),
        status: v.union(
            v.literal("scheduled"),
            v.literal("completed"),
            v.literal("cancelled"),
        ),
    },
    /**
     * Handler for the query.
     * 
     * @param ctx - The Convex query context.
     * @param args - The arguments containing the user ID, organization ID, and tenant ID.
     * @returns A list of appointments for the given user.
     */
    handler: async (ctx, args) => {
        let query = ctx.db.query("appointments")
            .withIndex("by_user", (q) => q.eq("userId", args.userId));

        // Filter by status if provided
        if (args.status) {
            query = query.filter(q => q.eq("status", args.status));
        }

        // Return the list of appointments
        return query.collect();
    },
})


export const getAppointmentsByDate = query({
    args: {
        date: v.string(),
        status: v.optional(v.union(
            v.literal("scheduled"),
            v.literal("completed"),
            v.literal("cancelled"),
        )),
    },
    /**
     * Retrieves appointments for a given date and optional status.
     * 
     * @param ctx - The Convex query context.
     * @param args - The arguments containing the date and optional status.
     * @throws Will throw an error if the date is invalid.
     * @returns A promise that resolves to the list of appointments.
     */
    handler: async (ctx, args) => {
        // Check if the date is valid
        const date = new Date(args.date);
        if (isNaN(date.getTime())) {
            throw new Error("Invalid date");
        }

        // Query appointments by date
        let query = ctx.db
            .query("appointments")
            .withIndex("by_date", (q) => q.eq("date", args.date));

        // Filter by status if provided
        if (args.status) {
            query = query.filter(q => q.eq("status", args.status));
        }

        return query.collect();
    },
})


/**
 * Updates the status of an appointment in the database.
 * 
 * @param ctx - The Convex mutation context.
 * @param args - The arguments for updating the appointment status:
 *   - `appointmentId`: The ID of the appointment to update.
 *   - `status`: The new status of the appointment ("scheduled", "cancelled", "completed").
 * @returns A promise that resolves when the appointment status is updated.
 */
export const updateAppointmentStatus = mutation({
    args: {
        appointmentId: v.id("appointments"),
        status: v.union(v.literal("scheduled"), v.literal("cancelled"), v.literal("completed")),
    },
    handler: async (ctx, args) => {
        // Retrieve the appointment from the database
        const appointment = await ctx.db.get(args.appointmentId);
        if (!appointment) {
            throw new Error("Appointment not found");
        }
        // Check if the appointment is already cancelled or completed
        if (appointment.status === "cancelled" || appointment.status === "completed") {
            throw new Error("Appointment is already cancelled or completed");
        }
        // Update the status of the appointment
        return ctx.db.patch(args.appointmentId, {
            status: args.status,
            updatedAt: Date.now(),
        });
    },
});

/**
 * Cancels an appointment and makes the slot available again.
 *
 * @param appointmentId - The ID of the appointment to cancel.
 * @returns The ID of the cancelled appointment.
 */
export const cancelAppointment = mutation({
    args: {
        appointmentId: v.id("appointments"),
    },
    handler: async (ctx, args) => {
        // Get the appointment
        const appointment = await ctx.db.get(args.appointmentId);

        if (!appointment) {
            throw new Error("Appointment not found");
        }

        // Update appointment status
        await ctx.db.patch(args.appointmentId, {
            status: "cancelled",
            updatedAt: Date.now(),
        });

        // Make the slot available again
        const availability = await ctx.db
            .query("availability")
            .withIndex("by_date", (q) => q.eq("date", appointment.date))
            .first();

        if (availability) {
            // Update the availability slots
            const updatedSlots = availability.slots.map((slot) => {
                if (slot.startTime === appointment.startTime && slot.endTime === appointment.endTime) {
                    return { ...slot, isAvailable: true };
                }
                return slot;
            });

            await ctx.db.patch(availability._id, {
                slots: updatedSlots,
            });
        }

        return args.appointmentId;
    },
});

