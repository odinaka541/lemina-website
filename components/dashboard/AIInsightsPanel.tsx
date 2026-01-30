'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AlertTriangle, Lightbulb, ArrowRight, TrendingUp, CheckCircle2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function AIInsightsPanel() {
    const [insights, setInsights] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchInsights() {
            const supabase = createClient();

            // Fetch latest analyses with high risk or opportunities
            const { data, error } = await supabase
                .from('portfolio_analyses')
                .select(`
                    id,
                    risk_level,
                    next_action,
                    opportunities,
                    investment:investments (
                        id,
                        company:companies (id, name, logo_url)
                    )
                `)
                .order('created_at', { ascending: false })
                .limit(10);

            if (data) {
                // Transform into a unified "Insights" list
                const mappedInsights = data.flatMap((item: any) => {
                    const results = [];

                    // 1. Critical/High Risk Alert
                    if (item.risk_level === 'Critical' || item.risk_level === 'High') {
                        results.push({
                            id: `${item.id}-risk`,
                            type: 'alert',
                            title: `${item.investment.company.name} is at ${item.risk_level} Risk`,
                            description: item.next_action || 'Review immediate steps.',
                            companyId: item.investment.company.id,
                            priority: 'high'
                        });
                    }

                    // 2. Opportunities (take first 1)
                    if (item.opportunities && item.opportunities.length > 0) {
                        results.push({
                            id: `${item.id}-opp`,
                            type: 'opportunity',
                            title: `Opportunity: ${item.investment.company.name}`,
                            description: item.opportunities[0],
                            companyId: item.investment.company.id,
                            priority: 'medium'
                        });
                    }

                    return results;
                });

                setInsights(mappedInsights.slice(0, 5)); // Show top 5
            }
            setLoading(false);
        }
        fetchInsights();
    }, []);

    if (loading) return <div className="h-64 bg-slate-50 rounded-xl animate-pulse" />;

    if (insights.length === 0) {
        return (
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm h-full flex flex-col items-center justify-center text-center">
                <div className="bg-emerald-50 text-emerald-600 p-3 rounded-full mb-3">
                    <CheckCircle2 size={24} />
                </div>
                <h3 className="text-slate-900 font-bold mb-1">Portfolio Healthy</h3>
                <p className="text-xs text-slate-500">No critical alerts or pending actions detected by AI.</p>
            </div>
        );
    }

    return (
        <div className="bg-white border border-slate-200 rounded-xl p-0 shadow-sm h-full flex flex-col overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                    <Lightbulb size={16} className="text-amber-500" />
                    AI Portfolio Insights
                </h3>
                <span className="text-[10px] bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full font-bold">
                    {insights.length} New
                </span>
            </div>

            <div className="flex-1 overflow-y-auto p-2 scrollbar-thin space-y-2">
                {insights.map((insight) => (
                    <Link
                        key={insight.id}
                        href={`/dashboard/companies/${insight.companyId}`}
                        className="block p-3 rounded-lg border border-transparent hover:border-indigo-100 hover:bg-slate-50 transition-all group"
                    >
                        <div className="flex items-start gap-3">
                            <div className={`mt-0.5 p-1.5 rounded-md shrink-0 ${insight.type === 'alert' ? 'bg-rose-50 text-rose-500' : 'bg-emerald-50 text-emerald-500'
                                }`}>
                                {insight.type === 'alert' ? <AlertTriangle size={14} /> : <TrendingUp size={14} />}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className={`text-xs font-bold mb-0.5 truncate ${insight.priority === 'high' ? 'text-rose-700' : 'text-slate-700'
                                    }`}>
                                    {insight.title}
                                </h4>
                                <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                                    {insight.description}
                                </p>
                            </div>
                            <ArrowRight size={14} className="text-slate-300 group-hover:text-indigo-500 transition-colors mt-2" />
                        </div>
                    </Link>
                ))}
            </div>

            <div className="p-3 border-t border-slate-100 bg-slate-50/50 text-center">
                <button className="text-xs font-medium text-indigo-600 hover:text-indigo-700 transition-colors">
                    View All Insights
                </button>
            </div>
        </div>
    );
}
