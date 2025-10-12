<script setup lang="ts">
import zh from 'element-plus/es/locale/lang/zh-cn.mjs'
import { onMounted, onBeforeUnmount } from 'vue'
import { useUserStore } from '@/stores/modules/user'

// 导入实时连接hooks，在全局进行连接
import { useRealtime } from '@/hooks/useRealtime'
import { ElNotification } from 'element-plus'
import { Telemetry } from '@wfynbzlx666/sdk-telemetry'

const userStore = useUserStore()

const messageListener = (data) => {
  ElNotification({
    title: '消息',
    message: data.payload,
    type: 'info',
    duration: 0
  })
}

onMounted(async () => {
  Telemetry.init({
    app: 'BMT-MicroApps',
    release: import.meta.env.VITE_APP_VERSION ?? 'dev',
    batchSize: 20,
    sampleRate: 1,
    debug: true,
  })
  Telemetry.setUser({
    id: userStore.userinfo?.id,
    role: userStore.userinfo?.role,
  })
  useRealtime().onConnectionChange((status) => {
    // 只在断开连接或连接成功的时候显示通知
    if(status !== "disconnected" && status !== "connected") return
    ElNotification({
      title: '实时连接状态变化',
      message: status,
      type: status === "disconnected" ? "error" : "success"
    })
  })
  await useRealtime().connect()

  useRealtime().subscribe(`post_like_to_${userStore.userinfo.username}`, messageListener)

  useRealtime().subscribe(`post_comment_to_${userStore.userinfo.username}`, messageListener)
})

onBeforeUnmount(() => {
  useRealtime().disconnect()
})
</script>

<template>
  <el-config-provider :locale="zh">
    <router-view></router-view>
  </el-config-provider>
</template>
