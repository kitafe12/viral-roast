"use client";

import { Upload, Loader2, AlertCircle, CheckCircle2, Flame, Target, TrendingUp, Hash, Sparkles, RotateCcw, Lightbulb, Zap, Lock, History, Infinity } from "lucide-react";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";

interface AnalysisResult {
    score: number;
    hook_rating: "Faible" | "Moyen" | "Excellent";
    retention_rating: "Faible" | "Moyen" | "Excellent";
    roast: string;
    improvements: string[];
    hashtags: string[];
    niche_detected: string;
}

interface ViralIdea {
    title: string;
    visual_hook: string;
    audio_hook: string;
    difficulty: "Easy" | "Medium" | "Hard";
}

export default function Home() {
    // Clerk User & Credits
    const { user, isLoaded } = useUser();
    const credits = (user?.publicMetadata?.credits as number) || 0;
    const isPro = user?.publicMetadata?.subscription === 'pro';

    // Dynamic Payment URLs with User ID for webhook identification
    const singleAuditUrl = `https://visualia346.lemonsqueezy.com/checkout/buy/7d5d1d79-6f36-4b6a-b0fe-3a87c8ce804e?checkout[custom][user_id]=${user?.id || ''}`;
    const proPlanUrl = `https://visualia346.lemonsqueezy.com/checkout/buy/105f631b-6ff5-47d4-be1f-ed0469fe87ab?checkout[custom][user_id]=${user?.id || ''}`;

    // Video Audit State
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Viral Ideas State
    const [niche, setNiche] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [ideas, setIdeas] = useState<ViralIdea[] | null>(null);
    const [ideasError, setIdeasError] = useState<string | null>(null);

    // Video Audit Functions
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
            setAnalysisResult(null);
            setError(null);
        }
    };

    const handleAnalyze = async () => {
        if (!selectedFile) return;

        setIsAnalyzing(true);
        setError(null);
        setAnalysisResult(null);

        try {
            const formData = new FormData();
            formData.append("video", selectedFile);

            const response = await fetch("/api/audit", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to analyze video");
            }

            const result = await response.json();
            setAnalysisResult(result);

            // Save audit to database with video (fire and forget - don't block UI)
            if (user) {
                const saveFormData = new FormData();
                saveFormData.append("video", selectedFile);
                saveFormData.append("auditData", JSON.stringify({
                    score: result.score,
                    hook_rating: result.hook_rating,
                    retention_rating: result.retention_rating,
                    roast: result.roast,
                    improvements: result.improvements,
                    hashtags: result.hashtags,
                    niche_detected: result.niche_detected
                }));

                fetch("/api/audits/save", {
                    method: "POST",
                    body: saveFormData
                }).then(res => res.json()).then(data => {
                    console.log("Audit saved with video:", data.videoUrl);
                }).catch(err => {
                    console.error("Failed to save audit:", err);
                    // Don't show error to user - saving is optional
                });
            }
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const resetAnalysis = () => {
        setSelectedFile(null);
        setAnalysisResult(null);
        setError(null);
    };

    // Viral Ideas Functions
    const handleGenerateIdeas = async () => {
        if (!niche.trim()) {
            setIdeasError("Please enter a niche");
            return;
        }

        setIsGenerating(true);
        setIdeasError(null);
        setIdeas(null);

        try {
            const response = await fetch("/api/ideas", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ niche: niche.trim() }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to generate ideas");
            }

            const result = await response.json();
            setIdeas(result.ideas);
        } catch (err) {
            setIdeasError((err as Error).message);
        } finally {
            setIsGenerating(false);
        }
    };

    const resetIdeas = () => {
        setNiche("");
        setIdeas(null);
        setIdeasError(null);
    };

    // Helper functions for Video Audit
    const getScoreColor = (score: number) => {
        if (score < 50) return "text-red-500";
        if (score < 80) return "text-orange-500";
        return "text-green-500";
    };

    const getScoreBgColor = (score: number) => {
        if (score < 50) return "from-red-500/20 to-red-600/10";
        if (score < 80) return "from-orange-500/20 to-orange-600/10";
        return "from-green-500/20 to-green-600/10";
    };

    const getRatingColor = (rating: string) => {
        if (rating === "Faible") return "bg-red-500/20 text-red-400 border-red-500/30";
        if (rating === "Moyen") return "bg-orange-500/20 text-orange-400 border-orange-500/30";
        return "bg-green-500/20 text-green-400 border-green-500/30";
    };

    const getRatingProgress = (rating: string) => {
        if (rating === "Faible") return 33;
        if (rating === "Moyen") return 66;
        return 100;
    };

    // Helper functions for Viral Ideas
    const getDifficultyColor = (difficulty: string) => {
        if (difficulty === "Easy") return "bg-green-500/20 text-green-400 border-green-500/50";
        if (difficulty === "Medium") return "bg-orange-500/20 text-orange-400 border-orange-500/50";
        return "bg-red-500/20 text-red-400 border-red-500/50";
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
            {/* Header */}
            <header className="border-b border-white/10 backdrop-blur-sm bg-black/20">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <a
                            href="/"
                            className="text-2xl font-bold bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent cursor-pointer hover:opacity-80 transition"
                        >
                            🔥 ViralRoast
                        </a>

                        {/* Auth Buttons */}
                        <div className="flex items-center gap-4">
                            {/* Credits Badge - Only for logged-in users */}
                            <SignedIn>
                                <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${credits > 0 ? 'bg-green-500/20 border-green-500/50 text-green-400' : 'bg-gray-500/20 border-gray-500/50 text-gray-400'}`}>
                                    <Zap className="w-4 h-4" />
                                    <span className="font-bold text-sm">
                                        Credits: {isPro ? <Infinity className="w-4 h-4 inline" /> : credits}
                                    </span>
                                </div>

                                {/* Dashboard Link */}
                                <Link
                                    href="/dashboard"
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg border border-purple-500/50 bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 hover:border-purple-500 transition"
                                >
                                    <History className="w-4 h-4" />
                                    <span className="font-bold text-sm">Dashboard</span>
                                </Link>
                            </SignedIn>

                            {/* Pricing Link - Visible to all */}
                            <Link
                                href="/pricing"
                                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-yellow-500/50 bg-yellow-500/20 text-yellow-300 hover:bg-yellow-500/30 hover:border-yellow-500 transition"
                            >
                                <Zap className="w-4 h-4" />
                                <span className="font-bold text-sm">Pricing</span>
                            </Link>

                            <SignedOut>
                                <SignInButton mode="modal">
                                    <button className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-white font-semibold hover:shadow-lg hover:shadow-purple-500/50 transform hover:scale-105 transition">
                                        Sign In
                                    </button>
                                </SignInButton>
                            </SignedOut>
                            <SignedIn>
                                <UserButton
                                    appearance={{
                                        elements: {
                                            avatarBox: "w-10 h-10 ring-2 ring-purple-500/50 hover:ring-purple-500 transition"
                                        }
                                    }}
                                />
                            </SignedIn>
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-6 py-12">
                <div className="max-w-6xl mx-auto">
                    {/* Tabs Navigation */}
                    <Tabs defaultValue="audit" className="w-full">
                        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-12 bg-white/5 backdrop-blur-xl border border-white/10 p-1">
                            <TabsTrigger value="audit" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-pink-600 data-[state=active]:text-white">
                                <Flame className="w-4 h-4 mr-2" />
                                Video Audit
                            </TabsTrigger>
                            <TabsTrigger value="ideas" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-blue-600 data-[state=active]:text-white">
                                <Lightbulb className="w-4 h-4 mr-2" />
                                Viral Ideas
                            </TabsTrigger>
                        </TabsList>

                        {/* Video Audit Tab */}
                        <TabsContent value="audit">
                            {analysisResult ? (
                                <VideoAuditResults
                                    result={analysisResult}
                                    onReset={resetAnalysis}
                                    isSignedIn={!!user}
                                    credits={credits}
                                    singleAuditUrl={singleAuditUrl}
                                    proPlanUrl={proPlanUrl}
                                    getScoreColor={getScoreColor}
                                    getScoreBgColor={getScoreBgColor}
                                    getRatingColor={getRatingColor}
                                    getRatingProgress={getRatingProgress}
                                />
                            ) : (
                                <VideoUploadForm
                                    selectedFile={selectedFile}
                                    isAnalyzing={isAnalyzing}
                                    error={error}
                                    onFileChange={handleFileChange}
                                    onAnalyze={handleAnalyze}
                                />
                            )}
                        </TabsContent>

                        {/* Viral Ideas Tab */}
                        <TabsContent value="ideas">
                            <div className="max-w-4xl mx-auto">
                                {!ideas ? (
                                    <ViralIdeasForm
                                        niche={niche}
                                        isGenerating={isGenerating}
                                        error={ideasError}
                                        onNicheChange={setNiche}
                                        onGenerate={handleGenerateIdeas}
                                    />
                                ) : (
                                    <ViralIdeasResults
                                        ideas={ideas}
                                        getDifficultyColor={getDifficultyColor}
                                        onReset={resetIdeas}
                                    />
                                )}
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </main>
        </div>
    );
}

// Component: Video Upload Form
function VideoUploadForm({ selectedFile, isAnalyzing, error, onFileChange, onAnalyze }: any) {
    return (
        <div className="text-center">
            <h2 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
                Don&apos;t post a{" "}
                <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                    flop
                </span>
                .
            </h2>
            <p className="text-2xl md:text-3xl text-gray-300 mb-12">
                Get your video roasted by AI.
            </p>

            <div className="relative group mb-8">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition duration-500"></div>

                <div className="relative bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border border-white/10 rounded-2xl p-12 shadow-2xl">
                    <label htmlFor="video-upload" className="cursor-pointer block">
                        <div className="flex flex-col items-center gap-6">
                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-500 to-pink-600 flex items-center justify-center transform group-hover:scale-110 transition duration-300">
                                {isAnalyzing ? (
                                    <Loader2 className="w-12 h-12 text-white animate-spin" />
                                ) : (
                                    <Upload className="w-12 h-12 text-white" />
                                )}
                            </div>

                            <div>
                                <h3 className="text-2xl font-bold text-white mb-2">
                                    {isAnalyzing ? "Analyzing..." : "Upload Your Video"}
                                </h3>
                                <p className="text-gray-400">
                                    {isAnalyzing
                                        ? "Extracting frames and analyzing content..."
                                        : "Drop your TikTok or Short here to get roasted"}
                                </p>
                            </div>

                            {selectedFile && !isAnalyzing && (
                                <div className="mt-4 px-6 py-3 bg-green-500/20 border border-green-500/50 rounded-lg">
                                    <p className="text-green-400 font-medium">
                                        📹 {selectedFile.name}
                                    </p>
                                </div>
                            )}

                            {!isAnalyzing && (
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        if (selectedFile) {
                                            onAnalyze();
                                        } else {
                                            document.getElementById("video-upload")?.click();
                                        }
                                    }}
                                    className="mt-4 px-8 py-4 bg-gradient-to-r from-orange-500 to-pink-600 rounded-xl text-white font-bold text-lg hover:shadow-2xl hover:shadow-pink-500/50 transform hover:scale-105 transition duration-300"
                                >
                                    {selectedFile ? "Roast This Video 🔥" : "Choose Video"}
                                </button>
                            )}
                        </div>
                    </label>

                    <input
                        id="video-upload"
                        type="file"
                        accept="video/*"
                        onChange={onFileChange}
                        disabled={isAnalyzing}
                        className="hidden"
                    />
                </div>
            </div>

            {error && (
                <div className="mb-8 p-6 bg-red-500/10 border border-red-500/50 rounded-xl">
                    <div className="flex items-center justify-center gap-3 text-red-400">
                        <AlertCircle className="w-6 h-6" />
                        <p className="font-medium">{error}</p>
                    </div>
                </div>
            )}

            <p className="mt-8 text-sm text-gray-500">
                Powered by AI • TikTok & YouTube Shorts optimized
            </p>
        </div>
    );
}

// Component: Video Audit Results
function VideoAuditResults({ result, onReset, isSignedIn, credits, singleAuditUrl, proPlanUrl, getScoreColor, getScoreBgColor, getRatingColor, getRatingProgress }: any) {
    // Determine if user has access to premium content
    // Case A: Not signed in → show login prompt
    // Case B: Signed in but 0 credits → show pricing cards
    // Case C: Signed in with credits > 0 → show full content
    const hasAccess = isSignedIn && credits > 0;
    return (
        <div className="space-y-8">
            {/* Header + Score */}
            <div className="text-center space-y-6">
                <div className="flex items-center justify-center gap-3">
                    <CheckCircle2 className="w-8 h-8 text-green-500" />
                    <h2 className="text-3xl font-bold text-white">ANALYSIS COMPLETE</h2>
                </div>

                <div className={`inline-block bg-gradient-to-br ${getScoreBgColor(result.score)} backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl`}>
                    <div className="text-center">
                        <p className="text-gray-400 text-sm uppercase tracking-wide mb-2">Overall Score</p>
                        <div className={`text-7xl font-extrabold ${getScoreColor(result.score)}`}>
                            {result.score}
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
                        {result.roast}
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
                                <span className={`px-3 py-1 rounded-full text-sm font-bold border ${getRatingColor(result.hook_rating)}`}>
                                    {result.hook_rating}
                                </span>
                            </div>
                            <div className="w-full bg-gray-700/50 rounded-full h-3 overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all duration-1000 ${result.hook_rating === "Faible" ? "bg-red-500" :
                                        result.hook_rating === "Moyen" ? "bg-orange-500" :
                                            "bg-green-500"
                                        }`}
                                    style={{ width: `${getRatingProgress(result.hook_rating)}%` }}
                                ></div>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-gray-300 font-medium">Retention Rating</span>
                                <span className={`px-3 py-1 rounded-full text-sm font-bold border ${getRatingColor(result.retention_rating)}`}>
                                    {result.retention_rating}
                                </span>
                            </div>
                            <div className="w-full bg-gray-700/50 rounded-full h-3 overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all duration-1000 ${result.retention_rating === "Faible" ? "bg-red-500" :
                                        result.retention_rating === "Moyen" ? "bg-orange-500" :
                                            "bg-green-500"
                                        }`}
                                    style={{ width: `${getRatingProgress(result.retention_rating)}%` }}
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
                        {result.improvements.map((improvement: string, index: number) => (
                            <div key={index} className={`relative flex items-start gap-3 p-3 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition ${!hasAccess && index > 0 ? 'blur-md select-none' : ''}`}>
                                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
                                    {index + 1}
                                </div>
                                <p className="text-gray-300 text-sm leading-relaxed">{improvement}</p>

                                {/* Lock icon overlay for tip #2 */}
                                {!hasAccess && index === 1 && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Lock className="w-6 h-6 text-yellow-500" />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>


                    {/* Premium CTA for locked tips - Dual Pricing Cards */}
                    {!hasAccess && result.improvements.length > 1 && (
                        <div className="mt-4 p-6 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-2 border-yellow-500/30 rounded-xl">
                            <Lock className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                            <p className="text-white font-bold mb-1 text-center">Unlock Full Action Plan</p>
                            <p className="text-gray-400 text-xs mb-4 text-center">Choose your option</p>

                            {/* Compact Pricing Cards */}
                            <div className="grid grid-cols-2 gap-3">
                                {/* Single Audit Option */}
                                <a
                                    href={singleAuditUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block bg-slate-800/60 border border-white/20 rounded-lg p-3 hover:border-white/40 transition text-center"
                                >
                                    <p className="text-xs text-gray-400 mb-1">⚡️ Single Audit</p>
                                    <p className="text-xl font-bold text-white mb-2">$4.99</p>
                                    <span className="inline-block text-xs px-3 py-1 bg-gray-600 rounded text-white font-medium">
                                        Unlock Now
                                    </span>
                                </a>

                                {/* Pro Plan Option */}
                                <a
                                    href={proPlanUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block bg-gradient-to-br from-purple-900/60 to-pink-900/60 border-2 border-yellow-500/50 rounded-lg p-3 hover:border-yellow-500/70 transition text-center relative"
                                >
                                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                                        <span className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                                            BEST
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-200 mb-1">👑 Pro Creator</p>
                                    <p className="text-xl font-bold text-white mb-2">$9.99<span className="text-sm">/mo</span></p>
                                    <span className="inline-block text-xs px-3 py-1 bg-gradient-to-r from-yellow-500 to-orange-600 rounded text-white font-bold">
                                        Start Pro
                                    </span>
                                </a>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Virality Insights with Paywall */}
            <div className={`bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl ${!hasAccess ? 'relative' : ''}`}>
                <div className="flex items-center gap-2 mb-6">
                    <TrendingUp className="w-6 h-6 text-pink-500" />
                    <h3 className="text-xl font-bold text-white">Virality Insights</h3>
                </div>

                {/* Content (blurred if not premium) */}
                <div className={!hasAccess ? 'blur-lg select-none' : 'space-y-4'}>
                    <div>
                        <p className="text-gray-400 text-sm mb-2">Detected Niche</p>
                        <div className="inline-block px-4 py-2 bg-gradient-to-r from-purple-600/30 to-pink-600/30 border border-purple-500/50 rounded-full">
                            <span className="text-white font-bold">{result.niche_detected}</span>
                        </div>
                    </div>

                    <div>
                        <p className="text-gray-400 text-sm mb-3">Recommended Hashtags</p>
                        <div className="flex flex-wrap gap-2">
                            {result.hashtags.map((hashtag: string, index: number) => (
                                <button
                                    key={index}
                                    onClick={() => navigator.clipboard.writeText(hashtag)}
                                    className="group flex items-center gap-1 px-3 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg text-blue-400 transition cursor-pointer"
                                    title="Click to copy"
                                >
                                    <Hash className="w-3 h-3" />
                                    <span className="text-sm font-medium">{hashtag.replace('#', '')}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Premium unlock overlay - Dual Pricing Cards */}
                {!hasAccess && (
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-md rounded-2xl flex flex-col items-center justify-center z-10 p-6 overflow-y-auto">
                        <Lock className="w-12 h-12 text-yellow-500 mb-3" />

                        {/* CASE A: Not Signed In - Show Login Prompt */}
                        {!isSignedIn ? (
                            <>
                                <p className="text-white font-bold text-2xl mb-2 text-center">Sign In to Unlock</p>
                                <p className="text-gray-400 text-sm mb-6 text-center">Create an account to access premium insights</p>
                                <SignInButton mode="modal">
                                    <button className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white font-bold text-lg hover:shadow-2xl hover:shadow-purple-500/50 transform hover:scale-105 transition">
                                        Login to Unlock
                                    </button>
                                </SignInButton>
                            </>
                        ) : (
                            /* CASE B: Signed In but 0 Credits - Show Pricing Cards */
                            <>
                                <p className="text-white font-bold text-2xl mb-2 text-center">Unlock Premium Insights</p>
                                <p className="text-gray-400 text-sm mb-6 text-center">Choose the plan that fits your needs</p>

                                {/* Pricing Cards Container */}
                                <div className="grid md:grid-cols-2 gap-4 max-w-2xl w-full">
                                    {/* Single Audit Card */}
                                    <div className="bg-gradient-to-br from-slate-800/80 to-slate-700/80 border border-white/20 rounded-xl p-6 flex flex-col">
                                        <div className="mb-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="text-2xl">⚡️</span>
                                                <h3 className="text-xl font-bold text-white">Single Audit</h3>
                                            </div>
                                            <div className="mb-1">
                                                <span className="text-4xl font-extrabold text-white">$4.99</span>
                                            </div>
                                            <p className="text-gray-400 text-sm">One-time payment</p>
                                        </div>

                                        <ul className="space-y-3 mb-6 flex-1">
                                            <li className="flex items-start gap-2 text-gray-300 text-sm">
                                                <span className="text-green-500 mt-0.5">✓</span>
                                                <span>Unlock this report only</span>
                                            </li>
                                            <li className="flex items-start gap-2 text-gray-300 text-sm">
                                                <span className="text-green-500 mt-0.5">✓</span>
                                                <span>Instant Access</span>
                                            </li>
                                            <li className="flex items-start gap-2 text-gray-300 text-sm">
                                                <span className="text-green-500 mt-0.5">✓</span>
                                                <span>No Subscription</span>
                                            </li>
                                        </ul>

                                        <a
                                            href={singleAuditUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block text-center px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 rounded-lg text-white font-bold hover:from-gray-500 hover:to-gray-600 transform hover:scale-105 transition"
                                        >
                                            Unlock Now
                                        </a>
                                    </div>

                                    {/* Pro Creator Card (Highlighted) */}
                                    <div className="relative bg-gradient-to-br from-purple-900/80 to-pink-900/80 border-2 border-yellow-500/60 rounded-xl p-6 flex flex-col transform md:scale-105 shadow-2xl shadow-yellow-500/20">
                                        {/* Best Value Badge */}
                                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                                            <span className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg">
                                                BEST VALUE
                                            </span>
                                        </div>

                                        <div className="mb-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="text-2xl">👑</span>
                                                <h3 className="text-xl font-bold text-white">Pro Creator</h3>
                                            </div>
                                            <div className="mb-1">
                                                <span className="text-4xl font-extrabold text-white">$9.99</span>
                                                <span className="text-gray-300 text-lg"> / mo</span>
                                            </div>
                                            <p className="text-gray-300 text-sm">Cancel anytime</p>
                                        </div>

                                        <ul className="space-y-3 mb-6 flex-1">
                                            <li className="flex items-start gap-2 text-white text-sm font-medium">
                                                <span className="text-yellow-400 mt-0.5">🚀</span>
                                                <span>Unlimited Audits</span>
                                            </li>
                                            <li className="flex items-start gap-2 text-white text-sm font-medium">
                                                <span className="text-yellow-400 mt-0.5">💡</span>
                                                <span>Viral Ideas Generator</span>
                                            </li>
                                            <li className="flex items-start gap-2 text-white text-sm font-medium">
                                                <span className="text-green-400 mt-0.5">✓</span>
                                                <span>Cancel Anytime</span>
                                            </li>
                                        </ul>

                                        <a
                                            href={proPlanUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block text-center px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-lg text-white font-bold hover:shadow-2xl hover:shadow-yellow-500/50 transform hover:scale-105 transition"
                                        >
                                            Start Pro Plan
                                        </a>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>

            {/* Upload Another Button */}
            <div className="text-center pt-6">
                <button
                    onClick={onReset}
                    className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-pink-600 rounded-xl text-white font-bold text-lg hover:shadow-2xl hover:shadow-pink-500/50 transform hover:scale-105 transition duration-300"
                >
                    <RotateCcw className="w-5 h-5" />
                    Upload Another Video
                </button>
            </div>
        </div>
    );
}

// Component: Viral Ideas Form
function ViralIdeasForm({ niche, isGenerating, error, onNicheChange, onGenerate }: any) {
    return (
        <div className="text-center">
            <h2 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
                Never run out of{" "}
                <span className="bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
                    content ideas
                </span>
                .
            </h2>
            <p className="text-xl md:text-2xl text-gray-300 mb-12">
                AI-powered viral video concepts for your niche
            </p>

            <div className="relative group mb-8">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition duration-500"></div>

                <div className="relative bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border border-white/10 rounded-2xl p-12 shadow-2xl">
                    <div className="max-w-md mx-auto space-y-6">
                        <div>
                            <label htmlFor="niche-input" className="block text-white font-bold text-lg mb-3">
                                Enter your niche
                            </label>
                            <input
                                id="niche-input"
                                type="text"
                                value={niche}
                                onChange={(e) => onNicheChange(e.target.value)}
                                placeholder="e.g., Crypto, Cooking, Fitness..."
                                disabled={isGenerating}
                                className="w-full px-6 py-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 transition"
                            />
                        </div>

                        <button
                            onClick={onGenerate}
                            disabled={isGenerating || !niche.trim()}
                            className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-600 rounded-xl text-white font-bold text-lg hover:shadow-2xl hover:shadow-purple-500/50 transform hover:scale-105 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {isGenerating ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <Zap className="w-5 h-5" />
                                    Generate 3 Viral Concepts
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {error && (
                <div className="mb-8 p-6 bg-red-500/10 border border-red-500/50 rounded-xl max-w-md mx-auto">
                    <div className="flex items-center justify-center gap-3 text-red-400">
                        <AlertCircle className="w-6 h-6" />
                        <p className="font-medium">{error}</p>
                    </div>
                </div>
            )}

            <p className="mt-8 text-sm text-gray-500">
                Powered by AI • Get fresh ideas instantly
            </p>
        </div>
    );
}

// Component: Viral Ideas Results
function ViralIdeasResults({ ideas, getDifficultyColor, onReset }: any) {
    return (
        <div className="space-y-8">
            <div className="text-center">
                <div className="flex items-center justify-center gap-3 mb-4">
                    <CheckCircle2 className="w-8 h-8 text-green-500" />
                    <h2 className="text-3xl font-bold text-white">CONCEPTS GENERATED</h2>
                </div>
                <p className="text-gray-400">Here are 3 viral video ideas for you</p>
            </div>

            {/* Concept Cards */}
            <div className="grid gap-6">
                {ideas.map((idea: ViralIdea, index: number) => (
                    <div key={index} className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-500"></div>

                        <div className="relative bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <h3 className="text-2xl font-bold text-white mb-2">{idea.title}</h3>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-sm font-bold border ${getDifficultyColor(idea.difficulty)}`}>
                                    {idea.difficulty}
                                </span>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                                        <span className="text-white font-bold text-sm">👁️</span>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Visual Hook</p>
                                        <p className="text-gray-300">{idea.visual_hook}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
                                        <span className="text-white font-bold text-sm">🎤</span>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Audio Hook</p>
                                        <p className="text-gray-300">{idea.audio_hook}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Generate More Button */}
            <div className="text-center pt-6">
                <button
                    onClick={onReset}
                    className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-600 rounded-xl text-white font-bold text-lg hover:shadow-2xl hover:shadow-purple-500/50 transform hover:scale-105 transition duration-300"
                >
                    <RotateCcw className="w-5 h-5" />
                    Generate More Ideas
                </button>
            </div>
        </div>
    );
}
