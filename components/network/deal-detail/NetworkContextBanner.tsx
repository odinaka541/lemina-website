import { Share2, DollarSign, Users, Calendar } from 'lucide-react';

interface NetworkContextBannerProps {
    context: any;
}

export default function NetworkContextBanner({ context }: NetworkContextBannerProps) {
    const Item = ({ icon: Icon, label, value, sub }: any) => (
        <div className="flex items-start gap-3 flex-1 min-w-[200px]">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                <Icon size={18} />
            </div>
            <div>
                <span className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-0.5">{label}</span>
                <span className="block text-sm font-bold text-slate-900">{value}</span>
                {sub && <span className="block text-xs text-slate-500 mt-0.5">{sub}</span>}
            </div>
        </div>
    );

    return (
        <div className="bg-white border-b border-slate-200 px-6 py-4">
            <div className="flex flex-wrap gap-6 lg:gap-8">
                <div className="flex items-center gap-3 flex-1 min-w-[200px]">
                    <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
                        {/* Avatar fallback */}
                        <div className="w-full h-full flex items-center justify-center font-bold text-slate-500">{context.shared_by.name.charAt(0)}</div>
                    </div>
                    <div>
                        <span className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-0.5">Shared By</span>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-slate-900">{context.shared_by.name}</span>
                            <span className="text-xs text-slate-400 font-medium">• {context.shared_by.time_ago}</span>
                        </div>
                    </div>
                </div>

                <div className="w-px bg-slate-100 hidden md:block"></div>

                <Item
                    icon={DollarSign}
                    label="Network Allocation"
                    value={`$${(context.allocation.amount / 1000).toFixed(0)}k of $${(context.allocation.total_round / 1000).toFixed(0)}k`}
                    sub={`${context.allocation.percentage}% of total round`}
                />

                <div className="w-px bg-slate-100 hidden md:block"></div>

                <Item
                    icon={Users}
                    label="Network"
                    value={context.network_name}
                    sub={`${context.member_count} members`}
                />

                <div className="w-px bg-slate-100 hidden md:block"></div>

                <Item
                    icon={Calendar}
                    label="Internal Deadline"
                    value={context.internal_deadline}
                    sub="5 days before close"
                />
            </div>
        </div>
    );
}
