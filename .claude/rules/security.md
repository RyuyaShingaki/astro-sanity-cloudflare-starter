---
description: セキュリティヘッダ / CSP / 入力検証の規約
paths: ["public/_headers", "src/middleware.*", "src/pages/api/**", "astro.config.*"]
---

# セキュリティ規約

## セキュリティヘッダ

- サイト全体のヘッダは Cloudflare の `public/_headers` で付与する (静的アセットにも適用される)
- 最低限、以下を設定する:
  - `X-Content-Type-Options: nosniff`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `X-Frame-Options: DENY` (または CSP の `frame-ancestors`)
  - `Strict-Transport-Security` (HTTPS 前提)

## CSP (Content-Security-Policy)

- 既定は自己ドメイン中心の許可リストにする
- 外部リソースは必要なものだけ明示する。Sanity 画像 CDN (`cdn.sanity.io`) を `img-src` に追加する
- インライン `<script>` を使う場合は JSON-LD のような静的データに限定する (`set:html` で出力)

## 入力検証

- フォーム / API ルートの入力は必ずサーバー側で検証する (resend-email スキル参照)
- エラー応答に API キーや内部情報を含めない
- スパム対策 (レート制限・honeypot 等) を検討する

## シークレット

- シークレットはコードに直書きせず、Cloudflare のシークレット経由で扱う (cloudflare ルール参照)
