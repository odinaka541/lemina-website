'use client';

import Link from 'next/link';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import HeroGrid from '@/components/landing/HeroGrid';
import BrandLogo from '@/components/ui/BrandLogo';
import PlusGridBackdrop from '@/components/landing/PlusGridBackdrop';
import BottomGrid from '@/components/landing/BottomGrid';
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
        flags: ["ng", "pt"],
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

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + companies.length) % companies.length);
    };

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % companies.length);
    };

    return (
        <div className="relative min-h-screen w-full overflow-x-hidden">
            <HeroGrid />
            <div className="container mx-auto bg-transparent relative z-10">
                <nav className="flex justify-between items-center h-20 sticky top-0 z-50 px-6 mx-auto max-w-7xl">
                    <BrandLogo textClassName="hidden md:block" />


                    {/* Desktop Nav - Encapsulated Pill */}
                    <div className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2 backdrop-blur-xl bg-[var(--nav-bg)]/80 border border-[var(--glass-border-color)] rounded-full px-2 py-1 shadow-sm">
                        <Link href="/founders" className="text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] px-4 py-2 rounded-full hover:bg-[var(--glass-border-color)]/50 transition-all">
                            For Founders
                        </Link>
                        <a href="#how-it-works" className="text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] px-4 py-2 rounded-full hover:bg-[var(--glass-border-color)]/50 transition-all">
                            How it Works
                        </a>
                        <Link href="#" className="text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] px-4 py-2 rounded-full hover:bg-[var(--glass-border-color)]/50 transition-all">
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
                        <Link href="#" className="text-sm font-medium px-5 py-2.5 rounded-full border border-[var(--glass-border-color)] bg-[var(--nav-bg)]/50 backdrop-blur-md text-[var(--color-text-primary)] hover:bg-[var(--glass-border-color)] transition-all">
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
                    {isMobileMenuOpen && (
                        <div className="absolute top-full left-0 right-0 mt-2 p-4 bg-[var(--color-bg-secondary)] border border-[var(--glass-border-color)] rounded-2xl shadow-xl flex flex-col gap-4 md:hidden animate-in fade-in slide-in-from-top-2">
                            <Link href="/founders" className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] p-2" onClick={() => setIsMobileMenuOpen(false)}>
                                For Founders
                            </Link>
                            <a href="#how-it-works" className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] p-2" onClick={() => setIsMobileMenuOpen(false)}>
                                How it Works
                            </a>
                            <div className="h-px bg-[var(--glass-border-color)] my-1" />
                            <Link href="#" className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] p-2" onClick={() => setIsMobileMenuOpen(false)}>
                                Log In
                            </Link>
                        </div>
                    )}
                </nav>

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
                        Building the investment infrastructure for African tech
                    </div>
                    <h1 style={{ marginBottom: '24px', fontSize: '3.5rem', lineHeight: '1.1', letterSpacing: '-0.02em' }}>
                        ...starting with <br />
                        <span className="text-gradient">intelligence</span>
                    </h1>
                    <p style={{ fontSize: '1.25rem', maxWidth: '600px', margin: '0 auto 48px', color: 'var(--color-text-secondary)' }}>
                        We're the bridge between capital and opportunity. Giving investors certainty. Giving founders access. Building the intelligence infrastructure African tech deserves.
                    </p>
                    <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                        <a href="mailto:odinaka@lemina.co" className="group flex items-center p-1 pr-6 rounded-full bg-white hover:bg-gray-50 transition-all border border-transparent hover:border-[var(--color-accent-primary)]/20 shadow-lg shadow-[var(--color-accent-primary)]/10">
                            <div className="w-10 h-10 rounded-full bg-[var(--color-accent-primary)] flex items-center justify-center text-white mr-4 group-hover:scale-110 transition-transform">
                                <ArrowUpRight size={20} />
                            </div>
                            <span className="font-semibold text-lg text-slate-900 tracking-tight">Get Early Access</span>
                        </a>
                        <a href="#how-it-works" className="btn btn-secondary">How it works</a>
                    </div>
                </section>

                <section className="py-20 px-6 relative">
                    <PlusGridBackdrop className="h-[150%]" />
                    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-start relative z-10">
                        {/* LEFT COLUMN: Highlights Header + Slider (Span 8) */}
                        <div className="lg:col-span-8 glass-panel p-6 md:p-8 relative overflow-hidden h-full">
                            <div className="flex justify-between items-end mb-5 border-b border-[var(--color-border)] pb-4">
                                <div>
                                    <h3 className="text-xl mb-1">Highlights on Who to Watch</h3>
                                    <p className="text-sm text-[var(--color-text-secondary)]">Early-stage innovators driving change.</p>
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        onClick={prevSlide}
                                        className="p-2 rounded-full border border-[var(--glass-border-color)] hover:border-[var(--color-accent-primary)] hover:text-[var(--color-accent-primary)] transition-all duration-300 hover:-translate-y-1"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="24.00" viewBox="0 0 40 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M37 12H3" />
                                            <path d="M9 18L3 12L9 6" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={nextSlide}
                                        className="p-2 rounded-full border border-[var(--glass-border-color)] hover:border-[var(--color-accent-primary)] hover:text-[var(--color-accent-primary)] transition-all duration-300 hover:-translate-y-1"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="24.00" viewBox="0 0 40 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M3 12h34" />
                                            <path d="m31 18 6-6-6-6" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-[1fr_1.5fr] gap-8">
                                <div className="flex flex-col h-full">
                                    <div className="flex items-center gap-4 mb-4">
                                        {companies[currentSlide].logo ? (
                                            <img
                                                src={companies[currentSlide].logo!}
                                                alt={companies[currentSlide].name}
                                                className="w-12 h-12 rounded-full object-contain bg-white p-1 shrink-0"
                                            />
                                        ) : (
                                            <div className="w-12 h-12 rounded-full shrink-0 bg-[var(--color-bg-secondary)] flex items-center justify-center text-2xl border border-[var(--glass-border-color)]">
                                                {companies[currentSlide].name.includes('Seren') ? "🔵" : "🟠"}
                                            </div>
                                        )}
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

                                <div className="flex flex-col justify-between">
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

                        {/* RIGHT COLUMN: Stacked Panels (Span 4) */}
                        <div className="lg:col-span-4 flex flex-col gap-6" id="how-it-works">
                            <div className="glass-panel p-8 flex-1">
                                <div className="text-5xl mb-4 opacity-20 font-light">01</div>
                                <h3 className="text-2xl mb-3">Invest with certainty</h3>
                                <p className="text-base text-[var(--color-text-secondary)]">For Angels, VCs and Institutional Investors. Verified data on 80+ Nigerian startups. See who's building what and the data backing them, confidentially.</p>
                            </div>
                            <div className="glass-panel p-8 flex-1">
                                <div className="text-5xl mb-4 opacity-20 font-light">02</div>
                                <h3 className="text-2xl mb-3">Connect & Scale</h3>
                                <p className="text-base text-[var(--color-text-secondary)]">For Founders. Get discovered by active investors actively listening for what you're building.</p>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="relative">
                    <BottomGrid />
                    <section style={{ padding: '100px 0', textAlign: 'center' }}>
                        <div style={{ marginBottom: '60px' }}>
                            <h2 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>Lemina's Core Pillars</h2>
                            <p style={{ maxWidth: '600px', margin: '0 auto', color: 'var(--color-text-secondary)' }}>We've built a comprehensive framework that addresses every aspect of African startup intelligence.</p>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                            {[
                                { title: "Company Profiling", desc: "Deep-dive analysis of every African startup worth tracking. From stealth-mode to series A." },
                                { title: "Market Sizing", desc: "Comprehensive sector analysis and competitive mapping. Identify white spaces and emerging opportunities." },
                                { title: "Data & Regulatory Verification", desc: "Rigorous fact-checking. Every data point verified, every license tracked for investor confidence." },
                                { title: "Real-time Updates", desc: "Live tracking of funding rounds, traction metrics, and market movements." }
                            ].map((item, i) => (
                                <div key={i} className="glass-panel" style={{ padding: '32px', textAlign: 'left' }}>
                                    <h3 style={{ fontSize: '1.25rem', marginBottom: '12px', color: 'var(--color-accent-primary)' }}>{item.title}</h3>
                                    <p style={{ fontSize: '0.875rem' }}>{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section style={{ padding: '100px 0' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center' }}>
                            <div>
                                <div style={{ color: 'var(--color-accent-primary)', fontWeight: 600, marginBottom: '16px' }}>COMING SOON</div>
                                <h2 style={{ fontSize: '2.5rem', marginBottom: '24px' }}>Real-time Investor Dashboard</h2>
                                <p style={{ fontSize: '1.125rem', marginBottom: '32px', color: 'var(--color-text-secondary)' }}>
                                    The complete command centre for African startup intelligence. Track, analyze, and act on opportunities as they emerge. Step into our dealrooms, make deals or track portfolio companies Solo or with your Network, from announcement, to funding, to exits.
                                </p>
                                <div style={{ display: 'flex', gap: '16px' }}>
                                    <div style={{ padding: '12px 24px', background: 'var(--input-bg)', borderRadius: '8px' }}>
                                        <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>1</div>
                                        <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>Platform</div>
                                    </div>
                                    <div style={{ padding: '12px 24px', background: 'var(--input-bg)', borderRadius: '8px' }}>
                                        <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>Everything</div>
                                        <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>For your Investment Career</div>
                                    </div>
                                </div>
                            </div>
                            <div className="glass-panel" style={{ padding: '40px', position: 'relative', minHeight: '400px' }}>
                                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '16px', zIndex: 10 }}>
                                    <div style={{ textAlign: 'center', padding: '20px' }}>
                                        <div style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '8px', color: '#fff' }}>Almost Ready</div>
                                        <p style={{ marginBottom: '24px', color: 'rgba(255,255,255,0.8)' }}>We're putting the finishing touches on the dashboard.</p>
                                        <a href="mailto:odinaka@lemina.co?subject=Notify me when dashboard is ready" className="btn btn-primary">Get Notified</a>
                                    </div>
                                </div>
                                {/* Mock UI Background */}
                                <div style={{ opacity: 0.3 }}>
                                    <div style={{ display: 'flex', gap: '20px', marginBottom: '24px' }}>
                                        <div style={{ width: '100px', height: '20px', background: 'white', borderRadius: '4px' }}></div>
                                        <div style={{ width: '100px', height: '20px', background: 'white', borderRadius: '4px' }}></div>
                                    </div>
                                    <div style={{ height: '200px', background: 'var(--input-bg)', borderRadius: '8px' }}></div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section style={{ padding: '100px 0' }}>
                        <div className="glass-panel" style={{ padding: '60px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center' }}>
                            <div>
                                <h2 style={{ fontSize: '2.5rem', marginBottom: '24px' }}>Free Sample Intelligence Report</h2>
                                <p style={{ fontSize: '1.125rem', marginBottom: '32px', color: 'var(--color-text-secondary)' }}>
                                    We analyzed 3 emerging Nigerian startup companies with investment-grade financial analysis. See exactly what our platform delivers.
                                </p>
                                <a href="mailto:odinaka@lemina.co" className="btn btn-secondary">View Full Sample Report</a>
                            </div>
                            <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '20px', border: '1px solid var(--color-border)' }}>
                                <img src="/assets/sample-report-preview.png" alt="Report Preview" style={{ width: '100%', borderRadius: '8px', opacity: 0.8 }} />
                            </div>
                        </div>
                    </section>

                    <section className="relative py-32 overflow-hidden">
                        {/* Background: Visible Pluses End-to-End */}
                        <PlusGridBackdrop baseOpacity={0.15} className="z-0" />

                        <div className="max-w-7xl mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                            {/* Left: Spacing for pluses to show */}
                            <div className="hidden lg:block lg:col-span-6"></div>

                            {/* Right: Content */}
                            <div className="lg:col-span-6 text-left lg:text-right">
                                <h2 className="text-4xl md:text-6xl font-light mb-6">Are you building the future?</h2>
                                <p className="text-xl text-[var(--color-text-secondary)] mb-10 leading-relaxed ml-auto max-w-xl">
                                    Get discovered by investors actively deploying capital; featured in our intelligence reports; connected to VCs looking for exactly what you're building.
                                </p>
                                <div className="flex flex-col lg:flex-row gap-4 justify-end">
                                    <Link href="/founders" className="btn btn-primary px-8 py-4 text-lg rounded-full">
                                        Add Your Company (5 min) →
                                    </Link>
                                </div>
                                <p className="mt-4 text-sm text-[var(--color-text-secondary)]">100% free • No obligations</p>
                            </div>
                        </div>
                    </section>

                    <FAQSection />
                </div>

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