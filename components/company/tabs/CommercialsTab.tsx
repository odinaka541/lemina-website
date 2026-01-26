'use client';

import { DollarSign, TrendingUp, Briefcase, AlertTriangle, FileText, Eye, CheckCircle2, ArrowUpRight, Percent, CreditCard, Scale, Users } from 'lucide-react';
import { AreaChart, Area, Tooltip, ResponsiveContainer } from 'recharts';

// Mock Data for Cash/Runway Chart (Simulating infinite/growing for profitable co)
const cashData = [
    { month: 'Jan', value: 12.5 }, { month: 'Feb', value: 13.2 }, { month: 'Mar', value: 14.1 },
    { month: 'Apr', value: 14.8 }, { month: 'May', value: 15.6 }, { month: 'Jun', value: 16.5 },
    { month: 'Jul', value: 17.8 }, { month: 'Aug', value: 19.1 }, { month: 'Sep', value: 20.5 },
    { month: 'Oct', value: 22.0 }, { month: 'Nov', value: 23.8 }, { month: 'Dec', value: 25.5 },
];

export default function CommercialsTab() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 max-w-7xl mx-auto font-sans text-[var(--color-text-primary)]">

            {/* --- Financial Snapshot Hero (Span 8) --- */}
            <section className="col-span-12 md:col-span-8 bg-[var(--card-bg)] border border-[var(--color-border)] rounded-xl shadow-sm p-6 flex flex-col justify-between relative overflow-hidden">
                {/* Lemina Verdict Badge - Absolute Top Right */}
                <div className="absolute top-4 right-4">
                    <div className="px-3 py-1.5 bg-gradient-to-r from-emerald-50/80 to-teal-50/80 backdrop-blur-sm border border-emerald-100 rounded-lg shadow-sm flex items-center gap-2">
                        <Scale size={14} className="text-emerald-600" />
                        <span className="text-[10px] font-bold text-emerald-800">
                            Proven Business Model. Healthy Unit Economics.
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500">
                        <DollarSign size={24} />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold">Financial Snapshot</h2>
                        <p className="text-xs text-[var(--color-text-secondary)]">Revenue Generating • Series A+</p>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-6">
                    <div className="space-y-1">
                        <span className="text-xs text-[var(--color-text-secondary)] font-medium uppercase tracking-wide">Monthly Revenue (MRR)</span>
                        <div className="text-3xl font-bold font-mono">$12M+</div>
                        <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">TIER 4</span>
                            <span className="text-[10px] text-[var(--color-text-secondary)]">Verified</span>
                        </div>
                    </div>
                    <div className="space-y-1 border-l border-[var(--color-border)] pl-6">
                        <span className="text-xs text-[var(--color-text-secondary)] font-medium uppercase tracking-wide">YoY Growth</span>
                        <div className="text-3xl font-bold font-mono text-emerald-500">85%</div>
                        <span className="text-[10px] text-[var(--color-text-secondary)]">Accelerating vs prev. year</span>
                    </div>
                    <div className="space-y-1 border-l border-[var(--color-border)] pl-6">
                        <span className="text-xs text-[var(--color-text-secondary)] font-medium uppercase tracking-wide">Gross Margin</span>
                        <div className="text-3xl font-bold font-mono">65%</div>
                        <span className="text-[10px] text-[var(--color-text-secondary)]">Software-level margins</span>
                    </div>
                </div>
            </section>

            {/* --- Unit Economics (Span 4) --- */}
            <section className="col-span-12 md:col-span-4 bg-[var(--card-bg)] border border-[var(--color-border)] rounded-xl shadow-sm p-6 flex flex-col justify-between">
                <div className="flex items-center gap-2 mb-4">
                    <TrendingUp size={18} className="text-blue-500" />
                    <h3 className="text-sm font-bold">Unit Economics</h3>
                </div>

                <div className="space-y-4 flex-1">
                    <div className="flex justify-between items-center py-2 border-b border-[var(--color-border)]">
                        <span className="text-xs text-[var(--color-text-secondary)]">CAC (Blended)</span>
                        <div className="text-right">
                            <span className="text-sm font-bold font-mono block">~$250</span>
                            <span className="text-[10px] text-emerald-500">Tier 3 Verified</span>
                        </div>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-[var(--color-border)]">
                        <span className="text-xs text-[var(--color-text-secondary)]">LTV (Lifetime Value)</span>
                        <div className="text-right">
                            <span className="text-sm font-bold font-mono block">$12.5k</span>
                            <span className="text-[10px] text-[var(--color-text-secondary)]">5yr Horizon</span>
                        </div>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-[var(--color-border)]">
                        <span className="text-xs text-[var(--color-text-secondary)]">LTV:CAC Ratio</span>
                        <div className="text-right">
                            <span className="text-sm font-bold font-mono text-emerald-500 block">50:1</span>
                            <span className="text-[10px] text-[var(--color-text-secondary)]">Exceptional</span>
                        </div>
                    </div>
                    <div className="flex justify-between items-center pt-1">
                        <span className="text-xs text-[var(--color-text-secondary)]">Payback Period</span>
                        <div className="text-right">
                            <span className="text-sm font-bold font-mono block">&lt; 3 Mo</span>
                            <span className="text-[10px] text-emerald-500">Instant</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- Middle Row: Revenue Breakdown & Cash --- */}

            {/* Revenue Breakdown (Span 6) */}
            <section className="col-span-12 md:col-span-6 bg-[var(--card-bg)] border border-[var(--color-border)] rounded-xl shadow-sm p-6 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold flex items-center gap-2">
                        <Percent size={16} className="text-purple-500" />
                        Revenue Breakdown
                    </h3>
                    <span className="text-[10px] text-[var(--color-text-secondary)] uppercase">By Customer Segment</span>
                </div>

                <div className="space-y-4 pt-2">
                    {/* Enterprise */}
                    <div>
                        <div className="flex justify-between items-end mb-1">
                            <span className="text-xs font-medium text-[var(--color-text-primary)]">Enterprise (Banks, Telcos)</span>
                            <span className="text-xs font-bold font-mono">65%</span>
                        </div>
                        <div className="w-full bg-[var(--input-bg)] h-2 rounded-full overflow-hidden">
                            <div className="bg-purple-500 h-full w-[65%]"></div>
                        </div>
                        <p className="text-[10px] text-[var(--color-text-secondary)] mt-1">High volume, lower take-rate (0.8 - 1.2%)</p>
                    </div>

                    {/* SME */}
                    <div>
                        <div className="flex justify-between items-end mb-1">
                            <span className="text-xs font-medium text-[var(--color-text-primary)]">SMEs / Startups</span>
                            <span className="text-xs font-bold font-mono">25%</span>
                        </div>
                        <div className="w-full bg-[var(--input-bg)] h-2 rounded-full overflow-hidden">
                            <div className="bg-blue-500 h-full w-[25%]"></div>
                        </div>
                        <p className="text-[10px] text-[var(--color-text-secondary)] mt-1">Stardard pricing (1.5% + NGN 100)</p>
                    </div>

                    {/* Starter */}
                    <div>
                        <div className="flex justify-between items-end mb-1">
                            <span className="text-xs font-medium text-[var(--color-text-primary)]">Starter / Micro</span>
                            <span className="text-xs font-bold font-mono">10%</span>
                        </div>
                        <div className="w-full bg-[var(--input-bg)] h-2 rounded-full overflow-hidden">
                            <div className="bg-emerald-500 h-full w-[10%]"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Cash & Runway (Span 6) */}
            <section className="col-span-12 md:col-span-6 bg-[var(--card-bg)] border border-[var(--color-border)] rounded-xl shadow-sm p-6 flex flex-col relative overflow-hidden">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-bold flex items-center gap-2">
                        <Briefcase size={16} className="text-emerald-500" />
                        Cash & Runway
                    </h3>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <span className="text-[10px] text-[var(--color-text-secondary)] uppercase block mb-1">Status</span>
                        <span className="px-2 py-1 rounded bg-emerald-100 text-emerald-700 text-xs font-bold border border-emerald-200 inline-block">
                            PROFITABLE
                        </span>
                    </div>
                    <div>
                        <span className="text-[10px] text-[var(--color-text-secondary)] uppercase block mb-1">Runway</span>
                        <span className="text-sm font-bold text-[var(--color-text-primary)]">Infinite</span>
                    </div>
                </div>

                <div className="flex-1 min-h-[100px] w-full mt-2 -mx-2">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={cashData}>
                            <defs>
                                <linearGradient id="cashGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <Area
                                type="monotone"
                                dataKey="value"
                                stroke="#10b981"
                                strokeWidth={2}
                                fillOpacity={1}
                                fill="url(#cashGradient)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
                <p className="text-[10px] text-[var(--color-text-secondary)] text-center mt-2">12-Month Cash Position Trend</p>
            </section>

            {/* --- Bottom Row: Retention, Pricing, Red Flags, Docs --- */}

            {/* Split Bottom Row (Span 12) */}
            <div className="col-span-12 grid grid-cols-1 md:grid-cols-3 gap-5">

                {/* Customer Metrics */}
                <div className="bg-[var(--card-bg)] border border-[var(--color-border)] rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-3">
                        <Users size={16} className="text-blue-500" />
                        <h3 className="text-sm font-bold">Retention</h3>
                    </div>
                    <div className="text-center py-4">
                        <div className="text-3xl font-bold font-mono text-[var(--color-text-primary)]">140%</div>
                        <p className="text-xs text-[var(--color-text-secondary)] mt-1">Net Dollar Retention (NDR)</p>
                    </div>
                    <div className="text-[10px] text-center text-[var(--color-text-secondary)] bg-[var(--input-bg)] py-1.5 rounded border border-[var(--color-border)]">
                        Best-in-class for B2B Payments
                    </div>
                </div>

                {/* Pricing Model */}
                <div className="bg-[var(--card-bg)] border border-[var(--color-border)] rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-3">
                        <CreditCard size={16} className="text-purple-500" />
                        <h3 className="text-sm font-bold">Pricing Model</h3>
                    </div>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-[var(--color-text-secondary)]">Local Txn</span>
                            <span className="font-bold font-mono">1.5% + ₦100</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-[var(--color-text-secondary)]">International</span>
                            <span className="font-bold font-mono">3.9% + ₦100</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-[var(--color-text-secondary)]">Transfer</span>
                            <span className="font-bold font-mono">₦10 - ₦50</span>
                        </div>
                    </div>
                </div>

                {/* Red Flags (Empty State / Green) */}
                <div className="bg-[var(--card-bg)] border border-[var(--color-border)] rounded-xl p-5 flex flex-col justify-center">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[var(--input-bg)] flex items-center justify-center text-[var(--color-text-secondary)] shrink-0">
                            <CheckCircle2 size={16} className="text-emerald-500" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-[var(--color-text-primary)]">No Red Flags</h3>
                            <p className="text-[10px] text-[var(--color-text-secondary)] mt-0.5 leading-tight">
                                Margins, runway, and concentration checks passed.
                            </p>
                        </div>
                    </div>
                </div>

            </div>

            {/* Key Documents (Full Span for visibility or Grid) -> Let's put docs in a row at bottom */}
            <section className="col-span-12 bg-[var(--card-bg)] border border-[var(--color-border)] rounded-xl shadow-sm p-6">
                <h3 className="text-sm font-bold flex items-center gap-2 mb-4">
                    <FileText size={16} className="text-blue-500" />
                    Key Financial Documents
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <a href="#" className="flex items-center gap-3 p-3 rounded-lg border border-[var(--color-border)] bg-[var(--input-bg)] hover:bg-[var(--color-bg-secondary)] hover:border-blue-200 transition-all group">
                        <div className="w-8 h-8 rounded bg-rose-50 flex items-center justify-center text-rose-500 text-[10px] font-bold border border-rose-100">PDF</div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-[var(--color-text-primary)] truncate group-hover:text-blue-600">Audited P&L 2024</p>
                            <p className="text-[10px] text-[var(--color-text-secondary)]">KPMG • 4.2MB</p>
                        </div>
                        <Eye size={14} className="text-[var(--color-text-secondary)] group-hover:text-blue-500" />
                    </a>
                    <a href="#" className="flex items-center gap-3 p-3 rounded-lg border border-[var(--color-border)] bg-[var(--input-bg)] hover:bg-[var(--color-bg-secondary)] hover:border-blue-200 transition-all group">
                        <div className="w-8 h-8 rounded bg-emerald-50 flex items-center justify-center text-emerald-500 text-[10px] font-bold border border-emerald-100">XLS</div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-[var(--color-text-primary)] truncate group-hover:text-blue-600">Fin. Model Forecast</p>
                            <p className="text-[10px] text-[var(--color-text-secondary)]">Internal • 1.1MB</p>
                        </div>
                        <Eye size={14} className="text-[var(--color-text-secondary)] group-hover:text-blue-500" />
                    </a>
                    <a href="#" className="flex items-center gap-3 p-3 rounded-lg border border-[var(--color-border)] bg-[var(--input-bg)] hover:bg-[var(--color-bg-secondary)] hover:border-blue-200 transition-all group">
                        <div className="w-8 h-8 rounded bg-rose-50 flex items-center justify-center text-rose-500 text-[10px] font-bold border border-rose-100">PDF</div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-[var(--color-text-primary)] truncate group-hover:text-blue-600">Bank Statement (Q3)</p>
                            <p className="text-[10px] text-[var(--color-text-secondary)]">Zenith • 2.8MB</p>
                        </div>
                        <Eye size={14} className="text-[var(--color-text-secondary)] group-hover:text-blue-500" />
                    </a>
                </div>
            </section>

        </div>
    );
}
