"use client"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

interface TimeSlot {
    startTime: string
    endTime: string
    isAvailable: boolean
}

interface TimeSlotsProps {
    date: string
    availability: TimeSlot[]
    onSelectSlot: (startTime: string, endTime: string) => void
}

export function TimeSlots({ date, availability, onSelectSlot }: TimeSlotsProps) {
    // Format time from 24h to 12h format
    const formatTime = (time: string) => {
        const [hours, minutes] = time.split(":")
        const hour = Number.parseInt(hours, 10)
        const ampm = hour >= 12 ? "PM" : "AM"
        const formattedHour = hour % 12 || 12
        return `${formattedHour}:${minutes} ${ampm}`
    }

    if (!availability || availability.length === 0) {
        return <div className="text-center p-4 text-muted-foreground">No available slots for this date</div>
    }

    return (
        <div className="space-y-4">
            <h3 className="font-medium">Available Time Slots</h3>
            <ScrollArea className="h-[300px] pr-4">
                <div className="grid grid-cols-1 gap-2">
                    {availability.map((slot, index) => (
                        <Button
                            key={index}
                            variant={slot.isAvailable ? "outline" : "ghost"}
                            disabled={!slot.isAvailable}
                            onClick={() => onSelectSlot(slot.startTime, slot.endTime)}
                            className={`justify-start h-auto py-3 ${slot.isAvailable ? "hover:bg-primary/10" : ""}`}
                        >
                            <div className="flex flex-col items-start">
                                <span>
                                    {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                                </span>
                                <span className="text-xs text-muted-foreground">{slot.isAvailable ? "Available" : "Booked"}</span>
                            </div>
                        </Button>
                    ))}
                </div>
            </ScrollArea>
        </div>
    )
}

