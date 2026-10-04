import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hchzkykatpzaowkstglx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhjaHpreWthdHB6YW93a3N0Z2x4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIyNTQ0ODUsImV4cCI6MjA5NzgzMDQ4NX0.5YoLYFES9W27j-Uu3fAtYoo-MsuvS7a3x0mJv1zvd28';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testStorageList() {
  const r1 = await supabase.storage.from('website-assets').list();
  console.log('list():', r1.data, r1.error);

  const r2 = await supabase.storage.from('website-assets').list('showcase');
  console.log('list("showcase"):', r2.data, r2.error);

  const r3 = await supabase.storage.from('website-assets').list('showcase/');
  console.log('list("showcase/"):', r3.data, r3.error);
}

testStorageList();
