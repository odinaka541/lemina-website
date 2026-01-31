'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Clock, Users, ShieldCheck, Zap } from 'lucide-react';
import QuickCommitModal from './QuickCommitModal';

interface Deal {
    id: string;
    company_name: string;
    logo_url: string;
    stage_badge: string;
    verification_tier: number;
    total_allocation: number;
    amount_committed: number;
    days_left: number;
    member_count: number;
    min_ticket: number;
    max_ticket: number;
}

export default function ActiveDealsPreview() {
    const [deals, setDeals] = useState<Deal[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);

    useEffect(() => {
        fetch('/api/network/active-deals')
            .then(res => res.json())
            .then(res => {
                setDeals(res.data || []);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="h-64 bg-slate-100 rounded-xl animate-pulse" />;

    if (deals.length === 0) return null;

    return (
        <section>
            <div className="flex justify-between items-end mb-6">
                <div>
                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                        Active Deals
                        <span className="bg-emerald-100 text-emerald-700 text-xs px-2 py-0.5 rounded-full">
                            {deals.length} Live
                        </span>
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">Priority allocations closing soon.</p>
                </div>
                <Link
                    href="/dashboard/syndicate/deals"
                    className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                >
                    View All Deals <ArrowRight size={16} />
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {deals.map(deal => (
                    <div key={deal.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
                        {/* Header */}
                        <div className="p-5 border-b border-slate-100">
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center text-white font-bold text-xl">
                                    {deal.company_name.charAt(0)}
                                </div>
                                <div className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${deal.stage_badge === 'CLOSING SOON' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'
                                    }`}>
                                    {deal.stage_badge}
                                </div>
                            </div>

                            <h3 className="text-lg font-bold text-slate-900 mb-1 flex items-center gap-2">
                                {deal.company_name}
                                {deal.verification_tier >= 3 && (
                                    <ShieldCheck size={16} className="text-emerald-500" />
                                )}
                            </h3>

                            <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                                <span className={`flex items-center gap-1 ${deal.days_left < 7 ? 'text-amber-600' : ''}`}>
                                    <Clock size={12} /> {deal.days_left} days left
                                </span>
                                <span className="flex items-center gap-1">
                                    <Users size={12} /> {deal.member_count} committed
                                </span>
                            </div>
                        </div>

                        {/* Progress */}
                        <div className="p-5 bg-slate-50/50">
                            <div className="flex justify-between text-xs font-semibold mb-2">
                                <span className="text-slate-700">${deal.amount_committed.toLocaleString()} Committed</span>
                                <span className="text-slate-400">Target: ${deal.total_allocation.toLocaleString()}</span>
                            </div>
                            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden mb-2">
                                <div
                                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-500"
                                    style={{ width: `${(deal.amount_committed / deal.total_allocation) * 100}%` }}
                                ></div>
                            </div>
                            <p className="text-xs text-center text-slate-400 font-medium">
                                ${(deal.total_allocation - deal.amount_committed).toLocaleString()} remaining
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="p-4 grid grid-cols-2 gap-3">
                            <Link
                                href={`/dashboard/syndicate/deals/${deal.id}`}
                                className="py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-colors text-center"
                            >
                                Details
                            </Link>
                            <button
                                onClick={() => setSelectedDeal(deal)}
                                className="py-2.5 px-4 rounded-xl bg-[#0F172A] text-white text-sm font-semibold hover:bg-[#1E293B] transition-colors flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/10"
                            >
                                <Zap size={14} className="fill-current" />
                                Quick Commit
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <QuickCommitModal
                isOpen={!!selectedDeal}
                onClose={() => setSelectedDeal(null)}
                deal={selectedDeal}
            />
        </section>
    );
}
