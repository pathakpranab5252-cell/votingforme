import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET /api/polls/[id] - Get single poll with candidates, voter stats
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const { data: poll, error: pollError } = await supabase
      .from('polls')
      .select('*')
      .eq('id', id)
      .eq('creator_id', user.id)
      .single();

    if (pollError || !poll) {
      return NextResponse.json({ error: 'Poll not found' }, { status: 404 });
    }

    // Get candidates
    const { data: candidates } = await supabase
      .from('candidates')
      .select('*')
      .eq('poll_id', id)
      .order('display_order');

    // Get voter stats
    const { data: voters } = await supabase
      .from('voters')
      .select('id, has_voted, voted_for, email_sent')
      .eq('poll_id', id);

    const totalVoters = voters?.length ?? 0;
    const votedCount = voters?.filter(v => v.has_voted).length ?? 0;
    const emailsSent = voters?.filter(v => v.email_sent).length ?? 0;

    // Get vote counts per candidate
    const voteCounts: Record<string, number> = {};
    (voters || []).forEach(v => {
      if (v.voted_for) {
        voteCounts[v.voted_for] = (voteCounts[v.voted_for] || 0) + 1;
      }
    });

    const candidatesWithVotes = (candidates || []).map(c => ({
      ...c,
      votes: voteCounts[c.id] || 0,
    }));

    return NextResponse.json({
      poll,
      candidates: candidatesWithVotes,
      stats: {
        total_voters: totalVoters,
        voted: votedCount,
        pending: totalVoters - votedCount,
        emails_sent: emailsSent,
        participation_rate: totalVoters > 0 ? Math.round((votedCount / totalVoters) * 100) : 0,
      },
    });
  } catch (error: any) {
    console.error('Fetch poll error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

// PUT /api/polls/[id] - Update poll (title, description, close poll, etc.)
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    // Verify ownership
    const { data: existing } = await supabase
      .from('polls')
      .select('creator_id')
      .eq('id', id)
      .single();

    if (!existing || existing.creator_id !== user.id) {
      return NextResponse.json({ error: 'Poll not found' }, { status: 404 });
    }

    const allowedFields = ['title', 'description', 'status', 'end_time', 'auto_publish_results'];
    const updates: any = {};
    allowedFields.forEach(field => {
      if (body[field] !== undefined) updates[field] = body[field];
    });

    const { data: poll, error } = await supabase
      .from('polls')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    // Log activity
    await supabase.from('activity_log').insert({
      entity_type: 'poll',
      entity_id: id,
      action: 'poll_updated',
      actor_id: user.id,
      metadata: { updated_fields: Object.keys(updates) },
    });

    return NextResponse.json({ poll });
  } catch (error: any) {
    console.error('Update poll error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
