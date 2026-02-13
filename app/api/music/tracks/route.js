import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { verifyToken } from '@/lib/jwt';

/**
 * @swagger
 * /api/music/tracks:
 *   get:
 *     summary: Get music tracks
 *     tags: [Music]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
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

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50', 10);

    const supabase = createAdminClient();

    const { data: tracks, error } = await supabase
      .from('music_tracks')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching tracks:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch tracks' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: tracks
    });
  } catch (error) {
    console.error('Error in GET /api/music/tracks:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/music/tracks:
 *   post:
 *     summary: Create a new track
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
 *               - title
 *               - artist
 *               - duration
 *             properties:
 *               title:
 *                 type: string
 *               artist:
 *                 type: string
 *               album:
 *                 type: string
 *               duration:
 *                 type: integer
 *               audioUrl:
 *                 type: string
 *               coverUrl:
 *                 type: string
 *     responses:
 *       201:
 *         description: Track created
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
    const { title, artist, album, duration, audioUrl, coverUrl } = body;

    if (!title || !artist || !duration) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    const { data: track, error } = await supabase
      .from('music_tracks')
      .insert([
        {
          title,
          artist,
          album,
          duration,
          audio_url: audioUrl,
          cover_url: coverUrl,
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Error creating track:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to create track' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, data: track },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error in POST /api/music/tracks:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}