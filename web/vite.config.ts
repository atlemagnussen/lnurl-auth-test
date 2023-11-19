import { defineConfig } from "vite"
import path from "path"

const projectRootDir = path.resolve(__dirname)
const appSrcPath = path.resolve(projectRootDir, "src")
const appNodePath = path.resolve(projectRootDir, "node_modules")
const commonSrcPath = path.resolve(projectRootDir, "..", "common")
const commonNodePath = path.resolve(projectRootDir, "..", "node_modules")
const publicPath = path.resolve(projectRootDir, "public")
const buildOutput = path.resolve(projectRootDir, "dist")

export default defineConfig({
    logLevel: "info",
    root: "src",
    publicDir: publicPath,
    envDir: projectRootDir,
    resolve: {
        alias: {
            "@app": appSrcPath,
            "@common": commonSrcPath
        }  
    },
    build: {
        outDir: buildOutput,  
        sourcemap: true,
        emptyOutDir: true,
        rollupOptions: {
            output: {
                entryFileNames: "assets/[name].js",
                chunkFileNames: "assets/[name].js",
                assetFileNames: `assets/[name].[ext]`
            }
        }
    },
    server: {
        fs: {
            allow: [buildOutput, appSrcPath, appNodePath, commonSrcPath, commonNodePath]
        },
        
        port: 8001,
        hmr: true
    }
})
