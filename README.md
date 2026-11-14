# FlytBase Account Quest CRM

Live CRM for Questathon by AI Hackers Collective — Kusumanjali.

## Accounts Covered
- **Account A**: Eastern Counties Police Alliance
- **Account B**: Aldermoor Industrial Group

## How to Run Locally

```bash
npm install
echo "AQ_TOKEN=your_token_here" > .env.local
npm run dev
# open http://localhost:3000
```

## Deploy to Vercel
1. Push to GitHub (public, no token in code)
2. Import on vercel.com
3. Add env var: AQ_TOKEN=your_token
4. Deploy!

## Features
- All 5 CSM questions answered for both accounts
- Every number traced to source ID
- Live signals auto-refresh every 60s
- Write notes back via API
- Token server-side only
