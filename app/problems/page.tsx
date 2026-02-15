import { supabaseServer } from '@/lib/supabase/server';
import { ProblemList } from '@/components/problem-list/ProblemList';
import { auth } from '@clerk/nextjs/server';

export default async function ProblemsPage() {
  const { userId } = await auth();
  
  let problems = [];
  let userProgress = {};
  let bookmarks: string[] = [];
  let errorMessage: string | null = null;

  try {
    // Check environment variables
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Missing Supabase environment variables. Please check your .env.local file.');
    }

    const { data: problemsData, error: problemsError } = await supabaseServer
      .from('problems')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (problemsError) {
      throw new Error(`Database error: ${problemsError.message}`);
    }
    
    problems = problemsData || [];

    if (userId) {
      try {
        const { data: progressData } = await supabaseServer
          .from('user_progress')
          .select('problem_id, status')
          .eq('user_id', userId);

        const { data: bookmarkData } = await supabaseServer
          .from('bookmarks')
          .select('problem_id')
          .eq('user_id', userId);

        userProgress = progressData?.reduce((acc, p) => ({
          ...acc,
          [p.problem_id]: p.status
        }), {}) || {};

        bookmarks = bookmarkData?.map(b => b.problem_id) || [];
      } catch (userError) {
        console.warn('Error fetching user data:', userError);
        // Continue without user-specific data
      }
    }
  } catch (error) {
    console.error('Error fetching problems:', error);
    errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    problems = [];
    userProgress = {};
    bookmarks = [];
  }

  if (errorMessage) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gradient-to-br dark:from-gray-900 dark:via-black dark:to-gray-800">
        <div className="w-full px-6 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-800 rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold text-red-700 dark:text-red-400 mb-2">🚨 Missing Database Configuration</h2>
              <p className="text-gray-700 dark:text-neutral-300 mb-4">{errorMessage}</p>
              
              <div className="text-left text-sm text-gray-600 dark:text-neutral-400 space-y-4">
                <div className="bg-gray-100 dark:bg-gray-800/50 rounded-lg p-4">
                  <h3 className="font-semibold text-green-700 dark:text-green-400 mb-2">⚡ 2-Minute Fix:</h3>
                  <ol className="space-y-2 text-sm">
                    <li><strong>1.</strong> Create file: <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">d:\editor\.env.local</code></li>
                    <li><strong>2.</strong> Add these 3 lines (replace with your values):</li>
                  </ol>
                  <pre className="bg-white dark:bg-gray-900 p-3 rounded text-xs overflow-x-auto mt-2 border border-gray-300 dark:border-gray-600">
{`NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-actual-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-actual-service-key`}
                  </pre>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Get values from: Supabase Dashboard → Settings → API</p>
                </div>
                
                <div className="bg-yellow-100 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-800 rounded-lg p-3">
                  <h4 className="font-semibold text-yellow-700 dark:text-yellow-400 mb-1">📊 Database Setup:</h4>
                  <p className="text-xs">Run these SQL scripts in Supabase SQL Editor:</p>
                  <ol className="text-xs space-y-1 mt-1">
                    <li>1. <code>supabase_schema.sql</code></li>
                    <li>2. <code>seed_complete.sql</code></li>
                  </ol>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-100 dark:bg-blue-900/20 border border-blue-300 dark:border-blue-800 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-400 mb-2">🧪 Test Connection</h3>
              <p className="text-gray-700 dark:text-neutral-300 mb-2">After setup, visit:</p>
              <a href="/api/test-problems" className="text-blue-600 dark:text-blue-400 underline">/api/test-problems</a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gradient-to-br dark:from-gray-900 dark:via-black dark:to-gray-800">
      <div className="w-full px-6 py-12">
        <h1 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-neutral-100">Problems</h1>
        <p className="text-gray-700 dark:text-neutral-400 mb-8 text-base">Sharpen your skills by solving coding problems.</p>
        
        {problems.length === 0 && !errorMessage ? (
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-yellow-100 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-yellow-700 dark:text-yellow-400 mb-2">No Problems Found</h2>
              <p className="text-gray-700 dark:text-neutral-300 mb-4">The database is set up but contains no problems.</p>
              <div className="text-left text-sm text-gray-600 dark:text-neutral-400 space-y-2">
                <h3 className="font-semibold text-gray-900 dark:text-neutral-200">To add sample problems:</h3>
                <div className="space-y-1">
                  <div className="flex items-start">
                    <span className="text-gray-600 dark:text-neutral-400 mr-2">1.</span>
                    <span>Run the seed script: <code className="bg-gray-200 dark:bg-gray-800 px-2 py-1 rounded">seed_complete.sql</code></span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-gray-600 dark:text-neutral-400 mr-2">2.</span>
                    <span>Refresh this page</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <ProblemList 
            problems={problems || []}
            userProgress={userProgress}
            bookmarks={bookmarks}
          />
        )}
      </div>
    </div>
  );
}