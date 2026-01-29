'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, DollarSign, Activity, FileText, CheckSquare, Clock, ArrowRight, ExternalLink, MessageSquare, Phone, Mail, MoreHorizontal, Timer, Trash2, Share2, Edit, Save, AlertCircle } from 'lucide-react';
import { Deal } from '@/types';

interface DealModalProps {
    deal: Deal | null;
    isOpen: boolean;
    onClose: () => void;
    onDealUpdate?: () => void;
}

export default function DealModal({ deal, isOpen, onClose, onDealUpdate }: DealModalProps) {
    const [notes, setNotes] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [documents, setDocuments] = useState<any[]>([]);
    const [isLoadingDocs, setIsLoadingDocs] = useState(false);

    // Edit Mode State
    const [isEditing, setIsEditing] = useState(false);
    const [editValues, setEditValues] = useState({
        amount: 0,
        priority: 'Medium',
        closeDate: ''
    });

    useEffect(() => {
        if (deal) {
            setNotes(deal.nextSteps || '');
            setEditValues({
                amount: deal.amount,
                priority: deal.priority || 'Medium',
                closeDate: deal.closeDate || ''
            });
            fetchDocuments(deal.id);
        }
        setShowMenu(false);
        setIsEditing(false);
    }, [deal, isOpen]);

    const fetchDocuments = async (dealId: string) => {
        setIsLoadingDocs(true);
        try {
            const res = await fetch(`/api/documents?dealId=${dealId}`);
            if (res.ok) {
                const data = await res.json();
                setDocuments(data);
            }
        } catch (error) {
            console.error('Failed to fetch documents', error);
        } finally {
            setIsLoadingDocs(false);
        }
    };

    const handleDelete = async () => {
        if (!deal || !confirm('Are you sure you want to delete this deal?')) return;
        try {
            await fetch(`/api/pipeline/deals?id=${deal.id}`, { method: 'DELETE' });
            if (onDealUpdate) onDealUpdate();
            onClose();
        } catch (error) {
            console.error('Failed to delete deal', error);
        }
    };

    const handleShare = () => {
        const text = `Check out this deal: ${deal?.companyName} - $${deal?.amount}`; // Simple share text
        navigator.clipboard.writeText(text);
        alert('Deal info copied to clipboard!'); // Simple feedback
        setShowMenu(false);
    };

    const handleSaveEdit = async () => {
        if (!deal) return;
        setIsSaving(true);
        try {
            await fetch('/api/pipeline/deals', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: deal.id,
                    updates: {
                        amount: Number(editValues.amount),
                        priority: editValues.priority,
                        expected_close_date: editValues.closeDate
                    }
                })
            });
            if (onDealUpdate) onDealUpdate();
            setIsEditing(false);
        } catch (error) {
            console.error('Failed to save edits', error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleSaveNotes = async () => {
        if (!deal) return;
        setIsSaving(true);
        try {
            await fetch('/api/pipeline/deals', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: deal.id,
                    updates: { notes: notes }
                })
            });
            if (onDealUpdate) onDealUpdate();
        } catch (error) {
            console.error('Failed to save notes', error);
        } finally {
            setIsSaving(false);
        }
    };

    const getVerificationColor = (tier?: number, score?: number) => {
        // Prefer Tier if available
        if (tier) {
            if (tier === 5) return 'bg-emerald-500 text-white';
            if (tier === 4) return 'bg-blue-500 text-white';
            if (tier === 3) return 'bg-slate-500 text-white';
            if (tier === 2) return 'bg-amber-500 text-white';
            return 'bg-red-500 text-white';
        }
        // Fallback to Score
        if (!score) return 'bg-slate-200';
        if (score >= 90) return 'bg-emerald-500 text-white';
        if (score >= 80) return 'bg-blue-500 text-white';
        if (score >= 60) return 'bg-slate-500 text-white';
        if (score >= 40) return 'bg-amber-500 text-white';
        return 'bg-red-500 text-white';
    };

    if (!isOpen || !deal) return null;

    // Helper to get company data whether flat or nested
    const company = deal.company || {
        name: (deal as any).companyName,
        logo_url: (deal as any).logo,
        website: (deal as any).website,
        id: deal.company_id
    };

    const formatCurrency = (amount: number) => {
        if (amount >= 1000000) return `$${(amount / 1000000).toFixed(amount % 1000000 === 0 ? 0 : 1)}M`;
        if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}k`;
        return `$${amount}`;
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    >
                        {/* Modal */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowMenu(false);
                            }}
                            className="w-full max-w-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                        >
                            {/* Header */}
                            <div className="p-6 pb-4 border-b border-[var(--color-border)] flex justify-between items-start">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 bg-white rounded-xl p-2 shadow-sm border border-[var(--color-border)] shadow-sm">
                                        <img src={company.logo_url || '/placeholder-logo.png'} alt={company.name} className="w-full h-full object-contain" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <a
                                                href={`/dashboard/companies/${company.id || deal.company_id}`}
                                                className="text-xl font-bold text-[var(--color-text-primary)] hover:text-[var(--color-accent-primary)] hover:underline transition-colors"
                                            >
                                                {company.name}
                                            </a>
                                            {/* Verification Badge - Tier >= 3 */}
                                            {deal.tier && deal.tier >= 3 && (
                                                <div className={`w-2.5 h-2.5 rounded-full ${getVerificationColor(deal.tier).split(' ')[0]}`} title={`Verified Tier ${deal.tier}`} />
                                            )}
                                        </div>

                                        <div className="flex items-center gap-2 mt-1">
                                            <a href={company.website || '#'} className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-accent-primary)] flex items-center gap-1 transition-colors">
                                                {company.website || 'website.com'} <ExternalLink size={12} />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 relative">
                                    {isEditing ? (
                                        <div className="relative">
                                            <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]" />
                                            <input
                                                type="number"
                                                value={editValues.amount}
                                                onChange={(e) => setEditValues({ ...editValues, amount: Number(e.target.value) })}
                                                className="pl-8 pr-3 py-1.5 w-32 rounded-lg text-sm font-bold bg-white text-[var(--color-text-primary)] border border-[var(--color-border)] focus:ring-2 focus:ring-[var(--color-accent-primary)] outline-none"
                                            />
                                        </div>
                                    ) : (
                                        <div className="px-3 py-1.5 rounded-lg text-sm font-bold bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] border border-[var(--color-border)] shadow-sm">
                                            {formatCurrency(deal.amount)}
                                        </div>
                                    )}
                                    <div className="relative">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setShowMenu(!showMenu);
                                            }}
                                            className={`p-2 rounded-lg transition-colors ${showMenu ? 'bg-[var(--input-bg)] text-[var(--color-text-primary)]' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--input-bg)]'}`}
                                        >
                                            <MoreHorizontal size={20} />
                                        </button>

                                        {/* Dropdown Menu */}
                                        {showMenu && (
                                            <div className="absolute right-0 top-full mt-1 w-56 bg-white border border-[var(--color-border)] rounded-xl shadow-xl z-50 py-1 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                                                <button
                                                    onClick={() => {
                                                        setIsEditing(!isEditing);
                                                        setShowMenu(false);
                                                    }}
                                                    className="w-full text-left px-4 py-2.5 text-sm text-[var(--color-text-primary)] hover:bg-[var(--input-bg)] flex items-center gap-3 transition-colors"
                                                >
                                                    <Edit size={16} className="text-[var(--color-text-secondary)]" />
                                                    {isEditing ? 'Cancel Editing' : 'Edit Deal'}
                                                </button>
                                                <button
                                                    onClick={handleShare}
                                                    className="w-full text-left px-4 py-2.5 text-sm text-[var(--color-text-primary)] hover:bg-[var(--input-bg)] flex items-center gap-3 transition-colors"
                                                >
                                                    <Share2 size={16} className="text-[var(--color-text-secondary)]" />
                                                    Share with Network
                                                </button>
                                                <div className="h-px bg-[var(--color-border)] my-1" />
                                                <button
                                                    onClick={handleDelete}
                                                    className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors"
                                                >
                                                    <Trash2 size={16} />
                                                    Delete Deal
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    <button onClick={onClose} className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--input-bg)] rounded-lg transition-colors">
                                        <X size={20} />
                                    </button>
                                </div>
                            </div>

                            {/* Body */}
                            <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar bg-[var(--color-bg-primary)]/50">
                                {/* Owner & Priority Grid */}
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-2 block">Owner</label>
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-[10px] text-indigo-700 font-bold ring-2 ring-indigo-200">
                                                {deal.ownerAvatar || 'OD'}
                                            </div>
                                            <span className="text-sm font-medium text-[var(--color-text-primary)]">{deal.ownerName || 'Odinaka'}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-2 block">Priority</label>
                                        {isEditing ? (
                                            <select
                                                value={editValues.priority}
                                                onChange={(e) => setEditValues({ ...editValues, priority: e.target.value })}
                                                className="w-full p-2 text-sm bg-white border border-[var(--color-border)] rounded-lg outline-none focus:ring-2 focus:ring-[var(--color-accent-primary)]"
                                            >
                                                <option value="High">High</option>
                                                <option value="Medium">Medium</option>
                                                <option value="Low">Low</option>
                                            </select>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <div className={`w-2.5 h-2.5 rounded-full ${deal.priority === 'High' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' :
                                                    deal.priority === 'Medium' ? 'bg-amber-500' : 'bg-slate-500'
                                                    }`} />
                                                <span className="text-sm font-medium text-[var(--color-text-primary)]">{deal.priority || 'Medium'}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Last Contact & Expected Close */}
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-2 block">Last Contact</label>
                                        <div className="flex items-center gap-2 text-sm text-[var(--color-text-primary)]">
                                            <Timer size={16} className="text-[var(--color-text-secondary)]" />
                                            <span className="font-medium">{deal.lastContact ? new Date(deal.lastContact).toLocaleDateString() : 'Just now'}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-2 block">Est. Close</label>
                                        {isEditing ? (
                                            <input
                                                type="date"
                                                value={editValues.closeDate.split('T')[0]}
                                                onChange={(e) => setEditValues({ ...editValues, closeDate: e.target.value })}
                                                className="w-full p-2 text-sm bg-white border border-[var(--color-border)] rounded-lg outline-none focus:ring-2 focus:ring-[var(--color-accent-primary)]"
                                            />
                                        ) : (
                                            <div className="text-sm font-medium text-[var(--color-text-primary)]">
                                                {deal.closeDate ? new Date(deal.closeDate).toLocaleDateString() : 'Not set'}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Network Lead if exists */}
                                {deal.is_syndicate && deal.syndicate_lead && (
                                    <div>
                                        <label className="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-2 block">Network Lead</label>
                                        <div className="text-sm font-medium text-[var(--color-text-primary)]">
                                            {deal.syndicate_lead}
                                        </div>
                                    </div>
                                )}

                                {/* Notes & Next Steps (Editable) */}
                                <div>
                                    <label className="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-2 flex justify-between items-center">
                                        <span>Notes & Next Steps</span>
                                        {isSaving && <span className="text-[var(--color-accent-primary)] animate-pulse">Saving...</span>}
                                    </label>
                                    <textarea
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        onBlur={handleSaveNotes}
                                        className="w-full min-h-[100px] text-sm text-[var(--color-text-primary)] leading-relaxed bg-white p-4 rounded-xl border border-[var(--color-border)] shadow-sm focus:border-[var(--color-accent-primary)] focus:ring-1 focus:ring-[var(--color-accent-primary)] outline-none resize-none transition-all"
                                        placeholder="Add notes, next steps, or reminders..."
                                    />
                                </div>

                                {/* Documents Section */}
                                {documents && documents.length > 0 ? (
                                    <div>
                                        <label className="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-2 block">Documents ({documents.length})</label>
                                        <div className="space-y-2">
                                            {documents.map((doc: any, idx: number) => (
                                                <a
                                                    key={idx}
                                                    href={doc.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center justify-between p-3 bg-white border border-[var(--color-border)] rounded-lg hover:border-[var(--color-accent-primary)] transition-colors cursor-pointer group"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 bg-red-50 text-red-500 rounded-lg">
                                                            <FileText size={16} />
                                                        </div>
                                                        <div>
                                                            <div className="text-sm font-semibold text-[var(--color-text-primary)] group-hover:text-[var(--color-accent-primary)] transition-colors max-w-[200px] truncate">{doc.title}</div>
                                                            <div className="text-xs text-[var(--color-text-secondary)]">{doc.file_size || '0 KB'} • {new Date(doc.created_at).toLocaleDateString()}</div>
                                                        </div>
                                                    </div>
                                                    <div className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]">
                                                        <ExternalLink size={16} />
                                                    </div>
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <label className="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-2 block">Documents</label>
                                        <div className="text-sm text-[var(--color-text-secondary)] italic">
                                            {isLoadingDocs ? 'Loading documents...' : 'No documents attached'}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Footer Actions */}
                            <div className="p-4 border-t border-[var(--color-border)] bg-white flex items-center gap-3">
                                {isEditing ? (
                                    <>
                                        <button
                                            onClick={() => setIsEditing(false)}
                                            className="flex-1 py-3 px-4 text-sm font-semibold text-[var(--color-text-primary)] bg-[var(--input-bg)] hover:bg-[var(--color-border)] rounded-xl transition-colors border border-[var(--color-border)]"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleSaveEdit}
                                            className="flex-1 py-3 px-4 text-sm font-semibold text-white bg-[var(--color-accent-primary)] hover:bg-[var(--color-accent-secondary)] rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2"
                                        >
                                            <Save size={18} /> Save Changes
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button className="flex-none w-32 py-3 px-4 flex items-center justify-center gap-2 text-sm font-semibold text-[var(--color-text-primary)] bg-[var(--input-bg)] hover:bg-[var(--color-border)] rounded-xl transition-colors border border-[var(--color-border)]">
                                            <Mail size={18} className="text-[var(--color-text-secondary)]" /> Email
                                        </button>
                                        <button className="flex-none w-32 py-3 px-4 flex items-center justify-center gap-2 text-sm font-semibold text-[var(--color-text-primary)] bg-[var(--input-bg)] hover:bg-[var(--color-border)] rounded-xl transition-colors border border-[var(--color-border)]">
                                            <Phone size={18} className="text-[var(--color-text-secondary)]" /> Log Call
                                        </button>

                                        <a
                                            href={`/dashboard/companies/${deal.company_id || company.id}`}
                                            className="flex-1 py-3 px-4 flex items-center justify-center gap-2 text-sm font-semibold text-white bg-[var(--color-accent-primary)] hover:bg-[var(--color-accent-secondary)] rounded-xl transition-colors shadow-sm"
                                        >
                                            <ExternalLink size={18} className="text-white" /> View Company
                                        </a>
                                    </>
                                )}
                            </div>

                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
