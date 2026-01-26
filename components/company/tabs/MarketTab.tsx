'use client';

import { Globe, Users, TrendingUp, AlertTriangle, ShieldCheck, Info, CheckCircle2, ArrowUpRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import VerifiedText from '../VerifiedText';

// Mock Data for Growth Chart
const data = [
    { month: 'Jan', value: 2.1 },
    { month: 'Feb', value: 2.3 },
    { month: 'Mar', value: 2.5 },
    { month: 'Apr', value: 2.4 },
    { month: 'May', value: 2.8 },
    { month: 'Jun', value: 3.1 },
    { month: 'Jul', value: 3.4 },
    { month: 'Aug', value: 3.6 },
    { month: 'Sep', value: 3.8 },
    { month: 'Oct', value: 4.0 },
    { month: 'Nov', value: 4.1 },
    { month: 'Dec', value: 4.2 },
    { month: 'Jan', value: 4.4 },
    { month: 'Feb', value: 4.6 },
    { month: 'Mar', value: 4.9 },
    { month: 'Apr', value: 5.1 },
    { month: 'May', value: 5.3 },
    { month: 'Jun', value: 5.5 },
    { month: 'Jul', value: 5.8 },
    { month: 'Aug', value: 6.0 },
    { month: 'Sep', value: 6.2 },
    { month: 'Oct', value: 6.5 },
    { month: 'Nov', value: 6.8 },
    { month: 'Dec', value: 7.1 },
];



// ... other imports ...

export default function MarketTab({ company }: { company?: any }) {
    // If no company data provided or market data missing, use defaults (or return null)
    // For now we assume company.market exists from mapper
    const market = company?.market || {
        tam: { value: "$4.2B", isEstimated: true },
        cagr: { value: "38%", isEstimated: true },
        users: { value: "250M+", isEstimated: true },
        competitors: []
    };

    const sectorName = company?.industry?.split('/')[0] || "African Digital Payments";

    return (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 max-w-7xl mx-auto font-sans text-[var(--color-text-primary)]">

            {/* --- TOP ROW: Snapshot & TAM --- */}

            {/* Market Snapshot Hero (Span 8) */}
            <section className="col-span-12 md:col-span-8 bg-[var(--card-bg)] border border-[var(--color-border)] rounded-xl shadow-sm p-6 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            {sectorName}
                        </h2>
                        <span className="text-xs text-[var(--color-text-secondary)]">Sector Deep Dive</span>
                    </div>
                    <span className="px-3 py-1 rounded-lg bg-emerald-100 text-emerald-700 text-xs font-bold border border-emerald-200">
                        Lemina Tier 4
                    </span>
                </div>

                <div className="grid grid-cols-3 gap-6 pt-2">
                    <div className="space-y-1">
                        <span className="text-xs text-[var(--color-text-secondary)] font-medium uppercase tracking-wide">Run-rate Revenue</span>
                        <div className="text-3xl font-bold font-mono">
                            <VerifiedText data={market.tam} />
                        </div>
                        <span className="text-[10px] text-emerald-500 font-medium">2025 Est.</span>
                    </div>
                    <div className="space-y-1 border-l border-[var(--color-border)] pl-6">
                        <span className="text-xs text-[var(--color-text-secondary)] font-medium uppercase tracking-wide">3-Year CAGR</span>
                        <div className="text-3xl font-bold font-mono">
                            <VerifiedText data={market.cagr} />
                        </div>
                        <span className="text-[10px] text-emerald-500 font-medium">Accelerating</span>
                    </div>
                    <div className="space-y-1 border-l border-[var(--color-border)] pl-6">
                        <span className="text-xs text-[var(--color-text-secondary)] font-medium uppercase tracking-wide">Active Users</span>
                        <div className="text-3xl font-bold font-mono">
                            <VerifiedText data={market.users} />
                        </div>
                        <span className="text-[10px] text-[var(--color-text-secondary)]">Across key markets</span>
                    </div>
                </div>
            </section>

            {/* TAM Reality Check (Span 4) */}
            <section className="col-span-12 md:col-span-4 bg-[var(--card-bg)] border border-[var(--color-border)] rounded-xl shadow-sm p-6 flex flex-col justify-between h-full">
                <div className="flex items-center gap-2 mb-4">
                    <Globe size={18} className="text-blue-500" />
                    <h3 className="text-sm font-bold">TAM Reality Check</h3>
                </div>

                <div className="space-y-5 flex-1">
                    <div className="relative pt-1">
                        <div className="flex justify-between items-end mb-1">
                            <span className="text-xs font-medium text-[var(--color-text-secondary)]">2030 TAM</span>
                            <span className="text-sm font-bold">$45B</span>
                        </div>
                        <div className="w-full bg-[var(--input-bg)] h-2 rounded-full overflow-hidden">
                            <div className="bg-blue-600 h-full w-[100%] opacity-20"></div>
                        </div>
                    </div>
                    <div className="relative pt-1">
                        <div className="flex justify-between items-end mb-1">
                            <span className="text-xs font-medium text-[var(--color-text-secondary)]">Realistic SAM</span>
                            <span className="text-sm font-bold">$8–12B</span>
                        </div>
                        <div className="w-full bg-[var(--input-bg)] h-2 rounded-full overflow-hidden">
                            <div className="bg-blue-600 h-full w-[25%] opacity-60"></div>
                        </div>
                    </div>
                    <div className="relative pt-1">
                        <div className="flex justify-between items-end mb-1">
                            <span className="text-xs font-bold text-[var(--color-text-primary)]">Served Market</span>
                            <span className="text-sm font-bold text-emerald-500">
                                <VerifiedText data={market.tam} />
                            </span>
                        </div>
                        <div className="w-full bg-[var(--input-bg)] h-2 rounded-full overflow-hidden">
                            <div className="bg-emerald-500 h-full w-[10%]"></div>
                        </div>
                    </div>
                </div>
                <div className="mt-4 pt-3 border-t border-[var(--color-border)] flex items-center justify-between">
                    <span className="text-[10px] text-[var(--color-text-secondary)] font-medium uppercase">Sources</span>
                    <div className="flex gap-2">
                        <span className="px-1.5 py-0.5 rounded bg-[var(--color-bg-secondary)] border border-[var(--color-border)] text-[10px] text-[var(--color-text-secondary)]">GSMA</span>
                        <span className="px-1.5 py-0.5 rounded bg-[var(--color-bg-secondary)] border border-[var(--color-border)] text-[10px] text-[var(--color-text-secondary)]">World Bank</span>
                    </div>
                </div>
            </section>

            {/* --- MIDDLE ROW: Breakdown & Growth --- */}

            {/* Competitive Landscape */}
            <section className="col-span-12 md:col-span-7 bg-[var(--card-bg)] border border-[var(--color-border)] rounded-xl shadow-sm p-0 overflow-hidden flex flex-col">
                <div className="p-6 border-b border-[var(--color-border)] flex justify-between items-center">
                    <h3 className="text-lg font-bold">Competitive Landscape</h3>
                    <span className="text-xs text-[var(--color-text-secondary)]">Revenue & Market Share</span>
                </div>
                <div className="flex-1 overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[var(--bg-secondary)] text-[10px] uppercase text-[var(--color-text-secondary)] tracking-wider">
                                <th className="px-6 py-3 font-semibold">Company</th>
                                <th className="px-6 py-3 font-semibold">Funding</th>
                                <th className="px-6 py-3 font-semibold">Revenue (Est)</th>
                            </tr>
                        </thead>
                        <tbody className="text-xs font-medium divide-y divide-[var(--color-border)]">
                            {/* Primary Company */}
                            <tr className="bg-emerald-50/50 hover:bg-emerald-50 transition-colors">
                                <td className="px-6 py-3 text-[var(--color-text-primary)] font-bold flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div> {company?.name}
                                </td>
                                <td className="px-6 py-3">{company?.stage}</td>
                                <td className="px-6 py-3 font-mono text-emerald-700">
                                    <VerifiedText data={company?.totalRaised} /> (Raised)
                                </td>
                            </tr>
                            {/* Competitors */}
                            {market.competitors.map((comp: any, i: number) => (
                                <tr key={i} className="hover:bg-[var(--color-bg-secondary)] transition-colors">
                                    <td className="px-6 py-3 text-[var(--color-text-primary)]">{comp.name}</td>
                                    <td className="px-6 py-3">{comp.funding}</td>
                                    <td className="px-6 py-3 font-mono text-[var(--color-text-secondary)]">
                                        <VerifiedText data={{ value: comp.revenue, isEstimated: true }} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Growth Trajectory (Span 5) */}
            <section className="col-span-12 md:col-span-5 bg-[var(--card-bg)] border border-[var(--color-border)] rounded-xl shadow-sm p-6 flex flex-col">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-bold flex items-center gap-2">
                        <TrendingUp size={16} className="text-emerald-500" />
                        Growth Trajectory
                    </h3>
                    <span className="text-[10px] text-[var(--color-text-secondary)]">24-month Served Market Run-rate</span>
                </div>

                <div className="flex-1 min-h-[180px] w-full mt-2">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <Tooltip
                                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', fontSize: '12px' }}
                                itemStyle={{ color: '#10b981' }}
                            />
                            <Area
                                type="monotone"
                                dataKey="value"
                                stroke="#10b981"
                                strokeWidth={2}
                                fillOpacity={1}
                                fill="url(#colorValue)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
                <div className="mt-3 flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                        <span className="text-[10px] text-[var(--color-text-primary)]">Market ($B)</span>
                    </div>
                    <div className="flex items-center gap-1.5 opacity-50">
                        <div className="w-2 h-2 rounded-full border border-dashed border-[var(--color-text-secondary)]"></div>
                        <span className="text-[10px] text-[var(--color-text-secondary)]">Target Co. (N/A)</span>
                    </div>
                </div>
            </section>

            {/* --- BOTTOM ROW: Risks, Tailwinds, Regulatory --- */}

            {/* Risks & Tailwinds (Span 8 - Split internally) */}
            <section className="col-span-12 md:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Tailwinds */}
                <div className="bg-[var(--card-bg)] border border-[var(--color-border)] rounded-xl shadow-sm p-6 border-l-4 border-l-emerald-500">
                    <h3 className="text-sm font-bold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
                        <ArrowUpRight className="text-emerald-500" size={16} />
                        Tailwinds
                    </h3>
                    <ul className="space-y-3">
                        <li className="flex gap-2.5 items-start">
                            <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                            <span className="text-xs text-[var(--color-text-secondary)] leading-snug">
                                <strong className="text-[var(--color-text-primary)]">Mobile Penetration:</strong> Rising from 68% to 85% by 2028, expanding user base.
                            </span>
                        </li>
                        <li className="flex gap-2.5 items-start">
                            <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                            <span className="text-xs text-[var(--color-text-secondary)] leading-snug">
                                <strong className="text-[var(--color-text-primary)]">Cashless Policy:</strong> CBN's aggressive cashless drive reducing cash dominance.
                            </span>
                        </li>
                        <li className="flex gap-2.5 items-start">
                            <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                            <span className="text-xs text-[var(--color-text-secondary)] leading-snug">
                                <strong className="text-[var(--color-text-primary)]">E-commerce Boom:</strong> 25% YoY growth in online retail sector.
                            </span>
                        </li>
                    </ul>
                </div>

                {/* Risks */}
                <div className="bg-[var(--card-bg)] border border-[var(--color-border)] rounded-xl shadow-sm p-6 border-l-4 border-l-amber-500">
                    <h3 className="text-sm font-bold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
                        <AlertTriangle className="text-amber-500" size={16} />
                        Risks
                    </h3>
                    <ul className="space-y-3">
                        <li className="flex gap-2.5 items-start">
                            <AlertTriangle size={14} className="text-amber-500 shrink-0 mt-0.5" />
                            <span className="text-xs text-[var(--color-text-secondary)] leading-snug">
                                <strong className="text-[var(--color-text-primary)]">Policy Volatility:</strong> CBN policy shifts; 3 distinct freezes in 2024–25.
                            </span>
                        </li>
                        <li className="flex gap-2.5 items-start">
                            <AlertTriangle size={14} className="text-amber-500 shrink-0 mt-0.5" />
                            <span className="text-xs text-[var(--color-text-secondary)] leading-snug">
                                <strong className="text-[var(--color-text-primary)]">Currency Risk:</strong> FX instability affecting cross-border margin capture.
                            </span>
                        </li>
                        <li className="flex gap-2.5 items-start">
                            <AlertTriangle size={14} className="text-amber-500 shrink-0 mt-0.5" />
                            <span className="text-xs text-[var(--color-text-secondary)] leading-snug">
                                <strong className="text-[var(--color-text-primary)]">Talent Brain Drain:</strong> Senior engineering talent migrating to EU/US.
                            </span>
                        </li>
                    </ul>
                </div>
            </section>

            {/* Regulatory Overview (Span 4) */}
            <section className="col-span-12 md:col-span-4 bg-[var(--card-bg)] border border-[var(--color-border)] rounded-xl shadow-sm p-6 flex flex-col">
                <div className="flex items-center gap-2 mb-4">
                    <ShieldCheck size={18} className="text-purple-500" />
                    <h3 className="text-sm font-bold">Regulatory Overview</h3>
                </div>

                <div className="space-y-3 flex-1">
                    <div className="p-3 bg-[var(--input-bg)] rounded-lg border border-[var(--color-border)]">
                        <div className="flex justify-between items-start mb-1">
                            <span className="text-xs font-bold text-[var(--color-text-primary)]">CBN PSSP</span>
                            <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-500 text-[10px] font-bold border border-emerald-500/20">ACTIVE</span>
                        </div>
                        <p className="text-[10px] text-[var(--color-text-secondary)]">Payment Solution Service Provider</p>
                        <p className="text-[10px] text-[var(--color-text-secondary)] mt-1 opacity-70">Since: Jun 2024</p>
                    </div>
                    <div className="p-3 bg-[var(--input-bg)] rounded-lg border border-[var(--color-border)]">
                        <div className="flex justify-between items-start mb-1">
                            <span className="text-xs font-bold text-[var(--color-text-primary)]">NDPR Compliant</span>
                            <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-500 text-[10px] font-bold border border-emerald-500/20">AUDITED</span>
                        </div>
                        <p className="text-[10px] text-[var(--color-text-secondary)]">Data Protection Regulation</p>
                        <p className="text-[10px] text-[var(--color-text-secondary)] mt-1 opacity-70">Last Audit: Nov 2024</p>
                    </div>
                    <div className="p-3 bg-[var(--input-bg)] rounded-lg border border-[var(--color-border)]">
                        <div className="flex justify-between items-start mb-1">
                            <span className="text-xs font-bold text-[var(--color-text-primary)]">PCI-DSS Level 1</span>
                            <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-500 text-[10px] font-bold border border-emerald-500/20">VALID</span>
                        </div>
                        <p className="text-[10px] text-[var(--color-text-secondary)]">Global Security Standard</p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <div className="col-span-12 flex items-center justify-between py-2 border-t border-[var(--color-border)] mt-2">
                <div className="flex items-center gap-2 text-[10px] text-[var(--color-text-secondary)]">
                    <Info size={12} />
                    <span>Primary Sources: CBN, GSMA, Company filings, Lemina research</span>
                </div>
                <span className="text-[10px] text-[var(--color-text-secondary)] opacity-70">
                    Last Updated: 6 days ago
                </span>
            </div>

        </div>
    );
}
