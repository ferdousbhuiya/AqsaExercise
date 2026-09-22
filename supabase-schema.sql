-- Run once in a new Supabase project's SQL Editor.
-- The browser receives only an opaque, expiring session token. PIN hashes stay here.
create extension if not exists pgcrypto;

create table if not exists public.learning_profiles (
  id uuid primary key default gen_random_uuid(),
  username text not null unique check (username ~ '^[a-z0-9][a-z0-9._-]{2,29}$'),
  display_name text not null default 'Aqsa' check (char_length(display_name) between 1 and 40),
  pin_hash text not null,
  failed_attempts integer not null default 0,
  locked_until timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.learning_sessions (
  token_hash text primary key,
  profile_id uuid not null references public.learning_profiles(id) on delete cascade,
  expires_at timestamptz not null default (now() + interval '90 days'),
  created_at timestamptz not null default now(),
  last_used_at timestamptz not null default now()
);

create table if not exists public.learning_scores (
  profile_id uuid not null references public.learning_profiles(id) on delete cascade,
  score_id text not null check (char_length(score_id) between 8 and 100),
  activity_date date not null,
  activity_timestamp bigint not null check (activity_timestamp > 0),
  grade smallint not null check (grade in (1,2)),
  subject text not null check (subject in ('math','english','science')),
  revision text not null default 'legacy' check (char_length(revision) <= 40),
  path_day smallint check (path_day between 1 and 365),
  path_start date,
  variant integer not null default 0 check (variant >= 0),
  unit text not null default '' check (char_length(unit) <= 120),
  score smallint not null check (score between 0 and 100),
  correct smallint not null check (correct >= 0),
  total smallint not null check (total between 1 and 100 and correct <= total),
  created_at timestamptz not null default now(),
  primary key (profile_id, score_id),
  unique (profile_id, activity_timestamp, grade, subject)
);

alter table public.learning_profiles enable row level security;
alter table public.learning_sessions enable row level security;
alter table public.learning_scores enable row level security;
revoke all on public.learning_profiles, public.learning_sessions, public.learning_scores from anon, authenticated;

create or replace function public.create_learning_profile(p_username text, p_pin text, p_display_name text default 'Aqsa')
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_username text := lower(trim(p_username)); v_profile public.learning_profiles; v_token uuid := gen_random_uuid();
begin
  if v_username !~ '^[a-z0-9][a-z0-9._-]{2,29}$' then return jsonb_build_object('ok',false,'error','Invalid username.'); end if;
  if p_pin !~ '^[0-9]{6,12}$' then return jsonb_build_object('ok',false,'error','PIN must contain 6–12 digits.'); end if;
  if exists(select 1 from public.learning_profiles where username=v_username) then return jsonb_build_object('ok',false,'error','That username is already in use. Sign in or choose another.'); end if;
  insert into public.learning_profiles(username,display_name,pin_hash) values(v_username,left(coalesce(nullif(trim(p_display_name),''),'Aqsa'),40),crypt(p_pin,gen_salt('bf',10))) returning * into v_profile;
  insert into public.learning_sessions(token_hash,profile_id) values(encode(digest(v_token::text,'sha256'),'hex'),v_profile.id);
  return jsonb_build_object('ok',true,'token',v_token,'username',v_profile.username,'display_name',v_profile.display_name);
end $$;

create or replace function public.login_learning_profile(p_username text, p_pin text, p_display_name text default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_profile public.learning_profiles; v_token uuid := gen_random_uuid();
begin
  select * into v_profile from public.learning_profiles where username=lower(trim(p_username)) for update;
  if not found then return jsonb_build_object('ok',false,'error','Incorrect username or PIN.'); end if;
  if v_profile.locked_until is not null and v_profile.locked_until > now() then return jsonb_build_object('ok',false,'error','Too many attempts. Try again in a few minutes.'); end if;
  if crypt(p_pin,v_profile.pin_hash) <> v_profile.pin_hash then
    update public.learning_profiles set failed_attempts=failed_attempts+1,locked_until=case when failed_attempts+1>=5 then now()+interval '5 minutes' else null end where id=v_profile.id;
    return jsonb_build_object('ok',false,'error','Incorrect username or PIN.');
  end if;
  update public.learning_profiles set failed_attempts=0,locked_until=null where id=v_profile.id;
  delete from public.learning_sessions where expires_at < now();
  insert into public.learning_sessions(token_hash,profile_id) values(encode(digest(v_token::text,'sha256'),'hex'),v_profile.id);
  return jsonb_build_object('ok',true,'token',v_token,'username',v_profile.username,'display_name',v_profile.display_name);
end $$;

create or replace function public.sync_learning_scores(p_token text, p_records jsonb default '[]'::jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_profile_id uuid; v_records jsonb;
begin
  select profile_id into v_profile_id from public.learning_sessions where token_hash=encode(digest(p_token,'sha256'),'hex') and expires_at>now() for update;
  if not found then return jsonb_build_object('ok',false,'session_expired',true,'error','Your cloud session expired. Please sign in again.'); end if;
  update public.learning_sessions set last_used_at=now(),expires_at=now()+interval '90 days' where token_hash=encode(digest(p_token,'sha256'),'hex');
  if jsonb_typeof(coalesce(p_records,'[]'::jsonb)) <> 'array' or jsonb_array_length(coalesce(p_records,'[]'::jsonb)) > 5000 then return jsonb_build_object('ok',false,'error','Invalid score list.'); end if;
  insert into public.learning_scores(profile_id,score_id,activity_date,activity_timestamp,grade,subject,revision,path_day,path_start,variant,unit,score,correct,total)
  select v_profile_id,left(x.id,100),x.date,x.timestamp,x.grade,x.subject,left(coalesce(x.revision,'legacy'),40),x.path_day,x.path_start,coalesce(x.variant,0),left(coalesce(x.unit,''),120),x.score,x.correct,x.total
  from jsonb_to_recordset(coalesce(p_records,'[]'::jsonb)) as x(id text,date date,timestamp bigint,grade smallint,subject text,revision text,path_day smallint,path_start date,variant integer,unit text,score smallint,correct smallint,total smallint)
  where x.id is not null and char_length(x.id)>=8 and x.grade in (1,2) and x.subject in ('math','english','science') and x.score between 0 and 100 and x.total between 1 and 100 and x.correct between 0 and x.total
  on conflict (profile_id,activity_timestamp,grade,subject) do update set score=excluded.score,correct=excluded.correct,total=excluded.total,revision=excluded.revision,path_day=excluded.path_day,path_start=excluded.path_start,variant=excluded.variant,unit=excluded.unit;
  select coalesce(jsonb_agg(jsonb_build_object('id',score_id,'activity_date',activity_date,'activity_timestamp',activity_timestamp,'grade',grade,'subject',subject,'revision',revision,'path_day',path_day,'path_start',path_start,'variant',variant,'unit',unit,'score',score,'correct',correct,'total',total) order by activity_timestamp),'[]'::jsonb) into v_records from public.learning_scores where profile_id=v_profile_id;
  return jsonb_build_object('ok',true,'records',v_records);
exception when others then return jsonb_build_object('ok',false,'error','The cloud rejected an invalid score record.');
end $$;

revoke all on function public.create_learning_profile(text,text,text), public.login_learning_profile(text,text,text), public.sync_learning_scores(text,jsonb) from public;
grant execute on function public.create_learning_profile(text,text,text), public.login_learning_profile(text,text,text), public.sync_learning_scores(text,jsonb) to anon, authenticated;
