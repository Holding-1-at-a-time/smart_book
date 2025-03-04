import { ChatInterface } from "@/components/ai/chat-interface"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare } from "lucide-react"

export default function ChatPage() {
    return (
        <div className="max-w-4xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <MessageSquare className="h-5 w-5 text-primary" />
                        Chat with DetailBot
                    </CardTitle>
                    <CardDescription>
                        Our AI assistant can answer questions about our services, help you schedule appointments, and provide
                        detailing tips
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ChatInterface />
                </CardContent>
            </Card>
        </div>
    )
}

