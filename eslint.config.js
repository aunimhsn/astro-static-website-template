// @ts-check
import js from "@eslint/js";
import astro from "eslint-plugin-astro";
import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
  globalIgnores(["dist/", ".astro/", "docs/mockups/"]),
  js.configs.recommended,
  tseslint.configs.recommended,
  astro.configs.recommended,
  // Accessibility of the templates: alt texts, labels, valid ARIA, keyboard access.
  astro.configs["jsx-a11y-strict"],
  {
    // The configuration files and the check scripts run in Node.js.
    files: ["*.{js,mjs}", "scripts/**/*.mjs"],
    languageOptions: { globals: globals.node },
  },
]);
