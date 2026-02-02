
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Service role for demo access
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Helper to get a valid user ID for the demo
// In production, this would strictly use supabase.auth.getUser()
// Helper to get a valid user ID for the demo
async function getDemoUserId() {
    // 1. Try to find any existing profile
    const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .limit(1)
        .maybeSingle();

    if (profile) return profile.id;

    // 2. If no profile, find ANY user from Auth to create a profile for
    const { data: { users }, error } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1 });

    if (users && users.length > 0) {
        return users[0].id;
    }

    // 3. Last resort fallback (Likely to fail FK constraints, but prevents crash)
    return '00000000-0000-0000-0000-000000000000';
}

export async function GET() {
    try {
        const userId = await getDemoUserId();

        let { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (error || !data) {
            // Return default Structure if no profile found (or if using fallback ID)
            return NextResponse.json({
                data: {
                    full_name: 'Odinaka Eze',
                    job_title: 'Investment Partner',
                    company_name: 'Lemina Capital',
                    bio: 'Building the future of African fintech.',
                    email_notifications: true
                }
            });
        }

        return NextResponse.json({ data });
    } catch (err) {
        console.error('Profile fetch error:', err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const userId = await getDemoUserId();



        // Upsert profile for the demo user
        const { data, error } = await supabase
            .from('profiles')
            .upsert({
                id: userId,
                ...body,
                updated_at: new Date().toISOString()
            })
            .select()
            .single();

        if (error) {
            console.error('API: Profile update FAILED:', error);
            console.error('API: Error Details:', JSON.stringify(error, null, 2));
            return NextResponse.json({
                error: error.message,
                details: error
            }, { status: 500 });
        }


        return NextResponse.json({ data });

    } catch (err) {
        console.error('API: Profile update SERVER ERROR:', err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
