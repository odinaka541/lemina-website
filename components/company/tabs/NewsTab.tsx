import { Newspaper, ExternalLink, Activity, Sparkles, Clock, ArrowUpRight } from 'lucide-react';

export default function NewsTab({ news }: { news: any[] }) {
    if (!news || news.length === 0) return (
        <div className="flex flex-col items-center justify-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-300">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4 text-slate-400">
                <Newspaper size={32} />
            </div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">No Signal Detected</h3>
            <p className="text-xs text-slate-500 mt-1">We haven't tracked any news coverage for this company yet.</p>
        </div>
    );

    return (
        <div className="max-w-4xl space-y-10 animate-in fade-in duration-500">
            {/* Timeline Summary (Premium Intelligence Card) */}
            <div className="relative overflow-hidden rounded-2xl border border-indigo-100 bg-white shadow-xl shadow-indigo-100/40 group">
                {/* Decorative gradient blur */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50 group-hover:opacity-100 transition-opacity duration-700"></div>

                {/* Dark Premium Header */}
                <div className="px-6 py-4 bg-[#0F172A] flex items-center justify-between relative z-10 border-b border-indigo-900/50">
                    <h3 className="flex items-center gap-2 text-xs font-bold text-indigo-200 uppercase tracking-widest">
                        <Sparkles size={12} className="text-indigo-400" /> Intelligence Briefing
                    </h3>
                    <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-2.5 py-1 rounded-full">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.5)]"></div>
                        <span className="text-[10px] font-bold text-white tracking-wide">LIVE ANALYSIS</span>
                        <span className="text-[10px] text-slate-500 font-medium ml-1 pl-1 border-l border-white/10">24M</span>
                    </div>
                </div>

                {/* Content */}
                <div className="p-8 relative z-10">
                    <div className="flex gap-5">
                        <div className="mt-1 shrink-0">
                            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm">
                                <Activity size={20} />
                            </div>
                        </div>
                        <div>
                            <p className="text-slate-700 leading-8 font-medium text-[15px] max-w-2xl">
                                "Stears continues to strengthen its position in the fintech sector. Key news coverage focuses on their <span className="font-bold text-slate-900 bg-indigo-50 px-1 rounded">pivot to B2B intelligence</span> and successful Series A fundraising. Sentiment remains <span className="text-emerald-700 font-bold">highly positive</span> with clear market confidence."
                            </p>
                            <div className="mt-6 flex items-center gap-4">
                                <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wide">
                                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                                    High Confidence
                                </div>
                                <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wide">
                                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                                    12 Sources
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* News Feed - Vertical Timeline */}
            <div className="relative pl-4 space-y-8">
                {/* Vertical Line */}
                <div className="absolute top-4 bottom-4 left-[23px] w-px bg-gradient-to-b from-slate-200 via-slate-200 to-transparent"></div>

                {news.map((item: any) => (
                    <div key={item.id} className="relative pl-10 group">
                        {/* Timeline Node */}
                        <div className="absolute left-[15px] top-6 w-4 h-4 rounded-full bg-white border-2 border-slate-300 group-hover:border-indigo-500 group-hover:scale-110 transition-all z-10 shadow-sm">
                            <div className="w-1.5 h-1.5 bg-slate-300 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 group-hover:bg-indigo-500 transition-colors"></div>
                        </div>

                        {/* Card */}
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-indigo-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex items-start justify-between gap-6 group/card cursor-pointer">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-3">
                                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide border ${item.sentiment === 'Positive' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                            item.sentiment === 'Negative' ? 'bg-red-50 text-red-700 border-red-100' :
                                                'bg-slate-50 text-slate-600 border-slate-100'
                                        }`}>
                                        {item.sentiment}
                                    </span>
                                    <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                        <Clock size={12} /> {item.published_at}
                                    </span>
                                </div>
                                <h4 className="text-lg font-bold text-slate-900 group-hover/card:text-indigo-700 transition-colors mb-2 leading-snug">
                                    {item.title}
                                </h4>
                                <div className="flex items-center gap-2 mt-3">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">{item.source}</span>
                                    <span className="text-slate-300">•</span>
                                    <span className="text-xs font-bold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded">{item.category}</span>
                                </div>
                            </div>
                            <div className="p-3 bg-slate-50 rounded-xl text-slate-300 group-hover/card:text-indigo-600 group-hover/card:bg-indigo-50 transition-colors">
                                <ArrowUpRight size={20} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
