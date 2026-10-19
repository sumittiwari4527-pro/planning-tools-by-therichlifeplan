/**
 * src/app/hooks/useSEO.ts
 * SEO meta tag management hook
 */

import { useEffect } from 'react';
import { SITE_NAME, SITE_URL, SITE_DEFAULT_IMAGE } from '../utils/constants';

export interface SEOMeta {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: "website" | "article";
  jsonLd?: object;
}

function defaultJsonLd({ title, description, url, type }: SEOMeta) {
  const canonical = url ? `${SITE_URL}${url}` : SITE_URL;
  const breadcrumbItems: object[] = [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
  ];

  if (url?.startsWith("/tools/")) {
    breadcrumbItems.push({ "@type": "ListItem", position: 2, name: "Tools", item: `${SITE_URL}/tools` });
    breadcrumbItems.push({ "@type": "ListItem", position: 3, name: title, item: canonical });
    return [
      {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: title,
        url: canonical,
        description,
        applicationCategory: "UtilitiesApplication",
        operatingSystem: "Web",
        isAccessibleForFree: true,
        publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
      },
      { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: breadcrumbItems },
    ];
  }

  if (type === "article" || url?.startsWith("/blog/")) {
    breadcrumbItems.push({ "@type": "ListItem", position: 2, name: "Articles", item: `${SITE_URL}/blog` });
    breadcrumbItems.push({ "@type": "ListItem", position: 3, name: title, item: canonical });
    return [
      {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: title,
        description,
        mainEntityOfPage: { "@type": "WebPage", "@id": canonical },
        publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
      },
      { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: breadcrumbItems },
    ];
  }

  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description,
  };
}

export function useSEO({ title, description, image, url, type = "website", jsonLd }: SEOMeta) {
  useEffect(() => {
    const fullTitle = title === SITE_NAME ? title : `${title} — ${SITE_NAME}`;
    document.title = fullTitle;

    const setMeta = (name: string, content: string, attr = "name") => {
      let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.content = content;
    };

    const canonical = url ? `${SITE_URL}${url}` : SITE_URL;
    const ogImage = image || SITE_DEFAULT_IMAGE;

    setMeta("description", description);
    setMeta("robots", "index, follow");
    setMeta("og:title", fullTitle, "property");
    setMeta("og:description", description, "property");
    setMeta("og:image", ogImage, "property");
    setMeta("og:url", canonical, "property");
    setMeta("og:type", type, "property");
    setMeta("og:site_name", SITE_NAME, "property");
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", fullTitle);
    setMeta("twitter:description", description);
    setMeta("twitter:image", ogImage);

    let linkEl = document.querySelector("link[rel='canonical']") as HTMLLinkElement | null;
    if (!linkEl) {
      linkEl = document.createElement("link");
      linkEl.rel = "canonical";
      document.head.appendChild(linkEl);
    }
    linkEl.href = canonical;

    let ldEl = document.getElementById("json-ld") as HTMLScriptElement | null;
    if (!ldEl) {
      ldEl = document.createElement("script");
      ldEl.id = "json-ld";
      ldEl.type = "application/ld+json";
      document.head.appendChild(ldEl);
    }
    ldEl.textContent = JSON.stringify(jsonLd || defaultJsonLd({ title, description, image, url, type }));
  }, [title, description, image, url, type, jsonLd]);
}
