import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    try {
        // 1. Fetch existing tasks
        let { data: tasks, error } = await supabase
            .from('tasks')
            .select('*')
            .neq('status', 'completed')
            .order('priority', { ascending: false }) // Urgent first
            .order('due_date', { ascending: true }); // Soonest first

        if (error) {
            // If table doesn't exist yet, return empty list gracefully
            if (error.code === '42P01') {
                console.warn('Tasks table does not exist yet.');
                return NextResponse.json({ data: [] });
            }
            throw error;
        }

        // 2. Lazy Generation (Demo Logic)
        // If no tasks exist, generate some based on active deals to make the dashboard look alive
        if (!tasks || tasks.length === 0) {
            const { data: activeDeals } = await supabase
                .from('deals')
                .select('*, company:companies(name)')
                .in('stage', ['due_diligence', 'negotiation'])
                .limit(3);

            if (activeDeals && activeDeals.length > 0) {
                const newTasks = [];

                // Generate a "Call" task
                if (activeDeals[0]) {
                    newTasks.push({
                        title: `Call with ${activeDeals[0].company.name} Founders`,
                        type: 'call',
                        due_date: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
                        priority: 'high',
                        entity_id: activeDeals[0].id,
                        entity_type: 'deal',
                        status: 'pending'
                    });
                }

                // Generate a "Review" task
                if (activeDeals[1]) {
                    newTasks.push({
                        title: `Review Term Sheet: ${activeDeals[1].company.name}`,
                        type: 'review',
                        due_date: new Date(Date.now() + 172800000).toISOString(), // +2 days
                        priority: 'urgent',
                        entity_id: activeDeals[1].id,
                        entity_type: 'deal',
                        status: 'pending'
                    });
                }

                // Generate an "Invite" task
                newTasks.push({
                    title: `Invited to new network deal: Apex Africa`,
                    type: 'invite',
                    due_date: new Date().toISOString(),
                    priority: 'medium',
                    entity_type: 'syndicate',
                    status: 'pending'
                });

                // Insert them
                if (newTasks.length > 0) {
                    const { data: inserted } = await supabase
                        .from('tasks')
                        .insert(newTasks)
                        .select();

                    if (inserted) tasks = inserted;
                }
            } else {
                // Fallback if no deals exist either
                const defaultTasks = [
                    {
                        title: 'Complete Investment Profile',
                        type: 'review',
                        priority: 'high',
                        due_date: new Date().toISOString(),
                        status: 'pending'
                    }
                ];
                const { data: inserted } = await supabase.from('tasks').insert(defaultTasks).select();
                if (inserted) tasks = inserted;
            }
        }

        return NextResponse.json({ data: tasks });

    } catch (error: any) {
        console.error('Tasks API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
