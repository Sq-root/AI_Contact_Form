import { createClient, SupabaseClient } from "@supabase/supabase-js";

let _client: SupabaseClient | null = null;

export function getSupabase() {
  if (!_client) {
    _client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
  }
  return _client;
}

export async function uploadImage(file: File, path: string): Promise<string> {
  const { data, error } = await getSupabase()
    .storage
    .from("apl-uploads")
    .upload(path, file, { upsert: false, cacheControl: "3600" });

  if (error) throw new Error(error.message);

  const { data: { publicUrl } } = getSupabase()
    .storage
    .from("apl-uploads")
    .getPublicUrl(data.path);

  return publicUrl;
}

/*
  ── Supabase setup ────────────────────────────────────────────────────────────

  1. Create table:

    create table registrations (
      id             uuid        default gen_random_uuid() primary key,
      full_name      text        not null,
      phone          text        not null,
      field_of_study text        not null,
      batting_style  text        not null,
      bowling_style  text        not null,
      reference_name text        not null,
      sabha_like     text        not null,
      other_topics   text,
      image_urls     text[]      default '{}',
      created_at     timestamptz default now()
    );

    create policy "allow anon insert"
    on registrations for insert to anon with check (true);

  2. Create Storage bucket named "apl-uploads":
     - Set bucket to PUBLIC
     - Add a policy allowing anon uploads:

    create policy "allow anon upload"
    on storage.objects for insert to anon
    with check (bucket_id = 'apl-uploads');
*/
