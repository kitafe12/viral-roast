"use client";

import { TrendingUp, Flame, Lightbulb, Hash, Target, ArrowLeft, Crown } from "lucide-react";
import Link from "next/link";

export default function DemoPage() {
    // Hardcoded demo result
    const demoResult = {
        score: 42,
        hook_rating: "Weak",
        retention_rating: "Average",
        roast: "This intro is longer than a Lord of the Rings movie. You spent 14 seconds saying 'Hello guys' before showing the product. The algorithm fell asleep, and so did I. Bro, your first frame is literally a black screen. That's not a hook, that's a blackout. By the time you get to the point, viewers are already swiping to the next video.",
        improvements: [
            "Cut the first 12 seconds entirely - start with the finished result",
            "Show the product/result in frame 1 (first 0.5 seconds)",
            "Add dynamic captions to keep retention high",
            "Use a trending sound instead of silence",
            "Add visual text overlays for better engagement"
        ],
        hashtags: ["#viral", "#contentcreator", "#tiktokgrowth", "#videotips", "#socialmedia"],
        niche_detected: "Content Creation"
    };

    const getScoreColor = (score: number) => {
        if (score >= 70) return "text-green-400";
        if (score >= 40) return "text-yellow-400";
        return "text-red-400";
    };

    const getScoreBgColor = (score: number) => {
        if (score >= 70) return "bg-green-500/20 border-green-500/50";
        if (score >= 40) return "bg-yellow-500/20 border-yellow-500/50";
        return "bg-red-500/20 border-red-500/50";
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
            {/* Header */}
            <header className="border-b border-white/10 backdrop-blur-sm bg-black/20">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <Link href="/" className="flex items-center gap-2 text-white hover:text-gray-300 transition">
                            <ArrowLeft className="w-5 h-5" />
                            <span>Back to Home</span>
                        </Link>
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent">
                            🔥 ViralRoast Demo
                        </h1>
                        <div></div>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-6 py-12">
                {/* Demo Badge */}
                <div className="text-center mb-8">
                    <div className="inline-block px-6 py-3 bg-purple-500/20 border-2 border-purple-500/50 rounded-full mb-4">
                        <p className="text-purple-300 font-bold">📺 DEMO REPORT - See What You Get!</p>
                    </div>
                    <h2 className="text-4xl font-bold text-white mb-2">
                        Your Video Analysis Report
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        This is an example of what our AI generates for every video. Real analysis uses advanced AI to roast your content and give actionable tips.
                    </p>
                </div>

                {/* Results Container */}
                <div className="max-w-4xl mx-auto">
                    {/* Score Section */}
                    <div className="bg-slate-800/60 backdrop-blur-sm border border-white/10 rounded-2xl p-8 mb-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                                <Target className="w-7 h-7 text-purple-400" />
                                Virality Score
                            </h3>
                            <div className={`flex items-center gap-3 px-6 py-3 rounded-xl border ${getScoreBgColor(demoResult.score)}`}>
                                <TrendingUp className="w-6 h-6" />
                                <span className={`text-4xl font-bold ${getScoreColor(demoResult.score)}`}>
                                    {demoResult.score}/100
                                </span>
                            </div>
                        </div>

                        {/* Ratings */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                                <p className="text-blue-300 text-sm mb-1">Hook Rating</p>
                                <p className="text-white text-xl font-bold">{demoResult.hook_rating}</p>
                            </div>
                            <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                                <p className="text-green-300 text-sm mb-1">Retention Rating</p>
                                <p className="text-white text-xl font-bold">{demoResult.retention_rating}</p>
                            </div>
                        </div>

                        {/* Niche Badge */}
                        <div className="mt-4">
                            <span className="inline-block px-4 py-2 bg-purple-500/20 border border-purple-500/50 rounded-full text-purple-300 font-semibold">
                                Niche: {demoResult.niche_detected}
                            </span>
                        </div>
                    </div>

                    {/* Roast Section */}
                    <div className="bg-slate-800/60 backdrop-blur-sm border border-white/10 rounded-2xl p-8 mb-6">
                        <h3 className="text-2xl font-bold text-white flex items-center gap-3 mb-4">
                            <Flame className="w-7 h-7 text-orange-500" />
                            The Roast 🔥
                        </h3>
                        <p className="text-gray-300 text-lg leading-relaxed">
                            {demoResult.roast}
                        </p>
                    </div>

                    {/* Improvements Section - Locked for Demo */}
                    <div className="bg-slate-800/60 backdrop-blur-sm border border-white/10 rounded-2xl p-8 mb-6 relative overflow-hidden">
                        <h3 className="text-2xl font-bold text-white flex items-center gap-3 mb-4">
                            <Lightbulb className="w-7 h-7 text-yellow-400" />
                            Pro Improvements
                        </h3>

                        {/* Blurred Preview */}
                        <div className="blur-sm pointer-events-none">
                            <ul className="space-y-3">
                                {demoResult.improvements.map((improvement, idx) => (
                                    <li key={idx} className="flex items-start gap-3">
                                        <span className="text-yellow-500 text-xl mt-1">•</span>
                                        <span className="text-gray-300 text-lg">{improvement}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Upgrade Overlay */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/90 backdrop-blur-sm">
                            <Crown className="w-12 h-12 text-yellow-400 mb-3" />
                            <p className="text-white text-xl font-bold mb-2">Unlock Pro Features</p>
                            <p className="text-gray-400 mb-4 text-center max-w-md">
                                Get personalized improvements, hashtag recommendations, and unlimited audits
                            </p>
                            <Link
                                href="/pricing"
                                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white font-bold hover:shadow-xl hover:shadow-purple-500/50 transform hover:scale-105 transition"
                            >
                                Upgrade to Pro - $9.99/mo
                            </Link>
                        </div>
                    </div>

                    {/* Hashtags Section - Locked for Demo */}
                    <div className="bg-slate-800/60 backdrop-blur-sm border border-white/10 rounded-2xl p-8 mb-6 relative overflow-hidden">
                        <h3 className="text-2xl font-bold text-white flex items-center gap-3 mb-4">
                            <Hash className="w-7 h-7 text-pink-400" />
                            Recommended Hashtags
                        </h3>

                        {/* Blurred Preview */}
                        <div className="blur-sm pointer-events-none">
                            <div className="flex flex-wrap gap-2">
                                {demoResult.hashtags.map((tag, idx) => (
                                    <span
                                        key={idx}
                                        className="px-4 py-2 bg-purple-500/20 border border-purple-500/50 rounded-full text-purple-300 font-semibold"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Upgrade Overlay */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/90 backdrop-blur-sm">
                            <Crown className="w-12 h-12 text-yellow-400 mb-3" />
                            <p className="text-white text-xl font-bold mb-4">Pro Feature</p>
                            <Link
                                href="/pricing"
                                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white font-bold hover:shadow-xl hover:shadow-purple-500/50 transform hover:scale-105 transition"
                            >
                                See Pricing
                            </Link>
                        </div>
                    </div>

                    {/* CTA Section */}
                    <div className="bg-gradient-to-r from-purple-900/40 to-pink-900/40 backdrop-blur-sm border-2 border-purple-500 rounded-2xl p-8 text-center">
                        <h3 className="text-3xl font-bold text-white mb-4">
                            Ready to Roast Your Videos? 🔥
                        </h3>
                        <p className="text-gray-300 text-lg mb-6 max-w-2xl mx-auto">
                            Get instant AI-powered feedback on YOUR videos. Improve hooks, boost retention, and go viral faster.
                        </p>
                        <div className="flex gap-4 justify-center flex-wrap">
                            <Link
                                href="/"
                                className="px-8 py-4 bg-gradient-to-r from-orange-600 to-pink-600 rounded-xl text-white font-bold text-lg hover:shadow-xl hover:shadow-pink-500/50 transform hover:scale-105 transition"
                            >
                                Try Free Analysis
                            </Link>
                            <Link
                                href="/pricing"
                                className="px-8 py-4 bg-white/10 border-2 border-white/20 rounded-xl text-white font-bold text-lg hover:bg-white/20 transform hover:scale-105 transition"
                            >
                                View Pricing
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
