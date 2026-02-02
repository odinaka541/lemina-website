'use client';

import { useState, useEffect } from 'react';
import { DollarSign, Flag, Share2, Eye, Zap, ArrowRight, Activity } from 'lucide-react';
import Link from 'next/link';

interface FeedItem {
    id: string;
    type: 'financial' | 'milestone' | 'ai_alert' | 'deal_share' | 'member_action';
    actor_name: string;
    actor_avatar: string;
    action: string;
    subtitle?: string;
    timestamp: string;
    metadata: { link: string };
}

export default function NetworkActivityFeed() {
    const [activities, setActivities] = useState<FeedItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/network/activity')
            .then(res => res.json())
            .then(res => {
                setActivities(res.data || []);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const getIcon = (type: string) => {
        // All icons updated to neutral gray/slate style
        const baseClass = "w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center shrink-0 border border-slate-50 shadow-sm";

        switch (type) {
            case 'financial': return <div className={baseClass}><DollarSign size={14} /></div>;
            case 'milestone': return <div className={baseClass}><Flag size={14} /></div>;
            case 'ai_alert': return <div className={baseClass}><Zap size={14} /></div>;
            case 'deal_share': return <div className={baseClass}><Share2 size={14} /></div>;
            default: return <div className={baseClass}><Eye size={14} /></div>;
        }
    };

    if (loading) return <div className="h-64 bg-slate-100 rounded-xl animate-pulse" />;

    return (
        <section className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden h-fit">
            <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-white">
                <h3 className="font-bold text-slate-900 flex items-center gap-2.5 font-sans tracking-tight">
                    <Activity size={18} className="text-slate-400" />
                    Network Activity
                </h3>
                <Link href="#" className="text-xs font-bold text-indigo-600 hover:text-indigo-700 uppercase tracking-wide transition-colors">
                    View Full History
                </Link>
            </div>

            <div className="divide-y divide-slate-50">
                {activities.map((item, i) => (
                    <div key={item.id} className="flex gap-4 p-5 hover:bg-slate-50/50 transition-colors group">
                        {/* Avatar / Icon */}
                        <div className="relative pt-1">
                            {getIcon(item.type)}
                            {/* Connector line if needed, though usually cleaner without for sparse feeds */}
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start mb-1">
                                <p className="text-sm text-slate-900 leading-snug">
                                    <span className="font-bold font-sans">{item.actor_name}</span> <span className="text-slate-500 font-medium">{item.action}</span>
                                </p>
                                <span className="text-[10px] font-bold text-slate-400 whitespace-nowrap ml-3 uppercase tracking-wider">{item.timestamp}</span>
                            </div>

                            {item.subtitle && (
                                <p className="text-xs text-slate-500 font-medium leading-relaxed">{item.subtitle}</p>
                            )}

                            {item.metadata?.link && (
                                <Link
                                    href={item.metadata.link}
                                    className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-600 hover:text-indigo-700 mt-2.5 uppercase tracking-wide opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    View Details <ArrowRight size={10} />
                                </Link>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <div className="p-4 bg-slate-50/30 text-center border-t border-slate-50">
                <button className="text-xs font-bold text-slate-400 hover:text-slate-700 transition-colors uppercase tracking-widest">
                    Load More Activity
                </button>
            </div>
        </section>
    );
}
