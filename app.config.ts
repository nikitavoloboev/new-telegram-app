import { defineConfig } from "@tanstack/start/config"
import tsConfigPaths from "vite-tsconfig-paths"
import { resolve } from "node:path"
import basicSsl from "@vitejs/plugin-basic-ssl"
import { readFileSync } from "node:fs"
import react from "@vitejs/plugin-react"
import { nodePolyfills } from "vite-plugin-node-polyfills"

const local = process.env.LOCAL === "true"

export default defineConfig({
  vite: {
    plugins: () => [
      nodePolyfills({
        include: ["path", "stream", "util"],
        exclude: ["http"],
        globals: {
          Buffer: true,
          global: true,
          process: true,
        },
        overrides: {
          fs: "memfs",
        },
        protocolImports: true,
      }),
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
  server: {
    host: "tma.internal",
    https:
      local === true
        ? {
            cert: readFileSync(resolve("certificates/tma.internal.pem")),
            key: readFileSync(resolve("certificates/tma.internal-key.pem")),
          }
        : undefined,
  },
  publicDir: "./public",
})
