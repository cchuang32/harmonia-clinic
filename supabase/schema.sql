-- ===========================================================================
-- 君禾診所 Harmonia Clinic — 瀏覽計數器
--
-- 使用方式：
--   1. 到 Supabase 專案 → 左側 SQL Editor → New query
--   2. 把這整個檔案貼進去 → 按 Run
--   3. 到 Project Settings → Data API，複製 Project URL 與 anon public key
--   4. 貼進 site.config.mjs 的 supabase 區塊，然後 npm run build
--
-- 安全性說明：
--   anon key 是設計來公開放在前端的金鑰，真正的防線是下面的 RLS 政策。
--   這裡只開放「讀取次數」與「呼叫 increment_view 函式 +1」，
--   任何人都無法直接改寫、刪除或竄改數字。
-- ===========================================================================

-- 1. 計數表：一篇文章一列，slug 就是網址代號（首頁用 'home'）
create table if not exists public.page_views (
  slug        text primary key,
  views       bigint      not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- 2. 開啟資料列層級安全性
alter table public.page_views enable row level security;

-- 3. 只允許「讀」，不允許前端直接寫
drop policy if exists "任何人都可以看次數" on public.page_views;
create policy "任何人都可以看次數"
  on public.page_views
  for select
  using (true);

-- 4. 加一次的函式（security definer：繞過 RLS，但只做「+1」這件事）
create or replace function public.increment_view(page_slug text)
returns bigint
language plpgsql
security definer
set search_path = public
as $$
declare
  new_count bigint;
begin
  -- 擋掉不合理的 slug，避免有人亂灌垃圾資料進來
  if page_slug is null
     or length(page_slug) > 120
     or page_slug !~ '^[a-z0-9][a-z0-9._-]*$' then
    raise exception 'invalid slug';
  end if;

  insert into public.page_views (slug, views)
  values (page_slug, 1)
  on conflict (slug)
  do update set views = public.page_views.views + 1,
                updated_at = now()
  returning views into new_count;

  return new_count;
end;
$$;

-- 5. 開放前端（anon 角色）呼叫這個函式
grant execute on function public.increment_view(text) to anon;
grant execute on function public.increment_view(text) to authenticated;

-- ---------------------------------------------------------------------------
-- 想查看目前各頁次數，可以執行：
--   select slug, views, updated_at from public.page_views order by views desc;
--
-- 想把某一頁次數歸零（例如測試用的數字）：
--   update public.page_views set views = 0 where slug = 'home';
-- ---------------------------------------------------------------------------
