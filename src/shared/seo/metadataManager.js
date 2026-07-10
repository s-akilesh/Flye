import { seoConfig } from './config/seoConfig.js';
import { buildMetaTags } from './builders/metaBuilder.js';
import { generateCanonicalUrl } from './builders/canonical.js';
import { generateOgMeta } from './builders/ogGenerator.js';
import { generateTwitterCard } from './builders/twitterCard.js';

// Schemas
import { generateOrganizationSchema } from './schemas/OrganizationSchema.js';
import { generateWebsiteSchema } from './schemas/WebsiteSchema.js';
import { generateProductSchema } from './schemas/ProductSchema.js';
import { generateBreadcrumbSchema } from './schemas/BreadcrumbSchema.js';
import { generateLocalBusinessSchema } from './schemas/LocalBusinessSchema.js';
import { PageType } from './constants/pageTypes.js';

const updateMetaTag = (name, property, content) => {
  let el;
  if (name) {
    el = document.querySelector(`meta[name="${name}"]`);
    if (!el && content) {
      el = document.createElement('meta');
      el.setAttribute('name', name);
      document.head.appendChild(el);
    }
  } else if (property) {
    el = document.querySelector(`meta[property="${property}"]`);
    if (!el && content) {
      el = document.createElement('meta');
      el.setAttribute('property', property);
      document.head.appendChild(el);
    }
  }
  if (el) {
    if (content) {
      el.setAttribute('content', content);
    } else {
      el.remove();
    }
  }
};

const updateCanonicalLink = (url) => {
  let el = document.querySelector('link[rel="canonical"]');
  if (!el && url) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  if (el) {
    if (url) {
      el.setAttribute('href', url);
    } else {
      el.remove();
    }
  }
};

const updateJsonLd = (schemaId, jsonContent) => {
  let el = document.getElementById(schemaId);
  if (jsonContent) {
    if (!el) {
      el = document.createElement('script');
      el.setAttribute('type', 'application/ld+json');
      el.setAttribute('id', schemaId);
      document.head.appendChild(el);
    }
    el.textContent = JSON.stringify(jsonContent);
  } else if (el) {
    el.remove();
  }
};

export const metadataManager = {
  updateMetadata(settings) {
    const {
      title,
      description,
      keywords,
      canonicalUrl,
      robots,
      pageType = 'website',
      noindex = false,
      page,
      data,
      route
    } = settings;

    const isAdminPath = (route && route.startsWith('/admin')) || noindex;

    // 1. Resolve Document Title with fallback
    const resolvedTitle = title 
      ? (title.includes(seoConfig.siteName) ? title : `${title} | ${seoConfig.siteName}`) 
      : seoConfig.defaultTitle;
    document.title = resolvedTitle;

    // 2. Generate Canonical URL
    const resolvedCanonical = canonicalUrl || generateCanonicalUrl(route || '/', seoConfig);

    // 3. Compile Open Graph & Twitter fallbacks
    const ogMeta = generateOgMeta(settings, seoConfig);
    const twitterMeta = generateTwitterCard(settings, seoConfig, ogMeta);

    // 4. Generate meta tag payload
    const metaTags = buildMetaTags({
      description,
      keywords,
      robots,
      pageType,
      noindex: isAdminPath,
      ...ogMeta,
      ...twitterMeta
    }, seoConfig);

    // Apply all computed meta tags
    metaTags.forEach(tag => {
      updateMetaTag(tag.name, tag.property, tag.content);
    });

    // Handle canonical tag routing
    if (isAdminPath) {
      updateCanonicalLink(null);
    } else {
      updateCanonicalLink(resolvedCanonical);
    }

    // 5. Inject Open Graph url
    if (!isAdminPath && resolvedCanonical) {
      updateMetaTag(null, 'og:url', resolvedCanonical);
    } else {
      updateMetaTag(null, 'og:url', null);
    }

    // 6. Inject Structured JSON-LD Structured Data
    if (page === PageType.HOME) {
      updateJsonLd('schema-org', generateOrganizationSchema(seoConfig));
      updateJsonLd('schema-website', generateWebsiteSchema(seoConfig));
    } else {
      updateJsonLd('schema-org', null);
      updateJsonLd('schema-website', null);
    }

    if (page === PageType.CONTACT) {
      updateJsonLd('schema-localbusiness', generateLocalBusinessSchema(seoConfig));
    } else {
      updateJsonLd('schema-localbusiness', null);
    }

    if (page === PageType.PROJECT && data) {
      updateJsonLd('schema-product', generateProductSchema(data, seoConfig));
    } else {
      updateJsonLd('schema-product', null);
    }

    // Dynamic Breadcrumbs
    const breadcrumbs = [{ name: 'Home', url: '/' }];
    if (route && route !== '/') {
      const paths = route.split('/').filter(Boolean);
      if (paths[0] === 'projects') {
        breadcrumbs.push({ name: 'Projects', url: '/projects' });
      } else if (paths[0] === 'project' && paths[1]) {
        breadcrumbs.push({ name: 'Projects', url: '/projects' });
        breadcrumbs.push({ name: title || data?.title || 'Project Details', url: route });
      } else if (paths[0] === 'contact') {
        breadcrumbs.push({ name: 'Contact', url: '/contact' });
      } else if (paths[0] === 'printing') {
        breadcrumbs.push({ name: '3D Printing', url: '/printing' });
      } else {
        const label = paths[0].charAt(0).toUpperCase() + paths[0].slice(1);
        breadcrumbs.push({ name: label, url: route });
      }
    }

    if (!isAdminPath && breadcrumbs.length > 1) {
      updateJsonLd('schema-breadcrumbs', generateBreadcrumbSchema(breadcrumbs, seoConfig));
    } else {
      updateJsonLd('schema-breadcrumbs', null);
    }
  }
};
