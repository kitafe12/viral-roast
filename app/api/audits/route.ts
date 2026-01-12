import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
    try {
        // Check user authentication
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json(
                { error: "Not authenticated" },
                { status: 401 }
            );
        }

        // Fetch audits for this user, most recent first
        const { data, error } = await supabaseAdmin
            .from('audits')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) {
            console.error("[Get Audits] Supabase error:", error);
            return NextResponse.json(
                { error: "Failed to fetch audits", details: error.message },
                { status: 500 }
            );
        }

        console.log(`[Get Audits] Retrieved ${data?.length || 0} audits for user:`, userId);
        return NextResponse.json({ audits: data || [] });

    } catch (error: any) {
        console.error("[Get Audits] Error:", error);
        return NextResponse.json(
            { error: "Failed to fetch audits", details: error?.message },
            { status: 500 }
        );
    }
}
