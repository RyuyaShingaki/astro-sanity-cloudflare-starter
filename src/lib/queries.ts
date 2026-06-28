import { defineQuery } from "groq";

/** 記事一覧 (公開日の降順) */
export const POSTS_QUERY =
  defineQuery(`*[_type == "post" && defined(slug.current)]|order(publishedAt desc){
  _id,
  title,
  "slug": slug.current,
  excerpt,
  publishedAt,
  mainImage
}`);

/** 静的パス生成用のスラッグ一覧 */
export const POST_SLUGS_QUERY = defineQuery(`*[_type == "post" && defined(slug.current)]{
  "slug": slug.current
}`);

/** 記事詳細 */
export const POST_QUERY = defineQuery(`*[_type == "post" && slug.current == $slug][0]{
  _id,
  title,
  "slug": slug.current,
  excerpt,
  publishedAt,
  updatedAt,
  mainImage,
  body,
  author->{ name, image },
  categories[]->{ title, "slug": slug.current }
}`);
