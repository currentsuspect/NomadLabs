-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- 1. PROFILES TABLE (Syncs with auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text unique not null,
  name text,
  avatar_url text,
  bio text,
  role text default 'MEMBER', -- 'GUEST', 'MEMBER', 'AUTHOR', 'REVIEWER', 'ADMIN'
  expertise text[] default '{}',
  following_users uuid[] default '{}',
  following_tags text[] default '{}',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. POSTS TABLE
create table public.posts (
  id uuid default uuid_generate_v4() primary key,
  slug text unique not null,
  title text not null,
  subtitle text,
  content text, -- MDX content
  author_id uuid references public.profiles(id) on delete cascade not null,
  status text default 'DRAFT', -- 'DRAFT', 'UNDER_REVIEW', 'PUBLISHED', 'ARCHIVED'
  type text default 'ARTICLE', -- 'ARTICLE', 'PAPER', 'LAB_NOTE'
  tags jsonb default '[]', -- Storing as JSONB for flexibility
  read_time_minutes integer default 5,
  featured boolean default false,
  pinned boolean default false,
  likes uuid[] default '{}', -- Array of user IDs who liked
  published_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. COMMENTS TABLE
create table public.comments (
  id uuid default uuid_generate_v4() primary key,
  post_id uuid references public.posts(id) on delete cascade not null,
  author_id uuid references public.profiles(id) on delete cascade not null,
  parent_id uuid references public.comments(id) on delete cascade, -- For nested replies
  content text not null,
  reactions jsonb default '[]', -- Array of {userId, type} objects
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. ROW LEVEL SECURITY (RLS)
alter table public.profiles enable row level security;
alter table public.posts enable row level security;
alter table public.comments enable row level security;

-- Profiles Policies
create policy "Public profiles are viewable by everyone."
  on public.profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on public.profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on public.profiles for update
  using ( auth.uid() = id );

-- Posts Policies
create policy "Published posts are viewable by everyone."
  on public.posts for select
  using ( status = 'PUBLISHED' or auth.uid() = author_id );

create policy "Authenticated users can create posts."
  on public.posts for insert
  with check ( auth.role() = 'authenticated' );

create policy "Users can update own posts."
  on public.posts for update
  using ( auth.uid() = author_id );

create policy "Users can delete own posts."
  on public.posts for delete
  using ( auth.uid() = author_id );

-- Comments Policies
create policy "Comments are viewable by everyone."
  on public.comments for select
  using ( true );

create policy "Authenticated users can create comments."
  on public.comments for insert
  with check ( auth.role() = 'authenticated' );

create policy "Users can update own comments."
  on public.comments for update
  using ( auth.uid() = author_id );

-- 5. TRIGGERS & FUNCTIONS

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'name',
    new.raw_user_meta_data->>'avatarUrl'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();