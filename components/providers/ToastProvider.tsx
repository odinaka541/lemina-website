'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, AlertCircle, X, Info } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    showToast: (message: string, type: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((message: string, type: ToastType) => {
        const id = Math.random().toString(36).substring(7);
        setToasts(prev => [...prev, { id, message, type }]);

        // Auto remove after 5 seconds
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 5000);
    }, []);

    const removeToast = (id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
                <AnimatePresence>
                    {toasts.map((toast) => (
                        <motion.div
                            key={toast.id}
                            initial={{ opacity: 0, x: 20, y: 10 }}
                            animate={{ opacity: 1, x: 0, y: 0 }}
                            exit={{ opacity: 0, x: 20, scale: 0.95 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="pointer-events-auto min-w-[300px]"
                        >
                            <div className={`
                                backdrop-blur-xl border p-4 rounded-xl shadow-2xl flex items-start gap-3
                                ${toast.type === 'success'
                                    ? 'bg-[#0f172a]/90 border-emerald-500/20 text-white'
                                    : toast.type === 'error'
                                        ? 'bg-[#0f172a]/90 border-red-500/20 text-white'
                                        : 'bg-[#0f172a]/90 border-blue-500/20 text-white'
                                }
                            `}>
                                <div className={`mt-0.5 ${toast.type === 'success' ? 'text-emerald-500' :
                                        toast.type === 'error' ? 'text-red-500' : 'text-blue-500'
                                    }`}>
                                    {toast.type === 'success' && <CheckCircle size={20} />}
                                    {toast.type === 'error' && <AlertCircle size={20} />}
                                    {toast.type === 'info' && <Info size={20} />}
                                </div>
                                <div className="flex-1 text-sm font-medium leading-relaxed">
                                    {toast.message}
                                </div>
                                <button
                                    onClick={() => removeToast(toast.id)}
                                    className="text-slate-400 hover:text-white transition-colors"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
}
