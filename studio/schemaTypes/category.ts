import { defineField, defineType } from "sanity";

export const category = defineType({
  name: "category",
  title: "カテゴリ",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "名称",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "スラッグ",
      type: "slug",
      options: { source: "title", maxLength: 96 },
    }),
  ],
});
