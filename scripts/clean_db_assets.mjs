import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hchzkykatpzaowkstglx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhjaHpreWthdHB6YW93a3N0Z2x4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIyNTQ0ODUsImV4cCI6MjA5NzgzMDQ4NX0.5YoLYFES9W27j-Uu3fAtYoo-MsuvS7a3x0mJv1zvd28';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function cleanHomepageAssetsFromDB() {
  console.log('Deleting homepage_assets from master_data...');
  const { data, error } = await supabase
    .from('master_data')
    .delete()
    .eq('type', 'homepage_assets');

  if (error) {
    console.error('Error deleting homepage_assets:', error);
  } else {
    console.log('Successfully deleted all homepage_assets from master_data.');
  }

  const { data: remaining } = await supabase
    .from('master_data')
    .select('*')
    .eq('type', 'homepage_assets');
  console.log('Remaining homepage_assets in DB:', remaining);
}

cleanHomepageAssetsFromDB();
