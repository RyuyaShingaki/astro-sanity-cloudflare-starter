---
description: 依存パッケージ・ツールチェーンの注意点
paths: ["package.json", "package-lock.json", "lefthook.yml"]
---

# 依存・ツールチェーンの注意

## Vite のバージョン

- Astro 7 系では astro 本体・`@astrojs/cloudflare`・`@tailwindcss/vite` がすべて Vite 8 を要求するため、現状 vite の `overrides` は不要 (置いていない)
- 以前 Astro 6 時代に必要だった `overrides.vite` を Astro 7 で復活させると、ビルド出力が壊れる (prerender エントリが見つからないエラー) ので追加しないこと

## lefthook

- pre-commit で prettier (自動整形 + 再ステージ) / eslint / astro check が走る
- 設定は lefthook.yml

## npm audit

- moderate 警告は @astrojs/check の推移的依存 (yaml-language-server) 由来で、開発時専用のため許容する
- `npm audit fix --force` は @astrojs/check をダウングレードするので実行しないこと

## Node.js

- バージョンは `.nvmrc` / `.node-version` で 22 系 LTS に固定している
- package.json には `engines.node` (`>=22`) を設定する
