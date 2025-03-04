"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useMutation, useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useUser } from "@clerk/clerk-react"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { AppointmentCalendar } from "@/components/calendar/appointment-calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const formSchema = z.object({
    serviceId: z.string(),
    make: z.string().min(1, "Car make is required"),
    model: z.string().min(1, "Car model is required"),
    year: z.string().min(1, "Car year is required"),
    color: z.string().optional(),
    notes: z.string().optional(),
    date: z.string(),
    startTime: z.string(),
    endTime: z.string(),
})

type FormValues = z.infer<typeof formSchema>

export function AppointmentForm() {
    const { user } = useUser()
    const { toast } = useToast()
    const [step, setStep] = useState(1)

    const services = useQuery(api.services.getAllServices) || []
    const createAppointment = useMutation(api.appointments.createAppointment)

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            serviceId: "",
            make: "",
            model: "",
            year: "",
            color: "",
            notes: "",
            date: "",
            startTime: "",
            endTime: "",
        },
    })

    const handleSelectSlot = (date: string, startTime: string, endTime: string) => {
        form.setValue("date", date)
        form.setValue("startTime", startTime)
        form.setValue("endTime", endTime)
        setStep(2)
    }

    const onSubmit = async (data: FormValues) => {
        if (!user) {
            toast({
                title: "Error",
                description: "You must be logged in to book an appointment",
                variant: "destructive",
            })
            return
        }

        try {
            await createAppointment({
                userId: user.id,
                serviceId: data.serviceId as any,
                date: data.date,
                startTime: data.startTime,
                endTime: data.endTime,
                notes: data.notes,
                carDetails: {
                    make: data.make,
                    model: data.model,
                    year: data.year,
                    color: data.color,
                },
            })

            toast({
                title: "Success",
                description: "Your appointment has been scheduled",
            })

            form.reset()
            setStep(1)
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to schedule appointment. Please try again.",
                variant: "destructive",
            })
        }
    }

    return (
        <div className="space-y-6">
            {step === 1 ? (
                <AppointmentCalendar onSelectSlot={handleSelectSlot} />
            ) : (
                <Card>
                    <CardHeader>
                        <CardTitle>Complete Your Booking</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="serviceId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Service</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a service" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {services.map((service) => (
                                                        <SelectItem key={service._id} value={service._id}>
                                                            {service.name} - ${service.price}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="make"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Car Make</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Toyota" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="model"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Car Model</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Camry" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="year"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Car Year</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="2020" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="color"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Car Color (Optional)</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Black" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name="notes"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Additional Notes (Optional)</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="Any special requests or information" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="flex justify-between">
                                    <Button type="button" variant="outline" onClick={() => setStep(1)}>
                                        Back
                                    </Button>
                                    <Button type="submit">Book Appointment</Button>
                                </div>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}

