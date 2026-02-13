import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { verifyToken } from '@/lib/jwt';

/**
 * @swagger
 * /api/music/playlists:
 *   get:
 *     summary: Get user playlists
 *     tags: [Music]
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

    const { data: playlists, error } = await supabase
      .from('playlists')
      .select('*')
      .eq('user_id', decoded.userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching playlists:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch playlists' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: playlists
    });
  } catch (error) {
    console.error('Error in GET /api/music/playlists:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/music/playlists:
 *   post:
 *     summary: Create a new playlist
 *     tags: [Music]
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
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               isPublic:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Playlist created
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
    const { name, description, isPublic } = body;

    if (!name) {
      return NextResponse.json(
        { success: false, error: 'Playlist name is required' },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    const { data: playlist, error } = await supabase
      .from('playlists')
      .insert([
        {
          user_id: decoded.userId,
          name,
          description: description || '',
          is_public: isPublic || false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Error creating playlist:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to create playlist' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, data: playlist },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error in POST /api/music/playlists:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}