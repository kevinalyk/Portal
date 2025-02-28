import { streamText } from "ai"
import { openai } from "@ai-sdk/openai"

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

// Sample campaign data that would be retrieved from the website
const campaignData = `
Platform Highlights:
- America First Foreign Policy: End foreign wars and focus on American interests.
- Border Security: Complete the border wall and end illegal immigration.
- Economy: Cut taxes, reduce regulations, and bring back manufacturing jobs.
- Energy Independence: Increase domestic energy production and lower energy costs.
- Crime: Support law enforcement and crack down on violent crime.

Recent News:
- Campaign rally scheduled for next weekend in Pennsylvania.
- New policy proposal on healthcare reform announced yesterday.
- Campaign raised $20 million in the last quarter.
- Endorsement received from several key industry leaders.
`

export async function POST(req: Request) {
  const { messages } = await req.json()

  // Add campaign context to the system message
  const systemMessage = {
    role: "system",
    content: `You are a helpful campaign assistant for a political campaign. 
    Answer questions based on the following campaign information. 
    Be enthusiastic and supportive of the campaign.
    If you don't know something, suggest the visitor contact the campaign directly.
    Do not make up information that is not in the provided context.
    
    ${campaignData}`,
  }

  const result = streamText({
    model: openai("gpt-3.5-turbo"),
    system: systemMessage.content,
    messages,
  })

  return result.toDataStreamResponse()
}

