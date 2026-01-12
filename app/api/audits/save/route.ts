import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(request: NextRequest) {
    try {
        // Get user authentication
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json(
                { error: "Not authenticated" },
                { status: 401 }
            );
        }

        // Parse form data
        const formData = await request.formData();
        const videoFile = formData.get("video") as File;
        const auditData = formData.get("auditData") as string;

        if (!videoFile) {
            return NextResponse.json(
                { error: "No video file provided" },
                { status: 400 }
            );
        }

        const audit = JSON.parse(auditData);

        // Upload video to Supabase Storage
        const fileName = `${userId}_${Date.now()}_${videoFile.name}`;
        const fileBuffer = await videoFile.arrayBuffer();

        const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
            .from('Viral roast')
            .upload(fileName, fileBuffer, {
                contentType: videoFile.type,
                upsert: false
            });

        if (uploadError) {
            console.error("[Save Audit] Upload error:", uploadError);
            return NextResponse.json(
                { error: "Failed to upload video", details: uploadError.message },
                { status: 500 }
            );
        }

        // Get public URL
        const { data: urlData } = supabaseAdmin.storage
            .from('Viral roast')
            .getPublicUrl(fileName);

        const videoUrl = urlData.publicUrl;

        // Save audit with video URL to database
        const { data, error } = await supabaseAdmin.from('audits').insert({
            user_id: userId,
            video_filename: videoFile.name,
            video_size: videoFile.size,
            video_url: videoUrl,
            score: audit.score,
            hook_rating: audit.hook_rating,
            retention_rating: audit.retention_rating,
            roast: audit.roast,
            improvements: audit.improvements,
            hashtags: audit.hashtags,
            niche_detected: audit.niche_detected
        });

        if (error) {
            console.error("[Save Audit] Database error:", error);
            return NextResponse.json(
                { error: "Failed to save audit", details: error.message },
                { status: 500 }
            );
        }

        console.log("[Save Audit] Successfully saved audit with video for user:", userId);
        return NextResponse.json({ success: true, videoUrl, data });

    } catch (error: any) {
        console.error("[Save Audit] Error:", error);
        return NextResponse.json(
            { error: "Failed to save audit", details: error?.message },
            { status: 500 }
        );
    }
}
