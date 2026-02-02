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
        // Use the main deals endpoint filtered by status for consistency
        fetch('/api/network/deals?status=open&limit=3')
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
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-3 font-sans tracking-tight">
                        Active Deals
                        <span className="bg-emerald-100 text-emerald-700 text-xs px-2.5 py-1 rounded-full font-bold shadow-sm shadow-emerald-100">
                            {deals.length} Live
                        </span>
                    </h2>
                    <p className="text-sm font-medium text-slate-500 mt-1">Priority allocations closing soon.</p>
                </div>
                <Link
                    href="/dashboard/syndicate/deals"
                    className="group text-sm font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 transition-colors"
                >
                    View All Deals <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {deals.map(deal => (
                    <div key={deal.id} className="group bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-[0_8px_30px_-4px_rgba(16,24,40,0.08)] transition-all duration-300 overflow-hidden flex flex-col h-full hover:border-indigo-100">
                        {/* Header */}
                        <div className="p-6 border-b border-slate-50 flex-1">
                            <div className="flex justify-between items-start mb-5">
                                <div className="w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-slate-900/20 group-hover:scale-105 transition-transform duration-300">
                                    {deal.company_name.slice(0, 2).toUpperCase()}
                                </div>
                                <div className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest border ${deal.stage_badge === 'CLOSING SOON' ? 'bg-amber-50 border-amber-100 text-amber-700' : 'bg-emerald-50 border-emerald-100 text-emerald-700'
                                    }`}>
                                    {deal.stage_badge}
                                </div>
                            </div>

                            <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2 tracking-tight">
                                {deal.company_name}
                                {deal.verification_tier >= 3 && (
                                    <ShieldCheck size={16} className="text-emerald-500" />
                                )}
                            </h3>

                            <div className="flex items-center gap-4 text-xs font-semibold text-slate-500">
                                <span className={`flex items-center gap-1.5 ${deal.days_left < 7 ? 'text-amber-600' : ''}`}>
                                    <Clock size={14} /> {deal.days_left} days left
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <Users size={14} /> {deal.member_count} committed
                                </span>
                            </div>
                        </div>

                        {/* Progress */}
                        <div className="px-6 py-5 bg-slate-50/40">
                            <div className="flex justify-between text-xs font-bold mb-2.5">
                                <span className="text-slate-700">${deal.amount_committed.toLocaleString()} Committed</span>
                                <span className="text-slate-400">Target: ${deal.total_allocation.toLocaleString()}</span>
                            </div>
                            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden mb-2.5 border border-slate-100">
                                <div
                                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.4)]"
                                    style={{ width: `${(deal.amount_committed / deal.total_allocation) * 100}%` }}
                                ></div>
                            </div>
                            <p className="text-xs text-center text-slate-500 font-medium">
                                <span className="text-slate-900 font-bold">${(deal.total_allocation - deal.amount_committed).toLocaleString()}</span> remaining allocation
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="p-4 grid grid-cols-2 gap-3 border-t border-slate-50 bg-white">
                            <Link
                                href={`/dashboard/network/deals/${deal.id}`}
                                className="py-2.5 px-4 rounded-xl border border-slate-200 text-slate-600 text-sm font-bold hover:bg-slate-50 hover:text-slate-900 transition-colors text-center"
                            >
                                Details
                            </Link>
                            <button
                                onClick={() => setSelectedDeal(deal)}
                                className="py-2.5 px-4 rounded-xl bg-slate-900 text-white text-sm font-bold hover:bg-slate-800 transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-slate-900/10"
                            >
                                <Zap size={14} className="fill-current text-slate-400" />
                                Commit
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
