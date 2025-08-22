import { Submission } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import React from 'react';
import { Loader2 } from 'lucide-react';

interface SubmissionResultsProps {
  submissions: Submission[];
  loading?: boolean;
}

export function SubmissionResults({ submissions, loading }: SubmissionResultsProps) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-8 space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <div className="text-center text-muted-foreground text-sm">Submitting...</div>
      </div>
    );
  }
  if (!submissions || submissions.length === 0) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No submissions yet. Submit your solution to see results here.
          </p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Accepted': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Wrong Answer': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'Time Limit Exceeded': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Memory Limit Exceeded': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'Runtime Error': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'Compilation Error': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'Pending': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-xl font-semibold">Your Submissions</h2>
      
      <div className="space-y-3">
        {submissions.map((submission, index) => (
          <Card key={`${submission.id}-${index}`}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Badge className={getStatusColor(submission.status)}>
                    {submission.status}
                  </Badge>
                  <Badge variant="outline">{submission.language}</Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(submission.submitted_at), { addSuffix: true })}
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="flex items-center gap-4 text-sm">
                {submission.runtime && (
                  <span className="text-muted-foreground">
                    Runtime: {submission.runtime}ms
                  </span>
                )}
                {submission.memory_usage && (
                  <span className="text-muted-foreground">
                    Memory: {submission.memory_usage}KB
                  </span>
                )}
              </div>
              
              {submission.error_message && (
                <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 rounded">
                  <p className="text-sm text-red-800 dark:text-red-200">
                    {submission.error_message}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}