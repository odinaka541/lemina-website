'use client';

import { useState } from 'react';
import { Droppable } from '@hello-pangea/dnd';
import DealCard from './DealCard';
import { MoreHorizontal, Plus, Trash2 } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

interface PipelineColumnProps {
    column: {
        id: string;
        title: string;
        deals: any[];
    };
    onDealClick: (deal: any) => void;
    onAddDeal?: (stageId: string) => void;
    onDeleteAll?: (stageId: string) => void;
}

export default function PipelineColumn({ column, onDealClick, onAddDeal, onDeleteAll }: PipelineColumnProps) {
    const [showMenu, setShowMenu] = useState(false);

    return (
        <div className="flex-shrink-0 w-80 flex flex-col h-full max-h-full">
            {/* Column Header */}
            <div className="flex items-center justify-between mb-4 px-2 relative z-10">
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${column.title === 'Inbox' ? 'bg-blue-500' :
                        column.title === 'Due Diligence' ? 'bg-amber-500' :
                            column.title === 'Negotiation' ? 'bg-emerald-500' : 'bg-slate-400'
                        }`} />
                    <h3 className="font-bold text-[var(--color-text-primary)] text-sm">{column.title}</h3>
                    <span className="text-[var(--color-text-secondary)] text-xs font-medium">
                        {column.deals.length} deals
                    </span>
                </div>
                <div className="flex gap-1 relative">
                    <button
                        onClick={() => onAddDeal && onAddDeal(column.id)}
                        className="p-1 text-[var(--color-text-secondary)] hover:text-white rounded hover:bg-[rgba(255,255,255,0.05)] transition-colors"
                        title="Add Deal"
                    >
                        <Plus size={16} />
                    </button>
                    <button
                        onClick={() => setShowMenu(!showMenu)}
                        className={`p-1 text-[var(--color-text-secondary)] hover:text-white rounded hover:bg-[rgba(255,255,255,0.05)] transition-colors ${showMenu ? 'bg-[rgba(255,255,255,0.05)] text-white' : ''}`}
                    >
                        <MoreHorizontal size={16} />

                    </button>

                    {/* Dropdown Menu */}
                    <AnimatePresence>
                        {showMenu && (
                            <>
                                <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95, y: 5 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: 5 }}
                                    transition={{ duration: 0.1 }}
                                    className="absolute right-0 top-full mt-1 w-48 bg-white border border-slate-200 rounded-xl shadow-xl z-50 py-1 overflow-hidden"
                                >
                                    <button
                                        onClick={() => {
                                            if (onDeleteAll) onDeleteAll(column.id);
                                            setShowMenu(false);
                                        }}
                                        className="w-full text-left px-4 py-2.5 text-xs font-medium text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                                    >
                                        <Trash2 size={14} />
                                        Delete all deals
                                    </button>
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Droppable Area */}
            <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                    <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className={`flex-1 overflow-y-auto min-h-[150px] rounded-xl transition-colors p-2 no-scrollbar ${snapshot.isDraggingOver ? 'bg-[rgba(255,255,255,0.02)] ring-1 ring-[var(--color-accent-primary)]' : ''
                            }`}
                    >
                        {column.deals.map((deal, index) => (
                            <DealCard key={deal.id} deal={deal} index={index} onClick={onDealClick} />
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </div>
    );
}
