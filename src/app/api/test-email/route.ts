import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { sendVotingInvitation } from '@/lib/email/resend';

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const recipient = user?.email || 'pathakpranab5252@gmail.com';
    const result = await sendVotingInvitation(recipient, {
      voterName: user?.user_metadata?.full_name || 'Test Voter',
      pollTitle: 'Test Election Email Setup',
      pollDescription: 'This is a test email sent from VotingForMe to verify Resend delivery.',
      votingLink: 'https://votingforme.vercel.app',
    });

    return NextResponse.json({
      recipient,
      has_resend_api_key: Boolean(process.env.RESEND_API_KEY),
      resend_from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
      result,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Test email failed' }, { status: 500 });
  }
}
