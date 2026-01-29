'use client';

import Link from 'next/link';
import { Target, Star } from 'lucide-react';

interface CompanyMetric {
    label: string;
    value: string;
}

export interface CompanyCardProps {
    id: string;
    name: string;
    description: string;
    logo?: string | null;
    location: string;
    employees: number;
    funding: string;
    lastUpdated: string;
    flags?: string[];
    metrics: CompanyMetric[];
    isSaved?: boolean;
    matchScore?: number; // 0-100
    isVerified?: boolean;
}

export default function CompanyCard({
    id,
    name,
    description,
    logo,
    location,
    employees,
    funding,
    lastUpdated,
    flags,
    metrics,
    isSaved = false,
    matchScore,
    isVerified = false
}: CompanyCardProps) {
    const displayMetrics = metrics;

    // Verification Tier Logic
    const getVerificationColor = (score: number) => {
        if (score >= 90) return 'bg-emerald-500 text-white'; // Tier 5 (Green)
        if (score >= 80) return 'bg-blue-500 text-white';    // Tier 4 (Blue)
        if (score >= 60) return 'bg-slate-500 text-white';   // Tier 3 (Gray)
        if (score >= 40) return 'bg-amber-500 text-white';   // Tier 2 (Yellow)
        return 'bg-red-500 text-white';                      // Tier 1 (Red)
    };

    return (
        <div className="glass-panel p-5 relative overflow-hidden group hover:border-[var(--color-accent-primary)]/30 transition-all duration-300">
            {/* Removed standalone verification square as requested */}

            <div className="flex flex-col gap-4">
                {/* Header Section */}
                <div className="flex justify-between items-start gap-4">
                    <div className="flex items-center gap-3">
                        {logo ? (
                            <img
                                src={logo}
                                alt={name}
                                className="w-10 h-10 rounded-full object-contain shrink-0 bg-white p-1"
                            />
                        ) : (
                            <div className="w-10 h-10 rounded-full shrink-0 bg-[var(--color-bg-secondary)] flex items-center justify-center text-xl border border-[var(--glass-border-color)]">
                                {name.includes('Seren') || name.includes('Pay') ? "🔵" : "🟠"}
                            </div>
                        )}
                        <div>
                            <h2 className="text-lg font-bold text-[var(--color-text-primary)] leading-tight flex items-center gap-1.5">
                                {name}
                            </h2>
                            <div className="flex items-center gap-2 mt-0.5">
                                {/* Verification Color Indicator (Text-less pill) */}
                                <div
                                    className={`w-12 h-1.5 rounded-full ${matchScore !== undefined ? getVerificationColor(matchScore).split(' ')[0] : 'bg-slate-200'}`}
                                    title={`Verification Tier: ${funding}`}
                                />
                                <span className="text-[10px] text-[var(--color-text-secondary)]">HQ: {location}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Description */}
                <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed line-clamp-2">
                    {description}
                </p>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 gap-2 bg-[var(--card-bg)]/50 p-2 rounded-lg border border-[var(--glass-border-color)]">
                    {displayMetrics.map((metric, index) => (
                        <div key={index} className="flex flex-col">
                            <span className="text-[9px] uppercase tracking-wider text-[var(--color-text-secondary)] mb-0.5">{metric.label}</span>
                            <span className="text-xs font-semibold text-[var(--color-text-primary)] leading-tight whitespace-normal break-words">{metric.value}</span>
                        </div>
                    ))}
                </div>

                {/* Footer Actions */}
                <div className="flex items-center justify-between mt-1">
                    <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent-primary)] shadow-[0_0_8px_var(--color-accent-primary)]" />
                        <span className="text-[9px] text-[var(--color-text-secondary)] italic">
                            Updated {lastUpdated}
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Quick Actions */}
                        <button className="w-7 h-7 flex items-center justify-center rounded-full border border-[var(--glass-border-color)] bg-[var(--input-bg)] hover:bg-[var(--glass-border-color)] text-[var(--color-text-secondary)] hover:text-indigo-600 transition-colors" title="Add to Pipeline">
                            <Target size={12} />
                        </button>
                        <button className="w-7 h-7 flex items-center justify-center rounded-full border border-[var(--glass-border-color)] bg-[var(--input-bg)] hover:bg-[var(--glass-border-color)] text-[var(--color-text-secondary)] hover:text-indigo-600 transition-colors" title="Track Company">
                            <Star size={12} />
                        </button>

                        <Link href={`/dashboard/companies/${id}`} className="py-1.5 px-3 rounded-full border border-[var(--glass-border-color)] bg-[var(--input-bg)] hover:bg-[var(--glass-border-color)] text-[var(--color-text-primary)] text-[10px] font-bold uppercase tracking-wide transition-all duration-300 flex items-center gap-1 hover:border-[var(--color-accent-primary)] hover:text-[var(--color-accent-primary)]">
                            View
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
