import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { verifyToken } from '@/lib/jwt';

/**
 * @swagger
 * /api/members:
 *   get:
 *     summary: Get all members
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
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching members:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch members' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: members
    });
  } catch (error) {
    console.error('Error in GET /api/members:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/members:
 *   post:
 *     summary: Add member to community
 *     tags: [Members]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - communityId
 *             properties:
 *               communityId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Member added
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
export async function POST(request) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { communityId } = body;

    if (!communityId) {
      return NextResponse.json(
        { success: false, error: 'Community ID is required' },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    const { data: member, error } = await supabase
      .from('community_members')
      .insert([
        {
          community_id: communityId,
          user_id: decoded.userId,
          joined_at: new Date().toISOString(),
          role: 'member'
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Error adding member:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to add member' },
        { status: 500 }
      );
    }

    const { error: updateError } = await supabase.rpc('increment_member_count', {
      community_id: communityId
    });

    if (updateError) {
      console.error('Error updating member count:', updateError);
    }

    return NextResponse.json(
      { success: true, data: member },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error in POST /api/members:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}