'use client';

import { useState, useEffect, useRef } from 'react';
import { Problem, Submission } from '@/types';
import { CodeEditor } from '@/components/code-editor/CodeEditor';
import { ProblemDescription } from './ProblemDescription';
import { SubmissionResults } from './SubmissionResults';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@clerk/nextjs';

interface ProblemWithStarterCode extends Problem {
  starter_code_js: string;
  starter_code_py: string;
  starter_code_java: string;
  starter_code_cpp: string;
  test_cases?: any[];
}

interface ProblemSolverProps {
  problem: ProblemWithStarterCode;
  userSubmissions: Submission[];
  user: { id: string | null };
}

// Add a type for test cases if not present
interface TestCase {
  input: string;
  expectedOutput: string;
}

export function ProblemSolver({ problem, userSubmissions, user }: ProblemSolverProps) {
  const typedProblem = problem as ProblemWithStarterCode;
  const [loading, setLoading] = useState(false);
  const [runResult, setRunResult] = useState<any>(null);
  const { toast } = useToast();
  const { getToken } = useAuth();
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState(typedProblem.starter_code_js);
  const [testCases, setTestCases] = useState<any[]>(typedProblem.test_cases || []);
  const [activeTab, setActiveTab] = useState('testcases');
  const [pendingSubmission, setPendingSubmission] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null);
  const latestCodeRef = useRef(code);
  const latestLanguageRef = useRef(language);
  const latestUserIdRef = useRef(user.id);
  const [submissions, setSubmissions] = useState<Submission[]>(userSubmissions);
  const [activeLeftTab, setActiveLeftTab] = useState('description');
  const starterCodeKey = `starter_code_${language === 'cpp' ? 'cpp' : language}` as keyof ProblemWithStarterCode;
  const starterCodeRef = useRef(typedProblem[starterCodeKey] as string);

  // Keep local submissions in sync if userSubmissions changes (e.g. on problem change)
  useEffect(() => {
    setSubmissions(userSubmissions);
  }, [userSubmissions]);

  useEffect(() => {
    const languageKey = `starter_code_${language === 'cpp' ? 'cpp' : language}` as keyof ProblemWithStarterCode;
    const starter = typedProblem[languageKey] as string;
    setCode(starter);
    starterCodeRef.current = starter;
    latestCodeRef.current = starter;
  }, [problem.id, language, typedProblem]);

  useEffect(() => {
    setTestCases(typedProblem.test_cases || []);
  }, [typedProblem]);

  useEffect(() => {
    setLanguage('javascript'); // Reset language to default when problem changes
  }, [problem.id]);

  useEffect(() => {
    latestCodeRef.current = code;
    latestLanguageRef.current = language;
    latestUserIdRef.current = user.id;
  }, [code, language, user.id]);

  // --- Block navigation until submission is successful ---
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (pendingSubmission) {
        e.preventDefault();
        e.returnValue = '';
        toast({
          title: 'Submission in progress',
          description: 'Please wait until your code is submitted before leaving.',
          variant: 'default',
        });
        return '';
      }
      // If not pending, allow navigation
      return undefined;
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [pendingSubmission, toast]);

  // --- Auto-submit on attempted leave if not already submitted ---
  // Move autoSubmit out of useEffect so it can be called from paste handler
  const autoSubmit = async (reason: string) => {
    console.log(`[AutoSubmit] Called with reason: ${reason}`);
    console.log('[AutoSubmit] Checking conditions:', {
      pendingSubmission,
      userId: latestUserIdRef.current,
      problemId: problem.id
    });
    if (
      !pendingSubmission &&
      latestUserIdRef.current &&
      problem.id
    ) {
      console.log('[AutoSubmit] Submitting code...');
      // [DEBUG] console.log('[AutoSubmit] [SUBMIT] Attempting submission with:', {
      //   problemId: problem.id,
      //   code: latestCodeRef.current,
      //   language: latestLanguageRef.current
      // });
      setPendingSubmission(true);
      toast({
        title: 'Auto-submitting',
        description: `Submitting your code... (${reason})`,
        variant: 'default',
      });
      try {
        const token = await getToken();
        const response = await fetch('/api/submissions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            problemId: problem.id,
            code: latestCodeRef.current || '',
            language: latestLanguageRef.current || 'javascript',
            autoSubmitted: true,
            submittedAt: new Date().toISOString(),
          }),
        });
        const result = await response.json();
        // [DEBUG] console.log('[AutoSubmit] Response:', response.status, result);
        if (response.ok) {
          setSubmissionSuccess(true);
          setActiveLeftTab('submissions');
          toast({
            title: 'Auto-submitted!',
            description: 'Your code was submitted.',
            variant: 'default',
          });
        } else {
          toast({
            title: 'Auto-submission failed',
            description: typeof result.error === 'string' ? result.error : JSON.stringify(result.error),
            variant: 'destructive',
          });
        }
      } catch (error) {
        // [DEBUG] console.log('[AutoSubmit] Error:', error);
        toast({
          title: 'Auto-submission error',
          description: error instanceof Error ? error.message : JSON.stringify(error),
          variant: 'destructive',
        });
      } finally {
        setPendingSubmission(false);
      }
    }
  };

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        console.log('[Tab Switch] Detected');
        autoSubmit('tab switch').catch(err => console.error('[Error]:', err));
      }
    };

    const handleBlur = () => {
      console.log('[App Switch] Window blur');
      autoSubmit('app switch').catch(err => console.error('[Error]:', err));
    };

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      autoSubmit('page close').catch(err => console.error('[Error]:', err));
      if (pendingSubmission) {
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
      return undefined;
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [problem.id, submissionSuccess, pendingSubmission, toast]);

  // Poll for submission updates
  useEffect(() => {
    const pollSubmissions = async () => {
      try {
        const token = await getToken();
        const response = await fetch(`/api/submissions?problemId=${problem.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setSubmissions(data.submissions || []);
        }
      } catch (error) {
        console.error('Error polling submissions:', error);
      }
    };

    // Initial load
    pollSubmissions();

    // Set up polling interval (every 2 seconds)
    const interval = setInterval(pollSubmissions, 2000);
    setPollingInterval(interval);

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [problem.id]);

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [pollingInterval]);

  // Reset submissionSuccess when problem or code changes
  useEffect(() => {
    setSubmissionSuccess(false);
  }, [problem.id]);

  const handleRun = async (code: string, language: string) => {
    setLoading(true);
    setRunResult(null);
    // Switch to output tab when execution starts
    setActiveTab('output');

    try {
      let body: any = { code, language, problem_id: problem.id };
      if (Array.isArray(testCases) && testCases.length > 0) {
        body.testCases = testCases;
      } else {
        body.input = problem.sample_input;
      }
      const response = await fetch('/api/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const result = await response.json();
      setRunResult(result);
      if (response.ok) {
        toast({
          title: 'Code executed successfully',
          description: Array.isArray(result.results)
            ? `${result.results.filter((r: any) => r.passed).length} / ${result.results.length} test cases passed.`
            : `Status: ${result.status}`,
        });
      } else {
        throw new Error(typeof result.error === 'string' ? result.error : JSON.stringify(result.error));
      }
    } catch (error) {
      toast({
        title: 'Execution failed',
        description: error instanceof Error ? error.message : JSON.stringify(error),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (code: string, language: string) => {
    if (!user.id) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to submit your solution',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    setRunResult(null);
    // Switch to output tab when submission starts
    setActiveTab('output');
    // Switch to submissions tab on the left after submission
    setActiveLeftTab('submissions');

    try {
      const token = await getToken();
      const response = await fetch('/api/submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          problemId: problem.id,
          code,
          language,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        toast({
          title: result.status === 'Accepted' ? 'Solution Accepted!' : 'Solution Submitted',
          description: result.status === 'Accepted'
            ? 'Congratulations! Your solution passed all test cases.'
            : `Status: ${result.status}`,
          variant: result.status === 'Accepted' ? 'default' : 'destructive',
        });

        // Update the result to show submission details
        setRunResult({
          status: result.status,
          runtime: result.runtime,
          memory: result.memory,
          error: result.error,
          isSubmission: true
        });
        setActiveLeftTab('submissions');

        // Force immediate refresh of submissions
        const refreshToken = await getToken();
        const refreshResponse = await fetch(`/api/submissions?problemId=${problem.id}`, {
          headers: {
            'Authorization': `Bearer ${refreshToken}`,
          },
        });
        if (refreshResponse.ok) {
          const data = await refreshResponse.json();
          const newSubmissions = data.submissions || [];
          // Replace all submissions with fresh data from server
          setSubmissions(newSubmissions);
        }
      } else {
        throw new Error(typeof result.error === 'string' ? result.error : JSON.stringify(result.error || 'Submission failed'));
      }
    } catch (error) {
      toast({
        title: 'Submission failed',
        description: error instanceof Error ? error.message : JSON.stringify(error),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    latestCodeRef.current = newCode;
  };

  return (
    <div className="flex-1 overflow-hidden p-4">
      <ResizablePanelGroup direction="horizontal" className="h-full gap-4">
        <ResizablePanel defaultSize={35} minSize={30}>
          <div className="h-full flex flex-col bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <Tabs value={activeLeftTab} onValueChange={setActiveLeftTab} className="flex-1 flex flex-col min-h-0">
              <TabsList className="grid w-full grid-cols-2 flex-shrink-0 rounded-none border-b border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800">
                <TabsTrigger value="description" className="rounded-none data-[state=active]:bg-gray-200 dark:data-[state=active]:bg-gray-700">Description</TabsTrigger>
                <TabsTrigger value="submissions" className="rounded-none data-[state=active]:bg-gray-200 dark:data-[state=active]:bg-gray-700">Submissions</TabsTrigger>
              </TabsList>

              <TabsContent value="description" className="flex-1 overflow-y-auto min-h-0 data-[state=inactive]:hidden">
                <div className="h-full">
                  <ProblemDescription problem={problem} />
                </div>
              </TabsContent>

              <TabsContent value="submissions" className="flex-1 overflow-y-auto min-h-0 data-[state=inactive]:hidden">
                <div className="h-full">
                  <SubmissionResults submissions={submissions} loading={loading} />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </ResizablePanel>

        <ResizableHandle />

        <ResizablePanel defaultSize={65} minSize={30}>
          <div className="h-full flex flex-col bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <ResizablePanelGroup direction="vertical" className="h-full">
              {/* Code Editor Section */}
              <ResizablePanel defaultSize={60} minSize={30}>
                <div className="h-full p-4">
                  <div className="h-full bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <CodeEditor
                      onSubmit={handleSubmit}
                      onRun={handleRun}
                      loading={loading}
                      initialCode={{
                        javascript: typedProblem.starter_code_js,
                        python: typedProblem.starter_code_py,
                        java: typedProblem.starter_code_java,
                        cpp: typedProblem.starter_code_cpp,
                      }}
                      problemId={problem.id}
                      onCodeChange={handleCodeChange}
                      onPasteAutoSubmit={() => autoSubmit('paste')}
                    />
                  </div>
                </div>
              </ResizablePanel>

              <ResizableHandle />

              {/* Results Section */}
              <ResizablePanel defaultSize={40} minSize={20}>
                <div className="h-full bg-gray-50 dark:bg-gray-800 flex flex-col">
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
                    <div className="bg-background border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
                      <TabsList className="grid w-full grid-cols-2 h-10 rounded-none border-b-0 bg-gray-100 dark:bg-gray-800">
                        <TabsTrigger value="testcases" className="rounded-none data-[state=active]:bg-gray-200 dark:data-[state=active]:bg-gray-700">Test Cases</TabsTrigger>
                        <TabsTrigger value="output" className="flex items-center gap-2 rounded-none data-[state=active]:bg-gray-200 dark:data-[state=active]:bg-gray-700">
                          Output
                          {loading && <Loader2 className="h-3 w-3 animate-spin" />}
                        </TabsTrigger>
                      </TabsList>
                    </div>

                    <TabsContent value="testcases" className="flex-1 overflow-y-auto p-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-medium">Available Test Cases:</span>
                          <span className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                            {testCases.length} test cases
                          </span>
                        </div>

                        <div className="space-y-2">
                          {testCases.length > 0 ? (
                            testCases.map((testCase: any, idx: number) => (
                              <div key={idx} className="p-3 rounded-lg text-xs border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="font-medium">Test Case {idx + 1}</span>
                                  <span className="px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                                    Sample
                                  </span>
                                </div>
                                <div>
                                  <div><span className="font-medium">Input:</span> <code className="bg-muted px-1 rounded break-all">{testCase.input || 'N/A'}</code></div>
                                  <div><span className="font-medium">Expected Output:</span> <code className="bg-muted px-1 rounded break-all">{testCase.expected_output || 'N/A'}</code></div>
                                  {testCase.is_hidden && (
                                    <div className="text-orange-600 dark:text-orange-400 text-xs">
                                      ⚠️ Hidden test case
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="text-center text-muted-foreground text-sm py-8">
                              {loading ? 'Loading test cases...' : 'No test cases available'}
                            </div>
                          )}
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="output" className="flex-1 overflow-y-auto p-4">
                      <div className="space-y-3">
                        {loading ? (
                          <div className="flex flex-col items-center justify-center py-8 space-y-4">
                            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                            <div className="text-center">
                              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Executing your code...</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">Please wait while we run your solution</p>
                            </div>
                          </div>
                        ) : runResult && Array.isArray(runResult?.results) ? (
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-sm font-medium">Test Case Results:</span>
                              <span className={`px-2 py-1 rounded text-xs ${runResult.results.filter((r: any) => r.passed).length === runResult.results.length
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                }`}>
                                {runResult.results.filter((r: any) => r.passed).length} / {runResult.results.length} passed
                              </span>
                            </div>
                            <div className="space-y-2">
                              {runResult.results.map((res: any, idx: number) => (
                                <div key={idx} className={`p-3 rounded-lg text-xs border shadow-sm ${res.passed
                                    ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800'
                                    : 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'
                                  }`}>
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="font-medium">Test Case {idx + 1}</span>
                                    <span className={`px-2 py-0.5 rounded text-xs ${res.passed
                                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                      }`}>
                                      {res.passed ? 'PASSED' : 'FAILED'}
                                    </span>
                                  </div>
                                  <div className="grid grid-cols-1 gap-1 text-xs">
                                    <div><span className="font-medium">Input:</span> <code className="bg-muted px-1 rounded break-all">{res.input}</code></div>
                                    <div><span className="font-medium">Expected:</span> <code className="bg-muted px-1 rounded break-all">{res.expectedOutput}</code></div>
                                    <div><span className="font-medium">Actual:</span> <code className="bg-muted px-1 rounded break-all">{res.actualOutput}</code></div>
                                    {res.stderr && <div><span className="font-medium">Error:</span> <code className="bg-red-100 px-1 rounded text-red-800 break-all">{res.stderr}</code></div>}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : runResult && !Array.isArray(runResult?.results) ? (
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-sm font-medium">Execution Result:</span>
                              <span className={`px-2 py-1 rounded text-xs ${runResult.status === 'Accepted'
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                }`}>
                                {runResult.status}
                              </span>
                            </div>
                            <div className="p-3 rounded-lg text-xs border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm">
                              <div className="grid grid-cols-2 gap-2 text-xs">
                                <div><span className="font-medium">Runtime:</span> {runResult.time || runResult.runtime}ms</div>
                                <div><span className="font-medium">Memory:</span> {runResult.memory}KB</div>
                              </div>
                              {runResult.stdout && (
                                <div className="mt-2">
                                  <span className="font-medium">Output:</span> <code className="bg-muted px-1 rounded break-all">{runResult.stdout}</code>
                                </div>
                              )}
                              {runResult.stderr && (
                                <div className="mt-2">
                                  <span className="font-medium">Error:</span> <code className="bg-red-100 px-1 rounded text-red-800 break-all">{runResult.stderr}</code>
                                </div>
                              )}
                              {runResult.compile_output && (
                                <div className="mt-2">
                                  <span className="font-medium">Compiler Output:</span> <code className="bg-muted px-1 rounded break-all">{runResult.compile_output}</code>
                                </div>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="text-center text-muted-foreground text-sm py-8">
                            Run your code to see execution results
                          </div>
                        )}
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}