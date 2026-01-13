"use client";

import { TrendingUp, Flame, Lightbulb, Hash, Target, CheckCircle2, Sparkles, Lock, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function DemoPage() {
    // Hardcoded demo result - exactly like real analysis
    const demoResult = {
        score: 42,
        hook_rating: "Weak",
        retention_rating: "Average",
        roast: "This intro is longer than a Lord of the Rings movie. You spent 14 seconds saying 'Hello guys' before showing the product. The algorithm fell asleep, and so did I. Bro, your first frame is literally a black screen. That's not a hook, that's a blackout. By the time you get to the point, viewers are already swiping to the next video.",
        improvements: [
            "Cut the first 12 seconds entirely - start with the finished result",
            "Show the product/result in frame 1 (first 0.5 seconds)",
            "Add dynamic captions to keep retention high"
        ],
        hashtags: ["#viral", "#contentcreator", "#tiktokgrowth", "#videotips", "#socialmedia"],
        niche_detected: "Content Creation"
    };

    // Helper functions matching main page
    const getScoreColor = (score: number) => {
        if (score >= 70) return "text-green-400";
        if (score >= 40) return "text-yellow-400";
        return "text-red-400";
    };

    const getScoreBgColor = (score: number) => {
        if (score >= 70) return "from-green-900/30 to-green-800/20";
        if (score >= 40) return "from-yellow-900/30 to-orange-800/20";
        return "from-red-900/30 to-orange-800/20";
    };

    const getRatingColor = (rating: string) => {
        if (rating === "Excellent") return "bg-green-500/20 border-green-500/50 text-green-400";
        if (rating.includes("Average") || rating.includes("Moyen")) return "bg-orange-500/20 border-orange-500/50 text-orange-400";
        return "bg-red-500/20 border-red-500/50 text-red-400";
    };

    const getRatingProgress = (rating: string) => {
        if (rating === "Excellent") return 90;
        if (rating.includes("Average") || rating.includes("Moyen")) return 50;
        return 25;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 py-12 px-6">
            <div className="container mx-auto max-w-6xl">
                {/* Demo Badge */}
                <div className="text-center mb-8">
                    <div className="inline-block px-6 py-3 bg-purple-500/20 border-2 border-purple-500/50 rounded-full mb-4">
                        <p className="text-purple-300 font-bold">📺 DEMO REPORT  - This is what you'll get!</p>
                    </div>
                </div>

                {/* Results - EXACT COPY from main page */}
                <div className="space-y-8">
                    {/* Header + Score */}
                    <div className="text-center space-y-6">
                        <div className="flex items-center justify-center gap-3">
                            <CheckCircle2 className="w-8 h-8 text-green-500" />
                            <h2 className="text-3xl font-bold text-white">ANALYSIS COMPLETE</h2>
                        </div>

                        <div className={`inline-block bg-gradient-to-br ${getScoreBgColor(demoResult.score)} backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl`}>
                            <div className="text-center">
                                <p className="text-gray-400 text-sm uppercase tracking-wide mb-2">Overall Score</p>
                                <div className={`text-7xl font-extrabold ${getScoreColor(demoResult.score)}`}>
                                    {demoResult.score}
                                    <span className="text-4xl text-gray-500">/100</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* THE ROAST */}
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition duration-500"></div>

                        <div className="relative bg-gradient-to-br from-red-950/50 to-orange-950/30 backdrop-blur-xl border border-red-500/30 rounded-2xl p-8 shadow-2xl">
                            <div className="flex items-center gap-3 mb-4">
                                <Flame className="w-8 h-8 text-orange-500" />
                                <h3 className="text-2xl font-bold text-white">THE ROAST</h3>
                            </div>
                            <p className="text-xl text-gray-200 leading-relaxed font-medium">
                                {demoResult.roast}
                            </p>
                        </div>
                    </div>

                    {/* Ratings + Action Plan */}
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
                            <div className="flex items-center gap-2 mb-6">
                                <Target className="w-6 h-6 text-purple-500" />
                                <h3 className="text-xl font-bold text-white">Performance Ratings</h3>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-gray-300 font-medium">Hook Rating</span>
                                        <span className={`px-3 py-1 rounded-full text-sm font-bold border ${getRatingColor(demoResult.hook_rating)}`}>
                                            {demoResult.hook_rating}
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-700/50 rounded-full h-3 overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all duration-1000 bg-red-500`}
                                            style={{ width: `${getRatingProgress(demoResult.hook_rating)}%` }}
                                        ></div>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-gray-300 font-medium">Retention Rating</span>
                                        <span className={`px-3 py-1 rounded-full text-sm font-bold border ${getRatingColor(demoResult.retention_rating)}`}>
                                            {demoResult.retention_rating}
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-700/50 rounded-full h-3 overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all duration-1000 bg-orange-500`}
                                            style={{ width: `${getRatingProgress(demoResult.retention_rating)}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
                            <div className="flex items-center gap-2 mb-6">
                                <Sparkles className="w-6 h-6 text-yellow-500" />
                                <h3 className="text-xl font-bold text-white">Action Plan</h3>
                            </div>

                            <div className="space-y-3">
                                {demoResult.improvements.map((improvement: string, index: number) => (
                                    <div key={index} className="relative flex items-start gap-3 p-3 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition">
                                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
                                            {index + 1}
                                        </div>
                                        <p className="text-gray-300 text-sm leading-relaxed">{improvement}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Virality Insights - Same as main page */}
                    <div className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
                        <div className="flex items-center gap-2 mb-6">
                            <TrendingUp className="w-6 h-6 text-green-500" />
                            <h3 className="text-xl font-bold text-white">Virality Insights</h3>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                                <p className="text-xs text-gray-400 mb-1">Niche</p>
                                <p className="text-white font-bold">{demoResult.niche_detected}</p>
                            </div>
                            <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                                <p className="text-xs text-gray-400 mb-1">Recommended Hashtags</p>
                                <div className="flex gap-1 flex-wrap">
                                    {demoResult.hashtags.slice(0, 2).map((tag, idx) => (
                                        <span key={idx} className="text-purple-400 text-xs">{tag}</span>
                                    ))}
                                </div>
                            </div>
                            <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                                <p className="text-xs text-gray-400 mb-1">Total Insights</p>
                                <p className="text-white font-bold">{demoResult.improvements.length} Tips</p>
                            </div>
                        </div>
                    </div>

                    {/* Big CTA Button - Fixed at bottom */}
                    <div className="sticky bottom-6 z-50">
                        <div className="bg-gradient-to-r from-orange-600 to-pink-600 rounded-2xl p-1">
                            <Link
                                href="/"
                                className="flex items-center justify-center gap-3 bg-gradient-to-r from-orange-500 to-pink-500 rounded-xl px-8 py-6 hover:from-orange-600 hover:to-pink-600 transition group"
                            >
                                <span className="text-white text-2xl font-bold">Audit MY Video Now</span>
                                <ArrowRight className="w-8 h-8 text-white group-hover:translate-x-2 transition" />
                                <span className="text-2xl">🚀</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
