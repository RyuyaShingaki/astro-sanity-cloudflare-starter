---
description: テスト方針の規約
paths: ["**/*.test.ts", "**/*.spec.ts", "vitest.config.*", "playwright.config.*"]
---

# テスト方針

## 既定

- このテンプレートは既定でテストを同梱しない (最小構成のため)
- ロジックが増えたら下記の方針で導入する。導入有無は明示的に決める

## ユニットテスト

- ユニットテストは Vitest を使う
- Cloudflare Workers のコード (API ルート等) は `@cloudflare/vitest-pool-workers` で workerd 上でテストする
- 純粋なユーティリティ (`src/lib/` の変換・整形) を優先してテストする

## E2E

- E2E が必要なら Playwright を使い、主要導線 (トップ・ブログ詳細・問い合わせ送信) に絞る

## 方針

- カバレッジ目標より「壊れると困る箇所」を優先する
- 外部サービス (Sanity / Resend) はモックし、ネットワークに依存させない
