import { togetherai } from "@ai-sdk/togetherai"
import { streamText } from "ai"
import { NextResponse } from "next/server"

export const runtime = "edge"

export async function POST(req: Request) {
    try {
        const { messages, userId, appointmentContext } = await req.json()

        // System prompt with context about the auto detailing business
        const systemPrompt = `You are an AI assistant for an auto detailing business. 
    Your name is DetailBot and you help customers schedule appointments, learn about services, 
    and get information about their upcoming appointments.
    
    ${appointmentContext ? `The user has the following appointment(s): ${JSON.stringify(appointmentContext)}` : ""}
    
    Be friendly, professional, and helpful. If the user wants to schedule an appointment, 
    ask for the necessary details like car make/model, preferred date/time, and service type.
    
    Available services include:
    - Basic Wash & Vacuum ($50, 1 hour)
    - Interior Detail ($150, 2 hours)
    - Exterior Detail ($150, 2 hours)
    - Full Detail ($250, 3 hours)
    - Paint Correction ($350, 4 hours)
    - Ceramic Coating ($500, 5 hours)
    
    Business hours are Monday-Friday 9am-6pm and Saturday 10am-4pm.`

        const result = await streamText({
            model: togetherai("meta-llama/Llama-3.2-3B-Instruct-Turbo"),
            messages: [{ role: "system", content: systemPrompt }, ...messages],
            maxTokens: 1000,
        })

        return result.toDataStreamResponse()
    } catch (error) {
        console.error("Error in chat route:", error)
        return NextResponse.json({ error: "There was an error processing your request" }, { status: 500 })
    }
}

