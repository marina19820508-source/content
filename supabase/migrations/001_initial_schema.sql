-- Контент-планер: базовая схема и изоляция данных пользователей.
create extension if not exists "pgcrypto";

create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.platforms (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 80),
  color text not null default '#f97316' check (color ~ '^#[0-9A-Fa-f]{6}$'),
  created_at timestamptz not null default now()
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 120),
  hidden boolean not null default false,
  created_at timestamptz not null default now(),
  unique(user_id, name)
);

create table if not exists public.content_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 300),
  main_idea text not null default '',
  audience text not null default '',
  category_id uuid references public.categories(id) on delete set null,
  content_type text not null default 'Полезный',
  goal text not null default 'Охват',
  funnel_stage text not null default 'Привлечение внимания',
  publish_date date,
  publish_time time,
  status text not null default 'Идея',
  priority text not null default 'Средний',
  deadline date,
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.content_variants (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  content_item_id uuid not null references public.content_items(id) on delete cascade,
  platform_id uuid references public.platforms(id) on delete set null,
  format text not null default 'Пост', hook text not null default '', title text not null default '',
  body text not null default '', cta text not null default '', keyword text not null default '',
  visual_url text not null default '', published_url text not null default '', publish_date date,
  status text not null default 'Идея', created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table if not exists public.funnels (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null, goal text not null default '', current_stage text not null default '',
  clicks integer not null default 0 check (clicks >= 0), materials integer not null default 0 check (materials >= 0),
  leads integer not null default 0 check (leads >= 0), created_at timestamptz not null default now()
);

create table if not exists public.funnel_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  funnel_id uuid not null references public.funnels(id) on delete cascade,
  content_item_id uuid not null references public.content_items(id) on delete cascade,
  position integer not null default 0,
  unique(funnel_id, content_item_id)
);

create table if not exists public.metrics (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  content_item_id uuid not null references public.content_items(id) on delete cascade unique,
  views integer not null default 0 check (views >= 0), reach integer not null default 0 check (reach >= 0),
  reactions integer not null default 0 check (reactions >= 0), comments integer not null default 0 check (comments >= 0),
  saves integer not null default 0 check (saves >= 0), reposts integer not null default 0 check (reposts >= 0),
  clicks integer not null default 0 check (clicks >= 0), materials integer not null default 0 check (materials >= 0),
  followers integer not null default 0 check (followers >= 0), leads integer not null default 0 check (leads >= 0),
  sales integer not null default 0 check (sales >= 0), updated_at timestamptz not null default now()
);

create table if not exists public.settings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade unique,
  content_balance jsonb not null default '{"Полезный":35,"Экспертный":25,"Вовлекающий":20,"Личный":10,"Продающий":10}'::jsonb,
  formats jsonb not null default '[]'::jsonb, week_starts_monday boolean not null default true,
  timezone text not null default 'Europe/Moscow', notifications boolean not null default true,
  app_data jsonb,
  updated_at timestamptz not null default now()
);

create index if not exists content_items_user_date_idx on public.content_items(user_id, publish_date);
create index if not exists content_items_user_status_idx on public.content_items(user_id, status);
create index if not exists content_variants_item_idx on public.content_variants(content_item_id);
create index if not exists metrics_user_idx on public.metrics(user_id);

alter table public.users enable row level security;
alter table public.platforms enable row level security;
alter table public.categories enable row level security;
alter table public.content_items enable row level security;
alter table public.content_variants enable row level security;
alter table public.funnels enable row level security;
alter table public.funnel_items enable row level security;
alter table public.metrics enable row level security;
alter table public.settings enable row level security;

-- Одинаковая строгая политика для всех пользовательских сущностей.
do $$
declare table_name text;
begin
  foreach table_name in array array['platforms','categories','content_items','content_variants','funnels','funnel_items','metrics','settings']
  loop
    execute format('drop policy if exists "owner_all" on public.%I', table_name);
    execute format('create policy "owner_all" on public.%I for all using (auth.uid() = user_id) with check (auth.uid() = user_id)', table_name);
  end loop;
end $$;

drop policy if exists "owner_profile" on public.users;
create policy "owner_profile" on public.users for all using (auth.uid() = id) with check (auth.uid() = id);

create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$
begin insert into public.users (id, display_name) values (new.id, coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1))) on conflict (id) do nothing; return new; end;
$$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();
