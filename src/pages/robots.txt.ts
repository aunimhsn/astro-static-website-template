// robots.txt: every page may be crawled, and the sitemap gives their addresses
// (scripts/sitemap.mjs). The github.io preview is kept out of the search engines by the noindex
// of its pages, since they read only the robots.txt at the root of <owner>.github.io.
import type { APIRoute } from "astro";

export const GET: APIRoute = ({ site }) => {
  const sitemap = new URL(
    `${import.meta.env.BASE_URL.replace(/\/$/, "")}/sitemap.xml`,
    site,
  );
  return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${sitemap}\n`);
};
