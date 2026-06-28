import { defineField, defineType } from "sanity";

export const post = defineType({
  name: "post",
  title: "記事",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "タイトル",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "スラッグ",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "excerpt", title: "概要", type: "text", rows: 3 }),
    defineField({
      name: "mainImage",
      title: "メイン画像",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "author",
      title: "著者",
      type: "reference",
      to: [{ type: "author" }],
    }),
    defineField({
      name: "categories",
      title: "カテゴリ",
      type: "array",
      of: [{ type: "reference", to: [{ type: "category" }] }],
    }),
    defineField({
      name: "publishedAt",
      title: "公開日",
      type: "datetime",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "updatedAt", title: "更新日", type: "datetime" }),
    defineField({ name: "body", title: "本文", type: "blockContent" }),
  ],
  preview: {
    select: { title: "title", media: "mainImage" },
  },
});
