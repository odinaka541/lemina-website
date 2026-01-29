'use client';

import { useState } from 'react';
import { X, Upload, FileText, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/components/providers/ToastProvider';
import { PortfolioDocument } from '@/lib/types';

interface UploadDocumentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (doc: PortfolioDocument) => void;
}

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function UploadDocumentModal({ isOpen, onClose, onSuccess }: UploadDocumentModalProps) {
    const { showToast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form State
    const [title, setTitle] = useState('');
    const [type, setType] = useState<'Contract' | 'Report' | 'Deck' | 'Other'>('Report');
    const [fileLocal, setFileLocal] = useState<File | null>(null);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title || !fileLocal) {
            showToast('Please provide a title and select a file', 'error');
            return;
        }

        setIsSubmitting(true);

        try {
            // 1. Upload to Supabase Storage
            const fileName = `${Math.random().toString(36).substring(7)}_${fileLocal.name.replace(/\s+/g, '_')}`;
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('documents')
                .upload(fileName, fileLocal);

            if (uploadError) throw uploadError;

            // 2. Generate Signed URL (valid for 10 years for MVP simplicity)
            // Ideally, we store the path and sign on demand, but this fits the current string 'url' schema.
            const { data: signedData, error: signError } = await supabase.storage
                .from('documents')
                .createSignedUrl(uploadData.path, 315360000);

            if (signError) throw signError;
            if (!signedData?.signedUrl) throw new Error('Failed to generate URL');

            const fileSize = `${(fileLocal.size / 1024 / 1024).toFixed(1)} MB`;

            // 3. Create DB Record
            const res = await fetch('/api/documents', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    type,
                    url: signedData.signedUrl,
                    file_size: fileSize
                })
            });

            const json = await res.json();

            if (!res.ok) throw new Error(json.error || 'Upload failed');

            showToast('Document uploaded successfully', 'success');
            onSuccess(json); // Return the new doc to parent
            handleClose();

        } catch (error: any) {
            console.error('Upload Error:', error);
            showToast(error.message || 'Upload failed', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        setTitle('');
        setType('Report');
        setFileLocal(null);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <div className="bg-white border border-slate-200 rounded-xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">

                <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50">
                    <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <Upload size={18} className="text-emerald-600" />
                        Upload Document
                    </h2>
                    <button onClick={handleClose} className="text-slate-400 hover:text-slate-700 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">

                    {/* Title Input */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Document Title</label>
                        <input
                            type="text"
                            required
                            placeholder="e.g. Q3 2025 LP Report"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 placeholder:text-slate-400 transition-all font-medium"
                        />
                    </div>

                    {/* Type Select */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Document Type</label>
                        <div className="relative">
                            <select
                                value={type}
                                onChange={(e) => setType(e.target.value as any)}
                                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 appearance-none font-medium"
                            >
                                <option value="Report">LP Report</option>
                                <option value="Contract">Legal / Contract</option>
                                <option value="Deck">Pitch Deck</option>
                                <option value="Other">Other</option>
                            </select>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" className="stroke-current" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M1 1L5 5L9 1" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* File Drop Area (Simulated) */}
                    <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:border-emerald-500 hover:bg-emerald-50/50 transition-all group cursor-pointer relative bg-slate-50">
                        <input
                            type="file"
                            required
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            onChange={(e) => setFileLocal(e.target.files?.[0] || null)}
                        />
                        {fileLocal ? (
                            <div className="flex flex-col items-center">
                                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-2 shadow-sm">
                                    <CheckCircle2 size={24} />
                                </div>
                                <span className="text-sm font-bold text-slate-900">{fileLocal.name}</span>
                                <span className="text-xs text-slate-500 mt-1 font-mono bg-white px-2 py-0.5 rounded border border-slate-200">
                                    {(fileLocal.size / 1024 / 1024).toFixed(2)} MB
                                </span>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center text-slate-400 group-hover:text-emerald-600 transition-colors">
                                <div className="w-12 h-12 rounded-full bg-white border border-slate-200 group-hover:border-emerald-200 group-hover:bg-emerald-50 flex items-center justify-center mb-3 transition-colors shadow-sm">
                                    <FileText size={20} />
                                </div>
                                <span className="text-sm font-semibold text-slate-600 group-hover:text-emerald-700">Click to select file</span>
                                <span className="text-xs text-slate-400 mt-1">PDF, DOCX, PPTX up to 10MB</span>
                            </div>
                        )}
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-2 flex gap-3">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="flex-1 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors border border-transparent hover:border-slate-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 px-4 py-2.5 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm hover:shadow active:scale-[0.98]"
                        >
                            {isSubmitting ? (
                                <>Processing...</>
                            ) : (
                                <>
                                    <Upload size={16} /> Upload Now
                                </>
                            )}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}
