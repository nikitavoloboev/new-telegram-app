import { defineConfig } from "@tanstack/start/config"
import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import tsConfigPaths from "vite-tsconfig-paths"

// const local = process.env.LOCAL === "true"
const local = true

export default defineConfig({
  vite: {
    plugins: () => [
      // TODO: issues with nodePolyfills, have to make all components client side only for this
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
      tsConfigPaths({
        projects: ["./tsconfig.json"],
      }),
    ],
  },
  server: {
    devServer: {
      // @ts-ignore
      host: "tma.internal",
      https: local
        ? {
            cert: readFileSync(
              resolve("certificates/tma.internal.pem"),
              "utf8",
            ),
            key: readFileSync(
              resolve("certificates/tma.internal-key.pem"),
              "utf8",
            ),
          }
        : undefined,
    },
  },
})
