import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@components": path.resolve(__dirname, "src/components"),
      "@sections": path.resolve(__dirname, "src/sections"),
      "@pages": path.resolve(__dirname, "src/pages"),
      "@actions": path.resolve(__dirname, "src/actions"),
      "@services": path.resolve(__dirname, "src/services"),
      "@utils": path.resolve(__dirname, "src/utils"),
      "@routers": path.resolve(__dirname, "src/routers"),
      "@subsections": path.resolve(__dirname, "src/subsections"),
    },
  },
});
