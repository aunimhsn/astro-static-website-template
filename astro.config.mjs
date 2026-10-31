// @ts-check
import { rmSync } from "node:fs";
import { defineConfig } from "astro/config";
import sitemap from "./scripts/sitemap.mjs";
import urls from "./src/data/urls.json" with { type: "json" };

// The address of the site once its domain points to GitHub Pages: replace it at the setup of a
// project. Until the launch, the deployment workflow builds the github.io preview under a base
// path, from the SITE_URL and BASE_PATH variables of the repository (docs/technical-choices.md,
// Deployment).
const site = process.env.SITE_URL || "https://example.com";
const base = process.env.BASE_PATH || "/";

/** Prefixes a redirect destination with the base, which Astro leaves out. */
const to = (/** @type {string} */ path) => `${base.replace(/\/$/, "")}${path}`;

export default defineConfig({
  site,
  base,
  // GitHub Pages serves a-propos/index.html at /a-propos/ and redirects /a-propos to it: links and
  // canonical URLs end with a slash, in the development server too.
  trailingSlash: "always",
  // The former addresses that lead to a new page (src/data/urls.json): GitHub Pages has no
  // server-side redirects, so Astro writes a page that leads on at once.
  redirects: Object.fromEntries(
    Object.entries(urls.redirects).map(([from, path]) => [from, to(path)]),
  ),
  integrations: [
    // Astro also builds src/pages/3xx.astro as a page of its own, /3xx.html, without a redirect
    // to fill it: it is removed, if Astro wrote it.
    {
      name: "redirect-page",
      hooks: {
        "astro:build:done": ({ dir }) =>
          rmSync(new URL("3xx.html", dir), { force: true }),
      },
    },
    sitemap(),
  ],
  experimental: {
    // Each redirect is written with src/pages/3xx.astro, a page in the language of the site,
    // instead of Astro's page in English (docs/technical-choices.md, Astro).
    redirectPage: true,
  },
  // Self-hosted fonts, downloaded at build time once the mock-up has chosen them
  // (docs/branding.md, Typography), for example:
  // fonts: [
  //   {
  //     provider: fontProviders.google(),
  //     name: "Manrope",
  //     cssVariable: "--font-title",
  //     weights: ["600 800"],
  //     styles: ["normal"],
  //     display: "block",
  //     fallbacks: ["system-ui", "sans-serif"],
  //   },
  // ],
  // then `<Font cssVariable="--font-title" preload />` in src/layouts/base-layout.astro.
});
