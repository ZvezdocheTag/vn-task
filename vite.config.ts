import { defineConfig } from "vitest/config";
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/vn-task/',
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './setupTests.ts',
  },
})
