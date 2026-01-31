import { FileText, MoreHorizontal, Download, Sparkles, Upload } from 'lucide-react';

interface DocumentsSectionProps {
    documents: any[];
}

export default function DocumentsSection({ documents }: DocumentsSectionProps) {
    return (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-slate-900">Deal Documents</h3>
                <button className="text-sm font-bold text-indigo-600 flex items-center gap-1 hover:text-indigo-700">
                    <Upload size={14} /> Upload
                </button>
            </div>

            <div className="space-y-4">
                {documents.map((doc: any) => (
                    <div key={doc.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors group">
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-red-500 shrink-0">
                                <FileText size={20} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start">
                                    <h4 className="text-sm font-bold text-slate-900 truncate pr-2">{doc.title}</h4>
                                    <span className="text-xs text-slate-400 font-medium whitespace-nowrap">{doc.size}</span>
                                </div>

                                <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                                    <span>Added by {doc.uploaded_by}</span>
                                    <span>•</span>
                                    <span>{doc.time_ago}</span>
                                </div>

                                {doc.ai_analyzed && (
                                    <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-600 border border-indigo-100">
                                        <Sparkles size={10} /> AI Analyzed
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-3 mt-3 pt-3 border-t border-slate-200/60">
                            {doc.ai_analyzed && (
                                <button className="text-xs font-bold text-indigo-600 hover:text-indigo-700">View Analysis</button>
                            )}
                            <button className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1 ml-auto">
                                <Download size={12} /> Download
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
