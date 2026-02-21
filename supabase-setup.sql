-- 暖暖記帳 App：雲端同步用資料表
-- 在 Supabase Dashboard → SQL Editor 中執行此腳本

create table if not exists public.app_data (
  id text primary key default 'main',
  payload jsonb not null default '{}',
  updated_at timestamptz default now()
);

-- 允許匿名讀寫（使用 anon key 的用戶可同步資料）
alter table public.app_data enable row level security;

drop policy if exists "Allow anon read write app_data" on public.app_data;
create policy "Allow anon read write app_data"
  on public.app_data for all
  using (true)
  with check (true);

-- 強制重新整理 PostgREST schema cache，避免 REST 端點仍看不到新表
notify pgrst, 'reload schema';

-- 說明：payload 會存放 { records, categories, projects } 的 JSON
