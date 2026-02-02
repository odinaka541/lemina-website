'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Loader2, ArrowRight, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import BrandLogo from '@/components/ui/BrandLogo'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [sent, setSent] = useState(false)
    const [isSignUp, setIsSignUp] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    const handleMagicLink = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        // MOCK AUTH for Demo
        setTimeout(() => {
            setLoading(false)
            setSent(true)

            // Redirect to dashboard after showing success for a moment
            setTimeout(() => {
                router.push('/dashboard')
            }, 2000)
        }, 1500)
    }

    const handleGoogleLogin = async () => {
        setLoading(true)
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${location.origin}/auth/callback`,
                    queryParams: {
                        access_type: 'offline',
                        prompt: 'consent',
                    },
                },
            })
            if (error) throw error
        } catch (err: any) {
            setError(err.message)
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-[#030712]">
            {/* Left Side - Visuals */}
            <div className="hidden md:flex flex-col justify-between w-1/2 relative overflow-hidden p-16">
                {/* Background */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/40 via-[#030712] to-[#030712]"></div>
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('/assets/grid-pattern.svg')] opacity-20"></div>
                    {/* Reflective/Glassy Effect Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>
                </div>

                {/* Logo */}
                <div className="relative z-10 w-fit">
                    <BrandLogo />
                </div>

                {/* Main Content */}
                <div className="relative z-10 max-w-lg">
                    <h1 className="text-5xl font-light text-white mb-8 leading-tight tracking-tight">
                        Your entire <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400 font-normal">
                            investment career
                        </span><br />
                        on one platform.
                    </h1>

                    <div className="space-y-8">
                        <p className="text-lg font-light text-gray-300 leading-relaxed border-l-2 border-emerald-500/30 pl-6 py-2">
                            From deal discovery to portfolio exit—comprehensive intelligence infrastructure. Everything you need to invest smarter and faster - all in one place.
                        </p>
                    </div>
                </div>

                {/* Footer / Four Pillars */}
                <div className="relative z-10">
                    <div className="grid grid-cols-2 gap-6">
                        {[
                            "Verified Intelligence",
                            "Unified Deal Pipeline",
                            "AI-Powered Due Diligence",
                            "Network Collaboration"
                        ].map((pillar, index) => (
                            <div key={index} className="flex items-center gap-3 text-gray-400">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/50"></div>
                                <span className="text-sm font-light tracking-wide">{pillar}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Side - Auth Form */}
            <div className="flex-1 flex items-center justify-center p-8 md:p-16 bg-white dark:bg-[#030712] border-l border-white/5">
                <div className="w-full max-w-[400px] space-y-8">
                    {/* Mobile Logo */}
                    <div className="md:hidden flex justify-center mb-8">
                        <BrandLogo />
                    </div>

                    <div className="space-y-2">
                        <h2 className="text-3xl font-light text-white tracking-tight">
                            {isSignUp ? 'Create your account' : 'Welcome back'}
                        </h2>
                        <p className="text-gray-400 font-light">
                            {isSignUp ? 'Sign up to access the platform' : 'Continue where you left off. Sign in to your intelligence platform'}
                        </p>
                    </div>

                    {sent ? (
                        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-6 text-center space-y-4">
                            <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto">
                                <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                            </div>
                            <div>
                                <h3 className="text-white font-medium mb-1">Check your email</h3>
                                <p className="text-sm text-gray-400 font-light">
                                    We've sent a magic link to <span className="text-white">{email}</span>
                                </p>
                            </div>
                            <button
                                onClick={() => setSent(false)}
                                className="text-sm text-emerald-500 hover:text-emerald-400 font-medium"
                            >
                                Try another email
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleMagicLink} className="space-y-5">
                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-gray-300">Email address</label>
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-gray-900/50 border border-gray-800 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none placeholder:text-gray-600 font-light"
                                        placeholder="name@mail.com"
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-light">
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        {isSignUp ? 'Sign Up with Magic Link' : 'Sign In with Magic Link'}
                                        <ArrowRight className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        </form>
                    )}

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-800"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-[#030712] text-gray-500 font-light">Or continue with</span>
                        </div>
                    </div>

                    <button
                        onClick={handleGoogleLogin}
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-3 bg-white text-gray-900 hover:bg-gray-100 py-3 px-4 rounded-xl font-medium transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed border border-gray-200"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                fill="#4285F4"
                            />
                            <path
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                fill="#34A853"
                            />
                            <path
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                fill="#FBBC05"
                            />
                            <path
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                fill="#EA4335"
                            />
                        </svg>
                        Google
                    </button>

                    <p className="text-center text-sm text-gray-400 font-light">
                        {isSignUp ? "Already have an account? " : "Don't have an account? "}
                        <button
                            onClick={() => setIsSignUp(!isSignUp)}
                            className="text-emerald-500 hover:text-emerald-400 font-medium transition-colors"
                        >
                            {isSignUp ? 'Log in' : 'Sign up'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    )
}
