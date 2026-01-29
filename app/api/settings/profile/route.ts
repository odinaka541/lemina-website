
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Service role for demo access
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Helper to get a valid user ID for the demo
// In production, this would strictly use supabase.auth.getUser()
async function getDemoUserId() {
    // 1. Try to find any profile
    const { data } = await supabase
        .from('profiles')
        .select('id')
        .limit(1)
        .single();

    if (data) return data.id;

    // 2. Fallback (this might fail if no users exist, but better than hardcoded 000)
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
            console.error('Profile update error:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ data });

    } catch (err) {
        console.error('Profile update server error:', err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
