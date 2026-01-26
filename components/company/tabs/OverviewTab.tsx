'use client';

import { CheckCircle2, AlertCircle, TrendingUp, Lightbulb, Target, ArrowUpRight } from 'lucide-react';
import VerifiedText from '../VerifiedText';

interface OverviewTabProps {
    company: any; // Using any for agility, ideally strictly typed in future
}

export default function OverviewTab({ company }: OverviewTabProps) {
    // If no company data, safe return
    if (!company) return null;

    return (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 max-w-7xl mx-auto font-sans">

            {/* COLUMN 1 (Span 4) - About */}
            <div className="md:col-span-4 flex flex-col gap-5 h-full">
                <section className="bg-[var(--card-bg)] border border-[var(--color-border)] rounded-xl shadow-sm p-6 relative overflow-hidden h-[380px]">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-[var(--color-text-primary)] flex items-center gap-2">
                            About
                        </h2>
                    </div>
                    <div className="text-[var(--color-text-secondary)] text-sm leading-relaxed space-y-4">
                        <p className="line-clamp-6">
                            {company.about || company.description}
                        </p>
                        <hr className="border-[var(--color-border)] opacity-50 my-4" />
                        <div className="grid grid-cols-2 gap-y-4 gap-x-2">
                            <div>
                                <span className="text-[10px] uppercase tracking-wider text-[var(--color-text-secondary)] font-semibold block mb-0.5">Headquarters</span>
                                <span className="text-sm font-medium text-[var(--color-text-primary)]">{company.location}</span>
                            </div>
                            <div>
                                <span className="text-[10px] uppercase tracking-wider text-[var(--color-text-secondary)] font-semibold block mb-0.5">Industry</span>
                                <span className="text-sm font-medium text-[var(--color-text-primary)]">{company.industry}</span>
                            </div>
                            <div>
                                <span className="text-[10px] uppercase tracking-wider text-[var(--color-text-secondary)] font-semibold block mb-0.5">Founded</span>
                                <span className="text-sm font-medium text-[var(--color-text-primary)]">{company.founded}</span>
                            </div>
                            <div>
                                <span className="text-[10px] uppercase tracking-wider text-[var(--color-text-secondary)] font-semibold block mb-0.5">Employees</span>
                                <span className="text-sm font-medium text-[var(--color-text-primary)]">{company.employees}</span>
                            </div>
                        </div>
                    </div>
                    {/* Fade effect */}
                    <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[var(--card-bg)] to-transparent pointer-events-none"></div>
                </section>

                {/* Pitch Deck */}
                <section className="bg-[var(--card-bg)] border border-[var(--color-border)] rounded-xl shadow-sm p-6 flex-1 flex flex-col justify-center relative overflow-hidden group cursor-pointer hover:border-[var(--color-accent-primary)] transition-colors">
                    <div className="flex items-start justify-between mb-2">
                        <div>
                            <h2 className="text-base font-bold text-[var(--color-text-primary)] flex items-center gap-2 group-hover:text-[var(--color-accent-primary)] transition-colors">
                                Relevant Documents
                            </h2>
                            <p className="text-xs text-[var(--color-text-secondary)] mt-1">Series A Presentation</p>
                        </div>
                        <div className="w-8 h-8 rounded-lg bg-[var(--input-bg)] flex items-center justify-center text-[var(--color-text-secondary)] group-hover:bg-[var(--color-accent-primary)] group-hover:text-white transition-all">
                            <ArrowUpRight size={16} />
                        </div>
                    </div>
                    <div className="mt-3 p-3 rounded-lg bg-[var(--input-bg)] border border-[var(--color-border)] flex items-center gap-3">
                        <div className="w-8 h-10 bg-rose-100 rounded flex items-center justify-center shrink-0">
                            <span className="text-[10px] font-bold text-rose-600">PDF</span>
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-medium text-[var(--color-text-primary)] truncate">{company.name}_Deck.pdf</p>
                            <p className="text-[10px] text-[var(--color-text-secondary)]">2.4 MB • Added 2 days ago</p>
                        </div>
                    </div>
                </section>
            </div>

            {/* COLUMN 2 (Span 4) - Commercials & Key People */}
            <div className="md:col-span-4 flex flex-col gap-5 h-full">
                <section className="bg-[var(--card-bg)] border border-[var(--color-border)] rounded-xl shadow-sm p-6">
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="text-lg font-bold text-[var(--color-text-primary)]">Commercial Maturity</h2>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-200 uppercase tracking-wide">
                            Scaling
                        </span>
                    </div>

                    <div className="space-y-3">
                        {/* Metrics derived from API (mocked in mapper if missing) */}
                        {[
                            { label: "MoM Growth", val: "15%", sub: "+2.4% vs prev", color: "emerald", icon: TrendingUp },
                            { label: "Market Share", val: "N/A", sub: "Dominant Player", color: "blue", icon: Target },
                            { label: "Retention", val: "N/A", sub: "Best in Class", color: "purple", icon: CheckCircle2 }
                        ].map((m, i) => (
                            <div key={i} className="p-3 bg-[var(--input-bg)] rounded-lg border border-[var(--color-border)]">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-xs font-medium text-[var(--color-text-secondary)]">{m.label}</span>
                                    <m.icon size={14} className={`text-${m.color}-500`} />
                                </div>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-xl font-bold text-[var(--color-text-primary)]">{m.val}</span>
                                    <span className={`text-[10px] text-${m.color}-600 font-medium`}>{m.sub}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Team Credibility */}
                <section className="bg-[var(--card-bg)] border border-[var(--color-border)] rounded-xl shadow-sm p-6 flex-1">
                    <h2 className="text-lg font-bold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
                        Key People
                    </h2>
                    <div className="space-y-5">
                        {company.founders && company.founders.length > 0 ? (
                            company.founders.map((f: any, i: number) => (
                                <div key={i} className="flex gap-3 items-start">
                                    <div className="w-10 h-10 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 text-xs font-bold shrink-0">
                                        {f.name.split(' ').map((n: string) => n[0]).join('')}
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-[var(--color-text-primary)]">{f.name}</h4>
                                        <p className="text-xs text-[var(--color-accent-primary)] font-medium">{f.role}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-xs text-[var(--color-text-secondary)]">No founder info available.</p>
                        )}
                    </div>
                </section>
            </div>

            {/* COLUMN 3 (Span 4) - Highlights, Signals, Risks */}
            <div className="md:col-span-4 flex flex-col gap-5 h-full">
                {/* Funding */}
                <section className="rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 shadow-sm">
                    <div className="flex flex-col h-full justify-between gap-4">


                        <div>
                            <h3 className="text-xs font-bold text-blue-800 uppercase tracking-wide mb-1">Funding Highlights</h3>
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-bold text-blue-950">
                                    <VerifiedText data={company.totalRaised} />
                                </span>
                                <span className="text-xs text-blue-700 font-medium">Total Raised</span>
                            </div>
                            <div className="mt-3 flex flex-wrap gap-1.5">
                                {company.investors && company.investors.map((inv: string, i: number) => (
                                    <span key={i} className="px-2 py-1 bg-white/60 rounded text-[10px] font-semibold text-blue-800 border border-blue-100">
                                        {inv}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="pt-4 border-t border-blue-200/50">
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-xs text-blue-800 font-medium">Implied Valuation</span>
                                <span className="text-xs font-bold text-blue-900">
                                    <VerifiedText data={company.valuation} />
                                </span>
                            </div>
                            <p className="text-[10px] text-blue-700 mt-2 leading-tight">
                                {company.valuationNote}
                            </p>
                        </div>
                    </div>
                </section>

                {/* Signals */}
                <section className="bg-[var(--card-bg)] border border-[var(--color-border)] rounded-xl shadow-sm p-6 border-l-4 border-l-emerald-500">
                    <h3 className="text-sm font-bold text-[var(--color-text-primary)] mb-3 flex items-center gap-2">
                        <TrendingUp className="text-emerald-500" size={16} />
                        Signals (The Bull Case)
                    </h3>
                    <ul className="space-y-2">
                        {company.signals && company.signals.length > 0 ? (
                            company.signals.map((s: any, i: number) => (
                                <li key={i} className="flex gap-2 text-xs text-[var(--color-text-secondary)] leading-snug">
                                    <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                                    <span>{s.text}</span>
                                </li>
                            ))
                        ) : (
                            <li className="text-xs text-[var(--color-text-secondary)]">No signals detected yet.</li>
                        )}
                    </ul>
                </section>

                <section className="bg-[var(--card-bg)] border border-[var(--color-border)] rounded-xl shadow-sm p-6 border-l-4 border-l-amber-500">
                    <h3 className="text-sm font-bold text-[var(--color-text-primary)] mb-3 flex items-center gap-2">
                        <AlertCircle className="text-amber-500" size={16} />
                        Risks (The Bear Case)
                    </h3>
                    <ul className="space-y-2">
                        {company.risks && company.risks.length > 0 ? (
                            company.risks.map((r: any, i: number) => (
                                <li key={i} className="flex gap-2 text-xs text-[var(--color-text-secondary)] leading-snug">
                                    <AlertCircle size={14} className="text-amber-500 shrink-0 mt-0.5" />
                                    <span>{r.text}</span>
                                </li>
                            ))
                        ) : (
                            <li className="text-xs text-[var(--color-text-secondary)]">No major red flags detected.</li>
                        )}
                    </ul>
                </section>

                <section className="bg-[var(--card-bg)] border border-[var(--color-border)] rounded-xl shadow-sm p-4 flex items-center justify-between cursor-pointer hover:border-[var(--color-accent-primary)] transition-colors group">
                    <div>
                        <h3 className="text-sm font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-accent-primary)] transition-colors">Generate Report</h3>
                        <p className="text-[10px] text-[var(--color-text-secondary)]">Export full DD PDF</p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-[var(--input-bg)] flex items-center justify-center group-hover:bg-[var(--color-accent-primary)] group-hover:text-white transition-colors">
                        <ArrowUpRight size={14} />
                    </div>
                </section>
            </div>

        </div>
    );
}
