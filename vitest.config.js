import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./tests/setup.js"],
    css: true,
    include: ["tests/**/*.{test,spec}.{js,jsx,ts,tsx}"],
    exclude: ["tests/e2e/**/*", "node_modules/**/*"],
    coverage: {
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/",
        "tests/e2e/",
        "**/*.config.js",
        "**/*.config.ts",
      ],
    },
  },
  resolve: {
    alias: {
      "@": "/src",
    },
  },
});
