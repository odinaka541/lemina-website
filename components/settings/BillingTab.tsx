'use client';

import { CreditCard, Check, Download, ExternalLink } from 'lucide-react';

export default function BillingTab() {
    return (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm relative overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            {/* Decorative background element - subtly placed */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none opacity-40" />

            <h2 className="text-xl font-bold text-slate-900 mb-6">Billing & Plan</h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                {/* Current Plan */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="p-6 rounded-xl border border-emerald-200 bg-emerald-50/50">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="font-bold text-slate-900 text-lg">Pro Investor Plan</h3>
                                <p className="text-sm text-slate-600">$49/month • Billed annually</p>
                            </div>
                            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full uppercase tracking-wide">
                                Active
                            </span>
                        </div>
                        <ul className="space-y-3 mb-6">
                            {[
                                'Unlimted Deal Flow Access',
                                'Advanced Due Diligence Tools',
                                'Network Syndicate Participation',
                                'Priority Support'
                            ].map((feature) => (
                                <li key={feature} className="flex items-center gap-2 text-sm text-slate-700">
                                    <Check size={16} className="text-emerald-500" /> {feature}
                                </li>
                            ))}
                        </ul>
                        <div className="flex gap-4">
                            <button className="px-5 py-2.5 bg-white border border-slate-300 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition-colors shadow-sm text-sm">
                                Change Plan
                            </button>
                            <button className="px-5 py-2.5 text-slate-500 hover:text-red-600 font-medium text-sm transition-colors">
                                Cancel Subscription
                            </button>
                        </div>
                    </div>
                </div>

                {/* Payment Method */}
                <div className="space-y-4">
                    <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                        <CreditCard size={18} className="text-slate-500" /> Payment Method
                    </h3>
                    <div className="p-4 border border-slate-200 rounded-xl bg-slate-50 flex items-center justify-between group">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-6 bg-slate-800 rounded flex items-center justify-center text-white text-[10px] font-bold">VISA</div>
                            <div className="text-sm text-slate-700">•••• 4242</div>
                        </div>
                        <button className="text-xs text-emerald-600 font-medium hover:underline opacity-0 group-hover:opacity-100 transition-opacity">Edit</button>
                    </div>
                    <button className="w-full py-2 border border-dashed border-slate-300 rounded-xl text-slate-500 text-sm hover:border-emerald-500 hover:text-emerald-600 transition-colors">
                        + Add New Card
                    </button>
                </div>
            </div>

            {/* Billing History */}
            <div>
                <h3 className="font-semibold text-slate-900 mb-4">Billing History</h3>
                <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                            <tr>
                                <th className="px-4 py-3">Date</th>
                                <th className="px-4 py-3">Amount</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3 text-right">Invoice</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {[
                                { date: 'Jan 01, 2026', amount: '$49.00', status: 'Paid' },
                                { date: 'Dec 01, 2025', amount: '$49.00', status: 'Paid' },
                                { date: 'Nov 01, 2025', amount: '$49.00', status: 'Paid' },
                            ].map((row, i) => (
                                <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-4 py-3 text-slate-900">{row.date}</td>
                                    <td className="px-4 py-3 text-slate-600">{row.amount}</td>
                                    <td className="px-4 py-3">
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-50 text-emerald-700">
                                            {row.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <button className="text-slate-400 hover:text-slate-600 transition-colors" title="Download Invoice">
                                            <Download size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
