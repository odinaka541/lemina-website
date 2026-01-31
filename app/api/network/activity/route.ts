import { NextResponse } from 'next/server';

export async function GET() {
    // Mock Activity Feed
    const activities = [
        {
            id: '1',
            type: 'financial',
            actor_name: 'Sarah',
            actor_avatar: '/avatars/sarah.png',
            action: 'committed $25,000 to Paystack',
            timestamp: '2h ago',
            metadata: { link: '/dashboard/syndicate/deals/1' }
        },
        {
            id: '2',
            type: 'milestone',
            actor_name: 'Paystack',
            actor_avatar: '/logos/paystack.png',
            action: '75% filled',
            subtitle: 'Deal now at $150k of $200k allocation',
            timestamp: '5h ago',
            metadata: { link: '/dashboard/syndicate/deals/1' }
        },
        {
            id: '3',
            type: 'ai_alert',
            actor_name: 'AI Analysis',
            actor_avatar: 'AI', // Special handling
            action: 'Stears health dropped',
            subtitle: 'Health score: 87 → 45 (at risk, runway critical)',
            timestamp: '1d ago',
            metadata: { link: '/dashboard/portfolio/stears' }
        },
        {
            id: '4',
            type: 'deal_share',
            actor_name: 'Odinaka',
            actor_avatar: '/avatars/odinaka.png',
            action: 'shared new deal: M-KOPA',
            subtitle: '$100k allocation • Energy sector • Min $10k',
            timestamp: '2d ago',
            metadata: { link: '#' }
        },
        {
            id: '5',
            type: 'member_action',
            actor_name: 'Test Investor',
            actor_avatar: '/avatars/test.png',
            action: 'viewed Flutterwave',
            timestamp: '5h ago',
            metadata: { link: '#' }
        }
    ];

    return NextResponse.json({ data: activities });
}
