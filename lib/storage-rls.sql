-- Allow authenticated users to upload into specific buckets
create policy "auth can upload general photos"
on storage.objects for insert
to authenticated
with check (bucket_id = 'general-photos');

create policy "auth can upload fraction photos"
on storage.objects for insert
to authenticated
with check (bucket_id = 'fraction-photos');

create policy "auth can upload material photos"
on storage.objects for insert
to authenticated
with check (bucket_id = 'material-photos');


-- Optional but recommended: allow users to update/delete ONLY their own uploads
create policy "owner can update general photos"
on storage.objects for update
to authenticated
using (bucket_id = 'general-photos' and owner = auth.uid())
with check (bucket_id = 'general-photos' and owner = auth.uid());

create policy "owner can delete general photos"
on storage.objects for delete
to authenticated
using (bucket_id = 'general-photos' and owner = auth.uid());


create policy "owner can update fraction photos"
on storage.objects for update
to authenticated
using (bucket_id = 'fraction-photos' and owner = auth.uid())
with check (bucket_id = 'fraction-photos' and owner = auth.uid());

create policy "owner can delete fraction photos"
on storage.objects for delete
to authenticated
using (bucket_id = 'fraction-photos' and owner = auth.uid());


create policy "owner can update material photos"
on storage.objects for update
to authenticated
using (bucket_id = 'material-photos' and owner = auth.uid())
with check (bucket_id = 'material-photos' and owner = auth.uid());

create policy "owner can delete material photos"
on storage.objects for delete
to authenticated
using (bucket_id = 'material-photos' and owner = auth.uid());