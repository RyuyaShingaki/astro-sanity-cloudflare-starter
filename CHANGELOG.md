# Changelog

このプロジェクトの変更履歴です。フォーマットは [Keep a Changelog](https://keepachangelog.com/ja/1.1.0/) に従います。

## [Unreleased]

### Added

- セキュリティヘッダ + CSP を `public/_headers` で付与 (Sanity 画像 CDN を許可)。`security` rule を追加
- `testing` rule (テスト方針: 既定なし、Vitest / @cloudflare/vitest-pool-workers / Playwright の指針)
- `astro` rule に画像 (`astro:assets` / `urlForImage`)・フォント・多言語 (i18n) の方針を追記
- LICENSE (MIT) を追加し、README をテンプレート用にジェネリック化
- Sanity Studio (`studio/`) をブログ中核スキーマ (post / author / category / blockContent) で実装。独立 package で sanity.studio へデプロイ
- ブログ配線: `src/lib/queries.ts` (typed GROQ) / `src/pages/blog/` (一覧・詳細) / Portable Text レンダリング / `BlogPosting` JSON-LD。Sanity 未接続でもビルドが通るようクライアントをフォールバック
- 型生成フロー: `npm run sanity-types` でスキーマ + クエリから `src/sanity.types.ts` を生成
- 最小スケルトン一式: `package.json` / `astro.config.mjs` / `wrangler.jsonc` / `tsconfig.json` / `eslint.config.mjs` / `prettier.config.mjs` / `lefthook.yml` / `src/` (Layout・Seo・index・404・robots.txt・api/contact・lib/sanity) / `public/favicon.svg`
- CI ワークフロー `.github/workflows/ci.yml` (check / lint / build)
- `src/env.d.ts` と `wrangler types` 連携による環境変数・Cloudflare bindings の型付け
- `.vscode/extensions.json` (推奨拡張)
- Node.js バージョン固定 (`.nvmrc` / `.node-version` で 22 系 LTS)
- `.editorconfig` (エディタ非依存の整形設定)
- 環境変数テンプレート `.env.example` (公開・ビルド時) / `.dev.vars.example` (シークレット・Worker)
- スタック別の rules: `astro` / `tailwind` / `sanity` / `cloudflare` / `seo` / `dependencies`
- スキル: `resend-email` (Workers からの送信)
- `.mcp.json` で公式 MCP サーバー (Astro Docs / Sanity) を同梱。Resend MCP は任意オプトインとして README にスニペットを記載

### Changed

- CLAUDE.md をスリム化し、詳細規約を `.claude/rules/` に分離
- `eslint` / `prettier` / `typescript` の rules を本スタック (Astro) 向けに修正し、日本語表記を writing 規約 (半角括弧) にそろえる
- `tailwind` rule にスタイル方針を追記 (独自 CSS を避けて Tailwind ユーティリティで再現、任意値を濫用せず標準スケールを優先、テーマ拡張は最小限)
- `astro` rule に URL 形式の方針を追記 (トレイリングスラッシュなし。`trailingSlash: "never"`)
- `seo` rule を拡充 (Instagram/X/Facebook/TikTok 対応 OGP、JSON-LD 構造化データ、sitemap.xml・robots.txt の自動生成、AI 最適化 / AEO 方針)
- 公式連携の方針を整理: Sanity は公式 Claude Code プラグイン (MCP + スキル) に移行。Resend は自作スキル維持 + 公式 MCP を任意導入として README に追記
- スキャフォールドで判明した最新版の作法に追従: Astro 7 / Vite 8 のため vite `overrides` を削除、Cloudflare アダプター v14 の環境変数アクセスを `cloudflare:workers` の `env` に変更、`build.format: "file"` を不使用に (関連 rule・skill を更新)

### Removed

- 自作 `sanity-schema` スキル (公式 Sanity プラグインに置き換え。プロジェクト固有の方針は `sanity` rule に集約)
- package.json の vite `overrides` (Astro 7 + Vite 8 で不要かつビルドを壊すため)
