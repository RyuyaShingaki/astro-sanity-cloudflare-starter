---
description: SEO / OGP / 構造化データ / sitemap / robots / AI 最適化の規約
paths: ["**/*.astro", "src/layouts/**", "src/pages/**", "astro.config.*"]
---

# SEO / AI 最適化規約

## 基本方針

- 全ページが OGP・構造化データ・正規 URL を備えることを必須にする
- メタ情報・OGP・構造化データは共通の SEO コンポーネント / レイアウトに集約し、ページごとに props で渡す。ページ単位で書き散らさない

## メタ情報

- 各ページに `title` と `meta description` を必ず設定する
- 正規 URL (`<link rel="canonical">`) を出力する。URL は末尾スラッシュなしで統一する (astro ルール参照)
- `og:locale` (例: `ja_JP`) と `og:site_name` を設定する

## OGP (Instagram / X / Facebook / TikTok 対応)

- これらのプラットフォームはいずれも Open Graph を読むため、完全な `og:*` を出力すれば 4 つすべてに対応できる
- 必須の Open Graph: `og:title`, `og:description`, `og:image`, `og:url`, `og:type`, `og:site_name`, `og:locale`
- `og:image` は 1200x630 推奨・絶対 URL で指定し、`og:image:width` / `og:image:height` / `og:image:alt` を付ける
- X 向けに Twitter Card を併記する: `twitter:card` (`summary_large_image`), `twitter:site`, `twitter:title`, `twitter:description`, `twitter:image`
- Instagram / TikTok は独自タグを持たず Open Graph を参照するため、上記がそろっていれば対応できる
- Facebook で必要な場合のみ `fb:app_id` を追加する (任意)
- 画像を持たないページはサイト共通のデフォルト OGP 画像にフォールバックする

## 構造化データ (JSON-LD)

- テンプレート構築時点で実装可能なものを実装する:
  - 全ページ共通: `Organization` (店舗なら `LocalBusiness`) と `WebSite`
  - パンくず: `BreadcrumbList`
  - ブログ記事: `Article` / `BlogPosting` (見出し・著者・公開日 `datePublished`・更新日 `dateModified`・画像)
  - 一覧/固定ページ: `WebPage`
- `<script type="application/ld+json">` で出力し、型安全なヘルパーで生成する
- 実データが無い項目は出力しない (空値・ダミーを入れない)

## sitemap.xml (自動生成)

- `@astrojs/sitemap` を導入し、ビルド時に sitemap を自動生成する
- `astro.config.mjs` の `site` に本番 URL を設定する (`PUBLIC_SITE_URL` と一致させる)
- 下書き・`noindex` のページは sitemap から除外する

## robots.txt (自動生成)

- robots.txt を自動生成する (`src/pages/robots.txt.ts` エンドポイントで動的生成し、`PUBLIC_SITE_URL` を参照する)
- `Sitemap:` に sitemap の絶対 URL を記載する
- 検索・AI クローラーの許可方針を明示する

## AI 最適化 (AEO / 生成エンジン最適化)

- セマンティック HTML を徹底する: 見出し階層を正しく (`h1` は 1 ページ 1 つ)、landmark (`header` / `nav` / `main` / `article` / `footer`) を使い、リスト・表を適切にマークアップする
- コンテンツは結論を先に置き、明快で構造化された文章にする。AI が要約・引用しやすい記述を心がける
- meta description と構造化データを充実させ、ページの主題が機械的に判別できるようにする
- 画像の `alt` とリンクテキストは説明的にする (「こちら」等の曖昧な表現を避ける)
- `llms.txt` をサイトルートに用意し、サイト概要と主要ページへのリンクを記載する (任意だが推奨)
- AI クローラー (`GPTBot` 等) の許可方針を robots.txt で明示する

## アクセシビリティ (SEO と連動)

- 画像に `alt`、フォーム要素に `label`、十分なコントラストを確保する
- 画像は適切な幅・高さを指定し、遅延読み込みする
