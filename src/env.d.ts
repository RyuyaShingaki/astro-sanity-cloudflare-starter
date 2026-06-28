/// <reference types="astro/client" />

// Cloudflare の bindings 型 (worker-configuration.d.ts) は tsconfig の include 経由で読み込まれる

// ビルド時に参照する公開環境変数 (import.meta.env)
interface ImportMetaEnv {
  readonly PUBLIC_SANITY_PROJECT_ID: string;
  readonly PUBLIC_SANITY_DATASET: string;
  readonly PUBLIC_SANITY_API_VERSION: string;
  readonly PUBLIC_SITE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Cloudflare Workers のランタイム値 (bindings / シークレット)。
// ASSETS 等は wrangler types が worker-configuration.d.ts に生成する。
// .dev.vars / wrangler secret で渡すシークレットはここで型付けする。
declare namespace Cloudflare {
  interface Env {
    SANITY_API_READ_TOKEN: string;
    RESEND_API_KEY: string;
  }
}
