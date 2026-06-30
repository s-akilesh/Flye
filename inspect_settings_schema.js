import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const envContent = fs.readFileSync('.env', 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
  const parts = line.split('=');
  if (parts.length >= 2) {
    env[parts[0].trim()] = parts.slice(1).join('=').trim();
  }
});

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

async function run() {
  console.log("Fetching existing settings row...");
  const { data: insData, error: insError } = await supabase
    .from('settings')
    .select('*')
    .limit(1);

  if (insError) {
    console.log("SELECT ERROR:", insError.message, insError.details || "");
  } else if (insData && insData.length > 0) {
    console.log("SELECT SUCCESS. Columns found:");
    console.log(Object.keys(insData[0]));
    console.log("Record:", JSON.stringify(insData[0]));
  } else {
    console.log("No settings row found in database.");
  }
}

run();
