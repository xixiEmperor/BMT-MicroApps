/**
 * Vue Router 路由配置
 *
 * 本路由配置支持微前端架构：
 * 1. C端用户路由：首页、商城、论坛、用户中心等（Vue3实现）
 * 2. B端管理后台路由：通过无界微前端框架集成React应用
 *
 * 微前端实现说明：
 * - /admin/* 路由被统一代理到AdminContainer组件
 * - AdminContainer使用无界框架加载React子应用
 * - React子应用内部路由由React Router管理
 * - 主子应用间通过无界事件总线通信
 */

import { createRouter, createWebHashHistory } from 'vue-router'
import { useUserStore } from '@/stores'
// 暂时注释掉性能监控，因为它依赖puppeteer等Node.js包
// import { Perf } from '@wfynbzlx666/sdk-perf'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      // 页面懒加载
      component: () => import('@/views/layout/LayOut.vue'),
      // 重定向
      redirect: '/home',
      meta: { title: '武汉理工大学南湖校区羽毛球场预定前台' },
      // 二级路由
      children: [
        {
          path: '/home',
          component: () => import('@/views/home/HomeView.vue'),
          meta: { title: '武汉理工大学南湖校区羽毛球场预定前台' },
        },
        {
          path: '/booking',
          component: () => import('@/views/booking/BookingView.vue'),
          meta: { title: '武汉理工大学南湖校区羽毛球场预定前台' },
        },
        {
          path: '/shop',
          component: () => import('@/views/shop/ShopView.vue'),
          meta: { title: '武汉理工大学南湖校区羽毛球场预定前台' },
        },
        {
          path: '/product/:id',
          component: () => import('@/views/shop/ProductDetail.vue'),
          meta: { title: '商品详情 - 武汉理工大学南湖校区羽毛球场预定前台' },
        },
        {
          path: '/cart',
          component: () => import('@/views/shop/CartView.vue'),
          meta: { requiresAuth: true, title: '购物车 - 武汉理工大学南湖校区羽毛球场预定前台' },
        },
        {
          path: '/checkout',
          component: () => import('@/views/shop/CheckoutView.vue'),
          meta: { requiresAuth: true, title: '结算 - 武汉理工大学南湖校区羽毛球场预定前台' },
        },
        {
          path: '/payment',
          component: () => import('@/views/pay/PaymentView.vue'),
          meta: { requiresAuth: true, title: '支付 - 武汉理工大学南湖校区羽毛球场预定前台' },
        },
        {
          path: '/payment-result',
          component: () => import('@/views/shop/PaymentResultView.vue'),
          meta: { requiresAuth: true, title: '支付结果 - 武汉理工大学南湖校区羽毛球场预定前台' },
        },
        {
          path: '/orders',
          component: () => import('@/views/shop/OrderListView.vue'),
          meta: { requiresAuth: true, title: '我的订单 - 武汉理工大学南湖校区羽毛球场预定前台' },
        },
        {
          path: '/order-detail/:orderNo',
          component: () => import('@/views/shop/OrderDetailView.vue'),
          meta: { requiresAuth: true, title: '订单详情 - 武汉理工大学南湖校区羽毛球场预定前台' },
        },
        {
          path: '/forum',
          component: () => import('@/views/forum/ForumView.vue'),
          meta: { title: '武汉理工大学南湖校区羽毛球场预定前台' },
        },
        {
          path: '/user-center',
          component: () => import('@/views/userCenter/UserCenter.vue'),
          meta: { requiresAuth: true, title: '武汉理工大学南湖校区羽毛球场预定前台' },
        },
        {
          path: '/booking-history',
          component: () => import('@/views/booking/BookingHistory.vue'),
          meta: { requiresAuth: true, title: '预订记录 - 武汉理工大学南湖校区羽毛球场预定前台' },
        },
        {
          path: '/publish-post',
          component: () => import('@/views/forum/PublishPost.vue'),
          meta: { title: '武汉理工大学南湖校区羽毛球场预定前台' },
        },
        {
          path: '/post/:id',
          component: () => import('@/views/forum/PostDetail.vue'),
          meta: { title: '武汉理工大学南湖校区羽毛球场预定前台' },
        },
        {
          path: '/my-history-post',
          component: () => import('@/views/forum/MyHistoryPost.vue'),
          meta: { requiresAuth: true, title: '我的发帖 - 武汉理工大学南湖校区羽毛球场预定前台' },
        }
      ],
    },
    /**
     * 微前端管理后台路由配置
     *
     * 这个路由配置用于集成React管理后台子应用
     * 主要特点：
     * 1. 使用 pathMatch(.*) 捕获所有 /admin/* 路径
     * 2. 由无界容器组件(AdminContainer)负责渲染React子应用
     * 3. 子应用内部的路由由React Router管理
     * 4. 保持与原有权限验证逻辑的兼容性
     */
    {
      // 使用动态路由匹配所有admin开头的路径
      // pathMatch(.*) 表示匹配任意字符，* 表示可选
      // 这样 /admin、/admin/dashboard、/admin/users 等路径都会被捕获
      path: '/admin/:pathMatch(.*)*',

      // 使用无界容器组件，负责加载和渲染React子应用
      component: () => import('@/views/admin/AdminContainer.vue'),

      meta: {
        // 需要管理员权限验证
        requiresAdmin: true,

        // 页面标题
        title: '管理后台',

        // 关闭Keep-Alive缓存，确保每次访问都是最新状态
        // 这对微前端应用很重要，避免状态混乱
        keepAlive: false,

        // 微前端标识，用于区分这是一个微前端路由
        isMicroFrontend: true
      },
    },
    {
      path: '/login',
      component: () => import('@/views/login/Login.vue'),
      meta: { title: '登录/注册' },
    },
  ],
})

// 全局前置守卫，检查用户是否已登录
router.beforeEach((to, from, next) => {
  // 设置页面标题
  if (to.meta.title) {
    document.title = to.meta.title
  }

  // if(Perf.isInitialized()) {
  //   Perf.stop()
  // }

  // 判断路由是否需要登录
  const userStore = useUserStore()

  if (to.meta.requiresAuth) {
    // 检查是否有token且未过期
    if (userStore.token && !userStore.isTokenExpired()) {
      // 已登录且token有效，允许访问
      next()
    } else {
      // 未登录或token已过期，清除过期数据并跳转到登录页
      if (userStore.token && userStore.isTokenExpired()) {
        userStore.logout()
        ElMessage.warning('登录已过期，请重新登录')
      }
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    }
  } else if (to.meta.requiresAdmin) {
    // 检查是否有token且未过期
    if (userStore.token && !userStore.isTokenExpired()) {
      // 判断是否为管理员
      if (userStore.userinfo?.role === 'ROLE_ADMIN') {
        next()
      } else {
        // 非管理员，跳转到首页
        ElMessage.error('您没有访问管理后台的权限')
        next('/')
      }
    } else {
      // 未登录或token已过期
      if (userStore.token && userStore.isTokenExpired()) {
        userStore.logout()
        ElMessage.warning('登录已过期，请重新登录')
      }
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    }
  } else {
    // 不需要登录，直接放行
    // 但如果有token且已过期，也要清除
    if (userStore.token && userStore.isTokenExpired() && to.meta.requiresAuth) {
      userStore.logout()
    }
    next()
  }
})

// 全局后置钩子 - 页面性能监控
router.afterEach((to, from) => {
  // 记录路由变化
  console.log(`路由从 ${from.path} 跳转到 ${to.path}`)
  // 暂时注释掉性能监控
  // Perf.reportRouteChange()
})

export default router
