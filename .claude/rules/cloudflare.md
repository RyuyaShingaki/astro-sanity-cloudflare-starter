---
description: Cloudflare Workers / wrangler の規約
paths: ["wrangler.*", "**/*worker*", "src/pages/api/**"]
---

# Cloudflare Workers 規約

## アダプター

- `@astrojs/cloudflare` アダプターを使い、Workers 上で動かす
- 設定は `wrangler.jsonc` に集約する

## 環境変数・シークレット

- ランタイムの値 (bindings / シークレット) は `process.env` ではなく `cloudflare:workers` の `env` から参照する。`@astrojs/cloudflare` v14 で `Astro.locals.runtime.env` は廃止された

  ```ts
  import { env } from "cloudflare:workers";
  const key = env.RESEND_API_KEY;
  ```

- bindings の型は `wrangler types` で `worker-configuration.d.ts` に生成する (`npm run generate-types`。postinstall でも自動生成)
- `.dev.vars` のシークレットは自動では型に載らないため、`src/env.d.ts` で `Cloudflare.Env` を宣言マージして型付けする
- ローカル開発のシークレットは `.dev.vars` に置く (コミットしない)
- 本番のシークレットは `wrangler secret put <NAME>` で登録する
- 公開してよいビルド時設定のみ `.env` に置く (PUBLIC_ プレフィックス、`import.meta.env` で参照)

## 互換性

- `compatibility_date` を設定する
- Node 組み込み API が必要なライブラリ (Resend SDK 等) を使う場合は `compatibility_flags: ["nodejs_compat"]` を有効にする

## 参照

- 詳細な実装・レビュー・wrangler コマンドは wrangler / workers-best-practices スキルを参照する
