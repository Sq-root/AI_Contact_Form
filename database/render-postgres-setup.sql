create extension if not exists pgcrypto;

create table if not exists external_player_registrations (
  id uuid default gen_random_uuid() primary key,
  source_system text not null default 'AI_CONTACT_FORM',

  full_name text not null,
  phone text not null,
  field_of_study text not null,

  batting_style text not null,
  bowling_style text not null,
  reference_name text not null,
  playing_role text not null,

  sabha_like text not null,
  other_topics text,
  image_urls text[] default '{}',

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create unique index if not exists ux_external_player_registrations_source_phone
  on external_player_registrations (source_system, phone);

create table if not exists external_registration_mappings (
  id uuid default gen_random_uuid() primary key,
  source_system text not null,
  external_table text not null default 'external_player_registrations',
  external_record_id uuid not null,
  internal_registration_id bigint,
  sync_status text not null default 'EXTERNAL_ONLY',
  sync_error text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  constraint uq_external_registration_mapping unique (source_system, external_record_id)
);

create table if not exists external_registration_status (
  id uuid default gen_random_uuid() primary key,
  external_registration_id uuid not null unique
    references external_player_registrations(id) on delete cascade,
  payment_claimed boolean not null default false,
  payment_reference_number text,
  payment_claimed_at timestamptz,
  payment_done boolean not null default false,
  payment_marked_at timestamptz,
  admin_notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
