/**
 * 无界微前端配置文件
 *
 * 无界(wujie)是一个基于Web Components + iframe 的微前端解决方案
 * 主要特点：
 * 1. 框架无关：支持任意框架的子应用接入
 * 2. 样式隔离：基于shadow dom实现样式隔离
 * 3. JS隔离：基于iframe实现JS运行环境隔离
 * 4. 预加载：支持子应用预加载，提升用户体验
 * 5. 保活模式：支持子应用保活，避免重复渲染
 */

import WujieVue from 'wujie-vue3'
import { startApp } from 'wujie'

// 从WujieVue组件中解构需要的方法
const { bus, setupApp, preloadApp } = WujieVue
import { ElMessage } from 'element-plus'

// 无界全局配置对象
const wujieConfig = {
  // 子应用配置映射表
  apps: {
    // React管理后台子应用配置
    'react-admin': {
      // 开发环境地址 - React项目运行在5000端口
      devUrl: 'http://localhost:5500',
      // 生产环境地址 - 静态资源路径，将在nginx中配置
      prodUrl: 'https://xixiemperor.github.io/BadmintonFrontend-B/',
      // 预加载配置 - 提前加载子应用资源，提升首次访问速度
      preload: true,
      // 路由同步 - wujie将子应用路由编码后作为父应用的查询参数
      sync: true,
    }
  }
}

/**
 * 初始化无界微前端框架
 *
 * 这个函数在主应用启动时调用，用于：
 * 1. 设置子应用的基本配置
 * 2. 预加载子应用资源（如果开启了预加载）
 * 3. 建立主子应用的通信通道
 */
export function initWujie() {
  try {
    // 获取React管理后台的配置
    const reactAdminConfig = wujieConfig.apps['react-admin']

    // 根据环境变量决定使用开发还是生产地址
    const appUrl = process.env.NODE_ENV === 'development'
      ? reactAdminConfig.devUrl
      : reactAdminConfig.prodUrl

    // 设置子应用配置
    // setupApp 用于注册子应用的全局配置
    setupApp({
      name: 'react-admin',          // 子应用唯一标识
      url: appUrl,                  // 子应用地址
      alive: reactAdminConfig.alive, // 是否保活
      ...reactAdminConfig           // 展开其他配置
    })

    if (reactAdminConfig.preload) {

      try {
        // preloadApp是同步方法，没有返回值
        preloadApp({
          name: 'react-admin',
          // 添加预加载配置
          exec: false, // 不执行JS，只下载资源
          // 预加载错误处理
          loadError: (url, error) => {
            console.error('❌ [Wujie] 子应用预加载失败:', url, error)
            ElMessage.warning('管理后台预加载失败，可能会影响首次访问速度')
          }
        })

      } catch (error) {
        console.error('❌ [Wujie] 预加载配置失败:', error)
        ElMessage.warning('管理后台预加载配置失败')
      }
    }

  } catch (error) {
    console.error('❌ [Wujie] 无界框架初始化失败:', error)
    ElMessage.error('微前端框架初始化失败')
  }
}

/**
 * 启动React管理后台子应用
 *
 * @param {HTMLElement} container - 子应用的容器DOM元素
 * @param {Object} props - 传递给子应用的数据
 * @returns {Promise} 启动子应用的Promise
 *
 * 这个函数在用户访问管理后台页面时调用
 * 会在指定的DOM容器中渲染React子应用
 */
export function startReactAdmin(container, props = {}) {
  const reactAdminConfig = wujieConfig.apps['react-admin']
  const appUrl = process.env.NODE_ENV === 'development'
    ? reactAdminConfig.devUrl
    : reactAdminConfig.prodUrl

  return startApp({
    name: 'react-admin',    // 子应用名称，必须与setupApp中的name一致
    url: appUrl,           // 子应用地址
    el: container,         // 子应用渲染的容器元素
    props,                 // 传递给子应用的数据，子应用可以通过window.__WUJIE.props访问
    alive: true,           // 启用保活模式
    sync: true,            // 启用路由同步
  })
}

/**
 * 导出无界事件总线
 *
 * bus是无界提供的事件总线，用于主子应用间的通信
 * 主要方法：
 * - bus.$emit(event, data) - 发送事件
 * - bus.$on(event, callback) - 监听事件
 * - bus.$off(event, callback) - 取消监听
 *
 * 使用示例：
 * 主应用发送数据：bus.$emit('user-info-updated', userInfo)
 * 子应用监听数据：bus.$on('user-info-updated', (userInfo) => {...})
 */
export { bus }

/**
 * 导出配置对象，供其他模块使用
 */
export { wujieConfig }
