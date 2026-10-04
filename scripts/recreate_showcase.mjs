import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const supabaseUrl = 'https://hchzkykatpzaowkstglx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhjaHpreWthdHB6YW93a3N0Z2x4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIyNTQ0ODUsImV4cCI6MjA5NzgzMDQ4NX0.5YoLYFES9W27j-Uu3fAtYoo-MsuvS7a3x0mJv1zvd28';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const IMAGES_TO_UPLOAD = [
  {
    fileName: 'cat_gifts.jpg',
    key: 'showcase_gifts_decor',
    title: 'Personalised Gifts & Home Décor',
    order: 1
  },
  {
    fileName: 'cat_robotics.jpg',
    key: 'showcase_robotics_rover',
    title: 'Autonomous Robotics Rover Kit',
    order: 2
  },
  {
    fileName: 'cat_iot.jpg',
    key: 'showcase_iot_nodes',
    title: 'Smart IoT Edge & Cloud Nodes',
    order: 3
  }
];

async function recreateShowcase() {
  console.log('=== STEP 1: REMOVING OLD SHOWCASE OBJECTS FROM STORAGE ===');
  const knownOldFiles = [
    'showcase/cat_gifts.jpg',
    'showcase/cat_iot.jpg',
    'showcase/cat_household.jpg',
    'showcase/cat_decor.jpg',
    'showcase/cat_robotics.jpg',
    'showcase/cat_parts.jpg',
    'showcase/svc_batch.jpg',
    'showcase/svc_enclosure.jpg',
    'showcase/svc_resin.jpg',
    'showcase/wavy_design.png'
  ];

  const { data: delData, error: delErr } = await supabase
    .storage
    .from('website-assets')
    .remove(knownOldFiles);

  console.log('Deleted old files:', delData, 'Error:', delErr);

  console.log('\n=== STEP 2: UPLOADING FRESH IMAGES TO website-assets/showcase/ ===');
  const uploadedUrls = [];

  for (const item of IMAGES_TO_UPLOAD) {
    const localPath = path.resolve('public', item.fileName);
    if (!fs.existsSync(localPath)) {
      console.warn(`Local file not found: ${localPath}`);
      continue;
    }

    const fileBuffer = fs.readFileSync(localPath);
    const storagePath = `showcase/${item.fileName}`;

    console.log(`Uploading ${item.fileName} (${fileBuffer.length} bytes) to ${storagePath}...`);

    const { data: upData, error: upErr } = await supabase
      .storage
      .from('website-assets')
      .upload(storagePath, fileBuffer, {
        contentType: 'image/jpeg',
        upsert: true,
        cacheControl: '3600'
      });

    if (upErr) {
      console.error(`Upload error for ${item.fileName}:`, upErr);
    } else {
      const publicUrl = `https://hchzkykatpzaowkstglx.supabase.co/storage/v1/object/public/website-assets/${storagePath}`;
      console.log(`SUCCESS upload: ${publicUrl}`);
      uploadedUrls.push({
        ...item,
        publicUrl
      });
    }
  }

  console.log('\n=== STEP 3: RECREATING MASTER_DATA ENTRIES ===');
  // First clear old showcase records (keep landing_screen_bg)
  const { error: clearErr } = await supabase
    .from('master_data')
    .delete()
    .eq('type', 'homepage_assets')
    .neq('key', 'landing_screen_bg');

  if (clearErr) {
    console.error('Error clearing old master_data records:', clearErr);
  } else {
    console.log('Cleared old master_data showcase records.');
  }

  // Insert fresh rows
  for (const item of uploadedUrls) {
    const { data: insData, error: insErr } = await supabase
      .from('master_data')
      .insert({
        type: 'homepage_assets',
        key: item.key,
        value: item.publicUrl,
        description: item.title,
        is_active: true,
        display_order: item.order
      })
      .select();

    if (insErr) {
      console.error(`Error inserting ${item.key} into master_data:`, insErr);
    } else {
      console.log(`Registered in master_data: ${item.key} -> ${item.publicUrl}`);
    }
  }

  console.log('\n=== STEP 4: VERIFYING RECREATED ASSETS VIA HTTP HEAD ===');
  for (const item of uploadedUrls) {
    try {
      const res = await fetch(item.publicUrl, { method: 'HEAD' });
      console.log(`HTTP Check: ${item.publicUrl} -> Status ${res.status} (Content-Length: ${res.headers.get('content-length')})`);
    } catch (e) {
      console.error(`Failed to reach ${item.publicUrl}:`, e);
    }
  }

  console.log('\n=== STEP 5: FINAL MASTER_DATA QUERY ===');
  const { data: finalRows } = await supabase
    .from('master_data')
    .select('*')
    .eq('type', 'homepage_assets');
  console.log('Final DB Rows:', JSON.stringify(finalRows, null, 2));
}

recreateShowcase();
