'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, DollarSign, Activity, FileText, CheckSquare, Clock, ArrowRight, ExternalLink, MessageSquare, Phone, Mail, MoreHorizontal } from 'lucide-react';
import { Deal } from '@/types';

interface DealModalProps {
    deal: Deal | null;
    isOpen: boolean;
    onClose: () => void;
}

export default function DealModal({ deal, isOpen, onClose }: DealModalProps) {
    if (!isOpen || !deal) return null;

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
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-md bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                        >
                            {/* Header */}
                            <div className="p-6 pb-4 border-b border-[var(--color-border)] flex justify-between items-start">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white rounded-xl p-1.5 shadow-sm">
                                        <img src={deal.logo} alt={deal.companyName} className="w-full h-full object-contain" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-[var(--color-text-primary)]">{deal.companyName}</h2>
                                        <a href={deal.website || '#'} className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-accent-primary)] flex items-center gap-1 transition-colors">
                                            {deal.website || 'website.com'} <ExternalLink size={12} />
                                        </a>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="px-3 py-1 rounded-full text-xs font-bold border border-[var(--color-border)] bg-[var(--input-bg)] text-[var(--color-text-secondary)]">
                                        {deal.amount}
                                    </div>
                                    <button onClick={onClose} className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--input-bg)] rounded-lg transition-colors">
                                        <X size={20} />
                                    </button>
                                </div>
                            </div>

                            {/* Body */}
                            <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar">
                                {/* Owner */}
                                <div>
                                    <label className="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-2 block">Owner</label>
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-xs ring-2 ring-[var(--color-bg-primary)]">
                                            {deal.ownerAvatar || 'OD'}
                                        </div>
                                        <span className="text-sm font-medium text-[var(--color-text-primary)]">{deal.ownerName || 'Odinaka'}</span>
                                    </div>
                                </div>

                                {/* Priority & Last Contact Grid */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-2 block">Priority</label>
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2.5 h-2.5 rounded-full ${deal.priority === 'High' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' :
                                                deal.priority === 'Medium' ? 'bg-amber-500' : 'bg-slate-500'
                                                }`} />
                                            <span className="text-sm font-medium text-[var(--color-text-primary)]">{deal.priority || 'Medium'}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-2 block">Last Contact</label>
                                        <div className="text-sm font-medium text-[var(--color-text-primary)]">
                                            {deal.lastContact || '2 days ago'}
                                        </div>
                                    </div>
                                </div>

                                {/* Next Steps */}
                                <div>
                                    <label className="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-2 block">Next Steps</label>
                                    <p className="text-sm text-[var(--color-text-primary)] leading-relaxed bg-[var(--input-bg)]/50 p-3 rounded-lg border border-[var(--color-border)]">
                                        {deal.nextSteps || 'Review expanded financial model and competitive landscape analysis.'}
                                    </p>
                                </div>

                                {/* Industry */}
                                <div>
                                    <label className="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-2 block">Industry</label>
                                    <div className="flex flex-wrap gap-2">
                                        {(deal.industry || ['Fintech', 'SaaS']).map((tag) => (
                                            <span key={tag} className="px-2.5 py-1 rounded-md text-xs font-medium bg-[var(--input-bg)] text-[var(--color-text-secondary)] border border-[var(--color-border)]">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Footer Actions */}
                            <div className="p-4 border-t border-[var(--color-border)] bg-[var(--input-bg)]/30 flex justify-between items-center gap-2">
                                <div className="flex gap-1">
                                    <button className="p-2 text-[var(--color-text-secondary)] hover:text-emerald-500 hover:bg-emerald-500/10 rounded-lg transition-colors" title="Add Note">
                                        <MessageSquare size={18} />
                                    </button>
                                    <button className="p-2 text-[var(--color-text-secondary)] hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors" title="Schedule Call">
                                        <Phone size={18} />
                                    </button>
                                    <button className="p-2 text-[var(--color-text-secondary)] hover:text-purple-500 hover:bg-purple-500/10 rounded-lg transition-colors" title="Send Email">
                                        <Mail size={18} />
                                    </button>
                                </div>
                                <div className="text-xs text-[var(--color-text-secondary)] flex items-center gap-1">
                                    <Clock size={12} />
                                    <span>Est. Close: {deal.closeDate}</span>
                                </div>
                            </div>

                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
