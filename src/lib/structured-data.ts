// schema.org の構造化データ (JSON-LD) を型付きで生成するヘルパー。
// 外部依存なし。実データが無い項目 (undefined) は出力しない。
//
// 使い方:
//   import { organization, blogPosting } from "../lib/structured-data";
//   const jsonLd = organization({ name: "Example", url: siteUrl });
//   <Layout jsonLd={jsonLd} ...>
// 複数渡す場合は配列で: jsonLd={[organization({...}), breadcrumbList([...])]}

export type JsonLd = Record<string, unknown>;

/** undefined / null / 空文字列のプロパティを取り除く (ダミー値を出さない) */
function clean(obj: Record<string, unknown>): JsonLd {
  const out: JsonLd = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value === undefined || value === null || value === "") continue;
    out[key] = value;
  }
  return out;
}

interface OrganizationInput {
  name: string;
  url: string;
  logo?: string;
  sameAs?: string[];
}

/** 全ページ共通。店舗業態なら type を "LocalBusiness" に差し替える */
export function organization(input: OrganizationInput): JsonLd {
  return clean({
    "@context": "https://schema.org",
    "@type": "Organization",
    name: input.name,
    url: input.url,
    logo: input.logo,
    sameAs: input.sameAs?.length ? input.sameAs : undefined,
  });
}

interface WebSiteInput {
  name: string;
  url: string;
  /** サイト内検索がある場合のみ指定 (例: "https://example.com/search?q={query}") */
  searchUrlTemplate?: string;
}

export function website(input: WebSiteInput): JsonLd {
  return clean({
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: input.name,
    url: input.url,
    potentialAction: input.searchUrlTemplate
      ? {
          "@type": "SearchAction",
          target: input.searchUrlTemplate,
          "query-input": "required name=query",
        }
      : undefined,
  });
}

/** パンくず。items は表示順に並べる (先頭がトップ) */
export function breadcrumbList(items: { name: string; url: string }[]): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

interface BlogPostingInput {
  headline: string;
  url: string;
  datePublished?: string;
  dateModified?: string;
  image?: string;
  authorName?: string;
  description?: string;
}

export function blogPosting(input: BlogPostingInput): JsonLd {
  return clean({
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: input.headline,
    mainEntityOfPage: input.url,
    datePublished: input.datePublished,
    dateModified: input.dateModified ?? input.datePublished,
    image: input.image,
    description: input.description,
    author: input.authorName ? { "@type": "Person", name: input.authorName } : undefined,
  });
}

interface WebPageInput {
  name: string;
  url: string;
  description?: string;
}

/** 一覧・固定ページ用 */
export function webPage(input: WebPageInput): JsonLd {
  return clean({
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: input.name,
    url: input.url,
    description: input.description,
  });
}
