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
    const { title, description, start_time, end_time, auto_publish_results, candidates } = body;

    if (!title || !candidates || candidates.length < 2) {
      return NextResponse.json(
        { error: 'Missing required fields: title and at least 2 candidates' },
        { status: 400 }
      );
    }

    // Insert Poll
    const { data: poll, error: pollError } = await supabase
      .from('polls')
      .insert({
        creator_id: user.id,
        title,
        description,
        start_time,
        end_time,
        auto_publish_results,
        status: 'draft',
      })
      .select()
      .single();

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
      .select('*, candidates(count), voters(count)')
      .eq('creator_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ polls });
  } catch (error: any) {
    console.error('Error fetching polls:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
