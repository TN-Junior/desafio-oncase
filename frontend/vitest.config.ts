import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: path.resolve(__dirname, "src/tests/setup.ts"), // Garante que o caminho é absoluto
  },
});
