"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { History, TrendingUp, Calendar, Video, ArrowLeft, Lock } from "lucide-react";
import Link from "next/link";

interface Audit {
    id: string;
    created_at: string;
    video_filename: string;
    video_url: string;
    score: number;
    hook_rating: string;
    retention_rating: string;
    roast: string;
    improvements: string[];
    hashtags: string[];
    niche_detected: string;
}

export default function Dashboard() {
    const { user, isLoaded } = useUser();
    const [audits, setAudits] = useState<Audit[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedAudit, setSelectedAudit] = useState<Audit | null>(null);

    useEffect(() => {
        if (isLoaded && user) {
            fetchAudits();
        }
    }, [isLoaded, user]);

    const fetchAudits = async () => {
        try {
            const response = await fetch("/api/audits");
            if (!response.ok) {
                throw new Error("Failed to fetch audits");
            }
            const data = await response.json();
            setAudits(data.audits);
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
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

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    if (!isLoaded || loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center">
                <div className="text-white text-xl">Loading your audits...</div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center">
                <div className="text-white text-xl">Please sign in to view your dashboard.</div>
            </div>
        );
    }

    // Check if user has pro subscription
    const hasPro = user.publicMetadata?.subscription === 'pro';

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
                            🔥 ViralRoast Dashboard
                        </h1>
                        <div></div> {/* Spacer for flexbox centering */}
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-6 py-12">
                {/* Stats Header */}
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                        <History className="w-8 h-8 text-purple-400" />
                        Your Audit History
                    </h2>
                    <p className="text-gray-400">
                        {audits.length} {audits.length === 1 ? "audit" : "audits"} completed
                    </p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400">
                        Error: {error}
                    </div>
                )}

                {/* Audits Grid */}
                {audits.length === 0 ? (
                    <div className="text-center py-20">
                        <Video className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                        <h3 className="text-2xl font-bold text-white mb-2">No audits yet</h3>
                        <p className="text-gray-400 mb-6">Start your first video analysis!</p>
                        <Link
                            href="/"
                            className="inline-block px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 rounded-lg text-white font-bold hover:shadow-xl hover:shadow-pink-500/50 transform hover:scale-105 transition"
                        >
                            Create First Audit
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {audits.map((audit) => (
                            <div
                                key={audit.id}
                                className="bg-slate-800/60 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-purple-500/50 transition cursor-pointer transform hover:scale-105"
                                onClick={() => setSelectedAudit(audit)}
                            >
                                {/* Date */}
                                <div className="flex items-center gap-2 text-gray-400 text-sm mb-3">
                                    <Calendar className="w-4 h-4" />
                                    {formatDate(audit.created_at)}
                                </div>

                                {/* Score */}
                                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border mb-4 ${getScoreBgColor(audit.score)}`}>
                                    <TrendingUp className="w-5 h-5" />
                                    <span className={`text-2xl font-bold ${getScoreColor(audit.score)}`}>
                                        {audit.score}/100
                                    </span>
                                </div>

                                {/* Video Filename */}
                                <h3 className="text-white font-bold mb-2 truncate">{audit.video_filename}</h3>

                                {/* Niche Badge */}
                                <div className="inline-block px-3 py-1 bg-purple-500/20 border border-purple-500/50 rounded-full text-purple-300 text-xs mb-3">
                                    {audit.niche_detected}
                                </div>

                                {/* Roast Preview */}
                                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                                    {audit.roast}
                                </p>

                                {/* Ratings */}
                                <div className="flex gap-2 mb-4">
                                    <span className="text-xs px-2 py-1 bg-blue-500/20 border border-blue-500/50 rounded text-blue-300">
                                        Hook: {audit.hook_rating}
                                    </span>
                                    <span className="text-xs px-2 py-1 bg-green-500/20 border border-green-500/50 rounded text-green-300">
                                        Retention: {audit.retention_rating}
                                    </span>
                                </div>

                                {/* View Button */}
                                <button className="w-full py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-white font-bold hover:shadow-lg hover:shadow-purple-500/50 transition">
                                    View Full Report
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal for Full Report */}
            {selectedAudit && (
                <div
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-6"
                    onClick={() => setSelectedAudit(null)}
                >
                    <div
                        className="bg-slate-900 border border-white/20 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-8"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-white">Full Audit Report</h2>
                            <button
                                onClick={() => setSelectedAudit(null)}
                                className="text-gray-400 hover:text-white text-3xl leading-none"
                            >
                                ×
                            </button>
                        </div>

                        {/* Video Info */}
                        <div className="mb-6">
                            <p className="text-gray-400 mb-2">
                                <strong>Video:</strong> {selectedAudit.video_filename}
                            </p>
                            <p className="text-gray-400 mb-2">
                                <strong>Date:</strong> {formatDate(selectedAudit.created_at)}
                            </p>
                            <p className="text-gray-400">
                                <strong>Niche:</strong> {selectedAudit.niche_detected}
                            </p>
                        </div>

                        {/* Score */}
                        <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg border mb-6 ${getScoreBgColor(selectedAudit.score)}`}>
                            <TrendingUp className="w-6 h-6" />
                            <span className={`text-3xl font-bold ${getScoreColor(selectedAudit.score)}`}>
                                {selectedAudit.score}/100
                            </span>
                        </div>

                        {/* Ratings */}
                        <div className="flex gap-4 mb-6">
                            <div className="flex-1 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                                <p className="text-blue-300 text-sm mb-1">Hook Rating</p>
                                <p className="text-white text-xl font-bold">{selectedAudit.hook_rating}</p>
                            </div>
                            <div className="flex-1 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                                <p className="text-green-300 text-sm mb-1">Retention Rating</p>
                                <p className="text-white text-xl font-bold">{selectedAudit.retention_rating}</p>
                            </div>
                        </div>

                        {/* Roast */}
                        <div className="mb-6">
                            <h3 className="text-white font-bold text-lg mb-2">🔥 Roast</h3>
                            <p className="text-gray-300">{selectedAudit.roast}</p>
                        </div>

                        {/* Improvements - Pro Only */}
                        <div className="mb-6">
                            <h3 className="text-white font-bold text-lg mb-3">💡 Improvements</h3>
                            {hasPro ? (
                                <ul className="space-y-2">
                                    {selectedAudit.improvements.map((improvement, idx) => (
                                        <li key={idx} className="flex items-start gap-3 text-gray-300">
                                            <span className="text-yellow-500 mt-1">•</span>
                                            <span>{improvement}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="relative">
                                    <div className="blur-sm pointer-events-none">
                                        <ul className="space-y-2">
                                            <li className="flex items-start gap-3 text-gray-300">
                                                <span className="text-yellow-500 mt-1">•</span>
                                                <span>Upgrade to Pro to see personalized improvements</span>
                                            </li>
                                            <li className="flex items-start gap-3 text-gray-300">
                                                <span className="text-yellow-500 mt-1">•</span>
                                                <span>Get expert tips to boost your content</span>
                                            </li>
                                            <li className="flex items-start gap-3 text-gray-300">
                                                <span className="text-yellow-500 mt-1">•</span>
                                                <span>Access premium analytics and insights</span>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/80 backdrop-blur-sm rounded-lg border-2 border-purple-500/50">
                                        <Lock className="w-8 h-8 text-purple-400 mb-2" />
                                        <p className="text-white font-bold mb-2">Pro Feature</p>
                                        <Link
                                            href="/?tab=audit"
                                            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-white text-sm font-bold hover:shadow-lg hover:shadow-purple-500/50 transition"
                                        >
                                            Upgrade to Pro - $9.99/mo
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Hashtags - Pro Only */}
                        <div>
                            <h3 className="text-white font-bold text-lg mb-3">#️⃣ Recommended Hashtags</h3>
                            {hasPro ? (
                                <div className="flex flex-wrap gap-2">
                                    {selectedAudit.hashtags.map((tag, idx) => (
                                        <span
                                            key={idx}
                                            className="px-3 py-1 bg-purple-500/20 border border-purple-500/50 rounded-full text-purple-300"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <div className="relative">
                                    <div className="blur-sm pointer-events-none">
                                        <div className="flex flex-wrap gap-2">
                                            <span className="px-3 py-1 bg-purple-500/20 border border-purple-500/50 rounded-full text-purple-300">#viral</span>
                                            <span className="px-3 py-1 bg-purple-500/20 border border-purple-500/50 rounded-full text-purple-300">#trending</span>
                                            <span className="px-3 py-1 bg-purple-500/20 border border-purple-500/50 rounded-full text-purple-300">#foryou</span>
                                        </div>
                                    </div>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/80 backdrop-blur-sm rounded-lg border-2 border-purple-500/50">
                                        <Lock className="w-8 h-8 text-purple-400 mb-2" />
                                        <p className="text-white font-bold mb-2">Pro Feature</p>
                                        <Link
                                            href="/?tab=audit"
                                            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-white text-sm font-bold hover:shadow-lg hover:shadow-purple-500/50 transition"
                                        >
                                            Upgrade to Pro - $9.99/mo
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Video Link */}
                        {selectedAudit.video_url && (
                            <div className="mt-6 pt-6 border-t border-white/10">
                                <a
                                    href={selectedAudit.video_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-white font-bold hover:shadow-lg hover:shadow-blue-500/50 transition"
                                >
                                    Watch Video
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
