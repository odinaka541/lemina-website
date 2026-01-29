'use client';

import { Activity, User, FileText, DollarSign, Clock } from 'lucide-react';

const MOCK_ACTIVITIES = [
    {
        id: 1,
        type: 'commitment',
        user: 'Odinaka',
        action: 'committed',
        target: 'Paystack',
        amount: '$25,000',
        time: '2h ago',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Odinaka'
    },
    {
        id: 2,
        type: 'view',
        user: 'Test Investor',
        action: 'viewed',
        target: 'Flutterwave',
        time: '5h ago',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Test'
    },
    {
        id: 3,
        type: 'share',
        user: 'Admin',
        action: 'shared new deal:',
        target: 'M-KOPA',
        time: '1d ago',
        avatar: 'https://ui-avatars.com/api/?name=Admin&background=000&color=fff'
    },
    {
        id: 4,
        type: 'commitment',
        user: 'Sarah',
        action: 'committed',
        target: 'Paystack',
        amount: '$50,000',
        time: '1d ago',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah'
    }
];

export default function NetworkActivityFeed() {
    return (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm h-full max-h-[500px] flex flex-col">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                    <Activity size={18} className="text-slate-400" />
                    Network Activity
                </h3>
            </div>

            <div className="overflow-y-auto flex-1 p-0">
                <ul className="divide-y divide-slate-50">
                    {MOCK_ACTIVITIES.map((activity) => (
                        <li key={activity.id} className="p-4 hover:bg-slate-50 transition-colors">
                            <div className="flex gap-3">
                                <img
                                    src={activity.avatar}
                                    alt={activity.user}
                                    className="w-8 h-8 rounded-full bg-slate-100 ring-2 ring-white"
                                />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-slate-900 leading-snug">
                                        <span className="font-semibold">{activity.user}</span>{' '}
                                        <span className="text-slate-500">{activity.action}</span>{' '}
                                        {activity.amount && <span className="font-medium text-emerald-600">{activity.amount} to </span>}
                                        <span className="font-semibold text-slate-900">{activity.target}</span>
                                    </p>
                                    <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                                        <Clock size={10} /> {activity.time}
                                    </p>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="p-3 border-t border-slate-100 bg-slate-50/50 text-center">
                <button className="text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors">
                    View Full History
                </button>
            </div>
        </div>
    );
}
