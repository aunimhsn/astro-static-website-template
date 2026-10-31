// The Astro integration that writes sitemap.xml once the site is built (astro.config.mjs): the
// canonical address of every page that is its own, read from the built pages. A redirect page
// points its canonical link to its target, and the not-found page has none, so neither is listed,
// and a new page is listed without changing this file (docs/technical-choices.md, Astro).
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, sep } from "node:path";
import { fileURLToPath } from "node:url";

/** The path a built file is served at, under the base: `a-propos/index.html` → `/a-propos/`. */
const pathOf = (file, base) =>
  `${base.replace(/\/$/, "")}/${file
    .split(sep)
    .join("/")
    .replace(/index\.html$/, "")}`;

/** The canonical address of a built page, if it is the page itself. */
const canonicalOf = (html, path) => {
  if (/http-equiv=["']?refresh/i.test(html)) return null;
  const link = html.match(/<link\b[^>]*\brel=["']?canonical\b[^>]*>/i)?.[0];
  const url = link?.match(/\bhref=["']?([^"'\s>]+)/i)?.[1];
  return url && new URL(url).pathname === path ? url : null;
};

/** A text escaped for XML. */
const escape = (text) =>
  text.replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&apos;",
      })[character],
  );

/** @returns {import("astro").AstroIntegration} */
export default function sitemap() {
  let base = "/";
  return {
    name: "sitemap",
    hooks: {
      "astro:config:done": ({ config }) => {
        base = config.base;
      },
      "astro:build:done": ({ dir, logger }) => {
        const root = fileURLToPath(dir);
        const urls = readdirSync(root, { recursive: true })
          .filter((file) => file.endsWith(".html"))
          .flatMap((file) => {
            const html = readFileSync(join(root, file), "utf8");
            const url = canonicalOf(html, pathOf(file, base));
            return url ? [url] : [];
          })
          .sort();
        // An empty sitemap would mean that the canonical links changed form: better fail.
        if (urls.length === 0) {
          throw new Error(
            "sitemap.xml: no page with a canonical link to itself",
          );
        }
        const entries = urls.map(
          (url) => `  <url><loc>${escape(url)}</loc></url>`,
        );
        writeFileSync(
          join(root, "sitemap.xml"),
          [
            '<?xml version="1.0" encoding="UTF-8"?>',
            '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
            ...entries,
            "</urlset>",
            "",
          ].join("\n"),
        );
        logger.info(`sitemap.xml: ${urls.length} pages`);
      },
    },
  };
}
