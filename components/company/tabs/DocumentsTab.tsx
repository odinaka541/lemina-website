'use client';

import { useState, useEffect } from 'react';
import { FileText, Download, Trash2, ExternalLink, RefreshCw, Upload, CheckCircle2 } from 'lucide-react';
import { PortfolioDocument } from '@/lib/types';
import UploadDocumentModal from '@/components/portfolio/UploadDocumentModal';
import { useToast } from '@/components/providers/ToastProvider';

interface DocumentsTabProps {
    investmentId?: string; // If viewing from investment context
    companyId?: string;    // Fallback or context
}

export default function DocumentsTab({ investmentId, companyId }: DocumentsTabProps) {
    const [documents, setDocuments] = useState<PortfolioDocument[]>([]);
    const [loading, setLoading] = useState(true);
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const { showToast } = useToast();

    useEffect(() => {
        if (investmentId) {
            fetchDocuments();
        } else {
            setLoading(false);
        }
    }, [investmentId]);

    const fetchDocuments = async () => {
        try {
            setLoading(true);
            const res = await fetch(`/api/documents?investmentId=${investmentId}`);
            if (!res.ok) throw new Error('Failed to load documents');
            const json = await res.json();
            setDocuments(json);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleAnalyize = async (docId: string) => {
        try {
            showToast('Starting AI analysis...', 'success');
            await fetch('/api/ai/analyze-portfolio', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ documentId: docId })
            });
            // Refresh logic could be better (polling), but basic reload for now
            setTimeout(fetchDocuments, 2000);
        } catch (error) {
            showToast('Analysis failed to start', 'error');
        }
    };

    if (!investmentId) {
        return <div className="p-8 text-center text-slate-500">No investment context found for this company.</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-slate-800">Investment Documents</h3>
                <button
                    onClick={() => setIsUploadOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-lg transition-colors shadow-sm"
                >
                    <Upload size={16} /> Upload New
                </button>
            </div>

            {loading ? (
                <div className="text-center py-12 text-slate-400">Loading documents...</div>
            ) : documents.length === 0 ? (
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-12 text-center">
                    <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-4 text-slate-400">
                        <FileText size={32} />
                    </div>
                    <h4 className="text-slate-900 font-bold mb-1">No documents yet</h4>
                    <p className="text-slate-500 text-sm mb-4">Upload updates, financials, or agreements to get AI insights.</p>
                    <button
                        onClick={() => setIsUploadOpen(true)}
                        className="text-emerald-600 font-bold text-sm hover:underline"
                    >
                        Upload your first document
                    </button>
                </div>
            ) : (
                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Document</th>
                                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Type</th>
                                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">AI Status</th>
                                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {documents.map((doc) => (
                                <tr key={doc.id} className="hover:bg-slate-50/50 group transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                                                <FileText size={20} />
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900 text-sm">{doc.title}</p>
                                                <p className="text-xs text-slate-500">{doc.file_size || 'Unknown size'}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className="px-2 py-1 rounded text-[10px] bg-slate-100 text-slate-600 font-medium border border-slate-200">
                                            {doc.type}
                                        </span>
                                    </td>
                                    <td className="p-4 text-sm text-slate-600">
                                        {new Date(doc.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="p-4">
                                        {doc.analysis_status === 'completed' ? (
                                            <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-bold bg-emerald-50 px-2 py-1 rounded-full w-fit">
                                                <CheckCircle2 size={12} /> Analyzed
                                            </span>
                                        ) : doc.analysis_status === 'processing' ? (
                                            <span className="flex items-center gap-1.5 text-xs text-amber-600 font-bold bg-amber-50 px-2 py-1 rounded-full w-fit animate-pulse">
                                                <RefreshCw size={12} className="animate-spin" /> Analyzing
                                            </span>
                                        ) : doc.analysis_status === 'failed' ? (
                                            <span className="text-xs text-red-500 font-medium">Failed</span>
                                        ) : (
                                            <button
                                                onClick={() => handleAnalyize(doc.id)}
                                                className="text-xs text-indigo-600 hover:text-indigo-700 font-medium hover:underline flex items-center gap-1"
                                            >
                                                <RefreshCw size={12} /> Run Analysis
                                            </button>
                                        )}
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-end gap-2 text-slate-400">
                                            <a href={doc.url} target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-slate-100 rounded-lg hover:text-slate-700 transition-colors" title="Download">
                                                <Download size={16} />
                                            </a>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <UploadDocumentModal
                isOpen={isUploadOpen}
                onClose={() => setIsUploadOpen(false)}
                onSuccess={(newDoc) => {
                    setDocuments([newDoc, ...documents]);
                    if (newDoc.url) handleAnalyize(newDoc.id); // Auto-analyze new docs
                }}
                investmentId={investmentId}
                companyId={companyId}
            />
        </div>
    );
}
