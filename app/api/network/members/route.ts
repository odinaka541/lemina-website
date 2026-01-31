import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const filter = searchParams.get('filter') || 'all';
    const sort = searchParams.get('sort') || 'most_active';

    // Mock Members List
    const members = [
        {
            id: '1',
            name: 'Odinaka',
            email: 'odinaka@example.com',
            avatar: '/avatars/odinaka.png',
            deals_participated: 5,
            total_deals: 5,
            participation_rate: 100,
            total_deployed: 150000,
            last_activity: '2h ago',
            last_activity_desc: 'Committed to Paystack',
            engagement_score: 'High',
            status: 'Verified'
        },
        {
            id: '2',
            name: 'Sarah',
            email: 'sarah@example.com',
            avatar: '/avatars/sarah.png',
            deals_participated: 4,
            total_deals: 5,
            participation_rate: 80,
            total_deployed: 95000,
            last_activity: '5h ago',
            last_activity_desc: 'Viewed Flutterwave',
            engagement_score: 'Active',
            status: 'Verified'
        },
        {
            id: '3',
            name: 'Test Investor',
            email: 'test@example.com',
            avatar: '/avatars/test.png',
            deals_participated: 3,
            total_deals: 5,
            participation_rate: 60,
            total_deployed: 60000,
            last_activity: '1d ago',
            last_activity_desc: 'Downloaded Paystack Deck',
            engagement_score: 'Active',
            status: 'Verified'
        },
        // Inactive / Low Activity samples
        {
            id: '4',
            name: 'John Doe',
            email: 'john@example.com',
            deals_participated: 1,
            total_deals: 5,
            participation_rate: 20,
            total_deployed: 5000,
            last_activity: '45d ago',
            last_activity_desc: 'Joined Network',
            engagement_score: 'Low',
            status: 'Verified'
        },
        // Pending
        {
            id: '5',
            name: 'Jane Smith',
            email: 'jane@example.com',
            deals_participated: 0,
            total_deals: 0,
            participation_rate: 0,
            total_deployed: 0,
            last_activity: '2d ago',
            last_activity_desc: 'Requested to Join',
            engagement_score: 'Unknown',
            status: 'Pending'
        }
    ];

    // Simple sorting/filtering logic (mocked)
    let filteredMembers = members;
    if (filter === 'active') filteredMembers = members.filter(m => m.engagement_score === 'Active' || m.engagement_score === 'High');
    if (filter === 'pending') filteredMembers = members.filter(m => m.status === 'Pending');

    return NextResponse.json({ data: filteredMembers });
}
