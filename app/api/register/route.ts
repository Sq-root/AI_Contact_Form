import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

/* ─── Server-side Supabase ────────────────────────────────────────────────────
   Uses the Service Role key when set — it bypasses RLS entirely, so the
   insert never fails due to a missing policy.
   Falls back to the Anon key so the app still works during local dev if you
   haven't added SUPABASE_SERVICE_ROLE_KEY yet.
   IMPORTANT: SUPABASE_SERVICE_ROLE_KEY must NOT be prefixed with NEXT_PUBLIC_.
   It is only ever used here on the server and is never sent to the browser.
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
  fullName:      string;
  phone:         string;
  fieldOfStudy:  string;   // already resolved: "Other" text replaced by client
  battingStyle:  string;
  bowlingStyle:  string;
  referenceName: string;
  sabhaLike:     string;   // already resolved
  otherTopics?:  string;
  imageUrls?:    string[];
}

/* ─── Server-side validation (second layer after client-side) ─────────────── */

function serverValidate(b: RegisterPayload): string | null {
  if (!b.fullName?.trim())       return "Full name is required.";
  const phone = (b.phone ?? "").replace(/[\s\-()+]/g, "");
  if (!/^(91|0)?[6-9]\d{9}$/.test(phone))
                                 return "Enter a valid 10-digit Indian mobile number.";
  if (!b.fieldOfStudy?.trim())   return "Field of study is required.";
  if (!b.battingStyle)           return "Batting style is required.";
  if (!b.bowlingStyle)           return "Bowling style is required.";
  if (!b.referenceName?.trim())  return "Reference name is required.";
  if (!b.sabhaLike)              return "Sabha preference is required.";
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
      full_name:      body.fullName.trim(),
      phone:          body.phone.trim(),
      field_of_study: body.fieldOfStudy.trim(),
      batting_style:  body.battingStyle,
      bowling_style:  body.bowlingStyle,
      reference_name: body.referenceName.trim(),
      sabha_like:     body.sabhaLike,
      other_topics:   body.otherTopics?.trim() || null,
      image_urls:     body.imageUrls ?? [],
    })
    .select("id")      // return the new row id so client can reference it
    .single();

  /* ── 4. Handle Supabase errors ────────────────────────────────────────── */
  if (error) {
    console.error("[POST /api/register] Supabase error:", error);

    // Unique constraint on phone — already registered
    if (error.code === "23505") {
      return NextResponse.json(
        { error: "This phone number is already registered." },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { error: "Registration failed. Please try again." },
      { status: 500 },
    );
  }

  /* ── 5. Return success ────────────────────────────────────────────────── */
  return NextResponse.json({ success: true, id: data.id }, { status: 201 });
}
