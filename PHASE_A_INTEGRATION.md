# Phase A Integration

This repo now writes registrations into the shared PostgreSQL database instead of Supabase.

## Tables

1. `external_player_registrations`
   - stores the source-system registration exactly as this UI collects it
   - keeps fields like `field_of_study`, `sabha_like`, and `image_urls` without forcing them into the Spring canonical table

2. `external_registration_mappings`
   - links one external record to a future canonical `player_registrations` row
   - starts with `sync_status = 'EXTERNAL_ONLY'`

3. `external_registration_status`
   - stores operational workflow fields used by admin/payment flows
   - current payment fields:
     - `payment_claimed`
     - `payment_reference_number`
     - `payment_claimed_at`
     - `payment_done`
     - `payment_marked_at`
     - `admin_notes`

## Current Registration Flow

1. User submits the Next.js registration form.
2. `POST /api/register` validates the request.
3. The route inserts one row into `external_player_registrations`.
4. The route creates a default row in `external_registration_status`.
5. The route creates a row in `external_registration_mappings` with:
   - `source_system = 'AI_CONTACT_FORM'`
   - `external_table = 'external_player_registrations'`
   - `sync_status = 'EXTERNAL_ONLY'`
6. The route returns the external registration id.

## Payment Meaning In Phase A

Phase A does **not** force an external record into `player_registrations`.

Instead:

- source data stays in `external_player_registrations`
- payment/admin workflow lives in `external_registration_status`
- mapping to canonical records is deferred until business rules are clear

### Payment states

1. `payment_claimed = false`, `payment_done = false`
   - external registration exists
   - no payment confirmation from the user yet

2. `payment_claimed = true`, `payment_done = false`
   - user says payment was made
   - optional `payment_reference_number` can be stored
   - admin still needs to verify

3. `payment_done = true`
   - admin verified payment
   - `payment_marked_at` should be set by the admin-side workflow

## What Spring Admin Panel Should Read Later

For external registrations, the Spring app should read:

- `external_player_registrations`
- `external_registration_status`
- `external_registration_mappings`

Then expose a normalized admin DTO/view so the UI can show:

- source type
- external id
- player name
- phone
- reference name
- payment status
- payment reference number
- mapping status

## Next Suggested Step

Add Spring Boot read/update APIs for:

1. listing external registrations with joined payment/mapping state
2. marking `payment_claimed`
3. marking `payment_done`
4. attaching an external record to an internal `player_registrations` row when needed
