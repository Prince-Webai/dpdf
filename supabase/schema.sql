-- Enable the necessary extensions
create extension if not exists "uuid-ossp";

-- Create a table for user profiles
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text unique not null,
  full_name text,
  avatar_url text,
  api_key uuid default uuid_generate_v4() unique,
  plan text default 'free',
  credits integer default 100,
  token_limit integer default 50000,
  credit_limit integer default 100,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Create policies
create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id);

-- Create a function to handle new user signups
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url, plan, credits, token_limit, credit_limit)
  values (
    new.id, 
    new.email, 
    coalesce(new.raw_user_meta_data->>'full_name', ''), 
    new.raw_user_meta_data->>'avatar_url',
    coalesce(new.raw_user_meta_data->>'plan', 'free'),
    coalesce((new.raw_user_meta_data->>'credits')::int, 100),
    coalesce((new.raw_user_meta_data->>'token_limit')::int, 50000),
    coalesce((new.raw_user_meta_data->>'credits')::int, 100)
  )
  on conflict (id) do update
  set 
    email = excluded.email,
    full_name = excluded.full_name,
    avatar_url = excluded.avatar_url,
    plan = excluded.plan,
    credits = excluded.credits,
    token_limit = excluded.token_limit,
    credit_limit = excluded.credit_limit;
  return new;
end;
$$ language plpgsql security definer;

-- Create a trigger for new users
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Create table for tracking API usage
create table public.api_usage (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  endpoint text not null,
  status_code int,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.api_usage enable row level security;

create policy "Users can view own usage." on public.api_usage
  for select using (auth.uid() = user_id);
