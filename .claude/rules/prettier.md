---
description: Prettier の構成規約
paths: ["prettier.config.*", ".prettierrc", ".prettierrc.*"]
---

# Prettier 構成規約

## 設定フォーマット

- `prettier.config.mjs` または `prettier.config.js` を使う
- `.prettierrc` / `.prettierrc.json` などコメントを書けない形式は使わない

## 必須プラグイン

- `prettier-plugin-astro` ... .astro ファイルの整形
- `prettier-plugin-tailwindcss` ... Tailwind クラスの並べ替え (必ず最後に読み込む)

## 基本オプション方針

- `semi: true` ... セミコロンあり
- `singleQuote: false` ... ダブルクォート (Astro / HTML 慣習に合わせる)
- `trailingComma: "all"` ... 末尾カンマあり (Git diff をクリーンに保つ)
- `printWidth: 100` ... 1 行の最大幅
- `tabWidth: 2` / `useTabs: false` ... スペース 2 インデント

## ignore パターン

- `.prettierignore` で `node_modules`, `dist`, `.astro`, `.wrangler` を除外する

## ESLint との役割分担

- フォーマット (インデント・クォート・改行) は Prettier に完全委譲する
- ESLint はロジック・品質ルールのみ担当する
- `eslint-config-prettier` で競合を防ぐ (ESLint 側で設定)
