import { NextResponse } from 'next/server';

export async function GET() {
    // Mock Active Deals
    const deals = [
        {
            id: '1',
            company_name: 'Paystack',
            logo_url: '/logos/paystack.png', // Fallback will handle this
            stage_badge: 'CLOSING SOON',
            verification_tier: 5,
            total_allocation: 200000,
            amount_committed: 150000,
            days_left: 5,
            member_count: 5,
            min_ticket: 5000,
            max_ticket: 50000 // Remaining
        },
        {
            id: '2',
            company_name: 'Flutterwave',
            logo_url: '/logos/flutterwave.png',
            stage_badge: 'OPEN',
            verification_tier: 5,
            total_allocation: 500000,
            amount_committed: 120000,
            days_left: 12,
            member_count: 12,
            min_ticket: 10000,
            max_ticket: 100000
        }
    ];

    return NextResponse.json({ data: deals });
}
