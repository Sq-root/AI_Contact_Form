import { NextRequest, NextResponse } from "next/server";
import { DatabaseError } from "pg";
import { getDb } from "@/lib/db";

const SOURCE_SYSTEM = "AI_CONTACT_FORM";

interface RegisterPayload {
  fullName: string;
  phone: string;
  address: string;
  battingStyle: string;
  bowlingStyle: string;
  referenceName: string;
  playingRole: string;
  imageUrls?: string[];
}

function normalizePhone(value: string) {
  return value.replace(/[\s\-()+]/g, "");
}

function serverValidate(body: RegisterPayload): string | null {
  if (!body.fullName?.trim()) {
    return "Full name is required.";
  }

  const phone = normalizePhone(body.phone ?? "");
  if (!/^(91|0)?[6-9]\d{9}$/.test(phone)) {
    return "Enter a valid 10-digit Indian mobile number.";
  }

  if (!body.address?.trim()) {
    return "Address is required.";
  }
  if (!body.battingStyle) {
    return "Batting style is required.";
  }
  if (!body.bowlingStyle) {
    return "Bowling style is required.";
  }
  if (!body.referenceName?.trim()) {
    return "Reference name is required.";
  }
  if (!body.playingRole) {
    return "Playing role is required.";
  }
  return null;
}

export async function POST(req: NextRequest) {
  let body: RegisterPayload;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const validationError = serverValidate(body);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 422 });
  }

  const normalizedPhone = normalizePhone(body.phone);
  const db = getDb();
  const client = await db.connect();
  const externalId = crypto.randomUUID();
  const statusId = crypto.randomUUID();
  const mappingId = crypto.randomUUID();
  const now = new Date();

  try {
    await client.query("begin");

    await client.query(
      `insert into external_player_registrations (
         id,
         source_system,
         full_name,
         phone,
         field_of_study,
         batting_style,
         bowling_style,
         reference_name,
         playing_role,
         sabha_like,
         other_topics,
         image_urls,
         created_at,
         updated_at
       ) values (
         $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14
       )`,
      [
        externalId,
        SOURCE_SYSTEM,
        body.fullName.trim(),
        normalizedPhone,
        body.address.trim(),
        body.battingStyle,
        body.bowlingStyle,
        body.referenceName.trim(),
        body.playingRole,
        "Tournament registration",
        null,
        Array.isArray(body.imageUrls) ? body.imageUrls : [],
        now,
        now
      ]
    );

    await client.query(
      `insert into external_registration_status (
         id,
         external_registration_id,
         payment_claimed,
         payment_reference_number,
         payment_claimed_at,
         payment_done,
         payment_marked_at,
         admin_notes,
         created_at,
         updated_at
       ) values ($1, $2, false, null, null, false, null, null, $3, $4)`,
      [statusId, externalId, now, now]
    );

    await client.query(
      `insert into external_registration_mappings (
         id,
         source_system,
         external_table,
         external_record_id,
         internal_registration_id,
         sync_status,
         sync_error,
         created_at,
         updated_at
       ) values ($1, $2, 'external_player_registrations', $3, null, 'EXTERNAL_ONLY', null, $4, $5)`,
      [mappingId, SOURCE_SYSTEM, externalId, now, now]
    );

    await client.query("commit");

    return NextResponse.json({ success: true, id: externalId }, { status: 201 });
  } catch (error) {
    await client.query("rollback");

    const dbError = error as DatabaseError;
    if (dbError.code === "23505") {
      return NextResponse.json(
        { error: "This phone number is already registered in the external player system." },
        { status: 409 }
      );
    }

    console.error("[POST /api/register] PostgreSQL error:", error);

    return NextResponse.json(
      {
        error:
          process.env.NODE_ENV === "development"
            ? `PostgreSQL: ${dbError.message || "Unknown database error"}`
            : "Registration failed. Please try again."
      },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
