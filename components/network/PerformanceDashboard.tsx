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
                `Total Exposure: ${formatCurrency(data.capital_deployed + data.committed_pending)}`
            ],
            icon: DollarSign,
        },
        {
            label: 'Active Deals',
            value: data.active_deals.toString(),
            subtext: [
                `${formatCurrency(data.active_deals_committed)} Committed (90%)`,
                `Avg 8 days to fill`
            ],
            icon: Briefcase,
        },
        {
            label: 'Avg Commitment',
            value: formatCurrency(data.avg_commitment),
            subtext: [
                'Range: $5k - $75k',
                'Median: $20k'
            ],
            icon: Users,
        },
        {
            label: 'Participation Rate',
            value: `${data.participation_rate}%`,
            subtext: [
                `${data.active_members} of ${data.total_members} members active`,
                `Industry avg: ${data.industry_avg_participation}%`
            ],
            icon: Activity,
        }
    ];

    return (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {cards.map((card, i) => (
                <div key={i} className="group relative bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-[0_8px_30px_-4px_rgba(16,24,40,0.08)] transition-all duration-300">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 shadow-sm group-hover:bg-slate-200 transition-colors duration-300">
                            <card.icon size={22} />
                        </div>
                        {/* Decorative Background Icon */}
                        <card.icon
                            size={120}
                            className="absolute -right-6 -bottom-6 opacity-[0.05] rotate-12 group-hover:rotate-0 transition-transform duration-500 text-slate-900 pointer-events-none"
                        />
                    </div>

                    <div className="relative z-10">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{card.label}</p>
                        <h3 className="text-3xl font-bold text-slate-900 tracking-tight font-sans mb-4">{card.value}</h3>

                        <div className="space-y-1.5 pt-4 border-t border-slate-50">
                            {card.subtext.map((line, idx) => (
                                <p key={idx} className="text-xs font-medium text-slate-500 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
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
