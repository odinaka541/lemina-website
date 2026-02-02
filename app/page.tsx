'use client';

import Link from 'next/link';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Menu, X, ArrowUpRight, Check } from 'lucide-react';
import HeroGrid from '@/components/landing/HeroGrid';
import BrandLogo from '@/components/ui/BrandLogo';
import PlusGridBackdrop from '@/components/landing/PlusGridBackdrop';
import BottomGrid from '@/components/landing/BottomGrid';
import PricingSection from '@/components/landing/PricingSection';
import FAQSection from '@/components/landing/FAQSection';
import Footer from '@/components/landing/Footer';

interface Company {
    name: string;
    stage: string;
    location: string;
    logo: string | null;
    lastUpdated: string;
    flags: string[];
    description: string;
    metrics: { label: string; value: string }[];
}

const companies: Company[] = [
    {
        name: "SerenDPT AI",
        stage: "Pre-seed",
        location: "Lagos, Nigeria",
        logo: null,
        lastUpdated: "2 days ago",
        flags: ["ng"],
        description: "AI that reads your uploaded books aloud and provides real-time answers to your questions using voice technology",
        metrics: [
            { label: "Funding Stage", value: "F&F, Less than $5K" },
            { label: "Business Model", value: "B2C Subscription & B2B Licensing" },
            { label: "Traction Signals", value: "400+ Active Users, growing 20% MoM" },
            { label: "Market Opportunity", value: "Multi-billion dollar industry need for accessible knowledge" },
            { label: "Why Promising?", value: "First-mover advantage in voice-first knowledge retrieval" },
            { label: "Regulatory Status", value: "Compliant (Data Protection)" }
        ]
    },
    {
        name: "TikiAnaly",
        stage: "Pre-seed",
        location: "Lagos, Nigeria",
        logo: null,
        lastUpdated: "5h ago",
        flags: ["ng", "es"],
        description: "Social sports platform connecting fans, athletes, analysts, and clubs via banter, data, and community engagement",
        metrics: [
            { label: "Funding Stage", value: "Pre-seed | $500k (Seed Ask)" },
            { label: "Business Model", value: "Freemium + Ad Revenue" },
            { label: "Traction Signals", value: "1001+ Waitlist, High Engagement" },
            { label: "Market Opportunity", value: "Untapped niche in social sports engagement" },
            { label: "Why Promising?", value: "Monopolist in its niche: Sports-only, healthy banter space" },
            { label: "Regulatory Status", value: "N/A" }
        ]
    }
];

