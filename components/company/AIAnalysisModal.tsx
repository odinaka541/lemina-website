import { X, AlertTriangle, CheckCircle, TrendingUp, ShieldAlert, Target, Lightbulb, Zap, Download } from 'lucide-react';
import { PortfolioAnalysis } from '@/lib/types';

interface AIAnalysisModalProps {
    isOpen: boolean;
    onClose: () => void;
    analysis: PortfolioAnalysis;
    companyName: string;
}

export default function AIAnalysisModal({ isOpen, onClose, analysis, companyName }: AIAnalysisModalProps) {
    if (!isOpen) return null;

    const sections = [
        {
            title: 'Executive Summary',
            icon: <ActivityIcon className="text-blue-500" />,
            content: (
                <div className="space-y-4">
                    <p className="text-sm text-slate-600 leading-relaxed">{analysis.ai_assessment}</p>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-lg">
                            <h4 className="text-xs font-semibold text-emerald-700 mb-2 flex items-center gap-2">
                                <TrendingUp size={14} /> Strengths
                            </h4>
                            <ul className="space-y-1">
                                {analysis.strengths?.map((item, i) => (
                                    <li key={i} className="text-xs text-emerald-800 flex items-start gap-2">
                                        <span className="mt-1 w-1 h-1 rounded-full bg-emerald-500 shrink-0" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="bg-amber-50 border border-amber-100 p-3 rounded-lg">
                            <h4 className="text-xs font-semibold text-amber-700 mb-2 flex items-center gap-2">
                                <AlertTriangle size={14} /> Risks & Concerns
                            </h4>
                            <ul className="space-y-1">
                                {(analysis.risks || analysis.concerns)?.map((item, i) => (
                                    <li key={i} className="text-xs text-amber-800 flex items-start gap-2">
                                        <span className="mt-1 w-1 h-1 rounded-full bg-amber-500 shrink-0" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )
        },
        {
            title: 'Strategic Opportunities',
            icon: <Lightbulb className="text-amber-500" />,
            content: (
                <div className="bg-white border border-dashed border-amber-200 p-4 rounded-xl">
                    <ul className="space-y-3">
                        {analysis.opportunities?.map((opp, i) => (
                            <li key={i} className="flex gap-3 text-sm text-slate-700">
                                <div className="mt-0.5 bg-amber-100 text-amber-600 p-1 rounded-md shrink-0 h-fit">
                                    <Target size={14} />
                                </div>
                                {opp}
                            </li>
                        )) || <p className="text-xs text-slate-400 italic">No specific opportunities identified.</p>}
                    </ul>
                </div>
            )
        },
        {
            title: 'Strategic Recommendations',
            icon: <Zap className="text-purple-500" />,
            content: (
                <div className="space-y-3">
                    {(analysis.strategic_recommendations || [analysis.recommendation])?.map((rec, i) => (
                        <div key={i} className="flex items-start gap-3 bg-purple-50 border border-purple-100 p-3 rounded-lg">
                            <CheckCircle size={16} className="text-purple-600 mt-0.5 shrink-0" />
                            <span className="text-sm text-purple-900">{rec}</span>
                        </div>
                    ))}
                    <div className="mt-4 pt-4 border-t border-slate-100">
                        <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Recommended Next Action</h5>
                        <div className="flex items-center gap-2 text-slate-800 font-medium text-sm">
                            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                            {analysis.next_action || 'Review Full Report'}
                        </div>
                    </div>
                </div>
            )
        }
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-2xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div>
                        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            AI Investment Analysis
                            <span className="px-2 py-0.5 bg-slate-200 text-slate-600 text-[10px] uppercase tracking-wide rounded-full font-bold">
                                {companyName}
                            </span>
                        </h2>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Based on analysis of {analysis.document_id ? 'latest documents' : 'available data'} • Confidence: {analysis.confidence_score}%
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500">
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    {/* Health Score Banner */}
                    <div className="flex items-center gap-6 p-4 bg-slate-900 text-white rounded-xl shadow-lg relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-white/10 to-transparent rounded-full -translate-y-32 translate-x-16 blur-2xl pointer-events-none" />

                        <div className="relative z-10 flex flex-col items-center justify-center px-4 border-r border-white/10 min-w-[100px]">
                            <span className="text-4xl font-bold tracking-tight">{analysis.health_score}</span>
                            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Health Score</span>
                        </div>

                        <div className="relative z-10 flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide rounded-full border ${analysis.health_status === 'healthy' ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300' :
                                    analysis.health_status === 'at_risk' ? 'bg-rose-500/20 border-rose-500/30 text-rose-300' :
                                        'bg-amber-500/20 border-amber-500/30 text-amber-300'
                                    }`}>
                                    {analysis.health_status?.replace('_', ' ')}
                                </span>
                                {analysis.risk_level && (
                                    <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide rounded-full border ${analysis.risk_level === 'Critical' || analysis.risk_level === 'High' ? 'bg-red-500/20 border-red-500/30 text-red-300' :
                                        analysis.risk_level === 'Low' ? 'bg-blue-500/20 border-blue-500/30 text-blue-300' :
                                            'bg-slate-500/20 border-slate-500/30 text-slate-300'
                                        }`}>
                                        {analysis.risk_level} Risk
                                    </span>
                                )}
                            </div>
                            <p className="text-xs text-slate-300 leading-snug max-w-md">
                                {analysis.ai_assessment?.slice(0, 120)}...
                            </p>
                        </div>
                    </div>

                    {/* Sections */}
                    <div className="space-y-6">
                        {sections.map((section, idx) => (
                            <div key={idx}>
                                <h3 className="flex items-center gap-2 text-sm font-bold text-slate-800 mb-3 uppercase tracking-wide">
                                    {section.icon}
                                    {section.title}
                                </h3>
                                {section.content}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-200 rounded-lg transition-colors">
                        Close
                    </button>
                    <button className="px-4 py-2 text-xs font-medium bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 shadow-sm shadow-emerald-200 transition-all flex items-center gap-2">
                        <Download size={14} />
                        Export PDF
                    </button>
                </div>
            </div>
        </div>
    );
}

function ActivityIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
    );
}
