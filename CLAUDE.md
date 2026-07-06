# CLAUDE.md

このファイルは Claude Code がこのリポジトリで作業する際のガイドです。
詳細な実装規約は `.claude/rules/` に、定型作業は `.claude/skills/` に分離しています。

`.claude/rules/` は編集対象ファイルに応じて `.claude/hooks/apply-rules.mjs` (PreToolUse フック) が自動注入します。フックは `.claude/settings.json` に登録が必要です (未登録なら各ルールは下表のリンクから手動参照)。仕組みの詳細は [ルール自動適用フック](#ルール自動適用フック) を参照。

## プロジェクト概要

コーポレート、ポートフォリオ、LP、ブログ (オウンドメディア) 構築用のテンプレートです。

## 技術スタック (決定済み)

| 領域           | 技術                                       | 規約                                               |
| -------------- | ------------------------------------------ | -------------------------------------------------- |
| フロントエンド | Astro                                      | [astro](.claude/rules/astro.md)                    |
| スタイリング   | Tailwind CSS v4 以上                       | [tailwind](.claude/rules/tailwind.md)              |
| 言語           | TypeScript                                 | [typescript](.claude/rules/typescript.md)          |
| CMS            | Sanity (Studio 同梱)                       | [sanity](.claude/rules/sanity.md) + 公式プラグイン |
| メール送信     | Resend                                     | resend-email スキル                                |
| ホスティング   | Cloudflare Workers (`@astrojs/cloudflare`) | [cloudflare](.claude/rules/cloudflare.md)          |
| バージョン管理 | git / GitHub                               | [Git 規約](#git-規約)                              |

## 開発環境

Node バージョン (22 系 LTS 固定) と環境変数 (`.env` / `.dev.vars`) の詳細は [environment](.claude/rules/environment.md) を参照。

## 開発コマンド

```bash
npm run dev            # Astro 開発サーバー起動
npm run build          # 本番ビルド
npm run preview        # ビルド結果のローカル確認 (workerd で動作)
npm run deploy         # astro build + wrangler deploy
npm run check          # astro check (型チェック)
npm run lint           # ESLint
npm run format         # Prettier で整形
```

## コア規約 (常に厳守 / 詳細は各ルール)

フックが未発火の文脈 (設計・調査時など) でも守る、事故に直結する要点:

- ランタイムの値は `process.env` ではなく `cloudflare:workers` の `env` から参照する (cloudflare)
- 下層 URL は末尾スラッシュなし。`trailingSlash: "never"`。`build.format:"file"` は使わない (astro)
- TypeScript は `any` / 非 null アサーション `!` / `enum` を禁止。`unknown` + 型ガードで絞る (typescript)
- Sanity 画像は `urlForImage` 経由。生の `asset->url` を直接使わない (astro / sanity)
- フォーム・API の入力は必ずサーバー側で検証する (security)
- 日本語の丸括弧は半角、外側に半角スペース (writing)

## 禁止事項 (常時)

- **`notes/` ディレクトリは絶対に読み込まない**: 個人メモ用で git 管理外 (.gitignore 済み)。Read / Grep / Glob / Bash (cat など) いかなる手段でも `notes/` 配下のファイルにアクセスしない。`.claude/settings.json` の permissions.deny でも Read を禁止している
- **`npm audit fix --force` を実行しない**: @astrojs/check をダウングレードするため (詳細は [dependencies](.claude/rules/dependencies.md))
- **vite の `overrides` を追加しない**: Astro 7 では astro・アダプター・Tailwind がすべて Vite 8 で統一されており、固定するとビルドが壊れる (理由は dependencies 参照)

## Git 規約

- コミットメッセージ・ドキュメントは日本語で記載する
- コミットは Conventional Commits の prefix を付ける (`feat:`, `fix:`, `docs:`, `chore:` など)
- GitHub 上の操作 (PR、Issue など) は `gh` CLI を使う
- 変更履歴は CHANGELOG.md (Keep a Changelog 形式) に記録する
- 日本語の表記は [writing](.claude/rules/writing.md) に従う (丸括弧は半角、外側に半角スペース)

## ルール一覧 (.claude/rules/)

各ルールの frontmatter `paths:` に一致するファイルを編集するとき、フックが本文を自動注入します (下記「ルール自動適用フック」)。

- astro / tailwind / sanity / cloudflare / seo / security ... スタック別の実装規約
- typescript / eslint / prettier ... 言語・整形
- testing ... テスト方針
- dependencies ... vite/Node・lefthook・npm audit の注意
- environment ... Node バージョン・環境変数の設定
- writing ... 日本語表記

## ルール自動適用フック

Claude Code はネイティブでは `.claude/rules/` の `paths:` を解釈しないため、`.claude/hooks/apply-rules.mjs` (PreToolUse フック) が代行します。

- **動作**: Edit / Write / MultiEdit の直前に、対象ファイルパスを各ルールの `paths:` glob と照合し、一致したルール本文を `additionalContext` として注入する
- **登録**: 有効化には `.claude/settings.json` の `hooks.PreToolUse` に登録が必要 (下記)。未登録でも壊れないが、ルールは自動適用されず手動参照になる

```jsonc
// .claude/settings.json
"hooks": {
  "PreToolUse": [
    {
      "matcher": "Edit|Write|MultiEdit",
      "hooks": [
        { "type": "command", "command": "node \"$CLAUDE_PROJECT_DIR/.claude/hooks/apply-rules.mjs\"" }
      ]
    }
  ]
}
```

- **新しいルールの追加**: `.claude/rules/` に `paths:` 付き frontmatter の `.md` を置くだけでフックが拾う。フック側の変更は不要

## スキル / MCP

- (自作スキル) resend-email ... Workers から Resend で送信する実装
- (`.mcp.json`) astro-docs / Sanity ... 公式 MCP を同梱。Astro Docs は認証不要で最新ドキュメント参照、Sanity は OAuth でコンテンツ/スキーマ操作
- (公式プラグイン) Sanity ... スキーマ/GROQ/型/SEO のスキル・コマンドが必要なら `/plugin` で導入する (README 参照)
- (グローバル) wrangler / workers-best-practices ... Cloudflare 作業時に参照する
- (任意) Resend MCP ... メール運用操作を AI から行う場合に追加する (README 参照)
