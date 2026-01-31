import { NextResponse } from 'next/server';

export async function GET() {
    // Mock Data based on Master Spec
    const summary = {
        capital_deployed: 350000,
        committed_pending: 75000,
        active_deals: 2,
        total_allocation: 300000,
        active_deals_committed: 270000, // 90%
        avg_time_to_fill: 8, // days
        avg_commitment: 23000,
        commitment_range: { min: 5000, max: 75000 },
        commitment_median: 20000,
        participation_rate: 47,
        active_members: 7,
        total_members: 15,
        industry_avg_participation: 30
    };

    return NextResponse.json({ data: summary });
}
