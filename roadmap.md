# Roadmap

The steps chosen for the site described in [specs.md](specs.md), following [process.md](process.md). Each step is delivered in its own pull request, which checks its box. What is noted and not chosen yet lives in [backlog.md](backlog.md).

## Size of the project

<!-- Chosen with the owner at the setup (process.md, Size the project): the tools this project uses, and how far. For example: « A brand site of a few page types: every tool, in order, for the first cycle. » -->

## Reference

Read only by the steps that need them:

- [Technical choices](docs/technical-choices.md): the stack, the commands and the main designs, with their reasons.
- [Branding](docs/branding.md): the brand assets, the visual identity and every design decision of the mock-up, with the tokens.
- [External services](docs/external-services.md): limits and terms of the services, and the risks accepted by the owner.
- [Roadmap archive](docs/roadmap-archive.md): the detail of the steps done, moved there once their pull request is merged.
- [Backlog](backlog.md): what is noted and not chosen yet, read when the next work is chosen.

## Steps

<!--
The usual steps of the first cycle of a site; adapt them at the setup, one line per step done with its pull requests. Each step names the tools it needs (process.md, Size a change). A later cycle adds its steps under a heading of its own (« Cycle 2: testimonials and an English version »), numbered after the last one.
-->

### Cycle 1: the site online

- [ ] **0. Project setup**: the size of the project, the Project section of `CLAUDE.md`, the name of the site, the port of the mock-up server, the repository settings.
- [ ] **1. Specifications and structure**: audiences, value proposition, brand assets, external services; the content tree in Excalidraw, the URLs and redirects.
- [ ] **2. Wireframes**: one Excalidraw wireframe per page type, phone first.
- [ ] **3. Mock-up**: 3 or 4 styles, then every page of the first release in `docs/mockups/`, checked on the owner's phone; decisions in `docs/branding.md`.
- [ ] **4. Design system**: the tokens in `docs/branding.md`, the mock-up rewritten to use only them, an entry in `design-journal.md`.
- [ ] **5. Skeleton and deployment**: the tokens and fonts of the mock-up in `src/styles/`, the brand assets (`npm run brand:images`), the header and footer, the deployment to the `github.io` preview.
- [ ] **6. Pages**: one step per page type, as specified.
- [ ] **7. Launch**: the site checked on the preview, the DNS switched by the owner, the custom domain and HTTPS.
- [ ] **8. Retrospective**: the lessons in `process.md` (and in the template when they apply to every website), the backlog sorted, the memory moved to the files.

The steps may be split into sub-steps when a pull request grows too large. When no step is left, Claude Code proposes the next items of the backlog to the owner.
