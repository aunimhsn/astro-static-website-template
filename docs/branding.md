# Branding

The visual identity of the site: the brand assets, then every design decision settled with the owner during the mock-up, with its tokens. Each decision is written here in the same commit as the change; the options set aside go to [Set aside](#set-aside). The tokens are applied in `src/styles/tokens.css`.

## Brand assets

What the owner provides (process.md, Specifications), where it is kept, and what is missing. The sources go in `src/assets/brand/`; the images derived from them are made by `npm run brand:images`.

| Asset | Format | File | Status |
|---|---|---|---|
| Logo for a light background | SVG (or PNG at least 512 px) | `src/assets/brand/logo.svg` | Placeholder |
| Logo for a dark background | SVG (or PNG at least 512 px) | | To ask |
| Wordmark (the name, if apart from the symbol) | SVG | | To ask |
| Square icon, readable at 16 px | SVG | `src/assets/brand/icon.svg` | Placeholder |
| Favicon (SVG, ICO 16/32/48 px) and iPhone icon (180 px) | Made from the icon | `public/` | Made by the script |
| Preview card of the links (1200 × 630 px) | HTML drawn to PNG, converted to JPEG by the build | `src/assets/brand/social-card.html` | Placeholder |
| Colors of an existing charter | Hex values | | To ask |
| Fonts, with their license (self-hosting allowed) | Name, or files | | To ask |
| Photos of the owner or the team, with their rights | JPEG or PNG, large | | To ask |
| Logos of the partners or clients, with the permission to show them | SVG | | To ask |
| Public contact details and legal information | Text | `src/i18n/fr.json`, `src/content/legal.json` | To ask |

## Principles

<!-- Three to five sentences: what the site must convey, for whom, and the main rule of the style. -->

## Logo

<!-- Which variant where (header, footer, favicon, card), the minimum size, the clear space. -->

## Colors

<!-- One line per token: name, value, use, contrast checked against WCAG AA. -->

| Token | Value | Use |
|---|---|---|

## Typography

<!-- The fonts and their license, one size per role (display, title, body, label), weights, line heights. -->

## Spacing

<!-- The scale: --space-N = N × 4 px, and where each common value is used. -->

## Layout and shapes

<!-- Content width, gutters, corner radius, the breakpoints (written as numbers in the media queries). -->

## Components

<!-- Buttons, cards, form fields, navigation: their states (hover, focus, active, disabled). -->

## Motion

<!-- What moves, how long, and what happens when the visitor asked to reduce motion. -->

## Tone of the texts

<!-- « vous » or « tu », length, how the calls to action and the errors are worded. -->

## Icons and images

<!-- Where they come from, their license, their format and sizes. -->

## Accessibility

<!-- Contrast, focus, the minimum size of touch targets, the alternative texts. -->

## Set aside

<!-- The options compared and not kept, with the reason, so that they are not proposed again. -->
