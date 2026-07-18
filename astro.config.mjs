import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";

import cloudflare from "@astrojs/cloudflare";

export default defineConfig({
  site: "https://salami.tech",
  output: "static",

  vite: {
    optimizeDeps: {
      exclude: ["react/jsx-dev-runtime"]
    }
  },

  integrations: [mdx(), react(), sitemap()],

  markdown: {
    shikiConfig: {
      theme: "github-light"
    }
  },

  adapter: cloudflare()
});