'use client';

import { Draggable } from '@hello-pangea/dnd';
import { Calendar, DollarSign, MoreHorizontal, FileText, CheckSquare, Timer, Phone, Mail, ExternalLink } from 'lucide-react';
import { Deal } from '@/types';

interface DealCardProps {
    deal: Deal;
    index: number;
    onClick: (deal: Deal) => void;
}

export default function DealCard({ deal, index, onClick }: DealCardProps) {
    const getVerificationColor = (tier?: number, score?: number) => {
        if (tier) {
            if (tier === 5) return 'bg-emerald-500 text-white';
            if (tier === 4) return 'bg-blue-500 text-white';
            if (tier === 3) return 'bg-slate-500 text-white';
            if (tier === 2) return 'bg-amber-500 text-white';
            return 'bg-red-500 text-white';
        }
        if (!score) return 'bg-slate-200';
        if (score >= 90) return 'bg-emerald-500 text-white';
        if (score >= 80) return 'bg-blue-500 text-white';
        if (score >= 60) return 'bg-slate-500 text-white';
        if (score >= 40) return 'bg-amber-500 text-white';
        return 'bg-red-500 text-white';
    };

    const formatCurrency = (amount: number) => {
        if (amount >= 1000000) return `$${(amount / 1000000).toFixed(amount % 1000000 === 0 ? 0 : 1)}M`;
        if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}k`;
        return `$${amount}`;
    };

    const getTimeAgo = (dateStr?: string) => {
        if (!dateStr) return 'just now';
        const date = new Date(dateStr);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diffInSeconds < 60) return 'just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
        if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 604800)}w ago`;
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    return (
        <Draggable draggableId={deal.id.toString()} index={index}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    onClick={() => onClick(deal)}
                    className={`p-5 rounded-xl border mb-4 transition-all group cursor-pointer relative overflow-hidden bg-[var(--card-bg)] ${snapshot.isDragging
                        ? 'border-[var(--color-accent-primary)] shadow-2xl scale-105 z-50 ring-1 ring-[var(--color-accent-primary)]'
                        : 'border-[var(--color-border)] hover:border-[var(--color-accent-primary)] hover:shadow-lg hover:-translate-y-0.5'
                        }`}
                    style={provided.draggableProps.style}
                >
                    {/* Header: Logo & Name */}
                    <div className="flex items-start gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-white p-1.5 flex items-center justify-center shrink-0 border border-[var(--color-border)] shadow-sm">
                            <img src={deal.company?.logo_url || '/placeholder-logo.png'} alt={deal.company?.name} className="w-full h-full object-contain" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                                <a
                                    href={`/dashboard/companies/${deal.company?.id}`}
                                    onClick={(e) => e.stopPropagation()}
                                    className="font-bold text-[var(--color-text-primary)] text-base leading-tight truncate hover:text-[var(--color-accent-primary)] hover:underline transition-colors"
                                >
                                    {deal.companyName || 'Company Name'}
                                </a>
                                {/* Verification Badge - Show for all verified tiers */}
                                {deal.tier && deal.tier > 0 && (
                                    <div className={`w-2 h-2 rounded-full ${getVerificationColor(deal.tier, deal.score).split(' ')[0]}`} title={`Verified Tier ${deal.tier}`} />
                                )}
                            </div>

                            <a href="#" className="text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-accent-primary)] transition-colors truncate block mt-0.5 hover:underline decoration-dotted">
                                {deal.website || 'website.com'}
                            </a>
                        </div>
                        <div className="bg-[var(--input-bg)] px-2 py-1 rounded text-xs font-bold text-[var(--color-text-primary)] border border-[var(--color-border)]">
                            {formatCurrency(deal.amount)}
                        </div>
                    </div>

                    {/* Fields Stack */}
                    <div className="space-y-3">
                        {/* Owner & Priority Row */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center text-[9px] font-bold text-indigo-700 ring-1 ring-indigo-200">
                                    {deal.ownerAvatar || 'OD'}
                                </div>
                                <span className="text-xs font-medium text-[var(--color-text-secondary)]">{deal.ownerName || 'Odinaka'}</span>
                            </div>
                            <div className="flex items-center gap-1.5 bg-[var(--input-bg)] px-2 py-0.5 rounded-full border border-[var(--color-border)]">
                                <div className={`w-1.5 h-1.5 rounded-full ${deal.priority === 'High' ? 'bg-emerald-500 shadow-[0_0_4px_rgba(16,185,129,0.4)]' :
                                    deal.priority === 'Medium' ? 'bg-amber-500' : 'bg-slate-400'
                                    }`} />
                                <span className="text-[10px] font-medium text-[var(--color-text-primary)] uppercase tracking-wide">{deal.priority || 'Medium'}</span>
                            </div>
                        </div>

                        {/* Network Lead (If is_syndicate) */}
                        {deal.is_syndicate && deal.syndicate_lead && (
                            <div className="flex items-center gap-2 text-xs">
                                <span className="text-[var(--color-text-secondary)]">Network Lead:</span>
                                <span className="font-medium text-[var(--color-text-primary)]">{deal.syndicate_lead}</span>
                            </div>
                        )}

                        {/* Last Contact */}
                        <div className="flex items-center gap-2 text-xs text-[var(--color-text-secondary)]">
                            <Timer size={14} className="text-[var(--color-text-secondary)] opacity-70" />
                            <span className="font-medium text-[var(--color-text-primary)]">{getTimeAgo(deal.lastContact)}</span>
                        </div>

                        {/* Industry */}
                        <div className="flex flex-wrap gap-1.5">
                            {(deal.industry || ['Tech']).slice(0, 2).map(tag => (
                                <span key={tag} className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-[var(--input-bg)] text-[var(--color-text-secondary)] border border-[var(--color-border)]">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-4 pt-3 border-t border-[var(--color-border)] flex items-center justify-between">
                        <div className="flex gap-4 text-[var(--color-text-secondary)]">
                            {/* Icons only, no labels */}
                            <div className="hover:text-[var(--color-accent-primary)] cursor-pointer transition-colors" title="View Notes">
                                <FileText size={16} />
                            </div>
                            <div className="hover:text-[var(--color-accent-primary)] cursor-pointer transition-colors" title="Log Call">
                                <Phone size={16} />
                            </div>
                            <div className="hover:text-[var(--color-accent-primary)] cursor-pointer transition-colors" title="Send Email">
                                <Mail size={16} />
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            {/* Improved Docs Formatting */}
                            {deal.documentsCount && deal.documentsCount > 0 ? (
                                <div className="flex items-center gap-1 text-[10px] font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">
                                    <CheckSquare size={12} /> {deal.documentsCount} Docs
                                </div>
                            ) : null}

                            {deal.closeDate && (
                                <div className="text-[10px] font-medium text-[var(--color-text-secondary)]">
                                    Est: {new Date(deal.closeDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </Draggable>
    );
}
