import fs from 'fs';

const envContent = fs.readFileSync('.env', 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
  const parts = line.split('=');
  if (parts.length >= 2) {
    env[parts[0].trim()] = parts.slice(1).join('=').trim();
  }
});

async function run() {
  const url = `${env.VITE_SUPABASE_URL}/rest/v1/settings?select=*`;
  try {
    const res = await fetch(url, {
      headers: {
        'apikey': env.VITE_SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${env.VITE_SUPABASE_ANON_KEY}`,
        'Accept': 'text/csv'
      }
    });
    console.log("STATUS:", res.status);
    console.log("HEADERS:", Object.fromEntries(res.headers.entries()));
    const csv = await res.text();
    console.log("BODY:", JSON.stringify(csv));
  } catch (err) {
    console.error("Error:", err);
  }
}

run();
