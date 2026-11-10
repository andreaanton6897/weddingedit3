-- =====================================================================
-- THE WEDDING EDIT — database schema (for Phase 2 onwards)
--
-- Paste into Supabase: Dashboard → SQL Editor → New query → Run.
--
-- How privacy works:
--   * Every row belongs to a wedding (wedding_id).
--   * A person can only see or change rows for weddings they are a
--     member of (wedding_members). The database itself enforces this
--     (Row Level Security); hiding things in the app is not relied on.
--   * Purchases are written only by the server after Stripe confirms a
--     payment, so nobody can give themselves paid access from a browser.
-- =====================================================================

create extension if not exists pgcrypto;

create or replace function public.touch_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end $$;

-- ---------- People ----------
create table public.profiles (
  id            uuid primary key references auth.users (id) on delete cascade,
  display_name  text check (char_length(display_name) <= 60),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id) values (new.id) on conflict do nothing;
  return new;
end $$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- The wedding ----------
create table public.weddings (
  id              uuid primary key default gen_random_uuid(),
  created_by      uuid not null references public.profiles (id) on delete cascade,
  date_status     text check (date_status in ('set','roughly','undecided')),
  wedding_date    date,
  rough_month     date,             -- first day of the month, when only roughly known
  country         text,
  location        text check (char_length(location) <= 120),
  wedding_kind    text check (wedding_kind in ('local','destination')),
  ceremony_type   text,
  guest_range     text check (guest_range in ('intimate','small','medium','large')),
  guest_estimate  integer check (guest_estimate is null or guest_estimate between 1 and 2000),
  currency        char(3) not null default 'GBP' check (currency ~ '^[A-Z]{3}$'),
  total_budget    numeric(12,2) check (total_budget is null or total_budget >= 0),
  time_zone       text not null default 'UTC',
  date_format     text not null default 'DD/MM/YYYY' check (date_format in ('DD/MM/YYYY','MM/DD/YYYY','YYYY-MM-DD')),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create table public.wedding_members (
  wedding_id  uuid not null references public.weddings (id) on delete cascade,
  user_id     uuid not null references public.profiles (id) on delete cascade,
  role        text not null default 'owner' check (role in ('owner','partner')),
  created_at  timestamptz not null default now(),
  primary key (wedding_id, user_id)
);

create or replace function public.add_wedding_owner() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.wedding_members (wedding_id, user_id, role) values (new.id, new.created_by, 'owner');
  return new;
end $$;

create trigger on_wedding_created
  after insert on public.weddings
  for each row execute function public.add_wedding_owner();

-- The single privacy check used by every policy below.
create or replace function public.is_wedding_member(wid uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.wedding_members where wedding_id = wid and user_id = auth.uid());
$$;

-- Onboarding answers that personalise the app.
create table public.wedding_preferences (
  wedding_id        uuid primary key references public.weddings (id) on delete cascade,
  styles            text[] not null default '{}',
  style_other       text,
  colours           text[] not null default '{}',
  atmosphere        text[] not null default '{}',
  wants_moodboard   boolean,
  already_spent     numeric(12,2) check (already_spent >= 0),
  spend_priorities  text[] not null default '{}' check (cardinality(spend_priorities) <= 3),
  save_areas        text[] not null default '{}',
  planning_stage    text check (planning_stage in ('just-engaged','early','underway','final')),
  venue_booked      boolean,
  booked_suppliers  text[] not null default '{}',
  planner_help      text check (planner_help in ('none','full','day','considering')),
  outstanding       text[] not null default '{}',
  top_priorities    text[] not null default '{}' check (cardinality(top_priorities) <= 3),
  excited_about     text check (char_length(excited_about) <= 200),
  worries           text[] not null default '{}',
  help_areas        text[] not null default '{}',
  planning_style    text check (planning_style in ('detailed','flexible')),
  completed_at      timestamptz,
  updated_at        timestamptz not null default now()
);

-- ---------- Paid access ----------
-- One row per successful payment, written by the server from Stripe's confirmation.
create table public.purchases (
  id                 uuid primary key default gen_random_uuid(),
  user_id            uuid not null references public.profiles (id) on delete cascade,
  product            text not null check (product in ('complete_edit')),
  amount_pence       integer not null check (amount_pence >= 0),
  currency           char(3) not null,
  status             text not null check (status in ('paid','refunded')),
  stripe_session_id  text not null unique,   -- prevents the same payment being recorded twice
  created_at         timestamptz not null default now()
);

-- Does anyone on this wedding hold The Complete Edit?
create or replace function public.has_complete_edit(wid uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.purchases p
    join public.wedding_members m on m.user_id = p.user_id
    where m.wedding_id = wid and p.product = 'complete_edit' and p.status = 'paid'
  );
$$;

-- ---------- Suppliers ----------
create table public.suppliers (
  id                 uuid primary key default gen_random_uuid(),
  wedding_id         uuid not null references public.weddings (id) on delete cascade,
  business_name      text not null check (char_length(business_name) between 1 and 160),
  category           text not null check (category in ('venue','photographer','videographer','florist','caterer','cake','hair-makeup','entertainment','celebrant','transport','stationery','accommodation','other')),
  custom_category    text,
  status             text not null default 'researching' check (status in ('researching','shortlisted','enquiry-sent','quote-received','booked','cancelled')),
  location           text,
  website            text,
  email              text,
  phone              text,
  quote_amount       numeric(12,2) check (quote_amount >= 0),
  agreed_amount      numeric(12,2) check (agreed_amount >= 0),
  deposit_amount     numeric(12,2) check (deposit_amount >= 0),
  balance_due_date   date,
  contract_signed    boolean not null default false,
  contract_notes     text,
  original_amount    numeric(12,2),   -- if quoted in another currency
  original_currency  char(3),
  notes              text,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);
create unique index suppliers_no_duplicates on public.suppliers (wedding_id, category, lower(business_name));

-- Free plan: up to 5 suppliers. Enforced here, not just in the app.
create or replace function public.enforce_supplier_limit() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if not public.has_complete_edit(new.wedding_id)
     and (select count(*) from public.suppliers where wedding_id = new.wedding_id) >= 5 then
    raise exception 'The free plan includes up to 5 suppliers. Upgrade to The Complete Edit to add more.'
      using errcode = 'P0001';
  end if;
  return new;
end $$;

create trigger supplier_limit before insert on public.suppliers
  for each row execute function public.enforce_supplier_limit();

create table public.supplier_comparisons (
  id          uuid primary key default gen_random_uuid(),
  wedding_id  uuid not null references public.weddings (id) on delete cascade,
  title       text not null check (char_length(title) between 1 and 120),
  category    text,
  created_at  timestamptz not null default now()
);

create table public.supplier_comparison_items (
  comparison_id  uuid not null references public.supplier_comparisons (id) on delete cascade,
  supplier_id    uuid not null references public.suppliers (id) on delete cascade,
  wedding_id     uuid not null references public.weddings (id) on delete cascade,
  notes          text,
  primary key (comparison_id, supplier_id)
);

-- ---------- Budget ----------
create table public.budget_categories (
  id                uuid primary key default gen_random_uuid(),
  wedding_id        uuid not null references public.weddings (id) on delete cascade,
  name              text not null check (char_length(name) between 1 and 60),
  planned_amount    numeric(12,2) check (planned_amount >= 0),
  sort_order        integer not null default 0,
  unique (wedding_id, name)
);

create table public.budget_items (
  id                uuid primary key default gen_random_uuid(),
  wedding_id        uuid not null references public.weddings (id) on delete cascade,
  category_id       uuid not null references public.budget_categories (id) on delete cascade,
  supplier_id       uuid references public.suppliers (id) on delete set null,
  description       text not null,
  -- Estimates, quotes and agreed costs are kept apart. Only payments marked paid count as spent.
  estimated_amount  numeric(12,2) check (estimated_amount >= 0),
  quoted_amount     numeric(12,2) check (quoted_amount >= 0),
  agreed_amount     numeric(12,2) check (agreed_amount >= 0),
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create table public.payments (
  id              uuid primary key default gen_random_uuid(),
  wedding_id      uuid not null references public.weddings (id) on delete cascade,
  budget_item_id  uuid references public.budget_items (id) on delete set null,
  supplier_id     uuid references public.suppliers (id) on delete set null,
  label           text not null,
  kind            text not null default 'payment' check (kind in ('deposit','instalment','balance','payment')),
  amount          numeric(12,2) not null check (amount > 0),
  due_date        date,
  status          text not null default 'due' check (status in ('due','paid','cancelled')),
  paid_on         date,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  -- A payment is only "paid" when the bride records the date she paid it.
  constraint paid_needs_date check (status <> 'paid' or paid_on is not null)
);

-- ---------- Checklist ----------
create table public.tasks (
  id           uuid primary key default gen_random_uuid(),
  wedding_id   uuid not null references public.weddings (id) on delete cascade,
  title        text not null check (char_length(title) between 1 and 200),
  notes        text,
  stage        text check (stage in ('18-12','12-9','9-6','6-3','3-1','final-month','wedding-week','wedding-day')),
  category     text,
  due_date     date,
  priority     text not null default 'normal' check (priority in ('low','normal','high')),
  done         boolean not null default false,
  done_at      timestamptz,
  source       text not null default 'custom' check (source in ('template','custom')),
  template_key text,          -- which template task it came from, to avoid adding it twice
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create unique index tasks_template_once on public.tasks (wedding_id, template_key) where template_key is not null;

-- ---------- Guests ----------
create table public.guests (
  id              uuid primary key default gen_random_uuid(),
  wedding_id      uuid not null references public.weddings (id) on delete cascade,
  full_name       text not null check (char_length(full_name) between 1 and 120),
  household       text,
  is_child        boolean not null default false,
  plus_one_of     uuid references public.guests (id) on delete cascade,
  rsvp            text not null default 'not-invited' check (rsvp in ('not-invited','invited','awaiting','accepted','declined')),
  meal_choice     text,
  dietary         text,
  allergies       text,
  accessibility   text,
  notes           text,
  table_label     text,           -- future seating planner
  rsvp_token      uuid not null default gen_random_uuid() unique,  -- future RSVP portal link
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- ---------- Calendar ----------
create table public.calendar_events (
  id            uuid primary key default gen_random_uuid(),
  wedding_id    uuid not null references public.weddings (id) on delete cascade,
  title         text not null check (char_length(title) between 1 and 160),
  description   text,
  category      text not null default 'appointment' check (category in ('supplier','venue-visit','payment','fitting','tasting','invitations','rsvp','milestone','wedding-day','appointment')),
  event_date    date not null,      -- in the wedding's time zone
  start_time    time,               -- empty = all day
  end_time      time,
  task_id       uuid references public.tasks (id) on delete set null,
  payment_id    uuid references public.payments (id) on delete cascade,
  supplier_id   uuid references public.suppliers (id) on delete set null,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ---------- Moodboards ----------
create table public.moodboards (
  id          uuid primary key default gen_random_uuid(),
  wedding_id  uuid not null references public.weddings (id) on delete cascade,
  title       text not null check (char_length(title) between 1 and 80),
  category    text check (category in ('overall','dress','bridesmaids','flowers','tablescapes','ceremony','reception','stationery','cake','hair-makeup','decorations','other')),
  palette     text[] not null default '{}' check (cardinality(palette) <= 12),  -- hex colours
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table public.moodboard_images (
  id            uuid primary key default gen_random_uuid(),
  moodboard_id  uuid not null references public.moodboards (id) on delete cascade,
  wedding_id    uuid not null references public.weddings (id) on delete cascade,
  storage_path  text not null,     -- <wedding_id>/<file> in the "moodboards" storage bucket
  note          text check (char_length(note) <= 500),
  sort_order    integer not null default 0,
  created_at    timestamptz not null default now()
);

-- ---------- Wedding-day run sheet ----------
create table public.wedding_day_events (
  id           uuid primary key default gen_random_uuid(),
  wedding_id   uuid not null references public.weddings (id) on delete cascade,
  start_time   time not null,
  end_time     time,
  title        text not null check (char_length(title) between 1 and 160),
  location     text,
  description  text,
  supplier_id  uuid references public.suppliers (id) on delete set null,
  responsible  text,
  notes        text,
  sort_order   integer not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- ---------- Indexes ----------
create index on public.tasks (wedding_id, done, due_date);
create index on public.budget_items (wedding_id);
create index on public.payments (wedding_id, status, due_date);
create index on public.guests (wedding_id, rsvp);
create index on public.calendar_events (wedding_id, event_date);
create index on public.moodboard_images (moodboard_id, sort_order);
create index on public.wedding_day_events (wedding_id, sort_order);
create index on public.purchases (user_id);

do $$
declare t text;
begin
  foreach t in array array['profiles','weddings','wedding_preferences','suppliers','budget_items','payments','tasks','guests','calendar_events','moodboards','wedding_day_events']
  loop
    execute format('create trigger touch_%1$s before update on public.%1$I for each row execute function public.touch_updated_at()', t);
  end loop;
end $$;

-- =====================================================================
-- ROW LEVEL SECURITY
-- =====================================================================
do $$
declare t text;
begin
  foreach t in array array['profiles','weddings','wedding_members','wedding_preferences','purchases','suppliers','supplier_comparisons','supplier_comparison_items','budget_categories','budget_items','payments','tasks','guests','calendar_events','moodboards','moodboard_images','wedding_day_events']
  loop
    execute format('alter table public.%I enable row level security', t);
  end loop;
end $$;

create policy "own profile: read"   on public.profiles for select using (id = auth.uid());
create policy "own profile: update" on public.profiles for update using (id = auth.uid()) with check (id = auth.uid());

create policy "wedding: read"   on public.weddings for select using (public.is_wedding_member(id));
create policy "wedding: create" on public.weddings for insert with check (created_by = auth.uid());
create policy "wedding: update" on public.weddings for update using (public.is_wedding_member(id)) with check (public.is_wedding_member(id));
create policy "wedding: delete" on public.weddings for delete using (
  exists (select 1 from public.wedding_members m where m.wedding_id = weddings.id and m.user_id = auth.uid() and m.role = 'owner')
);

create policy "members: read" on public.wedding_members for select using (public.is_wedding_member(wedding_id));

-- Purchases: you can see your own. Only the server (after Stripe confirms) can write.
create policy "own purchases: read" on public.purchases for select using (user_id = auth.uid());

-- Everyday planning tables: members of that wedding only.
do $$
declare t text;
begin
  foreach t in array array['wedding_preferences','suppliers','supplier_comparisons','supplier_comparison_items','budget_categories','budget_items','payments','tasks','calendar_events']
  loop
    execute format('create policy "members: read" on public.%I for select using (public.is_wedding_member(wedding_id))', t);
    execute format('create policy "members: add" on public.%I for insert with check (public.is_wedding_member(wedding_id))', t);
    execute format('create policy "members: change" on public.%I for update using (public.is_wedding_member(wedding_id)) with check (public.is_wedding_member(wedding_id))', t);
    execute format('create policy "members: delete" on public.%I for delete using (public.is_wedding_member(wedding_id))', t);
  end loop;
end $$;

-- Complete Edit features: members can always read and delete what they have,
-- but adding or changing needs The Complete Edit.
do $$
declare t text;
begin
  foreach t in array array['guests','moodboards','moodboard_images','wedding_day_events']
  loop
    execute format('create policy "members: read" on public.%I for select using (public.is_wedding_member(wedding_id))', t);
    execute format('create policy "complete: add" on public.%I for insert with check (public.is_wedding_member(wedding_id) and public.has_complete_edit(wedding_id))', t);
    execute format('create policy "complete: change" on public.%I for update using (public.is_wedding_member(wedding_id)) with check (public.is_wedding_member(wedding_id) and public.has_complete_edit(wedding_id))', t);
    execute format('create policy "members: delete" on public.%I for delete using (public.is_wedding_member(wedding_id))', t);
  end loop;
end $$;

-- =====================================================================
-- IMAGE STORAGE (moodboards)
-- Create a PRIVATE bucket called "moodboards" in Supabase Storage first.
-- Files are stored as <wedding_id>/<file name>.
-- =====================================================================
create policy "moodboard files: read" on storage.objects for select
  using (bucket_id = 'moodboards' and public.is_wedding_member(((storage.foldername(name))[1])::uuid));
create policy "moodboard files: upload" on storage.objects for insert
  with check (bucket_id = 'moodboards'
    and public.is_wedding_member(((storage.foldername(name))[1])::uuid)
    and public.has_complete_edit(((storage.foldername(name))[1])::uuid));
create policy "moodboard files: delete" on storage.objects for delete
  using (bucket_id = 'moodboards' and public.is_wedding_member(((storage.foldername(name))[1])::uuid));
