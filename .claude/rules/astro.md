---
description: Astro コンポーネント・ルーティングの規約
paths: ["**/*.astro", "src/**"]
---

# Astro 規約

## コンポーネント設計

- 既定はサーバーでレンダリングし、クライアント JavaScript を出力しない
- インタラクティブが必要な箇所だけ `client:*` ディレクティブを付ける。`client:load` の濫用を避け、`client:visible` / `client:idle` を優先する
- レイアウトは `src/layouts/`、再利用部品は `src/components/` に置く

## データ取得

- Sanity からのデータ取得はビルド時 (SSG) を基本とし、動的が必要な箇所のみ SSR にする
- 取得ロジックはコンポーネントに直書きせず `src/lib/` に分離する

## 画像

- ローカル画像は `astro:assets` の `<Image>` / `<Picture>` を使い、幅高さ・フォーマット最適化・遅延読み込みを効かせる
- Sanity の画像は `src/lib/sanity.ts` の `urlForImage` で幅・フォーマットを指定して配信する。生の `asset->url` を直接使わない
- すべての画像に意味のある `alt` を付ける (装飾画像は空 `alt=""`)

## フォント

- フォントは `astro:assets` の Fonts API かセルフホストで読み込み、`font-display: swap` とサブセット化で CLS と読み込みを最適化する
- フォントファミリーは Tailwind の `@theme` のトークンと連動させる (tailwind ルール参照)

## 多言語 (i18n)

- 既定は日本語単一 (`<html lang="ja">`、`og:locale: ja_JP`)
- 多言語化する場合は Astro 標準の i18n routing を使い、独自実装しない

## ルーティング

- ページは `src/pages/` のファイルベースルーティングに従う
- ブログ記事など動的ルートは `[slug].astro` + `getStaticPaths` で生成する
- API エンドポイント (`src/pages/api/`) で SSR が必要な場合は `export const prerender = false` を明示する

## URL の形式

- 下層ページの URL はトレイリングスラッシュなしで終わらせる (例: `example.com/about`。`example.com/about/` にしない)
- `astro.config.mjs` で `trailingSlash: "never"` を設定する。Cloudflare の静的アセット配信が `/about/index.html` を `/about` で返すため、これだけで末尾スラッシュなしになる
- `build: { format: "file" }` は `@astrojs/cloudflare` のオンデマンドルートと併用するとビルドが壊れるため使わない
- 内部リンク (`href`) も末尾スラッシュなしで統一し、表記を混在させない
