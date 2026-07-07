import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import { seoConfig } from '../src/shared/seo/config/seoConfig.js';
import { generateRobotsTxt } from '../src/shared/seo/robotsGenerator.js';
import { generateSitemapXml } from '../src/shared/seo/sitemapGenerator.js';

// Setup directories
const PUBLIC_DIR = path.resolve('public');
if (!fs.existsSync(PUBLIC_DIR)) {
  fs.mkdirSync(PUBLIC_DIR, { recursive: true });
}

// Extract Env Variables from .env file
let supabaseUrl = process.env.VITE_SUPABASE_URL;
let supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (fs.existsSync('.env')) {
  const envContent = fs.readFileSync('.env', 'utf-8');
  const urlMatch = envContent.match(/VITE_SUPABASE_URL\s*=\s*(.+)/);
  const keyMatch = envContent.match(/VITE_SUPABASE_ANON_KEY\s*=\s*(.+)/);
  if (urlMatch) supabaseUrl = urlMatch[1].trim();
  if (keyMatch) supabaseKey = keyMatch[1].trim();
}

async function run() {
  console.log('Generating SEO Assets...');

  // 1. Generate Robots.txt
  const robotsTxt = generateRobotsTxt(seoConfig);
  fs.writeFileSync(path.join(PUBLIC_DIR, 'robots.txt'), robotsTxt);
  console.log('✔ Generated robots.txt');

  // 2. Fetch Projects for Sitemap
  let projects = [];
  if (supabaseUrl && supabaseKey) {
    try {
      const supabase = createClient(supabaseUrl, supabaseKey);
      const { data, error } = await supabase
        .from('projects')
        .select('slug, status');
      if (error) throw error;
      
      // Filter customer facing projects
      projects = (data || []).filter(p => p.status === 'active' || p.status === 'coming-soon');
      console.log(`Fetched ${projects.length} active projects from Supabase`);
    } catch (e) {
      console.warn('⚠️ Failed to fetch projects from Supabase. Falling back to default sitemap.', e.message);
    }
  } else {
    console.warn('⚠️ Supabase credentials missing. Generating sitemap without dynamic project routes.');
  }

  // 3. Generate Sitemap.xml
  const sitemapXml = generateSitemapXml(seoConfig, projects);
  fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap.xml'), sitemapXml);
  console.log('✔ Generated sitemap.xml');
}

run().catch((err) => {
  console.error('❌ Failed to generate SEO assets:', err);
  process.exit(1);
});
