import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { supabaseServer } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await currentUser();

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Upsert user data
        const { error } = await supabaseServer
            .from('users')
            .upsert({
                id: userId,
                email: user.emailAddresses[0]?.emailAddress || '',
                username: user.username || user.firstName || 'Anonymous',
                full_name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Anonymous User',
                image_url: user.imageUrl || '',
                updated_at: new Date().toISOString(),
            }, {
                onConflict: 'id'
            });

        if (error) {
            console.error('Error syncing user:', error);
            return NextResponse.json(
                { error: 'Failed to sync user data' },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error in POST /api/users/sync:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
