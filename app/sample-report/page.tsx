'use client';

import React from 'react';
import { Page, Footer, Badge, StatBox, FeatureCard, WorkflowStep, ProfileMetric } from '@/components/report/ReportComponents';
import { TableOfContents } from '@/components/report/TableOfContents';
import BrandLogo from '@/components/ui/BrandLogo';
import { reportData } from './data';

export default function SampleReport() {
    const { cover, intro, companies, dashboard, faq } = reportData;

    return (
        <div className="min-h-screen bg-slate-950 py-12 print:py-0 print:bg-white font-sans">
            {/* Print Controls - Hidden when printing */}
            <div className="fixed top-0 left-0 right-0 bg-slate-900/80 backdrop-blur-md p-4 flex justify-between items-center z-50 print:hidden border-b border-white/10">
                <div className="text-white font-semibold">Lemina Sample Report Preview</div>
                <button
                    onClick={() => window.print()}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-full font-semibold transition-colors flex items-center gap-2"
                >
                    <span>🖨️</span> Print / Save PDF
                </button>
            </div>

            <div className="print:hidden h-16"></div> {/* Spacer for fixed header */}

            <TableOfContents />

            {/* PAGE 1: COVER */}
            <Page id="cover" className="bg-gradient-to-br from-emerald-900 to-slate-900 print:from-emerald-500 print:to-emerald-700 text-white justify-center items-center text-center !p-0 print:!m-0 border-none animate-in fade-in slide-in-from-bottom-8 duration-1000">
                <BrandLogo showText={false} iconSize="w-16 h-16" className="mb-8" />
                <h1 className="text-5xl font-extrabold mb-6 leading-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-emerald-200 print:text-white print:bg-none">{cover.title}</h1>
                <div className="text-2xl opacity-90 mb-10 text-emerald-100">{cover.subtitle}</div>
                <div className="bg-white/10 px-6 py-3 rounded-full text-lg font-semibold mb-16 border border-white/10">
                    {cover.tagline}
                </div>

                <div className="grid grid-cols-3 gap-8 max-w-2xl w-full px-8">
                    {cover.stats.map((stat, i) => (
                        <div key={i} className="text-center">
                            <div className="text-4xl font-extrabold text-emerald-400 print:text-white">{stat.number}</div>
                            <div className="text-sm opacity-90 mt-1">{stat.label}</div>
                        </div>
                    ))}
                </div>

                <div className="mt-20 text-lg opacity-80">
                    {cover.contact}
                </div>
            </Page>

            {/* PAGE 2: WHAT IS LEMINA */}
            <Page id="intro" className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100">
                <h2 className="text-emerald-400 print:text-emerald-500 text-3xl font-extrabold mb-5 pb-2 border-b-4 border-emerald-500/50 print:border-emerald-500">{intro.title}</h2>
                <p className="text-lg text-slate-300 print:text-slate-700 mb-8 leading-relaxed">
                    {intro.description}
                </p>

                <h3 className="text-emerald-300 print:text-emerald-700 text-xl font-bold mt-8 mb-4">{intro.problem.title}</h3>
                {intro.problem.text.map((text, i) => (
                    <p key={i} className="text-base text-slate-300 print:text-slate-700 mb-4">{text}</p>
                ))}

                <div className="bg-red-900/20 border-l-4 border-red-500 print:bg-red-50 print:border-red-600 p-5 my-5 rounded-r-lg">
                    <p className="mb-3"><strong className="text-red-400 print:text-red-800">But here's what still keeps you up at night:</strong></p>
                    {intro.problem.painPoints.map((point, i) => (
                        <p key={i} className="my-2 text-red-300 print:text-red-800">
                            <strong className="text-red-200 print:text-red-900">{point.bold}</strong> {point.text}
                        </p>
                    ))}
                </div>

                <p className="text-base text-slate-300 print:text-slate-700 my-5 font-bold">The real cost:</p>
                <ul className="list-disc pl-6 text-base text-red-400 print:text-red-800 mb-6 space-y-2">
                    {intro.problem.cost.map((item, i) => (
                        <li key={i}><strong>{item.bold}</strong> {item.text}</li>
                    ))}
                </ul>

                <div className="bg-emerald-900/20 border-l-4 border-emerald-500 print:bg-emerald-50 print:border-emerald-500 p-5 my-5 rounded-r-lg">
                    <strong className="text-emerald-400 print:text-emerald-800 block mb-2">You're doing everything right. But there's a better system.</strong>
                    <p className="my-2 text-emerald-300 print:text-emerald-800">
                        What if you could cut DD time from weeks to less than 10 hours — and with even better quality? What if
                        you could see every company in a sector—not just the ones that got press or intros? What if you had verified traction
                        data, regulatory status, and market sizing done for you—before the first call with the founder?
                    </p>
                    <p className="my-2 text-emerald-300 print:text-emerald-800">
                        That's Lemina. Not replacing your judgment. <strong>Amplifying it.</strong>
                    </p>
                </div>

                <Footer pageNum={2} />
            </Page>

            {/* PAGE 3: THE LEMINA SOLUTION */}
            <Page id="solution" className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
                <h2 className="text-emerald-400 print:text-emerald-500 text-3xl font-extrabold mb-5 pb-2 border-b-4 border-emerald-500/50 print:border-emerald-500">{intro.solution.title}</h2>
                <p className="text-lg text-slate-300 print:text-slate-700 mb-8">
                    {intro.solution.subtitle}
                </p>

                <h3 className="text-emerald-300 print:text-emerald-700 text-xl font-bold mt-8 mb-4">The Four Pillars</h3>
                <div className="grid grid-cols-2 gap-5 mb-8">
                    {intro.solution.pillars.map((pillar, i) => (
                        <FeatureCard key={i} title={pillar.title} desc={pillar.desc} />
                    ))}
                </div>

                <h3 className="text-emerald-300 print:text-emerald-700 text-xl font-bold mt-8 mb-4">How We Actually Do This</h3>
                <p className="text-base text-slate-300 print:text-slate-700 mb-5">
                    <strong>Most intelligence platforms scrape press releases and call it research. We don't.</strong>
                </p>

                <div className="space-y-4">
                    {intro.solution.methodology.map((step, i) => (
                        <div key={i} className="bg-emerald-900/20 border-l-4 border-emerald-500 print:bg-emerald-50 print:border-emerald-500 p-5 rounded-r-lg">
                            <strong className="text-emerald-400 print:text-emerald-800 block mb-2">{step.title}</strong>
                            <p className="text-emerald-300 print:text-emerald-800">{step.desc}</p>
                        </div>
                    ))}
                </div>

                <h3 className="text-emerald-300 print:text-emerald-700 text-xl font-bold mt-8 mb-4">Plus: Investment Readiness Scores</h3>
                <p className="text-base text-slate-300 print:text-slate-700">
                    We score every company on: capital efficiency (burn multiple), growth trajectory (MoM/QoQ), runway (months
                    until they need to raise), team strength (founder backgrounds, advisory board). You see at a glance:
                    <strong className="text-emerald-400 print:text-emerald-700"> BUY</strong> (strong fundamentals, good entry point), <strong className="text-amber-400 print:text-amber-700">HOLD</strong> (interesting but wait for better metrics), or
                    <strong className="text-red-400 print:text-red-700"> AVOID</strong> (red flags present, pass).
                </p>

                <Footer pageNum={3} />
            </Page>

            {/* PAGE 4: WHO USES LEMINA */}
            <Page id="users" className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
                <h2 className="text-emerald-400 print:text-emerald-500 text-3xl font-extrabold mb-5 pb-2 border-b-4 border-emerald-500/50 print:border-emerald-500">Who Uses Lemina?</h2>
                <ul className="list-disc pl-6 text-base text-slate-300 print:text-slate-700 space-y-3 mb-8">
                    <li><strong>Angel Investors & Networks:</strong> Source deals before they're publicly announced. Comprehensive due diligence in less than 10 hours instead of weeks. Portfolio benchmarking—see how your companies compare to market peers on key metrics.</li>
                    <li><strong>Venture Capital Firms:</strong> Market sizing models for investment memos. Competitive analysis for IC presentations. Track companies from pre-seed to Series A—see who's ready for your check size before they formally fundraise.</li>
                    <li><strong>Banks & Financial Institutions:</strong> Evaluate fintech partnership opportunities with comprehensive data. Market entry strategy backed by actual sector analysis. M&A target identification—see who's scaling sustainably vs burning hot.</li>
                    <li><strong>Corporate Development Teams:</strong> Competitive intelligence—see what's being built before it disrupts you. Acquisition target screening—find companies that fit your strategic thesis. Market trend analysis to inform build-vs-buy decisions.</li>
                    <li><strong>Founders:</strong> Get discovered by investors actively deploying capital. Benchmark your metrics against competitors anonymously. Understand what data points investors actually care about—so you can improve what matters.</li>
                </ul>

                <h3 className="text-emerald-300 print:text-emerald-700 text-xl font-bold mt-8 mb-4">How You'll Use Lemina</h3>
                <p className="text-lg text-slate-300 print:text-slate-700 mb-6">Here's your actual workflow:</p>

                <h4 className="text-lg font-bold text-slate-200 print:text-slate-800 mt-6 mb-3">Use Case 1: Deal Sourcing (Find Deals Before They're Announced)</h4>
                <WorkflowStep number={1} text={<span><strong>Filter by your thesis:</strong> "Show me: embedded finance companies, pre-seed to seed stage, have active pilot customers, currently raising or planning to raise."</span>} />
                <WorkflowStep number={2} text={<span><strong>Review profiles in minutes:</strong> 6 companies match your criteria. You see: verified traction metrics, team backgrounds, competitive positioning, regulatory status. Takes 5-7 minutes per company.</span>} />
                <WorkflowStep number={3} text={<span><strong>Reach out directly or request intro:</strong> You're in their inbox BEFORE they announce publicly, BEFORE it becomes a bidding war, BEFORE your competitor even knows they exist.</span>} />

                <div className="bg-emerald-900/20 border-l-4 border-emerald-500 print:bg-emerald-50 print:border-emerald-500 p-4 rounded-r-lg mt-4 mb-8">
                    <strong className="text-emerald-400 print:text-emerald-800">What you just avoided:</strong> <span className="text-emerald-300 print:text-emerald-800">Missing the deal entirely because it never hit your LinkedIn feed. Losing to a competitor who found them first. Paying a 40% higher valuation because you showed up late to a competitive process.</span>
                </div>

                <h4 className="text-lg font-bold text-slate-200 print:text-slate-800 mt-6 mb-3">Use Case 2: Due Diligence (Verify in Hours, Not Weeks)</h4>
                <WorkflowStep number={1} text={<span><strong>Founder pitches you.</strong> Claims: $5K MRR, 15% MoM growth, 18 months runway, compliant with regulations.</span>} />
                <WorkflowStep number={2} text={<span><strong>Pull their Lemina profile in 30 seconds.</strong> See: verified revenue trend (is $5K consistent or a one-month spike?), burn multiple (are they capital efficient?), regulatory status (licenses confirmed or flagged).</span>} />
                <WorkflowStep number={3} text={<span><strong>Benchmark against 8-10 sector competitors.</strong> Where do they rank on revenue, growth rate, capital efficiency? Top quartile or bottom half?</span>} />
                <WorkflowStep number={4} text={<span><strong>Decision in 10 hours total</strong> (vs. 60+ hours manually researching). You've verified their claims, seen the market context, checked regulatory status. Write the check or pass—with confidence.</span>} />

                <div className="bg-emerald-900/20 border-l-4 border-emerald-500 print:bg-emerald-50 print:border-emerald-500 p-4 rounded-r-lg mt-4">
                    <strong className="text-emerald-400 print:text-emerald-800">What you just avoided:</strong> <span className="text-emerald-300 print:text-emerald-800">Investing in a company burning 2-3x faster than they disclosed. Discovering post-investment they're operating without required licenses. Losing a great deal because your 60-hour DD process meant someone else closed first.</span>
                </div>

                <Footer pageNum={4} />
            </Page>

            {/* PAGE 5: THE DASHBOARD */}
            <Page id="dashboard" className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
                <h2 className="text-emerald-400 print:text-emerald-500 text-3xl font-extrabold mb-5 pb-2 border-b-4 border-emerald-500/50 print:border-emerald-500">The Lemina Dashboard (Launching December 2026)</h2>
                <p className="text-base text-slate-300 print:text-slate-700 mb-8">
                    Right now, you get reports (PDFs). In December 2026, you get a live dashboard.
                    <strong>Early adopters get lifetime access included</strong> (worth $3000/year once launched).
                </p>

                <h3 className="text-emerald-300 print:text-emerald-700 text-xl font-bold mt-8 mb-4">What You Can Do in the Dashboard</h3>
                <div className="grid grid-cols-2 gap-5 mb-8">
                    {dashboard.features.map((feature, i) => (
                        <FeatureCard key={i} title={feature.title} desc={feature.desc} />
                    ))}
                </div>

                <div className="bg-emerald-900/20 border-l-4 border-emerald-500 print:bg-emerald-50 print:border-emerald-500 p-5 rounded-r-lg">
                    <strong className="text-emerald-400 print:text-emerald-800 block mb-2">The Early Adopter Advantage:</strong>
                    <p className="my-2 text-emerald-300 print:text-emerald-800">
                        You're locking in $149 for LIFETIME dashboard access. When we launch in December 2026, regular users pay
                        $3000/year. You pay $149 once. Ever.
                    </p>
                    <p className="my-2 text-emerald-300 print:text-emerald-800">
                        <strong>That's $29,851 saved over 10 years.</strong>
                    </p>
                    <p className="my-2 text-emerald-300 print:text-emerald-800">
                        Plus: You get to tell us what to build. Need a specific filter? We add it. Want a certain metric tracked?
                        We prioritize it. Regular users get whatever we ship. You get exactly what you need—because you're building
                        it with us.
                    </p>
                </div>

                <Footer pageNum={5} />
            </Page>

            {/* PAGE 6: SAMPLE COMPANY PROFILES */}
            <Page id="profiles" className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
                <h2 className="text-emerald-400 print:text-emerald-500 text-3xl font-extrabold mb-5 pb-2 border-b-4 border-emerald-500/50 print:border-emerald-500">Sample Company Profiles (FREE)</h2>
                <p className="text-lg text-slate-300 print:text-slate-700 mb-6">
                    The full report includes 80+ company profiles. Here are 3 examples showing the exact depth, verification,
                    and analysis you get in every single profile:
                </p>
                <div className="bg-amber-900/20 border-l-4 border-amber-500 print:bg-amber-50 print:border-amber-400 p-4 rounded-r-lg mb-8">
                    <strong className="text-amber-400 print:text-amber-900">This is the real Lemina methodology in action.</strong> <span className="text-amber-300 print:text-amber-900">Every data point is multi-source verified. Every claim is triangulated. Confidence scores are explicit. Risks and moats are called out. This is what investors see immediately upon opening a profile.</span>
                </div>

                {/* COMPANY 1 & 2 */}
                {companies.slice(0, 2).map((company, i) => (
                    <div key={i} className="bg-white/5 border border-white/10 print:bg-slate-50 print:border-slate-200 rounded-xl p-6 mb-8 break-inside-avoid">
                        <div className="flex justify-between items-center mb-5">
                            <div className="text-2xl font-bold text-slate-200 print:text-slate-900 flex items-center gap-2">
                                {company.name} {company.verified && <span className="text-[10px] text-emerald-400 print:text-emerald-500 bg-emerald-900/30 print:bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-500/30 print:border-emerald-200">● VERIFIED</span>}
                            </div>
                            <Badge className="bg-emerald-900/30 text-emerald-400 print:bg-emerald-100 print:text-emerald-700">{company.stage}</Badge>
                        </div>

                        <div className="grid grid-cols-2 gap-x-8 gap-y-2 mb-5">
                            {company.metrics.map((metric, j) => (
                                <ProfileMetric key={j} label={metric.label} value={metric.value} />
                            ))}
                        </div>

                        <div className="flex items-center gap-3 mt-4 mb-2">
                            <div className="w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center text-sm font-bold">{company.score}</div>
                            <div className="text-sm font-bold text-emerald-400 print:text-emerald-600">Lemina Data Confidence Score</div>
                        </div>
                        <div className="text-xs text-slate-400 print:text-slate-500 mb-5 leading-relaxed">
                            <strong>Sources:</strong> {company.sources}
                        </div>

                        <div className="border-t border-white/10 print:border-slate-200 pt-4">
                            <div className="text-base font-bold text-emerald-400 print:text-emerald-700 mb-2">Lemina Analysis</div>
                            <p className="text-[15px] text-slate-300 print:text-slate-700 leading-relaxed mb-3">{company.analysis}</p>
                            <div className="bg-emerald-900/20 border border-emerald-500/30 print:bg-emerald-50 print:border-emerald-200 text-emerald-300 print:text-emerald-800 px-3 py-2 rounded-md text-[13px] font-semibold inline-block mb-2">
                                MOAT: {company.moat}
                            </div>
                            {company.market && (
                                <p className="text-[15px] text-slate-300 print:text-slate-700 leading-relaxed my-2">
                                    <strong>Market sizing:</strong> {company.market}
                                </p>
                            )}
                            <div className="bg-red-900/20 border border-red-500/30 print:bg-red-50 print:border-red-200 text-red-300 print:text-red-800 px-3 py-2 rounded-md text-[13px] font-semibold inline-block ml-2 mb-2">
                                RISK: {company.risk}
                            </div>
                            <p className="text-[15px] text-slate-300 print:text-slate-700 leading-relaxed mt-2">
                                <strong>Investment Readiness:</strong> <strong className="text-emerald-400 print:text-emerald-600">{company.readiness.status}</strong> – {company.readiness.desc}
                            </p>
                        </div>
                        <div className="text-xs text-slate-500 print:text-slate-400 mt-4">
                            Profile last updated: {company.updated} | Next update: February 2026
                        </div>
                    </div>
                ))}

                <Footer pageNum={6} />
            </Page>

            {/* PAGE 7: COMPANY 3 + INVESTMENT READINESS */}
            <Page className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
                {/* COMPANY 3 */}
                {companies.slice(2, 3).map((company, i) => (
                    <div key={i} className="bg-white/5 border border-white/10 print:bg-slate-50 print:border-slate-200 rounded-xl p-6 mb-8 break-inside-avoid">
                        <div className="flex justify-between items-center mb-5">
                            <div className="text-2xl font-bold text-slate-200 print:text-slate-900">{company.name}</div>
                            <Badge className="bg-emerald-900/30 text-emerald-400 print:bg-emerald-100 print:text-emerald-700">{company.stage}</Badge>
                        </div>

                        <div className="grid grid-cols-2 gap-x-8 gap-y-2 mb-5">
                            {company.metrics.map((metric, j) => (
                                <ProfileMetric key={j} label={metric.label} value={metric.value} />
                            ))}
                        </div>

                        <div className="flex items-center gap-3 mt-4 mb-2">
                            <div className="w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center text-sm font-bold">{company.score}</div>
                            <div className="text-sm font-bold text-emerald-400 print:text-emerald-600">Lemina Data Confidence Score</div>
                        </div>
                        <div className="text-xs text-slate-400 print:text-slate-500 mb-5 leading-relaxed">
                            <strong>Sources:</strong> {company.sources}
                        </div>

                        <div className="border-t border-white/10 print:border-slate-200 pt-4">
                            <div className="text-base font-bold text-emerald-400 print:text-emerald-700 mb-2">Lemina Analysis</div>
                            <p className="text-[15px] text-slate-300 print:text-slate-700 leading-relaxed mb-3">{company.analysis}</p>
                            <div className="bg-emerald-900/20 border border-emerald-500/30 print:bg-emerald-50 print:border-emerald-200 text-emerald-300 print:text-emerald-800 px-3 py-2 rounded-md text-[13px] font-semibold inline-block mb-2">
                                MOAT: {company.moat}
                            </div>
                            {company.market && (
                                <p className="text-[15px] text-slate-300 print:text-slate-700 leading-relaxed my-2">
                                    <strong>Market sizing:</strong> {company.market}
                                </p>
                            )}
                            <div className="bg-red-900/20 border border-red-500/30 print:bg-red-50 print:border-red-200 text-red-300 print:text-red-800 px-3 py-2 rounded-md text-[13px] font-semibold inline-block mb-2">
                                RISK: {company.risk}
                            </div>
                            <p className="text-[15px] text-slate-300 print:text-slate-700 leading-relaxed mt-2">
                                <strong>Investment Readiness:</strong> <strong className="text-emerald-400 print:text-emerald-600">{company.readiness.status}</strong> – {company.readiness.desc}
                            </p>
                        </div>
                        <div className="text-xs text-slate-500 print:text-slate-400 mt-4">
                            Profile last updated: {company.updated} | Next update: February 2026
                        </div>
                    </div>
                ))}

                <div className="bg-emerald-900/20 border-l-4 border-emerald-500 print:bg-emerald-50 print:border-emerald-500 p-5 rounded-r-lg mb-8">
                    <strong className="text-emerald-400 print:text-emerald-800 block mb-2">How We Calculate Investment Readiness Scores:</strong>
                    <p className="text-emerald-300 print:text-emerald-800 text-sm mb-2">
                        <strong>Market Opportunity (0-10):</strong> TAM size, growth rate, penetration %<br />
                        <strong>Traction (0-10):</strong> Users, revenue, growth rate vs sector benchmarks<br />
                        <strong>Team (0-10):</strong> Founder backgrounds, domain expertise, co-founder quality<br />
                        <strong>Capital Efficiency (0-10):</strong> Burn multiple, runway, unit economics<br />
                        <strong>Competitive Moat (0-10):</strong> Network effects, IP, switching costs<br />
                        <strong>Regulatory Risk (0-10):</strong> Licensing status, compliance red flags
                    </p>
                    <p className="text-emerald-300 print:text-emerald-800 text-sm">
                        <strong>Total Score / 60 → Normalized to 10-point scale</strong><br />
                        8.0-10: <strong className="text-emerald-400 print:text-emerald-600">BUY</strong> (write check now)<br />
                        6.0-7.9: <strong className="text-amber-400 print:text-amber-500">HOLD</strong> (monitor, wait for better metrics)<br />
                        0-5.9: <strong className="text-red-400 print:text-red-600">AVOID</strong> (red flags, pass)
                    </p>
                </div>

                <h2 className="text-emerald-400 print:text-emerald-500 text-3xl font-extrabold mb-5 pb-2 border-b-4 border-emerald-500/50 print:border-emerald-500">What You Get as an Early Adopter</h2>
                <p className="text-lg text-slate-300 print:text-slate-700 mb-6">
                    This FREE sample shows 3 full Lemina-methodology profiles. The full early adopter package
                    includes significantly more:
                </p>
                <h3 className="text-emerald-300 print:text-emerald-700 text-xl font-bold mb-4">1. Full Intelligence Report</h3>
                <ul className="list-disc pl-6 text-base text-slate-300 print:text-slate-700 space-y-2">
                    {dashboard.earlyAdopter.benefits.slice(0, 8).map((benefit, i) => (
                        <li key={i}>{benefit}</li>
                    ))}
                </ul>

                <Footer pageNum={7} />
            </Page>

            {/* PAGE 8: WHAT YOU GET CONTINUED */}
            <Page id="pricing" className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
                <h3 className="text-emerald-300 print:text-emerald-700 text-xl font-bold mb-4">2. Real-Time Updates</h3>
                <ul className="list-disc pl-6 text-base text-slate-300 print:text-slate-700 space-y-2 mb-8">
                    <li><strong>Until dashboard launches (December 2026):</strong> Report updates delivered via email</li>
                    <li><strong>After dashboard launches:</strong> Real-time updates—companies raise funding, launch products, hit milestones, you see it within 24-48 hours, not 3 months later</li>
                    <li><strong>Email alerts:</strong> Get notified when companies matching your specific criteria take action</li>
                    <li><strong>12 months included,</strong> then ongoing access for life as an early adopter</li>
                </ul>

                <h3 className="text-emerald-300 print:text-emerald-700 text-xl font-bold mb-4">3. Dashboard Access (Launching December 2026)</h3>
                <ul className="list-disc pl-6 text-base text-slate-300 print:text-slate-700 space-y-2 mb-8">
                    <li><strong>LIFETIME access</strong> to the dashboard (regular users will pay $3000/year starting Q1 2026)</li>
                    <li><strong>Advanced search & filters</strong> - find exactly what you're looking for in seconds, not hours</li>
                    <li><strong>Custom alerts</strong> - get notified when deals match your investment thesis automatically</li>
                    <li><strong>CRM</strong> - track your deal pipeline alongside the intelligence, all in one place</li>
                    <li><strong>Market analytics</strong> - interactive charts showing funding trends, sector growth, valuation multiples</li>
                    <li><strong>Export capabilities</strong> - download company lists, reports, and analytics as CSV, PDF, or Excel anytime</li>
                </ul>

                <h3 className="text-emerald-300 print:text-emerald-700 text-xl font-bold mb-4">4. Shape the Product</h3>
                <ul className="list-disc pl-6 text-base text-slate-300 print:text-slate-700 space-y-2 mb-8">
                    <li><strong>Direct input on features:</strong> Need a specific metric tracked? Tell us. Want a certain filter? We prioritize it. You're not just buying intelligence—you're co-creating the engine.</li>
                    <li><strong>Priority support:</strong> Questions answered within 24 hours, not generic support ticket queues</li>
                    <li><strong>Custom analysis requests:</strong> Need deeper research on a specific company or sector? We'll do it.</li>
                    <li><strong>Founder introductions:</strong> Found a company you want to meet? We facilitate warm introductions.</li>
                </ul>

                <div className="grid grid-cols-3 gap-5 mb-8">
                    <StatBox number="$3000" label="Regular Annual Price" />
                    <StatBox number="$149" label="Early Adopter Price (One-Time)" highlight={true} />
                    <StatBox number="96%" label="You Save" highlight={true} />
                </div>

                <div className="bg-emerald-900/20 border-l-4 border-emerald-500 print:bg-emerald-50 print:border-emerald-500 p-5 rounded-r-lg">
                    <strong className="text-emerald-400 print:text-emerald-800 block mb-2">Let's do the math:</strong>
                    <p className="text-emerald-300 print:text-emerald-800 mb-1">Regular price: $3000/year × 10 years = <strong>$30,000</strong></p>
                    <p className="text-emerald-300 print:text-emerald-800 mb-1">Early adopter price: <strong>$149</strong> (one-time payment, lifetime access)</p>
                    <p className="text-emerald-300 print:text-emerald-800 mb-3">Your savings: <strong>$29,851</strong></p>
                    <p className="text-emerald-300 print:text-emerald-800 mb-2">
                        <strong>But here's what actually matters:</strong> How many hours will this save you? If it saves you just
                        10 hours on your next deal, and your time is worth $100/hour, you've already made $1,000 on a $149 investment.
                        That's a 7x return. On one deal.
                    </p>
                    <p className="text-emerald-300 print:text-emerald-800">
                        Plus: You get to shape the product. Your feedback determines what we build. Regular users get whatever we
                        ship. You get exactly what you need—because you're building it with us.
                    </p>
                </div>

                <Footer pageNum={8} />
            </Page>

            {/* PAGE 9: FAQ */}
            <Page id="faq" className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
                <h2 className="text-emerald-400 print:text-emerald-500 text-3xl font-extrabold mb-5 pb-2 border-b-4 border-emerald-500/50 print:border-emerald-500">Frequently Asked Questions</h2>

                <div className="space-y-4 mb-8">
                    {faq.map((item, i) => (
                        <div key={i} className="bg-white/5 border border-white/10 print:bg-slate-50 print:border-slate-200 rounded-lg p-5">
                            <div className="text-lg font-bold text-emerald-400 print:text-emerald-600 mb-2">{item.q}</div>
                            <div className="text-slate-300 print:text-slate-700 leading-relaxed">{item.a}</div>
                        </div>
                    ))}
                </div>

                <Footer pageNum={9} />
            </Page>

            {/* PAGE 10: HOW TO GET STARTED */}
            <Page id="start" className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
                <h2 className="text-emerald-400 print:text-emerald-500 text-3xl font-extrabold mb-5 pb-2 border-b-4 border-emerald-500/50 print:border-emerald-500">How to Get Started</h2>

                <WorkflowStep number={1} text={<span><strong>Reply to the email</strong> with "I'm in" or email admin@lemina.co directly</span>} />
                <WorkflowStep number={2} text={<span><strong>Complete payment:</strong> We send you a secure payment link (Stripe or PayPal, $149 USD one-time)</span>} />
                <WorkflowStep number={3} text={<span><strong>Receive confirmation:</strong> Within 24 hours, you get a confirmation email with onboarding details and timeline for report delivery</span>} />
                <WorkflowStep number={4} text={<span><strong>Get the full report:</strong> Delivered Q1 2026 (we're building it now based on early adopter feedback)</span>} />
                <WorkflowStep number={5} text={<span><strong>Dashboard access:</strong> Early access when it launches December 2026, lifetime login credentials included</span>} />

                <div className="bg-red-900/20 border-l-4 border-red-500 print:bg-red-50 print:border-red-600 p-5 rounded-r-lg my-8">
                    <strong className="text-red-400 print:text-red-800 block mb-2">Limited to 10 Early Adopters Only—9 Spots Remaining</strong>
                    <p className="text-red-300 print:text-red-800 mb-2">
                        We're capping this at 10 investors total. Why? Because we want to give each early adopter direct access to
                        shape the product. At 10 people, we can have real conversations. At 100 people, you become a support ticket.
                    </p>
                    <p className="text-red-300 print:text-red-800">
                        Once we hit 10 early adopters, the program closes permanently and pricing increases to $3000/year. This
                        $149 lifetime access opportunity never comes back.
                    </p>
                </div>

                <h3 className="text-emerald-300 print:text-emerald-700 text-xl font-bold mb-4">What Happens After You Join</h3>
                <ul className="list-disc pl-6 text-base text-slate-300 print:text-slate-700 space-y-2 mb-8">
                    <li><strong>Week 1:</strong> Welcome email with early adopter onboarding. We send you a survey.</li>
                    <li><strong>Monthly check-ins:</strong> Progress updates showing what we're building.</li>
                    <li><strong>Q1 2026:</strong> Full intelligence report delivered.</li>
                    <li><strong>December 2026:</strong> Dashboard launches.</li>
                    <li><strong>Ongoing:</strong> Real-time updates via dashboard after launch.</li>
                </ul>

                <div className="bg-gradient-to-br from-emerald-900 to-emerald-700 print:from-emerald-500 print:to-emerald-700 text-white p-10 rounded-xl text-center mb-10">
                    <h2 className="text-3xl font-bold mb-2">Early Adopter Pricing</h2>
                    <p className="text-lg opacity-90 mb-6">Limited to 10 investors • 9 spots remaining</p>
                    <div className="flex items-center justify-center gap-4 mb-6">
                        <span className="text-3xl line-through opacity-60">$3000/year</span>
                        <span className="text-6xl font-extrabold">$149</span>
                    </div>
                    <div className="inline-block bg-amber-400 text-amber-900 px-4 py-2 rounded-full font-bold text-lg mb-6">
                        SAVE $29,851 OVER 10 YEARS
                    </div>
                    <p className="text-base opacity-90 mb-8">One-time payment • Lifetime access • Dashboard included • Shape the product</p>

                    <div className="bg-white/10 p-6 rounded-xl text-left">
                        <p className="font-bold text-lg mb-4">You Get:</p>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                            {dashboard.earlyAdopter.benefits.map((benefit, i) => (
                                <div key={i}>✓ {benefit}</div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="bg-emerald-900/20 border-2 border-emerald-500 print:bg-emerald-50 print:border-emerald-500 rounded-xl p-8 text-center">
                    <p className="text-xl font-bold text-slate-200 print:text-slate-900 mb-4">Claim your early adopter spot:</p>
                    <p className="text-xl mb-2"><strong className="text-emerald-400 print:text-emerald-600">admin@lemina.co</strong></p>
                    <p className="text-base text-slate-300 print:text-slate-700 mb-4">Subject: "Early Adopter – Send Payment Link"</p>
                    <p className="text-sm text-slate-400 print:text-slate-500">Response within 2 hours • Secure Stripe or PayPal link • Instant confirmation</p>
                </div>

                <Footer pageNum={10} />
            </Page>
        </div>
    );
}
