import { UserProfile } from '@clerk/nextjs';
import { auth, currentUser } from '@clerk/nextjs/server';
import { supabaseServer } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, Target, Clock, Calendar, User, Mail, CalendarDays } from 'lucide-react';
import Image from 'next/image';

export default async function ProfilePage() {
  const { userId } = await auth();
  const user = await currentUser();
  
  let userStats = {
    totalProblems: 0,
    solvedProblems: 0,
    attemptedProblems: 0,
    totalSubmissions: 0,
    successRate: 0,
    joinDate: new Date().toLocaleDateString()
  };

  try {
    if (userId) {
      // Get user progress statistics
      const { data: progressData } = await supabaseServer
        .from('user_progress')
        .select('*')
        .eq('user_id', userId);

      // Get total problems count
      const { count: totalProblems } = await supabaseServer
        .from('problems')
        .select('*', { count: 'exact', head: true });

      if (progressData) {
        const solved = progressData.filter(p => p.status === 'Solved').length;
        const attempted = progressData.length;
        const successRate = attempted > 0 ? Math.round((solved / attempted) * 100) : 0;

        userStats = {
          totalProblems: totalProblems || 0,
          solvedProblems: solved,
          attemptedProblems: attempted,
          totalSubmissions: progressData.length,
          successRate,
          joinDate: user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : new Date().toLocaleDateString()
        };
      }
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
  }

  // Redirect if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gradient-to-br dark:from-gray-900 dark:via-black dark:to-gray-800 flex items-center justify-center">
        <div className="text-center text-gray-900 dark:text-white">
          <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
          <p className="text-gray-600 dark:text-gray-400">Please sign in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gradient-to-br dark:from-gray-900 dark:via-black dark:to-gray-800">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-semibold text-gray-900 dark:text-white mb-2">Profile</h1>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          {/* User Info Card */}
          <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">User Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  {user.imageUrl ? (
                    <Image
                      src={user.imageUrl}
                      alt={user.fullName || 'User avatar'}
                      width={80}
                      height={80}
                      className="rounded-full border-2 border-gray-200 dark:border-gray-700"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                      <User className="h-8 w-8 text-gray-500 dark:text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {user.fullName || 'Anonymous User'}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 flex items-center mt-1">
                    <Mail className="h-4 w-4 mr-2" />
                    {user.emailAddresses[0]?.emailAddress || 'No email provided'}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 flex items-center mt-1">
                    <CalendarDays className="h-4 w-4 mr-2" />
                    Member since {userStats.joinDate}
                  </p>
                </div>
                <div className="text-right">
                  <Badge className="bg-green-600 text-white">Active</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
              <CardContent className="p-6 text-center">
                <Trophy className="h-8 w-8 text-blue-500 dark:text-blue-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{userStats.solvedProblems}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Solved</p>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
              <CardContent className="p-6 text-center">
                <Target className="h-8 w-8 text-green-500 dark:text-green-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{userStats.successRate}%</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Success Rate</p>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
              <CardContent className="p-6 text-center">
                <Clock className="h-8 w-8 text-yellow-500 dark:text-yellow-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{userStats.attemptedProblems}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Attempted</p>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
              <CardContent className="p-6 text-center">
                <Calendar className="h-8 w-8 text-purple-500 dark:text-purple-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{userStats.totalSubmissions}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Submissions</p>
              </CardContent>
            </Card>
          </div>

          {/* Progress */}
          <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">Progress Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-700 dark:text-gray-300">Problems Solved</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {userStats.solvedProblems} / {userStats.totalProblems}
                  </span>
                </div>
                <Progress 
                  value={(userStats.solvedProblems / Math.max(userStats.totalProblems, 1)) * 100} 
                  className="h-2 bg-gray-200 dark:bg-gray-800"
                />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-700 dark:text-gray-300">Problems Attempted</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {userStats.attemptedProblems} / {userStats.totalProblems}
                  </span>
                </div>
                <Progress 
                  value={(userStats.attemptedProblems / Math.max(userStats.totalProblems, 1)) * 100} 
                  className="h-2 bg-gray-200 dark:bg-gray-700"
                />
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              {userStats.totalSubmissions > 0 ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Trophy className="h-5 w-5 text-blue-500 dark:text-blue-400" />
                      <span className="text-gray-900 dark:text-white">Solved {userStats.solvedProblems} problems</span>
                    </div>
                    <Badge className="bg-blue-600 text-white">Latest</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Target className="h-5 w-5 text-green-500 dark:text-green-400" />
                      <span className="text-gray-900 dark:text-white">Achieved {userStats.successRate}% success rate</span>
                    </div>
                    <Badge className="bg-green-600 text-white">Achievement</Badge>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Trophy className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">No activity yet. Start solving problems to see your progress!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 