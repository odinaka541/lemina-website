'use client';

import { Droppable } from '@hello-pangea/dnd';
import DealCard from './DealCard';
import { MoreHorizontal, Plus } from 'lucide-react';

interface PipelineColumnProps {
    column: {
        id: string;
        title: string;
        deals: any[];
    };
    onDealClick: (deal: any) => void;
}

export default function PipelineColumn({ column, onDealClick }: PipelineColumnProps) {
    return (
        <div className="flex-shrink-0 w-80 flex flex-col h-full max-h-full">
            {/* Column Header */}
            <div className="flex items-center justify-between mb-4 px-2">
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
                <div className="flex gap-1">
                    <button className="p-1 text-[var(--color-text-secondary)] hover:text-white rounded hover:bg-[rgba(255,255,255,0.05)] transition-colors">
                        <Plus size={16} />
                    </button>
                    <button className="p-1 text-[var(--color-text-secondary)] hover:text-white rounded hover:bg-[rgba(255,255,255,0.05)] transition-colors">
                        <MoreHorizontal size={16} />
                    </button>
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
