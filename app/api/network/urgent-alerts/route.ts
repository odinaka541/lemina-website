import { NextResponse } from 'next/server';

export async function GET() {
    // Mock Urgent Alerts
    const alerts = [
        {
            id: '1',
            type: 'closing_soon',
            title: 'Paystack closes in 5 days',
            subtitle: '$50,000 still available',
            severity: 'high',
            action: 'View Deal',
            link: '/dashboard/syndicate/deals/1'
        },
        {
            id: '2',
            type: 'risk',
            title: 'AI flagged Stears as at-risk',
            subtitle: 'Health: 45/100 (Runway critical)',
            severity: 'critical',
            action: 'View Analysis',
            link: '/dashboard/portfolio/stears' // Hypothetical link
        },
        {
            id: '3',
            type: 'low_participation',
            title: 'Low participation for M-KOPA',
            subtitle: 'Only 5 of 15 members committed',
            severity: 'medium',
            action: 'Nudge Members',
            link: '#'
        }
    ];

    return NextResponse.json({ data: alerts });
}
