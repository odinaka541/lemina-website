import { format } from 'date-fns';
import { Calendar, FileText, TrendingUp, CheckCircle2, DollarSign } from 'lucide-react';

export default function TimelineTab({ investment }: { investment: any }) {
    if (!investment) return <p className="text-slate-500 text-sm">No investment history available.</p>;

    const events = [
        {
            date: new Date().toISOString(), // Today
            title: 'Q3 Financial Analysis Completed',
            type: 'analysis',
            description: 'AI System analyzed Q3 Report. Health score updated to 92.',
            icon: <CheckCircle2 size={14} className="text-emerald-500" />
        },
        {
            date: '2024-10-15T10:00:00Z',
            title: 'Q3 Report Uploaded',
            type: 'document',
            description: 'Uploaded by Founder via Email.',
            icon: <FileText size={14} className="text-blue-500" />
        },
        {
            date: '2024-06-01T00:00:00Z',
            title: 'Follow-on Interest',
            type: 'note',
            description: 'Discussed potential Series A participation with Lead Investor.',
            icon: <TrendingUp size={14} className="text-purple-500" />
        },
        {
            date: investment.invested_date || '2023-01-01T00:00:00Z',
            title: `Initial Investment (${investment.round_type})`,
            type: 'money',
            description: `Invested $${investment.amount_invested?.toLocaleString()}. Ownership: ${investment.ownership_percentage}%.`,
            icon: <DollarSign size={14} className="text-amber-500" />
        }
    ];

    return (
        <div className="max-w-3xl">
            <div className="relative border-l border-slate-200 ml-3 space-y-8 py-2">
                {events.map((event, i) => (
                    <div key={i} className="relative pl-8 group">
                        {/* Timeline Dot */}
                        <div className="absolute -left-1.5 top-1 w-3 h-3 bg-white border-2 border-slate-300 rounded-full group-hover:border-indigo-500 transition-colors" />

                        {/* Content */}
                        <div className="flex flex-col gap-1">
                            <span className="text-xs text-slate-400 font-medium font-mono mb-0.5">
                                {format(new Date(event.date), 'MMM d, yyyy')}
                            </span>
                            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                                {event.icon}
                                {event.title}
                            </h4>
                            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100 hover:bg-white hover:border-indigo-100 hover:shadow-sm transition-all">
                                {event.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
