import { AppointmentList } from "@/components/appointments/appointment-list"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CalendarPlus } from "lucide-react"

export default function AppointmentsPage() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">My Appointments</h1>
                <Button asChild>
                    <Link href="/book" className="flex items-center gap-2">
                        <CalendarPlus className="h-4 w-4" />
                        New Appointment
                    </Link>
                </Button>
            </div>
            <AppointmentList />
        </div>
    )
}

