<script>
export default {
  name: 'LoginView',
}
</script>
<script setup>
import { User, Lock, Message } from '@element-plus/icons-vue'
import { ref, watch } from 'vue'
import { authRegisterService, authLoginService, authSendCodeService } from '@/api/auth'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores'
import VerificationCodeInput from '@/components/VerificationCodeInput.vue'

const userStore = useUserStore()
const router = useRouter()
const isRegister = ref(false) // 默认显示登录页面
const formModel = ref({
  username: '',
  password: '',
  email: '', // 新增邮箱字段
  verificationCode: '', // 新增验证码字段
})

// 验证码相关状态
const isSendingCode = ref(false)
const countdown = ref(0)
let timer = null

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 5, max: 10, message: '请输入5-10位用户名', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { pattern: /^\S{6,15}$/, message: '请输入6-15位非空密码', trigger: 'blur' },
  ],
  repassword: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== formModel.value.password) {
          callback(new Error('请输入相同的密码'))
        } else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入有效的邮箱地址', trigger: 'blur' },
  ],
  verificationCode: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { len: 6, message: '请输入6位验证码', trigger: 'blur' },
  ],
}
const form = ref()

//对当前表单进行侦听，如果有isRegister的切换就重置表单
watch(isRegister, () => {
  formModel.value = {
    username: '',
    password: '',
    repassword: '',
    email: '', // 重置邮箱字段
    verificationCode: '', // 重置验证码字段
  }
  // 清除倒计时
  if (timer) {
    clearInterval(timer)
    timer = null
  }
  isSendingCode.value = false
  countdown.value = 0
})

// 发送验证码
const sendVerificationCode = async () => {
  try {
    // 验证邮箱格式
    await form.value.validateField(['email'])

    isSendingCode.value = true

    // 调用发送验证码接口
    const res = await authSendCodeService({
      email: formModel.value.email,
      type: 'register'
    })

    if (res.data.code === 0) {
      ElMessage.success('验证码已发送至您的邮箱')
      // 启动倒计时
      countdown.value = 60
      timer = setInterval(() => {
        countdown.value--
        if (countdown.value <= 0) {
          clearInterval(timer)
          timer = null
          isSendingCode.value = false
        }
      }, 1000)
    } else {
      ElMessage.error(res.data.msg || '发送验证码失败')
      isSendingCode.value = false
    }
  } catch (error) {
    console.error('发送验证码错误:', error)
    ElMessage.error('发送验证码失败，请检查邮箱格式')
    isSendingCode.value = false
  }
}

// 注册
const register = async () => {
  // 预校验
  await form.value.validate()
  // 调用注册服务
  const res = await authRegisterService(formModel.value)
  if (res.data.code === 0) {
    ElMessage.success('注册成功')
    isRegister.value = false
  } else {
    ElMessage.error(res.data.msg || '注册失败')
  }
}

// 登录
const login = async () => {
  await form.value.validate()

  try {
    // 调用登录服务
    const res = await authLoginService(formModel.value)

    console.log(res)

    if (res.code === 0) {
      ElMessage.success('登录成功')

      // 设置token和过期时间
      const token = res.data.token
      userStore.setToken(token)

      // 先获取用户信息，注意添加await
      await userStore.getUserinfo()

      // 获取重定向路径
      const redirect = router.currentRoute.value.query.redirect || '/'

      // 获取到用户信息后再判断角色和跳转
      if (userStore.userinfo?.role === 'ROLE_ADMIN') {
        // 管理员默认跳转到后台，除非有特定重定向路径
        const targetPath = redirect.startsWith('/admin') ? redirect : '/admin'
        router.push(targetPath)
      } else {
        // 普通用户跳转到重定向路径或首页
        router.push(redirect)
      }
    } else {
      ElMessage.error(res.message)
    }
  } catch (error) {
    ElMessage.error(`登录失败: ${error.response?.data?.message || error.message || '未知错误'}`)
  }
}

