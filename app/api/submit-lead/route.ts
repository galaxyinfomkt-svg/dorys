// Server-side lead submission endpoint.
//
// Why this exists:
//   - The GHL Private Integration Token (PIT) MUST stay server-side.
//     If we embedded it in a client component, every browser would see it
//     in the JS bundle and any visitor could read/modify Dory's GHL data.
//   - This route accepts JSON from a custom HTML form (future migration),
//     validates the input, then calls GHL's Contacts API with the PIT
//     stored in a Vercel env var (GHL_PIT).
//
// Current use:
//   The home and location pages still embed the GHL iframe directly,
//   so this route is unused in production yet. It's wired and tested so
//   the moment we replace the iframe with a fully custom form (when the
//   admin adds the service dropdown in GHL UI), the lead path is ready.

import { NextResponse } from "next/server"

const GHL_API_BASE = "https://services.leadconnectorhq.com"
const GHL_API_VERSION = "2021-07-28"

type LeadPayload = {
  firstName: string
  lastName?: string
  email: string
  phone: string
  city?: string
  service?: string
  facilityType?: string
  message?: string
}

function isValidPayload(input: unknown): input is LeadPayload {
  if (typeof input !== "object" || input === null) return false
  const p = input as Record<string, unknown>
  return (
    typeof p.firstName === "string" && p.firstName.length > 0 &&
    typeof p.email === "string" && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(p.email) &&
    typeof p.phone === "string" && p.phone.replace(/\D/g, "").length >= 10
  )
}

export async function POST(req: Request) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  if (!isValidPayload(body)) {
    return NextResponse.json(
      { error: "Missing or invalid required fields: firstName, email, phone" },
      { status: 400 }
    )
  }

  const pit = process.env.GHL_PIT
  const locationId = process.env.GHL_LOCATION_ID || "BQd0L6DeFvVbjKS8VYZ9"

  if (!pit) {
    // Don't leak that GHL is misconfigured to the caller; log it server-side.
    console.error("[submit-lead] GHL_PIT env var missing")
    return NextResponse.json(
      { error: "Lead submission temporarily unavailable. Please call (978) 307-8107." },
      { status: 503 }
    )
  }

  const lead = body
  const ghlPayload = {
    firstName: lead.firstName,
    lastName: lead.lastName ?? "",
    email: lead.email,
    phone: lead.phone,
    locationId,
    source: "website",
    tags: [
      "website-lead",
      ...(lead.service ? [`service:${lead.service}`] : []),
      ...(lead.city ? [`city:${lead.city}`] : []),
    ],
    customFields: [
      ...(lead.city ? [{ key: "city", field_value: lead.city }] : []),
      ...(lead.service ? [{ key: "service_type", field_value: lead.service }] : []),
      ...(lead.facilityType ? [{ key: "facility_type", field_value: lead.facilityType }] : []),
      ...(lead.message ? [{ key: "message", field_value: lead.message }] : []),
    ],
  }

  try {
    const res = await fetch(`${GHL_API_BASE}/contacts/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${pit}`,
        Version: GHL_API_VERSION,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(ghlPayload),
    })

    if (!res.ok) {
      const text = await res.text().catch(() => "")
      console.error("[submit-lead] GHL non-OK response", res.status, text.slice(0, 300))
      // Always return a friendly message; don't surface GHL internals to clients.
      return NextResponse.json(
        { error: "Could not submit. Please try again or call (978) 307-8107." },
        { status: 502 }
      )
    }

    const data = (await res.json().catch(() => ({}))) as { contact?: { id?: string } }
    return NextResponse.json({ ok: true, contactId: data?.contact?.id })
  } catch (err) {
    console.error("[submit-lead] network error", err)
    return NextResponse.json(
      { error: "Network error. Please try again or call (978) 307-8107." },
      { status: 502 }
    )
  }
}
