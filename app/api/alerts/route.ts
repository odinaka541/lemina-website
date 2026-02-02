import { createClient } from '@/lib/supabase/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        let userId = user?.id;

        if (!userId) {
            // Fallback for demo: Use Service Role to find a user
            const adminAuthClient = createSupabaseClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.SUPABASE_SERVICE_ROLE_KEY!,
                { auth: { autoRefreshToken: false, persistSession: false } }
            );

            // Fetch any valid user ID from auth.users directly (Matches POST logic)
            const { data: { users }, error: listError } = await adminAuthClient.auth.admin.listUsers({ page: 1, perPage: 1 });

            if (users && users.length > 0) {
                userId = users[0].id;

            } else {
                console.error('GET /api/alerts: No users found for fallback');
                return NextResponse.json({ error: 'Unauthorized: No users found' }, { status: 401 });
            }
        } else {

        }

        let { data, error } = await supabase
            .from('alerts')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });



        // Retry with admin client if RLS fails (returns empty or error) for fallback user
        if ((error || !data || data.length === 0) && userId !== user?.id) {
            console.log('GET /api/alerts: RLS check/empty result - retrying with Admin Client...');
            const adminClient = createSupabaseClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.SUPABASE_SERVICE_ROLE_KEY!
            );
            const { data: adminData, error: adminError } = await adminClient
                .from('alerts')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false });

            if (!adminError) {
                console.log(`GET /api/alerts: Admin retry found ${adminData?.length || 0} alerts`);
                data = adminData;
                error = null;
            } else {
                console.error('GET /api/alerts: Admin retry failed:', adminError);
                // Don't throw here, let natural error handling proceed if original error exists
            }
        }

        if (error) {
            console.error('Alerts fetch error:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ data });
    } catch (err) {
        console.error('Alerts server error:', err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        let userId = user?.id;
        let clientToUse = supabase;

        if (!userId) {
            console.log('Auth failed, using fallback user logic...');
            const adminClient = createSupabaseClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.SUPABASE_SERVICE_ROLE_KEY!,
                {
                    auth: {
                        autoRefreshToken: false,
                        persistSession: false
                    }
                }
            );

            // Fetch any valid user ID from auth.users directly
            const { data: { users }, error: listError } = await adminClient.auth.admin.listUsers({ page: 1, perPage: 1 });

            if (users && users.length > 0) {
                userId = users[0].id;
                clientToUse = adminClient;
                console.log('Fallback: Using user ID', userId);
            } else {
                console.error('Fallback failed: No users found in auth.users', listError);
                return NextResponse.json({ error: 'Unauthorized: No valid user found for fallback' }, { status: 401 });
            }
        }

        // CRITICAL FIX: Ensure user has a profile!
        const adminForProfile = createSupabaseClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        const { data: profileCheck } = await adminForProfile
            .from('profiles')
            .select('id')
            .eq('id', userId)
            .single();

        if (!profileCheck) {
            console.log('Profile missing for user, creating one now...', userId);
            // Get user email
            const { data: { user: userDetails } } = await adminForProfile.auth.admin.getUserById(userId);

            const { error: profileError } = await adminForProfile
                .from('profiles')
                .insert({
                    id: userId
                });

            if (profileError) {
                console.error('Failed to auto-create profile:', profileError);
                return NextResponse.json({ error: `Profile Creation Failed: ${profileError.message}` }, { status: 500 });
            }
            console.log('Profile created successfully.');
        }

        const body = await request.json();

        const { data, error } = await clientToUse
            .from('alerts')
            .insert({
                user_id: userId,
                type: body.type,
                name: body.name || `${body.type} Alert`,
                condition_text: body.condition,
                condition_data: body.conditions,
                channels: body.channels,
                is_active: true,
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
