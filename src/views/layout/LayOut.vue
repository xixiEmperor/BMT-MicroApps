<script setup>
import { ref, onMounted, computed, onBeforeUnmount } from 'vue'
import { User, ShoppingCart, Calendar } from '@element-plus/icons-vue'
import { useUserStore, useCartStore } from '@/stores'
import { useRouter } from 'vue-router'
import logoImg from '@/assets/whlg_logo.png'
import { useTokenCheck } from '@/hooks/useTokenCheck'

// 路由
const userStore = useUserStore()
const cartStore = useCartStore()
const router = useRouter()

// Token过期检查
const { startTokenCheck, stopTokenCheck } = useTokenCheck({
  warningTime: 30 * 60 * 1000, // 30分钟前警告
  checkInterval: 5 * 60 * 1000, // 每5分钟检查一次
})

// 获取购物车商品数量
const cartItemCount = computed(() => {
  return cartStore.totalCount
})

// 用户相关
const isLogin = ref(false)
const userInfo = ref({})
userInfo.value = userStore.userinfo

// 监听用户头像更新事件
const handleUserAvatarUpdated = (event) => {
  // 从事件中获取新头像URL
  const { avatarUrl } = event.detail

  // 更新本地显示的用户信息
  if (userInfo.value) {
    userInfo.value = {
      ...userInfo.value,
      avatar: avatarUrl
    }
  }
}

// 检查登录状态
const checkLogin = () => {
  // TODO: 调用API验证用户登录状态
  if (userStore.token && !userStore.isTokenExpired()) {
    try {
      isLogin.value = true
      // 启动token检查
      startTokenCheck()
    } catch (e) {
      console.error('解析用户信息失败', e)
      isLogin.value = false
    }
  } else {
    isLogin.value = false
    // 停止token检查
    stopTokenCheck()
  }
}

// 跳转到个人中心
const goToUserCenter = () => {
  router.push('/user-center')
}

// 跳转到我的发帖
const goToMyPost = () => {
  router.push('/my-history-post')
}

// 跳转到登录页面
const goToLogin = () => {
  router.push('/login')
}

// 跳转到购物车页面
const goToCart = () => {
  router.push('/cart')
}

// 跳转到预订记录页面
const goToBookingHistory = () => {
  router.push('/booking-history')
}

// 跳转到我的订单页面
const goToOrders = () => {
  router.push('/orders')
}

// 退出登录
const logout = () => {
  ElMessageBox.confirm('确定要退出登录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    // 使用store的logout方法统一处理登出逻辑
    userStore.logout()
    isLogin.value = false
    userInfo.value = {
      username: '',
      avatar: '',
    }
    // 如果当前在个人中心页面，退出登录后跳转到首页
    if (router.currentRoute.value.path === '/user-center') {
      router.push('/')
    }
  })
}

// 组件挂载时检查登录状态并添加事件监听
onMounted(() => {
  checkLogin()

  // 添加头像更新事件监听
  window.addEventListener('user-avatar-updated', handleUserAvatarUpdated)
})

// 组件卸载前移除事件监听
onBeforeUnmount(() => {
  window.removeEventListener('user-avatar-updated', handleUserAvatarUpdated)
})
</script>

