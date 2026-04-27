import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { destination, budget, duration, tripType, travelerCount, notes } = body;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Configuration error' }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `You are an expert travel planner. Create a day-by-day itinerary for a trip.
Destination: ${destination}
Duration: ${duration} days
Budget: ${budget}
Travel Style: ${tripType}
Travelers: ${travelerCount}
Additional Notes: ${notes || 'None'}

Return ONLY valid JSON with no markdown formatting, no preamble, and no code fences.
The response schema MUST follow this structure:
{ "trip": { "destination": "string", "duration": number, "budget": "string", "days": [
{ "day": number, "theme": "string", "activities": [ { "time": "string", "title":
"string", "description": "string", "tips": "string" } ] } ] } }`;

    const result = await model.generateContent(prompt);
    let text = result.response.text();
    
    // Strip markdown code fences if present
    text = text.trim();
    if (text.startsWith('```')) {
      text = text.replace(/^```(?:json)?\s*/i, '');
    }
    if (text.endsWith('```')) {
      text = text.replace(/\s*```$/i, '');
    }

    try {
      const parsedJSON = JSON.parse(text);
      return NextResponse.json(parsedJSON);
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError, text);
      return NextResponse.json({ error: 'Could not generate itinerary, please retry' }, { status: 500 });
    }
  } catch (error: any) {
    console.error('API Route Error:', error);
    if (error?.status === 429 || error?.message?.includes('429')) {
      return NextResponse.json({ error: 'Too many requests, please wait a moment' }, { status: 429 });
    }
    return NextResponse.json({ error: 'Failed to generate itinerary' }, { status: 500 });
  }
}
