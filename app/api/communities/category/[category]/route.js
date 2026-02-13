import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { verifyToken } from '@/lib/jwt';

/**
 * @swagger
 * /api/communities/category/{category}:
 *   get:
 *     summary: Get communities by category
 *     tags: [Communities]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: category
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
export async function GET(request, { params }) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { category } = params;
    const supabase = createAdminClient();

    const { data: communities, error } = await supabase
      .from('communities')
      .select('*')
      .eq('category', category)
      .order('member_count', { ascending: false });

    if (error) {
      console.error('Error fetching communities by category:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch communities' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: communities
    });
  } catch (error) {
    console.error('Error in GET /api/communities/category/[category]:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}