// 修改忘记密码的跳转路径
const goToForgetPassword = () => {
  router.push('/login/forget-password')
}
</script>

<template>
  <!-- 添加router-view用于显示子路由 -->
  <router-view v-if="$route.path !== '/login'"></router-view>

  <el-row class="login-page" v-if="$route.path === '/login'">
    <el-col :span="12" class="bg"></el-col>
    <el-col :span="6" :offset="3" class="form">
      <el-form
        :model="formModel"
        :rules="rules"
        ref="form"
        size="large"
        autocomplete="off"
        v-if="isRegister"
      >
        <el-form-item>
          <h1>注册</h1>
        </el-form-item>
        <el-form-item prop="username">
          <el-input
            v-model="formModel.username"
            :prefix-icon="User"
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="formModel.password"
            :prefix-icon="Lock"
            type="password"
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>
        <el-form-item prop="repassword">
          <el-input
            v-model="formModel.repassword"
            :prefix-icon="Lock"
            type="password"
            placeholder="请输入再次密码"
          ></el-input>
        </el-form-item>
        <el-form-item prop="email">
          <el-input
            v-model="formModel.email"
            :prefix-icon="Message"
            type="email"
            placeholder="请输入邮箱"
          ></el-input>
        </el-form-item>
        <el-form-item prop="verificationCode">
          <div class="verify-code-section">
            <VerificationCodeInput
              v-model="formModel.verificationCode"
              :length="6"
            />
            <el-button
              type="primary"
              :disabled="isSendingCode || countdown > 0"
              @click="sendVerificationCode"
              class="verify-code-btn"
            >
              {{ countdown > 0 ? `${countdown}秒后重新获取` : '获取验证码' }}
            </el-button>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button @click="register" class="button" type="primary" auto-insert-space>
            注册
          </el-button>
        </el-form-item>
        <el-form-item class="flex">
          <el-link type="info" :underline="false" @click="isRegister = false"> ← 返回 </el-link>
        </el-form-item>
      </el-form>
      <el-form :model="formModel" :rules="rules" ref="form" size="large" autocomplete="off" v-else>
        <el-form-item>
          <h1>登录</h1>
        </el-form-item>
        <el-form-item prop="username">
          <el-input
            v-model="formModel.username"
            :prefix-icon="User"
            placeholder="请输入用户名"
            id="username-input"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="formModel.password"
            name="password"
            :prefix-icon="Lock"
            type="password"
            placeholder="请输入密码"
            id="password-input"
          ></el-input>
        </el-form-item>
        <el-form-item class="flex">
          <div class="flex">
            <el-checkbox>记住我</el-checkbox>
            <el-link type="primary" :underline="false" @click="goToForgetPassword"
              >忘记密码？</el-link
            >
          </div>
        </el-form-item>
        <el-form-item>
          <el-button id="login-btn" @click="login" class="button" type="primary" auto-insert-space>登录</el-button>
        </el-form-item>
        <el-form-item class="flex">
          <el-link type="info" :underline="false" @click="isRegister = true"> 注册 → </el-link>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<style lang="less" scoped>
.login-page {
  height: 100vh;
  background-color: #fff;
  .bg {
    background: url('../../assets/login_images/background.jpg') no-repeat center / cover;
    border-radius: 0 20px 20px 0;
  }
  .form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    user-select: none;
    .title {
      margin: 0 auto;
    }
    .button {
      width: 100%;
    }
    .flex {
      width: 100%;
      display: flex;
      justify-content: space-between;
    }
    .verify-code-container {
      display: flex;
      gap: 10px;
      width: 100%;
      .verify-code-btn {
        flex-shrink: 0;
        min-width: 110px;
      }
    }
    .verify-code-section {
      display: flex;
      flex-direction: row;
      gap: 12px;
      align-items: center;
      .verify-code-btn {
        min-width: 120px;
        height: 40px;
        flex-shrink: 0;
      }
    }
  }
}
</style>
