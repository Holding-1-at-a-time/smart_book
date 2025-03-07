"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { TimeSlots } from "./time-slots"
import { format } from "date-fns"

interface AppointmentCalendarProps {
    onSelectSlot: (date: string, startTime: string, endTime: string) => void
}


export function AppointmentCalendar({ onSelectSlot }: AppointmentCalendarProps) {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
    const formattedDate = selectedDate ? format(selectedDate, "yyyy-MM-dd") : ""

    const availability = useQuery(api.availability.getAvailabilityByDate, {
        date: formattedDate,
    })

    const handleDateSelect = (date: Date | undefined) => {
        setSelectedDate(date)
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Schedule an Appointment</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                    <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={handleDateSelect}
                        className="rounded-md border"
                        disabled={(date) => {
                            // Disable past dates and Sundays
                            return date < new Date(new Date().setHours(0, 0, 0, 0)) || date.getDay() === 0
                        }}
                    />
                </div>
                <div className="flex-1">
                    {selectedDate ? (
                        <TimeSlots
                            date={formattedDate}
                            availability={availability?.slots || []}
                            onSelectSlot={(startTime, endTime) => {
                                onSelectSlot(formattedDate, startTime, endTime)
                            }}
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full text-muted-foreground">
                            Select a date to view available time slots
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}

