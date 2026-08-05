import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { sendVoteReceipt } from '@/lib/email/resend';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    const { token, candidate_id } = body;

    if (!token || !candidate_id) {
      return NextResponse.json({ error: 'Token and candidate_id are required' }, { status: 400 });
    }

    // Lookup voter by token
    const { data: voter, error: voterError } = await supabase
      .from('voters')
      .select('*, polls(id, title, status)')
      .eq('token', token)
      .single();

    if (voterError || !voter) {
      return NextResponse.json({ error: 'Invalid or expired voting link' }, { status: 404 });
    }

    // Guard: already voted
    if (voter.has_voted) {
      return NextResponse.json({ error: 'You have already cast your vote' }, { status: 409 });
    }

    // Guard: poll must be open
    const poll = (voter as any).polls;
    if (!poll || poll.status !== 'voting_open') {
      return NextResponse.json({ error: 'This election is not currently accepting votes' }, { status: 403 });
    }

    // Validate candidate belongs to this poll
    const { data: candidate, error: candError } = await supabase
      .from('candidates')
      .select('id, name, poll_id')
      .eq('id', candidate_id)
      .eq('poll_id', voter.poll_id)
      .single();

    if (candError || !candidate) {
      return NextResponse.json({ error: 'Invalid candidate for this election' }, { status: 400 });
    }

    // Record the vote
    const { error: updateError } = await supabase
      .from('voters')
      .update({
        has_voted: true,
        voted_at: new Date().toISOString(),
        voted_for: candidate_id,
      })
      .eq('id', voter.id);

    if (updateError) throw updateError;

    // Log activity
    await supabase.from('activity_log').insert({
      entity_type: 'vote',
      entity_id: voter.poll_id,
      action: 'vote_cast',
      metadata: { voter_id: voter.id, candidate_id },
    });

    // Send receipt email (non-blocking)
    sendVoteReceipt(voter.email, poll.title, candidate.name).catch(console.error);

    return NextResponse.json({
      success: true,
      message: 'Your vote has been recorded successfully',
      candidate_name: candidate.name,
    });
  } catch (error: any) {
    console.error('Vote error:', error);
    return NextResponse.json({ error: error.message || 'Failed to record vote' }, { status: 500 });
  }
}

// GET: Fetch poll data for a voter by token (public, no auth required)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 });
    }

    const supabase = await createClient();

    const { data: voter, error: voterError } = await supabase
      .from('voters')
      .select('id, name, email, has_voted, poll_id')
      .eq('token', token)
      .single();

    if (voterError || !voter) {
      return NextResponse.json({ error: 'Invalid voting link' }, { status: 404 });
    }

    // Fetch poll details and candidates
    const { data: poll } = await supabase
      .from('polls')
      .select('id, title, description, status, end_time')
      .eq('id', voter.poll_id)
      .single();

    const { data: candidates } = await supabase
      .from('candidates')
      .select('id, name, description, photo_url')
      .eq('poll_id', voter.poll_id)
      .order('display_order', { ascending: true });

    return NextResponse.json({
      voter: {
        name: voter.name,
        has_voted: voter.has_voted,
      },
      poll,
      candidates,
    });
  } catch (error: any) {
    console.error('Fetch vote data error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
