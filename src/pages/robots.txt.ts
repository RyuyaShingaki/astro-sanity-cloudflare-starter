import type { APIRoute } from "astro";

export const GET: APIRoute = ({ site }) => {
  const siteUrl = site?.href ?? "https://example.com/";
  const body = `User-agent: *
Allow: /

Sitemap: ${new URL("sitemap-index.xml", siteUrl).href}
`;
  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
