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

/*
  ── Supabase setup (database only — image hosting is on Cloudinary) ──────────

  STEP A — Create the registrations table (run once in SQL Editor):

    create table if not exists registrations (
      id             uuid        default gen_random_uuid() primary key,
      -- Step 1: Personal
      full_name      text        not null,
      phone          text        not null unique,
      field_of_study text        not null,
      -- Step 2: Cricket
      batting_style  text        not null,
      bowling_style  text        not null,
      reference_name text        not null,
      playing_role   text        not null,
      -- Step 3: Sabha
      sabha_like     text        not null,
      other_topics   text,
      -- Step 4: AI Avatar (Cloudinary URLs)
      image_urls     text[]      default '{}',
      created_at     timestamptz default now()
    );

    alter table registrations enable row level security;

    create policy "allow anon insert"
    on registrations for insert to anon with check (true);

  STEP B — .env.local keys needed:
    NEXT_PUBLIC_SUPABASE_URL=...
    NEXT_PUBLIC_SUPABASE_ANON_KEY=...
    SUPABASE_SERVICE_ROLE_KEY=...                  (server-only, no NEXT_PUBLIC_ prefix)

    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=...
    NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=...

    GEMINI_API_KEY=...                             (server-only, no NEXT_PUBLIC_ prefix)
*/