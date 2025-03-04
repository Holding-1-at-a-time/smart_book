import { AppointmentList } from "@/components/appointments/appointment-list"
import { ChatInterface } from "@/components/ai/chat-interface"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CalendarDays, MessageSquare, Car, Sparkles } from "lucide-react"

export default function DashboardPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 space-y-6">
                    <Card className="bg-gradient-to-br from-primary/20 to-background border-primary/20">
                        <CardHeader>
                            <CardTitle className="text-2xl">Welcome to Auto Detailing Scheduler</CardTitle>
                            <CardDescription>Manage your appointments and get your car looking its best</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col sm:flex-row gap-4">
                            <Button asChild className="flex gap-2">
                                <Link href="/book">
                                    <CalendarDays className="h-4 w-4" />
                                    Book Appointment
                                </Link>
                            </Button>
                            <Button asChild variant="outline" className="flex gap-2">
                                <Link href="/services">
                                    <Car className="h-4 w-4" />
                                    View Services
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>

                    <AppointmentList />
                </div>
                <div className="w-full md:w-[400px]">
                    <Card className="h-full">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <MessageSquare className="h-5 w-5" />
                                AI Assistant
                            </CardTitle>
                            <CardDescription>Ask questions about our services or get help scheduling</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ChatInterface />
                        </CardContent>
                    </Card>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-primary" />
                        Featured Services
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg">Full Detail</CardTitle>
                                <CardDescription>$250</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    Complete interior and exterior detailing for a showroom finish
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg">Ceramic Coating</CardTitle>
                                <CardDescription>$500</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">Long-lasting protection with a brilliant shine</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg">Interior Detail</CardTitle>
                                <CardDescription>$150</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">Deep cleaning of all interior surfaces and upholstery</p>
                            </CardContent>
                        </Card>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

