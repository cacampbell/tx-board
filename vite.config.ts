/// <reference types="vitest" />

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import components from "unplugin-vue-components/vite";
import icons from "unplugin-icons/vite";
import iconsResolver from "unplugin-icons/resolver";
import svgLoader from "vite-svg-loader";
import { splitVendorChunkPlugin } from "vite";
import vueI18n from "@intlify/vite-plugin-vue-i18n";

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "vue-router": "vue-router/dist/vue-router.esm-browser.js",
      vue: "vue/dist/vue.runtime.esm-browser.js",
      "vue-i18n": "vue-i18n/dist/vue-i18n.runtime.esm-bundler.js",
    },
  },
  plugins: [
    vue({
      reactivityTransform: true,
    }),
    svgLoader({
      defaultImport: "url",
    }),
    components({
      deep: true,
      extensions: ["vue", "svg"],
      importPathTransform: (path) => {
        if (path.endsWith(".svg")) {
          return path + "?component";
        }

        return path;
      },
      directoryAsNamespace: false,
      resolvers: [iconsResolver()],
    }),
    icons({
      compiler: "vue3",
    }),
    vueI18n({
      include: "./locales/*.json",
    }),
    splitVendorChunkPlugin(),
  ],
  test: {
    environment: "jsdom",
  },
});
