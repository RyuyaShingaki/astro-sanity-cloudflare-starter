---
description: 開発環境 (Node バージョン・環境変数) の規約
paths: [".nvmrc", ".node-version", ".env", ".env.*", ".dev.vars", ".dev.vars.*", "wrangler.*", "package.json"]
---

# 開発環境規約

## Node.js バージョン

- Node.js は `.nvmrc` / `.node-version` で 22 系 LTS に固定する (現状 `22.16.0`)。`nvm use` 等でローカルを合わせる
- 2つのファイルは同じバージョンを指す。片方だけ更新しない

## 環境変数

- 公開・ビルド時の値は `.env.example` を `.env` に複製して設定する。`PUBLIC_` プレフィックスの値はクライアントに露出するので秘密情報を入れない
- シークレット・Worker ランタイムの値は `.dev.vars.example` を `.dev.vars` に複製して設定する。`.dev.vars` はコミットしない
- 本番のシークレットは `wrangler secret put <NAME>` で登録する
- ランタイムでの参照方法は [cloudflare](cloudflare.md) に従う (`process.env` ではなく `cloudflare:workers` の `env`)
