const BASE = "https://questathon.aihackerscollective.com/api/public/v1";

export async function GET() {
  try {
    const res = await fetch(`${BASE}/signals`, {
      headers: { Authorization: `Bearer ${process.env.AQ_TOKEN}` },
      cache: "no-store",
    });
    const data = await res.json();
    return Response.json({ success: true, data });
  } catch (e) {
    return Response.json({ success: false, error: e.message }, { status: 500 });
  }
}
