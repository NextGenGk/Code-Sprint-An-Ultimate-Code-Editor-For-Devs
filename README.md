# CodeSprint - Ultimate Code Editor for Developers

A modern online coding platform with real-time code execution, problem solving, and advanced anti-cheating mechanisms.

## 🚀 Features

### Core Features
- **Real-time Code Execution** - Execute code in multiple languages (JavaScript, Python, Java, C++)
- **Problem Solving Platform** - Solve coding problems with test case validation
- **User Authentication** - Secure authentication with Clerk
- **Submission History** - Track all your code submissions and results
- **Responsive Design** - Works seamlessly on desktop and mobile devices

### 🛡️ Anti-Cheating: Auto-Submit Feature

**Automatic code submission when users attempt to cheat by:**
- ✅ Switching to another browser tab
- ✅ Switching to another application (Alt+Tab)
- ✅ Closing or refreshing the page
- ✅ Minimizing the browser window

**How it works:**
1. Event listeners detect when users leave the problem page
2. Code is automatically submitted to prevent cheating
3. Submissions are marked with `autoSubmitted: true` flag
4. Works even with empty or incomplete code
5. Toast notifications inform users of auto-submission

**Implementation Details:**
- Uses `visibilitychange`, `blur`, and `beforeunload` events
- Prevents multiple simultaneous submissions
- Handles promise rejections gracefully
- Debug logging for troubleshooting

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router, Turbopack)
- **Language:** TypeScript
- **Authentication:** Clerk
- **Database:** Supabase (PostgreSQL)
- **Code Execution:** Judge0 API
- **Styling:** Tailwind CSS
- **UI Components:** Radix UI, shadcn/ui

## 📋 Prerequisites

- Node.js 18+ and npm
- Supabase account
- Clerk account
- Judge0 API access (local or hosted)

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd editor
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Judge0 API
JUDGE0_API_URL=http://localhost:2358
JUDGE0_API_KEY=your_judge0_api_key
```

### 4. Set up the database

Run the SQL schema in Supabase:

```bash
# Import supabase_schema_fixed.sql into your Supabase project
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 📁 Project Structure

```
editor/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── execute/       # Code execution endpoint
│   │   └── submissions/   # Submission management
│   ├── problems/          # Problem pages
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── problem-solver/    # Problem solving interface
│   ├── code-editor/       # Code editor component
│   └── ui/                # UI components (shadcn)
├── lib/                   # Utility functions
│   ├── judge0/           # Judge0 API client
│   └── supabase/         # Supabase client
└── types/                # TypeScript type definitions
```

## 🔧 Key Components

### Auto-Submit Implementation

**File:** `components/problem-solver/ProblemSolver.tsx`

```typescript
// Event listeners for auto-submit
useEffect(() => {
  const handleVisibilityChange = () => {
    if (document.hidden) {
      autoSubmit('tab switch').catch(err => console.error(err));
    }
  };
  
  const handleBlur = () => {
    autoSubmit('app switch').catch(err => console.error(err));
  };
  
  const handleBeforeUnload = (e: BeforeUnloadEvent) => {
    autoSubmit('page close').catch(err => console.error(err));
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
```

### API Routes

**Submission API:** `app/api/submissions/route.ts`
- `POST /api/submissions` - Submit code for evaluation
- `GET /api/submissions?problemId=<id>` - Get user submissions

**Execution API:** `app/api/execute/route.ts`
- `POST /api/execute` - Execute code against test cases

## 🧪 Testing

### Testing Auto-Submit

1. Sign in to the application
2. Navigate to any problem page
3. Try one of these actions:
   - Switch to another browser tab
   - Press Alt+Tab to switch applications
   - Try to close the browser tab
4. Check console logs for `[AutoSubmit]` messages
5. Verify submission appears in Submissions tab

### Expected Console Output

```
[Tab Switch] Detected
[AutoSubmit] Called with reason: tab switch
[AutoSubmit] Checking conditions: {pendingSubmission: false, userId: "...", problemId: "..."}
[AutoSubmit] Submitting code...
```

## 🐛 Troubleshooting

### Auto-Submit Not Working

1. **Check console logs** - Look for `[AutoSubmit]` messages
2. **Verify authentication** - User must be logged in
3. **Check network tab** - Look for `POST /api/submissions` requests
4. **Clear browser cache** - Force reload with Ctrl+Shift+R

### Judge0 422 Errors

- **Expected behavior** when submitting empty code
- Judge0 cannot execute empty code
- Submission is still saved to database

### Port Already in Use

```bash
# Kill process on port 3000
npx kill-port 3000

# Or use a different port
npm run dev -- -p 3001
```

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For support, email your-email@example.com or open an issue in the repository.
