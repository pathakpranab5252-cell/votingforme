import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

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

    const { data: poll, error: pollError } = await supabase
      .from('polls')
      .update({
        status: 'closed',
        end_time: new Date().toISOString(),
      })
      .eq('id', pollId)
      .eq('creator_id', user.id)
      .select()
      .single();

    if (pollError || !poll) {
      return NextResponse.json({ error: 'Poll not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json({ success: true, poll });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to close poll' }, { status: 500 });
  }
}
