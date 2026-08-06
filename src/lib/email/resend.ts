import { Resend } from 'resend';

const resendKey = process.env.RESEND_API_KEY || '';
const resend = new Resend(resendKey);
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'VotingForMe <onboarding@resend.dev>';

export interface InvitationEmailProps {
  voterName?: string;
  pollTitle: string;
  pollDescription?: string;
  votingLink: string;
  closingTime?: string;
}

export async function sendVotingInvitation(to: string, props: InvitationEmailProps) {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.warn('RESEND_API_KEY environment variable is not defined.');
      return {
        success: false,
        error: { message: 'RESEND_API_KEY is not configured in Vercel Environment Variables.' },
      };
    }

    const resend = new Resend(apiKey);
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'VotingForMe <onboarding@resend.dev>';

    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to,
      subject: `Invitation to Vote: ${props.pollTitle}`,
      html: `
        <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
          <h2 style="color: #4F46E5;">VotingForMe</h2>
          <h3>You've been invited to vote!</h3>
          <p>Hi ${props.voterName || 'there'},</p>
          <p>You are eligible to vote in: <strong>${props.pollTitle}</strong></p>
          ${props.pollDescription ? `<p style="color: #666;">${props.pollDescription}</p>` : ''}
          
          <div style="margin: 30px 0; text-align: center;">
            <a href="${props.votingLink}" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
              Cast Your Vote
            </a>
          </div>
          
          ${props.closingTime ? `<p style="font-size: 14px; color: #666;">Voting closes on ${props.closingTime}.</p>` : ''}
          <p style="font-size: 14px; color: #666; margin-top: 30px;">
            This link is unique to you. Do not share it with anyone.<br/>
            Secure online voting powered by VotingForMe.
          </p>
        </div>
      `,
    });

    if (error) {
      console.error('Resend API Error:', error);
      return { success: false, error };
    }
    return { success: true, data };
  } catch (error: any) {
    console.error('Email sending failed:', error);
    return { success: false, error: { message: error.message || 'Email sending failed' } };
  }
}

export async function sendVoteReceipt(to: string, pollTitle: string) {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) return { success: false, error: { message: 'RESEND_API_KEY missing' } };
    const resend = new Resend(apiKey);
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'VotingForMe <onboarding@resend.dev>';

    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to,
      subject: `Vote Receipt: ${pollTitle}`,
      html: `
        <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
          <h2 style="color: #4F46E5;">VotingForMe</h2>
          <h3>Vote Confirmed! 🎉</h3>
          <p>Your vote in <strong>${pollTitle}</strong> has been securely recorded.</p>
          <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: center;">
            <p style="margin: 0; color: #10B981; font-size: 16px; font-weight: bold;">✓ Ballot Cast Successfully</p>
            <p style="margin: 5px 0 0 0; font-size: 12px; color: #64748b;">Your selection remains 100% anonymous & encrypted.</p>
          </div>
          <p style="font-size: 14px; color: #666; margin-top: 30px;">
            Thank you for participating.<br/>
            Secure online voting powered by VotingForMe.
          </p>
        </div>
      `,
    });
    return { success: !error, error, data };
  } catch (error: any) {
    return { success: false, error: { message: error.message || 'Receipt email failed' } };
  }
}
