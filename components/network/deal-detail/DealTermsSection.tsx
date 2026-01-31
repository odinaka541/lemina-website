import { Download } from 'lucide-react';

interface DealTermsSectionProps {
    terms: any;
}

export default function DealTermsSection({ terms }: DealTermsSectionProps) {
    const Row = ({ label, value, highlight = false }: any) => (
        <div className="flex justify-between py-3 border-b border-slate-100 last:border-0">
            <span className="text-sm font-medium text-slate-500">{label}</span>
            <span className={`text-sm font-bold ${highlight ? 'text-indigo-600' : 'text-slate-900'}`}>{value}</span>
        </div>
    );

    return (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm mb-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Deal Terms</h3>

            <div className="mb-6">
                <Row label="Round Type" value={terms.round_type} />
                <Row label="Valuation" value={`$${terms.valuation} ${terms.valuation_type}`} />
                <Row label="Discount" value={terms.discount} />
                <Row label="Valuation Cap" value={`$${terms.cap}`} />
                <Row label="Pro-rata Rights" value={terms.pro_rata ? 'Yes' : 'No'} />
            </div>

            <div className="mb-6">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">Key Provisions</h4>
                <ul className="space-y-2">
                    {['MFN (Most Favored Nation)', 'Information Rights', 'Right of First Refusal'].map((item, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                            <div className="w-1 h-1 rounded-full bg-slate-400"></div>
                            {item}
                        </li>
                    ))}
                </ul>
            </div>

            <button className="w-full flex items-center justify-center gap-2 py-2.5 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors">
                <Download size={16} /> Download Term Sheet
            </button>
        </div>
    );
}
