
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Helper to get a valid user ID for the demo
async function getDemoUserId() {
    const { data } = await supabase.from('profiles').select('id').limit(1).single();
    if (data) return data.id;
    return '00000000-0000-0000-0000-000000000000';
}

export async function GET() {
    try {
        const userId = await getDemoUserId();
        const { data, error } = await supabase
            .from('alerts')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Alerts fetch error:', error);
            // If table doesn't exist yet or other error, return empty array to prevent UI crash
            return NextResponse.json({ data: [] });
        }

        return NextResponse.json({ data });
    } catch (err) {
        console.error('Alerts server error:', err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const userId = await getDemoUserId();

        // Validation could go here

        const { data, error } = await supabase
            .from('alerts')
            .insert({
                user_id: userId,
                type: body.type,
                name: body.name || `${body.type} Alert`,
                condition_text: body.condition, // Simplification for demo
                condition_data: body.conditions, // JSONB structure
                channels: body.channels,
                is_active: true,
                created_at: new Date().toISOString()
            })
            .select()
            .single();

        if (error) {
            console.error('Alert create error:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ data });
    } catch (err) {
        console.error('Alert create server error:', err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
