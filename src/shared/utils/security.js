/**
 * Sanitizes HTML content for safe rendering inside dangerouslySetInnerHTML,
 * preventing Cross-Site Scripting (XSS) attacks.
 * Safe for both Client and Server-Side Rendering (SSR).
 */
export const sanitizeHtml = (html) => {
  if (!html) return '';

  // Server-side fallback or environment check
  if (typeof window === 'undefined') {
    // Regex fallback to strip scripts and dangerous event handlers during SSR/prerendering
    let clean = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
    clean = clean.replace(/on\w+\s*=\s*(['"][^'"]*['"]|[^\s>]+)/gi, '');
    clean = clean.replace(/href\s*=\s*(['"]\s*javascript:[^'"]*['"]|javascript:[^\s>]+)/gi, '');
    clean = clean.replace(/src\s*=\s*(['"]\s*javascript:[^'"]*['"]|javascript:[^\s>]+)/gi, '');
    return clean;
  }

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // 1. Remove script tags
    const scripts = doc.querySelectorAll('script');
    scripts.forEach(s => s.remove());
    
    // 2. Clean event handlers and javascript: URIs
    const allElements = doc.querySelectorAll('*');
    allElements.forEach(el => {
      const attrs = Array.from(el.attributes);
      attrs.forEach(attr => {
        const name = attr.name.toLowerCase();
        if (name.startsWith('on')) {
          el.removeAttribute(attr.name);
        }
        if (name === 'href' || name === 'src') {
          const val = attr.value.trim().toLowerCase();
          if (val.startsWith('javascript:')) {
            el.setAttribute(attr.name, '#');
          }
        }
      });
    });
    
    return doc.body.innerHTML;
  } catch (err) {
    console.error('[XSS Sanitizer] Failed to sanitize HTML:', err);
    // Regex fallback
    let clean = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
    clean = clean.replace(/on\w+\s*=\s*(['"][^'"]*['"]|[^\s>]+)/gi, '');
    clean = clean.replace(/href\s*=\s*(['"]\s*javascript:[^'"]*['"]|javascript:[^\s>]+)/gi, '');
    clean = clean.replace(/src\s*=\s*(['"]\s*javascript:[^'"]*['"]|javascript:[^\s>]+)/gi, '');
    return clean;
  }
};

/**
 * Prevents prototype pollution by recursively stripping keys matching __proto__, constructor, or prototype.
 */
export const sanitizePrototype = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) {
    return obj.map(sanitizePrototype);
  }
  const clean = {};
  for (const key of Object.keys(obj)) {
    if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
      continue;
    }
    clean[key] = sanitizePrototype(obj[key]);
  }
  return clean;
};
