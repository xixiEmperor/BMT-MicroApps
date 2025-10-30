import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'antd/dist/reset.css'
import App from './App.tsx'
import './index.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// 声明全局类型
declare global {
  interface Window {
    // 是否存在无界
    __POWERED_BY_WUJIE__?: boolean;
    // 子应用公共加载路径
    __WUJIE_PUBLIC_PATH__: string;
    // 子应用沙盒实例
    __WUJIE: any;
    // 子应用mount函数
    __WUJIE_MOUNT: () => void;
    // 子应用unmount函数
    __WUJIE_UNMOUNT: () => void | Promise<void>;
    // 注入对象
    $wujie: {
      bus: any;
      shadowRoot?: ShadowRoot;
      props?: { [key: string]: any };
      location?: object;
    };
  }
}

console.log(window.$wujie.props)

let root: any = null
const queryClient = new QueryClient()

// 渲染函数
function render(props: any = {}) {
  const container = document.querySelector('#root')
  if (container) {
    root = createRoot(container)
    root.render(
      <StrictMode>
        <QueryClientProvider client={queryClient}>
          <App {...props} />
        </QueryClientProvider>
      </StrictMode>
    )
  }
}

// 卸载函数
function unmount() {
  if (root) {
    root.unmount()
    root = null
  }
}

// 判断是否在无界环境中
if (window.__POWERED_BY_WUJIE__) {
  // 在无界环境中
  window.__WUJIE_MOUNT = () => {
    const props = window.__WUJIE?.props || {}
    render(props)
  }

  window.__WUJIE_UNMOUNT = () => {
    unmount()
  }
} else {
  // 独立运行
  render()
}
