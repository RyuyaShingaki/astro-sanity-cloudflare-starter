import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import { Resend } from "resend";

export const prerender = false;

// 入力の上限。異常に長い入力は弾く (DoS / 悪用対策)
const MAX_NAME = 100;
const MAX_EMAIL = 254;
const MAX_MESSAGE = 5000;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const POST: APIRoute = async ({ request }) => {
  // env の binding はグローバルスコープではなくハンドラ内で参照する
  const resend = new Resend(env.RESEND_API_KEY);

  // フォーム以外の Content-Type は受け付けない
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.includes("form")) {
    return Response.json({ ok: false, error: "invalid content-type" }, { status: 415 });
  }

  const form = await request.formData();

  // ハニーポット: bot が埋めがちな隠しフィールド。値が入っていれば
  // スパムとみなし、成功を装って静かに破棄する (bot に検知させない)。
  // フロント側では aria-hidden・画面外に隠した <input name="company"> を置く。
  if (String(form.get("company") ?? "").trim() !== "") {
    return Response.json({ ok: true }, { status: 200 });
  }

  // 入力は必ずサーバー側で検証する
  const name = String(form.get("name") ?? "").trim();
  const email = String(form.get("email") ?? "").trim();
  const message = String(form.get("message") ?? "").trim();

  const errors: string[] = [];
  if (!name || name.length > MAX_NAME) errors.push("name");
  if (!email || email.length > MAX_EMAIL || !EMAIL_RE.test(email)) errors.push("email");
  if (!message || message.length > MAX_MESSAGE) errors.push("message");
  if (errors.length) {
    return Response.json({ ok: false, errors }, { status: 400 });
  }

  const { error } = await resend.emails.send({
    from: "noreply@example.com",
    to: "info@example.com",
    replyTo: email,
    subject: `お問い合わせ: ${name}`,
    text: `名前: ${name}\nメール: ${email}\n\n${message}`,
  });

  if (error) {
    // エラー詳細 (API キー等) を応答に含めない
    return Response.json({ ok: false }, { status: 502 });
  }
  return Response.json({ ok: true }, { status: 200 });
};
