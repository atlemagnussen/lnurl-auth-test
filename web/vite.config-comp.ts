import { defineConfig } from "vite"

export default defineConfig({
    build: {
        lib: {
            entry: "src/app.ts",
            formats: ['es'],
        },
        sourcemap: true,
        emptyOutDir: true
    },
})
