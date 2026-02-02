'use client';

import Link from 'next/link';
import { Clock, ShieldCheck, Users, ArrowRight, MessageSquare, Zap } from 'lucide-react';

interface Deal {
    id: string;
    company: {
        name: string;
        description: string;
        logo_url: string; // Add fallback logic
        verification_tier: number;
    };
    valuation: number;
    valuation_type: string;
    deal_type: string;
    lead_investor: string;
    ownership_percentage: number;
    network_allocation: number;
    committed_amount: number;
    commitment_percentage: number;
    days_remaining: number;
    member_count: number;
    min_ticket: number;
    comment_count: number;
    status: string;
}

interface DealCardProps {
    deal: Deal;
    onCommit: (deal: Deal) => void;
}

// Helper for formatting large numbers
const formatMoney = (val: number) => {
    if (val >= 1000000) return `$${(val / 1000000).toFixed(0)}M`;
    if (val >= 1000) return `$${(val / 1000).toFixed(0)}k`;
    return `$${val}`;
};

export default function DealCard({ deal, onCommit }: DealCardProps) {
    const isClosingSoon = deal.days_remaining <= 7;
    const isFilled = deal.status === 'filled';
    const isClosed = deal.status === 'closed';

    return (
        <article
            className={`group bg-white rounded-2xl border transition-all duration-300 relative flex flex-col hover:shadow-xl hover:-translate-y-1 shadow-sm ${isClosingSoon && !isFilled && !isClosed ? 'border-amber-200 shadow-amber-100 hover:border-amber-300' : 'border-slate-200 hover:border-slate-300'
                } ${isClosed ? 'opacity-75 grayscale' : ''}`}
        >
            {/* Header Section */}
            <div className="p-5 border-b border-slate-50 flex justify-between items-start">
                <div className="flex gap-4">
                    {/* Logo Fallback */}
                    <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center text-white font-bold text-xl shrink-0 shadow-sm">
                        {deal.company.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-slate-900 leading-tight mb-0.5">{deal.company.name}</h3>
                        <p className="text-sm text-slate-500 line-clamp-1">{deal.company.description}</p>
                        {deal.company.verification_tier >= 3 && (
                            <div className="h-1.5 w-12 bg-emerald-500 rounded-full mt-2" title={`Verified Tier ${deal.company.verification_tier}`} />
                        )}
                    </div>
                </div>

                {/* Urgency Badge */}
                {!isClosed && !isFilled && (
                    <div className={`shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold ${isClosingSoon ? 'bg-amber-50 text-amber-700' : 'bg-slate-50 text-slate-600'
                        }`}>
                        <Clock size={12} />
                        {deal.days_remaining} days left
                    </div>
                )}
                {isFilled && (
                    <div className="shrink-0 px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-700 uppercase tracking-wide">
                        Filled
                    </div>
                )}
                {isClosed && (
                    <div className="shrink-0 px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-500 uppercase tracking-wide">
                        Closed
                    </div>
                )}
            </div>

            {/* Terms Grid */}
            <div className="p-5 grid grid-cols-3 gap-y-4 gap-x-4">
                <div>
                    <span className="block text-xs font-medium text-slate-400 mb-0.5">Valuation</span>
                    <span className="text-sm font-bold text-slate-900">{formatMoney(deal.valuation)} {deal.valuation_type}</span>
                </div>
                <div>
                    <span className="block text-xs font-medium text-slate-400 mb-0.5">Type</span>
                    <span className="text-sm font-bold text-slate-900">{deal.deal_type}</span>
                </div>
                <div>
                    <span className="block text-xs font-medium text-slate-400 mb-0.5">Ownership</span>
                    <span className="text-sm font-bold text-slate-900">~{deal.ownership_percentage}%</span>
                </div>
            </div>

            {/* Progress Section */}
            <div className="px-5 pb-5">
                <div className="flex justify-between items-end mb-2">
                    <div>
                        <span className="text-lg font-bold text-slate-900">${deal.committed_amount.toLocaleString()}</span>
                        <span className="text-xs text-slate-500 font-medium ml-1.5">committed</span>
                    </div>
                    <span className="text-xs font-bold text-slate-700">{deal.commitment_percentage}% of ${formatMoney(deal.network_allocation)}</span>
                </div>

                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden mb-2">
                    <div
                        className={`h-full rounded-full transition-all duration-700 ${deal.commitment_percentage >= 75 ? 'bg-gradient-to-r from-emerald-500 to-emerald-400' :
                            deal.commitment_percentage >= 50 ? 'bg-gradient-to-r from-amber-500 to-amber-400' :
                                'bg-gradient-to-r from-blue-500 to-blue-400'
                            }`}
                        style={{ width: `${deal.commitment_percentage}%` }}
                    ></div>
                </div>

                <div className="flex justify-between items-center text-xs text-slate-500 font-medium">
                    <span className="flex items-center gap-1.5"><Users size={12} /> {deal.member_count} committed</span>
                    <span>${(deal.network_allocation - deal.committed_amount).toLocaleString()} remaining</span>
                </div>
            </div>

            {/* Min Ticket & Comments */}
            <div className="px-5 pb-4 flex justify-between items-center border-t border-slate-50 pt-3">
                <div className="text-xs font-medium text-slate-400">
                    Min Ticket: <span className="text-slate-700 font-bold">${deal.min_ticket.toLocaleString()}</span>
                </div>
                {deal.comment_count > 0 && (
                    <div className="flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700 cursor-pointer">
                        <MessageSquare size={12} className="fill-current opacity-20" />
                        {deal.comment_count} comments
                    </div>
                )}
            </div>

            {/* Footer Buttons */}
            <div className="mt-auto p-4 bg-slate-50/50 border-t border-slate-100 grid grid-cols-2 gap-3 rounded-b-2xl">
                <Link
                    href={`/dashboard/network/deals/${deal.id}`}
                    className="py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 text-sm font-bold hover:bg-white hover:border-slate-300 transition-all text-center flex items-center justify-center"
                >
                    View Details
                </Link>

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onCommit(deal);
                    }}
                    disabled={isClosed}
                    className={`py-2.5 px-4 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-lg ${isClosed
                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                        : isFilled
                            ? 'bg-slate-900 text-white hover:bg-slate-800'
                            : 'bg-[#0F172A] text-white hover:bg-[#1E293B] hover:scale-[1.02] shadow-indigo-500/10'
                        }`}
                >
                    {isFilled ? 'Join Waitlist' : isClosed ? 'Deal Closed' : (
                        <>
                            Commit Capital <ArrowRight size={14} />
                        </>
                    )}
                </button>
            </div>
        </article>
    );
}
