import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import sonarjs from "eslint-plugin-sonarjs";
import unicorn from "eslint-plugin-unicorn";

const eslintConfig = defineConfig([
  ...nextVitals,

  // Override default ignores of eslint-config-next.
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),

  // ============================================
  // KISS — Keep It Simple, Stupid
  // ============================================
  {
    files: ["**/*.{ts,tsx}"],
    plugins: { sonarjs },
    rules: {
      // Cognitive complexity > 15 — signals complexity that hurts readability
      "sonarjs/cognitive-complexity": ["error", 15],

      // Max nesting depth — beyond 3 levels, extract a function
      "max-depth": ["error", 3],

      // Max lines per function — warn (JSX-Componenten sind natürlicht länger)
      "max-lines-per-function": [
        "warn",
        { max: 80, skipComments: true, skipBlankLines: true },
      ],

      // Max lines per file — error
      "max-lines": [
        "error",
        { max: 300, skipComments: true, skipBlankLines: true },
      ],

      // Max statement complexity per line — keep branches simple
      complexity: ["error", 8],

      // Max parameters — if > 4, use an options object
      "max-params": ["error", 4],
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

      // No redundant catch — catch error variable is always useful
      "unicorn/no-useless-fallback-in-spread": "error",

      // Prefer the spread operator over Array.from when just transforming
      "unicorn/prefer-spread": "error",
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

      // Switch should not be too small (enough cases to justify it)
      "sonarjs/no-small-switch": "error",

      // No inverted boolean checks
      "sonarjs/no-inverted-boolean-check": "error",

      // Duplicate strings hint at DRY violations (warn: strings are common in UI)
      "sonarjs/no-duplicate-string": "warn",
    },
  },

  // ============================================
  // Type Safety (TS-Strict++)
  // ============================================
  {
    files: ["**/*.{ts,tsx}"],
    rules: {
      // No any — enforce proper types
      "@typescript-eslint/no-explicit-any": "error",

      // Prefers const for declarations that are never reassigned
      "prefer-const": "error",

      // No var
      "no-var": "error",

      // No unused expressions (allow short-circuit and ternary)
      "no-unused-expressions": "off",
      "@typescript-eslint/no-unused-expressions": [
        "error",
        { allowShortCircuit: true, allowTernary: true },
      ],

      // No unused labels
      "no-unused-labels": "error",
    },
  },

  // ============================================
  // React — sensible defaults
  // ============================================
  {
    files: ["**/*.{ts,tsx}"],
    rules: {
      // useState in useEffect for localStorage/mounted → warn (common pattern)
      "react-hooks/set-state-in-effect": "warn",

      // Exhaustive deps for hooks — error, prevents stale closure bugs
      "react-hooks/exhaustive-deps": "error",

      // No unused variables — allow _ prefix for intentionally unused
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          vars: "all",
          args: "after-used",
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
    },
  },

  // ============================================
  // Code Style — consistency
  // ============================================
  {
    files: ["**/*.{ts,tsx}"],
    rules: {
      // Prefer for...of over forEach with index
      "unicorn/no-for-loop": "error",
    },
  },
]);

export default eslintConfig;
