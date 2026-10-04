import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hchzkykatpzaowkstglx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhjaHpreWthdHB6YW93a3N0Z2x4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIyNTQ0ODUsImV4cCI6MjA5NzgzMDQ4NX0.5YoLYFES9W27j-Uu3fAtYoo-MsuvS7a3x0mJv1zvd28';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkProfiles() {
  const { data, error } = await supabase.from('profiles').select('id, email, role, full_name');
  console.log('Profiles in DB:', data, 'Error:', error);
}

checkProfiles();