<template>
  <el-container class="layout-container">
    <el-header class="header">
      <div class="header__content">
        <div class="container">
          <div class="header__logo">
            <el-image :src="logoImg" alt="" fit="contain" style="width: 300px; height: 100px" />
            <p style="font-size: 22px">南湖校区羽毛球场地预定</p>
          </div>

          <!-- 用户信息区域 -->
          <div class="user-area">
            <!-- 购物车入口 -->
            <el-button v-if="isLogin" type="text" class="cart-btn" @click="goToCart">
              <el-badge :value="cartItemCount" :hidden="cartItemCount === 0">
                <el-icon><ShoppingCart /></el-icon>
              </el-badge>
              <span>购物车</span>
            </el-button>

            <!-- 商品订单入口 -->
            <el-button
              v-if="isLogin"
              type="text"
              class="booking-history-btn"
              @click="goToOrders"
            >
              <el-icon><Calendar /></el-icon>
              <span>商品订单</span>
            </el-button>

            <!-- 场地预订入口 -->
            <el-button v-if="isLogin" type="text" class="booking-history-btn" @click="goToBookingHistory">
              <el-icon><Calendar /></el-icon>
              <span>场地预订</span>
            </el-button>

            <!-- 个人中心入口 -->
            <el-button v-if="isLogin" type="text" class="user-center-btn" @click="goToMyPost">
              <el-icon><User /></el-icon>
              <span>我的发帖</span>
            </el-button>

            <!-- 登录后显示用户信息 -->
            <div v-if="isLogin" class="user-info">
              <el-dropdown trigger="click">
                <div class="user-info-wrapper">
                  <div class="user-avatar">
                    <img v-if="userInfo.avatar" :src="userInfo.avatar" alt="头像" />
                    <img
                      v-else
                      src="https://tse1-mm.cn.bing.net/th/id/OIP-C.gaAkkFf8LStn-oc4l8iM0wAAAA?w=160&h=180&c=7&r=0&o=5&dpr=1.5&pid=1.7"
                      alt="默认头像"
                    />
                  </div>
                  <span class="username">{{ userInfo.username }}</span>
                </div>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="goToUserCenter">个人中心</el-dropdown-item>
                    <el-dropdown-item @click="goToMyPost">我的发帖</el-dropdown-item>
                    <el-dropdown-item @click="goToBookingHistory">场地预订</el-dropdown-item>
                    <el-dropdown-item @click="goToOrders">商品订单</el-dropdown-item>
                    <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>

            <!-- 未登录显示登录/注册按钮 -->
            <el-button v-else type="primary" size="large" class="login" @click="goToLogin">
              登录 / 注册
            </el-button>
          </div>
        </div>
        <div class="nav">
          <div class="container">
            <el-menu
              :default-active="$route.path"
              class="el-menu-demo"
              mode="horizontal"
              background-color="rgb(41, 108, 182)"
              text-color="#fff"
              active-text-color="#ffd04b"
            >
              <el-menu-item index="/home">
                <router-link to="/home">首页</router-link>
              </el-menu-item>
              <el-menu-item index="/booking">
                <router-link to="/booking">场地预定</router-link>
              </el-menu-item>
              <el-menu-item index="/shop">
                <router-link to="/shop">羽体商城</router-link>
              </el-menu-item>
              <el-menu-item index="/forum">
                <router-link to="/forum">羽你同行论坛</router-link>
              </el-menu-item>
            </el-menu>
          </div>
        </div>
      </div>
    </el-header>

    <el-main class="main-content">
      <router-view></router-view>
    </el-main>

    <el-footer class="footer-container">
      <!-- 页脚 -->
      <div class="footer">
        <div class="container">
          <p>版权所有 © 2025 南湖校区羽毛球场预定系统</p>
          <p>联系电话: 12345678901 | 地址: 南湖校区体育中心一楼</p>
        </div>
      </div>
    </el-footer>
  </el-container>
</template>

<style lang="less" scoped>
/* 布局容器样式 */
.layout-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding: 20px;

  // 移动端适配
  @media (max-width: 768px) {
    padding: 15px;
  }

  // 超小屏幕适配
  @media (max-width: 480px) {
    padding: 10px;
  }
}

.footer-container {
  margin-top: auto;
  height: auto;
  padding: 0;

  /* 确保页脚内容正确显示 */
  .footer {
    background-color: #2c3e50;
    color: white;
    padding: 20px 0;
    text-align: center;
    width: 100%;

    // 移动端适配
    @media (max-width: 768px) {
      padding: 15px 0;

      .container {
        padding: 0 15px;

        p {
          font-size: 14px;
          margin: 5px 0;
        }
      }
    }

    // 超小屏幕适配
    @media (max-width: 480px) {
      padding: 10px 0;

      .container {
        padding: 0 10px;

        p {
          font-size: 12px;
          margin: 3px 0;
        }
      }
    }
  }
}

