'use client';

import { Target, Clock, DollarSign, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import ConfidenceBadge, { ConfidenceTier } from '@/components/company/ConfidenceBadge';

// Mock Data
const ACTIVE_DEALS = [
    {
        id: 1,
        company: 'Paystack',
        logo: 'https://api.dicebear.com/7.x/initials/svg?seed=Paystack',
        description: 'Modern payments for Africa.',
        allocation: '$200,000',
        committed: '$150,000',
        minTicket: '$5,000',
        closingDate: '5 days left',
        tier: ConfidenceTier.CACVerified,
        score: 98,
        // New Fields
        committedCount: 5,
        remainingAmount: '$50,000',
        terms: {
            valuation: '$20M pre',
            type: 'SAFE',
            lead: 'Stripe',
            ownership: '~1%'
        },
        ddStatus: 'complete' // complete, in-progress, not-started
    },
    {
        id: 2,
        company: 'Flutterwave',
        logo: 'https://api.dicebear.com/7.x/initials/svg?seed=Flutterwave',
        description: 'Payments infrastructure for the internet.',
        allocation: '$500,000',
        committed: '$120,000',
        minTicket: '$10,000',
        closingDate: '12 days left',
        tier: ConfidenceTier.DirectVerified,
        score: 92,
        // New Fields
        committedCount: 12,
        remainingAmount: '$380,000',
        terms: {
            valuation: '$150M post',
            type: 'Priced Round',
            lead: 'Greycroft',
            ownership: '0.4%'
        },
        ddStatus: 'in-progress'
    }
];

export default function NetworkDealsPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Network Deal Flow</h1>
                <p className="text-slate-500">Review and commit to deals shared with your network.</p>
            </div>

            {ACTIVE_DEALS.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white border border-slate-200 rounded-2xl shadow-sm text-center">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                        <Target size={32} className="text-slate-400" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">No Shared Deals Yet</h3>
                    <p className="text-slate-500 max-w-md mb-8">
                        Network deals will appear here when an admin shares investment opportunities.
                    </p>
                    <div className="flex gap-4">
                        <Link href="/dashboard" className="px-5 py-2.5 bg-slate-900 text-white font-medium rounded-xl hover:bg-slate-800 transition-colors">
                            Browse Companies
                        </Link>
                        <button className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition-colors">
                            Contact Admin
                        </button>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {ACTIVE_DEALS.map((deal) => {
                        const progress = (parseInt(deal.committed.replace(/\D/g, '')) / parseInt(deal.allocation.replace(/\D/g, ''))) * 100;

                        return (
                            <div key={deal.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-white border border-slate-100 p-1 flex items-center justify-center shadow-sm">
                                            <img src={deal.logo} alt={deal.company} className="w-full h-full object-contain" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-slate-900">{deal.company}</h3>
                                            <div className="flex items-center gap-2 mt-1">
                                                <ConfidenceBadge tier={deal.tier} score={deal.score} showLabel={false} className="scale-90 origin-left" />
                                                {/* DD Status Badge */}
                                                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${deal.ddStatus === 'complete' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                        deal.ddStatus === 'in-progress' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                                            'bg-slate-50 text-slate-500 border-slate-100'
                                                    }`}>
                                                    {deal.ddStatus === 'complete' ? 'DD Complete' :
                                                        deal.ddStatus === 'in-progress' ? 'DD In Progress' : 'DD Pending'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-600 text-xs font-medium flex items-center gap-1 border border-amber-100">
                                        <Clock size={12} /> {deal.closingDate}
                                    </span>
                                </div>

                                <p className="text-slate-500 mb-6 flex-1 text-sm leading-relaxed">
                                    {deal.description}
                                </p>

                                {/* Deal Terms */}
                                <div className="bg-slate-50/50 rounded-xl p-4 mb-6 border border-slate-100">
                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Deal Terms</h4>
                                    <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">Valuation</span>
                                            <span className="text-slate-900 font-medium">{deal.terms.valuation}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">Type</span>
                                            <span className="text-slate-900 font-medium">{deal.terms.type}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">Lead</span>
                                            <span className="text-slate-900 font-medium">{deal.terms.lead}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">Ownership</span>
                                            <span className="text-slate-900 font-medium">{deal.terms.ownership}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4 mb-6">
                                    <div>
                                        <div className="flex justify-between text-xs mb-1">
                                            <span className="text-slate-900 font-bold">Committed: {deal.committed}</span>
                                            <span className="text-slate-500">{Math.round(progress)}% of {deal.allocation}</span>
                                        </div>
                                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-2">
                                            <div
                                                className="h-full bg-emerald-500 rounded-full transition-all duration-500" // Changed to emerald for positive progress
                                                style={{ width: `${progress}%` }}
                                            />
                                        </div>
                                        <div className="flex justify-between items-center text-xs">
                                            <span className="text-indigo-600 font-medium cursor-pointer hover:underline">
                                                {deal.committedCount} members committed
                                            </span>
                                            <span className="text-slate-500">
                                                {deal.remainingAmount} remaining
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex justify-between text-sm py-2 border-t border-slate-100 mt-2">
                                        <span className="text-slate-500">Min Ticket</span>
                                        <span className="text-slate-900 font-mono font-medium">{deal.minTicket}</span>
                                    </div>
                                </div>

                                {/* Discussion Placeholder */}
                                <div className="mb-6">
                                    <button className="flex items-center gap-2 text-xs text-slate-500 hover:text-indigo-600 transition-colors w-full group">
                                        <div className="flex -space-x-1.5">
                                            {[1, 2, 3].map(i => (
                                                <div key={i} className="w-5 h-5 rounded-full bg-slate-200 border border-white ring-1 ring-white" />
                                            ))}
                                        </div>
                                        <span className="group-hover:underline">3 comments from network</span>
                                    </button>
                                </div>

                                <div className="flex gap-3 mt-auto">
                                    <Link href={`/dashboard/deals/${deal.id}`} className="flex-1 px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 text-sm font-semibold rounded-xl transition-all shadow-sm text-center">
                                        View Details
                                    </Link>
                                    <button className="flex-[1.5] px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2">
                                        Commit Capital
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
