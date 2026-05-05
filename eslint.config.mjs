import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import jsxA11y from "eslint-plugin-jsx-a11y";

// eslint-config-next already registers the jsx-a11y plugin with a default
// rule set. Layer the plugin's "recommended" rules on top without
// re-registering the plugin to avoid a flat-config "Cannot redefine plugin" error.
//
// Note on eslint-plugin-tailwindcss: installed for Phase 7 but not wired
// here — v3.x does not fully support Tailwind v4 (no config file) and
// emits false positives.

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      ...jsxA11y.flatConfigs.recommended.rules,
      // Allow leading-underscore arg names to signal intentionally-unused
      // parameters (used in Phase-0 server-action stubs).
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_", caughtErrorsIgnorePattern: "^_" },
      ],
    },
  },
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    ".claude/**",
    ".aider*",
    "node_modules/**",
  ]),
]);

export default eslintConfig;
