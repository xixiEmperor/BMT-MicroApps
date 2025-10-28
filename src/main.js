/**
 * Vue3主应用入口文件
 *
 * 主要功能：
 * 1. 创建Vue应用实例
 * 2. 注册路由、状态管理、UI组件库等插件
 * 3. 初始化无界微前端框架
 * 4. 挂载应用到DOM
 */

import '@/assets/common.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import pinia from './stores'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import directives from './utils/directives'
import { Telemetry } from '@wfynbzlx666/sdk-telemetry'
// import { Perf } from '@wfynbzlx666/sdk-perf'
// import { nextTick } from 'vue'

// 导入无界微前端配置 - 用于集成React管理后台
import { initWujie } from '@/utils/wujie'

// 创建Vue应用实例
const app = createApp(App)

// 注册Vue Router路由插件
app.use(router)

// 注册Pinia状态管理插件
app.use(pinia)

// 注册Element Plus UI组件库
app.use(ElementPlus)

// 注册全局自定义指令
// auth指令用于权限控制，控制元素的显示隐藏
app.directive('auth', directives.auth)

/**
 * 初始化无界微前端框架
 *
 * 这个步骤会：
 * 1. 注册React管理后台子应用
 * 2. 配置子应用的基本参数（地址、保活模式等）
 * 3. 如果开启预加载，会提前加载子应用资源
 *
 * 注意：必须在Vue应用挂载前初始化，确保路由守卫能正确处理子应用路由
 */
initWujie()

Telemetry.init({
  app: 'BMT-MicroApps',
  release: import.meta.env.VITE_APP_VERSION ?? 'dev',
  batchSize: 20,
  sampleRate: 1,
  debug: true,
})


// try {
//   Perf.init({
//     enableMPA:false,
//     sampleRate: 1,
//     autoEnableWebVitals: true,
//     enableDetailedMonitoring: false,
//     enableAdvancedMetrics: false,
//     onMetric: (metric) => {
//       console.log(metric)
//     }
//   })
// } catch (error) {
//   console.error('性能分析初始化失败:', error)
// }


// window.addEventListener('unload', () => {
//   Perf.stop()
// })

// 挂载Vue应用到#app元素
// 这是应用启动的最后一步
app.mount('#app')
