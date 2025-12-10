# 🏆 Leaderboard Feature

## Overview
The leaderboard feature allows schools and colleges to host coding competitions and track participant performance in real-time. It provides comprehensive rankings based on problems solved, difficulty levels, and acceptance rates.

## Features

### 📊 Ranking System
- **Score Calculation**: 
  - Easy problems: 1 point
  - Medium problems: 2 points
  - Hard problems: 3 points
- **Tie-breaking**: Rankings are determined by:
  1. Total score (primary)
  2. Number of problems solved
  3. Acceptance rate
  4. First solve timestamp

### 📈 Statistics Tracked
- Problems solved (by difficulty)
- Problems attempted
- Total submissions
- Accepted submissions
- Acceptance rate (%)
- First solve timestamp
- Last activity timestamp

### 🎨 Visual Features
- **Top 3 Highlights**: Gold, Silver, Bronze badges for top performers
- **User Highlighting**: Current user's row is highlighted
- **Real-time Updates**: Auto-refreshes every 30 seconds
- **Responsive Design**: Works on all screen sizes
- **Dark Mode Support**: Seamless dark/light theme switching

## Setup Instructions

### 1. Database Setup

Run the SQL schema to create necessary tables and views:

```bash
# Execute the leaderboard schema
psql -h your-supabase-host -U postgres -d postgres -f leaderboard_schema.sql
```

Or manually execute the SQL in your Supabase SQL Editor:
- File: `leaderboard_schema.sql`

### 2. Environment Variables

Ensure these are set in your `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
CLERK_SECRET_KEY=your_clerk_secret
```

### 3. User Sync

Users are automatically synced to the database when they:
- Visit the leaderboard page
- Submit a solution

The sync happens via the `/api/users/sync` endpoint.

## Usage for Events

### For Event Organizers

1. **Pre-Event Setup**:
   - Set up problems in the database
   - Test the leaderboard with sample data
   - Share the platform URL with participants

2. **During Event**:
   - Monitor the leaderboard at `/leaderboard`
   - Leaderboard updates automatically every 30 seconds
   - Export data if needed via database queries

3. **Post-Event**:
   - Download final rankings
   - Generate reports from the database

### For Participants

1. Sign in to the platform
2. Solve problems from the Problems page
3. View your ranking on the Leaderboard
4. Your row will be highlighted for easy tracking

## API Endpoints

### GET `/api/leaderboard`
Fetches leaderboard data with rankings.

**Query Parameters**:
- `limit` (optional): Number of entries to return (default: 100)
- `offset` (optional): Offset for pagination (default: 0)

**Response**:
```json
{
  "leaderboard": [
    {
      "rank": 1,
      "user_id": "user_123",
      "email": "user@example.com",
      "username": "coder123",
      "full_name": "John Doe",
      "image_url": "https://...",
      "problems_solved": 15,
      "problems_attempted": 20,
      "easy_solved": 8,
      "medium_solved": 5,
      "hard_solved": 2,
      "total_submissions": 45,
      "accepted_submissions": 30,
      "acceptance_rate": 66.67,
      "first_solve_at": "2024-01-01T10:00:00Z",
      "last_submission_at": "2024-01-15T15:30:00Z",
      "total_score": 21
    }
  ],
  "total": 100
}
```

### POST `/api/users/sync`
Syncs current user's Clerk data to the database.

**Authentication**: Required (Clerk)

**Response**:
```json
{
  "success": true
}
```

## Database Schema

### `users` Table
Stores user profile information from Clerk.

### `leaderboard_stats` View
Materialized view that aggregates user statistics for efficient querying.

## Customization

### Changing Score Weights

Edit the `leaderboard_schema.sql` file and modify the score calculation:

```sql
(
  count(distinct case when up.status = 'Solved' and p.difficulty = 'Easy' then up.problem_id end) * 1 +
  count(distinct case when up.status = 'Solved' and p.difficulty = 'Medium' then up.problem_id end) * 2 +
  count(distinct case when up.status = 'Solved' and p.difficulty = 'Hard' then up.problem_id end) * 3
) as total_score
```

Change the multipliers (1, 2, 3) to your preferred values.

### Changing Refresh Rate

Edit `app/leaderboard/page.tsx`:

```typescript
// Change 30000 (30 seconds) to your preferred interval
const interval = setInterval(fetchLeaderboard, 30000);
```

## Troubleshooting

### Leaderboard is Empty
1. Ensure users have solved at least one problem
2. Check that the `leaderboard_stats` view was created successfully
3. Verify RLS policies allow read access

### User Not Appearing
1. User must visit the leaderboard or submit a solution to be synced
2. Check the `users` table to verify the user exists
3. Manually trigger sync by calling `/api/users/sync`

### Performance Issues
1. Add indexes to frequently queried columns
2. Consider caching leaderboard data for large events
3. Implement pagination for events with many participants

## Best Practices for Events

1. **Test Before Event**: Run a mock competition to test all features
2. **Set Time Limits**: Use problem time limits to prevent long-running submissions
3. **Monitor Resources**: Watch database and API usage during the event
4. **Backup Data**: Export leaderboard data periodically during the event
5. **Clear Instructions**: Provide participants with clear rules and scoring information

## Future Enhancements

Potential features to add:
- Export leaderboard to CSV/PDF
- Filter by time range
- Team-based competitions
- Live activity feed
- Achievement badges
- Historical leaderboard archives
