import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

// Setup Timer
const startTime = Date.now();

// 1. Read environment variables from .env file
let supabaseUrl = process.env.VITE_SUPABASE_URL;
let supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (fs.existsSync('.env')) {
  const envContent = fs.readFileSync('.env', 'utf-8');
  const urlMatch = envContent.match(/VITE_SUPABASE_URL\s*=\s*(.+)/);
  const keyMatch = envContent.match(/VITE_SUPABASE_ANON_KEY\s*=\s*(.+)/);
  if (urlMatch) supabaseUrl = urlMatch[1].trim();
  if (keyMatch) supabaseKey = keyMatch[1].trim();
}

// 2. Fetch Projects and Settings from Supabase
let projects = [];
let dbSettings = {};

if (supabaseUrl && supabaseKey) {
  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Fetch active projects
    const { data: projData, error: projErr } = await supabase
      .from('projects')
      .select('*');
    if (projErr) throw projErr;
    projects = (projData || []).filter(p => p.status === 'active' || p.status === 'coming-soon');
    console.log(`[Prerender] Fetched ${projects.length} active projects from Supabase.`);

    // Fetch settings
    const { data: setDocs, error: setErr } = await supabase
      .from('settings')
      .select('*')
      .single();
    if (setErr) throw setErr;
    dbSettings = setDocs || {};
    console.log('[Prerender] Mapped platform settings from Supabase.');
  } catch (e) {
    console.warn('⚠️ Supabase fetch warning:', e.message);
  }
} else {
  console.warn('⚠️ Supabase credentials missing. Running without Supabase dynamic data.');
}

// Map settings columns for real settings provider initial state
const settingsPayload = {
  companyName: dbSettings.website_name || 'Flyen',
  companyTagline: dbSettings.website_tagline || '',
  websiteLogo: dbSettings.logo_url || '',
  websiteFavicon: dbSettings.favicon_url || '',
  companyAddress: dbSettings.address || '',
  contactEmail: dbSettings.contact_email || 'support@flyen.in',
  contactPhone: dbSettings.contact_phone || '',
  whatsappNumber: dbSettings.whatsapp_number || '',
  instagramUrl: dbSettings.instagram_url || '',
  twitterUrl: dbSettings.twitter_url || '',
  youtubeUrl: dbSettings.youtube_url || '',
  linkedinUrl: dbSettings.linkedin_url || '',
  facebookUrl: dbSettings.facebook_url || '',
  githubUrl: dbSettings.github_url || '',
  websiteUrl: dbSettings.website_url || 'https://flyen.in',
  footerText: dbSettings.footer_text || '',
  copyrightText: dbSettings.copyright_text || '',
  notificationEmail: dbSettings.notification_email || '',
  replyToEmail: dbSettings.reply_to_email || '',
  profilePhoto: dbSettings.profile_photo || '',
  profileName: dbSettings.profile_name || '',
  profileEmail: dbSettings.profile_email || '',
  profilePhone: dbSettings.profile_phone || '',
  profileDesignation: dbSettings.profile_designation || '',
};

import { pathToFileURL } from 'url';

// 3. Load SSR compiled bundle
const entryServerPath = path.resolve('dist-server/entry-server.js');
if (!fs.existsSync(entryServerPath)) {
  console.error('❌ SSR entry-server.js not found. Please run vite build --ssr first.');
  process.exit(1);
}

const { render } = await import(pathToFileURL(entryServerPath).href);

// 4. Setup Routes to Prerender
const routes = [
  { url: '/', pageType: 'HOME' },
  { url: '/projects', pageType: 'PROJECT_LISTING' },
  { url: '/contact', pageType: 'CONTACT' },
  { url: '/printing', pageType: 'PRINTING' },
  { url: '/about', pageType: 'ABOUT' },
  { url: '/departments', pageType: 'DEPARTMENTS' },
  { url: '/privacy-policy', pageType: 'PRIVACY' },
  { url: '/terms-and-conditions', pageType: 'TERMS' }
];

// Add dynamic project detail routes
projects.forEach(p => {
  if (p.slug) {
    routes.push({ url: `/project/${p.slug}`, pageType: 'PROJECT', data: p });
  }
});

// Import SEO foundation utilities directly for injecting tags into head
import { generateSEO } from '../src/shared/seo/generateSEO.js';
import { seoConfig } from '../src/shared/seo/config/seoConfig.js';
import { buildMetaTags } from '../src/shared/seo/builders/metaBuilder.js';
import { generateCanonicalUrl } from '../src/shared/seo/builders/canonical.js';
import { generateOgMeta } from '../src/shared/seo/builders/ogGenerator.js';
import { generateTwitterCard } from '../src/shared/seo/builders/twitterCard.js';

// Schemas
import { generateOrganizationSchema } from '../src/shared/seo/schemas/OrganizationSchema.js';
import { generateWebsiteSchema } from '../src/shared/seo/schemas/WebsiteSchema.js';
import { generateProductSchema } from '../src/shared/seo/schemas/ProductSchema.js';
import { generateLocalBusinessSchema } from '../src/shared/seo/schemas/LocalBusinessSchema.js';
import { generateBreadcrumbSchema } from '../src/shared/seo/schemas/BreadcrumbSchema.js';

// 5. Read client index.html template
const templatePath = path.resolve('dist/index.html');
if (!fs.existsSync(templatePath)) {
  console.error('❌ dist/index.html not found. Please run vite build first.');
  process.exit(1);
}
const templateHtml = fs.readFileSync(templatePath, 'utf-8');

