import { defineField, defineType } from "sanity";

export const author = defineType({
  name: "author",
  title: "著者",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "名前",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "image",
      title: "画像",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({ name: "bio", title: "プロフィール", type: "text", rows: 3 }),
  ],
});
