'use client';

import { Users, Scale, FileCheck, Shield, Award, CheckCircle2, AlertCircle, FileText, ArrowUpRight, Lock, Eye } from 'lucide-react';

export default function TeamLegalTab() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 max-w-7xl mx-auto font-sans text-[var(--color-text-primary)]">

            {/* --- Founders at a Glance (Hero Row) --- */}
            <div className="col-span-12 grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Founder 1 */}
                <div className="bg-[var(--card-bg)] border border-[var(--color-border)] rounded-xl p-5 flex items-start gap-4 hover:border-[var(--color-accent-primary)] transition-colors group relative overflow-hidden">
                    <div className="w-12 h-12 rounded-lg bg-[var(--input-bg)] flex items-center justify-center text-lg font-bold text-[var(--color-text-secondary)] border border-[var(--color-border)] group-hover:bg-[var(--color-accent-primary)] group-hover:text-white transition-colors shrink-0">
                        SA
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-base font-bold text-[var(--color-text-primary)]">Shola Akinlade</h3>
                            <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 text-[10px] font-bold border border-emerald-200 flex items-center gap-1">
                                <CheckCircle2 size={10} /> Verified
                            </span>
                        </div>
                        <p className="text-xs text-[var(--color-accent-primary)] font-medium mb-1">Co-founder & CEO</p>
                        <p className="text-xs text-[var(--color-text-secondary)] opacity-80 line-clamp-1">
                            Ex-Precurio. Software Engineer. YC Alumnus.
                        </p>
                    </div>
                </div>

                {/* Founder 2 */}
                <div className="bg-[var(--card-bg)] border border-[var(--color-border)] rounded-xl p-5 flex items-start gap-4 hover:border-[var(--color-accent-primary)] transition-colors group relative overflow-hidden">
                    <div className="w-12 h-12 rounded-lg bg-[var(--input-bg)] flex items-center justify-center text-lg font-bold text-[var(--color-text-secondary)] border border-[var(--color-border)] group-hover:bg-[var(--color-accent-primary)] group-hover:text-white transition-colors shrink-0">
                        EO
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-base font-bold text-[var(--color-text-primary)]">Ezra Olubi</h3>
                            <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 text-[10px] font-bold border border-emerald-200 flex items-center gap-1">
                                <CheckCircle2 size={10} /> Verified
                            </span>
                        </div>
                        <p className="text-xs text-[var(--color-accent-primary)] font-medium mb-1">Co-founder & CTO</p>
                        <p className="text-xs text-[var(--color-text-secondary)] opacity-80 line-clamp-1">
                            Software Architect. Ex-Jobberman. YC Alumnus.
                        </p>
                    </div>
                </div>
            </div>

            {/* --- Team Snapshot & Cap Table --- */}

            {/* Team Snapshot (Span 4) */}
            <section className="col-span-12 md:col-span-4 bg-[var(--card-bg)] border border-[var(--color-border)] rounded-xl shadow-sm p-6 flex flex-col h-full">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold flex items-center gap-2">
                        <Users size={16} className="text-blue-500" />
                        Team Snapshot
                    </h3>
                </div>

                <div className="space-y-4 flex-1">
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-[var(--color-text-secondary)]">Current Headcount</span>
                        <span className="text-lg font-bold">186</span>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between text-[10px] text-[var(--color-text-secondary)]">
                            <span>Engineering</span>
                            <span>45%</span>
                        </div>
                        <div className="w-full h-1.5 bg-[var(--input-bg)] rounded-full overflow-hidden flex">
                            <div className="h-full bg-blue-500 w-[45%]"></div>
                            <div className="h-full bg-emerald-500 w-[30%]"></div>
                            <div className="h-full bg-purple-500 w-[25%]"></div>
                        </div>
                        <div className="flex gap-3 mt-1">
                            <div className="flex items-center gap-1 text-[10px] text-[var(--color-text-secondary)]">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div> Eng
                            </div>
                            <div className="flex items-center gap-1 text-[10px] text-[var(--color-text-secondary)]">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> Ops
                            </div>
                            <div className="flex items-center gap-1 text-[10px] text-[var(--color-text-secondary)]">
                                <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div> Sales
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-[var(--color-border)]">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-xs font-medium text-[var(--color-text-secondary)]">Talent Risk Score</span>
                            <span className="text-xs font-bold text-emerald-500">Low (92/100)</span>
                        </div>
                        <p className="text-[10px] text-[var(--color-text-secondary)] opacity-80">
                            High retention. Recent senior hires from Google, Interswitch.
                        </p>
                    </div>
                </div>
            </section>

            {/* Cap Table (Span 8) */}
            <section className="col-span-12 md:col-span-8 bg-[var(--card-bg)] border border-[var(--color-border)] rounded-xl shadow-sm p-0 overflow-hidden flex flex-col h-full relative">
                {/* Lemina Verdict Badge - Top Right */}
                <div className="absolute top-0 right-0 p-3 z-10">
                    <div className="px-3 py-1.5 bg-gradient-to-r from-emerald-50/80 to-teal-50/80 backdrop-blur-sm border border-emerald-100 rounded-lg shadow-sm flex items-center gap-2">
                        <Award size={14} className="text-emerald-600" />
                        <span className="text-[10px] font-bold text-emerald-800">
                            Top-tier execution pedigree. Clean legal structure.
                        </span>
                    </div>
                </div>

                <div className="p-6 border-b border-[var(--color-border)]">
                    <h3 className="text-sm font-bold flex items-center gap-2">
                        <PieChartIcon className="text-emerald-500" size={16} /> {/* Custom Icon shim below if import fails, using standard Lucide PieChart */}
                        Cap Table & Ownership
                    </h3>
                </div>

                <div className="flex-1 overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[var(--bg-secondary)] text-[10px] uppercase text-[var(--color-text-secondary)] tracking-wider">
                                <th className="px-6 py-3 font-semibold">Shareholder</th>
                                <th className="px-6 py-3 font-semibold">Type</th>
                                <th className="px-6 py-3 font-semibold text-right">Ownership %</th>
                                <th className="px-6 py-3 font-semibold text-right">Vesting</th>
                            </tr>
                        </thead>
                        <tbody className="text-xs font-medium divide-y divide-[var(--color-border)]">
                            <tr className="hover:bg-[var(--color-bg-secondary)] transition-colors">
                                <td className="px-6 py-3 text-[var(--color-text-primary)] font-bold">Founders</td>
                                <td className="px-6 py-3 text-[var(--color-text-secondary)]">Common Stock</td>
                                <td className="px-6 py-3 text-right">--</td>
                                <td className="px-6 py-3 text-right text-emerald-600 font-medium">Fully Vested</td>
                            </tr>
                            <tr className="hover:bg-[var(--color-bg-secondary)] transition-colors">
                                <td className="px-6 py-3 text-[var(--color-text-primary)] font-bold">Stripe</td>
                                <td className="px-6 py-3 text-[var(--color-text-secondary)]">Strategic (Acquirer)</td>
                                <td className="px-6 py-3 text-right">100%</td>
                                <td className="px-6 py-3 text-right text-[var(--color-text-secondary)]">-</td>
                            </tr>
                            <tr className="hover:bg-[var(--color-bg-secondary)] transition-colors">
                                <td className="px-6 py-3 text-[var(--color-text-primary)] font-bold">ESOP Pool</td>
                                <td className="px-6 py-3 text-[var(--color-text-secondary)]">Options</td>
                                <td className="px-6 py-3 text-right">--</td>
                                <td className="px-6 py-3 text-right text-[var(--color-text-secondary)]">Active</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            {/* --- Legal & Regulatory Health (Grid) --- */}
            <div className="col-span-12 grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Incorporation */}
                <div className="bg-[var(--card-bg)] border border-[var(--color-border)] rounded-xl p-4 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/5 rounded-bl-full -mr-8 -mt-8 group-hover:bg-emerald-500/10 transition-colors"></div>
                    <div className="flex flex-col gap-3">
                        <div className="p-2 w-fit rounded-lg bg-emerald-100 text-emerald-600">
                            <Scale size={18} />
                        </div>
                        <div>
                            <h4 className="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wide">Incorporation</h4>
                            <p className="text-sm font-bold text-[var(--color-text-primary)] mt-0.5">CAC Nigeria</p>
                            <div className="flex items-center gap-1.5 mt-2">
                                <CheckCircle2 size={12} className="text-emerald-500" />
                                <span className="text-[10px] text-emerald-600 font-bold">VERIFIED</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Licensing */}
                <div className="bg-[var(--card-bg)] border border-[var(--color-border)] rounded-xl p-4 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/5 rounded-bl-full -mr-8 -mt-8 group-hover:bg-emerald-500/10 transition-colors"></div>
                    <div className="flex flex-col gap-3">
                        <div className="p-2 w-fit rounded-lg bg-emerald-100 text-emerald-600">
                            <Award size={18} />
                        </div>
                        <div>
                            <h4 className="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wide">License</h4>
                            <p className="text-sm font-bold text-[var(--color-text-primary)] mt-0.5">CBN PSSP</p>
                            <div className="flex items-center gap-1.5 mt-2">
                                <CheckCircle2 size={12} className="text-emerald-500" />
                                <span className="text-[10px] text-emerald-600 font-bold">ACTIVE</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* IP Ownership */}
                <div className="bg-[var(--card-bg)] border border-[var(--color-border)] rounded-xl p-4 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/5 rounded-bl-full -mr-8 -mt-8 group-hover:bg-emerald-500/10 transition-colors"></div>
                    <div className="flex flex-col gap-3">
                        <div className="p-2 w-fit rounded-lg bg-emerald-100 text-emerald-600">
                            <Lock size={18} />
                        </div>
                        <div>
                            <h4 className="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wide">IP Ownership</h4>
                            <p className="text-sm font-bold text-[var(--color-text-primary)] mt-0.5">Assignments</p>
                            <div className="flex items-center gap-1.5 mt-2">
                                <CheckCircle2 size={12} className="text-emerald-500" />
                                <span className="text-[10px] text-emerald-600 font-bold">SIGNED</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Litigation */}
                <div className="bg-[var(--card-bg)] border border-[var(--color-border)] rounded-xl p-4 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/5 rounded-bl-full -mr-8 -mt-8 group-hover:bg-emerald-500/10 transition-colors"></div>
                    <div className="flex flex-col gap-3">
                        <div className="p-2 w-fit rounded-lg bg-emerald-100 text-emerald-600">
                            <Shield size={18} />
                        </div>
                        <div>
                            <h4 className="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wide">Litigation</h4>
                            <p className="text-sm font-bold text-[var(--color-text-primary)] mt-0.5">Clean Record</p>
                            <div className="flex items-center gap-1.5 mt-2">
                                <CheckCircle2 size={12} className="text-emerald-500" />
                                <span className="text-[10px] text-emerald-600 font-bold">CLEAN</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- Bottom Row: Red Flags & Key Docs --- */}

            {/* Red Flags (Span 6) */}
            <div className="col-span-12 md:col-span-6 bg-[var(--card-bg)] border border-[var(--color-border)] rounded-xl shadow-sm p-6 flex flex-col justify-center">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[var(--input-bg)] flex items-center justify-center text-[var(--color-text-secondary)]">
                        <CheckCircle2 size={20} className="text-emerald-500" />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-[var(--color-text-primary)]">No Red Flags Detected</h3>
                        <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
                            Our automated due diligence found no critical issues.
                        </p>
                    </div>
                </div>
            </div>

            {/* Key Documents (Span 6) */}
            <div className="col-span-12 md:col-span-6 bg-[var(--card-bg)] border border-[var(--color-border)] rounded-xl shadow-sm p-6">
                <h3 className="text-sm font-bold flex items-center gap-2 mb-4">
                    <FileText size={16} className="text-blue-500" />
                    Key Documents
                </h3>
                <div className="grid grid-cols-2 gap-3">
                    <a href="#" className="flex items-center gap-3 p-3 rounded-lg border border-[var(--color-border)] bg-[var(--input-bg)] hover:bg-[var(--color-bg-secondary)] hover:border-blue-200 transition-all group">
                        <div className="w-8 h-8 rounded bg-rose-50 flex items-center justify-center text-rose-500 text-[10px] font-bold border border-rose-100">PDF</div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-[var(--color-text-primary)] truncate group-hover:text-blue-600">Cert. of Incorporation</p>
                            <p className="text-[10px] text-[var(--color-text-secondary)]">CAC • 1.2MB</p>
                        </div>
                        <Eye size={14} className="text-[var(--color-text-secondary)] group-hover:text-blue-500" />
                    </a>
                    <a href="#" className="flex items-center gap-3 p-3 rounded-lg border border-[var(--color-border)] bg-[var(--input-bg)] hover:bg-[var(--color-bg-secondary)] hover:border-blue-200 transition-all group">
                        <div className="w-8 h-8 rounded bg-rose-50 flex items-center justify-center text-rose-500 text-[10px] font-bold border border-rose-100">PDF</div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-[var(--color-text-primary)] truncate group-hover:text-blue-600">Shareholder Agreement</p>
                            <p className="text-[10px] text-[var(--color-text-secondary)]">Signed • 2.4MB</p>
                        </div>
                        <Eye size={14} className="text-[var(--color-text-secondary)] group-hover:text-blue-500" />
                    </a>
                </div>
            </div>

        </div>
    );
}

// Icon shim for PieChart to match design if needed, but import works from lucide-react
function PieChartIcon({ className, size }: { className?: string; size?: number }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
            <path d="M22 12A10 10 0 0 0 12 2v10z" />
        </svg>
    )
}
