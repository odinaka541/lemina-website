
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { PortfolioDocument } from '@/lib/types';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const { data, error } = await supabase
            .from('documents')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        return NextResponse.json(data as PortfolioDocument[]);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();

        // Validation (Industry Standard: Zod would be better, but simple check for now)
        if (!body.title || !body.type) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const { data, error } = await supabase
            .from('documents')
            .insert({
                title: body.title,
                type: body.type, // 'Contract' | 'Report' | ...
                url: body.url || '#', // In a real app, this is the Storage Public URL
                company_id: body.company_id || null,
                file_size: body.file_size || '0 KB'
            })
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json(data as PortfolioDocument);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
