'use client';

import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { DollarSign, TrendingUp, TrendingDown, Activity } from 'lucide-react';

interface MetricsTabProps {
    company: any;
}

export default function MetricsTab({ company }: MetricsTabProps) {
    // Mock Data if not present
    const data = [
        { name: 'Q1 23', revenue: 1.2, burn: 0.8, customers: 120 },
        { name: 'Q2 23', revenue: 1.5, burn: 0.9, customers: 180 },
        { name: 'Q3 23', revenue: 1.8, burn: 1.0, customers: 240 },
        { name: 'Q4 23', revenue: 2.2, burn: 1.1, customers: 350 },
        { name: 'Q1 24', revenue: 2.8, burn: 1.2, customers: 500 },
        { name: 'Q2 24', revenue: 3.5, burn: 1.4, customers: 750 },
    ];

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <MetricCard title="ARR" value="$3.5M" change="+25% QoQ" icon={<DollarSign size={16} />} trend="up" />
                <MetricCard title="Burn Rate" value="$1.4M" change="+16% QoQ" icon={<TrendingDown size={16} />} trend="down" inverse />
                <MetricCard title="Runway" value="18 Mo" change="-2 Mo QoQ" icon={<Activity size={16} />} trend="down" inverse />
                <MetricCard title="Customers" value="750" change="+50% QoQ" icon={<TrendingUp size={16} />} trend="up" />
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                    <h3 className="text-sm font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <TrendingUp size={16} className="text-emerald-500" />
                        Revenue Growth (ARR)
                    </h3>
                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 10 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 10 }} tickFormatter={(value) => `$${value}M`} />
                                <Tooltip
                                    contentStyle={{ background: '#FFF', border: '1px solid #E2E8F0', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    itemStyle={{ fontSize: '12px', fontWeight: 600, color: '#0F172A' }}
                                />
                                <Line type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: '#FFF' }} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                    <h3 className="text-sm font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <TrendingDown size={16} className="text-amber-500" />
                        Burn Multiple
                    </h3>
                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 10 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 10 }} tickFormatter={(value) => `$${value}M`} />
                                <Tooltip
                                    cursor={{ fill: '#F1F5F9' }}
                                    contentStyle={{ background: '#FFF', border: '1px solid #E2E8F0', borderRadius: '8px' }}
                                />
                                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                                <Bar dataKey="revenue" name="Revenue" fill="#10B981" radius={[4, 4, 0, 0]} maxBarSize={40} />
                                <Bar dataKey="burn" name="Burn" fill="#F59E0B" radius={[4, 4, 0, 0]} maxBarSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}

function MetricCard({ title, value, change, icon, trend, inverse }: any) {
    const isPositive = trend === 'up';
    const isGood = inverse ? !isPositive : isPositive; // If inverse (e.g. burn), up is bad.

    return (
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{title}</span>
                <div className={`p-1.5 rounded-lg ${isGood ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                    {icon}
                </div>
            </div>
            <div className="flex items-end gap-2">
                <span className="text-2xl font-bold text-slate-800">{value}</span>
                <span className={`text-[10px] font-bold mb-1.5 ${isGood ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {change}
                </span>
            </div>
        </div>
    );
}
