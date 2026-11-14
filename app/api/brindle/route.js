let cache = null;
let cachedAt = 0;
const CACHE_MS = 300000;
const TOKEN = "aq1.1dacf9b4-7a8f-4b53-bb35-cae85e383103.XtXYdLCX7UGbXD-DK3AQViyqdN6cfuBi";
const BASE = "https://questathon.aihackerscollective.com/api/public/v1";

export async function GET() {
  const now = Date.now();
  if (cache && now - cachedAt < CACHE_MS) {
    return Response.json({ success: true, data: cache });
  }
  try {
    const res = await fetch(`${BASE}/drops/H`, {
      headers: { Authorization: `Bearer ${TOKEN}` },
      cache: "no-store",
    });
    const data = await res.json();
    if (data.accounts) {
      cache = data;
      cachedAt = now;
      return Response.json({ success: true, data: cache });
    }
    if (cache) return Response.json({ success: true, data: cache });
    return Response.json({ success: false, error: "No data" });
  } catch(e) {
    if (cache) return Response.json({ success: true, data: cache });
    return Response.json({ success: false, error: e.message });
  }
}