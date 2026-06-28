---
description: Sanity スキーマ・GROQ クエリの規約
paths: ["**/sanity/**", "**/schemaTypes/**", "**/*.groq", "sanity.config.*", "sanity.cli.*"]
---

# Sanity 規約

## 構成

- スキーマと Studio は `studio/` に独立した package として置く (Astro アプリには Studio を同梱しない)
- スキーマ定義は `studio/schemaTypes/` に置き、`studio/schemaTypes/index.ts` で集約する
- Astro 側のクエリは `src/lib/queries.ts`、取得は `src/lib/sanity.ts` の `sanityFetch` を使う
- コンテンツ操作・GROQ 検証は公式 Sanity プラグイン / MCP を任意で併用できる (README 参照)

## 環境変数

- Astro 側の projectId / dataset / API バージョンは `.env` の `PUBLIC_SANITY_*`
- 読み取り/プレビュー用トークンは `.dev.vars` の `SANITY_API_READ_TOKEN` (コミットしない)
- Studio 側は `studio/.env` の `SANITY_STUDIO_PROJECT_ID` / `SANITY_STUDIO_DATASET`

## 型安全

- スキーマとクエリは型安全を最優先にする
- 型はルートで `npm run sanity-types` (内部で `sanity schema extract` + `sanity typegen generate`) を実行して `src/sanity.types.ts` に生成し、これを利用する。手書きで重複定義しない
- スキーマ・クエリを変更したら必ず型を再生成する。生成型 (`POSTS_QUERY_RESULT` 等) を `sanityFetch<T>` に渡す

## スキーマ

- スキーマ定義は `defineType` / `defineField` を使い、型推論を効かせる
- フィールド名・型名は一貫した命名規則にそろえる
- `document` 型は `slug` 等の基本フィールドをそろえ、プレビュー設定を行う

## GROQ クエリ

- クエリは `defineQuery` でラップし、typegen の対象にする
- 取得するフィールドは明示的に列挙する (`...` の濫用を避ける)
- 画像・参照は必要なプロジェクションだけ展開する
