import { defineConfig } from "@tanstack/start/config"
import basicSsl from "@vitejs/plugin-basic-ssl"
import react from "@vitejs/plugin-react"
import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { nodePolyfills } from "vite-plugin-node-polyfills"
import tsConfigPaths from "vite-tsconfig-paths"

const local = process.env.LOCAL === "true"

// TODO: issues with nodePolyfills, have to make all components client side only for this
export default defineConfig({
  vite: {
    plugins: () => [
      // nodePolyfills({
      //   include: ["path", "stream", "util"],
      //   exclude: ["http"],
      //   globals: {
      //     Buffer: true,
      //     global: true,
      //     process: true,
      //   },
      //   overrides: {
      //     fs: "memfs",
      //   },
      //   protocolImports: true,
      // }),
      react(),
      tsConfigPaths({
        projects: ["./tsconfig.json"],
      }),
      ...(local !== true
        ? [
            basicSsl({
              certDir: resolve("certificates"),
              domains: ["tma.internal"],
            }),
          ]
        : []),
    ],
  },
  // TODO: something weird happening with this
  // server: {
  //   host: "tma.internal",
  //   https:
  //     local === true
  //       ? {
  //           cert: readFileSync(
  //             resolve("certificates/tma.internal.pem"),
  //             "utf8",
  //           ),
  //           key: readFileSync(
  //             resolve("certificates/tma.internal-key.pem"),
  //             "utf8",
  //           ),
  //         }
  //       : undefined,
  // },
})
