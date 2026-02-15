'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Home, User, Code, Moon, Sun, Trophy } from 'lucide-react';
import { useUser, UserButton } from '@clerk/nextjs';
import { useState, useEffect } from 'react';
import { useTheme } from '@/components/ThemeProvider';

export function Navbar() {
  const pathname = usePathname();
  const { user, isSignedIn, isLoaded } = useUser();
  const [mounted, setMounted] = useState(false);
  const { theme, toggleTheme } = useTheme();

  // Don't render until mounted to prevent hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {

    return (
      <nav className="border-b border-neutral-300/50 dark:border-neutral-200/20 bg-gradient-to-r from-white via-blue-50 to-white dark:from-gray-900 dark:via-black dark:to-gray-800 backdrop-blur supports-[backdrop-filter]:bg-white/95 dark:supports-[backdrop-filter]:bg-gray-900/95">
        <div className="w-full px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/logo.png"
                alt="CodeSprint Logo"
                width={32}
                height={32}
                className="h-8 w-8"
              />
              <span className="font-bold text-xl text-gray-900 dark:text-white">CodeSprint</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-4">
              <Link
                href="/"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center ${pathname === '/'
                  ? 'bg-blue-100 text-blue-700 dark:bg-gray-800 dark:text-white'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:text-gray-200 dark:hover:bg-gray-800'
                  }`}
              >
                <Home className="h-4 w-4 mr-2" />
                Home
              </Link>
              <Link
                href="/problems"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center ${pathname.startsWith('/problems')
                  ? 'bg-blue-100 text-blue-700 dark:bg-gray-800 dark:text-white'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:text-gray-200 dark:hover:bg-gray-800'
                  }`}
              >
                <Code className="h-4 w-4 mr-2" />
                Problems
              </Link>
              <Link
                href="/leaderboard"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center ${pathname === '/leaderboard'
                  ? 'bg-blue-100 text-blue-700 dark:bg-gray-800 dark:text-white'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:text-gray-200 dark:hover:bg-gray-800'
                  }`}
              >
                <Trophy className="h-4 w-4 mr-2" />
                Leaderboard
              </Link>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="border-b border-neutral-300/50 dark:border-neutral-200/20 bg-gradient-to-r from-white via-blue-50 to-white dark:from-gray-900 dark:via-black dark:to-gray-800 backdrop-blur supports-[backdrop-filter]:bg-white/95 dark:supports-[backdrop-filter]:bg-gray-900/95">
      <div className="w-full px-6 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/logo.png"
              alt="CodeSprint Logo"
              width={32}
              height={32}
              className="h-8 w-8"
            />
            <span className="font-bold text-xl text-gray-900 dark:text-white">CodeSprint</span>
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          <button
            aria-label="Toggle theme"
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors border border-gray-300 dark:border-gray-600"
          >
            {theme === 'dark' ? <Sun className="h-5 w-5 text-yellow-400" /> : <Moon className="h-5 w-5 text-blue-600" />}
          </button>
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center ${pathname === '/'
                ? 'bg-blue-100 text-blue-700 dark:bg-gray-800 dark:text-white'
                : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:text-gray-200 dark:hover:bg-gray-800'
                }`}
            >
              <Home className="h-4 w-4 mr-2" />
              Home
            </Link>
            <Link
              href="/problems"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center ${pathname.startsWith('/problems')
                ? 'bg-blue-100 text-blue-700 dark:bg-gray-800 dark:text-white'
                : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:text-gray-200 dark:hover:bg-gray-800'
                }`}
            >
              <Code className="h-4 w-4 mr-2" />
              Problems
            </Link>
            <Link
              href="/leaderboard"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center ${pathname === '/leaderboard'
                ? 'bg-blue-100 text-blue-700 dark:bg-gray-800 dark:text-white'
                : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:text-gray-200 dark:hover:bg-gray-800'
                }`}
            >
              <Trophy className="h-4 w-4 mr-2" />
              Leaderboard
            </Link>
          </div>

          {isSignedIn ? (
            <div className="flex items-center space-x-4">
              <Link href="/profile">
                <Button variant="ghost" className="text-gray-700 hover:text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:text-gray-200 dark:hover:bg-white/10">
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </Button>
              </Link>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "h-8 w-8"
                  }
                }}
              />
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link href="/sign-in">
                <Button className="bg-blue-600 text-white hover:bg-blue-700 dark:bg-white dark:text-black dark:hover:bg-gray-200">
                  Sign In
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
} 