"use client"

import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useUser } from "@clerk/clerk-react"
import { format } from "date-fns"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"

export function AppointmentList() {
    const { user } = useUser()
    const { toast } = useToast()
    const [appointmentToCancel, setAppointmentToCancel] = useState<string | null>(null)

    const appointments = useQuery(api.appointments.getUserAppointments, {
        userId: user?.id || "",
    })

    const services = useQuery(api.services.getAllServices)
    const cancelAppointment = useMutation(api.appointments.cancelAppointment)

    const getServiceName = (serviceId: string) => {
        const service = services?.find((s) => s._id === serviceId)
        return service?.name || "Unknown Service"
    }

    const handleCancelAppointment = async () => {
        if (!appointmentToCancel) return

        try {
            await cancelAppointment({
                appointmentId: appointmentToCancel as any,
            })

            toast({
                title: "Success",
                description: "Your appointment has been cancelled",
            })
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to cancel appointment",
                variant: "destructive",
            })
        } finally {
            setAppointmentToCancel(null)
        }
    }

    const formatDateTime = (date: string, time: string) => {
        const [hours, minutes] = time.split(":")
        const dateObj = new Date(date)
        dateObj.setHours(Number.parseInt(hours), Number.parseInt(minutes))
        return format(dateObj, "MMM d, yyyy 'at' h:mm a")
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "scheduled":
                return <Badge className="bg-primary">Scheduled</Badge>
            case "completed":
                return <Badge className="bg-green-600">Completed</Badge>
            case "cancelled":
                return <Badge variant="destructive">Cancelled</Badge>
            default:
                return <Badge variant="outline">{status}</Badge>
        }
    }

    if (!appointments || appointments.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>My Appointments</CardTitle>
                    <CardDescription>You don't have any appointments scheduled</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex justify-center p-6">
                        <p className="text-muted-foreground">Book your first appointment to get started</p>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>My Appointments</CardTitle>
                <CardDescription>Manage your upcoming and past appointments</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Service</TableHead>
                            <TableHead>Date & Time</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {appointments.map((appointment) => (
                            <TableRow key={appointment._id}>
                                <TableCell className="font-medium">{getServiceName(appointment.serviceId)}</TableCell>
                                <TableCell>{formatDateTime(appointment.date, appointment.startTime)}</TableCell>
                                <TableCell>{getStatusBadge(appointment.status)}</TableCell>
                                <TableCell>
                                    {appointment.status === "scheduled" && (
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="destructive" size="sm" onClick={() => setAppointmentToCancel(appointment._id)}>
                                                    Cancel
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Cancel Appointment</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Are you sure you want to cancel this appointment? This action cannot be undone.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Go Back</AlertDialogCancel>
                                                    <AlertDialogAction onClick={handleCancelAppointment}>Confirm</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}

