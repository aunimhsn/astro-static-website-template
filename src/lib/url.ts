// Internal links go through this helper: until the launch, the site is also built under the base
// path of its github.io preview (docs/technical-choices.md, Deployment), and a link written
// without the base would lead to a 404 there.

/** The path of a page of the site, with the base: `href("/mentions-legales/")`. */
export const href = (path: string) =>
  `${import.meta.env.BASE_URL.replace(/\/$/, "")}${path}`;

/**
 * The `aria-current` value of a navigation link: `page` on the page itself, `true` on a page
 * inside its section, nothing elsewhere.
 */
export const currentOf = (link: string, current: string) => {
  if (current === href(link)) return "page";
  if (link !== "/" && current.startsWith(href(link))) return "true";
  return undefined;
};
