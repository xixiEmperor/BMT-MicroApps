import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { visualizer } from 'rollup-plugin-visualizer'
import path from 'path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  return {
    // GitHub Pages 部署配置
    base: process.env.NODE_ENV === 'production' ? '/BMT-MicroApps/' : '/',
    // 定义全局变量，解决SDK包中process未定义的问题
    define: {
      'process.platform': '""',
      'process.version': '""',
      global: 'globalThis',
    },
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
      visualizer({
        filename: 'dist/stats.html',
        open: import.meta.env.DEV ? true : false,
        gzipSize: true,
        brotliSize: true
      })
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        // '@wfynbzlx666/sdk-realtime': path.resolve(__dirname, '../../react workspace/BMT-Central-SDK/packages/sdk-realtime/src/index'),
        // '@wfynbzlx666/sdk-http': path.resolve(__dirname, '../../react workspace/BMT-Central-SDK/packages/sdk-http/src/index'),
        // '@wfynbzlx666/sdk-perf':path.resolve(__dirname, '../../react workspace/BMT-Central-SDK/packages/sdk-perf/src/index'),
        // '@wfynbzlx666/sdk-core': path.resolve(__dirname, '../../react workspace/BMT-Central-SDK/packages/sdk-core/src/index'),
        // '@wfynbzlx666/sdk-telemetry': path.resolve(__dirname, '../../react workspace/BMT-Central-SDK/packages/sdk-telemetry/src/index'),
        '@wfynbzlx666/sdk-perf-spa': path.resolve(__dirname, '../../react workspace/BMT-Central-SDK/packages/sdk-perf-spa/src/index'),
      },
    },
    // 依赖优化配置
    optimizeDeps: {
      exclude: [
        'puppeteer',
        '@puppeteer/browsers',
        'proxy-agent',
        'socks-proxy-agent',
        'https-proxy-agent',
        'http-proxy-agent',
        'pac-proxy-agent',
      ],
      // 排除脚本目录
      entries: ['src/**/*.{vue,js,ts}', '!src/scripts/**'],
    },
    // 生产构建优化
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      emptyOutDir: true,
      cssCodeSplit: true,
      sourcemap: false,
      reportCompressedSize: true,
      /**
       * 代码压缩器
       * @default 'esbuild'
       * 'terser': 更小的输出，但构建较慢
       * 'esbuild': 更快的构建，输出稍大
       * false: 不压缩
       */
      minify: 'terser',

      /**
       * Terser 压缩选项
       * 仅在 minify: 'terser' 时生效
       */
      terserOptions: {
        compress: {
          // 移除 console 语句
          drop_console: true,
          // 移除 debugger 语句
          drop_debugger: true,
          // 移除未使用的函数
          unused: true,
          // 移除死代码
          dead_code: true,
          // 移除无效的代码
          side_effects: true
        },
        mangle: {
          // 混淆变量名
          properties: {
            // 混淆属性名（谨慎使用）
            regex: /^_/
          }
        },
        format: {
          // 移除注释
          comments: false
        }
      },
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
