import { NextRequest, NextResponse } from 'next/server';
import { executeCode, getSubmissionResult } from '@/lib/judge0/client';
import { supabaseServer } from '@/lib/supabase/server';

// Helper function to preprocess Java code for Judge0
function preprocessJavaCode(code: string): string {
  // Check if the code contains a public class
  const classMatch = code.match(/public\s+class\s+(\w+)/);
  if (classMatch) {
    const className = classMatch[1];
    // If the class name is not "Main", we need to rename it
    if (className !== 'Main') {
      // Replace all occurrences of the class name with "Main"
      const regex = new RegExp(`\\b${className}\\b`, 'g');
      return code.replace(regex, 'Main');
    }
  }
  return code;
}

export async function POST(request: NextRequest) {
  try {
    const { code, language, input, testCases, problem_id } = await request.json();
    console.log('Received request:', { code, language, input, testCases, problem_id });

    if (!code || !language) {
      return NextResponse.json(
        { error: 'Code and language are required' },
        { status: 400 }
      );
    }

    // Preprocess code based on language
    let processedCode = code;
    if (language === 'java') {
      processedCode = preprocessJavaCode(code);
      console.log('Preprocessed Java code:', processedCode);
    }

    let cases = testCases;
    // If testCases not provided, fetch from Supabase using problem_id
    if ((!cases || cases.length === 0) && problem_id) {
      const { data, error } = await supabaseServer
        .from('test_cases')
        .select('input, expected_output')
        .eq('problem_id', problem_id);
      if (error) {
        console.error('Failed to fetch test cases from Supabase:', error);
        return NextResponse.json({ error: 'Failed to fetch test cases' }, { status: 500 });
      }
      cases = data || [];
      console.log('Fetched test cases from Supabase:', cases);
    }

    // If testCases is provided and is an array, run all test cases
    if (Array.isArray(cases) && cases.length > 0) {
      const results = [];
      for (const testCase of cases) {
        console.log('Sending code to Judge0:', { code: processedCode, language, input: testCase.input });
        const token = await executeCode(processedCode, language, testCase.input);
        let result = await getSubmissionResult(token);
        let attempts = 0;
        const maxAttempts = 10;
        while (result.status.id <= 2 && attempts < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, 500));
          result = await getSubmissionResult(token);
          attempts++;
        }
        console.log('Judge0 result:', result);
        results.push({
          input: testCase.input,
          expectedOutput: testCase.expected_output,
          actualOutput: result.stdout,
          passed: (result.stdout?.trim() ?? '') === (testCase.expected_output?.trim() ?? ''),
          status: result.status.description,
          stderr: result.stderr,
          compile_output: result.compile_output,
          time: result.time,
          memory: result.memory
        });
      }
      return NextResponse.json({ results });
    }

    // Fallback: single input
    console.log('Single input fallback:', { code: processedCode, language, input });
    const token = await executeCode(processedCode, language, input);
    let result = await getSubmissionResult(token);
    let attempts = 0;
    const maxAttempts = 10;
    while (result.status.id <= 2 && attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 500));
      result = await getSubmissionResult(token);
      attempts++;
    }
    console.log('Judge0 single result:', result);
    return NextResponse.json({
      status: result.status.description,
      stdout: result.stdout,
      stderr: result.stderr,
      compile_output: result.compile_output,
      time: result.time,
      memory: result.memory
    });
  } catch (error) {
    console.error('Code execution error:', error);
    return NextResponse.json(
      { error: 'Failed to execute code' },
      { status: 500 }
    );
  }
}