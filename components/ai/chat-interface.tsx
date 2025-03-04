"use client"

import { useChat } from "ai/react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useUser } from "@clerk/clerk-react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Send } from "lucide-react"

interface ChatInterfaceProps {
    appointmentId?: string
}

export function ChatInterface({ appointmentId }: ChatInterfaceProps) {
    const { user } = useUser()
    const userId = user?.id || ""

    // Get user's appointments for context
    const appointments = useQuery(api.appointments.getUserAppointments, {
        userId,
    })

    const [appointmentContext, setAppointmentContext] = useState<any>(null)

    useEffect(() => {
        if (appointments) {
            setAppointmentContext(appointments)
        }
    }, [appointments])

    const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
        api: "/api/chat",
        body: {
            userId,
            appointmentContext,
        },
    })

    return (
        <Card className="w-full h-[600px] flex flex-col">
            <CardHeader className="pb-2">
                <CardTitle className="text-xl flex items-center gap-2">
                    <Avatar className="h-8 w-8 bg-primary">
                        <AvatarFallback>AI</AvatarFallback>
                    </Avatar>
                    DetailBot Assistant
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-grow overflow-hidden p-4">
                <ScrollArea className="h-full pr-4">
                    <div className="flex flex-col gap-4">
                        {messages.length === 0 ? (
                            <div className="flex items-center justify-center h-full text-muted-foreground">
                                Ask me about auto detailing services or schedule an appointment!
                            </div>
                        ) : (
                            messages.map((message) => (
                                <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                                    <div
                                        className={`max-w-[80%] rounded-lg p-3 ${message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                                            }`}
                                    >
                                        {message.content}
                                    </div>
                                </div>
                            ))
                        )}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="max-w-[80%] rounded-lg p-3 bg-muted">
                                    <div className="flex gap-1">
                                        <div className="w-2 h-2 rounded-full bg-secondary animate-pulse"></div>
                                        <div className="w-2 h-2 rounded-full bg-secondary animate-pulse delay-75"></div>
                                        <div className="w-2 h-2 rounded-full bg-secondary animate-pulse delay-150"></div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </CardContent>
            <CardFooter className="pt-0">
                <form onSubmit={handleSubmit} className="flex w-full gap-2">
                    <Input
                        placeholder="Type your message..."
                        value={input}
                        onChange={handleInputChange}
                        disabled={isLoading}
                        className="flex-grow"
                    />
                    <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
                        <Send className="h-4 w-4" />
                    </Button>
                </form>
            </CardFooter>
        </Card>
    )
}

