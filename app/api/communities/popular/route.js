import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { verifyToken } from '@/lib/jwt';

/**
 * @swagger
 * /api/communities/popular:
 *   get:
 *     summary: Get popular communities
 *     tags: [Communities]
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

    const { data: communities, error } = await supabase
      .from('communities')
      .select('*')
      .order('member_count', { ascending: false })
      .limit(12);

    if (error) {
      console.error('Error fetching popular communities:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch popular communities' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: communities
    });
  } catch (error) {
    console.error('Error in GET /api/communities/popular:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}