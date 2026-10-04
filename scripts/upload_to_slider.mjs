import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const supabaseUrl = 'https://hchzkykatpzaowkstglx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhjaHpreWthdHB6YW93a3N0Z2x4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIyNTQ0ODUsImV4cCI6MjA5NzgzMDQ4NX0.5YoLYFES9W27j-Uu3fAtYoo-MsuvS7a3x0mJv1zvd28';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const SLIDER_IMAGES = [
  {
    fileName: 'svc_batch.jpg',
    key: 'slider_batch_production',
    title: 'Precision 3D Batch Production',
    tag: 'K1 Max Pro • Precision Batch',
    sub: 'Industrial FDM & Resin manufacturing tailored for makers & teams',
    order: 1
  },
  {
    fileName: 'cat_robotics.jpg',
    key: 'slider_robotics_rover',
    title: 'Autonomous Robotics Rover Kit',
    tag: 'Robotics • Pre-Tested HW',
    sub: 'High-torque motor drivers, sensor arrays & full verified schematics',
    order: 2
  },
  {
    fileName: 'cat_iot.jpg',
    key: 'slider_iot_nodes',
    title: 'Smart IoT Edge & Cloud Nodes',
    tag: 'IoT • ESP32 Cloud Synced',
    sub: 'Real-time telemetry, environmental sensor networks & live web dashboards',
    order: 3
  },
  {
    fileName: 'svc_enclosure.jpg',
    key: 'slider_enclosures_chassis',
    title: 'Snap-Fit Enclosures & Chassis',
    tag: 'CAD Toleranced • 0.1mm Precision',
    sub: 'Impact-resistant drone frames, electronic housings & custom brackets',
    order: 4
  },
  {
    fileName: 'cat_gifts.jpg',
    key: 'slider_gifts_decor',
    title: 'Personalised Gifts & Home Décor',
    tag: 'Custom Engraved • Bespoke Style',
    sub: 'Custom styled keepsake boxes, organic desk lamps & precision gifts',
    order: 5
  }
];

async function uploadSliderImages() {
  console.log('=== UPLOADING IMAGES TO website-assets/landingscreen-slider/ ===');
  
  const results = [];

  for (const item of SLIDER_IMAGES) {
    const localPath = path.resolve('public', item.fileName);
    if (!fs.existsSync(localPath)) {
      console.warn(`Local file ${item.fileName} not found in public/`);
      continue;
    }

    const buffer = fs.readFileSync(localPath);
    const storagePath = `landingscreen-slider/${item.fileName}`;

    console.log(`Uploading ${item.fileName} to ${storagePath}...`);

    const { data, error } = await supabase.storage
      .from('website-assets')
      .upload(storagePath, buffer, {
        contentType: 'image/jpeg',
        upsert: true,
        cacheControl: '3600'
      });

    if (error) {
      console.error(`Upload error for ${item.fileName}:`, error.message);
    } else {
      const publicUrl = `https://hchzkykatpzaowkstglx.supabase.co/storage/v1/object/public/website-assets/${storagePath}`;
      console.log(`Uploaded successfully: ${publicUrl}`);
      results.push({
        ...item,
        publicUrl
      });
    }
  }

  console.log(`\nUpload complete. ${results.length}/${SLIDER_IMAGES.length} succeeded.`);

  console.log('\n=== REGISTERING IN MASTER_DATA (type: homepage_assets) ===');
  for (const item of SLIDER_IMAGES) {
    const publicUrl = `https://hchzkykatpzaowkstglx.supabase.co/storage/v1/object/public/website-assets/landingscreen-slider/${item.fileName}`;
    const { data: dbData, error: dbErr } = await supabase
      .from('master_data')
      .upsert({
        type: 'homepage_assets',
        key: item.key,
        value: publicUrl,
        description: item.title,
        is_active: true,
        display_order: item.order
      }, { onConflict: 'type,key' })
      .select();

    if (dbErr) {
      console.error(`DB error for ${item.key}:`, dbErr.message);
    } else {
      console.log(`Registered in DB: ${item.key} -> ${publicUrl}`);
    }
  }

  // Query all homepage_assets
  const { data: all } = await supabase.from('master_data').select('*').eq('type', 'homepage_assets').order('display_order', { ascending: true });
  console.log('\nCurrent homepage_assets in DB:', JSON.stringify(all, null, 2));
}

uploadSliderImages();
