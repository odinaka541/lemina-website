'use client';

import { useState, useEffect } from 'react';
import { Filter, UserCheck, MoreHorizontal, MessageSquare, Briefcase, Zap, Search, User, Trash2, UserPlus, Shield, Settings, Edit } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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

interface NetworkMembersTableProps {
    onInvite?: () => void;
}

export default function NetworkMembersTable({ onInvite }: NetworkMembersTableProps) {
    const [members, setMembers] = useState<Member[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [sort, setSort] = useState('most_active');
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);

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
                    <button
                        onClick={onInvite}
                        className="flex items-center gap-2 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-colors shadow-sm"
                    >
                        <UserPlus size={14} /> Add Member
                    </button>
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
            <div className="overflow-x-auto min-h-[400px]">
                {openMenuId && (
                    <div
                        className="fixed inset-0 z-10 cursor-default"
                        onClick={() => setOpenMenuId(null)}
                    />
                )}
                <table className="w-full relative z-0">
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
                                <td colSpan={7} className="px-6 py-24 text-center">
                                    <div className="flex flex-col items-center justify-center">
                                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                                            <Search className="text-slate-300" size={24} />
                                        </div>
                                        <h3 className="text-slate-900 font-bold text-lg mb-1">No members found</h3>
                                        <p className="text-slate-500 text-sm max-w-xs mx-auto">
                                            We couldn't find anyone matching your filters. Try adjusting your search criteria.
                                        </p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            <AnimatePresence mode="popLayout">
                                {members.map((member, index) => (
                                    <motion.tr
                                        key={member.id}
                                        layout
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="group hover:bg-slate-50/80 transition-colors relative"
                                    >
                                        {/* Member Info */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-600 shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all duration-300">
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
                                            <div className="w-16 h-1.5 mt-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full ${member.participation_rate > 50 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                                                    style={{ width: `${member.participation_rate}%` }}
                                                ></div>
                                            </div>
                                        </td>

                                        {/* Total Deployed */}
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-bold text-slate-700">${member.total_deployed.toLocaleString()}</div>
                                            <div className="text-[10px] text-slate-400 font-medium tracking-wide uppercase">Lifetime</div>
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
                                        <td className="px-6 py-4 text-right relative">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setOpenMenuId(openMenuId === member.id ? null : member.id);
                                                }}
                                                className={`p-2 rounded-lg transition-colors ${openMenuId === member.id ? 'bg-slate-100 text-slate-900' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600'}`}
                                            >
                                                <MoreHorizontal size={16} />
                                            </button>

                                            <AnimatePresence>
                                                {openMenuId === member.id && (
                                                    <motion.div
                                                        initial={{ opacity: 0, scale: 0.95, x: 10 }}
                                                        animate={{ opacity: 1, scale: 1, x: 0 }}
                                                        exit={{ opacity: 0, scale: 0.95 }}
                                                        className="absolute right-10 top-0 mt-2 w-48 bg-white/90 backdrop-blur-xl rounded-xl shadow-xl border border-slate-200/60 z-20 py-1 text-left overflow-hidden ring-1 ring-black/5"
                                                    >
                                                        {member.name === 'Odinaka' ? (
                                                            /* Admin / Owner Actions */
                                                            <>
                                                                <button className="w-full px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors">
                                                                    <User size={14} className="text-slate-400" /> View Profile
                                                                </button>
                                                                <button className="w-full px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors">
                                                                    <Edit size={14} className="text-slate-400" /> Edit Profile
                                                                </button>
                                                                <button className="w-full px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors">
                                                                    <Settings size={14} className="text-slate-400" /> Network Settings
                                                                </button>
                                                            </>
                                                        ) : (
                                                            /* Standard Member Actions */
                                                            <>
                                                                <button className="w-full px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors">
                                                                    <User size={14} className="text-slate-400" /> View Profile
                                                                </button>
                                                                <button className="w-full px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors">
                                                                    <MessageSquare size={14} className="text-slate-400" /> Message
                                                                </button>
                                                                <button className="w-full px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors">
                                                                    <Shield size={14} className="text-slate-400" /> Permissions
                                                                </button>
                                                                <div className="h-px bg-slate-100 my-1"></div>
                                                                <button className="w-full px-4 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors">
                                                                    <Trash2 size={14} /> Remove
                                                                </button>
                                                            </>
                                                        )}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
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
