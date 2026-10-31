# Technical choices

The technical choices of the [roadmap](../roadmap.md), with their reasons and the alternatives rejected. They come from the template, first used for sylent.art (2026-10): confirm or adapt them in the specifications step, and record each change here with its date.

## Stack

| Topic | Choice | Reason |
|---|---|---|
| Hosting | GitHub Pages, with a custom domain | Free for a public repository, no server to maintain, HTTPS included. Limits in [external-services.md](external-services.md). |
| Static site generator | [Astro](https://astro.build/) 7, static output | Built-in redirects, validated content collections, image optimization and zero JavaScript by default. Its syntax (HTML, CSS, a little JavaScript) is easy to read and edit. |
| Runtime and packages | Node.js 24 LTS, npm (`package-lock.json`) | The version is pinned in `.nvmrc` and in `engines` of `package.json`, and CI uses the same one. |
| Styles | Native CSS, design tokens as CSS custom properties | See [Styles](#styles). |
| Content | JSON and Markdown files in `src/content/`, interface texts in `src/i18n/fr.json` | The content stays out of the layouts and components, so that a translation can be added later (see [Content](#content)). |
| Formatter | Prettier, with `prettier-plugin-astro` | One tool for Astro, CSS, JavaScript, JSON and the content. The documentation (`*.md` at the root, `docs/`, `.claude/`) is left out (`.prettierignore`): Prettier would pad every table to its widest cell. |
| Linters | ESLint with `typescript-eslint`, `eslint-plugin-astro` and its strict accessibility rules (`jsx-a11y-strict`, with `eslint-plugin-jsx-a11y-x`); Stylelint with `stylelint-config-standard` and `stylelint-config-html`; `astro check` | Errors and missing accessibility attributes in the templates, invalid or duplicate CSS (the `<style>` blocks included), type errors and wrong component props. `eslint-plugin-jsx-a11y-x` is the maintained fork that `eslint-plugin-astro` supports. |
| Link check | linkinator on the built site, plus `scripts/check-urls.mjs` | See [Addresses check](#addresses-check). |
| Width check | `scripts/check-overflow.mjs`, in the Chromium of [Playwright](https://playwright.dev/) | See [Width check](#width-check). |
| Brand images | `scripts/brand-images.mjs`, in the same Chromium | The favicon and the preview card made again in one command when the brand changes. See [Brand images](#brand-images). |
| Deployment | GitHub Actions (`.github/workflows/deploy.yml`) on every push to `main`, with `withastro/action` and `actions/deploy-pages` | A merged pull request is deployed without a manual step. See [Deployment](#deployment). |
| Checks in CI | GitHub Actions (`.github/workflows/ci.yml`) on every pull request | Runs `npm run check`, the same command as before a commit. |
| Updates | Dependabot (`.github/dependabot.yml`), weekly | npm packages (minor and patch grouped) and GitHub Actions. |

Rejected:

- **Eleventy**: just as capable for a static site, but the redirects, image conversion and content validation have to be assembled from plugins by hand.
- **Hugo**: one fast binary, but its Go template language is harder to read and edit.
- **Hand-written HTML**: the header and footer copied in every page, and nothing checks the content or the redirects.
- **An application framework (Vue, React, Laravel)**: it needs a server or ships a JavaScript application, for a handful of static pages.

## Astro

- **URLs with a final slash**: Astro writes each page as a folder with an `index.html` (`build.format: "directory"`), and GitHub Pages serves `a-propos/index.html` at `/a-propos/` and redirects `/a-propos` to it: the links and canonical URLs end with a slash, and `trailingSlash: "always"` makes the development server behave the same way.
- **Redirects**: `src/data/urls.json` lists the former paths: those kept as pages, those redirected to a new page, and those dropped. `astro.config.mjs` reads its `redirects` and, since GitHub Pages has no server-side redirects, Astro writes for each a page with a canonical link and an immediate `<meta http-equiv="refresh">`. Astro doesn't add the base path to their destination: `astro.config.mjs` adds it. A redirect computed from the content (a former id in a content file) can be written by a dynamic page with `Astro.redirect`: add it to the check.
- **Redirect pages in French**: `experimental.redirectPage` (Astro 7.4, experimental on 2026-10-30) writes each redirect with `src/pages/3xx.astro` instead of Astro's page in English. Astro also builds the template itself as `/3xx.html`: a hook of `astro.config.mjs` removes it. If the option disappears, Astro falls back to its own page and `scripts/check-urls.mjs` fails.
- **Sitemap and `robots.txt`**: `scripts/sitemap.mjs`, a small integration, writes `sitemap.xml` once the site is built, from the canonical link of every page that points to itself: the redirect pages and the not-found page are left out by construction, and a new page is listed without changing the script. `src/pages/robots.txt.ts` gives its address. Rejected: `@astrojs/sitemap`, whose filter would have to list every redirect.
- **Open Graph**: `src/layouts/base-layout.astro` gives every page the tags that LinkedIn, Facebook and the messaging apps read to show a card for a link (`og:title`, `og:description`, `og:url`, `og:site_name`, `og:locale`, `twitter:card`) and one image, `src/assets/brand/social-card.png`, converted to JPEG at 1200 × 630 (the networks read JPEG everywhere, WebP not always); its name carries a hash of its content, so that a new image gets a new URL. The URLs are absolute, built from `site` and the base.
- **Not-found page**: `src/pages/404.astro`, written as `404.html`, which GitHub Pages serves for every path without a page, with `noindex` and no canonical link.
- **Images**: the `astro:assets` `<Image>` component converts the images to WebP at the size they are shown and sets their width and height, which avoids layout shifts.
- **Fonts**: Astro's Fonts API (`fonts` in `astro.config.mjs`, `<Font />` in the layout) downloads the fonts at build time and serves them from the site itself, with a fallback adjusted to their metrics so that the text doesn't move when they load. Only fonts whose license allows self-hosting (SIL Open Font License).
- **JavaScript**: none by default. The scripts the mock-up needs (animations, 3D) are chosen after it, installed with npm and bundled by Astro, without a CDN; the content never depends on them, and nothing moves when the visitor asked to reduce motion.

## Deployment

- `.github/workflows/deploy.yml` follows the [Astro guide](https://docs.astro.build/en/guides/deploy/github/): `withastro/action` installs, builds and uploads `dist/`, then `actions/deploy-pages` publishes it. In the repository's **Settings → Pages**, the source is **GitHub Actions**.
- **Until the launch**, the site is checked at `https://<owner>.github.io/<repository>/`, a project site under a base path: the repository variables `SITE_URL` (`https://<owner>.github.io`) and `BASE_PATH` (`/<repository>`), in **Settings → Secrets and variables → Actions → Variables**, are read by `astro.config.mjs`. Every internal link goes through `href()` (`src/lib/url.ts`), and the layout adds `noindex` under a base.
- **At the launch**, the custom domain is set in the Pages settings with HTTPS enforced, and the two variables are deleted: the site is then built for the `site` of `astro.config.mjs`, at the root. A workflow with `actions/deploy-pages` ignores a `CNAME` file: the domain lives in the Pages settings only.
- Only the `deploy` job may write to GitHub Pages (`pages: write`, `id-token: write`); the build job, which runs the dependencies, only reads the repository.
- A ruleset on `main` requires a pull request, merged by squash only, whose `check` job passes, and forbids force pushes and deleting the branch.

## Styles

- **Design tokens** are the named values of the visual design: `--color-accent: #1d4ed8`, `--space-4: 16px`, `--size-title: 28px`. They are declared once in `src/styles/tokens.css`, and every component uses them (`color: var(--color-accent)`): changing the main color means changing one line. The values of the template are neutral placeholders, replaced by those of the mock-up.
- The **breakpoints** can't be CSS variables, since a media query doesn't read them: they are written as numbers in the media queries, and listed in `docs/branding.md`.
- Component styles live in the `<style>` block of each Astro component, which Astro scopes to that component: a class name in one component cannot break another. A component styles the inside of a child (an SVG logo) with `:global(...)` inside one of its own selectors.
- The classes shared by every page (`.wrap`, `.visually-hidden`…) are in `src/styles/global.css`.
- `main` clips what runs past its sides (`overflow-x: clip`), which makes no scroll container, so the sticky blocks keep working: anything that may run past the edge of the screen goes inside `main`.

## Content

- `src/i18n/fr.json`: the interface texts (name of the site, navigation, footer, skip link), so that no French text is hard-coded in a component.
- `src/content/<page>.json`: the texts of each page (`home.json`, `legal.json`, `not-found.json`, `redirect.json`), imported as JSON.
- A list of similar entries (offers, articles, projects) becomes an Astro content collection, one Markdown file per entry, whose front matter is validated by a schema in `src/content.config.ts`: a missing field fails the build instead of publishing a broken page.
- `src/data/urls.json`: the former addresses and their redirects.
- `src/lib/url.ts`: every internal link goes through `href("/mentions-legales/")`, which adds the base path of the preview.

## Addresses check

- **linkinator** serves the built site (`dist/`) as a static host would and follows every internal link of every page, CSS and anchors included (`linkinator.config.json`). External links are skipped, so that a slow third-party site doesn't break the CI.
- **`scripts/check-urls.mjs`** checks what no link shows: every former address of `src/data/urls.json` resolves (a page, or a redirect to the given page, which exists), the dropped ones are not built, the not-found page is built, every redirect page is the one of `3xx.astro`, the sitemap lists only pages, and every page has the Open Graph tags of its own title and canonical link and a built image.
- A build under a base is checked with `node scripts/check-urls.mjs dist /<base>`; linkinator needs the build served under the base (copy `dist/` into a `<base>` folder of a temporary directory and run it there).
- Rejected: **lychee**, faster, but a Rust binary installed apart from npm.

## Width check

- **Why**: on sylent.art, a large faded word ran past the right edge of the screen; `overflow-x: hidden` on the body hid it on a computer, but Chrome on Android still widened the page and left a black band. Only a browser that lays the page out can see it.
- **`scripts/check-overflow.mjs`** serves `dist/` as GitHub Pages would, loads every page (the not-found page included, the redirect pages left out) in the Chromium of Playwright as on a phone (320, 360 and 412 px, `isMobile`), then on a computer (1024 and 1440 px), scrolls it to the bottom, and fails if the page got wider than the screen, if an element marked `data-one-line` (a large title) takes more than one line, or if a script throws. Only the local server is reached.
- **Playwright** (the library, without its test runner, a development dependency): its Chromium is downloaded apart, headless only, once with `npx playwright install --only-shell chromium` locally, at every run with `--with-deps` in CI. Chromium, since the bug showed on Android, whose browsers are mostly built on it.

## Brand images

- **`scripts/brand-images.mjs`** draws, in the same Chromium, the images that come from the brand assets ([branding.md](branding.md#brand-assets)): from `src/assets/brand/icon.svg`, `public/favicon.svg`, `public/favicon.ico` (16, 32 and 48 px, the PNG images in an ICO file written by the script) and `public/apple-touch-icon.png` (180 px, on the color of the corners of the icon, since iOS shows no transparency); from `src/assets/brand/social-card.html`, a page of 1200 × 630 px designed in the style of the site, `src/assets/brand/social-card.png`. The images are committed; run `npm run brand:images` again after changing a source.
- Rejected: a favicon generator site (a manual step, to redo by hand), and an image library such as sharp (another dependency, while Playwright is already there).

## Commands

Run `npm ci` first, and `npx playwright install --only-shell chromium` once. They are also in the `scripts` of `package.json`.

| Command | What it does |
|---|---|
| `npm run dev` | Local development server, reloads on every change (`http://localhost:4321`). |
| `npm run build` | Production build to `dist/`; must finish without errors or warnings. |
| `npm run preview` | Serves the production build of `dist/` locally. |
| `npm run format` | Formats every file with Prettier. |
| `npm run format:check` | Checks the formatting without changing files. |
| `npm run lint` | `astro check`, ESLint and Stylelint. |
| `npm run check:links` | linkinator and `scripts/check-urls.mjs` on `dist/` (after `npm run build`). |
| `npm run check:overflow` | The width of every page on a phone and a computer (after `npm run build`). |
| `npm run check` | Everything run before a commit and in CI: format, lint, build, links, width. |
| `npm run brand:images` | The favicon, the iPhone icon and the preview card, from the brand assets. |
| `python3 docs/mockups/serve.py <port>` | Serves the repository root without cache for the mock-up. The port of this project: `<port>` (choose one between 8700 and 8799 at the setup, unused by the other projects). |

## Exceptions to the naming conventions

Imposed by Astro or the tools, everything else in kebab-case:

- `src/pages/404.astro` and `src/pages/3xx.astro`: the names Astro gives the not-found page and the redirect page; `src/pages/robots.txt.ts`, named after the file it writes.
- The pages are named after their URL, in the language of the site (`src/pages/mentions-legales.astro`); dynamic routes use brackets (`src/pages/offres/[offer].astro`).
- Configuration files keep the names the tools look for: `astro.config.mjs`, `src/content.config.ts`, `eslint.config.js`, `.prettierrc`, `.prettierignore`, `.stylelintrc.json`, `linkinator.config.json`, `.nvmrc`, `tsconfig.json`, `.vscode/extensions.json` (the VS Code extensions of Astro, Prettier, ESLint and Stylelint, proposed when the folder is opened).
- Component files stay in kebab-case (`src/components/site-header.astro`), although the Astro documentation names them in PascalCase; they are imported under a PascalCase name (`import SiteHeader from ...`), as Astro requires.
