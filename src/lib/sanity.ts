import { createClient, type SanityClient } from "@sanity/client";
import { createImageUrlBuilder } from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url";

const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID;
const dataset = import.meta.env.PUBLIC_SANITY_DATASET;
const apiVersion = import.meta.env.PUBLIC_SANITY_API_VERSION;

// projectId 未設定 (テンプレート初期状態) ではクライアントを作らない。
// これにより Sanity プロジェクト未接続でもビルドが通る。
export const sanityClient: SanityClient | null =
  projectId && dataset
    ? createClient({
        projectId,
        dataset,
        apiVersion: apiVersion ?? "2025-06-01",
        useCdn: true, // 下書きプレビュー時は false + token にする
      })
    : null;

/** GROQ クエリを実行する。クライアント未設定なら null を返す */
export async function sanityFetch<T>(
  query: string,
  params: Record<string, unknown> = {},
): Promise<T | null> {
  if (!sanityClient) return null;
  return sanityClient.fetch<T>(query, params);
}

const builder = sanityClient ? createImageUrlBuilder(sanityClient) : null;

/** Sanity 画像のレスポンシブ URL を生成する。クライアント未設定なら null */
export function urlForImage(source: SanityImageSource) {
  return builder ? builder.image(source) : null;
}
