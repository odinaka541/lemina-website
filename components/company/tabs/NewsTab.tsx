'use client';

import { useState } from 'react';
import { ExternalLink, CalendarDays, Filter, Megaphone, TrendingUp, AlertTriangle, Shield, Users, Zap, Globe, Clock, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import VerifiedText from '../VerifiedText';

// Types
type EventType = 'Funding' | 'Regulatory' | 'Team' | 'Product' | 'Competitive' | 'Macro';
type Impact = 'Positive' | 'Neutral' | 'Negative' | 'Watch';

interface NewsItem {
    id: number;
    title: string;
    source: string;
    date: string;
    type: EventType;
    impact: Impact;
    leminaTake: string; // The "What it means" analysis
    summary: string;
    url: string;
    isMaterial?: boolean; // For the pinned banner
}

// Mock Data
const NEWS_ITEMS: NewsItem[] = [
    {
        id: 1,
        title: "Paystack launches Virtual Terminal for manual in-person payments",
        source: "TechCabal",
        date: "2 days ago",
        type: "Product",
        impact: "Positive",
        leminaTake: "Expands TAM to offline/in-store retail merchants who don't have hardware POS.",
        summary: "Paystack has introduced Virtual Terminal, a new feature allowing merchants to accept in-person payments using their phones and a simple web interface, bypassing the need for physical hardware terminals.",
        url: "#",
        isMaterial: true
    },
    {
        id: 2,
        title: "Central Bank of Kenya grants Payment Service Provider license to Paystack",
        source: "Disrupt Africa",
        date: "Nov 12, 2022",
        type: "Regulatory",
        impact: "Positive",
        leminaTake: "Removes largest regulatory risk in East Africa hub; enables full-scale localized operations.",
        summary: "Paystack has secured a Payment Service Provider license from the Central Bank of Kenya, enabling it to process payments for Kenyan businesses directly without third-party intermediaries.",
        url: "#"
    },
    {
        id: 3,
        title: "Flutterwave announces IPO plans, signaling matured exit environment",
        source: "Bloomberg",
        date: "Oct 28, 2023",
        type: "Competitive",
        impact: "Neutral",
        leminaTake: "Validates the sector but increases pressure on talent retention and competitive pricing.",
        summary: "Rival payment processor Flutterwave is moving ahead with plans for an initial public offering, potentially listing on the NASDAQ as early as next year.",
        url: "#"
    },
    {
        id: 4,
        title: "CBN introduces new operational guidelines for Payment Service Solutions",
        source: "CBN Circular",
        date: "Aug 15, 2023",
        type: "Macro",
        impact: "Watch",
        leminaTake: "New capital requirements may squeeeze smaller competitors; Paystack is well-capitalized to comply.",
        summary: "The Central Bank of Nigeria has released new guidelines increasing the minimum capital requirements for PSSPs and switching companies to strengthen the financial stability of the fintech sector.",
        url: "#"
    },
    {
        id: 5,
        title: "Paystack expands direct debit to 3 new banks",
        source: "Company Blog",
        date: "Jul 10, 2023",
        type: "Product",
        impact: "Positive",
        leminaTake: "Improves success rates for recurring billing merchants; reduces churn.",
        summary: "Paystack has added support for direct debit mandates with Zenith, GTBank, and UBA, covering 60% of their merchant customer base.",
        url: "#"
    },
    {
        id: 6,
        title: "Stripe acquires Paystack for $200M+",
        source: "TechCrunch",
        date: "Oct 15, 2020",
        type: "Funding",
        impact: "Positive",
        leminaTake: "The definitive exit for African tech. Unlocks infinite runway and world-class infrastructure.",
        summary: "Stripe has acquired Paystack in a deal reported to be over $200 million, marking the largest acquisition of a Nigerian startup to date.",
        url: "#"
    }
];

// Helper for impact colors
const getImpactColor = (impact: Impact) => {
    switch (impact) {
        case 'Positive': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
        case 'Negative': return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
        case 'Watch': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
        default: return 'text-slate-500 bg-slate-500/10 border-slate-500/20';
    }
};

const getTypeIcon = (type: EventType) => {
    switch (type) {
        case 'Funding': return <DollarIcon size={14} />;
        case 'Regulatory': return <Shield size={14} />;
        case 'Team': return <Users size={14} />;
        case 'Product': return <Zap size={14} />;
        case 'Competitive': return <TrendingUp size={14} />;
        case 'Macro': return <Globe size={14} />;
        default: return <Megaphone size={14} />;
    }
};

// Custom Dollar Icon
const DollarIcon = ({ size }: { size: number }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="2" y2="22" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
);




// ... other imports

export default function NewsTab({ company }: { company?: any }) {
    const [filter, setFilter] = useState<EventType | 'All'>('All');
    const [expandedIds, setExpandedIds] = useState<number[]>([]);

    const toggleExpand = (id: number) => {
        setExpandedIds(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);
    };

    // Use company news or fallback specifically for Paystack mock
    let newsItems = company?.news;
    if (!newsItems || newsItems.length === 0) {
        if (company?.name === 'Paystack') {
            newsItems = NEWS_ITEMS;
        } else {
            newsItems = [];
        }
    }

    const filteredNews = filter === 'All' ? newsItems : newsItems.filter((item: any) => item.type === filter);
    const materialEvent = newsItems.find((item: any) => item.isMaterial);

    return (
        <div className="max-w-4xl mx-auto space-y-6 font-sans text-[var(--color-text-primary)] relative pb-10">
            {/* ... Timeline Summary ... */}
            <div className="bg-gradient-to-r from-blue-50/50 via-indigo-50/50 to-purple-50/50 border border-blue-100 rounded-xl p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3 opacity-30">
                    <TrendingUp size={80} className="text-blue-200" />
                </div>
                <h3 className="text-sm font-bold text-blue-800 mb-2 flex items-center gap-2">
                    <Zap size={16} className="fill-blue-500 text-blue-500" />
                    Lemina Timeline Summary (Last 24 Months)
                </h3>
                <p className="text-sm text-blue-900/80 leading-relaxed max-w-2xl">
                    <VerifiedText data={{
                        value: `${company?.name} continues to strengthen its position in the ${company?.industry?.split('/')[0] || 'Tech'} sector. Key focus areas include market expansion and product iteration.`,
                        isEstimated: true
                    }} />
                </p>
            </div>

            {/* ... rest of the render (materialEvent, filter, list) ... */}
            {/* ... make titles employ VerifiedText if needed ... */}

            {/* --- 2. Latest Material Event (Pinned) --- */}
            {materialEvent && (
                <div className="bg-[var(--card-bg)] border-l-4 border-l-[var(--color-accent-primary)] border-y border-r border-slate-200 rounded-r-xl rounded-l-sm p-4 shadow-sm flex items-start gap-4">
                    <div className="p-2 bg-blue-100 text-blue-600 rounded-lg shrink-0">
                        <Megaphone size={20} />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-bold uppercase tracking-wide text-blue-600">Latest Material Event</span>
                            <span className="text-[10px] text-[var(--color-text-secondary)]">• {materialEvent.date}</span>
                        </div>
                        <h3 className="text-base font-bold text-[var(--color-text-primary)]">
                            <VerifiedText data={{ value: materialEvent.title, isEstimated: materialEvent.isEstimated }} />
                        </h3>
                        <p className="text-sm text-[var(--color-text-secondary)] mt-1">{materialEvent.leminaTake}</p>
                    </div>
                </div>
            )}

            {/* Filter Bar */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar sticky top-0 bg-[var(--color-bg-primary)] z-10 py-2">
                {/* ... filters ... */}
                <Filter size={14} className="text-[var(--color-text-secondary)] shrink-0 ml-1" />
                {['All', 'Funding', 'Regulatory', 'Product', 'Competitive', 'Macro', 'Team'].map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f as any)}
                        className={`
                            px-3 py-1.5 rounded-full text-xs font-medium border transition-colors whitespace-nowrap
                            ${filter === f
                                ? 'bg-[var(--color-text-primary)] text-[var(--color-bg-primary)] border-[var(--color-text-primary)]'
                                : 'bg-[var(--card-bg)] text-[var(--color-text-secondary)] border-[var(--color-border)] hover:border-[var(--color-text-secondary)]'}
                        `}
                    >
                        {f}
                    </button>
                ))}
            </div>

            {/* News Feed */}
            <div className="space-y-4">
                {filteredNews.map((item: any) => {
                    const isExpanded = expandedIds.includes(item.id);
                    return (
                        <div key={item.id} className="bg-[var(--card-bg)] border border-[var(--color-border)] rounded-xl overflow-hidden hover:border-[var(--color-accent-primary)] transition-all group">
                            {/* ... card content ... */}
                            <div
                                className="p-5 cursor-pointer"
                                onClick={() => toggleExpand(item.id)}
                            >
                                <div className="flex justify-between items-start gap-4">
                                    <div className="flex-1">
                                        {/* ... types/source/date ... */}
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-[10px] text-[var(--color-text-secondary)] font-medium flex items-center gap-1.5 bg-[var(--input-bg)] px-2 py-1 rounded">
                                                {getTypeIcon(item.type)} {item.type}
                                            </span>
                                            <span className="text-[10px] text-[var(--color-text-secondary)]">•</span>
                                            <span className="text-[10px] text-[var(--color-text-secondary)]">{item.source}</span>
                                            <span className="text-[10px] text-[var(--color-text-secondary)]">•</span>
                                            <span className="text-[10px] text-[var(--color-text-secondary)]">{item.date}</span>
                                        </div>

                                        <h3 className="text-base font-bold text-[var(--color-text-primary)] leading-snug group-hover:text-[var(--color-accent-primary)] transition-colors">
                                            <VerifiedText data={{ value: item.title, isEstimated: item.isEstimated }} />
                                        </h3>
                                    </div>

                                    <div className={`px-2 py-1 rounded text-[10px] font-bold border flex items-center gap-1 shrink-0 ${getImpactColor(item.impact)}`}>
                                        {item.impact === 'Positive' && <TrendingUp size={10} />}
                                        {item.impact === 'Negative' && <TrendingUp size={10} className="rotate-180" />}
                                        {item.impact === 'Watch' && <AlertTriangle size={10} />}
                                        {item.impact.toUpperCase()}
                                    </div>
                                </div>

                                <div className="mt-3 flex items-center justify-between">
                                    {/* Confidence */}
                                    <div className="flex items-center gap-1.5">
                                        <div className={`w-2 h-2 rounded-full ${item.isEstimated ? 'bg-amber-500' : 'bg-emerald-500'}`}></div>
                                        <span className="text-[10px] text-[var(--color-text-secondary)] font-medium">
                                            Confidence: {item.isEstimated ? 'Estimated' : 'High'}
                                        </span>
                                    </div>
                                    <button className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]">
                                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                    </button>
                                </div>
                            </div>

                            {/* Expanded */}
                            {isExpanded && (
                                <div className="px-5 pb-5 pt-0 border-t border-[var(--color-border)] bg-[var(--input-bg)]/30">
                                    <div className="mt-4 space-y-3">
                                        {/* Lemina Take */}
                                        <div className="flex gap-3 p-3 bg-blue-50/50 border border-blue-100 rounded-lg">
                                            <div className="mt-0.5 text-blue-500 shrink-0">
                                                <Zap size={16} className="fill-blue-500" />
                                            </div>
                                            <div>
                                                <span className="text-xs font-bold text-blue-900 block mb-0.5">Lemina Take</span>
                                                <p className="text-xs text-blue-800/80 leading-relaxed">
                                                    {item.leminaTake}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Full Summary */}
                                        <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                                            <VerifiedText data={{ value: item.summary, isEstimated: item.isEstimated }} />
                                        </p>

                                        {/* Original Link */}
                                        <a href={item.url} className="inline-flex items-center gap-2 text-xs font-medium text-[var(--color-accent-primary)] hover:underline mt-2">
                                            Read original source <ExternalLink size={12} />
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
            {/* ... footer ... */}
            <div className="pt-8 border-t border-[var(--color-border)] mt-10">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
                    {/* ... */}
                    <span className="text-[10px] text-[var(--color-text-secondary)] opactiy-70">Sources ...</span>
                </div>
            </div>
        </div>
    );
}
