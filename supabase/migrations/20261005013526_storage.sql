-- ============================================
-- RENOMBRAR COLUMNAS: guardamos rutas, no URLs
-- ============================================
alter table public.profiles rename column avatar_url to avatar_path;
alter table public.profiles rename column banner_url to banner_path;
alter table public.projects rename column cover_url to cover_path;

-- Límite de tamaño por tipo en devlog_media:
-- imágenes y GIFs hasta 5 MB, modelos 3D hasta 10 MB
alter table public.devlog_media
  add constraint devlog_media_size_by_type check (
    (type = 'model' and size_bytes <= 10485760)
    or (type in ('image', 'gif') and size_bytes <= 5242880)
  );

-- ============================================
-- BUCKETS (todos privados)
-- ============================================
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('avatars', 'avatars', false, 2097152,
    array['image/png', 'image/jpeg', 'image/webp', 'image/gif']),
  ('banners', 'banners', false, 5242880,
    array['image/png', 'image/jpeg', 'image/webp', 'image/gif']),
  ('covers', 'covers', false, 5242880,
    array['image/png', 'image/jpeg', 'image/webp', 'image/gif']),
  ('devlog-media', 'devlog-media', false, 10485760,
    array['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'model/gltf-binary']);

-- ============================================
-- FUNCIÓN AUXILIAR: extraer un uuid de la ruta
-- ============================================
-- Ejemplo: 'abc.../def.../foto.webp' con p_index = 2 devuelve 'def...'
-- Si ese segmento no es un uuid válido, devuelve null en vez de fallar.
create or replace function public.path_segment_uuid(p_name text, p_index int)
returns uuid
language plpgsql
stable
set search_path = ''
as $$
begin
  return ((storage.foldername(p_name))[p_index])::uuid;
exception
  when invalid_text_representation then
    return null;
end;
$$;

-- ============================================
-- LECTURA
-- ============================================
create policy "Avatars, banners and covers are readable by everyone"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id in ('avatars', 'banners', 'covers'));

create policy "Devlog media readable if devlog is published or owned"
  on storage.objects for select
  to anon, authenticated
  using (
    bucket_id = 'devlog-media'
    and (
      public.is_devlog_published(public.path_segment_uuid(name, 2))
      or public.owns_devlog(public.path_segment_uuid(name, 2))
    )
  );

-- ============================================
-- SUBIDA
-- ============================================
create policy "Users can upload their own avatar and banner"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id in ('avatars', 'banners')
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy "Owners can upload project covers"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'covers'
    and (storage.foldername(name))[1] = (select auth.uid())::text
    and public.owns_project(public.path_segment_uuid(name, 2))
  );

create policy "Owners can upload devlog media"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'devlog-media'
    and (storage.foldername(name))[1] = (select auth.uid())::text
    and public.owns_devlog(public.path_segment_uuid(name, 2))
  );

-- ============================================
-- BORRADO
-- ============================================
create policy "Users can delete files in their own folder"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id in ('avatars', 'banners', 'covers', 'devlog-media')
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );