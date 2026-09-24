-- Run once after deploying the Grade 1–8 + VE release.
-- Existing profiles, sessions and scores are preserved.
alter table public.learning_scores
  drop constraint if exists learning_scores_grade_check;

alter table public.learning_scores
  add constraint learning_scores_grade_check
  check (grade in (1,2,3,4,5,6,7,8,106,107,108));

create or replace function public.sync_learning_scores(p_token text, p_records jsonb default '[]'::jsonb)
returns jsonb language plpgsql security definer set search_path = public, extensions as $$
declare v_profile_id uuid; v_records jsonb;
begin
  select profile_id into v_profile_id from public.learning_sessions
  where token_hash=encode(digest(p_token,'sha256'),'hex') and expires_at>now() for update;
  if not found then
    return jsonb_build_object('ok',false,'session_expired',true,'error','Your cloud session expired. Please sign in again.');
  end if;

  update public.learning_sessions set last_used_at=now(),expires_at=now()+interval '90 days'
  where token_hash=encode(digest(p_token,'sha256'),'hex');

  if jsonb_typeof(coalesce(p_records,'[]'::jsonb)) <> 'array'
     or jsonb_array_length(coalesce(p_records,'[]'::jsonb)) > 5000 then
    return jsonb_build_object('ok',false,'error','Invalid score list.');
  end if;

  insert into public.learning_scores
    (profile_id,score_id,activity_date,activity_timestamp,grade,subject,revision,path_day,path_start,variant,unit,score,correct,total)
  select v_profile_id,left(x.id,100),x.date,x.timestamp,x.grade,x.subject,
    left(coalesce(x.revision,'legacy'),40),
    case when x.path_day between 1 and 365 then x.path_day else null end,
    x.path_start,greatest(coalesce(x.variant,0),0),left(coalesce(x.unit,''),120),
    x.score,x.correct,x.total
  from jsonb_to_recordset(coalesce(p_records,'[]'::jsonb)) as x
    (id text,date date,timestamp bigint,grade smallint,subject text,revision text,
     path_day smallint,path_start date,variant integer,unit text,score smallint,correct smallint,total smallint)
  where x.id is not null and char_length(x.id)>=8 and x.timestamp>0
    and x.grade in (1,2,3,4,5,6,7,8,106,107,108)
    and x.subject in ('math','english','science') and x.score between 0 and 100
    and x.total between 1 and 100 and x.correct between 0 and x.total
  on conflict (profile_id,score_id) do update set
    score=excluded.score,correct=excluded.correct,total=excluded.total,
    revision=excluded.revision,path_day=excluded.path_day,path_start=excluded.path_start,
    variant=excluded.variant,unit=excluded.unit;

  select jsonb_agg(jsonb_build_object(
    'id',score_id,'activity_date',activity_date,'activity_timestamp',activity_timestamp,
    'grade',grade,'subject',subject,'revision',revision,'path_day',path_day,
    'path_start',path_start,'variant',variant,'unit',unit,'score',score,
    'correct',correct,'total',total
  ) order by activity_timestamp)
  into v_records from public.learning_scores where profile_id=v_profile_id;

  return jsonb_build_object('ok',true,'records',coalesce(v_records,'[]'::jsonb));
exception when others then
  return jsonb_build_object('ok',false,'error','Score sync database error: ' || left(sqlerrm,180));
end $$;

revoke all on function public.sync_learning_scores(text,jsonb) from public;
grant execute on function public.sync_learning_scores(text,jsonb) to anon, authenticated;
