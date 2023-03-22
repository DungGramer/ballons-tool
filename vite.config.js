import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: 'auto',
      devOptions: {
        enabled: true,
      },
      // includeAssets: ["favicon.svg", "favicon.ico"],
      manifest: {
        name: "Ballon Tool",
        short_name: "Ballon Tool",
        theme_color: "#ffffff",
      },
      workbox: {
        cleanupOutdatedCaches: true,
        sourcemap: true,
        globPatterns: ["**/*.{js,css,html,svg}"],
      }
    }),
  ],
});
