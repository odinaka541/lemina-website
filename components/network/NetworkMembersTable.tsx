'use client';

import { useState, useEffect } from 'react';
import { Filter, UserCheck, MoreHorizontal, MessageSquare, Briefcase, Zap, Search } from 'lucide-react';

interface Member {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    deals_participated: number;
    total_deals: number;
    participation_rate: number;
    total_deployed: number;
    last_activity: string;
    last_activity_desc: string;
    engagement_score: 'High' | 'Active' | 'Low' | 'Unknown';
    status: 'Verified' | 'Pending' | 'Suspended';
}

export default function NetworkMembersTable() {
    const [members, setMembers] = useState<Member[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [sort, setSort] = useState('most_active');

    useEffect(() => {
        setLoading(true);
        fetch(`/api/network/members?filter=${filter}&sort=${sort}`)
            .then(res => res.json())
            .then(res => {
                setMembers(res.data || []);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [filter, sort]);

    const getEngagementBadge = (score: string) => {
        switch (score) {
            case 'High': return <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-700"><Zap size={10} /> High</span>;
            case 'Active': return <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-700">🔥 Active</span>;
            case 'Low': return <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">⚪ Low</span>;
            default: return <span className="text-xs text-slate-400 font-medium">Unknown</span>;
        }
    };

    const getStatusDot = (status: string) => {
        switch (status) {
            case 'Verified': return <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> Verified</div>;
            case 'Pending': return <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div> Pending</div>;
            default: return <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div> {status}</div>;
        }
    };

    return (
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-3">
                    <h3 className="text-lg font-bold text-slate-900">Network Members</h3>
                    <span className="bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded-full font-bold">
                        {loading ? '...' : members.length}
                    </span>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20"
                        >
                            <option value="all">All Members</option>
                            <option value="active">Active Only</option>
                            <option value="pending">Pending Approval</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-slate-50/50 border-b border-slate-100">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Member</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Deals</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Deployed</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Last Activity</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Score</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {loading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <tr key={i} className="animate-pulse">
                                    <td className="px-6 py-4"><div className="h-10 w-32 bg-slate-100 rounded-full"></div></td>
                                    <td className="px-6 py-4 md:table-cell hidden"><div className="h-4 w-12 bg-slate-100 rounded"></div></td>
                                    <td className="px-6 py-4 md:table-cell hidden"><div className="h-4 w-16 bg-slate-100 rounded"></div></td>
                                    <td className="px-6 py-4"><div className="h-4 w-24 bg-slate-100 rounded"></div></td>
                                    <td className="px-6 py-4"><div className="h-6 w-16 bg-slate-100 rounded"></div></td>
                                    <td className="px-6 py-4"><div className="h-4 w-20 bg-slate-100 rounded"></div></td>
                                </tr>
                            ))
                        ) : members.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                                    No members found matching your filters.
                                </td>
                            </tr>
                        ) : (
                            members.map((member) => (
                                <tr key={member.id} className="group hover:bg-slate-50/80 transition-colors">
                                    {/* Member Info */}
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                                                {member.name.substring(0, 2).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{member.name}</div>
                                                <div className="text-xs text-slate-500">{member.email}</div>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Deals Participated */}
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-semibold text-slate-700">{member.deals_participated}/{member.total_deals}</div>
                                        <div className="w-16 h-1 mt-1 bg-slate-100 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full ${member.participation_rate > 50 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                                                style={{ width: `${member.participation_rate}%` }}
                                            ></div>
                                        </div>
                                    </td>

                                    {/* Total Deployed */}
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-bold text-slate-700">${member.total_deployed.toLocaleString()}</div>
                                        <div className="text-[10px] text-slate-400 font-medium">Lifetime</div>
                                    </td>

                                    {/* Last Activity */}
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-slate-700">{member.last_activity}</div>
                                        <div className="text-xs text-slate-500 truncate max-w-[120px]">{member.last_activity_desc}</div>
                                    </td>

                                    {/* Engagement Score */}
                                    <td className="px-6 py-4">
                                        {getEngagementBadge(member.engagement_score)}
                                    </td>

                                    {/* Status */}
                                    <td className="px-6 py-4 text-xs font-medium text-slate-600">
                                        {getStatusDot(member.status)}
                                    </td>

                                    {/* Actions */}
                                    <td className="px-6 py-4 text-right">
                                        <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors">
                                            <MoreHorizontal size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Footer Action */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-center">
                <button className="text-xs font-semibold text-indigo-600 hover:text-indigo-700">
                    View All Member Activity History
                </button>
            </div>
        </section>
    );
}
