import { ShieldCheck, Clock, ArrowRight, Settings } from 'lucide-react';

interface DealHeaderProps {
    company: any;
    urgency: any;
}

export default function DealHeader({ company, urgency }: DealHeaderProps) {
    return (
        <div className="bg-white px-6 py-6 border-b border-slate-100">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">

                {/* Left: Company Info */}
                <div className="flex gap-5 items-center">
                    <div className="w-20 h-20 rounded-2xl bg-slate-900 text-white flex items-center justify-center text-3xl font-bold shadow-lg shadow-indigo-500/10">
                        {company.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight leading-none mb-2">{company.name}</h1>
                        <p className="text-slate-500 font-medium mb-3">{company.description}</p>

                        <div className="flex flex-wrap items-center gap-2">
                            {company.verification_tier >= 3 && (
                                <div className="h-1.5 w-12 bg-emerald-500 rounded-full" title={`Verified Tier ${company.verification_tier}`} />
                            )}
                            <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100">
                                {company.stage}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Right: Actions & Urgency */}
                <div className="flex flex-col items-end gap-4 w-full md:w-auto">
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${urgency.days_remaining <= 5
                        ? 'bg-amber-50 border-amber-100 text-amber-800'
                        : 'bg-slate-50 border-slate-100 text-slate-600'
                        }`}>
                        <Clock size={18} />
                        <span className="font-bold">{urgency.days_remaining} days left</span>
                    </div>

                    {/* Admin Actions (Mocked visibility) */}
                    <div className="flex gap-2">
                        <button className="p-2 text-slate-400 hover:text-slate-700 bg-white border border-slate-200 rounded-lg hover:border-slate-300 transition-colors">
                            <Settings size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
