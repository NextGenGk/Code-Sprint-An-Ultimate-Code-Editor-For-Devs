'use client';

import { useState, useEffect } from 'react';
import { LeaderboardEntry } from '@/types';
import { Trophy, Medal, Award, TrendingUp, Target, CheckCircle2, Clock, Calendar } from 'lucide-react';
import { useAuth } from '@clerk/nextjs';

export default function LeaderboardPage() {
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { userId } = useAuth();

    useEffect(() => {
        // Sync current user first
        const syncUser = async () => {
            try {
                await fetch('/api/users/sync', { method: 'POST' });
            } catch (err) {
                console.error('Failed to sync user:', err);
            }
        };

        syncUser();
    }, []);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                setLoading(true);
                const response = await fetch('/api/leaderboard');

                if (!response.ok) {
                    throw new Error('Failed to fetch leaderboard');
                }

                const data = await response.json();
                setLeaderboard(data.leaderboard || []);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();

        // Refresh every 30 seconds
        const interval = setInterval(fetchLeaderboard, 30000);

        return () => clearInterval(interval);
    }, []);

    const getRankIcon = (rank: number) => {
        switch (rank) {
            case 1:
                return <Trophy className="w-6 h-6 text-yellow-500" />;
            case 2:
                return <Medal className="w-6 h-6 text-gray-400" />;
            case 3:
                return <Award className="w-6 h-6 text-amber-600" />;
            default:
                return <span className="text-lg font-bold text-gray-500 dark:text-neutral-400">#{rank}</span>;
        }
    };

    const getRankBadgeColor = (rank: number) => {
        switch (rank) {
            case 1:
                return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white';
            case 2:
                return 'bg-gradient-to-r from-gray-300 to-gray-500 text-white';
            case 3:
                return 'bg-gradient-to-r from-amber-500 to-amber-700 text-white';
            default:
                return 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-neutral-300';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 dark:bg-gradient-to-br dark:from-gray-900 dark:via-black dark:to-gray-800 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-neutral-400">Loading leaderboard...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-100 dark:bg-gradient-to-br dark:from-gray-900 dark:via-black dark:to-gray-800 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600 dark:text-red-400 mb-4">Error: {error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gradient-to-br dark:from-gray-900 dark:via-black dark:to-gray-800">
            <div className="w-full px-6 py-12">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <Trophy className="w-12 h-12 text-yellow-500" />
                        <h1 className="text-5xl font-bold text-gray-900 dark:text-neutral-100">
                            Leaderboard
                        </h1>
                    </div>
                    <p className="text-gray-700 dark:text-neutral-400 text-lg">
                        Compete with the best coders and climb to the top!
                    </p>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10 max-w-7xl mx-auto">
                    <div className="pl-6 pr-6 pt-6 pb-6 bg-white/80 dark:bg-gray-800/50 backdrop-blur-md border border-gray-200/60 dark:border-gray-700/60 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                                <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-neutral-400">Total Participants</p>
                                <p className="text-3xl font-bold text-gray-900 dark:text-neutral-100">{leaderboard.length}</p>
                            </div>
                        </div>
                    </div>

                    <div className="pl-6 pr-6 pt-6 pb-6 bg-white/80 dark:bg-gray-800/50 backdrop-blur-md border border-gray-200/60 dark:border-gray-700/60 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                                <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-neutral-400">Total Solves</p>
                                <p className="text-3xl font-bold text-gray-900 dark:text-neutral-100">
                                    {leaderboard.reduce((sum, entry) => sum + entry.problems_solved, 0)}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="pl-6 pr-6 pt-6 pb-6 bg-white/80 dark:bg-gray-800/50 backdrop-blur-md border border-gray-200/60 dark:border-gray-700/60 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                                <Target className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-neutral-400">Total Submissions</p>
                                <p className="text-3xl font-bold text-gray-900 dark:text-neutral-100">
                                    {leaderboard.reduce((sum, entry) => sum + entry.total_submissions, 0)}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="pl-6 pr-6 pt-6 pb-6 bg-white/80 dark:bg-gray-800/50 backdrop-blur-md border border-gray-200/60 dark:border-gray-700/60 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl">
                                <Trophy className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-neutral-400">Avg Acceptance</p>
                                <p className="text-3xl font-bold text-gray-900 dark:text-neutral-100">
                                    {leaderboard.length > 0
                                        ? Math.round(
                                            leaderboard.reduce((sum, entry) => sum + entry.acceptance_rate, 0) /
                                            leaderboard.length
                                        )
                                        : 0}%
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Leaderboard Table */}
                <div className="max-w-7xl mx-auto bg-white/80 dark:bg-gray-800/50 backdrop-blur-md border border-gray-200/60 dark:border-gray-700/60 rounded-2xl shadow-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50/50 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-700">
                                <tr>
                                    <th className="px-6 py-5 text-left text-xs font-bold text-gray-600 dark:text-neutral-400 uppercase tracking-wider">Rank</th>
                                    <th className="px-6 py-5 text-left text-xs font-bold text-gray-600 dark:text-neutral-400 uppercase tracking-wider">User</th>
                                    <th className="px-6 py-5 text-center text-xs font-bold text-gray-600 dark:text-neutral-400 uppercase tracking-wider">Score</th>
                                    <th className="px-6 py-5 text-center text-xs font-bold text-gray-600 dark:text-neutral-400 uppercase tracking-wider">Solved</th>
                                    <th className="px-6 py-5 text-center text-xs font-bold text-gray-600 dark:text-neutral-400 uppercase tracking-wider">
                                        <span className="text-green-600 dark:text-green-400">Easy</span>
                                    </th>
                                    <th className="px-6 py-5 text-center text-xs font-bold text-gray-600 dark:text-neutral-400 uppercase tracking-wider">
                                        <span className="text-yellow-600 dark:text-yellow-400">Medium</span>
                                    </th>
                                    <th className="px-6 py-5 text-center text-xs font-bold text-gray-600 dark:text-neutral-400 uppercase tracking-wider">
                                        <span className="text-red-600 dark:text-red-400">Hard</span>
                                    </th>
                                    <th className="px-6 py-5 text-center text-xs font-bold text-gray-600 dark:text-neutral-400 uppercase tracking-wider">Acceptance</th>
                                    <th className="px-6 py-5 text-center text-xs font-bold text-gray-600 dark:text-neutral-400 uppercase tracking-wider">Last Active</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {leaderboard.length === 0 ? (
                                    <tr>
                                        <td colSpan={9} className="px-6 py-12 text-center text-gray-500 dark:text-neutral-400">
                                            No participants yet. Be the first to solve a problem!
                                        </td>
                                    </tr>
                                ) : (
                                    leaderboard.map((entry) => (
                                        <tr
                                            key={entry.user_id}
                                            className={`transition-colors border-b border-gray-100 dark:border-gray-700/50 last:border-0 ${entry.user_id === userId
                                                    ? 'bg-blue-50/50 dark:bg-blue-900/20'
                                                    : 'hover:bg-gray-50/80 dark:hover:bg-gray-700/30'
                                                }`}
                                        >
                                            {/* Rank */}
                                            <td className="px-6 py-4">
                                                <div className={`flex items-center justify-center w-12 h-12 rounded-full ${getRankBadgeColor(entry.rank)}`}>
                                                    {getRankIcon(entry.rank)}
                                                </div>
                                            </td>

                                            {/* User */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    {entry.image_url ? (
                                                        <img
                                                            src={entry.image_url}
                                                            alt={entry.username || entry.full_name || 'User'}
                                                            className="w-10 h-10 rounded-full border-2 border-gray-200 dark:border-gray-600"
                                                        />
                                                    ) : (
                                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                                                            {(entry.username || entry.full_name || 'U')[0].toUpperCase()}
                                                        </div>
                                                    )}
                                                    <div>
                                                        <p className="font-semibold text-gray-900 dark:text-neutral-100">
                                                            {entry.username || entry.full_name || 'Anonymous'}
                                                            {entry.user_id === userId && (
                                                                <span className="ml-2 text-xs bg-blue-600 text-white px-2 py-1 rounded-full">
                                                                    You
                                                                </span>
                                                            )}
                                                        </p>
                                                        <p className="text-sm text-gray-500 dark:text-neutral-400">{entry.email}</p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Score */}
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex items-center justify-center gap-1">
                                                    <Trophy className="w-4 h-4 text-yellow-500" />
                                                    <span className="font-bold text-lg text-gray-900 dark:text-neutral-100">
                                                        {entry.total_score}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Solved */}
                                            <td className="px-6 py-4 text-center">
                                                <span className="font-semibold text-gray-900 dark:text-neutral-100">
                                                    {entry.problems_solved}
                                                </span>
                                                <span className="text-gray-500 dark:text-neutral-400">
                                                    /{entry.problems_attempted}
                                                </span>
                                            </td>

                                            {/* Easy */}
                                            <td className="px-6 py-4 text-center">
                                                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 font-semibold">
                                                    {entry.easy_solved}
                                                </span>
                                            </td>

                                            {/* Medium */}
                                            <td className="px-6 py-4 text-center">
                                                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 font-semibold">
                                                    {entry.medium_solved}
                                                </span>
                                            </td>

                                            {/* Hard */}
                                            <td className="px-6 py-4 text-center">
                                                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 font-semibold">
                                                    {entry.hard_solved}
                                                </span>
                                            </td>

                                            {/* Acceptance Rate */}
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex flex-col items-center">
                                                    <span className="font-semibold text-gray-900 dark:text-neutral-100">
                                                        {entry.acceptance_rate.toFixed(1)}%
                                                    </span>
                                                    <span className="text-xs text-gray-500 dark:text-neutral-400">
                                                        {entry.accepted_submissions}/{entry.total_submissions}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Last Active */}
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex items-center justify-center gap-1 text-sm text-gray-500 dark:text-neutral-400">
                                                    <Clock className="w-4 h-4" />
                                                    {entry.last_submission_at
                                                        ? new Date(entry.last_submission_at).toLocaleDateString()
                                                        : 'N/A'}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Footer Note */}
                <div className="mt-8 text-center text-sm text-neutral-400 max-w-7xl mx-auto">
                    <p className="flex items-center justify-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Leaderboard updates every 30 seconds
                    </p>
                    <p className="mt-2">
                        Scoring: Easy = 1 point, Medium = 2 points, Hard = 3 points
                    </p>
                </div>
            </div>
        </div>
    );
}
