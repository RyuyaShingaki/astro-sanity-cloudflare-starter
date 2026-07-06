import js from "@eslint/js";
import tseslint from "typescript-eslint";
import astro from "eslint-plugin-astro";
import prettier from "eslint-config-prettier";
import globals from "globals";

export default tseslint.config(
  {
    ignores: [
      "dist",
      ".astro",
      ".wrangler",
      "node_modules",
      "studio",
      "worker-configuration.d.ts",
      "src/sanity.types.ts",
    ],
  },
  js.configs.recommended,
  tseslint.configs.recommended,
  astro.configs.recommended,
  {
    // 設定ファイルと .claude のフックスクリプトは Node 実行環境 (process など)
    files: ["*.config.mjs", "*.config.js", ".claude/**/*.mjs"],
    languageOptions: { globals: globals.nodeBuiltin },
  },
  prettier,
);
