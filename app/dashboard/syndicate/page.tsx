'use client';

import { useState, useEffect } from 'react';
import { Users, DollarSign, UserPlus, Mail, Loader2, Award, Briefcase } from 'lucide-react';
import InviteMemberModal from '@/components/syndicate/InviteMemberModal';
import NetworkActivityFeed from '@/components/network/NetworkActivityFeed';

export default function SyndicatePage() {
    const [members, setMembers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isInviteOpen, setIsInviteOpen] = useState(false);

    const fetchMembers = async () => {
        try {
            const res = await fetch('/api/syndicate/members');
            const json = await res.json();
            if (json.data) {
                setMembers(json.data);
            }
        } catch (error) {
            console.error('Failed to load members:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMembers();
    }, []);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">My Network</h1>
                    <p className="text-slate-500">Manage your investment network and members.</p>
                </div>
                <button
                    onClick={() => setIsInviteOpen(true)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow-md transition-all"
                >
                    <UserPlus size={18} /> Invite Member
                </button>
            </div>

            {/* Network Stats - Updated per request */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <DollarSign size={80} />
                    </div>
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-emerald-50 rounded-xl text-emerald-600">
                            <DollarSign size={20} />
                        </div>
                        <span className="text-sm font-medium text-slate-500">Capital Deployed</span>
                    </div>
                    <h3 className="text-3xl font-bold text-slate-900">$350k</h3>
                    <p className="text-xs text-slate-500 mt-1">Across 3 deals</p>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Briefcase size={80} />
                    </div>
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-blue-50 rounded-xl text-blue-600">
                            <Briefcase size={20} />
                        </div>
                        <span className="text-sm font-medium text-slate-500">Active Deals</span>
                    </div>
                    <h3 className="text-3xl font-bold text-slate-900">2</h3>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Award size={80} />
                    </div>
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-purple-50 rounded-xl text-purple-600">
                            <Award size={20} />
                        </div>
                        <span className="text-sm font-medium text-slate-500">Avg Commitment</span>
                    </div>
                    <h3 className="text-3xl font-bold text-slate-900">$23k</h3>
                    <p className="text-xs text-slate-500 mt-1">per member</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Members Table (2/3 width) */}
                <div className="lg:col-span-2">
                    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                            <h3 className="font-bold text-slate-800">Network Members</h3>
                            <div className="text-xs font-medium text-slate-500 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-100">
                                {members.length} Members
                            </div>
                        </div>

                        {loading ? (
                            <div className="p-12 flex justify-center items-center text-slate-500 gap-3">
                                <Loader2 className="animate-spin text-indigo-500" size={20} /> Loading members...
                            </div>
                        ) : members.length === 0 ? (
                            <div className="p-16 text-center">
                                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                                    <Users size={32} />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 mb-2">No members yet</h3>
                                <p className="text-slate-500 max-w-sm mx-auto mb-6 leading-relaxed">
                                    Start building your network by inviting investors, advisors, and partners to collaborate on deals.
                                </p>
                                <button
                                    onClick={() => setIsInviteOpen(true)}
                                    className="bg-white border border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-50 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm"
                                >
                                    Invite Your First Member
                                </button>
                            </div>
                        ) : (
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50/50 border-b border-slate-100">
                                        <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider pl-6">Member</th>
                                        <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Role</th>
                                        <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                                        <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right pr-6">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {members.map((member) => (
                                        <tr key={member.id} className="hover:bg-slate-50/50 transition-colors group">
                                            <td className="p-4 pl-6">
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={member.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=random`}
                                                        alt={member.name}
                                                        className="w-10 h-10 rounded-full bg-slate-100 ring-2 ring-white shadow-sm object-cover"
                                                    />
                                                    <div>
                                                        <div className="font-semibold text-slate-900 text-sm">{member.name}</div>
                                                        <div className="text-xs text-slate-500">{member.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${member.role === 'GP'
                                                    ? 'bg-purple-50 text-purple-700 border-purple-100'
                                                    : member.role === 'LP'
                                                        ? 'bg-blue-50 text-blue-700 border-blue-100'
                                                        : 'bg-slate-100 text-slate-600 border-slate-200'
                                                    }`}>
                                                    {member.role}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${member.status === 'active' ? 'text-emerald-600' : 'text-amber-600'
                                                    }`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${member.status === 'active' ? 'bg-emerald-500' : 'bg-amber-500'
                                                        }`} />
                                                    {member.status === 'active' ? 'Active' : 'Pending'}
                                                </span>
                                            </td>
                                            <td className="p-4 text-right pr-6">
                                                <button className="text-xs font-medium text-slate-500 hover:text-indigo-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-indigo-50">
                                                    Manage
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                {/* Right Column: Activity Feed (1/3 width) */}
                <div className="lg:col-span-1">
                    <NetworkActivityFeed />
                </div>
            </div>

            <InviteMemberModal
                isOpen={isInviteOpen}
                onClose={() => setIsInviteOpen(false)}
                onSuccess={() => {
                    fetchMembers();
                }}
            />
        </div>
    );
}
