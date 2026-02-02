import { NextResponse } from 'next/server';

export async function GET(request: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const id = params.id;

    // Mock Rich Deal Data
    const deal = {
        id: id,
        company: {
            id: 'c2',
            name: 'EcoCharge CV',
            logo_url: null, // Force 2-letter fallback
            description: 'Cape Verde\'s pioneering EV charging infrastructure.',
            verification_tier: 1, // Pre-seed
            stage: 'Due Diligence',
            website: 'https://ecocharge.evc-net.com/',
            founded_year: 2021,
            location: 'Praia, Cape Verde'
        },
        urgency: {
            days_remaining: 5,
            is_urgent: true
        },
        network_context: {
            shared_by: { name: 'Odinaka', avatar: '/avatars/odinaka.png', time_ago: '2 hours ago' },
            allocation: { amount: 100000, total_round: 120000, percentage: 83 },
            network_name: 'ABAC',
            member_count: 15,
            internal_deadline: 'Dec 10, 2026'
        },
        terms: {
            round_type: 'SAFE',
            valuation: '1.5M',
            valuation_type: 'post-money',
            discount: '20%',
            cap: '1.5M',
            pro_rata: true,
            lead_investor: 'CV Ventures',
            min_ticket: 2000
        },
        commitments: {
            total_committed: 75000,
            target: 100000,
            percentage: 75,
            remaining: 25000,
            members: [
                { id: 'u1', name: 'Odinaka', avatar: '', amount: 40000, status: 'wired', is_lead: true, timestamp: '2d ago' },
                { id: 'u2', name: 'Sarah', avatar: '', amount: 20000, status: 'wired', is_lead: false, timestamp: '1d ago' },
                { id: 'u3', name: 'Test Investor', avatar: '', amount: 15000, status: 'pending', is_lead: false, timestamp: '5h ago' }
            ],
            uncommitted_count: 12
        },
        documents: [
            { id: 'd1', title: 'EcoCharge Pitch Deck.pdf', type: 'pdf', size: '3.1 MB', uploaded_by: 'Odinaka', time_ago: '3 days ago', views: 24, ai_analyzed: true },
            { id: 'd2', title: 'Grid Impact Study.pdf', type: 'pdf', size: '5.4 MB', uploaded_by: 'Odinaka', time_ago: '2 days ago', views: 18, ai_analyzed: true },
            { id: 'd3', title: 'SAFE Agreement.pdf', type: 'pdf', size: '890 KB', uploaded_by: 'Odinaka', time_ago: '5 days ago', views: 5, ai_analyzed: false }
        ],
        discussion: [
            {
                id: 'c1',
                user: { name: 'Odinaka', avatar: '', is_lead: true },
                text: "I've done full DD on EcoCharge. Met the team in Praia. Biggest risk is EV adoption rate in the islands, but government incentives are strong. 3 hotels already signed up.",
                time_ago: '2h ago',
                helpful_count: 5,
                replies: [
                    {
                        id: 'c1-r1',
                        user: { name: 'Sarah', avatar: '', is_lead: false },
                        text: "This looks perfect for our infrastructure thesis. But what about grid stability? Can the local grid handle fast charging?",
                        time_ago: '1h ago',
                        helpful_count: 3
                    },
                    {
                        id: 'c1-r2',
                        user: { name: 'Odinaka', avatar: '', is_lead: true },
                        text: "Good question. They are using solar-backed storage units for 70% of the load. Reduces grid dependency significantly and lowers OPEX.",
                        time_ago: '45m ago',
                        helpful_count: 4
                    }
                ]
            }
        ],
        ai_analysis: {
            health_score: 91,
            status: 'Healthy',
            confidence: 88,
            last_updated: '1 day ago',
            summary: {
                insights: [
                    { type: 'positive', text: 'First mover in CV market' },
                    { type: 'positive', text: 'Strong gov alignment (Green Energy 2030)' },
                    { type: 'positive', text: 'Low CAPEX modular stations' }
                ],
                watch_items: [
                    { type: 'warning', text: 'Import duties on EVs still high' },
                    { type: 'warning', text: 'Currency convertibility risk' }
                ],
                recommendation: 'Strategic Infrastructure Play. High potential.'
            },
            full_analysis: {
                assessment: "EcoCharge represents a classic infrastructure play in a contained market. The solar-storage hybrid model mitigates the biggest risk (grid instability). If they capture the fleet market (taxis/hotels), they become the de-facto standard.",
                recommendation: "Invest",
                next_action: "Verify hotel contracts",
                metrics: [
                    { name: 'Revenue', value: '$85k ARR', change: '+120% YoY' },
                    { name: 'Utilization', value: '45%', change: '+10% QoQ' },
                    { name: 'Stations', value: '18', change: '+4 this qtr' },
                    { name: 'Burn Rate', value: '$8k/mo', change: 'Stable' },
                    { name: 'Runway', value: '14 months', change: '' }
                ]
            }
        }
    };

    return NextResponse.json({ deal });
}
