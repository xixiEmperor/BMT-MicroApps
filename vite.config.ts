import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import path from 'path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  return {
    // GitHub Pages 部署配置
    base: process.env.NODE_ENV === 'production' ? '/BMT-MicroApps/' : '/',
    plugins: [
      vue(),
      // 只在开发环境中启用 vue-devtools
      ...(mode === 'development' ? [vueDevTools()] : []),
      AutoImport({
        imports: ['vue', 'vue-router', 'pinia'],
        resolvers: [ElementPlusResolver()],
        dts: 'src/auto-imports.d.ts',
        eslintrc: {
          enabled: true,
          filepath: './.eslintrc-auto-import.json',
          globalsPropValue: true,
        },
      }),
      Components({
        resolvers: [ElementPlusResolver()],
        dts: 'src/components.d.ts',
        dirs: ['src/components'],
        include: [/\.vue$/, /\.vue\?vue/],
      }),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        // '@wfynbzlx666/sdk-realtime': path.resolve(__dirname, '../../react workspace/BMT-Central-SDK/packages/sdk-realtime/src/index'),
        // '@wfynbzlx666/sdk-http': path.resolve(__dirname, '../../react workspace/BMT-Central-SDK/packages/sdk-http/src/index'),
        // '@wfynbzlx666/sdk-perf': path.resolve(__dirname, '../../react workspace/BMT-Central-SDK/packages/sdk-perf/src/index'),
        // '@wfynbzlx666/sdk-core': path.resolve(__dirname, '../../react workspace/BMT-Central-SDK/packages/sdk-core/src/index'),
        // '@wfynbzlx666/sdk-telemetry': path.resolve(__dirname, '../../react workspace/BMT-Central-SDK/packages/sdk-telemetry/src/index'),
      },
    },
    // 生产构建优化
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      emptyOutDir: true,
      cssCodeSplit: true,
      sourcemap: false,
      minify: 'esbuild',
      esbuildOptions: {
        drop: ['console', 'debugger'],
        legalComments: 'none',
      },
      reportCompressedSize: true,
    },
    server: {
      proxy: {
        '/v1': {
          target: 'http://127.0.0.1',
          changeOrigin: true,
          secure: false
        },
        '/api': {
          target: 'http://localhost:8080',
          changeOrigin: true,
          secure: false
        },
      }
    }
  }
})
