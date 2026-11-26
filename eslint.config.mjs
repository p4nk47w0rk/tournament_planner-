import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import sonarjs from "eslint-plugin-sonarjs";
import unicorn from "eslint-plugin-unicorn";

const eslintConfig = defineConfig([
  ...nextVitals,

  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),

  // ============================================
  // KISS — Keep It Simple, Stupid
  // ============================================
  {
    files: ["**/*.{ts,tsx}"],
    plugins: { sonarjs },
    rules: {
      // Cognitive complexity > 15 signals complexity that hurts readability
      "sonarjs/cognitive-complexity": ["error", 15],

      // Max nesting depth to keep code readable
      "max-depth": ["error", 4],

      // Max lines per function — warn initially, can tighten to error later
      "max-lines-per-function": [
        "warn",
        { max: 50, skipComments: true, skipBlankLines: true },
      ],

      // Max lines per file — error
      "max-lines": [
        "error",
        { max: 300, skipComments: true, skipBlankLines: true },
      ],

      // Max statement complexity per line
      complexity: ["error", 10],
    },
  },

  // ============================================
  // DRY — Don't Repeat Yourself
  // ============================================
  {
    files: ["**/*.{ts,tsx}"],
    plugins: { unicorn },
    rules: {
      // Prefer Set.has over Array.includes for lookups
      "unicorn/prefer-set-has": "error",

      // Prefer Object.fromEntries over manual object construction
      "unicorn/prefer-object-from-entries": "error",

      // No duplicate imports
      "no-duplicate-imports": "error",

      // No useless string escapes
      "unicorn/no-invalid-remove-event-listener": "error",

      // Prefer structuredClone over spread for deep copies
      "unicorn/prefer-structured-clone": "error",

      // No redundant conditionals
      "unicorn/no-nested-ternary": "error",

      // Prefer top-level await over .then() chains
      "unicorn/prefer-top-level-await": "error",
    },
  },

  // ============================================
  // SOLID — Single Responsibility & Related
  // ============================================
  {
    files: ["**/*.{ts,tsx}"],
    plugins: { sonarjs },
    rules: {
      // Unused function arguments hint at SRP violations
      "sonarjs/no-unused-function-argument": "error",

      // Don't ignore return values
      "sonarjs/no-ignored-return": "error",

      // Switch should not be too small
      "sonarjs/no-small-switch": "error",

      // No inverted boolean checks
      "sonarjs/no-inverted-boolean-check": "error",
    },
  },

  // ============================================
  // Type safety
  // ============================================
  {
    files: ["**/*.{ts,tsx}"],
    rules: {
      // No any — enforce proper types
      "@typescript-eslint/no-explicit-any": "error",

      // Prefer const over var
      "no-var": "error",

      // No unused expressions (allow short-circuit and ternary)
      "no-unused-expressions": "off",
      "@typescript-eslint/no-unused-expressions": [
        "error",
        { allowShortCircuit: true, allowTernary: true },
      ],
    },
  },

  // ============================================
  // React — sensible defaults
  // ============================================
  {
    files: ["**/*.{ts,tsx}"],
    rules: {
      // Allow useState in useEffect for localStorage/mounted patterns
      "react-hooks/set-state-in-effect": "warn",
    },
  },
]);

export default eslintConfig;