.header {
  width: 100%;
  height: auto;
  background-color: rgb(50, 114, 185);
  box-sizing: border-box;
  overflow: hidden;

  // 移动端适配

  @media (max-width: 768px) {
    height: 170px; // 增加移动端header高度以容纳换行的用户信息
  }

  .header__content {
    display: flex;
    flex-direction: column;

    // 中等屏幕适配
    @media (max-width: 1200px) {
      .container {
        width: 100%;
        padding: 0 20px;
      }
      .header__logo {
        .el-image {
          width: 200px !important;
          height: 60px !important;
        }
        p {
          font-size: 18px;
          margin-left: 15px;
        }
      }
      .user-area {
        .cart-btn,
        .booking-history-btn,
        .user-center-btn {
          font-size: 14px;
          margin-right: 15px;
          span {
            display: none; // 隐藏文字，只显示图标
          }
        }
        .username {
          font-size: 14px;
        }
        .login {
          font-size: 14px;
          padding: 8px 16px;
        }
      }
    }

    // 移动端适配
    @media (max-width: 768px) {
      .container {
        flex-direction: column !important; // 改为垂直布局
        align-items: stretch !important;
        justify-content: flex-start;
        height: auto !important;
        margin: 10px auto !important;
        padding: 10px 15px;
        position: relative; // 添加相对定位
      }

      .header__logo {
        margin-bottom: 15px !important;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        padding-right: 120px;

        .el-image {
          width: 120px !important;
          height: 40px !important;
        }
        p {
          font-size: 14px !important;
          margin-left: 8px !important;
          white-space: nowrap;
        }
      }

      .user-area {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-wrap: wrap;
        gap: 10px;

        // 用户信息区域移到右上角，增加宽度
        .user-info {
          position: absolute !important;
          top: 10px;
          right: 15px;
          z-index: 10;
          min-width: 100px;
        }

        // 登录按钮也移到右上角
        .login {
          position: absolute !important;
          top: 10px;
          right: 15px;
          z-index: 10;
          font-size: 12px;
          padding: 6px 12px;
        }

        // 其他按钮保持居中，但需要排除用户信息和登录按钮
        .cart-btn,
        .booking-history-btn,
        .user-center-btn {
          margin-right: 8px;
          font-size: 12px;
          span {
            display: none;
          }
          .el-icon {
            margin-right: 0;
            font-size: 16px;
          }
        }

        .user-info-wrapper {
          padding: 2px;
          min-width: 90px;
        }
        .user-avatar {
          width: 30px;
          height: 30px;
          margin-right: 5px;
        }
        .username {
          font-size: 12px;
          max-width: none;
          overflow: visible;
          text-overflow: unset;
          white-space: nowrap;
        }
      }
    }

    // 超小屏幕适配
    @media (max-width: 480px) {
      .container {
        padding: 10px;
      }
      .header__logo {
        padding-right: 100px; // 超小屏幕减少右边距

        .el-image {
          width: 100px !important;
          height: 35px !important;
        }
        p {
          font-size: 12px !important;
          margin-left: 5px !important;
        }
      }
      .user-area {
        // 调整右上角用户信息位置
        .user-info {
          top: 5px !important;
          right: 10px !important;
          min-width: 80px; // 超小屏幕适当减少宽度
        }

        // 调整右上角登录按钮位置
        .login {
          top: 5px !important;
          right: 10px !important;
          font-size: 10px;
          padding: 4px 8px;
        }

        // 在超小屏幕也隐藏这些按钮
        .cart-btn,
        .booking-history-btn,
        .user-center-btn {
          display: none !important; // 完全隐藏，不占位
        }

        .user-info-wrapper {
          min-width: 70px; // 超小屏幕的包装器宽度
        }

        .user-avatar {
          width: 25px;
          height: 25px;
          margin-right: 3px;
        }
        .username {
          font-size: 10px;
          max-width: none; // 移除最大宽度限制
          overflow: visible; // 允许完全显示
          text-overflow: unset; // 移除省略号
        }
      }
    }
  }

  .container {
    display: flex;
    align-items: center;
    margin: 20px auto;
    width: 1200px;
    height: 80px;
    .header__logo {
      display: flex;
      align-items: center;
      flex-shrink: 0; // 防止logo被压缩
      p {
        color: #fff;
        font-size: 24px;
        margin-left: 20px;
        white-space: nowrap; // 防止标题换行
      }
    }
    .user-area {
      margin-left: auto;
      display: flex;
      align-items: center;
      flex-shrink: 0; // 防止用户区域被压缩

      .cart-btn,
      .booking-history-btn,
      .user-center-btn {
        color: #fff;
        font-size: 16px;
        margin-right: 20px;
        display: flex;
        align-items: center;
        white-space: nowrap; // 防止按钮文字换行

        .el-icon {
          margin-right: 5px;
          font-size: 18px;
        }

        &:hover {
          color: #ffd04b;
        }
      }

      .user-info {
        // 垂直居中
        display: flex;
        align-items: center;
      }

      .user-info-wrapper {
        display: flex;
        align-items: center;
        cursor: pointer;
        padding: 5px;
        border-radius: 20px;
        transition: background-color 0.3s ease;

        &:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }
      }

      .user-avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%; // 圆形头像
        overflow: hidden;
        margin-right: 10px;
        transition: transform 0.3s ease;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        &:hover {
          transform: scale(1.1);
        }
      }

      .username {
        color: #fff;
        font-size: 16px;
        margin-right: 5px;
      }

      .login {
        background-color: rgb(50, 114, 185);
        border: none;
        font-size: 18px;
        white-space: nowrap; // 防止登录按钮文字换行
      }
    }
  }
}

