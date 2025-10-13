<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useUserStore } from '@/stores'
import { getForumList } from '@/api/forum'
import { useForumStore } from '@/stores/modules/forum'
import { formatDateTime } from '@/utils/format'
import { CaretTop } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const userStore = useUserStore()
const forumStore = useForumStore()
// 分类选项卡
const tabs = ref([
  { name: 'all', label: '全部帖子' },
  { name: 'team', label: '打球组队' },
  { name: 'notice', label: '赛事讨论' },
  { name: 'help', label: '求助问答' },
  { name: 'exp', label: '经验交流' },
])

// 当前激活的分类标签
const activeTab = ref('all')

// 搜索关键词
const searchKeyword = ref('')
// 防抖定时器
let searchTimer = null

// 分页相关
const currentPage = ref(1)
const pageSize = ref(5)
const total = ref(0)

// 调用API获取帖子列表数据
const getForumListData = async () => {
  const res = await getForumList({
    page: currentPage.value,
    pageSize: pageSize.value,
    keyword: searchKeyword.value,
    category: activeTab.value,
  })
  if (res.data.code === 0) {
    console.log(res)
    // 格式化日期时间
    const formattedList = res.data.data.list.map(post => {
      return {
        ...post,
        publishTime: formatDateTime(post.publishTime),
        lastReply: formatDateTime(post.lastReply)
      }
    })

    // 对帖子进行排序，置顶的排在前面
    formattedList.sort((a, b) => {
      // 如果a置顶而b不置顶，则a排在前面
      if (a.isTop && !b.isTop) return -1;
      // 如果b置顶而a不置顶，则b排在前面
      if (!a.isTop && b.isTop) return 1;
      // 如果都置顶，则按置顶时间排序（后置顶的在前面）
      if (a.isTop && b.isTop) {
        return new Date(b.topTime || b.publishTime).getTime() - new Date(a.topTime || a.publishTime).getTime();
      }
      // 如果都不置顶，保持原有顺序（按发布时间倒序）
      return new Date(b.publishTime).getTime() - new Date(a.publishTime).getTime();
    });

    // 将帖子列表数据存储到论坛store中
    forumStore.setPosts(formattedList)
    total.value = res.data.data.total
  }
}
onMounted(async () => {
  await getForumListData()
})

// 跳转到发布页面
const navigateToPublish = () => {
  // 检查用户是否已登录
  if (!userStore.token) {
    // 未登录，跳转到登录页面
    ElMessage.warning('请先登录后再发布文章')
    router.push('/login')
    return
  }

  // 已登录，在新标签页跳转到发布页面
  router.push('/publish-post')
}

// 跳转到文章详情
const navigateToDetail = (postId) => {
  // 在新标签页打开
  router.push(`/post/${postId}`)
}

// 搜索功能（添加防抖）
const handleSearch = () => {
  // 清除之前的定时器
  if (searchTimer) {
    clearTimeout(searchTimer)
  }

  // 设置新的定时器，500ms后执行搜索
  searchTimer = setTimeout(() => {
    currentPage.value = 1 // 重置页码
    getForumListData()
  }, 500)
}

// 分页变化
const handlePageChange = (page) => {
  currentPage.value = page
  getForumListData()
}

// 分页大小变化
const handleSizeChange = (size) => {
  pageSize.value = size
  currentPage.value = 1
  getForumListData()
}

// 监听分类变化，重置分页
watch(activeTab, () => {
  currentPage.value = 1
  getForumListData()
})

// 监听搜索关键词变化，触发防抖搜索
watch(searchKeyword, () => {
  handleSearch()
})

// 自定义行样式
const tableRowClassName = ({ row }) => {
  return row.isTop ? 'top-row' : ''
}
</script>

<template>
  <div class="forum-container">
    <h2>羽你同行论坛</h2>

    <div class="forum-actions">
      <el-button type="primary" @click="navigateToPublish">发布新帖</el-button>
      <el-input
        v-model="searchKeyword"
        placeholder="搜索论坛内容"
        class="search-input"
      >
        <template #append>
          <el-button @click="handleSearch">搜索</el-button>
        </template>
      </el-input>
    </div>

    <div class="forum-content">
      <el-tabs v-model="activeTab" class="demo-tabs">
        <el-tab-pane
          v-for="tab in tabs"
          :key="tab.name"
          :label="tab.label"
          :name="tab.name"
        ></el-tab-pane>
      </el-tabs>

      <div class="topics-container">
        <el-table :data="forumStore.posts" style="width: 100%" :row-class-name="tableRowClassName">
          <el-table-column prop="title" label="主题" min-width="300">
            <template #default="scope">
              <div class="topic-title" @click="navigateToDetail(scope.row.id)">
                <el-icon v-if="scope.row.isTop" class="top-icon"><CaretTop /></el-icon>
                {{ scope.row.title }}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="author" label="作者" width="120">
            <template #default="scope">
              <div class="topic-author">{{ scope.row.author }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="replies" label="回复/查看" width="120">
            <template #default="scope">
              <div class="topic-stats">
                <div>{{ scope.row.replyCount || 0 }} 回复</div>
                <div>{{ scope.row.views }} 查看</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="lastReply" label="最后回复" width="120">
            <template #default="scope">
              <div class="topic-last-reply">{{ scope.row.lastReply }}</div>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="pagination-container">
        <el-pagination
          v-model="currentPage"
          :page-size="pageSize"
          :total="total"
          :page-sizes="[5, 8, 10, 15]"
          layout="total, sizes, prev, pager, next"
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.forum-container {
  padding: 0;
}

h2 {
  text-align: center;
  color: #2b6fc2;
  margin-bottom: 30px;
}

.forum-actions {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.search-input {
  width: 300px;
}

.forum-content {
  margin-bottom: 30px;
}

.topics-container {
  margin-top: 20px;
}

.topic-title {
  color: #2b6fc2;
  font-weight: bold;
  cursor: pointer;
  transition: color 0.3s;
  display: flex;
  align-items: center;
}

.topic-title:hover {
  color: #409eff;
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

.el-table .top-row {
  background-color: #fdf6ec;
  position: relative;
}

.el-table .top-row td {
  font-weight: 500;
}

.topic-author {
  color: #666;
}

.topic-stats {
  font-size: 12px;
  color: #999;
}

.topic-last-reply {
  font-size: 12px;
  color: #666;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

.forum-sidebar {
  margin-top: 30px;
}

.forum-stats-card :deep(.el-card__header) {
  padding: 10px;
  background-color: #f5f5f5;
}

.stats-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #eee;
}

.stats-item:last-child {
  border-bottom: none;
}

.stats-label {
  color: #666;
}

.stats-value {
  font-weight: bold;
  color: #2b6fc2;
}
</style>
