import { readFileSync } from "fs";
import { join } from "path";

let cached = null;
let cachedAt = 0;

export async function GET() {
  try {
    const token = "aq1.1dacf9b4-7a8f-4b53-bb35-cae85e383103.XtXYdLCX7UGbXD-DK3AQViyqdN6cfuBi";
    const now = Date.now();

    // Use cache for 65 seconds
    if (cached && now - cachedAt < 65000) {
      return Response.json({ success: true, data: cached, cached: true });
    }

    try {
      const res = await fetch(
        "https://questathon.aihackerscollective.com/api/public/v1/export",
        { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" }
      );
      const text = await res.text();
      const data = JSON.parse(text);

      if (data.error || !data.accounts) {
        // Return cache if available
        if (cached) return Response.json({ success: true, data: cached, cached: true });
        // Fall back to saved file
        const file = readFileSync(join(process.cwd(), "..", "data.json"), "utf8");
        const fileData = JSON.parse(file);
        return Response.json({ success: true, data: fileData, cached: true });
      }

      cached = data;
      cachedAt = now;
      return Response.json({ success: true, data: cached });

    } catch (fetchErr) {
      if (cached) return Response.json({ success: true, data: cached, cached: true });
      return Response.json({ success: false, error: fetchErr.message });
    }

  } catch (e) {
    return Response.json({ success: false, error: e.message }, { status: 500 });
  }
}