import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get('limit') || '100');
        const offset = parseInt(searchParams.get('offset') || '0');

        // Fetch leaderboard data from the view
        const { data: leaderboard, error } = await supabaseServer
            .from('leaderboard_stats')
            .select('*')
            .range(offset, offset + limit - 1);

        if (error) {
            console.error('Error fetching leaderboard:', error);
            return NextResponse.json(
                { error: 'Failed to fetch leaderboard data' },
                { status: 500 }
            );
        }

        // Add rank to each entry
        const rankedLeaderboard = leaderboard?.map((entry, index) => ({
            ...entry,
            rank: offset + index + 1,
        })) || [];

        return NextResponse.json({
            leaderboard: rankedLeaderboard,
            total: rankedLeaderboard.length
        });
    } catch (error) {
        console.error('Error in GET /api/leaderboard:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
