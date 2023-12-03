import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import { splitVendorChunkPlugin } from "vite";

import { resolve } from "path";
import { fileURLToPath } from "node:url";

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    build: {
      rollupOptions: {
        input: {
          main: resolve(__dirname, "index.html"),
          popup: resolve(__dirname, env.POPUP),
          options: resolve(__dirname, env.OPTIONS),
          content_script: resolve(__dirname, env.CONTENT_SCRIPT),
          service_worker: resolve(__dirname, env.SERVICE_WORKER),
        },
        output: {
          entryFileNames: (chunkInfo) => {
            // console.log(chunkInfo);
            return "[name].js";
          },
          // 分包
          // manualChunks: (id:string) => {
          //     if(id.includes("node_modules")){
          //         return 'vue'
          //     }
          // }
        },
      },
      // emptyOutDir: false,
    },
    plugins: [vue(), splitVendorChunkPlugin()],
    publicDir: "src/public",
  };
});
