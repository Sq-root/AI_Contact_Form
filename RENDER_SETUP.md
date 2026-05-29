# Render PostgreSQL + Vercel Setup

This project now uses a shared PostgreSQL database instead of Supabase for registration storage.

## Final Architecture

1. Vercel hosts the Next.js external UI.
2. The Next.js route `POST /api/register` writes into Render PostgreSQL.
3. Spring Boot admin APIs read the same Render PostgreSQL tables.

## Important Clarification

For Phase A, this external UI does **not** need your Render backend URL to submit registrations.

Why:

1. The UI calls its own Next.js API route.
2. That route talks directly to PostgreSQL.
3. Spring Boot reads the same tables separately.

So the required production connection for this repo is:

1. `DATABASE_URL`
2. `PGSSLMODE=require`

The new external admin page at `/admin` **does** call your Spring Boot backend for:

1. admin login
2. external registration list
3. payment status updates
4. WhatsApp export

The external success screen now also calls your Spring Boot backend for:

5. user-side payment claim confirmation

So the admin page also needs:

3. `NEXT_PUBLIC_API_BASE_URL`

Your Spring Boot Render service must also allow the external UI origin in CORS through
`APP_CORS_ALLOWED_ORIGINS`.

## SQL To Run On Render PostgreSQL

Run:

- `database/render-postgres-setup.sql`

If you are using the Render shell or SQL console, paste the full contents of that file and execute it once.

## Vercel Environment Variables

Set these in the Vercel project for this external UI:

```bash
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DBNAME?sslmode=require
PGSSLMODE=require
DATABASE_POOL_MAX=5
DATABASE_CONNECTION_TIMEOUT_MS=10000
DATABASE_IDLE_TIMEOUT_MS=30000
NEXT_PUBLIC_SITE_URL=https://your-vercel-project.vercel.app
NEXT_PUBLIC_API_BASE_URL=https://probodham-cricket-registration.onrender.com
NEXT_PUBLIC_UPI_ID=sondagarchirag01-2@okicici
NEXT_PUBLIC_UPI_PAYEE_NAME=CHIRAG RATILAL SONDAGAR
NEXT_PUBLIC_UPI_AMOUNT=500
NEXT_PUBLIC_UPI_NOTE_PREFIX=APL Reg
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your-upload-preset
```

## Render Backend CORS

Update the Spring Boot Render service env so `APP_CORS_ALLOWED_ORIGINS` includes:

1. the main PCL frontend origin
2. the external UI Vercel origin
3. localhost origins if you still test locally

Example:

```bash
APP_CORS_ALLOWED_ORIGINS=https://probodham-cricket-registration.vercel.app,https://your-external-ui.vercel.app,http://localhost:5173,http://localhost:3000
```

## Local Development Variables

For local PostgreSQL, use:

```bash
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/probodham_cricket
PGSSLMODE=disable
```

## Tables Created

1. `external_player_registrations`
2. `external_registration_status`
3. `external_registration_mappings`

## Payment Support In Phase A

Payment is intentionally stored outside the source-data table structure:

1. `external_player_registrations`
   - source registration data
2. `external_registration_status`
   - payment claimed
   - payment reference number
   - payment verified
   - admin notes
3. `external_registration_mappings`
   - source-to-internal linkage

## Production Check

After setup, verify:

1. a new external registration creates one row in `external_player_registrations`
2. the same id creates one row in `external_registration_status`
3. the same id creates one row in `external_registration_mappings`
4. Spring admin `GET /api/admin/external-registrations` returns the record
