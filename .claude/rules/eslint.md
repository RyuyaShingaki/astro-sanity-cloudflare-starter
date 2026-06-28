---
description: ESLint の構成規約
paths: ["eslint.config.*", ".eslintrc.*"]
---

# ESLint 構成規約

## 設定フォーマット

- ESLint v9 以降の Flat Config (`eslint.config.mjs` / `eslint.config.ts`) を使う
- レガシー形式 (`.eslintrc.*`) は使わない

## 必須プラグイン

- `eslint-plugin-astro` ... .astro ファイルの解析
- `typescript-eslint` ... TypeScript ルール
- `eslint-plugin-jsx-a11y` (astro 推奨経由) ... アクセシビリティ担保

## ルール選択方針

- `eslint-plugin-astro` の推奨設定をベースにする
- ルールを個別に無効化する場合は、その理由をコメントで必ず記載する
- `warn` より `error` を優先し、CI で確実に検知できるようにする
- `no-console` は `error`。ロギングは専用ユーティリティを使う

## Prettier との共存

- `eslint-config-prettier` を最後に適用してフォーマットルールの競合を防ぐ
- フォーマットは Prettier に完全委譲し、ESLint ではロジック・品質ルールのみ管理する

## ignore パターン

- `node_modules`, `dist`, `.astro`, `.wrangler` は必ず ignore に含める

## CI との連携

- `eslint --max-warnings 0` で警告ゼロを CI の通過条件にする
