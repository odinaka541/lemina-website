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
            <div className="bg-gradient-to-br from-white to-slate-50/80 border border-white/60 rounded-2xl p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(99,102,241,0.1)] transition-all duration-300 relative overflow-hidden group h-full flex flex-col justify-between cursor-default backdrop-blur-md">
                {/* Decorative background element - Enhanced */}
                <div className={`absolute -right-12 -top-12 w-48 h-48 rounded-full ${colorClasses[color]} opacity-10 blur-3xl group-hover:scale-125 transition-transform duration-700 pointer-events-none`}></div>

                <div className="flex items-start gap-5 relative z-10">
                    <div className={`p-3.5 rounded-2xl ${colorClasses[color]} bg-opacity-40 shrink-0 shadow-inner group-hover:scale-110 transition-transform duration-300 ring-1 ring-black/5`}>
                        <Icon size={22} strokeWidth={2} />
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-1.5">{label}</p>
                        <h3 className="text-2xl font-bold text-slate-800 leading-tight font-mono tracking-tight">{value}</h3>
                        {subtext && (
                            <p className="text-[11px] text-slate-500 font-medium leading-relaxed mt-1.5 truncate group-hover:text-slate-700 transition-colors">
                                {subtext}
                            </p>
                        )}
                    </div>
                </div>

                {/* Footer Action area for Compact Card */}
                {actionLink && (
                    <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end relative z-10">
                        <Link
                            href={actionLink}
                            className="flex items-center text-[10px] font-bold text-slate-400 hover:text-indigo-600 transition-all uppercase tracking-widest group/link"
                        >
                            {actionLabel}
                            <ArrowRight size={12} className="ml-1.5 transition-transform group-hover/link:translate-x-1" />
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
