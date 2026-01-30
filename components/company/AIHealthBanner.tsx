import { Activity, ArrowRight, AlertTriangle, ShieldCheck } from 'lucide-react';
import { PortfolioAnalysis } from '@/lib/types';

interface AIHealthBannerProps {
    analysis: PortfolioAnalysis;
    onClick: () => void;
}

export default function AIHealthBanner({ analysis, onClick }: AIHealthBannerProps) {
    const isHealthy = analysis.health_status === 'healthy';
    const isCritical = analysis.health_status === 'at_risk' || analysis.risk_level === 'High' || analysis.risk_level === 'Critical';

    return (
        <div
            onClick={onClick}
            className="w-full bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer group relative overflow-hidden"
        >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-slate-50 to-transparent rounded-bl-full -mr-8 -mt-8 pointer-events-none" />

            <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-4">
                    {/* Score Circle */}
                    <div className={`
                        flex flex-col items-center justify-center w-14 h-14 rounded-full border-4
                        ${isHealthy ? 'border-emerald-100 bg-emerald-50 text-emerald-600' :
                            isCritical ? 'border-rose-100 bg-rose-50 text-rose-600' :
                                'border-amber-100 bg-amber-50 text-amber-600'}
                    `}>
                        <span className="text-lg font-bold leading-none">{analysis.health_score}</span>
                        <span className="text-[9px] font-bold uppercase">Score</span>
                    </div>

                    {/* Text Info */}
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                                AI Portfolio Intelligence
                                {isHealthy ? <ShieldCheck size={14} className="text-emerald-500" /> : <AlertTriangle size={14} className="text-amber-500" />}
                            </h3>
                            <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${isHealthy ? 'border-emerald-200 text-emerald-600 bg-emerald-50' :
                                    isCritical ? 'border-rose-200 text-rose-600 bg-rose-50' :
                                        'border-amber-200 text-amber-600 bg-amber-50'
                                }`}>
                                {analysis.risk_level} Risk
                            </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-500 group-hover:text-indigo-600 transition-colors">
                            <span className="font-semibold text-slate-700">Next Action:</span>
                            {analysis.next_action}
                        </div>
                    </div>
                </div>

                {/* Arrow */}
                <div className="bg-slate-50 p-2 rounded-full border border-slate-100 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 group-hover:border-indigo-100 transition-all">
                    <ArrowRight size={18} />
                </div>
            </div>
        </div>
    );
}
