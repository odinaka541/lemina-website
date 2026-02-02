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
        <div className="flex flex-col">
            <div className="flex items-baseline">
                <span className={`text-2xl font-bold tracking-tight ${color}`}>{value}</span>
                {subtext}
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</span>
        </div>
    );

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-1 mb-8">
            <div className="flex flex-wrap items-center justify-between px-6 py-4">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-lg shadow-slate-900/10">
                        <Zap size={18} />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Network</span>
                        <span className="text-sm font-bold text-slate-900">Activity</span>
                    </div>
                </div>

                <div className="h-8 w-px bg-slate-100 hidden md:block"></div>

                <StatItem
                    label="Open Deals"
                    value={stats.total_open}
                />

                <div className="h-8 w-px bg-slate-100 hidden md:block"></div>

                <StatItem
                    label="Total Allocation"
                    value={`$${(stats.total_allocation / 1000).toFixed(0)}k`}
                />

                <div className="h-8 w-px bg-slate-100 hidden md:block"></div>

                <StatItem
                    label="Committed"
                    value={`$${(stats.total_committed / 1000).toFixed(0)}k`}
                    subtext={<span className="text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded ml-2 text-[10px]">({stats.commitment_percentage}%)</span>}
                />

                <div className="h-8 w-px bg-slate-100 hidden md:block"></div>

                <StatItem
                    label="Participated"
                    value={stats.unique_members}
                    subtext={<span className="text-slate-400 font-medium ml-1">Members</span>}
                />

                <div className="h-8 w-px bg-slate-100 hidden md:block"></div>

                <div className="flex flex-col items-end">
                    <span className="text-2xl font-bold text-slate-900 tracking-tight">{stats.avg_days_to_fill} days</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Avg Time to Fill</span>
                </div>
            </div>
        </div>
    );
}
