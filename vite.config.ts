// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only using cloudflare as a default target),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  vite: {
    // Split vendor chunks for better caching and smaller initial bundle
    build: {
      rollupOptions: {
        output: {
          // manualChunks as a function for Rolldown compatibility
          manualChunks: (id) => {
            // Split heavy libraries into separate chunks
            if (id.includes("node_modules/react") || id.includes("node_modules/react-dom") || id.includes("node_modules/react-router-dom")) {
              return "react";
            }
            if (id.includes("node_modules/@tanstack")) {
              return "tanstack";
            }
            if (id.includes("node_modules/@supabase")) {
              return "supabase";
            }
            if (id.includes("node_modules/recharts")) {
              return "charts";
            }
            if (id.includes("node_modules/framer-motion")) {
              return "motion";
            }
            if (id.includes("node_modules/lucide-react")) {
              return "lucide";
            }
            if (id.includes("node_modules/@radix-ui")) {
              return "radix";
            }
            if (id.includes("node_modules/react-hook-form") || id.includes("node_modules/zustand") || 
                id.includes("node_modules/react-resizable-panels") || id.includes("node_modules/embla-carousel-react")) {
              return "admin";
            }
            return undefined;
          },
        },
      },
      // Target smaller initial bundle
      chunkSizeWarningLimit: 200, // Warn if chunks exceed 200KB
    },
    // Enable minification and tree-shaking
    esbuild: {
      minify: true,
      treeShaking: true,
    },
  },
});
