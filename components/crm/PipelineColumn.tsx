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

    // Color mapping for columns
    const getColumnColor = (title: string) => {
        switch (title) {
            case 'Inbox': return 'bg-blue-500 shadow-blue-500/20';
            case 'Due Diligence': return 'bg-amber-500 shadow-amber-500/20';
            case 'Negotiation': return 'bg-emerald-500 shadow-emerald-500/20';
            case 'Committed': return 'bg-indigo-600 shadow-indigo-500/20';
            case 'Done': return 'bg-slate-800 shadow-slate-500/20';
            case 'Passed': return 'bg-slate-400 shadow-slate-400/20';
            default: return 'bg-slate-400 shadow-slate-400/20';
        }
    };

    return (
        <div className={`flex-shrink-0 w-80 flex flex-col h-full max-h-full transition-all duration-200 ${showMenu ? 'z-50 relative' : ''}`}>
            {/* Tactile Column Header */}
            <div className="mb-4 p-3 rounded-2xl bg-white/60 backdrop-blur-md border border-slate-200/50 shadow-sm group hover:border-slate-300/50 transition-all relative z-40">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className={`w-2.5 h-2.5 rounded-full shadow-lg ${getColumnColor(column.title)} ring-2 ring-white/50`} />
                        <h3 className="font-bold text-slate-800 text-sm tracking-tight uppercase">{column.title}</h3>
                        <span className="bg-slate-100/50 px-2 py-0.5 rounded-md text-[10px] font-bold text-slate-500 border border-slate-200/50">
                            {column.deals.length}
                        </span>
                    </div>

                    <div className="flex gap-1 relative opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50">
                        <button
                            onClick={() => onAddDeal && onAddDeal(column.id)}
                            className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                            title="Add Deal"
                        >
                            <Plus size={14} strokeWidth={3} />
                        </button>
                        <button
                            onClick={() => setShowMenu(!showMenu)}
                            className={`p-1.5 rounded-lg transition-colors ${showMenu ? 'bg-slate-100 text-slate-700' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'}`}
                        >
                            <MoreHorizontal size={14} strokeWidth={2.5} />
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
                                        className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-100 rounded-xl shadow-xl shadow-slate-200/50 z-50 py-1 overflow-hidden"
                                    >
                                        <button
                                            onClick={() => {
                                                if (onDeleteAll) onDeleteAll(column.id);
                                                setShowMenu(false);
                                            }}
                                            className="w-full text-left px-4 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors uppercase tracking-wide"
                                        >
                                            <Trash2 size={14} />
                                            Clear Column
                                        </button>
                                    </motion.div>
                                </>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Droppable Area */}
            <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                    <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className={`flex-1 overflow-y-auto px-1 pb-2 no-scrollbar rounded-xl transition-all duration-300 ${snapshot.isDraggingOver
                            ? 'bg-emerald-50/50 ring-2 ring-emerald-500/20 shadow-inner'
                            : ''
                            }`}
                    >
                        <div className="space-y-3">
                            {column.deals.map((deal, index) => (
                                <DealCard key={deal.id} deal={deal} index={index} onClick={onDealClick} />
                            ))}
                        </div>
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </div>
    );
}
