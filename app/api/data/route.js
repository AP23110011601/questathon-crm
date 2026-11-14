let cached = null;
let cachedAt = 0;
const TOKEN = "aq1.1dacf9b4-7a8f-4b53-bb35-cae85e383103.XtXYdLCX7UGbXD-DK3AQViyqdN6cfuBi";

export async function GET() {
  const now = Date.now();
  
  // Serve cache if fresh
  if (cached && now - cachedAt < 62000) {
    return Response.json({ success: true, data: cached });
  }

  try {
    const res = await fetch(
      "https://questathon.aihackerscollective.com/api/public/v1/export",
      { headers: { Authorization: `Bearer ${TOKEN}` }, cache: "no-store" }
    );
    const data = await res.json();
    
    if (data.accounts) {
      cached = data;
      cachedAt = now;
      return Response.json({ success: true, data: cached });
    }
    
    // Rate limited — return old cache
    if (cached) return Response.json({ success: true, data: cached });
    return Response.json({ success: false, error: data.error });
    
  } catch(e) {
    if (cached) return Response.json({ success: true, data: cached });
    return Response.json({ success: false, error: e.message });
  }
}