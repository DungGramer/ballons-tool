import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import svgr from "vite-plugin-svgr";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr({
      svgrOptions: {},
    }),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: "auto",
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
      },
    }),
  ],
  resolve: {
    alias: {
      "@": "/src",
      "@assets": "/src/assets",
      '/': '/public',
      '@utils': '/src/utils',
      '@components': '/src/components',
      '@services': '/src/services',
      '@UI': '/src/UI',
      /* '@hooks': '/src/hooks',
      '@context': '/src/context',
      '@pages': '/src/pages',
      '@styles': '/src/styles',
      '@constants': '/src/constants',
      '@config': '/src/config',
      '@routes': '/src/routes',
      '@store': '/src/store',
      '@types': '/src/types',
      '@views': '/src/views', */
    }
  }
});
