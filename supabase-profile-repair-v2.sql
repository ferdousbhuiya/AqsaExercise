-- Profile login repair v2. Safe to run without deleting profiles or scores.
-- This deliberately contains only the profile functions.
create schema if not exists extensions;
create extension if not exists pgcrypto with schema extensions;

create or replace function public.create_learning_profile(
  p_username text,
  p_pin text,
  p_display_name text default 'Aqsa'
)
returns jsonb
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_username text := lower(trim(p_username));
  v_profile public.learning_profiles;
  v_token uuid := gen_random_uuid();
begin
  if v_username !~ '^[a-z0-9][a-z0-9._-]{2,29}$' then
    return jsonb_build_object('ok', false, 'error', 'Invalid username.');
  end if;
  if p_pin !~ '^[0-9]{6,12}$' then
    return jsonb_build_object('ok', false, 'error', 'PIN must contain 6–12 digits.');
  end if;
  if exists(select 1 from public.learning_profiles where username = v_username) then
    return jsonb_build_object('ok', false, 'error', 'That username is already in use. Sign in or choose another.');
  end if;

  insert into public.learning_profiles(id, username, display_name, pin_hash)
  values (
    gen_random_uuid(),
    v_username,
    left(coalesce(nullif(trim(p_display_name), ''), 'Aqsa'), 40),
    crypt(p_pin, gen_salt('bf', 10))
  )
  returning * into v_profile;

  insert into public.learning_sessions(token_hash, profile_id)
  values (encode(digest(v_token::text, 'sha256'), 'hex'), v_profile.id);

  return jsonb_build_object(
    'ok', true,
    'token', v_token,
    'username', v_profile.username,
    'display_name', v_profile.display_name
  );
end;
$$;

create or replace function public.login_learning_profile(
  p_username text,
  p_pin text,
  p_display_name text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_profile public.learning_profiles;
  v_token uuid := gen_random_uuid();
begin
  select * into v_profile
  from public.learning_profiles
  where username = lower(trim(p_username))
  for update;

  if not found then
    return jsonb_build_object('ok', false, 'error', 'Incorrect username or PIN.');
  end if;
  if v_profile.locked_until is not null and v_profile.locked_until > now() then
    return jsonb_build_object('ok', false, 'error', 'Too many attempts. Try again in a few minutes.');
  end if;
  if crypt(p_pin, v_profile.pin_hash) <> v_profile.pin_hash then
    update public.learning_profiles
    set failed_attempts = failed_attempts + 1,
        locked_until = case when failed_attempts + 1 >= 5 then now() + interval '5 minutes' else null end
    where id = v_profile.id;
    return jsonb_build_object('ok', false, 'error', 'Incorrect username or PIN.');
  end if;

  update public.learning_profiles
  set failed_attempts = 0, locked_until = null
  where id = v_profile.id;

  delete from public.learning_sessions where expires_at < now();
  insert into public.learning_sessions(token_hash, profile_id)
  values (encode(digest(v_token::text, 'sha256'), 'hex'), v_profile.id);

  return jsonb_build_object(
    'ok', true,
    'token', v_token,
    'username', v_profile.username,
    'display_name', v_profile.display_name
  );
end;
$$;

revoke all on function public.create_learning_profile(text, text, text) from public;
revoke all on function public.login_learning_profile(text, text, text) from public;
grant execute on function public.create_learning_profile(text, text, text) to anon, authenticated;
grant execute on function public.login_learning_profile(text, text, text) to anon, authenticated;
