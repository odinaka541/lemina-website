import { ChevronDown, Sparkles, CheckCircle, AlertTriangle, ArrowUpRight } from 'lucide-react';
import { useState } from 'react';

interface AIAnalysisPanelProps {
    analysis: any;
}

export default function AIAnalysisPanel({ analysis }: AIAnalysisPanelProps) {
    const [isExpanded, setIsExpanded] = useState(true);

    return (
        <div className="bg-white rounded-2xl border border-indigo-100 shadow-xl shadow-indigo-900/5 overflow-hidden sticky top-24">
            {/* Header */}
            <div
                className="bg-gradient-to-r from-indigo-50 to-white px-6 py-4 flex items-center justify-between cursor-pointer border-b border-indigo-50"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center gap-2 text-indigo-900">
                    <Sparkles size={18} className="fill-indigo-200 text-indigo-600" />
                    <span className="font-bold">AI Analysis</span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 px-2 py-0.5 bg-white rounded-md border border-indigo-100 shadow-sm">
                        <div className={`w-2 h-2 rounded-full ${analysis.health_score > 80 ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                        <span className="text-sm font-bold text-slate-900">{analysis.health_score}/100</span>
                    </div>
                    <ChevronDown size={16} className={`text-indigo-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                </div>
            </div>

            {isExpanded && (
                <div className="p-6 space-y-6">
                    {/* Summary */}
                    <div>
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">Key Insights</h4>
                        <div className="space-y-2">
                            {analysis.summary.insights.map((item: any, i: number) => (
                                <div key={i} className="flex items-start gap-2.5">
                                    <CheckCircle size={14} className="text-emerald-500 mt-0.5 shrink-0" />
                                    <span className="text-sm font-medium text-slate-700">{item.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">Watch Items</h4>
                        <div className="space-y-2">
                            {analysis.summary.watch_items.map((item: any, i: number) => (
                                <div key={i} className="flex items-start gap-2.5">
                                    <AlertTriangle size={14} className="text-amber-500 mt-0.5 shrink-0" />
                                    <span className="text-sm font-medium text-slate-700">{item.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-indigo-50/50 rounded-xl p-4 border border-indigo-100">
                        <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-wide mb-1">AI Recommendation</h4>
                        <p className="text-sm font-bold text-indigo-700">{analysis.summary.recommendation}</p>
                    </div>

                    {/* Compact Metrics Table */}
                    <div>
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">Extracted Metrics</h4>
                        <div className="border border-slate-100 rounded-xl overflow-hidden text-sm">
                            {analysis.full_analysis.metrics.slice(0, 3).map((m: any, i: number) => (
                                <div key={i} className="flex justify-between p-3 border-b border-slate-100 last:border-0 bg-slate-50/30">
                                    <span className="text-slate-500 font-medium">{m.name}</span>
                                    <div className="text-right">
                                        <div className="font-bold text-slate-900">{m.value}</div>
                                        <div className="text-[10px] text-emerald-600 font-bold">{m.change}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button className="w-full py-2.5 border border-indigo-100 text-indigo-600 rounded-xl text-sm font-bold hover:bg-indigo-50 transition-colors flex items-center justify-center gap-1">
                        View Full Report <ArrowUpRight size={14} />
                    </button>

                    <div className="text-center">
                        <span className="text-[10px] text-slate-400">Confidence: {analysis.confidence}% • Updated {analysis.last_updated}</span>
                    </div>
                </div>
            )}
        </div>
    );
}
