"use client";

import { useUser } from "@clerk/nextjs";
import { Check, Zap, Crown, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function PricingPage() {
    const { user } = useUser();

    const singleAuditUrl = user?.id
        ? `https://viralroast.lemonsqueezy.com/buy/54c0ba63-f3c6-4f89-b2ab-dc2a026e0eeb?checkout[custom][user_id]=${user.id}`
        : "https://viralroast.lemonsqueezy.com/buy/54c0ba63-f3c6-4f89-b2ab-dc2a026e0eeb";

    const proPlanUrl = user?.id
        ? `https://viralroast.lemonsqueezy.com/buy/cf895eb4-ff6e-49ab-bd67-dc80cde7ff1d?checkout[custom][user_id]=${user.id}`
        : "https://viralroast.lemonsqueezy.com/buy/cf895eb4-ff6e-49ab-bd67-dc80cde7ff1d";

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
                            🔥 ViralRoast Pricing
                        </h1>
                        <div></div>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-6 py-16">
                {/* Hero Section */}
                <div className="text-center mb-16">
                    <h2 className="text-5xl font-bold text-white mb-4">
                        Choose Your Plan
                    </h2>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Get professional video analysis powered by AI. Pick the plan that works for you.
                    </p>
                </div>

                {/* Pricing Cards */}
                <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {/* Single Audit */}
                    <div className="bg-slate-800/60 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:border-purple-500/50 transition">
                        <div className="flex items-center gap-3 mb-4">
                            <Zap className="w-8 h-8 text-yellow-400" />
                            <h3 className="text-2xl font-bold text-white">Single Audit</h3>
                        </div>

                        <div className="mb-6">
                            <div className="flex items-baseline gap-2">
                                <span className="text-5xl font-bold text-white">$4.99</span>
                                <span className="text-gray-400">one-time</span>
                            </div>
                        </div>

                        <ul className="space-y-4 mb-8">
                            <li className="flex items-start gap-3">
                                <Check className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                                <span className="text-gray-300">1 Video Analysis</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Check className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                                <span className="text-gray-300">AI-Powered Roast</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Check className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                                <span className="text-gray-300">Virality Score</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Check className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                                <span className="text-gray-300">Hook & Retention Ratings</span>
                            </li>
                            <li className="flex items-start gap-3 opacity-50">
                                <Check className="w-5 h-5 text-gray-500 mt-1 flex-shrink-0" />
                                <span className="text-gray-500 line-through">Pro Improvements</span>
                            </li>
                            <li className="flex items-start gap-3 opacity-50">
                                <Check className="w-5 h-5 text-gray-500 mt-1 flex-shrink-0" />
                                <span className="text-gray-500 line-through">Hashtag Recommendations</span>
                            </li>
                        </ul>

                        <a
                            href={singleAuditUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-full py-4 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-xl text-white font-bold text-center hover:shadow-xl hover:shadow-yellow-500/50 transform hover:scale-105 transition"
                        >
                            Buy Single Audit
                        </a>
                    </div>

                    {/* Pro Plan */}
                    <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 backdrop-blur-sm border-2 border-purple-500 rounded-2xl p-8 relative overflow-hidden">
                        {/* Popular Badge */}
                        <div className="absolute top-4 right-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                            MOST POPULAR
                        </div>

                        <div className="flex items-center gap-3 mb-4">
                            <Crown className="w-8 h-8 text-yellow-400" />
                            <h3 className="text-2xl font-bold text-white">Pro Creator</h3>
                        </div>

                        <div className="mb-6">
                            <div className="flex items-baseline gap-2">
                                <span className="text-5xl font-bold text-white">$9.99</span>
                                <span className="text-gray-400">/month</span>
                            </div>
                        </div>

                        <ul className="space-y-4 mb-8">
                            <li className="flex items-start gap-3">
                                <Check className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                                <span className="text-gray-300"><strong>Unlimited</strong> Video Analysis</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Check className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                                <span className="text-gray-300">AI-Powered Roast</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Check className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                                <span className="text-gray-300">Virality Score</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Check className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                                <span className="text-gray-300">Hook & Retention Ratings</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Check className="w-5 h-5 text-purple-400 mt-1 flex-shrink-0" />
                                <span className="text-white font-semibold">✨ Pro Improvements</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Check className="w-5 h-5 text-purple-400 mt-1 flex-shrink-0" />
                                <span className="text-white font-semibold">✨ Hashtag Recommendations</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Check className="w-5 h-5 text-purple-400 mt-1 flex-shrink-0" />
                                <span className="text-white font-semibold">✨ Full History Access</span>
                            </li>
                        </ul>

                        <a
                            href={proPlanUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white font-bold text-center hover:shadow-xl hover:shadow-purple-500/50 transform hover:scale-105 transition"
                        >
                            Subscribe to Pro
                        </a>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="mt-20 max-w-3xl mx-auto">
                    <h3 className="text-3xl font-bold text-white text-center mb-10">
                        Frequently Asked Questions
                    </h3>

                    <div className="space-y-6">
                        <div className="bg-slate-800/40 border border-white/10 rounded-lg p-6">
                            <h4 className="text-white font-bold mb-2">What's included in a video analysis?</h4>
                            <p className="text-gray-400">
                                Every analysis includes an AI-powered roast, virality score (0-100), hook rating, retention rating, and niche detection. Pro users also get personalized improvements and hashtag recommendations.
                            </p>
                        </div>

                        <div className="bg-slate-800/40 border border-white/10 rounded-lg p-6">
                            <h4 className="text-white font-bold mb-2">Can I cancel my Pro subscription anytime?</h4>
                            <p className="text-gray-400">
                                Yes! You can cancel your Pro subscription at any time. Your access will continue until the end of your billing period.
                            </p>
                        </div>

                        <div className="bg-slate-800/40 border border-white/10 rounded-lg p-6">
                            <h4 className="text-white font-bold mb-2">What video formats are supported?</h4>
                            <p className="text-gray-400">
                                We support all major video formats including MP4, MOV, AVI, and WebM. Maximum file size is 20MB.
                            </p>
                        </div>

                        <div className="bg-slate-800/40 border border-white/10 rounded-lg p-6">
                            <h4 className="text-white font-bold mb-2">How does the credit system work?</h4>
                            <p className="text-gray-400">
                                Single audits give you 1 credit for 1 analysis. Pro subscription gives unlimited credits that reset monthly.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
