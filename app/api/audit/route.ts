import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { currentUser } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/nextjs/server";

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

async function analyzeVideoWithGemini(videoFile: File) {
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

    // Convert file to base64
    const bytes = await videoFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Video = buffer.toString('base64');

    console.log(`[Video Audit] Processing video: ${videoFile.name}, size: ${videoFile.size} bytes, type: ${videoFile.type}`);

    const prompt = `You are ViralRoast, a ruthless social media expert for the US Market.
You MUST answer in English ONLY. Never use French.
Use American slang/colloquialisms appropriate for TikTok (e.g., 'Bro, this hook is weak', 'This lighting... yikes', 'Straight fire').

Analyze this short-form video (TikTok/Shorts).

CRITICAL RULE - TIMESTAMPS REQUIRED:
You MUST use specific timestamps to justify your critiques.
Don't just say "The intro is slow" - Say: "At [0:03], you paused for too long."
Don't just say "The transition was jarring" - Say: "At [0:12], the cut was abrupt and killed momentum."
Every major critique in your roast MUST have a timestamp in [MM:SS] format (e.g., [0:05], [0:14], [0:23]).
Users need precise timestamps to edit their timeline.

Respond ONLY with a JSON object in this EXACT format (no markdown, no backticks):
{
  "score": 75,
  "hook_rating": "Excellent",
  "retention_rating": "Average",
  "roast": "At [0:00], your first frame is literally a black screen - that's not a hook, that's a blackout. By [0:03], you're still saying 'Hello guys' while the algorithm already swiped. At [0:14], you spent 14 seconds before showing the product. Bro, we're already gone...",
  "improvements": [
    "Cut everything before [0:12] - start with the finished result",
    "At [0:05], add a text overlay to hook viewers immediately",
    "Remove the pause at [0:08] - speed up editing to 0.5s max per shot"
  ],
  "hashtags": ["#fitness", "#motivation", "#gymtok", "#transformation", "#gains"],
  "niche_detected": "Fitness"
}

Criteria:
- Hook (first 3 seconds): Visual/audio attention grab?
- Retention: Editing, pacing, suspense?
- Virality: Share potential, emotion?

The "roast" must be funny, brutally honest, and include SPECIFIC TIMESTAMPS.
The "improvements" should reference timestamps where changes should be made.
Ratings are: "Weak", "Average" or "Excellent".
Remember: ENGLISH ONLY. Use US market language and TikTok slang. TIMESTAMPS ARE MANDATORY.`;

    const result = await model.generateContent([
      {
        inlineData: {
          mimeType: videoFile.type || "video/mp4",
          data: base64Video
        }
      },
      { text: prompt }
    ]);

    const response = result.response;
    const text = response.text();

    console.log("[Video Audit] Gemini response:", text.substring(0, 200));

    // Clean and parse JSON
    let cleanedText = text.trim();
    // Remove markdown code blocks if present
    cleanedText = cleanedText.replace(/```json\n?/g, '').replace(/```\n?/g, '');

    const analysis = JSON.parse(cleanedText);

    console.log("[Video Audit] Successfully parsed analysis");
    return analysis;

  } catch (error: any) {
    console.error("[Video Audit] Error calling Gemini API:", error);
    console.error("[Video Audit] Error details:", error?.message, error?.response?.data);
    throw new Error(`Failed to analyze video with Gemini: ${error?.message || 'Unknown error'}`);
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("[Video Audit] Received request");

    // Check API key
    if (!process.env.GEMINI_API_KEY) {
      console.error("[Video Audit] GEMINI_API_KEY is not configured");
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not configured. Add it to your .env.local file." },
        { status: 500 }
      );
    }

    // Check user authentication and credits
    const user = await currentUser();

    if (!user) {
      console.log("[Video Audit] User not authenticated");
      return NextResponse.json(
        { error: "You must be logged in to use this feature" },
        { status: 401 }
      );
    }

    const credits = Number(user.publicMetadata?.credits || 0);
    console.log(`[Video Audit] User ${user.id} has ${credits} credits`);

    if (credits < 1) {
      console.log("[Video Audit] Insufficient credits");
      return NextResponse.json(
        { error: "Insufficient credits. Please purchase credits to continue." },
        { status: 403 }
      );
    }

    // Parse form data
    const formData = await request.formData();
    const videoFile = formData.get("video") as File;

    if (!videoFile) {
      console.log("[Video Audit] No video file provided");
      return NextResponse.json(
        { error: "No video file provided" },
        { status: 400 }
      );
    }

    console.log(`[Video Audit] File received: ${videoFile.name}, ${videoFile.size} bytes`);

    // Check file size (Gemini has limits - typically 20MB for free tier)
    const MAX_SIZE = 20 * 1024 * 1024; // 20MB
    if (videoFile.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "Video file too large. Maximum size is 20MB." },
        { status: 400 }
      );
    }

    // Analyze with Gemini
    const analysis = await analyzeVideoWithGemini(videoFile);

    // Deduct credit after successful analysis
    try {
      const client = await clerkClient();
      await client.users.updateUserMetadata(user.id, {
        publicMetadata: {
          credits: credits - 1
        }
      });
      console.log(`[Video Audit] Credit deducted. User ${user.id} now has ${credits - 1} credits`);
    } catch (creditError) {
      console.error("[Video Audit] Error deducting credit:", creditError);
      // Continue anyway - user got their analysis
    }

    console.log("[Video Audit] Analysis complete, returning results");
    return NextResponse.json(analysis);

  } catch (error: any) {
    console.error("[Video Audit] Error processing video:", error);
    return NextResponse.json(
      {
        error: "Failed to process video",
        details: error?.message || 'Unknown error'
      },
      { status: 500 }
    );
  }
}
