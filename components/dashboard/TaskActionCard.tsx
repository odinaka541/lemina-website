'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Phone, Mail, FileText, Calendar, CheckCircle2 } from 'lucide-react';
import { Task } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';

interface TaskActionCardProps {
    tasks: Task[];
}

export default function TaskActionCard({ tasks }: TaskActionCardProps) {
    const getIcon = (type: string) => {
        switch (type) {
            case 'call': return <Phone size={14} className="text-slate-500" />;
            case 'invite': return <Mail size={14} className="text-slate-500" />;
            case 'review': return <FileText size={14} className="text-slate-500" />;
            case 'meeting': return <Calendar size={14} className="text-slate-500" />;
            default: return <CheckCircle2 size={14} className="text-slate-500" />;
        }
    };

    // Helper to format date
    const formatDue = (dateStr: string) => {
        try {
            const date = new Date(dateStr);
            // If today
            const now = new Date();
            if (date.toDateString() === now.toDateString()) return 'Today';

            // Relative
            return formatDistanceToNow(date, { addSuffix: true }).replace('about ', '');
        } catch (e) {
            return dateStr;
        }
    };

    return (
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm h-full flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    Pending Actions
                </h3>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-1">
                {tasks.slice(0, 2).map((task) => (
                    <div key={task.id} className="flex items-start gap-2 p-2 rounded-lg bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-sm transition-all cursor-pointer group h-full">
                        <div className="mt-0.5">
                            {getIcon(task.type)}
                        </div>
                        <div className="flex-1 min-w-0 overflow-hidden">
                            <p className="text-[11px] font-semibold text-slate-700 leading-tight truncate">
                                {task.title}
                            </p>
                            <p className="text-[9px] font-medium text-slate-400 mt-0.5 truncate">
                                {formatDue(task.due_date)}
                            </p>
                            {task.type === 'call' && (
                                <button className="mt-2 text-[10px] text-white bg-[var(--color-accent-primary)] px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                    Join Call
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex justify-end pt-2">
                <Link
                    href="/dashboard/tasks"
                    className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-indigo-600 transition-colors uppercase tracking-wide"
                >
                    View Tasks <ArrowRight size={12} />
                </Link>
            </div>
        </div>
    );
}