.nav {
  // 移动端适配
  @media (max-width: 768px) {
    height: 50px; // 减少导航高度
    margin-top: 0; // 确保导航栏紧贴header
  }

  .container {
    display: flex;
    justify-content: center;
    margin: 0 auto;

    // 移动端适配
    @media (max-width: 768px) {
      padding: 0 10px;
      width: 100%;
    }

    .el-menu-demo {
      width: 100%;
      background-color: rgb(50, 114, 185);
      display: flex;
      justify-content: space-evenly;
      border-bottom: none;

      // 移动端适配
      @media (max-width: 768px) {
        height: 50px;
        line-height: 50px;
      }

      .el-sub-menu {
        width: 200px;
        text-align: center;

        // 移动端适配
        @media (max-width: 768px) {
          width: auto;
          flex: 1;
        }

        .el-menu-item {
          width: 200px;

          // 移动端适配
          @media (max-width: 768px) {
            width: 100%;
            font-size: 12px;
            padding: 0 5px;
          }
        }
      }

      .el-menu-item {
        width: 200px;
        text-align: center;

        // 移动端适配
        @media (max-width: 768px) {
          width: auto;
          flex: 1;
          font-size: 12px;
          padding: 0 5px;
          height: 50px;
          line-height: 50px;
        }

        // 超小屏幕适配
        @media (max-width: 480px) {
          font-size: 10px;
          padding: 0 2px;
        }

        a {
          text-align: center;

          // 移动端适配
          @media (max-width: 768px) {
            font-size: 12px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          // 超小屏幕适配
          @media (max-width: 480px) {
            font-size: 10px;
          }
        }
      }

      a {
        text-decoration: none;
        color: #fff;
        display: block;
        width: 100%;
        height: 100%;
        position: relative;
      }

      .router-link-active {
        color: #ffd04b; // 修改激活状态的文字颜色

        &::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          background-color: #ffd04b; // 修改底部边框颜色
        }
      }
    }
  }
}
</style>
