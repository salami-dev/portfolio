import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

const srcPath = fileURLToPath(new URL("./src", import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      "@components": `${srcPath}/components`,
      "@content": `${srcPath}/content`,
      "@layouts": `${srcPath}/layouts`,
      "@lib": `${srcPath}/lib`,
      "@styles": `${srcPath}/styles`
    }
  },
  test: {
    environment: "jsdom",
    globals: true,
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    setupFiles: ["src/test/setup.ts"]
  }
});
