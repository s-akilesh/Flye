const filesToTest = [
  'cat_gifts.jpg',
  'cat_iot.jpg',
  'cat_household.jpg',
  'cat_decor.jpg',
  'cat_robotics.jpg',
  'cat_parts.jpg',
  'svc_batch.jpg',
  'svc_enclosure.jpg',
  'svc_resin.jpg',
  'kit_case.jpg',
  'kit_code.jpg',
  'kit_doc.jpg',
  'kit_hw.jpg',
  'landing_screen_bg.jpg',
  'flyen_bot.png',
  'flyen_rc_rover.png'
];

async function checkAllPossible() {
  for (const f of filesToTest) {
    const url = `https://hchzkykatpzaowkstglx.supabase.co/storage/v1/object/public/website-assets/showcase/${f}`;
    const res = await fetch(url, { method: 'HEAD' });
    console.log(`showcase/${f} -> ${res.status}`);
  }
}

checkAllPossible();
