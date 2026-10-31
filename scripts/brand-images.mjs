// Makes the images of the site that come from the brand assets (docs/branding.md, Brand assets),
// drawn by the Chromium of Playwright, so that they are made again in one command when the brand
// changes:
// - from src/assets/brand/icon.svg, the square icon: public/favicon.svg (a copy),
//   public/favicon.ico (16, 32 and 48 px) and public/apple-touch-icon.png (180 px, on the color
//   of the corners of the icon, since iOS shows no transparency);
// - from src/assets/brand/social-card.html, the card that the networks show for a link:
//   src/assets/brand/social-card.png (1200 × 630 px), converted to JPEG by the build.
// The images are committed. Run `npm run brand:images` after changing one of the two sources.
import { copyFileSync, readFileSync, writeFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { chromium } from "playwright";

// The functions given to page.evaluate run in the page, with the globals of the browser.
/* global document, Image */

const icon = "src/assets/brand/icon.svg";
const card = "src/assets/brand/social-card.html";
const iconUrl = `data:image/svg+xml;base64,${readFileSync(icon).toString("base64")}`;

/** An ICO file holding PNG images, as every browser reads it. */
const ico = (images) => {
  const header = Buffer.alloc(6 + 16 * images.length);
  header.writeUInt16LE(1, 2); // Type: icon.
  header.writeUInt16LE(images.length, 4);
  let offset = header.length;
  images.forEach(({ size, png }, index) => {
    const entry = 6 + 16 * index;
    header.writeUInt8(size % 256, entry); // 0 means 256.
    header.writeUInt8(size % 256, entry + 1);
    header.writeUInt16LE(1, entry + 4); // Color planes.
    header.writeUInt16LE(32, entry + 6); // Bits per pixel.
    header.writeUInt32LE(png.length, entry + 8);
    header.writeUInt32LE(offset, entry + 12);
    offset += png.length;
  });
  return Buffer.concat([header, ...images.map(({ png }) => png)]);
};

const browser = await chromium.launch();
try {
  const page = await browser.newPage();

  /** The icon drawn at a size, on a transparent background or on a color. */
  const drawIcon = async (size, background = "transparent") => {
    await page.setViewportSize({ width: size, height: size });
    await page.setContent(
      `<style>html,body{margin:0;background:${background}}img{display:block;width:${size}px;height:${size}px}</style><img src="${iconUrl}" alt="">`,
    );
    await page.locator("img").evaluate((image) => image.decode());
    return page.screenshot({ omitBackground: background === "transparent" });
  };

  copyFileSync(icon, "public/favicon.svg");
  const sizes = [16, 32, 48];
  const images = [];
  for (const size of sizes) images.push({ size, png: await drawIcon(size) });
  writeFileSync("public/favicon.ico", ico(images));

  // The color of the top left pixel of the icon, under its rounded corners if any.
  const corner = await page.evaluate(async (url) => {
    const image = new Image();
    image.src = url;
    await image.decode();
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 64;
    const context = canvas.getContext("2d");
    context.drawImage(image, 0, 0, 64, 64);
    const [r, g, b] = context.getImageData(32, 1, 1, 1).data;
    return `rgb(${r} ${g} ${b})`;
  }, iconUrl);
  writeFileSync("public/apple-touch-icon.png", await drawIcon(180, corner));

  await page.setViewportSize({ width: 1200, height: 630 });
  await page.goto(pathToFileURL(card).href);
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: "src/assets/brand/social-card.png" });
} finally {
  await browser.close();
}
console.log(
  "public/favicon.svg, favicon.ico, apple-touch-icon.png and src/assets/brand/social-card.png written.",
);
