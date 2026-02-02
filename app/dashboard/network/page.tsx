'use client';

import { useState } from 'react';
import { UserPlus, Users } from 'lucide-react';

// Components
import ParamUrgentAttentionPanel from '@/components/network/UrgentAttentionPanel';
import PerformanceDashboard from '@/components/network/PerformanceDashboard';
import ActiveDealsPreview from '@/components/network/ActiveDealsPreview';
import NetworkMembersTable from '@/components/network/NetworkMembersTable';
import NetworkIntelligencePanel from '@/components/network/NetworkIntelligencePanel';
import NetworkActivityFeed from '@/components/network/NetworkActivityFeed';
import InviteMemberModal from '@/components/network/InviteMemberModal';
import { useToast } from '@/components/providers/ToastProvider';

export default function NetworkPage() {
    const { showToast } = useToast();
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

    const handleInvite = () => {
        setIsInviteModalOpen(true);
    };

    return (
        <div className="min-h-screen bg-slate-50/50 pb-24">
            {/* Header - Glass Canopy */}
            <div className="border-b border-slate-200 bg-white/50 backdrop-blur-sm">
                <div className="container mx-auto px-6 py-8 pt-20 max-w-7xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 tracking-tight font-sans">My Network</h1>
                            <p className="text-sm text-slate-500 font-medium mt-1">Manage your connections and deal flow partners</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 py-8 space-y-8 max-w-7xl">
                {/* 2. Urgent Attention Panel */}
                <ParamUrgentAttentionPanel onInvite={handleInvite} />

                {/* 3. Performance Dashboard */}
                <PerformanceDashboard />

                {/* 4. Active Deals Preview */}
                <ActiveDealsPreview />

                {/* 5. Network Members Table */}
                <NetworkMembersTable onInvite={handleInvite} />

                {/* 6. Network Intelligence Panel */}
                <NetworkIntelligencePanel />

                {/* 7. Network Activity Feed */}
                <NetworkActivityFeed />
            </div>

            <InviteMemberModal
                isOpen={isInviteModalOpen}
                onClose={() => setIsInviteModalOpen(false)}
            />
        </div>
    );
}
