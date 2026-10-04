import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hchzkykatpzaowkstglx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhjaHpreWthdHB6YW93a3N0Z2x4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIyNTQ0ODUsImV4cCI6MjA5NzgzMDQ4NX0.5YoLYFES9W27j-Uu3fAtYoo-MsuvS7a3x0mJv1zvd28';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkAll() {
  // 1. List all buckets
  const { data: buckets, error: bErr } = await supabase.storage.listBuckets();
  console.log('Buckets:', buckets, 'Error:', bErr);

  // 2. Check if cat_gifts.jpg is reachable via HTTP
  const url1 = 'https://hchzkykatpzaowkstglx.supabase.co/storage/v1/object/public/website-assets/showcase/cat_gifts.jpg';
  try {
    const res1 = await fetch(url1, { method: 'HEAD' });
    console.log('cat_gifts.jpg status:', res1.status, res1.headers.get('content-type'));
  } catch (e) {
    console.error('cat_gifts.jpg fetch error:', e);
  }

  // 3. Check website-assets files in other folders
  if (buckets) {
    for (const b of buckets) {
      const { data: files, error: fErr } = await supabase.storage.from(b.name).list('', { limit: 100 });
      console.log(`Bucket [${b.name}] root items:`, files?.map(f => f.name), fErr || '');
      
      // If showcase folder exists or might exist
      const { data: subFiles } = await supabase.storage.from(b.name).list('showcase', { limit: 100 });
      if (subFiles && subFiles.length > 0) {
        console.log(`Bucket [${b.name}] showcase/ items:`, subFiles.map(f => f.name));
      }
    }
  }

  // 4. Check all rows in master_data
  const { data: allMaster } = await supabase.from('master_data').select('*');
  console.log('All master_data types:', [...new Set(allMaster?.map(m => m.type))]);
  console.log('All master_data homepage_assets count:', allMaster?.filter(m => m.type === 'homepage_assets').length);
  console.log('All master_data homepage_assets:', allMaster?.filter(m => m.type === 'homepage_assets'));
}

checkAll();
