// Checks that no page of the built site (dist/) is wider than the screen, on a phone and on a
// computer. A block that runs past the right edge (a large faded word, a wide image) lets Chrome
// on Android widen the page to show it, which the build and linkinator can't see: only a browser
// that lays the page out does. Each page is loaded in the Chromium of Playwright, then scrolled to
// the bottom, since some blocks move with the scroll. It also fails on an element marked
// `data-one-line` (a large title) that takes more than one line.
// Run after `npm run build`: `node scripts/check-overflow.mjs [dist]`. Install the browser once
// with `npx playwright install --only-shell chromium`.
import {
  createReadStream,
  existsSync,
  readdirSync,
  readFileSync,
  statSync,
} from "node:fs";
import { createServer } from "node:http";
import { extname, join, relative, sep } from "node:path";
import { chromium } from "playwright";

const [dist = "dist"] = process.argv.slice(2);

// The narrowest screen still met, the narrowest common Android one and a wider one; then a small
// and a large computer screen.
const phones = [320, 360, 412];
const desktops = [1024, 1440];

const types = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "text/javascript",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
};

/**
 * Every page of the site, as its URL path, the not-found page (404.html) included: the redirect
 * pages are left out.
 */
const pagesOf = (folder) =>
  readdirSync(folder).flatMap((name) => {
    const path = join(folder, name);
    if (statSync(path).isDirectory()) return pagesOf(path);
    const notFound = name === "404.html" && folder === dist;
    if (name !== "index.html" && !notFound) return [];
    if (/http-equiv=["']?refresh/i.test(readFileSync(path, "utf8"))) return [];
    if (notFound) return ["/404.html"];
    const parent = relative(dist, folder).split(sep).join("/");
    return [parent ? `/${parent}/` : "/"];
  });

// A static server, as GitHub Pages serves dist/: a folder serves its index.html.
const server = createServer((request, response) => {
  let path = join(dist, decodeURIComponent(request.url.split("?")[0]));
  if (existsSync(path) && statSync(path).isDirectory()) {
    path = join(path, "index.html");
  }
  if (!existsSync(path)) {
    response.writeHead(404).end();
    return;
  }
  response.writeHead(200, {
    "content-type": types[extname(path)] ?? "application/octet-stream",
  });
  createReadStream(path).pipe(response);
});
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const origin = `http://127.0.0.1:${server.address().port}`;

// Scrolls the page down to the bottom and returns the largest width it reached. It runs in the
// page, with the globals of the browser. Each step jumps at once: a smooth scrolling would only
// start a scroll that the next step interrupts.
/* global document, getComputedStyle, innerHeight, scrollTo */
const widest = async () => {
  await document.fonts.ready;
  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const root = document.documentElement;
  let width = root.scrollWidth;
  for (let y = 0; y <= root.scrollHeight; y += innerHeight / 2) {
    scrollTo({ top: y, behavior: "instant" });
    await wait(50);
    width = Math.max(width, root.scrollWidth);
  }
  return width;
};

// The elements marked data-one-line that take more than one line, with their number of lines.
// Runs in the page.
const wrapped = () =>
  [...document.querySelectorAll("[data-one-line]")].flatMap((element) => {
    const style = getComputedStyle(element);
    const line =
      parseFloat(style.lineHeight) || parseFloat(style.fontSize) * 1.2;
    const lines = Math.round(element.getBoundingClientRect().height / line);
    return lines > 1
      ? [`« ${element.textContent.trim()} » on ${lines} lines`]
      : [];
  });

const pages = pagesOf(dist);
if (pages.length === 0) {
  console.error(`No page in ${dist}/: build the site first.`);
  process.exit(1);
}
const browser = await chromium.launch();
const errors = [];

try {
  for (const width of [...phones, ...desktops]) {
    const phone = phones.includes(width);
    const context = await browser.newContext({
      viewport: { width, height: 800 },
      deviceScaleFactor: phone ? 3 : 1,
      isMobile: phone,
      hasTouch: phone,
    });
    // Only the local server is reached: a slow third-party script would fail the check.
    await context.route(
      (url) => url.origin !== origin,
      (route) => route.abort(),
    );
    // A few tabs at once, each taking the next page of the list. A page that fails to load, or
    // whose scripts throw, is reported with the others instead of stopping the check.
    const queue = [...pages];
    const tab = async () => {
      const page = await context.newPage();
      let current = "";
      page.on("pageerror", (error) => {
        errors.push(
          `${current}: script error at ${width} px, ${error.message}`,
        );
      });
      for (let path; (path = queue.shift());) {
        current = path;
        try {
          await page.goto(`${origin}${path}`, { waitUntil: "load" });
          const reached = await page.evaluate(widest);
          if (reached > width) {
            errors.push(`${path}: ${reached} px wide on a ${width} px screen`);
          }
          for (const element of await page.evaluate(wrapped)) {
            errors.push(`${path}: ${element} at ${width} px`);
          }
        } catch (error) {
          errors.push(`${path}: not checked at ${width} px, ${error.message}`);
        }
      }
    };
    await Promise.all(Array.from({ length: 4 }, tab));
    await context.close();
  }
} finally {
  await browser.close();
  server.close();
}

if (errors.length > 0) {
  const report = errors.sort().join("\n- ");
  console.error(
    `Pages wider than the screen, elements on several lines, or pages not checked:\n- ${report}`,
  );
  process.exit(1);
}
console.log(
  `${pages.length} pages fit a screen of ${[...phones, ...desktops].join(", ")} px.`,
);
