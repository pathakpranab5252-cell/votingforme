import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    
    // Ensure user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, start_time, end_time, auto_publish_results, candidates, voting_type, max_selections } = body;

    if (!title || !candidates || candidates.length < 2) {
      return NextResponse.json(
        { error: 'Missing required fields: title and at least 2 candidates' },
        { status: 400 }
      );
    }

    // Ensure user profile exists in public.users to satisfy foreign key & RLS constraints
    const { data: existingProfile } = await supabase
      .from('users')
      .select('id')
      .eq('id', user.id)
      .maybeSingle();

    if (!existingProfile) {
      await supabase
        .from('users')
        .upsert({
          id: user.id,
          email: user.email || '',
          full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
          credits: 5,
          role: 'poll_creator',
        });
    }
    const insertPayload: any = {
      creator_id: user.id,
      title,
      description,
      voting_type: voting_type || 'single_choice',
      max_selections: max_selections || 1,
      start_time,
      end_time,
      auto_publish_results,
      status: 'draft',
    };

    let { data: poll, error: pollError } = await supabase
      .from('polls')
      .insert(insertPayload)
      .select()
      .single();

    // Fallback retry if columns voting_type / max_selections are missing in user Supabase project
    if (pollError && (pollError.message.includes('column') || pollError.code === 'PGRST204' || pollError.message.includes('voting_type'))) {
      console.warn('Voting type columns missing in Supabase, retrying with base columns...');
      delete insertPayload.voting_type;
      delete insertPayload.max_selections;

      const retry = await supabase
        .from('polls')
        .insert(insertPayload)
        .select()
        .single();

      poll = retry.data;
      pollError = retry.error;
    }

    if (pollError) throw pollError;

    // Insert Candidates
    const candidatesToInsert = candidates.map((c: any, index: number) => ({
      poll_id: poll.id,
      name: c.name,
      description: c.description,
      display_order: index,
    }));

    const { error: candidatesError } = await supabase
      .from('candidates')
      .insert(candidatesToInsert);

    if (candidatesError) throw candidatesError;

    return NextResponse.json({ poll }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating poll:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: polls, error } = await supabase
      .from('polls')
      .select('*, candidates(id), voters(id)')
      .eq('creator_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ polls });
  } catch (error: any) {
    console.error('Error fetching polls:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
