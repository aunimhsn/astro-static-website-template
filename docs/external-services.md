# External services

The external services of the site, their limits and terms of use, and the risks the owner accepts, with their date. Check them again before relying on a figure, since the terms change.

## GitHub Pages (hosting)

Source: [GitHub Pages limits](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits), checked on 2026-10-27.

| Limit | Value |
|---|---|
| Published site size | 1 GB maximum |
| Source repository | 1 GB recommended |
| Bandwidth | 100 GB per month (soft limit) |
| Builds | 10 per hour (soft limit), not applied to a custom GitHub Actions workflow |
| Deployment | Times out after 10 minutes |

- No server-side code and no server-side redirects: the redirects are static pages (`src/pages/3xx.astro`).
- Not for sensitive transactions (passwords, credit card numbers).
- **Commercial use**: GitHub Pages « is not intended for or allowed to be used as a free web-hosting service to run your online business, e-commerce site, or any other website that is primarily directed at either facilitating commercial transactions or providing commercial software as a service (SaaS) ». A showcase site with no sale and no payment is a gray area, tolerated in practice. If GitHub ever suspended the site, the static build moves to Cloudflare Pages or Netlify (free plans that allow commercial use) in a few minutes, then the DNS records change. Record here whether the owner accepts this risk, with the date.
- On a free account, the repository must be public for GitHub Pages and for the rulesets that protect `main`.

## Legal notice

<!-- In France, article 6 of the LCEN: the publisher (name, address, phone, SIRET for a business) and the host (name, address, phone). Record the information the owner chooses not to show, and the risk accepted, with the date. GitHub's own pages give only the address of GitHub, Inc. (88 Colin P. Kelly Jr. Street, San Francisco, CA 94107), no phone number. -->

## Other services

<!-- One section per service the site uses (a form service, analytics, maps, videos…): its documentation, plan and limits, the personal data it collects and where, whether it needs a consent banner, and the alternatives rejected. -->
