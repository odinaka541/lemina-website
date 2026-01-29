import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const dealId = formData.get('deal_id') as string;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // 1. Upload to Supabase Storage
        const fileExt = file.name.split('.').pop();
        const fileName = `${dealId}/${Math.random().toString(36).substring(7)}.${fileExt}`;
        const { data: uploadData, error: uploadError } = await supabase
            .storage
            .from('portfolio-docs') // Assuming bucket name from context
            .upload(fileName, file);

        if (uploadError) {
            console.error('Upload Error:', uploadError);
            return NextResponse.json({ error: uploadError.message }, { status: 500 });
        }

        // 2. Get Public URL
        const { data: { publicUrl } } = supabase
            .storage
            .from('portfolio-docs')
            .getPublicUrl(fileName);

        // 3. Insert into Documents Table
        const { data: docData, error: dbError } = await supabase
            .from('documents')
            .insert({
                title: file.name,
                type: 'Deal Document',
                url: publicUrl,
                deal_id: dealId,
                file_size: `${(file.size / 1024).toFixed(2)} KB`
            })
            .select()
            .single();

        if (dbError) {
            console.error('DB Insert Error:', dbError);
            return NextResponse.json({ error: dbError.message }, { status: 500 });
        }

        return NextResponse.json({ data: docData });

    } catch (error: any) {
        console.error('Server Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
