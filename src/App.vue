<script setup lang="ts">
import zh from 'element-plus/es/locale/lang/zh-cn.mjs'
import { onMounted, onBeforeUnmount } from 'vue'
import { useUserStore } from '@/stores/modules/user'

// 导入实时连接hooks，在全局进行连接
import { useRealtime } from '@/hooks/useRealtime'
import { ElNotification } from 'element-plus'

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
