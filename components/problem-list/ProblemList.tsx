'use client';

import { useState } from 'react';
import { Problem } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, BookmarkCheck, Clock } from 'lucide-react';
import Link from 'next/link';

interface ProblemListProps {
  problems: Problem[];
  userProgress?: Record<string, 'Attempted' | 'Solved'>;
  bookmarks?: string[];
}

export function ProblemList({ problems, userProgress = {}, bookmarks = [] }: ProblemListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const filteredProblems = problems.filter(problem => {
    const matchesSearch = problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         problem.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = difficultyFilter === 'all' || problem.difficulty === difficultyFilter;
    const matchesCategory = categoryFilter === 'all' || problem.category === categoryFilter;
    
    return matchesSearch && matchesDifficulty && matchesCategory;
  });

  const categories = [...new Set(problems.map(p => p.category))];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Hard': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'Solved': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Attempted': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default: return '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500 dark:text-gray-400" />
          <Input
            placeholder="Search problems..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm border-gray-200/60 dark:border-gray-700/60 text-gray-900 dark:text-white placeholder:text-gray-600 dark:placeholder:text-gray-400 shadow-sm focus:ring-blue-500/20"
          />
        </div>
        
        <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
          <SelectTrigger className="w-full sm:w-40 bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm border-gray-200/60 dark:border-gray-700/60 text-gray-900 dark:text-white shadow-sm hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors">
            <SelectValue placeholder="Difficulty" />
          </SelectTrigger>
          <SelectContent className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border-gray-200/60 dark:border-gray-700/60 shadow-xl">
            <SelectItem value="all" className="text-gray-900 dark:text-white hover:bg-blue-50 dark:hover:bg-gray-700 cursor-pointer">All Difficulties</SelectItem>
            <SelectItem value="Easy" className="text-gray-900 dark:text-white hover:bg-blue-50 dark:hover:bg-gray-700 cursor-pointer">Easy</SelectItem>
            <SelectItem value="Medium" className="text-gray-900 dark:text-white hover:bg-blue-50 dark:hover:bg-gray-700 cursor-pointer">Medium</SelectItem>
            <SelectItem value="Hard" className="text-gray-900 dark:text-white hover:bg-blue-50 dark:hover:bg-gray-700 cursor-pointer">Hard</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-40 bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm border-gray-200/60 dark:border-gray-700/60 text-gray-900 dark:text-white shadow-sm hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border-gray-200/60 dark:border-gray-700/60 shadow-xl">
            <SelectItem value="all" className="text-gray-900 dark:text-white hover:bg-blue-50 dark:hover:bg-gray-700 cursor-pointer">All Categories</SelectItem>
            {categories.map(category => (
              <SelectItem key={category} value={category} className="text-gray-900 dark:text-white hover:bg-blue-50 dark:hover:bg-gray-700 cursor-pointer">
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Three-Column Problem Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProblems.map((problem) => (
          <Card key={problem.id} className="group relative overflow-hidden bg-white/80 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 backdrop-blur-sm border border-gray-200/60 dark:border-gray-700/60 hover:border-blue-500/30 dark:hover:border-blue-500/50 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 dark:hover:shadow-blue-500/10 transition-all duration-300 transform hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-purple-50/50 dark:from-blue-500/5 dark:via-transparent dark:to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <CardHeader className="relative pb-3">
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg font-bold leading-tight text-gray-900 dark:text-white">
                  <Link 
                    href={`/problems/${problem.id}`}
                    className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-2"
                  >
                    {problem.title}
                  </Link>
                </CardTitle>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {bookmarks.includes(problem.id) && (
                    <BookmarkCheck className="w-5 h-5 text-yellow-500 dark:text-yellow-400" />
                  )}
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="relative space-y-4">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge className={getDifficultyColor(problem.difficulty) + ' border-none px-2.5 py-0.5 text-xs font-semibold shadow-sm'}>
                  {problem.difficulty}
                </Badge>
                <Badge variant="outline" className="border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/50 px-2.5 py-0.5 text-xs font-medium">
                  {problem.category}
                </Badge>
              </div>
              
              <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3 leading-relaxed">
                {problem.description}
              </p>
              
              <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700/50">
                <div className="flex items-center gap-2">
                  {userProgress[problem.id] && (
                    <Badge className={getStatusColor(userProgress[problem.id]) + ' border-none text-[10px] px-2 py-0.5 uppercase tracking-wide font-bold shadow-sm'}>
                      {userProgress[problem.id]}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-3 text-xs font-medium text-gray-600 dark:text-gray-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {problem.time_limit}ms
                  </span>
                  <span className="flex items-center gap-1">
                    <div className="w-3 h-3 flex items-center justify-center">💾</div> {problem.memory_limit}MB
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProblems.length === 0 && (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            {problems.length === 0 ? (
              <>
                <div className="mb-4">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-neutral-100">No Problems Available</h3>
                <p className="text-gray-600 dark:text-neutral-400 mb-4">
                  The database appears to be empty. Please run the seed script to populate sample problems.
                </p>
                <div className="space-y-2 text-sm text-gray-500 dark:text-neutral-500">
                  <p>1. Run the SQL schema: <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">supabase_schema.sql</code></p>
                  <p>2. Run the seed data: <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">seed_complete.sql</code></p>
                  <p>3. Refresh this page</p>
                </div>
              </>
            ) : (
              <p className="text-muted-foreground">No problems found matching your criteria.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}