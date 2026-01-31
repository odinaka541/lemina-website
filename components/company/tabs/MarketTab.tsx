import { TrendingUp, Users, AlertCircle, Wind, Anchor } from 'lucide-react';

export default function MarketTab({ market }: { market: any }) {
    if (!market) return (
        <div className="flex flex-col items-center justify-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-300">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">No Market Data</h3>
            <p className="text-xs text-slate-500 mt-1">Market analysis is currently unavailable.</p>
        </div>
    );

    return (
        <div className="space-y-10 max-w-5xl animate-in fade-in duration-500">
            {/* Top Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group cursor-default">
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 group-hover:text-indigo-500 transition-colors">Total Addressable Market</span>
                    <div className="text-3xl font-bold text-slate-900 font-mono tracking-tight">${(market.tam / 1000000000).toFixed(1)}B</div>
                    <span className="text-xs font-medium text-slate-500 mt-2 block group-hover:text-slate-700 transition-colors">Global TAM (2025)</span>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group cursor-default">
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 group-hover:text-emerald-500 transition-colors">Sector Growth</span>
                    <div className="text-3xl font-bold text-emerald-600 font-mono tracking-tight flex items-center gap-3">
                        <TrendingUp size={24} className="stroke-[3]" /> {market.growth_rate}%
                    </div>
                    <span className="text-xs font-medium text-slate-500 mt-2 block group-hover:text-slate-700 transition-colors">CAGR (5-Year)</span>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group cursor-default">
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 group-hover:text-indigo-500 transition-colors">Competition Intensity</span>
                    <div className="text-3xl font-bold text-slate-900 font-mono tracking-tight flex items-center gap-3">
                        <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-base text-slate-600 font-bold border border-slate-200">High</span>
                        <span className="text-lg text-slate-400 font-sans font-medium">({market.competitor_count})</span>
                    </div>
                    <span className="text-xs font-medium text-slate-500 mt-2 block group-hover:text-slate-700 transition-colors">Direct Competitors</span>
                </div>
            </div>

            {/* Analysis Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                            <Wind size={16} className="text-emerald-500" /> Tailwinds
                        </h3>
                        <div className="h-px bg-slate-100 flex-1 ml-4"></div>
                    </div>
                    <ul className="space-y-3">
                        {market.tailwinds.map((item: string, i: number) => (
                            <li key={i} className="flex items-start gap-3 bg-gradient-to-br from-emerald-50/50 to-white p-4 rounded-xl border border-emerald-100/60 shadow-sm hover:shadow-md transition-all">
                                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 shadow-sm shadow-emerald-300"></span>
                                <span className="text-sm font-medium text-slate-700 leading-relaxed">{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                            <Anchor size={16} className="text-amber-500" /> Headwinds
                        </h3>
                        <div className="h-px bg-slate-100 flex-1 ml-4"></div>
                    </div>
                    <ul className="space-y-3">
                        {market.headwinds.map((item: string, i: number) => (
                            <li key={i} className="flex items-start gap-3 bg-gradient-to-br from-amber-50/50 to-white p-4 rounded-xl border border-amber-100/60 shadow-sm hover:shadow-md transition-all">
                                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 shadow-sm shadow-amber-300"></span>
                                <span className="text-sm font-medium text-slate-700 leading-relaxed">{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Competitors Table */}
            <section>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Competitive Landscape</h3>
                    <div className="h-px bg-slate-100 flex-1 ml-4"></div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-lg shadow-slate-200/40">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50/80 border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Company</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Stage</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Last Round</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {market.competitors.map((comp: any, i: number) => (
                                <tr key={i} className="hover:bg-indigo-50/30 transition-colors group">
                                    <td className="px-6 py-4 font-bold text-sm text-slate-900 group-hover:text-indigo-700 transition-colors">{comp.name}</td>
                                    <td className="px-6 py-4 text-sm font-medium text-slate-600">{comp.stage}</td>
                                    <td className="px-6 py-4 text-sm font-medium text-slate-500 font-mono tracking-tight">{comp.last_round}</td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold bg-slate-100 text-slate-600 uppercase tracking-wide group-hover:bg-white group-hover:shadow-sm transition-all border border-transparent group-hover:border-slate-200">
                                            {comp.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}
