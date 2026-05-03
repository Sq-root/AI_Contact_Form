import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

/* ─── Server-side Supabase ────────────────────────────────────────────────────
   Uses the Service Role key when set — bypasses RLS entirely.
   Falls back to the Anon key during local dev if the service key isn't set yet.
   IMPORTANT: SUPABASE_SERVICE_ROLE_KEY must NOT be prefixed with NEXT_PUBLIC_.
────────────────────────────────────────────────────────────────────────────── */
function serverSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } },
  );
}

/* ─── Payload type ────────────────────────────────────────────────────────── */

interface RegisterPayload {
  /* Step 1 */
  fullName:      string;
  phone:         string;
  fieldOfStudy:  string;   // "Other" already resolved by client

  /* Step 2 */
  battingStyle:  string;
  bowlingStyle:  string;
  referenceName: string;
  playingRole:   string;

  /* Step 3 */
  sabhaLike:     string;   // comma-separated selections, joined on client
  otherTopics?:  string;

  /* Step 4 */
  imageUrls?:    string[];
}

/* ─── Server-side validation ──────────────────────────────────────────────── */

function serverValidate(b: RegisterPayload): string | null {
  if (!b.fullName?.trim())      return "Full name is required.";
  const phone = (b.phone ?? "").replace(/[\s\-()+]/g, "");
  if (!/^(91|0)?[6-9]\d{9}$/.test(phone))
                                return "Enter a valid 10-digit Indian mobile number.";
  if (!b.fieldOfStudy?.trim())  return "Field of study is required.";
  if (!b.battingStyle)          return "Batting style is required.";
  if (!b.bowlingStyle)          return "Bowling style is required.";
  if (!b.referenceName?.trim()) return "Reference name is required.";
  if (!b.playingRole)           return "Playing role is required.";
  if (!b.sabhaLike)             return "Sabha preference is required.";
  return null;
}

/* ─── POST /api/register ──────────────────────────────────────────────────── */

export async function POST(req: NextRequest) {
  /* ── 1. Parse ─────────────────────────────────────────────────────────── */
  let body: RegisterPayload;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  /* ── 2. Validate ──────────────────────────────────────────────────────── */
  const validationError = serverValidate(body);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 422 });
  }

  /* ── 3. Insert into Supabase ──────────────────────────────────────────── */
  const { data, error } = await serverSupabase()
    .from("registrations")
    .insert({
      full_name:        body.fullName.trim(),
      phone:            body.phone.trim(),
      field_of_study:   body.fieldOfStudy.trim(),
      batting_style:    body.battingStyle,
      bowling_style:    body.bowlingStyle,
      reference_name:   body.referenceName.trim(),
      playing_role:     body.playingRole,
      sabha_like:       body.sabhaLike,
      other_topics:     body.otherTopics?.trim()      || null,
      image_urls:       body.imageUrls ?? [],
    })
    .select("id")
    .single();

  /* ── 4. Handle Supabase errors ────────────────────────────────────────── */
  if (error) {
    console.error("[POST /api/register] Supabase error:", {
      code:    error.code,
      message: error.message,
      details: error.details,
      hint:    error.hint,
    });
    return NextResponse.json(
      {
        error: process.env.NODE_ENV === "development"
          ? `Supabase: ${error.message}${error.hint ? ` (hint: ${error.hint})` : ""}`
          : "Registration failed. Please try again.",
      },
      { status: 500 },
    );
  }

  /* ── 5. Return success ────────────────────────────────────────────────── */
  return NextResponse.json({ success: true, id: data.id }, { status: 201 });
}
