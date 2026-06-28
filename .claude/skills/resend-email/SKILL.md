---
name: resend-email
description: Cloudflare Workers (Astro) 上から Resend でトランザクションメールを送信する実装手順。お問い合わせフォームの送信処理や通知メールを実装するときに使う。
---

# Resend メール送信

Astro on Cloudflare Workers から Resend API でメールを送る実装パターン。Cloudflare 固有の規約は `.claude/rules/cloudflare.md` を参照する。

## 前提

- API キーは Worker のシークレットとして扱う。`.dev.vars` に `RESEND_API_KEY` を置き、本番は `wrangler secret put RESEND_API_KEY` で登録する
- `process.env` や `locals.runtime.env` ではなく `cloudflare:workers` の `env` から参照する (アダプター v14 の作法)
- 送信元ドメインは Resend 側で検証 (SPF / DKIM) 済みである必要がある
- `wrangler.jsonc` で `compatibility_flags: ["nodejs_compat"]` を有効にする

## 実装

雛形では `src/pages/api/contact.ts` に実装済み。基本形:

```ts
import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import { Resend } from "resend";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const resend = new Resend(env.RESEND_API_KEY);
  const form = await request.formData();

  // 入力は必ずバリデーションする
  const message = String(form.get("message") ?? "").trim();
  if (!message) {
    return new Response(JSON.stringify({ ok: false }), { status: 400 });
  }

  const { error } = await resend.emails.send({
    from: "noreply@example.com",
    to: "info@example.com",
    subject: "お問い合わせ",
    text: message,
  });

  if (error) {
    return new Response(JSON.stringify({ ok: false }), { status: 502 });
  }
  return new Response(JSON.stringify({ ok: true }), { status: 200 });
};
```

## 注意

- エラーはユーザーに適切なステータスで返し、API キー等の内部情報を漏らさない
- スパム対策 (レート制限・honeypot 等) を検討する

## 補足

- ドメイン設定・送信テストなどの運用操作を AI から行いたい場合は、公式 Resend MCP サーバー (`npx resend-mcp`) を任意で導入できる
- MCP は運用向け。アプリのメール送信コードは本スキルの実装パターンに従う
