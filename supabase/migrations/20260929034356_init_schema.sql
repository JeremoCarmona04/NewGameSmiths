-- ============================================
-- ENUMS: listas cerradas de valores permitidos
-- ============================================
create type public.game_engine as enum ('godot', 'unity', 'unreal', 'other');
create type public.project_status as enum ('idea', 'in_development', 'released');
create type public.devlog_status as enum ('draft', 'published');
create type public.media_type as enum ('image', 'gif', 'model');

-- ============================================
-- FUNCIONES AUXILIARES
-- ============================================

-- Actualiza updated_at automáticamente en cada UPDATE
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Valida el JSON de colores del perfil
create or replace function public.is_valid_theme(t jsonb)
returns boolean
language sql
immutable
set search_path = ''
as $$
  select jsonb_typeof(t) = 'object'
    and not exists (
      select 1
      from jsonb_each_text(t)
      where key not in ('background', 'surface', 'text', 'muted', 'accent')
         or value !~ '^#[0-9a-fA-F]{6}$'
    );
$$;

-- ============================================
-- PROFILES
-- ============================================
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text not null unique check (username ~ '^[a-z0-9_]{3,20}$'),
  display_name text check (char_length(display_name) <= 50),
  pronouns text check (char_length(pronouns) <= 30),
  location text check (char_length(location) <= 60),
  avatar_url text,
  banner_url text,
  bio text check (char_length(bio) <= 500),
  theme jsonb not null default '{}'::jsonb check (public.is_valid_theme(theme)),
  links jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- ============================================
-- PROJECTS
-- ============================================
create table public.projects (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles (id) on delete cascade,
  slug text not null check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text not null check (char_length(title) between 1 and 100),
  description text check (char_length(description) <= 2000),
  cover_url text,
  engine public.game_engine not null default 'other',
  status public.project_status not null default 'idea',
  links jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (owner_id, slug)
);

create trigger projects_set_updated_at
  before update on public.projects
  for each row execute function public.set_updated_at();

-- ============================================
-- DEVLOGS
-- ============================================
create table public.devlogs (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  title text not null check (char_length(title) between 1 and 150),
  slug text not null check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  content_md text not null default '' check (char_length(content_md) <= 50000),
  youtube_url text,
  status public.devlog_status not null default 'draft',
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (project_id, slug),
  check (status = 'draft' or published_at is not null)
);

create index devlogs_feed_idx
  on public.devlogs (published_at desc)
  where status = 'published';

create trigger devlogs_set_updated_at
  before update on public.devlogs
  for each row execute function public.set_updated_at();

-- ============================================
-- DEVLOG_MEDIA
-- ============================================
create table public.devlog_media (
  id uuid primary key default gen_random_uuid(),
  devlog_id uuid not null references public.devlogs (id) on delete cascade,
  type public.media_type not null,
  storage_path text not null unique,
  size_bytes integer not null check (size_bytes > 0),
  position smallint not null default 0,
  created_at timestamptz not null default now()
);

create index devlog_media_devlog_idx on public.devlog_media (devlog_id, position);

-- ============================================
-- COMMENTS
-- ============================================
create table public.comments (
  id uuid primary key default gen_random_uuid(),
  devlog_id uuid not null references public.devlogs (id) on delete cascade,
  author_id uuid not null references public.profiles (id) on delete cascade,
  content text not null check (char_length(content) between 1 and 2000),
  created_at timestamptz not null default now()
);

create index comments_devlog_idx on public.comments (devlog_id, created_at);
create index comments_author_idx on public.comments (author_id);

-- ============================================
-- CREAR PERFIL AUTOMÁTICAMENTE AL REGISTRARSE
-- ============================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, username, display_name)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data ->> 'username',
      'user_' || substr(replace(new.id::text, '-', ''), 1, 12)
    ),
    new.raw_user_meta_data ->> 'display_name'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================
-- ACTIVAR ROW LEVEL SECURITY
-- ============================================
alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.devlogs enable row level security;
alter table public.devlog_media enable row level security;
alter table public.comments enable row level security;