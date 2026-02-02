'use client';

import { useState } from 'react';

import Link from 'next/link';
import { Target, Star, ArrowRight } from 'lucide-react';

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
    matchScore?: number; // Deprecated
    isVerified?: boolean;
    verificationTier?: number;
    confidenceScore?: number;
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
    isVerified = false,
    verificationTier,
    confidenceScore
}: CompanyCardProps) {
    const [showDescriptionModal, setShowDescriptionModal] = useState(false);
    const displayMetrics = metrics;

    // Verification Tier Logic
    const getVerificationColor = (tier?: number, score?: number) => {
        // Prefer Tier if available
        if (tier) {
            if (tier === 5) return 'bg-emerald-500 text-white';
            if (tier === 4) return 'bg-blue-500 text-white';
            if (tier === 3) return 'bg-slate-500 text-white';
            if (tier === 2) return 'bg-amber-500 text-white';
            return 'bg-red-500 text-white';
        }
        // Fallback to Score
        if (!score) return 'bg-slate-200';
        if (score >= 90) return 'bg-emerald-500 text-white';
        if (score >= 80) return 'bg-blue-500 text-white';
        if (score >= 60) return 'bg-slate-500 text-white';
        if (score >= 40) return 'bg-amber-500 text-white';
        return 'bg-red-500 text-white';
    };

    const getTierLabel = (tier?: number) => {
        switch (tier) {
            case 5: return 'Tier 5: Govt Database';
            case 4: return 'Tier 4: Founder Verified';
            case 3: return 'Tier 3: Third Party';
            case 2: return 'Tier 2: News Cross-ref';
            default: return 'Tier 1: Self-Reported';
        }
    };

    return (
        <div className="glass-panel p-5 relative overflow-hidden group hover:border-[var(--color-accent-primary)]/30 transition-all duration-300">
            {/* Removed standalone verification square as requested */}

            <div className="flex flex-col gap-4">
                {/* Header Section */}
                <div className="flex justify-between items-start gap-4">
                    <div className="flex items-center gap-3">
                        {false && logo ? (
                            // FORCE FALLBACK: User requested disabling all images for consistency due to broken links
                            <img
                                src={logo || ''}
                                alt={name}
                                className="w-10 h-10 rounded-full object-contain shrink-0 bg-white p-1"
                            />
                        ) : (
                            <div className="w-10 h-10 rounded-full shrink-0 bg-[var(--color-bg-secondary)] flex items-center justify-center text-sm font-bold border border-[var(--glass-border-color)] text-[var(--color-primary)]">
                                {(name || '').slice(0, 2).toUpperCase()}
                            </div>
                        )}
                        <div>
                            <h2 className="text-lg font-bold text-[var(--color-text-primary)] leading-tight flex items-center gap-1.5">
                                {name}
                            </h2>
                            <div className="flex items-center gap-2 mt-0.5">
                                {/* Verification Color Indicator (Text-less pill) */}
                                {/* Verification Color Indicator (Text-less pill) */}
                                <div
                                    className={`w-12 h-1.5 rounded-full ${getVerificationColor(verificationTier, confidenceScore || matchScore).split(' ')[0]}`}
                                    title={`${getTierLabel(verificationTier)} (${confidenceScore || matchScore || 0}% confidence)`}
                                />
                                <span className="text-[10px] text-[var(--color-text-secondary)]">HQ: {location}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Description */}
                <div>
                    <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed line-clamp-2">
                        {description}
                    </p>
                    {(description?.length || 0) > 80 && (
                        <button
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowDescriptionModal(true); }}
                            className="text-[10px] text-indigo-500 hover:text-indigo-400 font-medium mt-1 hover:underline"
                        >
                            View Full Description
                        </button>
                    )}
                </div>

                {/* Description Modal */}
                {showDescriptionModal && (
                    <div
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowDescriptionModal(false); }}
                    >
                        <div
                            className="bg-white dark:bg-[#0F172A] p-8 rounded-2xl max-w-lg w-full shadow-2xl relative border border-[var(--glass-border-color)] animate-in zoom-in-95 duration-200"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="flex items-center gap-4 mb-6">
                                {false && logo ? (
                                    <img src={logo || ''} alt={name} className="w-12 h-12 rounded-full object-contain bg-white p-1" />
                                ) : (
                                    <div className="w-12 h-12 rounded-full bg-[var(--color-bg-secondary)] flex items-center justify-center text-lg font-bold border border-[var(--glass-border-color)] text-[var(--color-primary)]">
                                        {(name || '').slice(0, 2).toUpperCase()}
                                    </div>
                                )}
                                <div>
                                    <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400">
                                        {name}
                                    </h3>
                                    <p className="text-xs text-[var(--color-text-secondary)]">About the Company</p>
                                </div>
                            </div>

                            <p className="text-sm text-[var(--color-text-secondary)] leading-loose">
                                {description}
                            </p>

                            <div className="mt-8 flex justify-end">
                                <button
                                    onClick={() => setShowDescriptionModal(false)}
                                    className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}

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

                        <Link href={`/dashboard/companies/${id}`} className="h-8 px-4 flex items-center justify-center rounded-full border border-[var(--glass-border-color)] bg-[var(--input-bg)] hover:bg-[var(--glass-border-color)] text-[var(--color-text-primary)] transition-all duration-300 hover:border-[var(--color-accent-primary)] hover:text-[var(--color-accent-primary)] group" title="View Details">
                            <ArrowRight size={20} strokeWidth={3} className="transition-transform group-hover:translate-x-1" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
