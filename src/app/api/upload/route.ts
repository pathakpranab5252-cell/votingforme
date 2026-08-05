import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { parseVotersFile } from '@/lib/csv/parser';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const pollId = formData.get('poll_id') as string;

    if (!file || !pollId) {
      return NextResponse.json({ error: 'File and poll_id are required' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ];
    if (!allowedTypes.includes(file.type) && !file.name.match(/\.(csv|xls|xlsx)$/i)) {
      return NextResponse.json({ error: 'Invalid file type. Please upload CSV, XLS, or XLSX.' }, { status: 400 });
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large. Maximum 5MB allowed.' }, { status: 400 });
    }

    // Verify poll ownership
    const { data: poll, error: pollError } = await supabase
      .from('polls')
      .select('id, creator_id')
      .eq('id', pollId)
      .single();

    if (pollError || !poll || poll.creator_id !== user.id) {
      return NextResponse.json({ error: 'Poll not found or access denied' }, { status: 404 });
    }

    // Parse the file
    const buffer = Buffer.from(await file.arrayBuffer());
    const parsedVoters = await parseVotersFile(buffer);

    const validVoters = parsedVoters.filter(v => v.valid);
    const invalidVoters = parsedVoters.filter(v => !v.valid);

    // Check user credits
    const { data: userData } = await supabase
      .from('users')
      .select('credits')
      .eq('id', user.id)
      .single();

    const availableCredits = userData?.credits ?? 0;
    const creditsNeeded = validVoters.length;
    const hasEnoughCredits = availableCredits >= creditsNeeded;

    return NextResponse.json({
      summary: {
        total: parsedVoters.length,
        valid: validVoters.length,
        invalid: invalidVoters.length,
        credits_available: availableCredits,
        credits_needed: creditsNeeded,
        has_enough_credits: hasEnoughCredits,
      },
      voters: parsedVoters,
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: error.message || 'Failed to process file' }, { status: 500 });
  }
}
