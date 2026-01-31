'use client';

import { useState } from 'react';
import { UserPlus } from 'lucide-react';

// Components
import ParamUrgentAttentionPanel from '@/components/network/UrgentAttentionPanel';
import PerformanceDashboard from '@/components/network/PerformanceDashboard';
import ActiveDealsPreview from '@/components/network/ActiveDealsPreview';
import NetworkMembersTable from '@/components/network/NetworkMembersTable';
import NetworkIntelligencePanel from '@/components/network/NetworkIntelligencePanel';
import NetworkActivityFeed from '@/components/network/NetworkActivityFeed';
import { useToast } from '@/components/providers/ToastProvider';

export default function NetworkPage() {
    const { showToast } = useToast();
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

    const handleInvite = () => {
        showToast("Invite Member modal would open here", "info");
    };

    return (
        <div className="container mx-auto px-4 pt-4 pb-24 space-y-10 max-w-[1600px]">
            {/* 1. Page Header */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">My Network</h1>
                    <p className="text-slate-500 font-medium">Manage your investment network and members.</p>
                </div>
                <button
                    onClick={handleInvite}
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#0F172A] hover:bg-[#1E293B] text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/10 transition-all active:scale-95"
                >
                    <UserPlus size={18} />
                    Invite Member
                </button>
            </header>

            {/* 2. Urgent Attention Panel */}
            <ParamUrgentAttentionPanel />

            {/* 3. Performance Dashboard */}
            <PerformanceDashboard />

            {/* 4. Active Deals Preview */}
            <ActiveDealsPreview />

            {/* 5. Network Members Table */}
            <NetworkMembersTable />

            {/* 6. Network Intelligence Panel */}
            <NetworkIntelligencePanel />

            {/* 7. Network Activity Feed */}
            <NetworkActivityFeed />

        </div>
    );
}
