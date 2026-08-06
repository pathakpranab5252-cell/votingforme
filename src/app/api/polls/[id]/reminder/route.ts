import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { sendVotingInvitation } from '@/lib/email/resend';

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

    // Fetch poll details
    const { data: poll, error: pollError } = await supabase
      .from('polls')
      .select('*')
      .eq('id', pollId)
      .eq('creator_id', user.id)
      .single();

    if (pollError || !poll) {
      return NextResponse.json({ error: 'Poll not found' }, { status: 404 });
    }

    // Fetch un-voted voters
    const { data: voters, error: votersError } = await supabase
      .from('voters')
      .select('*')
      .eq('poll_id', pollId)
      .eq('has_voted', false);

    if (votersError || !voters || voters.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No pending voters to send reminders to.',
        email_status: {
          sent: 0,
          total: 0,
          has_api_key: Boolean(process.env.RESEND_API_KEY),
          error: null,
        },
      });
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const emailPromises = voters.map((voter: any) =>
      sendVotingInvitation(voter.email, {
        voterName: voter.name,
        pollTitle: poll.title,
        pollDescription: poll.description,
        votingLink: `${baseUrl}/vote/${voter.token}`,
        closingTime: poll.end_time ? new Date(poll.end_time).toLocaleString() : undefined,
      }).then(async (result) => {
        if (result.success) {
          await supabase
            .from('voters')
            .update({ reminder_sent: true })
            .eq('id', voter.id);
        }
        return result;
      })
    );

    const emailResults = await Promise.allSettled(emailPromises);
    const sentCount = emailResults.filter((r) => r.status === 'fulfilled' && (r.value as any).success).length;
    const firstResult = emailResults[0]?.status === 'fulfilled' ? (emailResults[0].value as any) : null;

    const emailStatus = {
      sent: sentCount,
      total: emailResults.length,
      has_api_key: Boolean(process.env.RESEND_API_KEY),
      error: firstResult?.error ? (firstResult.error.message || JSON.stringify(firstResult.error)) : null,
    };

    return NextResponse.json({
      success: true,
      message: `Sent reminders to ${sentCount}/${voters.length} voters.`,
      email_status: emailStatus,
    });
  } catch (error: any) {
    console.error('Reminder error:', error);
    return NextResponse.json({ error: error.message || 'Failed to send reminders' }, { status: 500 });
  }
}
