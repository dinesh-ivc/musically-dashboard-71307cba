import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { verifyToken } from '@/lib/jwt';

/**
 * @swagger
 * /api/music/playlists/{id}:
 *   get:
 *     summary: Get playlist by ID
 *     tags: [Music]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Playlist not found
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

    const { id } = params;
    const supabase = createAdminClient();

    const { data: playlist, error } = await supabase
      .from('playlists')
      .select(`
        *,
        tracks:playlist_tracks(
          position,
          track:music_tracks(*)
        )
      `)
      .eq('id', id)
      .single();

    if (error || !playlist) {
      return NextResponse.json(
        { success: false, error: 'Playlist not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: playlist
    });
  } catch (error) {
    console.error('Error in GET /api/music/playlists/[id]:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/music/playlists/{id}:
 *   put:
 *     summary: Update playlist
 *     tags: [Music]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               isPublic:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Playlist updated
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Playlist not found
 *       500:
 *         description: Server error
 */
export async function PUT(request, { params }) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = params;
    const body = await request.json();
    const { name, description, isPublic } = body;

    const supabase = createAdminClient();

    const updateData = {
      updated_at: new Date().toISOString()
    };

    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (isPublic !== undefined) updateData.is_public = isPublic;

    const { data: playlist, error } = await supabase
      .from('playlists')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', decoded.userId)
      .select()
      .single();

    if (error || !playlist) {
      return NextResponse.json(
        { success: false, error: 'Playlist not found or unauthorized' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: playlist
    });
  } catch (error) {
    console.error('Error in PUT /api/music/playlists/[id]:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/music/playlists/{id}:
 *   delete:
 *     summary: Delete playlist
 *     tags: [Music]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Playlist deleted
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Playlist not found
 *       500:
 *         description: Server error
 */
export async function DELETE(request, { params }) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = params;
    const supabase = createAdminClient();

    const { error } = await supabase
      .from('playlists')
      .delete()
      .eq('id', id)
      .eq('user_id', decoded.userId);

    if (error) {
      console.error('Error deleting playlist:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to delete playlist' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Playlist deleted successfully'
    });
  } catch (error) {
    console.error('Error in DELETE /api/music/playlists/[id]:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}