import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'all';
    const sector = searchParams.get('sector');
    const stage = searchParams.get('stage');
    const sort = searchParams.get('sort') || 'urgency';
    const search = searchParams.get('search') || '';

    // Mock Deals Data
    let deals = [
        {
            id: '1',
            company: {
                id: 'c2',
                name: 'EcoCharge CV',
                logo_url: null,
                description: 'Cape Verde\'s pioneering EV charging infrastructure.',
                sector: 'clean energy',
                verification_tier: 1
            },
            valuation: 1500000,
            valuation_type: 'post',
            deal_type: 'SAFE',
            lead_investor: 'CV Ventures',
            ownership_percentage: 5.0,
            network_allocation: 120000,
            committed_amount: 100000,
            commitment_percentage: 83,
            remaining_amount: 20000,
            member_count: 15,
            min_ticket: 2000,
            deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
            days_remaining: 5,
            comment_count: 5,
            status: 'open',
            created_at: '2025-01-20T10:00:00Z'
        },
        {
            id: '2',
            company: {
                id: 'c2',
                name: 'Flutterwave',
                logo_url: '/logos/flutterwave.png',
                description: 'Payments infrastructure for the internet.',
                sector: 'fintech',
                verification_tier: 2
            },
            valuation: 150000000,
            valuation_type: 'post',
            deal_type: 'Priced Round',
            lead_investor: 'Greycroft',
            ownership_percentage: 0.4,
            network_allocation: 500000,
            committed_amount: 120000,
            commitment_percentage: 24,
            remaining_amount: 380000,
            member_count: 12,
            min_ticket: 10000,
            deadline: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString(), // 12 days from now
            days_remaining: 12,
            comment_count: 5,
            status: 'open',
            created_at: '2025-01-25T14:30:00Z'
        },
        {
            id: '3',
            company: {
                id: 'c3',
                name: 'M-KOPA',
                logo_url: '/logos/mkopa.png',
                description: 'Asset financing for the underbanked.',
                sector: 'fintech', // Simplified for demo
                verification_tier: 1
            },
            valuation: 80000000,
            valuation_type: 'post',
            deal_type: 'Priced Round',
            lead_investor: 'Sumitomo',
            ownership_percentage: 0.2,
            network_allocation: 100000,
            committed_amount: 100000,
            commitment_percentage: 100,
            remaining_amount: 0,
            member_count: 15,
            min_ticket: 5000,
            deadline: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
            days_remaining: 0,
            comment_count: 8,
            status: 'filled',
            created_at: '2025-01-15T09:00:00Z'
        }
    ];

    // Filter Logic
    if (status !== 'all') {
        deals = deals.filter(d => d.status === status);
    }
    if (sector) {
        deals = deals.filter(d => d.company.sector === sector);
    }
    if (search) {
        const q = search.toLowerCase();
        deals = deals.filter(d =>
            d.company.name.toLowerCase().includes(q) ||
            d.company.description.toLowerCase().includes(q) ||
            d.lead_investor.toLowerCase().includes(q)
        );
    }

    // Sort Logic
    deals.sort((a, b) => {
        switch (sort) {
            case 'urgency':
                // Open deals first, then by deadline ASC
                if (a.status !== 'open' && b.status === 'open') return 1;
                if (a.status === 'open' && b.status !== 'open') return -1;
                return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
            case 'progress':
                return b.commitment_percentage - a.commitment_percentage;
            case 'amount':
                return b.network_allocation - a.network_allocation;
            case 'recent':
                return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
            default:
                return 0;
        }
    });

    // Mock Stats (Static for demo purposes, or calculated from full set)
    const stats = {
        total_open: 2,
        total_allocation: 700000,
        total_committed: 270000 + 100000, // + closed deal
        commitment_percentage: Math.round((370000 / 800000) * 100), // Approx
        unique_members: 17,
        avg_days_to_fill: 8
    };

    return NextResponse.json({
        deals,
        stats
    });
}
