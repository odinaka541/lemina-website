'use client';

import { useState, useEffect } from 'react';
import { Activity, Lightbulb, Trophy, AlertTriangle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface IntelligenceData {
    portfolio_health: any;
    investment_patterns: string[];
    leaderboard: any[];
    network_avg: any;
}

export default function NetworkIntelligencePanel() {
    const [data, setData] = useState<IntelligenceData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/network/intelligence')
            .then(res => res.json())
            .then(res => {
                setData(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-64 animate-pulse bg-slate-100 rounded-xl" />;

    if (!data) return null;

    return (
        <section>
            <div className="mb-6">
                <h3 className="text-xl font-bold text-slate-900 font-sans tracking-tight">Network Stats</h3>
                <p className="text-sm text-slate-500 font-medium">Insights generated from your network's activity.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* 1. Portfolio Health */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col h-full">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2.5 bg-slate-100 text-slate-500 rounded-xl">
                            <Activity size={20} />
                        </div>
                        <h4 className="font-bold text-slate-900 font-sans">Portfolio Health</h4>
                    </div>

                    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                        <span className="px-3 py-1 rounded-full bg-slate-50 border border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                            Coming Soon
                        </span>
                        <p className="text-xs text-slate-400 font-medium max-w-[180px]">
                            Advanced portfolio health tracking is being calibrated.
                        </p>
                    </div>
                </div>

                {/* 2. Patterns */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col h-full opacity-60">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2.5 bg-slate-100 text-slate-500 rounded-xl">
                            <Lightbulb size={20} />
                        </div>
                        <h4 className="font-bold text-slate-900 font-sans">Network Insights</h4>
                    </div>

                    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                        <span className="px-3 py-1 rounded-full bg-slate-50 border border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                            Coming Soon
                        </span>
                        <p className="text-xs text-slate-400 font-medium max-w-[180px]">
                            AI-driven pattern recognition is under development.
                        </p>
                    </div>
                </div>

                {/* 3. Leaderboard */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col h-full">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2.5 bg-slate-100 text-slate-500 rounded-xl">
                            <Trophy size={20} />
                        </div>
                        <h4 className="font-bold text-slate-900 font-sans">Top Performers</h4>
                    </div>

                    <div className="space-y-4 flex-1">
                        {data.leaderboard.map((user, i) => (
                            <div key={user.name} className="flex items-center justify-between group">
                                <div className="flex items-center gap-4">
                                    <div className="font-bold text-xl w-6 text-center text-slate-300 font-sans group-hover:text-slate-400 transition-colors">
                                        {i + 1}
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-slate-900">{user.name}</div>
                                        <div className="text-xs text-slate-500 font-medium">{user.deals}/{user.total_deals} deals</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm font-bold text-slate-900 font-sans">${(user.deployed / 1000).toFixed(0)}k</div>
                                    <div className="text-[10px] text-emerald-600 font-bold uppercase tracking-wide">Deployed</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-100">
                        <div className="flex justify-between items-center text-xs text-slate-400 font-bold uppercase tracking-wider">
                            <span>Network Avg</span>
                            <span>${(data.network_avg.deployed / 1000).toFixed(0)}k deployed</span>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}
