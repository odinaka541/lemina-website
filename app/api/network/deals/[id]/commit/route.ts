import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { amount } = body;

        // Mock processing delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Return success
        return NextResponse.json({
            success: true,
            message: `Successfully committed $${amount.toLocaleString()}`,
            data: {
                amount,
                timestamp: new Date().toISOString()
            }
        });
    } catch (e) {
        return NextResponse.json({ error: 'Failed to process commitment' }, { status: 500 });
    }
}
