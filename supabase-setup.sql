-- 暖暖記帳 App：雲端同步資料表（可重複執行）
-- 在 Supabase Dashboard → SQL Editor 執行此腳本
-- 使用獨立表 public.money_sync_state，避免與現有業務表衝突

create table if not exists public.money_sync_state (
  id bigserial primary key,
  sync_key text not null,
  sync_payload jsonb not null default '{}'::jsonb,
  sync_updated_at timestamptz default now()
);

create unique index if not exists money_sync_state_sync_key_uidx
  on public.money_sync_state(sync_key);

-- 允許匿名讀寫（使用 anon/publishable key 可同步）
alter table public.money_sync_state enable row level security;

drop policy if exists "Allow anon read write money_sync_state" on public.money_sync_state;
create policy "Allow anon read write money_sync_state"
  on public.money_sync_state for all
  using (true)
  with check (true);

-- 重新整理 PostgREST schema cache，避免 REST 端點看不到新欄位
notify pgrst, 'reload schema';