function HomeContent() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const code = searchParams?.get('code');

    useEffect(() => {
        if (code) {
            const supabase = createClient();
            supabase.auth.exchangeCodeForSession(code).then(({ data, error }) => {
                if (!error && data.session) {
                    router.push('/app/companies');
                } else {
                    console.error('Auth error:', error);
                }
            });
        }
    }, [code, router]);


    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % companies.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + companies.length) % companies.length);
    };

    return (
        <div className="relative min-h-screen w-full overflow-x-hidden">
            <HeroGrid />
            <div className="container mx-auto bg-transparent relative z-10">
                <nav className="flex justify-between items-center h-20 sticky top-0 z-50 px-6 mx-auto max-w-7xl">
                    <BrandLogo textClassName="hidden md:block" />

                    {/* Desktop Nav - Encapsulated Pill */}
                    <div className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2 backdrop-blur-xl bg-[var(--nav-bg)]/80 border border-[var(--glass-border-color)] rounded-full px-2 py-1 shadow-sm">
                        <a href="#how-it-works" className="text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] px-4 py-2 rounded-full hover:bg-[var(--glass-border-color)]/50 transition-all">
                            How it Works
                        </a>
                        <a href="#pricing" className="text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] px-4 py-2 rounded-full hover:bg-[var(--glass-border-color)]/50 transition-all">
                            Pricing
                        </a>
                        <Link href="/auth" className="text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] px-4 py-2 rounded-full hover:bg-[var(--glass-border-color)]/50 transition-all">
                            Investors
                        </Link>
                    </div>

                    {/* Desktop Actions */}
                    <div className="hidden md:flex items-center gap-3">
                        <button
                            onClick={() => {
                                const newTheme = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
                                document.documentElement.setAttribute('data-theme', newTheme);
                            }}
                            className="p-2.5 rounded-full border border-[var(--glass-border-color)] bg-[var(--nav-bg)]/50 backdrop-blur-md text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="hidden [html[data-theme='light']_&]:block">
                                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                            </svg>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="block [html[data-theme='light']_&]:hidden">
                                <circle cx="12" cy="12" r="4" />
                                <path d="M12 2v2" />
                                <path d="M12 20v2" />
                                <path d="m4.93 4.93 1.41 1.41" />
                                <path d="m17.66 17.66 1.41 1.41" />
                                <path d="M2 12h2" />
                                <path d="M20 12h2" />
                                <path d="m6.34 17.66-1.41 1.41" />
                                <path d="m19.07 4.93-1.41 1.41" />
                            </svg>
                        </button>
                        <Link href="/auth" className="text-sm font-medium px-5 py-2.5 rounded-full border border-[var(--glass-border-color)] bg-[var(--nav-bg)]/50 backdrop-blur-md text-[var(--color-text-primary)] hover:bg-[var(--glass-border-color)] transition-all">
                            Log In
                        </Link>
                        <a href="mailto:odinaka@lemina.co" className="text-sm font-medium py-2.5 px-5 bg-[var(--color-text-primary)] text-[var(--color-bg-primary)] rounded-full hover:opacity-90 transition-all shadow-lg shadow-[var(--color-accent-primary)]/10">
                            Request Demo
                        </a>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden text-[var(--color-text-primary)] p-2"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>

                    {/* Mobile Menu Dropdown */}
                    {/* Mobile Menu Dropdown - Pill Style */}
                    {isMobileMenuOpen && (
                        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-max bg-[#0A0F1E] border border-white/10 rounded-full px-6 py-3 shadow-2xl flex items-center gap-6 md:hidden animate-in fade-in slide-in-from-top-2 z-50">
                            <a href="#how-it-works" className="text-sm font-medium text-gray-300 hover:text-white transition-colors whitespace-nowrap" onClick={() => setIsMobileMenuOpen(false)}>
                                How it Works
                            </a>
                            <a href="#pricing" className="text-sm font-medium text-gray-300 hover:text-white transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                                Pricing
                            </a>
                            <Link href="/auth" className="text-sm font-medium text-gray-300 hover:text-white transition-colors whitespace-nowrap" onClick={() => setIsMobileMenuOpen(false)}>
                                Log In
                            </Link>
                        </div>
                    )}
                </nav>

                {/* SECTION 1: HERO */}
                <section style={{
                    padding: '120px 0 80px',
                    textAlign: 'center',
                    maxWidth: '800px',
                    margin: '0 auto'
                }} className="animate-fade-in">
                    <div style={{
                        display: 'inline-block',
                        padding: '6px 16px',
                        borderRadius: '100px',
                        background: 'rgba(16, 185, 129, 0.1)',
                        border: '1px solid rgba(16, 185, 129, 0.2)',
                        color: 'var(--color-accent-primary)',
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        marginBottom: '24px'
                    }}>
                        The intelligence layer for African private markets
                    </div>
                    <h1 style={{ marginBottom: '24px', fontSize: '3.5rem', lineHeight: '1.1', letterSpacing: '-0.02em' }}>
                        ...starting with <br />
                        <span className="text-gradient">intelligence</span>
                    </h1>
                    <p style={{ fontSize: '1.25rem', maxWidth: '600px', margin: '0 auto 48px', color: 'var(--color-text-secondary)' }}>
                        From deal discovery to portfolio management—one platform built specifically for investors navigating African tech. Verified data, AI-powered due diligence, and network coordination in one place.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full px-4">
                        <a href="mailto:odinaka@lemina.co" className="group flex items-center p-1 pr-6 rounded-full bg-white hover:bg-gray-50 transition-all border border-transparent hover:border-[var(--color-accent-primary)]/20 shadow-lg shadow-[var(--color-accent-primary)]/10 w-full sm:w-auto justify-start">
                            <div className="w-10 h-10 rounded-full bg-[var(--color-accent-primary)] flex items-center justify-center text-white mr-3 shrink-0 group-hover:scale-110 transition-transform">
                                <ArrowUpRight size={20} />
                            </div>
                            <span className="font-semibold text-lg text-slate-900 tracking-tight whitespace-nowrap">Get Early Access</span>
                        </a>
                        <a href="#how-it-works" className="btn btn-secondary w-full sm:w-auto justify-center">See How It Works</a>
                    </div>
                </section>

                {/* SECTION 2: HIGHLIGHTS CAROUSEL */}
                <section className="py-20 px-6 relative">
                    <PlusGridBackdrop className="h-[150%]" />
                    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-start relative z-10">
                        {/* LEFT COLUMN: Highlights Header + Slider (Span 8) */}
                        <div className="lg:col-span-8 glass-panel p-6 md:p-8 relative overflow-hidden h-full">
                            <div className="flex justify-between items-end mb-2 border-b border-[var(--color-border)] pb-3">
                                <div>
                                    <h3 className="text-xl mb-1">Highlights on Who to Watch</h3>
                                    <p className="text-sm text-[var(--color-text-secondary)]">Early-stage innovators driving change.</p>
                                </div>
                                <div className="flex gap-3">
                                    <button onClick={prevSlide} className="p-2 rounded-full border border-[var(--glass-border-color)] hover:border-[var(--color-accent-primary)] hover:text-[var(--color-accent-primary)] transition-all">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="24.00" viewBox="0 0 40 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M37 12H3" /><path d="M9 18L3 12L9 6" /></svg>
                                    </button>
                                    <button onClick={nextSlide} className="p-2 rounded-full border border-[var(--glass-border-color)] hover:border-[var(--color-accent-primary)] hover:text-[var(--color-accent-primary)] transition-all">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="24.00" viewBox="0 0 40 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12h34" /><path d="m31 18 6-6-6-6" /></svg>
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-[1fr_1.5fr] gap-8">
                                <div className="flex flex-col h-full animate-in fade-in duration-300" key={currentSlide}>
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-12 h-12 rounded-full shrink-0 bg-[var(--color-bg-secondary)] flex items-center justify-center text-2xl border border-[var(--glass-border-color)]">
                                            {companies[currentSlide].name.includes('Seren') ? "🔵" : "🟠"}
                                        </div>
                                        <div>
                                            <h4 className="text-3xl font-light leading-tight mb-2">{companies[currentSlide].name}</h4>
                                            <div className="inline-block px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-semibold">
                                                {companies[currentSlide].stage}
                                            </div>
                                        </div>
                                    </div>

                                    <p className="text-base text-[var(--color-text-primary)] leading-relaxed mb-8 flex-1">
                                        {companies[currentSlide].description}
                                    </p>

                                    <div className="mb-4 flex items-center gap-2">
                                        <div className="flex gap-2">
                                            {companies[currentSlide].flags.map((flag, i) => (
                                                <img
                                                    key={i}
                                                    src={`https://flagcdn.com/24x18/${flag}.png`}
                                                    alt={flag}
                                                    className="w-6 h-[18px] object-cover rounded-sm"
                                                />
                                            ))}
                                        </div>
                                        <span className="text-[var(--color-text-secondary)] text-sm">HQ: {companies[currentSlide].location}</span>
                                    </div>

                                    <button className="w-full p-4 rounded-full border border-[var(--glass-border-color)] bg-transparent text-[var(--color-text-primary)] text-base font-semibold transition-all duration-300 hover:border-[var(--color-accent-primary)] hover:text-[var(--color-accent-primary)] hover:-translate-y-1">
                                        Request Full Profile
                                    </button>
                                </div>

                                <div className="flex flex-col justify-between animate-in fade-in duration-300" key={`metrics-${currentSlide}`}>
                                    <div className="grid grid-cols-2 gap-3">
                                        {companies[currentSlide].metrics.map((metric, index) => (
                                            <div key={index} className="bg-[var(--card-bg)] p-3 rounded-lg border border-[var(--glass-border-color)]">
                                                <div className="text-[0.7rem] text-[var(--color-text-secondary)] mb-0.5 uppercase tracking-wide">{metric.label}</div>
                                                <div className="text-sm font-medium leading-tight text-[var(--color-text-primary)]">{metric.value}</div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex justify-end items-center mt-4 gap-1.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent-primary)] shadow-[0_0_8px_var(--color-accent-primary)]"></div>
                                        <span className="text-xs text-[var(--color-text-secondary)] italic">
                                            Last updated {companies[currentSlide].lastUpdated}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Value Cards (Span 4) */}
                        <div className="lg:col-span-4 flex flex-col gap-6" id="how-it-works">
                            <div className="glass-panel p-8 flex-1">
                                <div className="text-5xl mb-4 opacity-20 font-light">01</div>
                                <h3 className="text-2xl mb-3">Built for investors</h3>
                                <p className="text-base text-[var(--color-text-secondary)]">Verified data, AI due diligence, and portfolio tracking — designed for angels, VCs, and institutional investors making decisions in emerging markets.</p>
                            </div>
                            <div className="glass-panel p-8 flex-1">
                                <div className="text-5xl mb-4 opacity-20 font-light">02</div>
                                <h3 className="text-2xl mb-3">Curated deal flow</h3>
                                <p className="text-base text-[var(--color-text-secondary)]">Lemina surfaces emerging opportunities matching your investment thesis across sectors, giving you first-mover advantage.</p>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="relative">
                    <BottomGrid />

                    {/* SECTION 3: VALUE PROPOSITION */}
                    <section style={{ padding: '100px 0', textAlign: 'center' }}>
                        <div style={{ marginBottom: '60px' }}>
                            <h2 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>Everything you need to invest smarter</h2>
                            <p style={{ maxWidth: '600px', margin: '0 auto', color: 'var(--color-text-secondary)' }}>We've built comprehensive infrastructure that supports every aspect of the investment workflow—from discovery to exit.</p>
                        </div>

                        <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { title: "Verified Intelligence", desc: "Institutional-grade data verified via regulatory filings. Every point is traceable and sourced—replacing guesswork with certainty." },
                                { title: "Unified Deal Pipeline", desc: "Move beyond spreadsheets. Track every opportunity from discovery to close in a seamless, purpose-built deal pipeline." },
                                { title: "AI-Powered Due Diligence", desc: "More than just diligence. Generate instant investment memos, market assessments, and competitive mapping in minutes." },
                                { title: "Network Collaboration", desc: "Built for investment networks. Share deal flow, coordinate allocations, and centralize discussions in one secure space." }
                            ].map((item, i) => (
                                <div key={i} className="glass-panel text-left p-6 h-full flex flex-col">
                                    <h3 style={{ fontSize: '1.25rem', marginBottom: '12px', fontWeight: 600 }}>{item.title}</h3>
                                    <p style={{ fontSize: '0.9375rem', lineHeight: '1.6', color: 'var(--color-text-secondary)' }}>{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* SECTION 4: DASHBOARD */}
                    <section style={{ padding: '100px 0' }}>
                        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                            <div>
                                <div style={{ color: 'var(--color-accent-primary)', fontWeight: 600, marginBottom: '16px', letterSpacing: '0.05em' }}>AVAILABLE NOW</div>
                                <h2 style={{ fontSize: '3rem', marginBottom: '24px', lineHeight: '1.1' }}>Your complete investment operating system</h2>
                                <p style={{ fontSize: '1.125rem', marginBottom: '40px', color: 'var(--color-text-secondary)', lineHeight: '1.6' }}>
                                    Everything you need for your entire investment career—in one platform. Discover opportunities, run AI-powered due diligence, coordinate with your network, monitor portfolio health, and track from first check to exit. Built specifically for investors navigating emerging markets.
                                </p>

                                <a href="mailto:odinaka@lemina.co" className="group flex items-center p-1 pr-6 rounded-full bg-white hover:bg-gray-50 transition-all border border-transparent hover:border-[var(--color-accent-primary)]/20 shadow-lg shadow-[var(--color-accent-primary)]/10 w-fit">
                                    <div className="w-10 h-10 rounded-full bg-[var(--color-accent-primary)] flex items-center justify-center text-white mr-4 group-hover:scale-110 transition-transform">
                                        <ArrowUpRight size={20} />
                                    </div>
                                    <span className="font-semibold text-lg text-slate-900 tracking-tight">Request Demo</span>
                                </a>
                            </div>
                            <div className="glass-panel p-4 md:p-10 relative min-h-[500px] flex items-center justify-center bg-gradient-to-br from-[var(--nav-bg)] to-transparent border border-[var(--glass-border-color)]">
                                {/* Mock Dashboard UI to replace placeholder */}
                                <div className="w-full h-full flex flex-col gap-4 opacity-100">
                                    <div className="flex gap-4">
                                        <div className="w-1/3 h-32 bg-white/5 rounded-xl border border-white/10 animate-pulse"></div>
                                        <div className="w-1/3 h-32 bg-white/5 rounded-xl border border-white/10 animate-pulse delay-75"></div>
                                        <div className="w-1/3 h-32 bg-white/5 rounded-xl border border-white/10 animate-pulse delay-150"></div>
                                    </div>
                                    <div className="flex-1 bg-white/5 rounded-xl border border-white/10 p-6">
                                        <div className="w-1/4 h-6 bg-white/10 rounded mb-6"></div>
                                        <div className="space-y-4">
                                            {[1, 2, 3, 4].map(i => (
                                                <div key={i} className="h-16 bg-white/5 rounded-lg w-full"></div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* SECTION 5: SAMPLE REPORT */}
                    <section style={{ padding: '80px 0' }}>
                        <div className="max-w-6xl mx-auto px-6">
                            <div className="glass-panel p-10 md:p-16 flex flex-col md:flex-row gap-12 items-center">
                                <div className="flex-1">
                                    <h2 style={{ fontSize: '2.5rem', marginBottom: '24px' }}>See our intelligence in action</h2>
                                    <p style={{ fontSize: '1.125rem', marginBottom: '32px', color: 'var(--color-text-secondary)' }}>
                                        We analyzed emerging African tech companies with investment-grade  analysis. See exactly what our platform delivers.
                                    </p>
                                    <a href="mailto:odinaka@lemina.co" className="btn btn-secondary inline-flex items-center gap-2">
                                        View Sample Report <ArrowUpRight size={16} />
                                    </a>
                                </div>
                                <div className="flex-1 w-full max-w-md bg-black/20 rounded-xl p-4 border border-white/10 rotate-2 hover:rotate-0 transition-transform duration-500">
                                    <div className="rating gap-1 mb-2 flex">
                                        {[1, 2, 3, 4, 5].map(i => <div key={i} className="w-2 h-2 rounded-full bg-[var(--color-accent-primary)]"></div>)}
                                    </div>
                                    <div className="h-4 w-3/4 bg-white/20 rounded mb-3"></div>
                                    <div className="h-3 w-full bg-white/10 rounded mb-2"></div>
                                    <div className="h-3 w-5/6 bg-white/10 rounded mb-2"></div>
                                    <div className="h-3 w-4/6 bg-white/10 rounded mb-6"></div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="h-20 bg-white/5 rounded border border-white/5"></div>
                                        <div className="h-20 bg-white/5 rounded border border-white/5"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* SECTION 6: FOUNDER CTA (Option 3) */}
                    <section className="relative py-32 overflow-hidden">
                        {/* Background: Visible Pluses End-to-End */}
                        <PlusGridBackdrop baseOpacity={0.15} className="z-0" />

                        <div className="max-w-7xl mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                            {/* Left: Spacing for pluses to show */}
                            <div className="hidden lg:block lg:col-span-4"></div>

                            {/* Right: Content */}
                            <div className="lg:col-span-8 text-left lg:text-right">
                                <h2 className="text-4xl md:text-6xl font-light mb-6">Know a company we should track?</h2>
                                <p className="text-xl text-[var(--color-text-secondary)] mb-10 leading-relaxed ml-auto max-w-xl">
                                    We're constantly expanding our coverage. If you know an African tech company doing interesting work, submit them for Lemina to review. Verified profiles typically go live within days.
                                </p>
                                <div className="flex flex-col lg:flex-row gap-4 justify-end items-center">
                                    <span className="text-sm text-[var(--color-text-secondary)] italic mr-4">
                                        Note: Lemina is an intelligence platform for investors. <br className="hidden lg:block" /> We don't facilitate fundraising or provide investor introductions.
                                    </span>
                                    <Link href="/founders" className="btn btn-primary px-8 py-4 text-lg rounded-full">
                                        Submit Company
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* SECTION 7: PRICING */}
                    <PricingSection />

                    {/* SECTION 8: FAQ */}
                    <FAQSection />
                </div>

                {/* SECTION 9: FOOTER */}
                <Footer />
            </div>
        </div>
    );
}

export default function Home() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <HomeContent />
        </Suspense>
    );
}
