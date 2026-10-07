import { useEffect } from 'react';

// Per-page title, description, canonical link and robots for search engines (this is a single-page app)
const SITE = 'https://isu.sherin.fun';
const setTag = (selector, make, attr, value) => {
  let el = document.head.querySelector(selector);
  if (!el) { el = make(); document.head.appendChild(el); }
  el.setAttribute(attr, value);
};

export default function usePageMeta({ title, description, path = '/', noindex = false }) {
  useEffect(() => {
    const url = SITE + path;
    document.title = title;
    const meta = (name, prop) => () => { const m = document.createElement('meta'); m.setAttribute(prop ? 'property' : 'name', name); return m; };
    setTag('meta[name="description"]', meta('description'), 'content', description);
    setTag('meta[property="og:title"]', meta('og:title', true), 'content', title);
    setTag('meta[property="og:description"]', meta('og:description', true), 'content', description);
    setTag('meta[property="og:url"]', meta('og:url', true), 'content', url);
    setTag('meta[name="robots"]', meta('robots'), 'content', noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large, max-snippet:-1');
    setTag('link[rel="canonical"]', () => { const l = document.createElement('link'); l.rel = 'canonical'; return l; }, 'href', url);
    document.head.querySelectorAll('link[rel="alternate"][hreflang]').forEach((l) => l.setAttribute('href', url));
  }, [title, description, path, noindex]);
}
