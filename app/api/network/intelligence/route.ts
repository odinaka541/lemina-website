import { NextResponse } from 'next/server';

export async function GET() {
    // Mock Intelligence Data
    const intelligence = {
        portfolio_health: {
            total: 12,
            healthy: 8,
            monitoring: 3,
            at_risk: 1,
            alert: {
                message: 'Stears needs attention (runway critical)',
                link: '/dashboard/portfolio/stears'
            }
        },
        investment_patterns: [
            'Deals led by Odinaka: 85% fill rate',
            'Best day to share: Monday (40% faster)',
            'Deals >$50k min: 50% slower fill',
            'Fintech deals: 90% participation vs 60% other'
        ],
        leaderboard: [
            { rank: 1, name: 'Odinaka', deals: 5, total_deals: 5, deployed: 150000 },
            { rank: 2, name: 'Sarah', deals: 4, total_deals: 5, deployed: 95000 },
            { rank: 3, name: 'Test Investor', deals: 3, total_deals: 5, deployed: 60000 }
        ],
        network_avg: {
            deals: 3.2,
            deployed: 70000
        }
    };

    return NextResponse.json({ data: intelligence });
}
