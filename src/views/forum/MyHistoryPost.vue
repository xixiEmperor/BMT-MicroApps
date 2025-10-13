<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores'
import { View, Delete, CaretTop } from '@element-plus/icons-vue'
import { formatDateTime } from '@/utils/format'
import { getUserPosts, deletePostService } from '@/api/forum'

const router = useRouter()
const userStore = useUserStore()

// 用户信息
const userInfo = ref({})
userInfo.value = userStore.userinfo || {}

// 分页相关
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 用户的发帖列表
const userPosts = ref([])
const loading = ref(false)

// 加载用户发帖列表
const loadUserPosts = async () => {
  if (!userStore.userinfo?.id) {
    ElMessage.warning('请先登录')
    router.push('/login')
    return
  }

  loading.value = true
  try {
    const params = {
      userId: userStore.userinfo.id,
      page: currentPage.value,
      pageSize: pageSize.value
    }

    const response = await getUserPosts(params)
    if (response.data.code === 0) {
      userPosts.value = response.data.data.list || []
      total.value = response.data.data.total || 0

      // 格式化日期
      userPosts.value.forEach(post => {
        if (post.publishTime) {
          post.publishTime = formatDateTime(post.publishTime)
        }
        if (post.lastReply) {
          post.lastReply = formatDateTime(post.lastReply)
        }
      })
    } else {
      ElMessage.error(response.data.msg || '获取发帖记录失败')
    }
  } catch (error) {
    console.error('获取用户发帖记录失败', error)
    ElMessage.error('获取发帖记录失败')
  } finally {
    loading.value = false
  }
}

// 跳转到帖子详情
const navigateToDetail = (postId) => {
  router.push(`/post/${postId}`)
}

// 删除帖子
const deletePost = (post) => {
  ElMessageBox.confirm(`确定要删除帖子"${post.title}"吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      try {
        await deletePostService(post.id)
        ElMessage.success('帖子删除成功')
        // 重新加载帖子列表
        loadUserPosts()
      } catch (error) {
        console.error('删除帖子失败', error)
        ElMessage.error('删除帖子失败')
      }
    })
    .catch(() => {
      // 用户取消删除操作
    })
}

// 分页变化
const handlePageChange = (page) => {
  currentPage.value = page
  loadUserPosts()
}

// 分页大小变化
const handleSizeChange = (size) => {
  pageSize.value = size
  currentPage.value = 1
  loadUserPosts()
}

// 发布新帖
const navigateToPublish = () => {
  router.push('/publish-post')
}

// 获取分类名称
const getCategoryName = (categoryCode) => {
  const categoryMap = {
    'team': '打球组队',
    'notice': '赛事讨论',
    'help': '求助问答',
    'exp': '经验交流'
  }
  return categoryMap[categoryCode] || '其他'
}

// 获取分类标签类型
const getCategoryTagType = (categoryCode) => {
  const typeMap = {
    'team': 'success',
    'notice': 'primary',
    'help': 'warning',
    'exp': 'info'
  }
  return typeMap[categoryCode] || 'default'
}

onMounted(() => {
  loadUserPosts()
})
</script>

<template>
  <div class="my-posts-container">
    <h2>我的发帖</h2>

    <div class="posts-header">
      <div class="user-info" v-if="userStore.token">
        <el-avatar :src="userStore.userinfo?.avatar || 'https://tse1-mm.cn.bing.net/th/id/OIP-C.gaAkkFf8LStn-oc4l8iM0wAAAA?w=160&h=180&c=7&r=0&o=5&dpr=1.5&pid=1.7'"></el-avatar>
        <span class="username">{{ userStore.userinfo?.username || '羽球爱好者' }}</span>
        <div class="user-stats">
          <div class="stat-item">发帖数量：<span>{{ total }}</span></div>
        </div>
      </div>
      <el-button type="primary" @click="navigateToPublish">发布新帖</el-button>
    </div>

    <div class="posts-content">
      <el-table
        :data="userPosts"
        style="width: 100%"
        v-loading="loading"
        empty-text="暂无发帖记录">
        <el-table-column prop="title" label="帖子标题" min-width="300">
          <template #default="scope">
            <div class="post-title" @click="navigateToDetail(scope.row.id)">
              <el-icon v-if="scope.row.isTop" class="top-icon"><CaretTop /></el-icon>
              {{ scope.row.title }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="categoryCode" label="分类" width="120">
          <template #default="scope">
            <el-tag
              :type="getCategoryTagType(scope.row.categoryCode)">
              {{ getCategoryName(scope.row.categoryCode) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="publishTime" label="发布时间" width="180">
        </el-table-column>
        <el-table-column label="回复/查看" width="120">
          <template #default="scope">
            <div class="post-stats">
              <div>{{ scope.row.replyCount || 0 }} 回复</div>
              <div>{{ scope.row.views || 0 }} 查看</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <div class="post-actions">
              <el-button
                type="primary"
                :icon="View"
                circle
                size="small"
                @click="navigateToDetail(scope.row.id)"
                title="查看详情">
              </el-button>
              <el-button
                type="danger"
                :icon="Delete"
                circle
                size="small"
                @click="deletePost(scope.row)"
                title="删除帖子">
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination
          v-model="currentPage"
          :page-size="pageSize"
          :total="total"
          :page-sizes="[5, 10, 20, 50]"
          layout="total, sizes, prev, pager, next"
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.my-posts-container {
  padding: 0 20px;
}

h2 {
  text-align: center;
  color: #2b6fc2;
  margin-bottom: 30px;
}

.posts-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.user-info {
  display: flex;
  align-items: center;
}

.username {
  margin-left: 10px;
  font-size: 18px;
  font-weight: bold;
}

.user-stats {
  margin-left: 20px;
  display: flex;
}

.stat-item {
  margin-right: 15px;
  color: #666;
}

.stat-item span {
  color: #2b6fc2;
  font-weight: bold;
}

.posts-content {
  margin-bottom: 30px;
}

.post-title {
  color: #2b6fc2;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.post-title:hover {
  text-decoration: underline;
}

.top-icon {
  margin-right: 8px;
  color: #f56c6c;
  font-size: 16px;
}

.el-icon.top-icon {
  transform: scale(1.2);
}

.post-stats {
  display: flex;
  flex-direction: column;
  font-size: 14px;
  color: #666;
}

.post-actions {
  display: flex;
  gap: 8px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
</style>
