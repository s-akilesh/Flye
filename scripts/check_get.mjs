async function checkExisting() {
  const files = ['cat_gifts.jpg', 'cat_iot.jpg', 'cat_household.jpg'];
  for (const f of files) {
    const url = `https://hchzkykatpzaowkstglx.supabase.co/storage/v1/object/public/website-assets/showcase/${f}`;
    const res = await fetch(url);
    console.log(`URL: ${url} -> Status: ${res.status}, Content-Type: ${res.headers.get('content-type')}, Size: ${res.headers.get('content-length')}`);
  }
}

checkExisting();
