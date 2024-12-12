import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";
import { checker } from "vite-plugin-checker";
import { nodeResolve } from "@rollup/plugin-node-resolve";

export default defineConfig({
  build: {
    lib: {
      entry: "src/index.ts",
      formats: ["es"],
      fileName: "OpenAi",
    },
    outDir: "../wwwroot/App_Plugins/Translations.OpenAi/modern",
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      external: [/^@umbraco/, /^@jumoo\/translate/],
      onwarn: () => {},
    },
  },
  base: "/uSyncExporter/",
  mode: "production",
  plugins: [
    nodeResolve(),
    checker({
      typescript: true,
    }),
    viteStaticCopy({
      targets: [
        {
          src: "src/icons/svg/*.js",
          dest: "icons",
        },
      ],
    }),
  ],
});
