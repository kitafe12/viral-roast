import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

async function generateIdeas(niche: string) {
    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            generationConfig: {
                temperature: 1,
                topP: 0.95,
                topK: 40,
                maxOutputTokens: 8192,
                responseMimeType: "application/json",
            },
        });

        console.log(`[Viral Ideas] Generating ideas for niche: "${niche}"`);

        const prompt = `You are a viral marketing expert for the US Market.
You MUST answer in English ONLY. Never use French.
Use American slang/colloquialisms appropriate for TikTok (e.g., 'This hook is weak', 'Bro, this lighting...', 'Straight fire').

Generate 3 ultra-viral video ideas for the niche: "${niche}".

Respond ONLY with a JSON object in this EXACT format (no markdown, no backticks):
{
  "ideas": [
    {
      "title": "Stop doing THIS mistake",
      "visual_hook": "Quick zoom on your angry face 😠",
      "audio_hook": "Stop doing this immediately if you wanna succeed...",
      "difficulty": "Easy"
    },
    {
      "title": "My Secret Tool Revealed",
      "visual_hook": "Show your computer screen blurred then sharp 💻",
      "audio_hook": "I've never shared this website before...",
      "difficulty": "Medium"
    },
    {
      "title": "Day in the life (Fast Version)",
      "visual_hook": "Super fast montage (0.5s per shot) with trending music ⚡️",
      "audio_hook": "(No voiceover, just trending audio)",
      "difficulty": "Hard"
    }
  ]
}

For each idea:
- Title: Clickbait hook
- Visual hook: Description of the first second of video
- Audio hook: First phrase spoken or audio note
- Difficulty: "Easy", "Medium" or "Hard"

Remember: ENGLISH ONLY. Use US market language.`;

        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();

        console.log("[Viral Ideas] Gemini response:", text.substring(0, 200));

        // Clean and parse JSON
        let cleanedText = text.trim();
        // Remove markdown code blocks if present
        cleanedText = cleanedText.replace(/```json\n?/g, '').replace(/```\n?/g, '');

        const ideas = JSON.parse(cleanedText);

        console.log(`[Viral Ideas] Successfully generated ${ideas?.ideas?.length || 0} ideas`);
        return ideas;

    } catch (error: any) {
        console.error("[Viral Ideas] Error calling Gemini API:", error);
        console.error("[Viral Ideas] Error details:", error?.message);
        throw new Error(`Failed to generate ideas with Gemini: ${error?.message || 'Unknown error'}`);
    }
}

export async function POST(request: NextRequest) {
    try {
        console.log("[Viral Ideas] Received request");

        // Check API key
        if (!process.env.GEMINI_API_KEY) {
            console.error("[Viral Ideas] GEMINI_API_KEY is not configured");
            return NextResponse.json(
                { error: "GEMINI_API_KEY is not configured. Add it to your .env.local file." },
                { status: 500 }
            );
        }

        const body = await request.json();
        const niche = body.niche || "";

        if (!niche || niche.trim().length === 0) {
            console.log("[Viral Ideas] Niche is empty");
            return NextResponse.json(
                { error: "Niche is required" },
                { status: 400 }
            );
        }

        // Call Gemini API
        const ideas = await generateIdeas(niche);

        console.log("[Viral Ideas] Ideas generated successfully, returning results");
        return NextResponse.json(ideas);

    } catch (error: any) {
        console.error("[Viral Ideas] Error generating ideas:", error);
        return NextResponse.json(
            {
                error: "Failed to generate ideas",
                details: error?.message || 'Unknown error'
            },
            { status: 500 }
        );
    }
}
