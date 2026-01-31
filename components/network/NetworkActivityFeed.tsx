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
        switch (type) {
            case 'financial': return <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 border-2 border-white shadow-sm"><DollarSign size={14} /></div>;
            case 'milestone': return <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 border-2 border-white shadow-sm"><Flag size={14} /></div>;
            case 'ai_alert': return <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center shrink-0 border-2 border-white shadow-sm"><Zap size={14} /></div>;
            case 'deal_share': return <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center shrink-0 border-2 border-white shadow-sm"><Share2 size={14} /></div>;
            default: return <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center shrink-0 border-2 border-white shadow-sm"><Eye size={14} /></div>;
        }
    };

    if (loading) return <div className="h-64 bg-slate-100 rounded-xl animate-pulse" />;

    return (
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden h-fit">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center">
                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                    <Activity size={18} className="text-slate-400" />
                    Network Activity
                </h3>
                <Link href="#" className="text-xs font-bold text-indigo-600 hover:text-indigo-700">
                    View Full History
                </Link>
            </div>

            <div className="p-0">
                {activities.map((item, i) => (
                    <div key={item.id} className={`flex gap-3 p-4 hover:bg-slate-50 transition-colors ${i !== activities.length - 1 ? 'border-b border-slate-100' : ''}`}>
                        {/* Avatar / Icon */}
                        <div className="relative">
                            {/* Using Icon primarily as per modern feeds, or verify if avatar exists */}
                            {getIcon(item.type)}
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                                <p className="text-sm text-slate-900 leading-snug">
                                    <span className="font-bold">{item.actor_name}</span> <span className="text-slate-600">{item.action}</span>
                                </p>
                                <span className="text-[10px] font-bold text-slate-400 whitespace-nowrap ml-2">{item.timestamp}</span>
                            </div>

                            {item.subtitle && (
                                <p className="text-xs text-slate-500 font-medium mt-0.5">{item.subtitle}</p>
                            )}

                            {item.metadata?.link && (
                                <Link
                                    href={item.metadata.link}
                                    className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-600 hover:text-indigo-700 mt-2 uppercase tracking-wide"
                                >
                                    View Details <ArrowRight size={10} />
                                </Link>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <div className="p-3 bg-slate-50 text-center border-t border-slate-100">
                <button className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors">
                    Load More Activity
                </button>
            </div>
        </section>
    );
}
