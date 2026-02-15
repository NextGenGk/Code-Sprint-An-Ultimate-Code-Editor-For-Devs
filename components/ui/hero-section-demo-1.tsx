"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { ChevronDown } from 'lucide-react';
import { useState } from "react";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

export default function HeroSectionOne() {
  const { isSignedIn, isLoaded } = useUser();
  const [activeTab, setActiveTab] = useState<'testcases' | 'output'>('testcases');
  const [activeLeftTab, setActiveLeftTab] = useState<'description' | 'submissions'>('description');
  const [activeTestCase, setActiveTestCase] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [activeLanguage, setActiveLanguage] = useState('JavaScript');
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);

  const codeSnippets: Record<string, string> = {
    'JavaScript': `function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}`,
    'Python': `def twoSum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []`,
    'C++': `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        unordered_map<int, int> map;
        for (int i = 0; i < nums.size(); i++) {
            int complement = target - nums[i];
            if (map.count(complement)) {
                return {map[complement], i};
            }
            map[nums[i]] = i;
        }
        return {};
    }
};`,
    'Java': `class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) {
                return new int[] { map.get(complement), i };
            }
            map.put(nums[i], i);
        }
        return new int[] {};
    }
}`
  };

  const highlightedCodeSnippets: Record<string, React.ReactNode> = {
    'JavaScript': (
      <>
        <span className="text-purple-400">function</span> <span className="text-blue-400">twoSum</span><span className="text-yellow-300">(</span><span className="text-sky-300">nums</span>, <span className="text-sky-300">target</span><span className="text-yellow-300">)</span> <span className="text-yellow-300">{`{`}</span>{"\n"}
        <span className="pl-4 inline-block"><span className="text-purple-400">const</span> <span className="text-sky-300">map</span> <span className="text-purple-400">=</span> <span className="text-purple-400">new</span> <span className="text-yellow-300">Map</span><span className="text-purple-300">()</span>;</span>{"\n"}
        <span className="pl-4 inline-block"><span className="text-purple-400">for</span> <span className="text-purple-300">(</span><span className="text-purple-400">let</span> <span className="text-sky-300">i</span> <span className="text-purple-400">=</span> <span className="text-orange-300">0</span>; <span className="text-sky-300">i</span> <span className="text-purple-400">&lt;</span> <span className="text-sky-300">nums</span>.<span className="text-blue-300">length</span>; <span className="text-sky-300">i</span><span className="text-purple-400">++</span><span className="text-purple-300">)</span> <span className="text-purple-300">{`{`}</span></span>{"\n"}
        <span className="pl-8 inline-block"><span className="text-purple-400">const</span> <span className="text-sky-300">complement</span> <span className="text-purple-400">=</span> <span className="text-sky-300">target</span> <span className="text-purple-400">-</span> <span className="text-sky-300">nums</span><span className="text-blue-300">[</span><span className="text-sky-300">i</span><span className="text-blue-300">]</span>;</span>{"\n"}
        <span className="pl-8 inline-block"><span className="text-purple-400">if</span> <span className="text-purple-300">(</span><span className="text-sky-300">map</span>.<span className="text-blue-400">has</span><span className="text-purple-300">(</span><span className="text-sky-300">complement</span><span className="text-purple-300">))</span> <span className="text-purple-300">{`{`}</span></span>{"\n"}
        <span className="pl-12 inline-block"><span className="text-purple-400">return</span> <span className="text-yellow-300">[</span><span className="text-sky-300">map</span>.<span className="text-blue-400">get</span><span className="text-purple-300">(</span><span className="text-sky-300">complement</span><span className="text-purple-300">)</span>, <span className="text-sky-300">i</span><span className="text-yellow-300">]</span>;</span>{"\n"}
        <span className="pl-8 inline-block"><span className="text-purple-300">{`}`}</span></span>{"\n"}
        <span className="pl-8 inline-block"><span className="text-sky-300">map</span>.<span className="text-blue-400">set</span><span className="text-purple-300">(</span><span className="text-sky-300">nums</span><span className="text-blue-300">[</span><span className="text-sky-300">i</span><span className="text-blue-300">]</span>, <span className="text-sky-300">i</span><span className="text-purple-300">)</span>;</span>{"\n"}
        <span className="pl-4 inline-block"><span className="text-purple-300">{`}`}</span></span>{"\n"}
        <span className="pl-4 inline-block"><span className="text-purple-400">return</span> <span className="text-yellow-300">[]</span>;</span>{"\n"}
        <span className="text-yellow-300">{`}`}</span>
      </>
    ),
    'Python': (
      <>
        <span className="text-purple-400">def</span> <span className="text-blue-400">twoSum</span><span className="text-yellow-300">(</span><span className="text-sky-300">nums</span>, <span className="text-sky-300">target</span><span className="text-yellow-300">)</span>:{"\n"}
        <span className="pl-4 inline-block"><span className="text-sky-300">seen</span> <span className="text-purple-400">=</span> <span className="text-yellow-300">{`{}`}</span></span>{"\n"}
        <span className="pl-4 inline-block"><span className="text-purple-400">for</span> <span className="text-sky-300">i</span>, <span className="text-sky-300">num</span> <span className="text-purple-400">in</span> <span className="text-blue-400">enumerate</span><span className="text-purple-300">(</span><span className="text-sky-300">nums</span><span className="text-purple-300">)</span>:</span>{"\n"}
        <span className="pl-8 inline-block"><span className="text-sky-300">complement</span> <span className="text-purple-400">=</span> <span className="text-sky-300">target</span> <span className="text-purple-400">-</span> <span className="text-sky-300">num</span></span>{"\n"}
        <span className="pl-8 inline-block"><span className="text-purple-400">if</span> <span className="text-sky-300">complement</span> <span className="text-purple-400">in</span> <span className="text-sky-300">seen</span>:</span>{"\n"}
        <span className="pl-12 inline-block"><span className="text-purple-400">return</span> <span className="text-yellow-300">[</span><span className="text-sky-300">seen</span><span className="text-purple-300">[</span><span className="text-sky-300">complement</span><span className="text-purple-300">]</span>, <span className="text-sky-300">i</span><span className="text-yellow-300">]</span></span>{"\n"}
        <span className="pl-8 inline-block"><span className="text-sky-300">seen</span><span className="text-purple-300">[</span><span className="text-sky-300">num</span><span className="text-purple-300">]</span> <span className="text-purple-400">=</span> <span className="text-sky-300">i</span></span>{"\n"}
        <span className="pl-4 inline-block"><span className="text-purple-400">return</span> <span className="text-yellow-300">[]</span></span>
      </>
    ),
    'C++': (
      <>
        <span className="text-purple-400">class</span> <span className="text-yellow-300">Solution</span> <span className="text-yellow-300">{`{`}</span>{"\n"}
        <span className="text-purple-400">public:</span>{"\n"}
        <span className="pl-4 inline-block"><span className="text-purple-400">vector</span><span className="text-purple-300">&lt;</span><span className="text-purple-400">int</span><span className="text-purple-300">&gt;</span> <span className="text-blue-400">twoSum</span><span className="text-purple-300">(</span><span className="text-purple-400">vector</span><span className="text-purple-300">&lt;</span><span className="text-purple-400">int</span><span className="text-purple-300">&gt;&amp;</span> <span className="text-sky-300">nums</span>, <span className="text-purple-400">int</span> <span className="text-sky-300">target</span><span className="text-purple-300">)</span> <span className="text-purple-300">{`{`}</span></span>{"\n"}
        <span className="pl-8 inline-block"><span className="text-purple-400">unordered_map</span><span className="text-purple-300">&lt;</span><span className="text-purple-400">int</span>, <span className="text-purple-400">int</span><span className="text-purple-300">&gt;</span> <span className="text-sky-300">map</span>;</span>{"\n"}
        <span className="pl-8 inline-block"><span className="text-purple-400">for</span> <span className="text-purple-300">(</span><span className="text-purple-400">int</span> <span className="text-sky-300">i</span> <span className="text-purple-400">=</span> <span className="text-orange-300">0</span>; <span className="text-sky-300">i</span> <span className="text-purple-400">&lt;</span> <span className="text-sky-300">nums</span>.<span className="text-blue-400">size</span><span className="text-purple-300">()</span>; <span className="text-sky-300">i</span><span className="text-purple-400">++</span><span className="text-purple-300">)</span> <span className="text-purple-300">{`{`}</span></span>{"\n"}
        <span className="pl-12 inline-block"><span className="text-purple-400">int</span> <span className="text-sky-300">complement</span> <span className="text-purple-400">=</span> <span className="text-sky-300">target</span> <span className="text-purple-400">-</span> <span className="text-sky-300">nums</span><span className="text-blue-300">[</span><span className="text-sky-300">i</span><span className="text-blue-300">]</span>;</span>{"\n"}
        <span className="pl-12 inline-block"><span className="text-purple-400">if</span> <span className="text-purple-300">(</span><span className="text-sky-300">map</span>.<span className="text-blue-400">count</span><span className="text-purple-300">(</span><span className="text-sky-300">complement</span><span className="text-purple-300">))</span> <span className="text-purple-300">{`{`}</span></span>{"\n"}
        <span className="pl-16 inline-block"><span className="text-purple-400">return</span> <span className="text-yellow-300">{`{`}</span><span className="text-sky-300">map</span><span className="text-blue-300">[</span><span className="text-sky-300">complement</span><span className="text-blue-300">]</span>, <span className="text-sky-300">i</span><span className="text-yellow-300">{`}`}</span>;</span>{"\n"}
        <span className="pl-12 inline-block"><span className="text-purple-300">{`}`}</span></span>{"\n"}
        <span className="pl-12 inline-block"><span className="text-sky-300">map</span><span className="text-blue-300">[</span><span className="text-sky-300">nums</span><span className="text-blue-300">[</span><span className="text-sky-300">i</span><span className="text-blue-300">]]</span> <span className="text-purple-400">=</span> <span className="text-sky-300">i</span>;</span>{"\n"}
        <span className="pl-8 inline-block"><span className="text-purple-300">{`}`}</span></span>{"\n"}
        <span className="pl-8 inline-block"><span className="text-purple-400">return</span> <span className="text-yellow-300">{`{}`}</span>;</span>{"\n"}
        <span className="pl-4 inline-block"><span className="text-purple-300">{`}`}</span></span>{"\n"}
        <span className="text-yellow-300">{`};`}</span>
      </>
    ),
    'Java': (
      <>
        <span className="text-purple-400">class</span> <span className="text-yellow-300">Solution</span> <span className="text-yellow-300">{`{`}</span>{"\n"}
        <span className="pl-4 inline-block"><span className="text-purple-400">public</span> <span className="text-purple-400">int</span><span className="text-purple-300">[]</span> <span className="text-blue-400">twoSum</span><span className="text-purple-300">(</span><span className="text-purple-400">int</span><span className="text-purple-300">[]</span> <span className="text-sky-300">nums</span>, <span className="text-purple-400">int</span> <span className="text-sky-300">target</span><span className="text-purple-300">)</span> <span className="text-purple-300">{`{`}</span></span>{"\n"}
        <span className="pl-8 inline-block"><span className="text-yellow-300">Map</span><span className="text-purple-300">&lt;</span><span className="text-yellow-300">Integer</span>, <span className="text-yellow-300">Integer</span><span className="text-purple-300">&gt;</span> <span className="text-sky-300">map</span> <span className="text-purple-400">=</span> <span className="text-purple-400">new</span> <span className="text-yellow-300">HashMap</span><span className="text-purple-300">&lt;&gt;()</span>;</span>{"\n"}
        <span className="pl-8 inline-block"><span className="text-purple-400">for</span> <span className="text-purple-300">(</span><span className="text-purple-400">int</span> <span className="text-sky-300">i</span> <span className="text-purple-400">=</span> <span className="text-orange-300">0</span>; <span className="text-sky-300">i</span> <span className="text-purple-400">&lt;</span> <span className="text-sky-300">nums</span>.<span className="text-blue-300">length</span>; <span className="text-sky-300">i</span><span className="text-purple-400">++</span><span className="text-purple-300">)</span> <span className="text-purple-300">{`{`}</span></span>{"\n"}
        <span className="pl-12 inline-block"><span className="text-purple-400">int</span> <span className="text-sky-300">complement</span> <span className="text-purple-400">=</span> <span className="text-sky-300">target</span> <span className="text-purple-400">-</span> <span className="text-sky-300">nums</span><span className="text-blue-300">[</span><span className="text-sky-300">i</span><span className="text-blue-300">]</span>;</span>{"\n"}
        <span className="pl-12 inline-block"><span className="text-purple-400">if</span> <span className="text-purple-300">(</span><span className="text-sky-300">map</span>.<span className="text-blue-400">containsKey</span><span className="text-purple-300">(</span><span className="text-sky-300">complement</span><span className="text-purple-300">))</span> <span className="text-purple-300">{`{`}</span></span>{"\n"}
        <span className="pl-16 inline-block"><span className="text-purple-400">return</span> <span className="text-purple-400">new</span> <span className="text-purple-400">int</span><span className="text-purple-300">[]</span> <span className="text-purple-300">{`{`}</span> <span className="text-sky-300">map</span>.<span className="text-blue-400">get</span><span className="text-purple-300">(</span><span className="text-sky-300">complement</span><span className="text-purple-300">)</span>, <span className="text-sky-300">i</span> <span className="text-purple-300">{`}`}</span>;</span>{"\n"}
        <span className="pl-12 inline-block"><span className="text-purple-300">{`}`}</span></span>{"\n"}
        <span className="pl-12 inline-block"><span className="text-sky-300">map</span>.<span className="text-blue-400">put</span><span className="text-purple-300">(</span><span className="text-sky-300">nums</span><span className="text-blue-300">[</span><span className="text-sky-300">i</span><span className="text-blue-300">]</span>, <span className="text-sky-300">i</span><span className="text-purple-300">)</span>;</span>{"\n"}
        <span className="pl-8 inline-block"><span className="text-purple-300">{`}`}</span></span>{"\n"}
        <span className="pl-8 inline-block"><span className="text-purple-400">return</span> <span className="text-purple-400">new</span> <span className="text-purple-400">int</span><span className="text-purple-300">[]</span> <span className="text-purple-300">{`{}`}</span>;</span>{"\n"}
        <span className="pl-4 inline-block"><span className="text-purple-300">{`}`}</span></span>{"\n"}
        <span className="text-yellow-300">{`}`}</span>
      </>
    )
  };

  const handleRun = () => {
    setIsRunning(true);
    setActiveTab('output');
    setTimeout(() => {
      setIsRunning(false);
    }, 1500);
  };

  const testCases = [
    { nums: "[2,7,11,15]", target: "9", output: "[0,1]" },
    { nums: "[3,2,4]", target: "6", output: "[1,2]" },
    { nums: "[3,3]", target: "6", output: "[0,1]" },
  ];

  // Don't render until Clerk is loaded to prevent hydration issues
  if (!isLoaded) {
    return (
      <div className="relative w-full min-h-screen bg-gray-100 dark:bg-gradient-to-br dark:from-gray-900 dark:via-black dark:to-gray-800 flex items-center justify-center">
        <div className="text-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="relative w-full min-h-screen bg-gray-100 dark:bg-gradient-to-br dark:from-gray-900 dark:via-black dark:to-gray-800">
      <div className="absolute inset-y-0 left-0 h-full w-px bg-neutral-800/20 dark:bg-neutral-200/20">
        <div className="absolute top-0 h-40 w-px bg-gradient-to-b from-transparent via-blue-500 to-transparent" />
      </div>
      <div className="absolute inset-y-0 right-0 h-full w-px bg-neutral-800/20 dark:bg-neutral-200/20">
        <div className="absolute h-40 w-px bg-gradient-to-b from-transparent via-blue-500 to-transparent" />
      </div>
      <div className="absolute inset-x-0 bottom-0 h-px w-full bg-neutral-800/20 dark:bg-neutral-200/20">
        <div className="absolute mx-auto h-px w-40 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-start px-4 pt-12">
        <motion.div
          initial={{
            opacity: 0,
            y: 10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.3,
            delay: 0.2,
          }}
          className="relative z-10 mb-6"
        >
          <span className="inline-flex items-center rounded-full bg-gradient-to-r from-blue-100 to-purple-100 dark:from-gray-800 dark:to-black px-4 py-2 text-sm font-medium text-gray-900 dark:text-white shadow-lg border border-blue-200 dark:border-gray-600">
            Introducing CodeSprint
          </span>
        </motion.div>

        <h1 className={`${poppins.className} relative z-10 mx-auto max-w-4xl text-center text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-gray-900 dark:text-white leading-tight mb-6`}>
          {"CodeSprint - Ultimate Online Coding Platform"
            .split(" ")
            .map((word, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, filter: "blur(4px)", y: 10 }}
                animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.1,
                  ease: "easeInOut",
                }}
                className="mr-2 inline-block"
              >
                {word}
              </motion.span>
            ))}
        </h1>

        <motion.p
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            duration: 0.3,
            delay: 0.8,
          }}
          className={`${poppins.className} relative z-10 mx-auto max-w-2xl py-4 text-center text-lg font-normal text-gray-700 dark:text-gray-400 leading-relaxed`}
        >
          Master DSA with real-time execution, instant validation, and a powerful editor. Code smarter and track your progress with CodeSprint.
        </motion.p>



        <motion.div
          initial={{
            opacity: 0,
            y: 10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.3,
            delay: 1.2,
          }}
          className="relative z-10 mt-12 rounded-xl max-w-7xl mx-auto overflow-hidden text-left p-[2px]"
        >
          {/* Animated Orange Border */}
          <div className="absolute inset-[-1000%] animate-[spin_10s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#0000_0%,#f97316_50%,#0000_100%)]" />
          
          <div className="relative h-full w-full bg-[#0f1117] rounded-[10px] overflow-hidden shadow-2xl">
            {/* MacOS Window Header */}
            <div className="flex items-center px-4 py-3 bg-[#1a1d24] border-b border-white/5">
            <div className="flex space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <div className="flex-1 text-center text-xs text-gray-400 font-mono">
              {activeLanguage} — CodeSprint
            </div>
          </div>

          {/* Dashboard Body */}
          <div className="flex flex-col md:flex-row h-[500px] md:h-[600px] bg-[#0f1117]">
            
            {/* Left Panel: Problem Description */}
            <div className="w-full md:w-[45%] flex flex-col border-r border-white/5 bg-[#0f1117]">
              {/* Tabs */}
              <div className="flex items-center bg-[#1a1d24] px-2 pt-2">
                <div 
                  onClick={() => setActiveLeftTab('description')}
                  className={`px-4 py-2 text-sm font-medium cursor-pointer rounded-t-lg transition-colors ${activeLeftTab === 'description' ? 'text-white border-t-2 border-blue-500 bg-[#0f1117]' : 'text-gray-400 hover:text-gray-200 hover:bg-[#15171e]'}`}
                >
                  Description
                </div>
                <div 
                  onClick={() => setActiveLeftTab('submissions')}
                  className={`px-4 py-2 text-sm font-medium cursor-pointer rounded-t-lg transition-colors ${activeLeftTab === 'submissions' ? 'text-white border-t-2 border-blue-500 bg-[#0f1117]' : 'text-gray-400 hover:text-gray-200 hover:bg-[#15171e]'}`}
                >
                  Submissions
                </div>
              </div>
              
              {/* Content Area */}
              <div className="flex-1 overflow-hidden relative">
                {activeLeftTab === 'description' ? (
                  <div className="h-full p-6 overflow-y-auto custom-scrollbar">
                    <div className="flex items-center gap-3 mb-4">
                      <h2 className="text-xl font-bold text-white">Two Sum</h2>
                      <span className="px-2 py-0.5 rounded text-xs font-medium bg-green-500/10 text-green-500">Easy</span>
                      <span className="px-2 py-0.5 rounded text-xs font-medium bg-gray-700/50 text-gray-400">Array</span>
                    </div>

                    <div className="flex gap-4 text-xs text-gray-400 mb-6 font-mono">
                      <span className="flex items-center gap-1"><span className="text-gray-500">🕒</span> 1000ms</span>
                      <span className="flex items-center gap-1"><span className="text-gray-500">💾</span> 128MB</span>
                    </div>

                    <div className="space-y-4 text-sm text-gray-300 leading-relaxed pb-20">
                      <div className="p-4 rounded-lg bg-[#1a1d24]/50 border border-white/5">
                        <h3 className="text-sm font-semibold text-white mb-2">Problem Description</h3>
                        <p className="mb-4">
                          Given an array of integers <code className="bg-gray-700/50 px-1 rounded text-gray-200">nums</code> and an integer <code className="bg-gray-700/50 px-1 rounded text-gray-200">target</code>, return indices of the two numbers such that they add up to <code className="bg-gray-700/50 px-1 rounded text-gray-200">target</code>.
                        </p>
                        <p>
                          You may assume that each input would have exactly one solution, and you may not use the same element twice.
                        </p>
                      </div>

                      <div className="p-4 rounded-lg bg-[#1a1d24]/50 border border-white/5 opacity-80">
                        <h3 className="text-sm font-semibold text-white mb-2">Example 1</h3>
                        <div className="font-mono text-xs space-y-1">
                          <p><span className="text-gray-400">Input:</span> nums = [2,7,11,15], target = 9</p>
                          <p><span className="text-gray-400">Output:</span> [0,1]</p>
                          <p><span className="text-gray-400">Explanation:</span> Because nums[0] + nums[1] == 9, we return [0, 1].</p>
                        </div>
                      </div>

                      <div className="p-4 rounded-lg bg-[#1a1d24]/50 border border-white/5 opacity-80">
                        <h3 className="text-sm font-semibold text-white mb-2">Example 2</h3>
                        <div className="font-mono text-xs space-y-1">
                          <p><span className="text-gray-400">Input:</span> nums = [3,2,4], target = 6</p>
                          <p><span className="text-gray-400">Output:</span> [1,2]</p>
                        </div>
                      </div>

                      <div className="p-4 rounded-lg bg-[#1a1d24]/50 border border-white/5 opacity-80">
                        <h3 className="text-sm font-semibold text-white mb-2">Example 3</h3>
                        <div className="font-mono text-xs space-y-1">
                          <p><span className="text-gray-400">Input:</span> nums = [3,3], target = 6</p>
                          <p><span className="text-gray-400">Output:</span> [0,1]</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Fade out bottom */}
                    <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-[#0f1117] to-transparent pointer-events-none" />
                  </div>
                ) : (
                  <div className="h-full flex flex-col w-full">
                    <div className="p-4 border-b border-white/5 bg-[#1a1d24]/50 w-full">
                      <h3 className="text-sm font-medium text-white">All Submissions</h3>
                    </div>
                    <div className="flex-1 overflow-y-auto w-full">
                      <table className="w-full text-left text-xs table-fixed">
                        <thead className="text-gray-500 font-medium border-b border-white/5 bg-[#1a1d24]/30">
                          <tr>
                            <th className="px-4 py-3 w-24">Status</th>
                            <th className="px-4 py-3">Runtime</th>
                            <th className="px-4 py-3">Memory</th>
                            <th className="px-4 py-3">Language</th>
                            <th className="px-4 py-3 text-right">Time</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-gray-300">
                          <tr className="hover:bg-white/5 transition-colors">
                            <td className="px-4 py-3 text-green-500 font-medium">Accepted</td>
                            <td className="px-4 py-3">56 ms</td>
                            <td className="px-4 py-3">42.1 MB</td>
                            <td className="px-4 py-3">JavaScript</td>
                            <td className="px-4 py-3 text-gray-500 text-right">Just now</td>
                          </tr>
                          <tr className="hover:bg-white/5 transition-colors">
                            <td className="px-4 py-3 text-red-500 font-medium">Wrong Answer</td>
                            <td className="px-4 py-3">-</td>
                            <td className="px-4 py-3">-</td>
                            <td className="px-4 py-3">Python</td>
                            <td className="px-4 py-3 text-gray-500 text-right">2 hours ago</td>
                          </tr>
                          <tr className="hover:bg-white/5 transition-colors">
                            <td className="px-4 py-3 text-green-500 font-medium">Accepted</td>
                            <td className="px-4 py-3">62 ms</td>
                            <td className="px-4 py-3">41.8 MB</td>
                            <td className="px-4 py-3">JavaScript</td>
                            <td className="px-4 py-3 text-gray-500 text-right">1 day ago</td>
                          </tr>
                          <tr className="hover:bg-white/5 transition-colors">
                            <td className="px-4 py-3 text-yellow-500 font-medium">Time Limit</td>
                            <td className="px-4 py-3">-</td>
                            <td className="px-4 py-3">-</td>
                            <td className="px-4 py-3">C++</td>
                            <td className="px-4 py-3 text-gray-500 text-right">2 days ago</td>
                          </tr>
                          <tr className="hover:bg-white/5 transition-colors">
                            <td className="px-4 py-3 text-green-500 font-medium">Accepted</td>
                            <td className="px-4 py-3">48 ms</td>
                            <td className="px-4 py-3">40.5 MB</td>
                            <td className="px-4 py-3">Python</td>
                            <td className="px-4 py-3 text-gray-500 text-right">3 days ago</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Panel: Code Editor */}
            <div className="w-full md:w-[55%] flex flex-col bg-[#0f1117]">
              {/* Toolbar */}
              <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 bg-[#1a1d24]">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">Language:</span>
                  <div 
                    className="relative"
                    onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                  >
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-[#1a1d24] rounded border border-white/10 text-xs text-gray-200 cursor-pointer hover:border-white/20 transition-colors">
                      {activeLanguage}
                      <ChevronDown className="w-3 h-3 text-gray-400" />
                    </div>
                    {showLanguageDropdown && (
                      <div className="absolute top-full left-0 mt-1 w-32 bg-[#1a1d24] border border-white/10 rounded shadow-xl z-50">
                        {['JavaScript', 'Python', 'C++', 'Java'].map((lang) => (
                          <div 
                            key={lang}
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveLanguage(lang);
                              setShowLanguageDropdown(false);
                            }}
                            className="px-3 py-2 text-xs text-gray-300 hover:bg-white/5 cursor-pointer"
                          >
                            {lang}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={handleRun}
                    disabled={isRunning}
                    className={`px-4 py-1.5 rounded bg-[#2c1a0e] text-orange-500 border border-orange-500/20 text-xs font-medium transition-colors ${isRunning ? 'opacity-50 cursor-not-allowed' : 'hover:bg-orange-500/10'}`}
                  >
                    {isRunning ? 'Running...' : 'Run'}
                  </button>
                  <button className="px-4 py-1.5 rounded bg-orange-600 text-white text-xs font-medium hover:bg-orange-500 shadow-lg shadow-orange-500/20 transition-colors">Submit</button>
                </div>
              </div>

              {/* Editor Area */}
              <div className="flex-1 flex flex-col min-h-0 p-4 bg-[#0f1117]">
                <div className="flex-1 flex overflow-hidden font-mono text-sm leading-relaxed p-4 bg-[#1e1e1e] rounded-xl border border-white/5 shadow-inner overflow-y-auto custom-scrollbar">
                  <div className="flex flex-col text-right mr-4 text-gray-600 select-none w-8 font-mono border-r border-white/5 pr-2 h-full">
                    {/* Dynamic line numbers based on code length */}
                    {codeSnippets[activeLanguage].split('\n').map((_, i) => (
                      <span key={i + 1} className="leading-6">{i + 1}</span>
                    ))}
                  </div>
                  <div className="flex-1 text-gray-300 whitespace-pre font-mono leading-6 pl-2">
                    {highlightedCodeSnippets[activeLanguage]}
                  </div>
                </div>
              </div>

              {/* Console/Test Cases Area */}
              <div className="flex-1 flex flex-col min-h-0 border-t border-white/5 bg-[#1a1d24]">
                {/* Tabs */}
                <div className="flex items-center px-4 pt-2 gap-6 border-b border-white/5 bg-[#1a1d24]">
                  <div 
                    onClick={() => setActiveTab('testcases')}
                    className={`text-xs font-medium pb-2 cursor-pointer transition-colors ${activeTab === 'testcases' ? 'text-white border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-300 border-b-2 border-transparent'}`}
                  >
                    Test Cases
                  </div>
                  <div 
                    onClick={() => setActiveTab('output')}
                    className={`text-xs font-medium pb-2 cursor-pointer transition-colors ${activeTab === 'output' ? 'text-white border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-300 border-b-2 border-transparent'}`}
                  >
                    Output
                  </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 p-4 overflow-hidden font-mono text-xs">
                  {activeTab === 'testcases' ? (
                    <>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-gray-400">Available Test Cases:</span>
                        <div className="flex gap-2">
                          {testCases.map((_, index) => (
                            <span 
                              key={index}
                              onClick={() => setActiveTestCase(index)}
                              className={`px-3 py-1 rounded border cursor-pointer transition-colors ${activeTestCase === index ? 'bg-[#2c1a0e] text-orange-500 border-orange-500/20' : 'bg-[#1e1e1e] text-gray-500 border-white/5 hover:bg-[#252525]'}`}
                            >
                              Case {index + 1}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="space-y-1">
                          <div className="text-gray-500 mb-1">nums =</div>
                          <div className="px-3 py-2 bg-[#0f1117] rounded border border-white/5 text-gray-300">
                            {testCases[activeTestCase].nums}
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-gray-500 mb-1">target =</div>
                          <div className="px-3 py-2 bg-[#0f1117] rounded border border-white/5 text-gray-300">
                            {testCases[activeTestCase].target}
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-gray-500 mb-1">Expected Output =</div>
                          <div className="px-3 py-2 bg-[#0f1117] rounded border border-white/5 text-gray-300">
                            {testCases[activeTestCase].output}
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="space-y-2 text-gray-300">
                      {isRunning ? (
                        <div className="flex items-center justify-center h-full pt-8 text-gray-400">
                           <span className="animate-pulse">Running Code...</span>
                        </div>
                      ) : (
                        <>
                          <div className="flex gap-2">
                            <span className="text-green-500">✔</span>
                            <span>Accepted</span>
                          </div>
                          <div className="flex gap-2">
                            <span className="text-gray-500">Runtime:</span>
                            <span>{Math.floor(Math.random() * 50) + 20} ms</span>
                          </div>
                          <div className="flex gap-2">
                            <span className="text-gray-500">Memory:</span>
                            <span>{Math.floor(Math.random() * 20) + 30} MB</span>
                          </div>
                          <div className="mt-4 p-3 bg-[#0f1117] rounded border border-green-500/20 text-green-400">
                            Input: nums = {testCases[activeTestCase].nums}, target = {testCases[activeTestCase].target}
                            <br/>
                            Output: {testCases[activeTestCase].output}
                            <br/>
                            Expected: {testCases[activeTestCase].output}
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          </div>
        </motion.div>

        <footer className="mt-20 w-full border-t border-gray-200 dark:border-white/20 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center justify-center space-x-8">
            <p>&copy; {new Date().getFullYear()} CodeSprint. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
