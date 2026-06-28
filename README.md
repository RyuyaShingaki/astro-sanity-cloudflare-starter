# Astro Corporate / Blog Template

コーポレート・ポートフォリオ・LP・ブログ (オウンドメディア) 構築用のテンプレートです。

## 概要

Astro + Tailwind CSS v4 + Sanity + Resend を Cloudflare Workers 上で動かす雛形です。Sanity 未接続でもビルドでき、必要な設定を入れていくだけで公開できます。Claude Code 向けの規約 (`.claude/`) と公式 MCP 連携 (`.mcp.json`) を同梱しています。

> このテンプレートを使うときは、`README.md` のタイトル、`astro.config.mjs` の `site`、`wrangler.jsonc` の `name`、各コンポーネントの `"Example"` などを自分のプロジェクト用に置き換えてください。

## 技術スタック

| 領域           | 技術                                         |
| -------------- | -------------------------------------------- |
| フロントエンド | [Astro](https://astro.build/)                |
| スタイリング   | [Tailwind CSS](https://tailwindcss.com/) v4+ |
| 言語           | TypeScript                                   |
| CMS            | [Sanity](https://www.sanity.io/)             |
| ホスティング   | Cloudflare (Workers 想定)                    |
| バージョン管理 | git / GitHub                                 |

## 必要環境

- Node.js (LTS 推奨)
- npm / pnpm / yarn のいずれか

## セットアップ

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev
```

## ビルド・デプロイ

```bash
# 本番ビルド
npm run build

# ローカルでビルド結果を確認 (workerd で動作)
npm run preview

# Cloudflare へデプロイ (astro build + wrangler deploy)
npm run deploy
```

`@astrojs/cloudflare` アダプターと `wrangler.jsonc` は設定済み。初回デプロイ前に `wrangler.jsonc` の `name`、`astro.config.mjs` の `site`、各シークレット (`wrangler secret put`) を設定する。

## CMS (Sanity Studio)

Studio は `studio/` に独立した package として配置しています。

```bash
# 依存インストール (初回)
npm install --prefix studio

# studio/.env.example を studio/.env にコピーし projectId / dataset を設定

# Studio をローカル起動
npm run dev --prefix studio

# sanity.studio へデプロイ
npm run deploy --prefix studio
```

スキーマは `studio/schemaTypes/`、Astro 側のクエリは `src/lib/queries.ts` にあります。スキーマやクエリを変更したら、ルートで型を再生成します。

```bash
npm run sanity-types   # studio のスキーマ + クエリから src/sanity.types.ts を生成
```

> 初期状態 (Sanity 未接続) でもアプリはビルドできます。`PUBLIC_SANITY_PROJECT_ID` 未設定時はブログ取得が空になり、`/blog` は「記事はまだありません」を表示します。

## 開発ツール

| ツール                                      | 用途                                    | コマンド             |
| ------------------------------------------- | --------------------------------------- | -------------------- |
| Prettier (+ astro / tailwindcss プラグイン) | コード整形・Tailwind クラスのソート     | `npm run format`     |
| ESLint (eslint-plugin-astro)                | 静的解析                                | `npm run lint`       |
| astro check                                 | .astro ファイルの型チェック             | `npm run check`      |
| lefthook                                    | pre-commit フック (上記 3 つを自動実行) | コミット時に自動実行 |

## 公式連携 (Claude Code)

開発を補助する公式 MCP サーバーを、リポジトリ直下の `.mcp.json` に同梱しています。Claude Code の起動時に承認を求められるので、許可すると利用できます。

| MCP        | 認証         | 用途                                                |
| ---------- | ------------ | --------------------------------------------------- |
| Astro Docs | 不要         | 最新の Astro ドキュメントを参照してコード生成・回答 |
| Sanity     | OAuth (初回) | スキーマ・コンテンツ・GROQ・型生成・SEO/AEO の支援  |

- **Astro Docs MCP** ... 認証不要・リモート稼働。そのまま使える (詳細: [withastro/docs-mcp](https://github.com/withastro/docs-mcp))
- **Sanity MCP** ... 初回利用時に OAuth 認証する。スキル・スラッシュコマンドも欲しい場合は公式 [Sanity プラグイン](https://claude.com/plugins/sanity-plugin) を `/plugin` から導入する。プラグインは MCP も内包するため、その場合は `.mcp.json` の `Sanity` を削除して重複を避ける (詳細: [Sanity MCP ドキュメント](https://www.sanity.io/docs/ai/mcp-server))

### 任意: Resend MCP

メールのドメイン設定・送信テストなどを AI から操作したい場合のみ、`.mcp.json` の `mcpServers` に以下を追加する (要 `RESEND_API_KEY`)。アプリのメール送信コードは `.claude/skills/resend-email` のパターンに従う。

```json
"resend": {
  "command": "npx",
  "args": ["-y", "resend-mcp"],
  "env": { "RESEND_API_KEY": "${RESEND_API_KEY}" }
}
```

詳細: [Resend MCP](https://resend.com/mcp)

## ディレクトリ構成

```
.
├── src/
│   ├── components/     # 再利用部品 (Seo.astro 等)
│   ├── layouts/        # ページレイアウト
│   ├── lib/            # sanity.ts (クライアント) / queries.ts (GROQ)
│   ├── pages/          # ページ・API (blog/, api/contact.ts, robots.txt.ts)
│   ├── styles/         # グローバル CSS (Tailwind エントリ)
│   ├── env.d.ts        # 環境変数・Cloudflare bindings の型
│   └── sanity.types.ts # typegen 生成物 (手動編集しない)
├── studio/             # Sanity Studio (独立 package・スキーマ定義)
├── public/             # 静的アセット (favicon 等)
├── astro.config.mjs    # Astro 設定 (アダプター・sitemap・Tailwind)
├── wrangler.jsonc      # Cloudflare Workers 設定
├── tsconfig.json       # TypeScript 設定
├── prettier.config.mjs # Prettier 設定
├── eslint.config.mjs   # ESLint 設定 (flat config)
├── lefthook.yml        # git フック設定
├── .github/workflows/  # CI (check / lint / build)
├── README.md           # このファイル
├── CLAUDE.md           # Claude Code 向けのプロジェクトガイド
├── CHANGELOG.md        # 変更履歴
├── .mcp.json           # 公式 MCP サーバー定義 (Astro Docs / Sanity)
└── .claude/            # Claude Code の設定・ルール・スキル
```

## ライセンス

[MIT License](LICENSE)
