import { CheckCircle2, X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface PremiumToastProps {
    message: string;
    isVisible: boolean;
    onClose: () => void;
}

export default function PremiumToast({ message, isVisible, onClose }: PremiumToastProps) {
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                onClose();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [isVisible, onClose]);

    if (!isVisible) return null;

    return (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-top-4 fade-in duration-300">
            <div className="bg-[#0F172A] text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-slate-700/50 backdrop-blur-sm">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <CheckCircle2 size={14} />
                </div>
                <span className="text-sm font-medium pr-2">{message}</span>
            </div>
        </div>
    );
}
