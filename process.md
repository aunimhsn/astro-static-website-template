# Process

How a static website goes from an idea to a site online, with Claude Code. It follows the process of [rust-cli-template](https://github.com/aunimhsn/rust-cli-template/blob/main/process.md), adapted to a website: the release becomes the launch on GitHub Pages. Each phase ends with something to validate before the next one starts: changing a sentence in the specifications costs less than changing a wireframe, which costs less than changing code.

This file is a living document: update it with what worked and what didn't (see [Retrospective](#8-retrospective)), and bring back to the template the lessons that apply to every website.

```
1. Repository ─▶ 2. Specs ─▶ 3. Wireframes ─▶ 4. Mock-up ─▶ 5. Design system ─▶ 6. Build ─▶ 7. Launch ─▶ 8. Retrospective ─▶ 9. Polish ─▶ 10. Next cycle
   setup           specs.md     Excalidraw       HTML           tokens             one PR       github.io     process.md           (optional)    back to 2
                   content tree                                 branding.md        per step     then DNS                           small PRs     for its scope
                   brand assets
                       ▲                                                                                                                               │
                       └───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

| Phase | Output | Done when |
|---|---|---|
| [1. Repository](#1-repository) | The repository created from the template, its settings | `main` is protected and the setup pull request is merged. |
| [2. Specifications](#2-specifications) | `specs.md`, the content tree, `roadmap.md`, notes of `docs/` | The owner has answered the open questions and merged them. |
| [3. Wireframes](#3-wireframes) | `docs/wireframes/*.excalidraw` | The owner has edited and approved the layout of every page type. |
| [4. Mock-up](#4-mock-up) | `docs/mockups/*.html` | Every page and state looks right at every width, on the owner's phone too. |
| [5. Design system](#5-design-system) | Design tokens and decisions in `docs/branding.md` | Colors, sizes and typography are written as tokens. |
| [6. Build](#6-build) | One pull request per roadmap step | Every box of `roadmap.md` is checked. |
| [7. Launch](#7-launch) | Site on `github.io`, then on its domain | The owner has checked the site and switched the DNS. |
| [8. Retrospective](#8-retrospective) | Changes to this file and to the template | The lessons are written down. |
| [9. Polish](#9-polish) (optional) | Small pull requests from the « Later » list | The touches the owner picked are online. |
| [10. Next cycle](#10-next-cycle) | `specs.md` updated, new steps in `roadmap.md` | The owner has approved the scope of the cycle; phases 2 to 8 start again for it. |

## 1. Repository

1. Create the repository from the template (see the README, **Start a new project**).
2. Apply the pull request settings: squash merging only, branches deleted once merged.
3. Protect `main` with a ruleset. On a free GitHub account, rulesets only apply to **public** repositories.
4. Setup pull request: the **Project** section of `CLAUDE.md`, the name of the site in `package.json`, `astro.config.mjs` and `src/i18n/fr.json`, a port of its own for the mock-up server in `docs/technical-choices.md` (Commands).
5. Open Claude Code in the project folder. Its memory is stored per project: a new session doesn't remember a conversation held in another project. To carry context over, paste a summary of it.
6. Check the connectors: `.claude/settings.json` turns off the claude.ai connectors (`disableClaudeAiConnectors`), whose instructions and tools would be sent with every message. If the project needs one, remove the setting; `/mcp` lists the servers that are on, and `/context` what fills the context. In the same file, `skillOverrides` hides from the model the skills the project doesn't use (still available with `/<name>`): adjust the list, or use `/skills`. The skills of the project are in `.claude/skills/`, copied from the template.

## 2. Specifications

Goal: agree on **what** the site says and does before deciding **how**.

1. Describe the idea in a few sentences, then let Claude Code ask its questions, in batches of a few at a time. The usual ones for a brand site:
   - Who are the visitors, who decides, and what must they find before getting in touch?
   - What is the promise, what are the differentiators, what proves them?
   - Which offers or contents, grouped how, with which details?
   - What is the main action of the visitor, and what happens after it?
   - Is there a former site, whose URLs must keep working?
2. **Draw the content tree in Excalidraw** before the wireframes: what the site offers, grouped how, with the current state and two leads side by side, one group per item so that the owner moves them by hand. The URLs follow from it: settle them in the same phase, and write the former ones in `src/data/urls.json`. On sylent.art, the classification came after the build: the URLs changed twice and the offer pages were rebuilt.
3. **Ask for the brand assets**, and record in `docs/branding.md` (Brand assets) what is given and what is missing: the logo (symbol and wordmark) on a dark and on a light background, in SVG if possible; a square icon for the favicon; the colors and fonts of an existing charter, with the license of each font; the photos and their rights; the logos of the partners or clients and the permission to show them; the public contact details and the legal information. The favicon and the preview card of the links are made from them (`npm run brand:images`).
4. **Check the external services early** (GitHub Pages, and a form service or analytics if the site needs one): documentation, limits, terms of use, personal data, licenses of the images and fonts. Record the limits and every risk the owner accepts, with its date, in `docs/external-services.md`.
5. Write `specs.md`: behavior and content only (what the visitor sees, what each action does, the URLs and redirects, edge cases).
6. Confirm or adapt the technical choices of `docs/technical-choices.md`, with their reasons (and the alternatives rejected), then write the steps in `roadmap.md`, each small enough for one pull request. Choose only what the specifications need: the JavaScript libraries and the weight of script a page may carry wait for the mock-up (on sylent.art, « no JavaScript » was written before the mock-up and replaced after it by GSAP and Three.js).
7. Open the pull request; the owner reads the files on GitHub (**Files changed**) or in VS Code.

## 3. Wireframes

Goal: agree on the **layout** of each page type, without colors or code, in a format the owner can edit.

The `excalidraw-wireframes` skill carries out this phase: its Python helpers write the file and preview it.

1. Claude Code generates an Excalidraw file in `docs/wireframes/`: grayscale, real content from the specifications, one frame per page and width, **one group per block** so that a block moves in one click (double-click a block to edit one of its elements, **Ctrl+Shift+G** to ungroup it).
2. It checks the result with a preview, kept in its scratchpad, before handing over the `.excalidraw` file.
3. The owner edits it in VS Code with the **Excalidraw** extension (`pomdtr.excalidraw-editor`), or on excalidraw.com (**Open**, then **Save to…**).
4. Iterate: the owner draws their version, Claude Code rearranges it and fills the gaps, the owner draws the next version, and so on. Claude Code commits the owner's version before changing it, so that every iteration stays in the history.
5. Once the main frames are agreed, Claude Code draws the rest under them: other kinds of content, the states of a form, the open navigation menu at phone width, the not-found page.
6. Claude Code writes the agreed layout in `specs.md`.

Start with the phone width (mobile first): it forces to choose the essential, and the wider layouts then only rearrange the same blocks.

Working with the file:

- The VS Code extension does **not** save by itself, unlike excalidraw.com: press **Ctrl+S** before asking Claude Code to read the file.
- The extension keeps the drawing in memory and doesn't reload the file when it changes on disk. Before Claude Code rewrites the file, save and close its tab; afterwards, reopen it, and never save the old tab over the new file.

## 4. Mock-up

Goal: choose the style with real content, every page and every state, before building the site.

The `html-mockups` skill carries out this phase, from a starting page with the style and decision tabs, a server without cache and a headless screenshot script.

1. HTML pages in `docs/mockups/`, built from the approved wireframes, with the real content. Once the site has several page types, one page per page type, with the shared styles and scripts in `docs/mockups/shared/`, shown in a viewer (phone and desktop frames side by side).
2. **Several styles, 3 or 4**, each with its own fonts, colors and density, switched with **tabs at the top of the page**, from sober to spectacular. The address keeps the chosen style (e.g. `?theme=slate`) to share it. Each style only sets tokens (CSS variables); the components use them all, so that a style is cheap to add or tweak.
   - **Start from a scale of tokens** (spacing in steps of 4 px, one size per typographic role, a few breakpoints), even rough: raw values multiply during the iterations, and rounding them at the end shifts lines of text.
   - The styles explore **new directions** for this site and its visitors. [design-journal.md](design-journal.md) records the past experiences: it may inspire one of the styles, never all of them, and nothing in it is a default.
3. The owner picks a style, or mixes two; iterate on it alone, one change at a time (e.g. the main color, then the logo, then the font).
   - **Each open decision gets its own group of tabs** on the page, so that the owner compares on screen; once decided, the tab is removed, the choice is kept, and the decision is written in `docs/branding.md`.
   - **Pixel alignments are tuned by eye on the owner's real screen**, with a tab of offsets: the display scale differs from the headless screenshots, which only give the direction.
   - **Check the mock-up on the owner's phone** before approving it: on sylent.art, most of the feedback on the built site came from the phone (a page wider than the screen on Android, titles on two lines).
   - From then on, **the mock-up is the reference** of the interface; the wireframe only fixed the first layout, and is removed with the pull request of the mock-up (the Git history keeps it).
4. Use web fonts whose license allows self-hosting (e.g. SIL Open Font License). Preload the font files, so that the page, and its screenshots, only finish loading once the fonts are there.
5. Serve the repository root without cache, on the port of the project (written in `docs/technical-choices.md`, Commands), so that the page reaches the images of the repository, even in a sandboxed browser (Flatpak, Snap), and a reload never mixes old and new files:

   ```sh
   python3 docs/mockups/serve.py <port>
   ```

   then open `http://127.0.0.1:<port>/docs/mockups/<file>.html`, and reload after each change.
6. Claude Code checks its own changes with headless screenshots before asking for a review, and exports one large PNG per style to `outputs/` to compare them at a glance. A test that needs extra code runs on a copy of the page, never on the file the owner has open.

## 5. Design system

Goal: write down the visual choices once, so that every page stays consistent.

Write them in `docs/branding.md`, as named tokens, next to the decisions they come from:

- **Colors**: background, surfaces, borders, text, weak text, accent, link, focus, error, success; contrast checked against WCAG AA.
- **Sizes**: a spacing scale (e.g. 4, 8, 12, 16, 24 px), corner radius, content width, breakpoints.
- **Typography**: fonts, sizes per role (headline, title, body, caption), weights, line heights.
- **Images**: where they come from, their license, their format and sizes (WebP at the size shown).
- **Tone of the texts**: « vous » or « tu » for the visitors, length, how the calls to action and the errors are worded.

The mock-up is then updated to use exactly these tokens, compared with screenshots taken before the rewrite to see which shifts matter; its `:root` becomes `src/styles/tokens.css`. At the end of the phase, add an entry to [design-journal.md](design-journal.md), here and in the template: the choices kept, the ones rejected, and why.

## 6. Build

The template already holds the skeleton: layouts, tokens, not-found and redirect pages, sitemap, Open Graph, favicon, checks, CI and deployment. The first build step adapts it to the mock-up (tokens, fonts, header and footer) and turns on the deployment.

For each step of `roadmap.md`, in order:

1. Branch `<type>/<short-description>` from `main`. If the owner isn't testing anything, work in the main folder so that they can follow the changes in VS Code; otherwise, in a Git worktree outside the project.
2. Code; then run `npm run check`: formatter, linters, production build without errors or warnings, links and former URLs, width of every page on a phone.
3. Run the `code-reviewer` subagent: its notes, in French, go to `outputs/`. Claude Code summarizes them; the owner chooses which to apply.
4. Commit (Conventional Commits), push, open the pull request; it checks the step's box in `roadmap.md`.
5. The CI passes; the owner reviews and squash merges; `git pull` on `main`. The merge deploys the site to GitHub Pages.
6. When a step changes the behavior or the content plan, update `specs.md` and `roadmap.md` in the same pull request.

The owner looks at the preview on their phone after each page step, rather than all the pages at the end. When a bug reaches the owner that a check could have caught, the fix adds the check.

## 7. Launch

1. The owner checks every page on the `github.io` address, at phone and desktop width.
2. The site is ready to share: not-found page, redirect pages, sitemap, `robots.txt`, favicon, Open Graph tags and the preview card, checked with the LinkedIn Post Inspector and the Facebook Sharing Debugger.
3. The owner verifies the domain in their GitHub account (**Settings → Pages → Verified domains**, a TXT record). The custom domain field of the repository stays empty until the switch: filled earlier, it redirects the `github.io` preview to the old site.
4. Claude Code checks that every former URL resolves and describes the DNS records to set (GitHub Pages `A` and `AAAA` on the apex, `www` as a CNAME to `<owner>.github.io.`); the owner lowers their TTL a day before, then changes the DNS (never Claude Code).
5. Once the domain points to GitHub Pages: set the custom domain in the Pages settings, enforce HTTPS, delete the `SITE_URL` and `BASE_PATH` repository variables and run the deployment again, then check that `www` and `github.io` redirect to the domain.
6. Submit the sitemap to the search engines (Google Search Console, Bing Webmaster Tools) if the owner wants to.

## 8. Retrospective

After the launch, or after any phase that went badly:

1. What took longer than expected? What had to be redone? What did the owner like most?
2. Sort what is left: the small touches go to the « Later » list of `roadmap.md` for the polish (phase 9), the larger ideas to the same list for a next cycle (phase 10).
3. Update this file, and the template (`CLAUDE.md`, `process.md`, the skills, the skeleton) when the lesson applies to every website.

## 9. Polish

Optional: once the site is online and the lessons written, the small touches that were noted and set aside (`roadmap.md`, Later), before anything new.

1. Claude Code lists the touches of the « Later » list (a detail of a component, a micro-animation, a text, the weight of an image, an accessibility or performance audit), each with its cost; the owner picks the ones worth doing now.
2. One small pull request per touch, or per group of touches on the same page, with the checks and, for code, the code review. No new page and no change of the content tree here: those belong to a new cycle.
3. A touch of the design is tried first in the mock-up when it isn't obvious, and written in `docs/branding.md`.

## 10. Next cycle

The ideas that need more than a touch (a new page type, a new kind of content, a section of testimonials, a translation) make the next cycle, which runs the phases again for its own scope.

1. With the owner, choose the scope of the cycle from the « Later » list and the new needs; give it a goal in one sentence.
2. Update `specs.md` first (and the content tree, in Excalidraw, if the structure changes), then write the steps of the cycle in `roadmap.md` under a heading of their own (« Cycle 2: testimonials and English version »), numbered after the last step: the steps of the cycles done stay as one line each.
3. Run only the phases that apply: a new page type goes through its wireframe and mock-up (phases 3 and 4), a new token through `docs/branding.md` (phase 5); a new text goes straight to the build. The launch of a cycle is the merge of its last step, unless it changes the URLs or the domain.
4. End the cycle with its retrospective (phase 8), then polish or start the next one.

## Lessons learned

The lessons of the previous projects:

| Project | Lesson |
|---|---|
| rust-exile-market | Coded mock-ups were never exactly what the owner wanted: start with editable wireframes. |
| rust-exile-market | Read the terms of use of every data source during the specifications: a forbidden API changes the scope of version 1. |
| rust-exile-market | A Flatpak browser only receives the opened file: serve the repository with a local server. |
| rust-exile-market | On a free GitHub account, rulesets only protect public repositories. |
| rust-exile-market | The owner draws, Claude Code rearranges and completes: the wireframe iterations made the interface personal. |
| rust-exile-market | The VS Code Excalidraw extension neither autosaves nor reloads a file changed on disk: save, close, reopen. |
| rust-exile-market | Mock-ups got much better once the layout was settled: one question per phase (layout, then style). |
| rust-exile-market | Three styles on one page with tabs made the choice easy. |
| rust-exile-market | One tab group per open decision, removed once decided, turned about a hundred small decisions into quick on-screen comparisons. |
| rust-exile-market | Pixel offsets measured on headless screenshots were wrong on the owner's scaled screen: tune them by eye with a tab of values. |
| sylent.art | Mock-up as the reference: the build of a page mostly copied it, and the tokens of the mock-up became `tokens.css` as is. |
| sylent.art | The content tree came after the build: the URLs changed twice and the offer pages were rebuilt. Draw it in Excalidraw during the specifications. |
| sylent.art | Excalidraw also serves to sort content (a tree of offers, cards moved by hand), not only to lay out pages. |
| sylent.art | Bold variants (Three.js line-art scenes) showed the owner what they wanted: they couldn't have said « sober or spectacular » before seeing them. |
| sylent.art | Most feedback on the preview came from the phone: check the mock-up on a real phone, and the width of every page in CI from the first step. |
| sylent.art | A choice written before the mock-up (« no JavaScript ») was replaced once the mock-up was approved: choose the scripts after it. |
| sylent.art | The checks born from a bug (former URLs, page wider than the phone, title on two lines) kept it from coming back. |
| sylent.art | A worktree outside the folder open in VS Code is invisible to the owner: work on the branch in the main folder while they test nothing there. |
| sylent.art | Open a pull request only once the owner has seen the result (the review applied, the schema looked at). |
| sylent.art | Two mock-up servers of two projects on the same port broke the owner's page: one port per project, a server without cache. |
