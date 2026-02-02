'use client';

import { useState } from 'react';
import { X, Mail, User, Shield, Send, Loader } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/components/providers/ToastProvider';

interface InviteMemberModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function InviteMemberModal({ isOpen, onClose }: InviteMemberModalProps) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: 'member'
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { showToast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.email || !formData.name) {
            showToast('Please fill in all fields', 'error');
            return;
        }

        setIsSubmitting(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        showToast(`Invitation sent to ${formData.email}`, 'success');
        setIsSubmitting(false);
        setFormData({ name: '', email: '', role: 'member' });
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-0 m-auto w-full max-w-md h-fit bg-white rounded-2xl shadow-2xl z-[70] overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-slate-100 flex justify-between items-start">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900">Invite Member</h3>
                                <p className="text-sm text-slate-500 mt-1">Grow your network with trusted partners.</p>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                                <X size={20} className="text-slate-400" />
                            </button>
                        </div>

                        {/* Body */}
                        <form onSubmit={handleSubmit} className="p-6 space-y-6">

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Full Name</label>
                                <div className="flex gap-3">
                                    <div className="w-14 h-14 bg-slate-50 border-2 border-slate-100 rounded-xl flex items-center justify-center text-slate-400 shrink-0">
                                        <User size={20} />
                                    </div>
                                    <div className="flex-1">
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="e.g. Sarah Connor"
                                            className="w-full h-14 px-4 bg-white border-2 border-slate-200 rounded-xl focus:border-indigo-600 focus:ring-0 outline-none transition-all font-bold text-slate-900 placeholder:text-slate-300"
                                            autoFocus
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
                                <div className="flex gap-3">
                                    <div className="w-14 h-14 bg-slate-50 border-2 border-slate-100 rounded-xl flex items-center justify-center text-slate-400 shrink-0">
                                        <Mail size={20} />
                                    </div>
                                    <div className="flex-1">
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            placeholder="sarah@example.com"
                                            className="w-full h-14 px-4 bg-white border-2 border-slate-200 rounded-xl focus:border-indigo-600 focus:ring-0 outline-none transition-all font-bold text-slate-900 placeholder:text-slate-300"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Role</label>
                                <div className="flex gap-3">
                                    <div className="w-14 h-14 bg-slate-50 border-2 border-slate-100 rounded-xl flex items-center justify-center text-slate-400 shrink-0">
                                        <Shield size={20} />
                                    </div>
                                    <div className="flex-1">
                                        <select
                                            value={formData.role}
                                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                            className="w-full h-14 px-4 bg-white border-2 border-slate-200 rounded-xl focus:border-indigo-600 focus:ring-0 outline-none transition-all font-bold text-slate-900 appearance-none cursor-pointer"
                                        >
                                            <option value="member">Member (Can view & commit)</option>
                                            <option value="partner">Partner (Full deal access)</option>
                                            <option value="admin">Admin (Full network control)</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <button
                                type="submit"
                                disabled={isSubmitting || !formData.email || !formData.name}
                                className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader size={18} className="animate-spin" />
                                        Sending Invite...
                                    </>
                                ) : (
                                    <>
                                        <Send size={18} />
                                        Send Invitation
                                    </>
                                )}
                            </button>
                        </form>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
