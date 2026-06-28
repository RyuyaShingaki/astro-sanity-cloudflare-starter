import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schemaTypes";

export default defineConfig({
  name: "default",
  title: "Tirestation",
  // SANITY_STUDIO_ プレフィックスの環境変数で渡す (.env 等)
  projectId: process.env.SANITY_STUDIO_PROJECT_ID ?? "your-project-id",
  dataset: process.env.SANITY_STUDIO_DATASET ?? "production",
  plugins: [structureTool(), visionTool()],
  schema: { types: schemaTypes },
});
