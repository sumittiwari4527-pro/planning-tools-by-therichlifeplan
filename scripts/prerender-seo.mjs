import fs from "node:fs";
import path from "node:path";

const distDir = path.resolve("dist");
const site = JSON.parse(fs.readFileSync("seo-pages.json", "utf8"));
const template = fs.readFileSync(path.join(distDir, "index.html"), "utf8");

const escapeHtml = (value) =>
  value.replace(/[&<>\"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;" })[char]);

const escapeJson = (value) => JSON.stringify(value).replace(/</g, "\\u003c");

function schemaForPage(page, kind) {
  const url = `${site.site.url}${page.path}`;
  const breadcrumb = {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: site.site.url },
      { "@type": "ListItem", position: 2, name: kind === "tool" ? "Tools" : "Articles", item: `${site.site.url}/${kind === "tool" ? "tools" : "blog"}` },
      { "@type": "ListItem", position: 3, name: page.title, item: url }
    ]
  };

  if (kind === "tool") {
    return [
      {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: page.name,
        url,
        description: page.description,
        applicationCategory: "UtilitiesApplication",
        operatingSystem: "Web",
        isAccessibleForFree: true,
        publisher: { "@type": "Organization", name: site.site.name, url: site.site.url }
      },
      breadcrumb
    ];
  }

  return [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: page.title,
      description: page.description,
      datePublished: page.date,
      author: { "@type": "Person", name: page.author },
      articleSection: page.category,
      mainEntityOfPage: { "@type": "WebPage", "@id": url },
      publisher: { "@type": "Organization", name: site.site.name, url: site.site.url }
    },
    breadcrumb
  ];
}

function renderPage(page, kind) {
  const title = escapeHtml(page.title);
  const description = escapeHtml(page.description);
  const url = `${site.site.url}${page.path}`;
  const schemas = schemaForPage(page, kind);
  const fallback = kind === "tool"
    ? `<main><h1>${title}</h1><p>${description}</p><p>Free to use with no sign-up required.</p></main>`
    : `<main><article><h1>${title}</h1><p>${description}</p></article></main>`;

  return template
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${title} — ${site.site.name}</title>`)
    .replace(/<meta name="description"[^>]*\/>/, `<meta name="description" content="${description}" />`)
    .replace(/<link rel="canonical"[^>]*\/>/, `<link rel="canonical" href="${url}" />`)
    .replace(/<div id="root"><\/div>/, `<div id="root">${fallback}</div>`)
    .replace("</head>", `<meta property="og:title" content="${title} — ${site.site.name}" />\n<meta property="og:description" content="${description}" />\n<meta property="og:url" content="${url}" />\n<meta property="og:type" content="${kind === "tool" ? "website" : "article"}" />\n<script type="application/ld+json">${escapeJson(schemas)}</script>\n</head>`);
}

for (const kind of ["tools", "articles"]) {
  for (const page of site[kind]) {
    const outputDir = path.join(distDir, page.path.replace(/^\//, ""));
    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(path.join(outputDir, "index.html"), renderPage(page, kind === "tools" ? "tool" : "article"));
  }
}

console.log(`Generated ${site.tools.length + site.articles.length} static SEO pages.`);
