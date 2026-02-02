import { Briefcase, Search, CheckCircle } from 'lucide-react';

interface EmptyStateProps {
    type: 'no_deals' | 'no_match' | 'all_closed';
    onClearFilters?: () => void;
}

export default function EmptyState({ type, onClearFilters }: EmptyStateProps) {
    const config = {
        no_deals: {
            icon: Briefcase,
            title: "No Deals Yet",
            desc: "Deals shared with your network will appear here.",
            action: "Share a Deal",
            onClick: undefined
        },
        no_match: {
            icon: Search,
            title: "No Deals Found",
            desc: "No deals match your current filters. Try adjusting your search.",
            action: "Clear Filters",
            onClick: onClearFilters
        },
        all_closed: {
            icon: CheckCircle,
            title: "All Caught Up",
            desc: "No active deals at the moment. Check back soon.",
            action: "View Closed Deals",
            onClick: undefined
        }
    };

    const content = config[type];
    const Icon = content.icon;

    return (
        <div className="flex flex-col items-center justify-center py-20 text-center px-4">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100">
                <Icon size={32} className="text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">{content.title}</h3>
            <p className="text-slate-500 max-w-sm mb-6">{content.desc}</p>

            <button
                onClick={content.onClick}
                className="px-6 py-2.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors"
            >
                {content.action}
            </button>
        </div>
    );
}
