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
  console.log("Attempting insert with empty object...");
  const { data: insData, error: insError } = await supabase
    .from('settings')
    .insert({})
    .select();

  if (insError) {
    console.log("INSERT ERROR:", insError.message, insError.details || "");
  } else {
    console.log("INSERT SUCCESS. Columns found:");
    console.log(Object.keys(insData[0]));
    console.log("Record:", JSON.stringify(insData[0]));
    
    // Clean up
    if (insData[0] && insData[0].id) {
      await supabase.from('settings').delete().eq('id', insData[0].id);
      console.log("Cleaned up test record.");
    }
  }
}

run();
