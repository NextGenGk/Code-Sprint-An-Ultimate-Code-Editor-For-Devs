import axios from 'axios';

const JUDGE0_API_URL = process.env.JUDGE0_API_URL || 'http://localhost:2358';
const JUDGE0_API_KEY = process.env.JUDGE0_API_KEY;

export const judge0Client = axios.create({
  baseURL: JUDGE0_API_URL,
  headers: {
    'Content-Type': 'application/json',
    ...(JUDGE0_API_KEY && { 'X-RapidAPI-Key': JUDGE0_API_KEY })
  }
});

export const LANGUAGE_IDS = {
  javascript: 63,
  python: 71,
  java: 62,
  cpp: 54
};

export interface ExecutionResult {
  token: string;
  status: {
    id: number;
    description: string;
  };
  stdout?: string;
  stderr?: string;
  compile_output?: string;
  time?: string;
  memory?: number;
}

export async function executeCode(
  code: string,
  language: keyof typeof LANGUAGE_IDS,
  input?: string
): Promise<string> {
  try {
    const payload = {
      source_code: code,
      language_id: LANGUAGE_IDS[language],
      stdin: input || '',
      wait: false  // Don't wait, we'll poll for results
    };
    
    console.log('Submitting to Judge0:', { language, language_id: LANGUAGE_IDS[language], has_input: !!input });
    
    const response = await judge0Client.post('/submissions', payload);

    return response.data.token;
  } catch (error) {
    console.error('Judge0 submission error:', error);
    if (error instanceof Error) {
      console.error('Submission error details:', {
        message: error.message,
        // @ts-ignore
        response: error.response?.data,
        // @ts-ignore
        status: error.response?.status
      });
    }
    throw error;
  }
}

export async function getSubmissionResult(token: string): Promise<ExecutionResult> {
  try {
    // Try with minimal query params first
    const response = await judge0Client.get(`/submissions/${token}`, {
      params: {
        base64_encoded: 'false',
        fields: '*'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Judge0 get result error:', error);
    // Log more details about the error
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        // @ts-ignore
        response: error.response?.data,
        // @ts-ignore
        status: error.response?.status
      });
    }
    throw error;
  }
}