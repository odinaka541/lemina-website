import { LucideIcon, ArrowUpRight, ArrowDownRight, Minus, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface StatCardProps {
    icon: LucideIcon;
    label: string;
    value: string;
    subtext?: string;
    trend?: string;
    trendMood?: 'positive' | 'negative' | 'neutral';
    color: 'emerald' | 'blue' | 'purple' | 'amber' | 'indigo' | 'rose' | 'gray';
    actionLink?: string;
    actionLabel?: string;
    variant?: 'default' | 'compact';
}

export default function StatCard({
    icon: Icon,
    label,
    value,
    subtext,
    trend,
    trendMood = 'neutral',
    color,
    actionLink,
    actionLabel = 'View',
    variant = 'default'
}: StatCardProps) {

    // Grayscale logic: If user wants grayscale everywhere essentially, we can force it or just use 'gray' color.
    // However, user said "except orange circles". So some colors might remain.
    // For now, let's support a 'gray' theme and specific colors.

    const colorClasses = {
        emerald: 'bg-emerald-500/10 text-emerald-600',
        blue: 'bg-blue-500/10 text-blue-600',
        purple: 'bg-purple-500/10 text-purple-600',
        amber: 'bg-amber-500/10 text-amber-600',
        indigo: 'bg-indigo-500/10 text-indigo-600',
        rose: 'bg-rose-500/10 text-rose-600',
        gray: 'bg-slate-100/80 text-slate-500',
    };

    const trendColor = trendMood === 'positive' ? 'text-emerald-500' : trendMood === 'negative' ? 'text-rose-500' : 'text-slate-400';
    const TrendIcon = trendMood === 'positive' ? ArrowUpRight : trendMood === 'negative' ? ArrowDownRight : Minus;

    if (variant === 'compact') {
        return (
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group h-full flex flex-col justify-between">
                <div className="flex items-start gap-4">
                    <div className={`p-2.5 rounded-xl ${colorClasses[color]} bg-opacity-50 shrink-0`}>
                        <Icon size={20} />
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-0.5">{label}</p>
                        <h3 className="text-xl font-bold text-slate-900 leading-tight">{value}</h3>
                        {subtext && (
                            <p className="text-[10px] text-slate-400 font-medium leading-snug mt-1 truncate">
                                {subtext}
                            </p>
                        )}
                    </div>
                </div>

                {/* Footer Action area for Compact Card */}
                {actionLink && (
                    <div className="mt-3 pt-3 border-t border-slate-50 flex justify-end">
                        <Link
                            href={actionLink}
                            className="flex items-center text-[10px] font-bold text-slate-500 hover:text-indigo-600 transition-colors uppercase tracking-wide group/link"
                        >
                            {actionLabel}
                            <ArrowRight size={12} className="ml-1 transition-transform group-hover/link:translate-x-1" />
                        </Link>
                    </div>
                )}
            </div>
        )
    }

    // Default Vertical Layout (kept for reference or larger cards if needed)
    return (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between h-full shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="flex items-start justify-between mb-3">
                <div className={`p-2 rounded-xl ${colorClasses[color]} bg-opacity-50`}>
                    <Icon size={20} />
                </div>
                {trend && (
                    <div className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full ${trendMood === 'positive' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-500'}`}>
                        <TrendIcon size={12} />
                        {trend}
                    </div>
                )}
            </div>

            <div className="mb-4">
                <h3 className="text-2xl font-bold text-slate-900 mb-0.5 tracking-tight">{value}</h3>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">{label}</p>
                {subtext && (
                    <p className="text-[11px] text-slate-400 font-medium mt-1 leading-snug">
                        {subtext}
                    </p>
                )}
            </div>

            {actionLink && (
                <div className="mt-auto pt-3 border-t border-slate-50">
                    <Link
                        href={actionLink}
                        className="flex items-center text-xs font-semibold text-slate-600 hover:text-indigo-600 transition-colors group/link"
                    >
                        {actionLabel}
                        <ArrowRight size={12} className="ml-1 transition-transform group-hover/link:translate-x-1" />
                    </Link>
                </div>
            )}
        </div>
    );
}
