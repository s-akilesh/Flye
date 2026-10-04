const possibleNames = [
  'cat_gifts.jpg',
  'cat_gifts.png',
  'cat_gifts.webp',
  'cat_robotics.jpg',
  'cat_robotics.png',
  'cat_iot.jpg',
  'cat_iot.png',
  'cat_household.jpg',
  'cat_household.png',
  'cat_decor.jpg',
  'cat_decor.png',
  'cat_parts.jpg',
  'cat_parts.png',
  'svc_batch.jpg',
  'svc_batch.png',
  'svc_enclosure.jpg',
  'svc_enclosure.png',
  'svc_resin.jpg',
  'svc_resin.png',
  'kit_case.jpg',
  'kit_code.jpg',
  'kit_doc.jpg',
  'kit_hw.jpg',
  'landing_screen_bg.jpg',
  'landing_screen_bg.png',
  'wavy_design.png',
  'wavy_design.jpg',
  'hero_card_1.jpg',
  'hero_card_2.jpg',
  'showcase_1.jpg',
  'showcase_2.jpg',
  'image1.jpg',
  'image2.jpg',
  'image.jpg',
  'image.png',
  'test.jpg',
  'test.png',
  '1.jpg',
  '2.jpg',
  '3.jpg'
];

async function probeFiles() {
  console.log('Probing showcase files in storage...');
  for (const name of possibleNames) {
    const url = `https://hchzkykatpzaowkstglx.supabase.co/storage/v1/object/public/website-assets/showcase/${name}`;
    try {
      const res = await fetch(url, { method: 'HEAD' });
      if (res.status === 200) {
        console.log(`FOUND FILE: ${name} (200 OK, size: ${res.headers.get('content-length')}, type: ${res.headers.get('content-type')})`);
      }
    } catch (e) {
      // ignore
    }
  }

  // Also probe root of website-assets
  console.log('Probing root files in storage...');
  for (const name of possibleNames) {
    const url = `https://hchzkykatpzaowkstglx.supabase.co/storage/v1/object/public/website-assets/${name}`;
    try {
      const res = await fetch(url, { method: 'HEAD' });
      if (res.status === 200) {
        console.log(`FOUND IN ROOT: ${name} (200 OK, size: ${res.headers.get('content-length')})`);
      }
    } catch (e) {
      // ignore
    }
  }
}

probeFiles();
