'use client';

import { Draggable } from '@hello-pangea/dnd';
import { Calendar, DollarSign, MoreHorizontal, Clock, FileText, CheckSquare, Timer } from 'lucide-react';
import { Deal } from '@/types';

interface DealCardProps {
    deal: Deal;
    index: number;
    onClick: (deal: Deal) => void;
}

export default function DealCard({ deal, index, onClick }: DealCardProps) {
    return (
        <Draggable draggableId={deal.id} index={index}>
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
                    <div className="flex items-start gap-4 mb-5">
                        <div className="w-10 h-10 rounded-lg bg-white p-1.5 flex items-center justify-center shrink-0 border border-[var(--color-border)] shadow-sm">
                            <img src={deal.logo} alt={deal.companyName} className="w-full h-full object-contain" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-[var(--color-text-primary)] text-base leading-tight truncate">{deal.companyName}</h4>
                            <a href={`https://${deal.website}`} onClick={e => e.stopPropagation()} className="text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-accent-primary)] transition-colors truncate block mt-0.5 hover:underline">
                                {deal.website || 'lemina.com'}
                            </a>
                        </div>
                        <button className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors p-1 -mr-2 -mt-2 opacity-0 group-hover:opacity-100">
                            <MoreHorizontal size={18} />
                        </button>
                    </div>

                    {/* Fields Stack */}
                    <div className="space-y-4">
                        {/* Owner */}
                        <div>
                            <div className="text-[11px] text-[var(--color-text-secondary)] mb-1">Owner</div>
                            <div className="text-sm font-medium text-[var(--color-text-primary)]">{deal.ownerName || 'Odinaka'}</div>
                        </div>

                        {/* Priority */}
                        <div>
                            <div className="text-[11px] text-[var(--color-text-secondary)] mb-1">Priority</div>
                            <div className="flex items-center gap-2 text-sm font-medium text-[var(--color-text-primary)]">
                                <div className={`w-2 h-2 rounded-full ${deal.priority === 'High' ? 'bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.4)]' :
                                    deal.priority === 'Medium' ? 'bg-amber-500' : 'bg-slate-400'
                                    }`} />
                                {deal.priority || 'Medium'}
                            </div>
                        </div>

                        {/* Last Contact */}
                        <div>
                            <div className="text-[11px] text-[var(--color-text-secondary)] mb-1">Last Contact</div>
                            <div className="text-sm font-medium text-[var(--color-text-primary)]">
                                {deal.lastContact?.split('ago')[0] + 'ago' || '2 days ago'} <span className="text-[var(--color-text-secondary)] font-normal">({new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })})</span>
                            </div>
                        </div>

                        {/* Next Steps */}
                        <div>
                            <div className="text-[11px] text-[var(--color-text-secondary)] mb-1">Next Steps</div>
                            <p className="text-sm text-[var(--color-text-primary)] leading-relaxed line-clamp-3">
                                {deal.nextSteps || "Review latest financials and schedule follow-up call."}
                            </p>
                        </div>

                        {/* Industry */}
                        <div>
                            <div className="text-[11px] text-[var(--color-text-secondary)] mb-2">Industry</div>
                            <div className="flex flex-wrap gap-2">
                                {(deal.industry || ['Tech']).slice(0, 2).map(tag => (
                                    <span key={tag} className="px-2.5 py-1 rounded-md text-xs font-medium bg-[var(--input-bg)] text-[var(--color-text-primary)] border border-[var(--color-border)]">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-5 pt-4 border-t border-[var(--color-border)] flex items-center justify-between">
                        <div className="flex gap-3 text-[var(--color-text-secondary)]">
                            <FileText size={16} className="hover:text-[var(--color-text-primary)] cursor-pointer transition-colors" />
                            <Calendar size={16} className="hover:text-[var(--color-text-primary)] cursor-pointer transition-colors" />
                            <Timer size={16} className="hover:text-[var(--color-text-primary)] cursor-pointer transition-colors" />
                            <CheckSquare size={16} className="hover:text-[var(--color-text-primary)] cursor-pointer transition-colors" />
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-medium text-[var(--color-text-secondary)]">
                            <Clock size={14} />
                            <span>1hr</span>
                        </div>
                    </div>
                </div>
            )}
        </Draggable>
    );
}
