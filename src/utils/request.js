import axios from 'axios'
import router from '@/router'
import { useUserStore } from '@/stores'

// 创建axios实例
const instance = axios.create({
  baseURL: 'http://8.162.3.209:8080',
  timeout: 10000,
})

// 是否正在刷新token的标志
let isRefreshing = false

// axios请求拦截器
instance.interceptors.request.use(
  (config) => {
    // 添加token等操作
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    console.error(error)
    return Promise.reject(error)
  },
)

// axios响应拦截器
instance.interceptors.response.use(
  function (response) {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    if (response.data.code === 0) {
      return response
    } else {
      ElMessage.error(response.data.message || response.data.msg || '请求失败')
    }

    return Promise.reject(response.data)
  },
  function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    const { response } = error

    if (response) {
      switch (response.status) {
        case 401:
          // Token过期或无效
          handleTokenExpired()
          break
        case 403:
          ElMessage.error('没有权限访问该资源')
          break
        case 404:
          ElMessage.error('请求的资源不存在')
          break
        case 500:
          ElMessage.error('服务器内部错误')
          break
        default:
          ElMessage.error(response.data?.message || '请求失败')
      }
    } else if (error.code === 'ECONNABORTED') {
      ElMessage.error('请求超时，请检查网络连接')
    } else {
      ElMessage.error('网络错误，请检查网络连接')
    }

    return Promise.reject(error)
  }
)

// 处理token过期的统一方法
const handleTokenExpired = () => {
  if (isRefreshing) {
    return
  }

  isRefreshing = true

  const userStore = useUserStore()

  // 显示提示信息
  if(!userStore.userinfo.token){
    ElMessage.warning('请先登录')
  }else{
    ElMessage.warning('登录已过期，请重新登录')

    // 清除过期的token和用户信息
    const userStore = useUserStore()
    userStore.logout()
  }
  // 跳转到登录页面
  // 保存当前路径，登录成功后可以跳转回来
  const currentPath = router.currentRoute.value.fullPath
  if (currentPath !== '/login') {
    router.push({
      path: '/login',
      query: { redirect: currentPath }
    })
  }

  // 重置刷新状态
  setTimeout(() => {
    isRefreshing = false
  }, 1000)
}

export default instance
