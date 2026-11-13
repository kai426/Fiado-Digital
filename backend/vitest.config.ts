import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    environment: "node",
    globals: true,
    exclude: ["dist/**", "node_modules/**"],
    env: {
      NODE_ENV: "test",
      DATABASE_URL:
        "postgresql://fiado:fiado@localhost:5432/fiado_digital_test?schema=public",
      JWT_SECRET: "test-secret-with-at-least-32-characters",
      JWT_EXPIRES_IN: "1d",
      CORS_ORIGIN: "http://localhost:8443",
      LOG_LEVEL: "silent",
    },
  },
})
