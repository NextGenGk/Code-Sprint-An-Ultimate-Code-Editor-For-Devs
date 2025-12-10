-- Quick Setup Script for Leaderboard
-- Run this in your Supabase SQL Editor

-- Step 1: Create users table
create table if not exists users (
  id text primary key,
  email text not null,
  username text,
  full_name text,
  image_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Step 2: Create indexes
create index if not exists idx_users_email on users(email);
create index if not exists idx_users_username on users(username);

-- Step 3: Enable RLS
alter table users enable row level security;

-- Step 4: Create RLS policies
drop policy if exists "Users can view all profiles" on users;
create policy "Users can view all profiles"
  on users for select
  using (true);

drop policy if exists "Users can update own profile" on users;
create policy "Users can update own profile"
  on users for update
  using (auth.uid()::text = id);

drop policy if exists "Users can insert own profile" on users;
create policy "Users can insert own profile"
  on users for insert
  with check (auth.uid()::text = id);

-- Step 5: Create leaderboard view
drop view if exists leaderboard_stats;
create or replace view leaderboard_stats as
select 
  u.id as user_id,
  u.email,
  u.username,
  u.full_name,
  u.image_url,
  count(distinct case when up.status = 'Solved' then up.problem_id end) as problems_solved,
  count(distinct up.problem_id) as problems_attempted,
  count(distinct case when up.status = 'Solved' and p.difficulty = 'Easy' then up.problem_id end) as easy_solved,
  count(distinct case when up.status = 'Solved' and p.difficulty = 'Medium' then up.problem_id end) as medium_solved,
  count(distinct case when up.status = 'Solved' and p.difficulty = 'Hard' then up.problem_id end) as hard_solved,
  count(s.id) as total_submissions,
  count(case when s.status = 'Accepted' then 1 end) as accepted_submissions,
  round(
    case 
      when count(s.id) > 0 
      then (count(case when s.status = 'Accepted' then 1 end)::numeric / count(s.id)::numeric * 100)
      else 0 
    end, 
    2
  ) as acceptance_rate,
  min(case when s.status = 'Accepted' then s.submitted_at end) as first_solve_at,
  max(s.submitted_at) as last_submission_at,
  (
    count(distinct case when up.status = 'Solved' and p.difficulty = 'Easy' then up.problem_id end) * 1 +
    count(distinct case when up.status = 'Solved' and p.difficulty = 'Medium' then up.problem_id end) * 2 +
    count(distinct case when up.status = 'Solved' and p.difficulty = 'Hard' then up.problem_id end) * 3
  ) as total_score
from users u
left join user_progress up on u.id = up.user_id
left join problems p on up.problem_id = p.id
left join submissions s on u.id = s.user_id and up.problem_id = s.problem_id
group by u.id, u.email, u.username, u.full_name, u.image_url
order by total_score desc, problems_solved desc, acceptance_rate desc, first_solve_at asc;

-- Step 6: Grant permissions
grant select on leaderboard_stats to authenticated;
grant select on leaderboard_stats to anon;

-- Verification queries
-- Check if users table exists
select count(*) as user_count from users;

-- Check if view works
select * from leaderboard_stats limit 5;

-- Success message
select 'Leaderboard setup completed successfully!' as status;
