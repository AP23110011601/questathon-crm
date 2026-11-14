const BASE = "https://questathon.aihackerscollective.com/api/public/v1";

export async function POST(req) {
  try {
    const body = await req.json();
    const res = await fetch(`${BASE}/notes`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.AQ_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const text = await res.text();
    const data = JSON.parse(text);
    if (data.error) {
      return Response.json({ success: false, error: data.error });
    }
    return Response.json({ success: true, data });
  } catch (e) {
    return Response.json({ success: false, error: e.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const res = await fetch(`${BASE}/notes`, {
      headers: { Authorization: `Bearer ${process.env.AQ_TOKEN}` },
      cache: "no-store",
    });
    const data = await res.json();
    return Response.json({ success: true, data });
  } catch (e) {
    return Response.json({ success: false, error: e.message }, { status: 500 });
  }
}