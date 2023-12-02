import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { splitVendorChunkPlugin } from "vite";

import { resolve } from "path";
import { fileURLToPath } from "node:url";

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        popup: resolve(__dirname, "/src/popup/popup.html"),
        options: resolve(__dirname, "./src/options/options.html"),
      },
      output: {
        // 分包
        // manualChunks: (id:string) => {
        //     if(id.includes("node_modules")){
        //         return 'vue'
        //     }
        // }
      },
    },
    emptyOutDir: false,
  },
  plugins: [vue(), splitVendorChunkPlugin()],
});
