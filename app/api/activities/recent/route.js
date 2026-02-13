import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { verifyToken } from '@/lib/jwt';

/**
 * @swagger
 * /api/activities/recent:
 *   get:
 *     summary: Get recent activities
 *     tags: [Activities]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
export async function GET(request) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const supabase = createAdminClient();

    const { data: activities, error } = await supabase
      .from('activities')
      .select(`
        *,
        user:users!activities_user_id_fkey(id, username, display_name, avatar_url)
      `)
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Error fetching recent activities:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch recent activities' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: activities
    });
  } catch (error) {
    console.error('Error in GET /api/activities/recent:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}