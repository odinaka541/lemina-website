import { NextResponse } from 'next/server';

export async function GET(request: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const id = params.id;

    // Mock Rich Deal Data
    const deal = {
        id: id,
        company: {
            id: 'c1',
            name: 'Paystack',
            logo_url: '/logos/paystack.png',
            description: 'Modern payments for Africa.',
            verification_tier: 4,
            stage: 'Due Diligence',
            website: 'https://paystack.com',
            founded_year: 2015,
            location: 'Lagos, Nigeria'
        },
        urgency: {
            days_remaining: 5,
            is_urgent: true
        },
        network_context: {
            shared_by: { name: 'Odinaka', avatar: '/avatars/odinaka.png', time_ago: '2 hours ago' },
            allocation: { amount: 200000, total_round: 500000, percentage: 40 },
            network_name: 'ABAC',
            member_count: 15,
            internal_deadline: 'Dec 10, 2025'
        },
        terms: {
            round_type: 'SAFE',
            valuation: '20M',
            valuation_type: 'pre-money',
            discount: 'None',
            cap: '20M',
            pro_rata: true,
            lead_investor: 'Stripe',
            min_ticket: 5000
        },
        commitments: {
            total_committed: 150000,
            target: 200000,
            percentage: 75,
            remaining: 50000,
            members: [
                { id: 'u1', name: 'Odinaka', avatar: '', amount: 50000, status: 'wired', is_lead: true, timestamp: '2d ago' },
                { id: 'u2', name: 'Sarah', avatar: '', amount: 30000, status: 'wired', is_lead: false, timestamp: '1d ago' },
                { id: 'u3', name: 'Test Investor', avatar: '', amount: 25000, status: 'pending', is_lead: false, timestamp: '5h ago' },
                { id: 'u4', name: 'Mike', avatar: '', amount: 20000, status: 'wired', is_lead: false, timestamp: '2d ago' },
                { id: 'u5', name: 'Jane', avatar: '', amount: 25000, status: 'pending', is_lead: false, timestamp: '12h ago' }
            ],
            uncommitted_count: 10
        },
        documents: [
            { id: 'd1', title: 'Pitch Deck.pdf', type: 'pdf', size: '2.4 MB', uploaded_by: 'Odinaka', time_ago: '3 days ago', views: 12, ai_analyzed: true },
            { id: 'd2', title: 'Financial Model.xlsx', type: 'xls', size: '1.1 MB', uploaded_by: 'Test Investor', time_ago: '2 days ago', views: 8, ai_analyzed: true },
            { id: 'd3', title: 'SAFE Agreement.pdf', type: 'pdf', size: '890 KB', uploaded_by: 'Odinaka', time_ago: '5 days ago', views: 5, ai_analyzed: false }
        ],
        discussion: [
            {
                id: 'c1',
                user: { name: 'Odinaka', avatar: '', is_lead: true },
                text: "I've done full DD on Paystack. Spoke with 3 customers - all positive. Main risk is competition from Stripe expanding to Africa. But Paystack has 3-year head start. Happy to answer questions.",
                time_ago: '2h ago',
                helpful_count: 3,
                replies: [
                    {
                        id: 'c1-r1',
                        user: { name: 'Sarah', avatar: '', is_lead: false },
                        text: "What's their plan for Stripe competition?",
                        time_ago: '1h ago',
                        helpful_count: 1
                    },
                    {
                        id: 'c1-r2',
                        user: { name: 'Odinaka', avatar: '', is_lead: true },
                        text: "They're focused on local payment methods (mobile money, bank transfers) that Stripe doesn't handle well. Plus strong relationships with Nigerian banks.",
                        time_ago: '45m ago',
                        helpful_count: 2
                    }
                ]
            }
        ],
        ai_analysis: {
            health_score: 87,
            status: 'Healthy',
            confidence: 92,
            last_updated: '2 days ago',
            summary: {
                insights: [
                    { type: 'positive', text: 'Revenue: $12M ARR (up 45% YoY)' },
                    { type: 'positive', text: 'Runway: 15 months (healthy)' },
                    { type: 'positive', text: 'Burn Rate: $180k/month (stable)' }
                ],
                watch_items: [
                    { type: 'warning', text: 'Burn increased 20% QoQ' },
                    { type: 'warning', text: '2 senior engineers departed' }
                ],
                recommendation: 'Strong fundamentals. Series A timing appropriate.'
            },
            full_analysis: {
                assessment: "Paystack fits the 'Infrastructure' thesis perfectly. High switching costs, strong moat via bank integrations, and clear market leadership in Nigeria. Valuation is fair compared to peers.",
                recommendation: "Invest",
                next_action: "Request Q1 2026 update to confirm burn stabilizes",
                metrics: [
                    { name: 'Revenue', value: '$12M ARR', change: '+45% YoY' },
                    { name: 'Burn Rate', value: '$180k/mo', change: '+20% QoQ' },
                    { name: 'Runway', value: '15 months', change: '-3 months' },
                    { name: 'Team Size', value: '87', change: '+23 this qtr' },
                    { name: 'Customers', value: '5,200', change: '+37% QoQ' }
                ]
            }
        }
    };

    return NextResponse.json({ deal });
}
