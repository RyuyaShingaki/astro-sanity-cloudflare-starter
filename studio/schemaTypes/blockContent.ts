import { defineArrayMember, defineType } from "sanity";

export const blockContent = defineType({
  name: "blockContent",
  title: "本文",
  type: "array",
  of: [
    defineArrayMember({ type: "block" }),
    defineArrayMember({ type: "image", options: { hotspot: true } }),
  ],
});
