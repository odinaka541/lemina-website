import { CheckCircle, Clock, Zap, Plus, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

interface CommitmentTrackerProps {
    commitments: any;
    onCommit: () => void;
}

export default function CommitmentTracker({ commitments, onCommit }: CommitmentTrackerProps) {
    const [isUncommittedExpanded, setIsUncommittedExpanded] = useState(false);

    return (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm mb-6">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Network Commitments</h3>

            {/* Progress Bar */}
            <div className="mb-8 relative">
                <div className="flex justify-between items-end mb-2">
                    <div>
                        <span className="text-3xl font-bold text-slate-900">${commitments.total_committed.toLocaleString()}</span>
                        <span className="text-sm font-medium text-slate-500 ml-2">of ${commitments.target.toLocaleString()} goal</span>
                    </div>
                    <span className="text-lg font-bold text-emerald-600">{commitments.percentage}%</span>
                </div>

                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-1000 relative"
                        style={{ width: `${commitments.percentage}%` }}
                    >
                        <div className="absolute top-0 right-0 bottom-0 w-20 bg-gradient-to-l from-white/20 to-transparent"></div>
                    </div>
                </div>

                <div className="flex justify-between mt-2 text-xs font-medium text-slate-500">
                    <span>${commitments.remaining.toLocaleString()} available</span>
                    <span>Min ticket: $5,000</span>
                </div>
            </div>

            {/* Committed List */}
            <div className="mb-6">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3 flex justify-between">
                    <span>Committed ({commitments.members.length})</span>
                    <span>Status</span>
                </h4>
                <div className="space-y-1">
                    {commitments.members.map((member: any) => (
                        <div key={member.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors group">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-xs text-slate-600">
                                    {member.name.charAt(0)}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-bold text-slate-900">{member.name}</span>
                                        {member.is_lead && (
                                            <span className="text-[10px] font-bold px-1.5 py-0.5 bg-indigo-50 text-indigo-600 rounded">LEAD</span>
                                        )}
                                    </div>
                                    <span className="text-xs text-slate-500 font-medium group-hover:hidden">${member.amount.toLocaleString()}</span>
                                    <span className="text-xs text-slate-400 hidden group-hover:inline-block">{member.timestamp}</span>
                                </div>
                            </div>

                            <div className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-bold border ${member.status === 'wired'
                                    ? 'bg-emerald-50 border-emerald-100 text-emerald-700'
                                    : 'bg-amber-50 border-amber-100 text-amber-700'
                                }`}>
                                {member.status === 'wired' ? <CheckCircle size={12} /> : <Clock size={12} />}
                                {member.status === 'wired' ? 'Wired' : 'Pending'}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Uncommitted Toggle */}
            <button
                onClick={() => setIsUncommittedExpanded(!isUncommittedExpanded)}
                className="w-full flex items-center justify-center gap-2 py-2 text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors mb-6"
            >
                {isUncommittedExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                {commitments.uncommitted_count} members haven't committed yet
            </button>

            {isUncommittedExpanded && (
                <div className="mb-6 p-4 bg-slate-50 rounded-xl text-center">
                    <p className="text-xs text-slate-500 mb-3">Don't let them miss out!</p>
                    <button className="text-xs font-bold text-indigo-600 hover:underline">Nudge All Uncommitted Members</button>
                </div>
            )}

            {/* Actions */}
            <div className="space-y-3">
                <button
                    onClick={onCommit}
                    className="w-full py-4 bg-[#0F172A] hover:bg-[#1E293B] text-white font-bold rounded-xl shadow-lg shadow-indigo-500/10 flex items-center justify-center gap-2 transition-all active:scale-95 group"
                >
                    <Plus size={18} className="group-hover:scale-110 transition-transform" />
                    I Want to Commit
                </button>

                <button className="w-full py-2 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors">
                    Pass on this Deal
                </button>
            </div>
        </div>
    );
}
