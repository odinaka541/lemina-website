'use client';

import { Download, Trash2, Shield, Eye, Database } from 'lucide-react';

export default function DataPrivacyTab() {
    return (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm relative overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            {/* Decorative background element */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-slate-100 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none opacity-50" />

            <h2 className="text-xl font-bold text-slate-900 mb-6">Data & Privacy</h2>

            <div className="space-y-8">

                {/* Privacy Settings */}
                <div className="space-y-4">
                    <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                        <Eye size={18} className="text-slate-500" /> Privacy & Visibility
                    </h3>
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 space-y-4">
                        <label className="flex items-start gap-4 cursor-pointer">
                            <input type="checkbox" className="mt-1 w-5 h-5 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500" defaultChecked />
                            <div>
                                <div className="font-medium text-slate-900">Show Profile in Network Directory</div>
                                <div className="text-sm text-slate-500">Allow other investors in your network to find and view your public profile.</div>
                            </div>
                        </label>
                        <label className="flex items-start gap-4 cursor-pointer">
                            <input type="checkbox" className="mt-1 w-5 h-5 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500" defaultChecked />
                            <div>
                                <div className="font-medium text-slate-900">Share Deal Activity (Anonymized)</div>
                                <div className="text-sm text-slate-500">Contribute anonymous data to network aggregate statistics (e.g. "Most active sectors").</div>
                            </div>
                        </label>
                    </div>
                </div>

                <hr className="border-slate-100" />

                {/* Data Export */}
                <div className="flex items-center justify-between p-6 bg-white border border-slate-200 rounded-xl hover:border-slate-300 transition-colors">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-slate-50 rounded-full text-slate-600">
                            <Download size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900">Export Your Data</h3>
                            <p className="text-sm text-slate-600 mt-1 max-w-md">
                                Download a copy of your personal data, investment history, and settings in JSON format.
                            </p>
                        </div>
                    </div>
                    <button className="px-4 py-2 bg-white border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors shadow-sm">
                        Download Archive
                    </button>
                </div>

                <hr className="border-slate-100" />

                {/* Delete Account */}
                <div className="p-6 bg-red-50 border border-red-100 rounded-xl">
                    <h3 className="font-bold text-red-700 flex items-center gap-2 mb-2">
                        <Trash2 size={18} /> Danger Zone
                    </h3>
                    <p className="text-sm text-red-600 mb-6">
                        Deleting your account is permanent. All your data, deal history, and network connections will be wiped immediately.
                    </p>
                    <button className="px-4 py-2 bg-white border border-red-200 text-red-600 font-medium rounded-lg hover:bg-red-50 hover:border-red-300 transition-colors shadow-sm">
                        Delete Account
                    </button>
                </div>

                <div className="flex justify-center pt-8">
                    <a href="#" className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1">
                        <Shield size={12} /> Read our Privacy Policy
                    </a>
                </div>

            </div>
        </div>
    );
}
