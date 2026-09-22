-- Run this if the app still says: function gen_salt(unknown, integer) does not exist.
-- It repairs the existing functions without deleting profiles or scores.
create schema if not exists extensions;
create extension if not exists pgcrypto with schema extensions;

create or replace function public.create_learning_profile(p_username text, p_pin text, p_display_name text default 'Aqsa')
returns jsonb language plpgsql security definer set search_path = public, extensions as $$
declare v_username text := lower(trim(p_username)); v_profile public.learning_profiles; v_token uuid := gen_random_uuid();
begin
  if v_username !~ '^[a-z0-9][a-z0-9._-]{2,29}$' then return jsonb_build_object('ok',false,'error','Invalid username.'); end if;
  if p_pin !~ '^[0-9]{6,12}$' then return jsonb_build_object('ok',false,'error','PIN must contain 6–12 digits.'); end if;
  if exists(select 1 from public.learning_profiles where username=v_username) then return jsonb_build_object('ok',false,'error','That username is already in use. Sign in or choose another.'); end if;
  insert into public.learning_profiles(id,username,display_name,pin_hash) values(gen_random_uuid(),v_username,left(coalesce(nullif(trim(p_display_name),''),'Aqsa'),40),crypt(p_pin,gen_salt('bf',10))) returning * into v_profile;
  insert into public.learning_sessions(token_hash,profile_id) values(encode(digest(v_token::text,'sha256'),'hex'),v_profile.id);
  return jsonb_build_object('ok',true,'token',v_token,'username',v_profile.username,'display_name',v_profile.display_name);
end $$;

create or replace function public.login_learning_profile(p_username text, p_pin text, p_display_name text default null)
returns jsonb language plpgsql security definer set search_path = public, extensions as $$
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
returns jsonb language plpgsql security definer set search_path = public, extensions as $$
declare v_profile_id uuid; v_records jsonb;
begin
  select profile_id into v_profile_id from public.learning_sessions where token_hash=encode(digest(p_token,'sha256'),'hex') and expires_at>now() for update;
  if not found then return jsonb_build_object('ok',false,'session_expired',true,'error','Your cloud session expired. Please sign in again.'); end if;
  update public.learning_sessions set last_used_at=now(),expires_at=now()+interval '90 days' where token_hash=encode(digest(p_token,'sha256'),'hex');
  insert into public.learning_scores(profile_id,score_id,activity_date,activity_timestamp,grade,subject,revision,path_day,path_start,variant,unit,score,correct,total)
  select v_profile_id,left(x.id,100),x.date,x.timestamp,x.grade,x.subject,left(coalesce(x.revision,'legacy'),40),x.path_day,x.path_start,coalesce(x.variant,0),left(coalesce(x.unit,''),120),x.score,x.correct,x.total
  from jsonb_to_recordset(coalesce(p_records,'[]'::jsonb)) as x(id text,date date,timestamp bigint,grade smallint,subject text,revision text,path_day smallint,path_start date,variant integer,unit text,score smallint,correct smallint,total smallint)
  where x.id is not null and char_length(x.id)>=8 and x.grade in (1,2) and x.subject in ('math','english','science') and x.score between 0 and 100 and x.total between 1 and 100 and x.correct between 0 and x.total
  on conflict (profile_id,activity_timestamp,grade,subject) do update set score=excluded.score,correct=excluded.correct,total=excluded.total,revision=excluded.revision,path_day=excluded.path_day,path_start=excluded.path_start,variant=excluded.variant,unit=excluded.unit;
  select coalesce(jsonb_agg(jsonb_build_object('id',score_id,'activity_date',activity_date,'activity_timestamp',activity_timestamp,'grade',grade,'subject',subject,'revision',revision,'path_day',path_day,'path_start',path_start,'variant',variant,'unit',unit,'score',score,'correct',correct,'total',total) order by activity_timestamp),'[]'::jsonb') into v_records from public.learning_scores where profile_id=v_profile_id;
  return jsonb_build_object('ok',true,'records',v_records);
end $$;

grant execute on function public.create_learning_profile(text,text,text), public.login_learning_profile(text,text,text), public.sync_learning_scores(text,jsonb) to anon, authenticated;
