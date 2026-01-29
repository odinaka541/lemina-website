'use client';

import Link from 'next/link';
import { Briefcase, Building2, TrendingUp, AlertTriangle, Zap } from 'lucide-react';

interface Activity {
    id: string;
    type: string;
    title: string;
    description: string;
    created_at: string;
    metadata?: any;
}

interface ActivityFeedProps {
    activities: Activity[];
    isLoading: boolean;
}

export default function ActivityFeed({ activities, isLoading }: ActivityFeedProps) {
    const limitedActivities = activities.slice(0, 5);

    return (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm h-auto flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                    <ActivityIcon size={16} className="text-slate-400" />
                    Recent Activity
                </h3>
            </div>

            <div className="space-y-4">
                {isLoading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="flex gap-3 animate-pulse">
                                <div className="w-8 h-8 bg-slate-100 rounded-lg"></div>
                                <div className="flex-1 space-y-2">
                                    <div className="h-3 bg-slate-100 rounded w-3/4"></div>
                                    <div className="h-2 bg-slate-50 rounded w-1/2"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : limitedActivities.length > 0 ? (
                    limitedActivities.map((item, i) => (
                        <ActivityItem key={i} item={item} />
                    ))
                ) : (
                    <div className="text-center py-6">
                        <div className="bg-slate-50 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2">
                            <Zap size={16} className="text-slate-300" />
                        </div>
                        <p className="text-xs text-slate-400">No recent activity</p>
                    </div>
                )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-50">
                <Link
                    href="/dashboard/activities"
                    className="block w-full text-center text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors py-1"
                >
                    View All Activity
                </Link>
            </div>
        </div>
    );
}

function ActivityItem({ item }: { item: Activity }) {
    // Icon Mapping - GRAYSCALE FORCED
    const iconMap: any = {
        investment: { icon: TrendingUp, color: 'text-slate-500', bg: 'bg-slate-100' },
        alert: { icon: AlertTriangle, color: 'text-slate-500', bg: 'bg-slate-100' },
        deal: { icon: Briefcase, color: 'text-slate-500', bg: 'bg-slate-100' },
        company_added: { icon: Building2, color: 'text-slate-500', bg: 'bg-slate-100' },
        default: { icon: Zap, color: 'text-slate-500', bg: 'bg-slate-100' }
    };

    const style = iconMap[item.type] || iconMap.default;
    const Icon = style.icon;

    // Formatting Date
    const date = new Date(item.created_at);
    const isToday = new Date().toDateString() === date.toDateString();
    const timeStr = isToday ? 'Today' : date.toLocaleDateString();

    return (
        <div className="flex gap-3 items-start group">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${style.bg} ${style.color}`}>
                <Icon size={14} />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-800 leading-tight mb-0.5 truncate">
                    {item.title}
                </p>
                <p className="text-[11px] text-slate-500 leading-snug line-clamp-2">
                    {item.description}
                </p>
                <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-[10px] text-slate-400 font-medium bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">
                        {timeStr}
                    </span>
                    {item.type === 'deal' && (
                        <span className="text-[10px] text-blue-600 font-medium hover:underline cursor-pointer">
                            View Deal →
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}

function ActivityIcon({ size, className }: any) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
    );
}
