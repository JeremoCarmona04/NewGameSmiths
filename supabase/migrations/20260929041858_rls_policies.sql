-- ============================================
-- FUNCIONES AUXILIARES DE PERMISOS
-- ============================================

-- ¿El usuario actual es dueño de este proyecto?
create or replace function public.owns_project(p_project_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.projects
    where id = p_project_id
      and owner_id = (select auth.uid())
  );
$$;

-- ¿El usuario actual es dueño del proyecto al que pertenece este devlog?
create or replace function public.owns_devlog(p_devlog_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.devlogs d
    join public.projects p on p.id = d.project_id
    where d.id = p_devlog_id
      and p.owner_id = (select auth.uid())
  );
$$;

-- ¿Este devlog está publicado?
create or replace function public.is_devlog_published(p_devlog_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.devlogs
    where id = p_devlog_id
      and status = 'published'
  );
$$;

-- ============================================
-- PROFILES
-- ============================================
create policy "Profiles are viewable by everyone"
  on public.profiles for select
  to anon, authenticated
  using (true);

create policy "Users can update their own profile"
  on public.profiles for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- ============================================
-- PROJECTS
-- ============================================
create policy "Projects are viewable by everyone"
  on public.projects for select
  to anon, authenticated
  using (true);

create policy "Users can create their own projects"
  on public.projects for insert
  to authenticated
  with check (owner_id = (select auth.uid()));

create policy "Owners can update their projects"
  on public.projects for update
  to authenticated
  using (owner_id = (select auth.uid()))
  with check (owner_id = (select auth.uid()));

create policy "Owners can delete their projects"
  on public.projects for delete
  to authenticated
  using (owner_id = (select auth.uid()));

-- ============================================
-- DEVLOGS
-- ============================================
create policy "Published devlogs are public, drafts only for owner"
  on public.devlogs for select
  to anon, authenticated
  using (status = 'published' or public.owns_project(project_id));

create policy "Owners can create devlogs in their projects"
  on public.devlogs for insert
  to authenticated
  with check (public.owns_project(project_id));

create policy "Owners can update their devlogs"
  on public.devlogs for update
  to authenticated
  using (public.owns_project(project_id))
  with check (public.owns_project(project_id));

create policy "Owners can delete their devlogs"
  on public.devlogs for delete
  to authenticated
  using (public.owns_project(project_id));

-- ============================================
-- DEVLOG_MEDIA
-- ============================================
create policy "Media visible if devlog is visible"
  on public.devlog_media for select
  to anon, authenticated
  using (public.is_devlog_published(devlog_id) or public.owns_devlog(devlog_id));

create policy "Owners can add media to their devlogs"
  on public.devlog_media for insert
  to authenticated
  with check (public.owns_devlog(devlog_id));

create policy "Owners can update media of their devlogs"
  on public.devlog_media for update
  to authenticated
  using (public.owns_devlog(devlog_id))
  with check (public.owns_devlog(devlog_id));

create policy "Owners can delete media of their devlogs"
  on public.devlog_media for delete
  to authenticated
  using (public.owns_devlog(devlog_id));

-- ============================================
-- COMMENTS
-- ============================================
create policy "Comments on published devlogs are public"
  on public.comments for select
  to anon, authenticated
  using (public.is_devlog_published(devlog_id));

create policy "Users can comment on published devlogs"
  on public.comments for insert
  to authenticated
  with check (
    author_id = (select auth.uid())
    and public.is_devlog_published(devlog_id)
  );

create policy "Authors or devlog owners can delete comments"
  on public.comments for delete
  to authenticated
  using (
    author_id = (select auth.uid())
    or public.owns_devlog(devlog_id)
  );