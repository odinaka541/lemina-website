'use client';

import { DollarSign, Briefcase, Users, Activity, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';

// Format currency
const formatCurrency = (val: number) => {
    if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `$${(val / 1000).toFixed(0)}k`;
    return `$${val}`;
};

interface DashboardData {
    capital_deployed: number;
    committed_pending: number;
    active_deals: number;
    total_allocation: number;
    active_deals_committed: number;
    avg_commitment: number;
    participation_rate: number;
    active_members: number;
    total_members: number;
    industry_avg_participation: number;
}

export default function PerformanceDashboard() {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/network/summary')
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

    if (loading) {
        return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 h-32 animate-pulse bg-slate-100 rounded-xl" />;
    }

    if (!data) return null;

    const cards = [
        {
            label: 'Capital Deployed',
            value: formatCurrency(data.capital_deployed),
            subtext: [
                `+ ${formatCurrency(data.committed_pending)} Committed (Pending)`,
                `= ${formatCurrency(data.capital_deployed + data.committed_pending)} Total Exposure`
            ],
            icon: DollarSign,
            color: 'text-emerald-600',
            bg: 'bg-emerald-50 border-emerald-100'
        },
        {
            label: 'Active Deals',
            value: data.active_deals.toString(),
            subtext: [
                `${formatCurrency(data.active_deals_committed)} Committed (90%)`,
                `Avg 8 days to fill`
            ],
            icon: Briefcase,
            color: 'text-blue-600',
            bg: 'bg-blue-50 border-blue-100'
        },
        {
            label: 'Avg Commitment',
            value: formatCurrency(data.avg_commitment),
            subtext: [
                'Range: $5k - $75k',
                'Median: $20k'
            ],
            icon: Users, // Using Users for "Avg Commitment per Member" concept
            color: 'text-purple-600',
            bg: 'bg-purple-50 border-purple-100'
        },
        {
            label: 'Participation Rate',
            value: `${data.participation_rate}%`,
            subtext: [
                `${data.active_members} of ${data.total_members} members active`,
                `Industry avg: ${data.industry_avg_participation}%`
            ],
            icon: Activity,
            color: data.participation_rate > 40 ? 'text-emerald-600' : 'text-amber-600',
            bg: data.participation_rate > 40 ? 'bg-emerald-50 border-emerald-100' : 'bg-amber-50 border-amber-100'
        }
    ];

    return (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {cards.map((card, i) => (
                <div key={i} className={`p-5 rounded-2xl border ${card.bg} relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300`}>
                    <div className="flex justify-between items-start mb-3">
                        <div className={`p-3 rounded-xl bg-white shadow-sm ${card.color}`}>
                            <card.icon size={22} />
                        </div>
                        {/* Decorative Background Icon */}
                        <card.icon
                            size={100}
                            className={`absolute -right-6 -bottom-6 opacity-5 rotate-12 ${card.color}`}
                        />
                    </div>

                    <div>
                        <p className="text-sm font-semibold text-slate-500 mb-1">{card.label}</p>
                        <h3 className="text-3xl font-bold text-slate-900 tracking-tight mb-3">{card.value}</h3>

                        <div className="space-y-1">
                            {card.subtext.map((line, idx) => (
                                <p key={idx} className="text-xs font-medium text-slate-600 flex items-center gap-1.5">
                                    <span className="w-1 h-1 rounded-full bg-slate-400"></span>
                                    {line}
                                </p>
                            ))}
                        </div>
                    </div>
                </div>
            ))}
        </section>
    );
}