let successCount = 0;
let failCount = 0;
const failuresList = [];

console.log(`Starting prerendering for ${routes.length} routes...`);

for (const route of routes) {
  const { url, pageType, data } = route;
  try {
    // A. Generate rendered React body
    const renderedBody = render(url, {
      projects: projects,
      settings: settingsPayload
    });

    // B. Build SEO metadata
    const seoProps = generateSEO(pageType, data);
    const resolvedTitle = seoProps.title || seoConfig.defaultTitle;
    
    let metaHtml = `\n  <title>${resolvedTitle}</title>\n`;
    
    const ogMeta = generateOgMeta(seoProps, seoConfig);
    const twitterMeta = generateTwitterCard(seoProps, seoConfig, ogMeta);
    const metaTags = buildMetaTags({
      description: seoProps.description,
      keywords: seoProps.keywords,
      robots: seoProps.robots,
      pageType: seoProps.pageType || 'website',
      noindex: false,
      ...ogMeta,
      ...twitterMeta
    }, seoConfig);

    metaTags.forEach(tag => {
      if (tag.name) {
        metaHtml += `  <meta name="${tag.name}" content="${tag.content.replace(/"/g, '&quot;')}" />\n`;
      } else if (tag.property) {
        metaHtml += `  <meta property="${tag.property}" content="${tag.content.replace(/"/g, '&quot;')}" />\n`;
      }
    });

    const canonical = seoProps.canonicalUrl || generateCanonicalUrl(url, seoConfig);
    metaHtml += `  <link rel="canonical" href="${canonical}" />\n`;

    // C. Structured JSON-LD Data Injection
    const injectSchema = (id, json) => {
      if (!json) return '';
      return `  <script type="application/ld+json" id="${id}">${JSON.stringify(json)}</script>\n`;
    };

    if (pageType === 'HOME') {
      metaHtml += injectSchema('schema-org', generateOrganizationSchema(seoConfig));
      metaHtml += injectSchema('schema-website', generateWebsiteSchema(seoConfig));
    }
    if (pageType === 'CONTACT') {
      metaHtml += injectSchema('schema-localbusiness', generateLocalBusinessSchema(seoConfig));
    }
    if (pageType === 'PROJECT' && data) {
      metaHtml += injectSchema('schema-product', generateProductSchema(data, seoConfig));
    }

    // Breadcrumbs
    const breadcrumbs = [{ name: 'Home', url: '/' }];
    if (url !== '/') {
      const paths = url.split('/').filter(Boolean);
      if (paths[0] === 'projects') {
        breadcrumbs.push({ name: 'Projects', url: '/projects' });
      } else if (paths[0] === 'project' && paths[1]) {
        breadcrumbs.push({ name: 'Projects', url: '/projects' });
        breadcrumbs.push({ name: seoProps.title || data?.title || 'Project Details', url: url });
      } else if (paths[0] === 'contact') {
        breadcrumbs.push({ name: 'Contact', url: '/contact' });
      } else if (paths[0] === 'printing') {
        breadcrumbs.push({ name: '3D Printing', url: '/printing' });
      } else {
        const label = paths[0].charAt(0).toUpperCase() + paths[0].slice(1);
        breadcrumbs.push({ name: label, url: url });
      }
    }
    if (breadcrumbs.length > 1) {
      metaHtml += injectSchema('schema-breadcrumbs', generateBreadcrumbSchema(breadcrumbs, seoConfig));
    }

    // D. Merge into template HTML
    let finalHtml = templateHtml.replace('<div id="root"></div>', `<div id="root">${renderedBody}</div>`);
    finalHtml = finalHtml.replace('</head>', `${metaHtml}</head>`);

    // E. Save Static File
    const filePath = path.join('dist', url === '/' ? 'index.html' : `${url}/index.html`);
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, finalHtml);
    successCount++;
    console.log(`✔ Prerendered: ${url}`);
  } catch (err) {
    failCount++;
    failuresList.push({ url, error: err.message });
    console.error(`❌ Failed to prerender ${url}:`, err);
    // Fail the build only if core static pages fail
    if (url === '/' || url === '/projects' || url === '/contact') {
      console.error(`CRITICAL ERROR: Core route ${url} failed to prerender. Aborting build.`);
      process.exit(1);
    }
  }
}

// 6. Cross-Platform Node Cleanup (Delete dist-server directory)
try {
  const serverBuildDir = path.resolve('dist-server');
  if (fs.existsSync(serverBuildDir)) {
    fs.rmSync(serverBuildDir, { recursive: true, force: true });
    console.log('[Prerender] Cleaned up temporary SSR build directory.');
  }
} catch (e) {
  console.warn('⚠️ Warning: Failed to cleanup dist-server directory:', e.message);
}

// 7. Output Build Report Summary
const durationSec = ((Date.now() - startTime) / 1000).toFixed(1);
console.log('\n======================================');
console.log('         PRERENDER SUMMARY            ');
console.log('======================================');
console.log(`Static Pages    : ${routes.filter(r => r.pageType !== 'PROJECT').length}`);
console.log(`Project Pages   : ${routes.filter(r => r.pageType === 'PROJECT').length}`);
console.log(`Successful      : ${successCount}`);
console.log(`Failed          : ${failCount}`);
console.log(`Duration        : ${durationSec} seconds`);
console.log('======================================\n');

if (failCount > 0) {
  console.warn('⚠️ Notice: Some dynamic paths failed during prerender:');
  failuresList.forEach(f => console.warn(` - ${f.url}: ${f.error}`));
}
