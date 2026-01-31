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
                <h3 className="text-xl font-bold text-slate-900">Network Intelligence</h3>
                <p className="text-sm text-slate-500">Insights generated from your network's activity.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* 1. Portfolio Health */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col h-full">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                            <Activity size={20} />
                        </div>
                        <h4 className="font-bold text-slate-900">Portfolio Health</h4>
                    </div>

                    <div className="mb-4">
                        <div className="text-sm font-medium text-slate-500 mb-2">{data.portfolio_health.total} companies total</div>
                        <div className="flex h-3 rounded-full overflow-hidden w-full">
                            <div className="bg-emerald-500 h-full" style={{ width: '67%' }} title="Healthy (8)"></div>
                            <div className="bg-amber-400 h-full" style={{ width: '25%' }} title="Monitoring (3)"></div>
                            <div className="bg-red-500 h-full" style={{ width: '8%' }} title="At Risk (1)"></div>
                        </div>
                        <div className="flex justify-between text-[10px] text-slate-400 font-bold mt-1.5 uppercase tracking-wider">
                            <span>Healthy</span>
                            <span>Monitoring</span>
                            <span>Risk</span>
                        </div>
                    </div>

                    {data.portfolio_health.alert && (
                        <div className="mt-auto p-3 bg-red-50 border border-red-100 rounded-xl flex items-start gap-2">
                            <AlertTriangle size={16} className="text-red-500 mt-0.5 shrink-0" />
                            <div>
                                <p className="text-xs font-bold text-red-700">{data.portfolio_health.alert.message}</p>
                                <Link href="#" className="text-[10px] font-bold text-red-600 underline hover:no-underline mt-1 block">
                                    Review Now
                                </Link>
                            </div>
                        </div>
                    )}
                </div>

                {/* 2. Patterns */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col h-full">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                            <Lightbulb size={20} />
                        </div>
                        <h4 className="font-bold text-slate-900">Network Insights</h4>
                    </div>

                    <ul className="space-y-3 flex-1">
                        {data.investment_patterns.map((pattern, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                                <span className={`mt-1 w-1.5 h-1.5 rounded-full shrink-0 ${i === 2 ? 'bg-amber-400' : 'bg-indigo-400'}`}></span>
                                {pattern}
                            </li>
                        ))}
                    </ul>

                    <button className="mt-4 text-xs font-bold text-indigo-600 flex items-center gap-1 hover:gap-2 transition-all">
                        View Full Analytics <ArrowRight size={12} />
                    </button>
                </div>

                {/* 3. Leaderboard */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col h-full bg-gradient-to-b from-white to-slate-50/50">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-yellow-50 text-yellow-600 rounded-lg">
                            <Trophy size={20} />
                        </div>
                        <h4 className="font-bold text-slate-900">Top Performers</h4>
                    </div>

                    <div className="space-y-4 flex-1">
                        {data.leaderboard.map((user, i) => (
                            <div key={user.name} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="font-bold text-lg w-4 text-center text-slate-300">
                                        {i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-slate-900">{user.name}</div>
                                        <div className="text-xs text-slate-500 font-medium">{user.deals}/{user.total_deals} deals</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm font-bold text-slate-700">${(user.deployed / 1000).toFixed(0)}k</div>
                                    <div className="text-[10px] text-emerald-600 font-bold">Deployed</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-200">
                        <div className="flex justify-between items-center text-xs text-slate-400 font-medium">
                            <span>Network Avg</span>
                            <span>${(data.network_avg.deployed / 1000).toFixed(0)}k deployed</span>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}
