import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hchzkykatpzaowkstglx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhjaHpreWthdHB6YW93a3N0Z2x4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIyNTQ0ODUsImV4cCI6MjA5NzgzMDQ4NX0.5YoLYFES9W27j-Uu3fAtYoo-MsuvS7a3x0mJv1zvd28';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function registerShowcaseCards() {
  const cards = [
    {
      type: 'homepage_assets',
      key: 'showcase_gifts_decor',
      value: 'https://hchzkykatpzaowkstglx.supabase.co/storage/v1/object/public/website-assets/showcase/cat_gifts.jpg',
      description: 'Personalised Gifts & Home Décor',
      is_active: true,
      display_order: 1
    },
    {
      type: 'homepage_assets',
      key: 'showcase_iot_nodes',
      value: 'https://hchzkykatpzaowkstglx.supabase.co/storage/v1/object/public/website-assets/showcase/cat_iot.jpg',
      description: 'Smart IoT Edge & Cloud Nodes',
      is_active: true,
      display_order: 2
    }
  ];

  for (const card of cards) {
    const { data, error } = await supabase
      .from('master_data')
      .upsert(card, { onConflict: 'type,key' })
      .select();
    
    if (error) {
      console.error(`Error inserting ${card.key}:`, error);
    } else {
      console.log(`Successfully registered: ${card.key} (id: ${data?.[0]?.id})`);
    }
  }

  const { data: all } = await supabase
    .from('master_data')
    .select('*')
    .eq('type', 'homepage_assets');

  console.log('\nAll current homepage_assets in master_data:');
  console.log(JSON.stringify(all, null, 2));
}

registerShowcaseCards();
