import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    // Use Service Role Key to bypass RLS for demo
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    try {
        const body = await request.json();
        const { dealId, newStage, newOrderIndex } = body;

        if (!dealId || !newStage) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Logic:
        // 1. Update the deal's stage.
        // 2. We are *not* implementing complex reordering logic (shifting other items) on the server yet for simplicity.
        //    We assume the frontend sets 'order_index' correctly or we just update the stage.
        //    For a robust Kanban, you'd typically handle "shifting" indices here or use a floating point 'lexorank'.
        //    For this MVC, we will just update the stage and the provided index.

        const { data, error } = await supabase
            .from('deals')
            .update({
                stage: newStage,
                order_index: newOrderIndex,
                updated_at: new Date().toISOString()
            })
            .eq('id', dealId)
            .select()
            .single();

        if (error) {
            console.error('Supabase update error:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        // Opt: Log activity here in 'activities' table?
        // Let's keep it simple for now.

        // Log Activity
        await supabase.from('activities').insert({
            type: 'stage_change',
            title: 'Deal Stage Updated',
            description: `Moved deal to ${newStage}`,
            entity_type: 'deal',
            entity_id: dealId,
            metadata: { old_stage: 'unknown', new_stage: newStage }
        });

        return NextResponse.json({ data });

    } catch (err) {
        console.error('Update stage error:', err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
