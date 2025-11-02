import { useUserStore } from "@/stores/modules/user"
import { http, initHttp, authPlugin } from "@wfynbzlx666/sdk-http"
import { useRouter } from "vue-router"

const router = useRouter()

let isRefreshing = false

initHttp({
  baseURL:'http://8.162.3.209:8080',//import.meta.env.VITE_API_URL,
  timeout: 10000,
  plugins: [
    authPlugin({
      getToken: () => localStorage.getItem('token'),
      onTokenExpired: () => {
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
    })
  ]
})

export default http
