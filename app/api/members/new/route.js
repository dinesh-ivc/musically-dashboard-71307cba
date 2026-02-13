import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { verifyToken } from '@/lib/jwt';

/**
 * @swagger
 * /api/members/new:
 *   get:
 *     summary: Get new members
 *     tags: [Members]
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

    const { data: members, error } = await supabase
      .from('users')
      .select('id, username, display_name, avatar_url, handle, created_at')
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Error fetching new members:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch new members' },
        { status: 500 }
      );
    }

    const membersWithJoinTime = members.map(member => ({
      ...member,
      joined_at: member.created_at
    }));

    return NextResponse.json({
      success: true,
      data: membersWithJoinTime
    });
  } catch (error) {
    console.error('Error in GET /api/members/new:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}