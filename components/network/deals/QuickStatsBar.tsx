import { Zap } from 'lucide-react';

interface DealStats {
    total_open: number;
    total_allocation: number;
    total_committed: number;
    commitment_percentage: number;
    unique_members: number;
    avg_days_to_fill: number;
}

export default function QuickStatsBar({ stats }: { stats: DealStats }) {
    if (!stats) return <div className="h-16 bg-slate-50 animate-pulse" />;

    const StatItem = ({ label, value, subtext, color = "text-slate-900" }: any) => (
        <div className="flex flex-col px-6 first:pl-0 border-r border-slate-200 last:border-0">
            <span className={`text-lg font-bold ${color}`}>{value}</span>
            <span className="text-xs font-medium text-slate-500 flex items-center gap-1">{label} {subtext}</span>
        </div>
    );

    return (
        <div className="bg-slate-50 border-y border-slate-200 py-4 px-6 flex flex-wrap gap-y-4 items-center">
            <div className="flex items-center gap-2 mr-6 text-slate-400">
                <Zap size={18} />
            </div>

            <StatItem
                label="Open Deals"
                value={stats.total_open}
            />
            <StatItem
                label="Total Allocation"
                value={`$${(stats.total_allocation / 1000).toFixed(0)}k`}
            />
            <StatItem
                label="Committed"
                value={`$${(stats.total_committed / 1000).toFixed(0)}k`}
                subtext={<span className="text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded ml-1">({stats.commitment_percentage}%)</span>}
            />
            <StatItem
                label="Participated"
                value={`${stats.unique_members} Members`}
            />
            <div className="flex flex-col px-6 border-r border-slate-200 last:border-0 hidden md:flex">
                <span className="text-lg font-bold text-slate-900">{stats.avg_days_to_fill} days</span>
                <span className="text-xs font-medium text-slate-500">Avg time to fill</span>
            </div>
        </div>
    );
}
