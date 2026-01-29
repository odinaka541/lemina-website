
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Service role for demo access (bypassing RLS for seamless prototype experience)
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
    try {
        const { data, error } = await supabase
            .from('syndicate_members')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching members:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ data });
    } catch (err) {
        console.error('Unexpected error:', err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, role, capacity } = body;

        // Backend Validation
        if (!name || !email) {
            return NextResponse.json({ error: 'Name and Email are required' }, { status: 400 });
        }

        const { data, error } = await supabase
            .from('syndicate_members')
            .insert({
                name,
                email,
                role: role || 'LP',
                investment_capacity: capacity ? parseFloat(capacity) : 0,
                status: 'pending', // Default to pending invoke
                avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`
            })
            .select()
            .single();

        if (error) {
            console.error('Error creating member:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ data });

    } catch (err) {
        console.error('Server error:', err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
