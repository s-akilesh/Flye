const commonNames = [
  'cat_gifts.jpg', 'cat_gifts.png', 'cat_gifts.jpeg', 'cat_gifts.webp',
  'cat_iot.jpg', 'cat_iot.png', 'cat_iot.jpeg', 'cat_iot.webp',
  'cat_household.jpg', 'cat_household.png', 'cat_household.jpeg', 'cat_household.webp',
  'cat_decor.jpg', 'cat_decor.png',
  'cat_robotics.jpg', 'cat_robotics.png',
  'cat_parts.jpg', 'cat_parts.png',
  'svc_batch.jpg', 'svc_batch.png',
  'svc_enclosure.jpg', 'svc_enclosure.png',
  'svc_resin.jpg', 'svc_resin.png',
  'kit_case.jpg', 'kit_code.jpg', 'kit_doc.jpg', 'kit_hw.jpg',
  'wavy_design.png', 'wavy_design.jpg'
];

async function checkCurrentStorage() {
  const found = [];
  for (const name of commonNames) {
    const url = `https://hchzkykatpzaowkstglx.supabase.co/storage/v1/object/public/website-assets/showcase/${name}`;
    try {
      const res = await fetch(url, { method: 'HEAD' });
      if (res.status === 200) {
        found.push({ name, size: res.headers.get('content-length'), url });
      }
    } catch (e) {}
  }
  console.log('Current files verified in Supabase Storage website-assets/showcase/:', found);
}

checkCurrentStorage();
