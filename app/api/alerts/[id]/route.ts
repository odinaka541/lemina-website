
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

export async function DELETE(
    request: Request,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    try {
        const userId = await getDemoUserId();
        const { error } = await supabase
            .from('alerts')
            .delete()
            .eq('id', params.id)
            .eq('user_id', userId);

        if (error) {
            console.error('Alert delete error:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error('Alert delete server error:', err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PATCH(
    request: Request,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    try {
        const body = await request.json();

        const userId = await getDemoUserId();

        const { data, error } = await supabase
            .from('alerts')
            .update({ ...body, updated_at: new Date().toISOString() })
            .eq('id', params.id)
            .eq('user_id', userId)
            .select()
            .single();

        if (error) {
            console.error('Alert update error:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ data });
    } catch (err) {
        console.error('Alert update server error:', err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
