import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';
import { executeCode, getSubmissionResult } from '@/lib/judge0/client';
import { auth } from '@clerk/nextjs/server';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { problemId, code, language } = await request.json();

    // Validate required fields (code can be empty for auto-submit)
    if (!problemId || !language) {
      return NextResponse.json(
        { error: 'Missing required fields: problemId or language' },
        { status: 400 }
      );
    }

    // If code is empty, treat it as an empty submission
    const submissionCode = code || '';

    // Get problem and test cases
    const { data: problem } = await supabaseServer
      .from('problems')
      .select('*')
      .eq('id', problemId)
      .single();

    const { data: testCases } = await supabaseServer
      .from('test_cases')
      .select('*')
      .eq('problem_id', problemId);

    if (!problem || !testCases) {
      return NextResponse.json({ error: 'Problem not found' }, { status: 404 });
    }

    // Create submission record
    const { data: submission, error: submissionError } = await supabaseServer
      .from('submissions')
      .insert({
        user_id: userId,
        problem_id: problemId,
        code: submissionCode,
        language,
        status: 'Pending'
      })
      .select()
      .single();

    if (submissionError || !submission) {
      console.error('Failed to create submission:', submissionError);
      return NextResponse.json(
        { error: 'Failed to create submission record' },
        { status: 500 }
      );
    }

    // Execute code against test cases
    let allPassed = true;
    let totalTime = 0;
    let maxMemory = 0;
    let errorMessage = '';

    for (const testCase of testCases) {
      try {
        const token = await executeCode(submissionCode, language, testCase.input);
        let result = await getSubmissionResult(token);

        // Poll for result
        let attempts = 0;
        while (result.status.id <= 2 && attempts < 10) {
          await new Promise(resolve => setTimeout(resolve, 500));
          result = await getSubmissionResult(token);
          attempts++;
        }

        if (result.status.id !== 3) { // Not accepted
          allPassed = false;
          errorMessage = result.stderr || result.compile_output || 'Runtime error';
          break;
        }

        if (result.stdout?.trim() !== testCase.expected_output.trim()) {
          allPassed = false;
          errorMessage = 'Wrong Answer';
          break;
        }

        totalTime += parseFloat(result.time || '0');
        maxMemory = Math.max(maxMemory, result.memory || 0);

      } catch (err) {
        allPassed = false;
        errorMessage = err instanceof Error ? err.message : JSON.stringify(err);
        console.error('Test case execution error:', err);
        break;
      }
    }

    // Update submission
    const status = allPassed ? 'Accepted' : 'Wrong Answer';
    const { error: updateError } = await supabaseServer
      .from('submissions')
      .update({
        status,
        runtime: Math.round(totalTime * 1000),
        memory_usage: maxMemory,
        error_message: errorMessage || null
      })
      .eq('id', submission.id);

    if (updateError) {
      console.error('Failed to update submission:', updateError);
      // Continue execution even if update fails, but log the error
    }

    // Update user progress
    const { error: progressError } = await supabaseServer
      .from('user_progress')
      .upsert({
        user_id: userId,
        problem_id: problemId,
        status: allPassed ? 'Solved' : 'Attempted',
        attempts: 1,
        last_attempt_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,problem_id'
      });

    if (progressError) {
      console.error('Failed to update user progress:', progressError);
      // Continue execution even if progress update fails, but log the error
    }

    return NextResponse.json({
      submissionId: submission.id,
      status,
      runtime: Math.round(totalTime * 1000),
      memory: maxMemory,
      error: errorMessage || null
    });

  } catch (error) {
    console.error('Submission error:', error);

    // Provide more specific error messages based on the error type
    let errorMessage = 'Failed to process submission';
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'object' && error !== null) {
      errorMessage = JSON.stringify(error);
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const problemId = searchParams.get('problemId');

    if (!problemId) {
      return NextResponse.json(
        { error: 'Missing required parameter: problemId' },
        { status: 400 }
      );
    }

    // Fetch submissions for the current user and problem
    const { data: submissions, error } = await supabaseServer
      .from('submissions')
      .select('*')
      .eq('user_id', userId)
      .eq('problem_id', problemId)
      .order('submitted_at', { ascending: false });

    if (error) {
      console.error('Error fetching submissions:', error);
      return NextResponse.json(
        { error: 'Failed to fetch submissions' },
        { status: 500 }
      );
    }

    return NextResponse.json({ submissions });
  } catch (error) {
    console.error('Error in GET /api/submissions:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}