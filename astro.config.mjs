import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  // sitemap / canonical / OGP の絶対 URL に使う。PUBLIC_SITE_URL と一致させる
  site: process.env.PUBLIC_SITE_URL ?? "https://example.com",
  // 下層ページの URL は末尾スラッシュなしで統一する
  // (Cloudflare の静的アセット配信が /about/index.html を /about で返すため format:file は不要)
  trailingSlash: "never",
  adapter: cloudflare(),
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
