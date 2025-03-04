import { AppointmentForm } from "@/components/forms/appointment-form"
import { ChatInterface } from "@/components/ai/chat-interface"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare } from "lucide-react"

export default function BookPage() {
    return (
        <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
                <AppointmentForm />
            </div>
            <div className="w-full md:w-[400px]">
                <Card className="h-full">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <MessageSquare className="h-5 w-5" />
                            Need Help?
                        </CardTitle>
                        <CardDescription>Our AI assistant can help you choose the right service</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChatInterface />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

