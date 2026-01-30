
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { PortfolioDocument } from '@/lib/types';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const dealId = searchParams.get('dealId');
        const companyId = searchParams.get('companyId');
        const investmentId = searchParams.get('investmentId');

        let query;

        if (investmentId) {
            // Portfolio Documents
            query = supabase
                .from('portfolio_documents')
                .select('*')
                .eq('investment_id', investmentId)
                .order('created_at', { ascending: false });
        } else {
            // Deal Documents
            query = supabase
                .from('documents')
                .select('*')
                .order('created_at', { ascending: false });

            if (dealId) query = query.eq('deal_id', dealId);
            if (companyId) query = query.eq('company_id', companyId);
        }

        const { data, error } = await query;

        if (error) throw error;

        return NextResponse.json(data as PortfolioDocument[]);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();

        if (!body.title || !body.type) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        let result;

        if (body.investment_id) {
            // Insert into Portfolio Documents
            result = await supabase
                .from('portfolio_documents')
                .insert({
                    title: body.title,
                    type: body.type,
                    url: body.url || '#',
                    investment_id: body.investment_id,
                    company_id: body.company_id || null, // Fallback if available
                    file_path: body.file_path, // Required for AI analysis
                    file_name: body.file_name || body.title,
                    file_type: body.file_type || body.type, // Map 'Report' -> 'pdf' etc roughly if needed
                    file_size: body.file_size || 0,
                    analysis_status: 'pending' // Default
                })
                .select()
                .single();

            // Trigger AI if requested? Handled by caller usually.

        } else {
            // Insert into Deal Documents (Legacy)
            result = await supabase
                .from('documents')
                .insert({
                    title: body.title,
                    type: body.type,
                    url: body.url || '#',
                    company_id: body.company_id || null,
                    deal_id: body.deal_id || null, // Ensure deal_id supported if passed
                    file_size: body.file_size || '0 KB'
                })
                .select()
                .single();
        }

        if (result.error) throw result.error;

        return NextResponse.json(result.data as PortfolioDocument);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
