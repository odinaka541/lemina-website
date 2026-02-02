'use client';

import { useState } from 'react';
import { Shield, Key, Smartphone, LogOut, Laptop, Globe } from 'lucide-react';

export default function SecurityTab() {
    return (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm relative overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            {/* Decorative background element */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none opacity-40" />

            <h2 className="text-xl font-bold text-slate-900 mb-6">Security Settings</h2>

            <div className="space-y-8">
                {/* Password Change */}
                <div className="space-y-4">
                    <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                        <Key size={18} className="text-slate-500" /> Change Password
                    </h3>
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Current Password</label>
                            <input type="password" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-slate-400" placeholder="••••••••" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">New Password</label>
                                <input type="password" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-slate-400" placeholder="••••••••" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Confirm New Password</label>
                                <input type="password" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-slate-400" placeholder="••••••••" />
                            </div>
                        </div>
                        <div className="flex justify-end pt-2">
                            <button className="px-4 py-2 bg-white border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors">
                                Update Password
                            </button>
                        </div>
                    </div>
                </div>

                <hr className="border-slate-100" />

                {/* 2FA */}
                <div className="flex items-center justify-between p-6 bg-emerald-50 border border-emerald-100 rounded-xl">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-white border border-emerald-100 rounded-full text-emerald-600 shadow-sm">
                            <Smartphone size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900">Two-Factor Authentication</h3>
                            <p className="text-sm text-slate-600 mt-1 max-w-md">
                                Add an extra layer of security to your account by requiring a code from your authenticator app.
                            </p>
                        </div>
                    </div>
                    <button className="px-4 py-2 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors shadow-sm">
                        Enable 2FA
                    </button>
                </div>

                <hr className="border-slate-100" />

                {/* Active Sessions */}
                <div className="space-y-4">
                    <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                        <Laptop size={18} className="text-slate-500" /> Active Sessions
                    </h3>
                    <div className="border border-slate-200 rounded-xl divide-y divide-slate-100 bg-white">
                        <div className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Laptop size={20} className="text-emerald-500" />
                                <div>
                                    <div className="font-medium text-slate-900">Chrome on macOS (Current)</div>
                                    <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                                        <Globe size={10} /> Lagos, Nigeria • Active now
                                    </div>
                                </div>
                            </div>
                            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded">THIS DEVICE</span>
                        </div>

                        <div className="p-4 flex items-center justify-between opacity-60 hover:opacity-100 transition-opacity">
                            <div className="flex items-center gap-4">
                                <Smartphone size={20} className="text-slate-400" />
                                <div>
                                    <div className="font-medium text-slate-900">Chrome on Samsung S10</div>
                                    <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                                        <Globe size={10} /> London, UK • 2 days ago
                                    </div>
                                </div>
                            </div>
                            <button className="text-red-500 hover:text-red-700 p-2 rounded hover:bg-red-50 transition-colors" title="Revoke Session">
                                <LogOut size={16} />
                            </button>
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <button className="text-sm text-red-500 font-medium hover:underline">Sign out of all other devices</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
