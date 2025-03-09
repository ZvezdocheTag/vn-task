import { defineConfig } from "vitest/config";
import react from '@vitejs/plugin-react'

// Need to import from vitest/config
/// <reference types="vitest" />

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './setupTests.ts',
  },
})
