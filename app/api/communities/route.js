import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { verifyToken } from '@/lib/jwt';

/**
 * @swagger
 * /api/communities:
 *   get:
 *     summary: Get all communities
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
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching communities:', error);
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
    console.error('Error in GET /api/communities:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/communities:
 *   post:
 *     summary: Create a new community
 *     tags: [Communities]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - category
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *               avatarUrl:
 *                 type: string
 *               bannerUrl:
 *                 type: string
 *     responses:
 *       201:
 *         description: Community created
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
    const { name, description, category, avatarUrl, bannerUrl } = body;

    if (!name || !description || !category) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    const { data: community, error } = await supabase
      .from('communities')
      .insert([
        {
          name,
          description,
          category,
          avatar_url: avatarUrl,
          banner_url: bannerUrl,
          member_count: 0,
          is_featured: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Error creating community:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to create community' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, data: community },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error in POST /api/communities:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}