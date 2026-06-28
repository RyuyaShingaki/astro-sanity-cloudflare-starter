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
