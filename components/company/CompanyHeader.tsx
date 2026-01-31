import { ShieldCheck, MapPin, MoreHorizontal, FileText, Plus, Check, History, Save } from 'lucide-react';
import { useState } from 'react';
import PrivateNotesHistoryModal from './PrivateNotesHistoryModal';

interface CompanyHeaderProps {
    company: any;
    isInPipeline?: boolean;
    onSaveNote?: (note: string) => void;
    onHistoryOpen?: () => void;
}

export default function CompanyHeader({ company, isInPipeline = false, onSaveNote, onHistoryOpen }: CompanyHeaderProps) {
    const [note, setNote] = useState('');
    const [isSaved, setIsSaved] = useState(false);

    const handleSave = () => {
        if (!note.trim()) return;

        // Call parent handler to save/add to history
        if (onSaveNote) onSaveNote(note);

        setIsSaved(true);
        setNote(''); // Clear input after save
        setTimeout(() => setIsSaved(false), 2000);
    };

    return (
        <div className="relative border-b border-indigo-100/50 overflow-hidden">
            {/* Glass Canopy Background - subtle abstract mesh */}
            <div className="absolute inset-0 bg-slate-50/50">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-50/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-50/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
            </div>

            <div className="relative z-10 px-8 py-8">
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 items-start">

                    {/* Left: Identity */}
                    <div className="flex-1 flex gap-6 w-full">
                        {/* Logo */}
                        <div className="w-20 h-20 rounded-2xl bg-white border border-slate-100 flex items-center justify-center shrink-0 shadow-lg shadow-slate-200/50 overflow-hidden relative group">
                            {company.logo_url ? (
                                <img src={company.logo_url} alt={company.name} className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-3xl font-bold text-slate-400 group-hover:text-indigo-400 transition-colors">{company.name.charAt(0)}</span>
                            )}
                        </div>

                        <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-3 mb-2">
                                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{company.name}</h1>

                                {/* Verification Indicator (Blue Pill) */}
                                {company.verification_tier >= 4 && (
                                    <div className="h-1.5 w-8 rounded-full bg-blue-500 shadow-sm shadow-blue-500/30" title={`Tier ${company.verification_tier} Verified`}></div>
                                )}

                                {/* Status Badge */}
                                <span className={`ml-2 px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider border ${company.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                    company.status === 'Acquired' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' :
                                        'bg-slate-50 text-slate-600 border-slate-100'
                                    }`}>
                                    {company.status}
                                </span>

                                {/* Sector Badge */}
                                <span className="px-2.5 py-0.5 rounded-full bg-white text-slate-500 text-[10px] uppercase font-bold tracking-wider border border-slate-200 shadow-sm">
                                    {company.sector}
                                </span>
                            </div>

                            {company.description && (
                                <p className="text-slate-600 text-base leading-relaxed mb-3 max-w-2xl line-clamp-2 font-medium">
                                    {company.description}
                                </p>
                            )}

                            <div className="flex flex-wrap items-center gap-4 text-xs font-bold uppercase tracking-wide text-slate-400">
                                {company.city && company.country && (
                                    <div className="flex items-center gap-1.5 text-slate-500">
                                        <MapPin size={14} />
                                        {company.city}, {company.country}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right: Notes */}
                    <div className="w-full lg:w-auto min-w-[320px]">
                        {/* Private Notes (Mini Card) */}
                        <div className="w-full sm:w-72 bg-white/60 backdrop-blur-sm rounded-xl border border-slate-200/60 p-3 flex flex-col focus-within:ring-2 focus-within:ring-indigo-500/10 focus-within:border-indigo-400 transition-all shadow-sm">
                            <div className="flex items-center justify-between mb-2">
                                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                                    Private Notes
                                </label>
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={onHistoryOpen}
                                        className="p-1.5 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all"
                                        title="View History"
                                    >
                                        <MoreHorizontal size={20} strokeWidth={2.5} />
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        className={`p-1.5 rounded-lg transition-all ${isSaved
                                            ? 'text-emerald-600 bg-emerald-50'
                                            : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                                            }`}
                                        title={isSaved ? "Saved!" : "Save Note"}
                                    >
                                        {isSaved ? <Check size={20} strokeWidth={2.5} /> : <Save size={20} strokeWidth={2.5} />}
                                    </button>
                                </div>
                            </div>
                            <textarea
                                className="bg-transparent border-none outline-none text-xs text-slate-700 resize-none h-16 w-full placeholder:text-slate-400 font-medium"
                                placeholder="Add private notes..."
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
