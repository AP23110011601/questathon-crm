export async function GET() {
  try {
    const token = "aq1.1dacf9b4-7a8f-4b53-bb35-cae85e383103.XtXYdLCX7UGbXD-DK3AQViyqdN6cfuBi";
    
    const res = await fetch(
      "https://questathon.aihackerscollective.com/api/public/v1/export",
      {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      }
    );
    
    const text = await res.text();
    const data = JSON.parse(text);
    return Response.json({ success: true, data });
  } catch (e) {
    return Response.json({ success: false, error: e.message }, { status: 500 });
  }
}