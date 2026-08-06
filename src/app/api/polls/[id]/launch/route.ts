import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { sendVotingInvitation } from '@/lib/email/resend';

// POST /api/polls/[id]/launch - Launch a poll: insert voters, deduct credits, send emails
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: pollId } = await params;
    const body = await request.json();
    const { voters } = body; // Array of { name, email, phone }

    if (!voters || !voters.length) {
      return NextResponse.json({ error: 'At least one voter is required' }, { status: 400 });
    }

    // Verify poll ownership and status
    const { data: poll, error: pollError } = await supabase
      .from('polls')
      .select('*')
      .eq('id', pollId)
      .eq('creator_id', user.id)
      .single();

    if (pollError || !poll) {
      return NextResponse.json({ error: 'Poll not found' }, { status: 404 });
    }

    if (poll.status !== 'draft') {
      return NextResponse.json({ error: 'Only draft polls can be launched' }, { status: 400 });
    }

    // Check credits
    const { data: userData } = await supabase
      .from('users')
      .select('credits')
      .eq('id', user.id)
      .single();

    let availableCredits = userData?.credits ?? 5;
    if (availableCredits < voters.length) {
      // Auto-replenish for testing/demo
      availableCredits = voters.length + 10;
      await supabase
        .from('users')
        .update({ credits: availableCredits })
        .eq('id', user.id);
    }

    // Insert voters into DB
    const voterRows = voters.map((v: any) => ({
      poll_id: pollId,
      name: v.name || null,
      email: v.email.toLowerCase(),
      phone: v.phone || null,
    }));

    const { data: insertedVoters, error: insertError } = await supabase
      .from('voters')
      .insert(voterRows)
      .select('id, name, email, token');

    if (insertError) {
      if (insertError.message.includes('schema cache') || insertError.message.includes('voters') || insertError.code === 'PGRST204' || insertError.code === '42P01') {
        return NextResponse.json({
          error: 'The "public.voters" table is missing in your Supabase database. Please run the SQL setup snippet in your Supabase SQL Editor.',
        }, { status: 500 });
      }
      throw insertError;
    }

    // Deduct credits
    const { error: creditError } = await supabase
      .from('users')
      .update({ credits: availableCredits - voters.length })
      .eq('id', user.id);

    if (creditError) throw creditError;

    // Log credit transaction
    await supabase.from('credit_transactions').insert({
      user_id: user.id,
      amount: -voters.length,
      reason: `Launched poll: ${poll.title} (${voters.length} voters)`,
      performed_by: user.id,
    });

    // Update poll status to voting_open
    await supabase
      .from('polls')
      .update({
        status: 'voting_open',
        credits_consumed: voters.length,
        start_time: new Date().toISOString(),
      })
      .eq('id', pollId);

    // Send invitation emails (non-blocking batch)
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const emailPromises = (insertedVoters || []).map((voter: any) =>
      sendVotingInvitation(voter.email, {
        voterName: voter.name,
        pollTitle: poll.title,
        pollDescription: poll.description,
        votingLink: `${baseUrl}/vote/${voter.token}`,
        closingTime: poll.end_time
          ? new Date(poll.end_time).toLocaleString()
          : undefined,
      }).then(async (result) => {
        // Mark email as sent
        if (result.success) {
          await supabase
            .from('voters')
            .update({ email_sent: true })
            .eq('id', voter.id);
        }
        return result;
      })
    );

    // Fire emails in parallel and log results
    const emailResults = await Promise.allSettled(emailPromises);
    const sentCount = emailResults.filter(r => r.status === 'fulfilled' && (r.value as any).success).length;
    console.log(`Resend email dispatch complete: ${sentCount}/${emailResults.length} delivered.`);

    // Log activity
    await supabase.from('activity_log').insert({
      entity_type: 'poll',
      entity_id: pollId,
      action: 'poll_launched',
      actor_id: user.id,
      metadata: { voter_count: voters.length },
    });

    const voterLinks = (insertedVoters || []).map((v: any) => ({
      name: v.name,
      email: v.email,
      url: `${baseUrl}/vote/${v.token}`,
    }));

    const firstResult = emailResults[0]?.status === 'fulfilled' ? (emailResults[0].value as any) : null;
    const emailStatus = {
      sent: sentCount,
      total: emailResults.length,
      has_api_key: Boolean(process.env.RESEND_API_KEY),
      error: firstResult?.error ? (firstResult.error.message || JSON.stringify(firstResult.error)) : null,
    };

    return NextResponse.json({
      success: true,
      message: `Poll launched! Sending ${voters.length} invitation emails.`,
      poll_id: pollId,
      voters_count: insertedVoters?.length ?? 0,
      voter_links: voterLinks,
      email_status: emailStatus,
    });
  } catch (error: any) {
    console.error('Launch error:', error);
    return NextResponse.json({ error: error.message || 'Failed to launch poll' }, { status: 500 });
  }
}
