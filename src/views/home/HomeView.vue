<script setup>
import {
  Ticket,
  ShoppingBag,
  ChatDotRound,
} from '@element-plus/icons-vue'
import { ref } from 'vue'
import imgUrl from '@/assets/index_img.png'
import ChatInterface from '@/components/ChatInterface.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// AI助手对话框控制
const showAIChat = ref(false)

const toggleAIChat = () => {
  showAIChat.value = !showAIChat.value
}

const goToBooking = () => {
  router.push('/booking')
}

const goToShop = () => {
  router.push('/shop')
}

const goToForum = () => {
  router.push('/forum')
}
</script>

<template>
  <div class="home-container">
    <el-image :src="imgUrl" :lazy="true" alt="" fit="contain" class="hero-image" />
    <h2>欢迎使用南湖校区羽毛球场预定系统</h2>

    <div class="info-section">
      <p>南湖校区羽毛球场预定系统为您提供便捷的场地预约、装备购买及交流互动服务。</p>
      <p>使用本系统，您可以轻松预约羽毛球场地，查看场地使用情况，并与其他羽毛球爱好者交流。</p>
    </div>

    <div class="quick-actions">
      <el-card class="action-card" shadow="hover">
        <template #header>
          <div class="card-header">
            <h3>快速预约</h3>
          </div>
        </template>
        <div class="card-content">
          <el-icon :size="80" color="#2b6fc2"><Ticket /></el-icon>
          <p>点击下方按钮快速预约羽毛球场地</p>
          <el-button type="primary" @click="goToBooking">立即预约</el-button>
        </div>
      </el-card>

      <el-card class="action-card" shadow="hover">
        <template #header>
          <div class="card-header">
            <h3>热门推荐</h3>
          </div>
        </template>
        <div class="card-content">
          <el-icon :size="80" color="#67c23a"><ShoppingBag /></el-icon>
          <p>查看热门羽毛球装备</p>
          <el-button type="success" @click="goToShop">去商城</el-button>
        </div>
      </el-card>

      <el-card class="action-card" shadow="hover">
        <template #header>
          <div class="card-header">
            <h3>交流互动</h3>
          </div>
        </template>
        <div class="card-content">
          <el-icon :size="80" color="#e6a23c"><ChatDotRound /></el-icon>
          <p>加入羽毛球爱好者社区</p>
          <el-button type="warning" @click="goToForum">进入论坛</el-button>
        </div>
      </el-card>
    </div>

    <!-- AI助手悬浮按钮 -->
    <div class="ai-assistant">
      <el-button
        type="primary"
        circle
        :icon="ChatDotRound"
        class="ai-btn"
        :class="{ 'ai-btn-active': showAIChat }"
        @click="toggleAIChat"
        title="AI智能客服"
      ></el-button>
    </div>

    <!-- AI助手对话框 -->
    <div v-if="showAIChat" class="ai-chat-dialog">
      <div class="ai-chat-overlay" @click="showAIChat = false"></div>
      <div class="ai-chat-container">
        <ChatInterface />
        <button @click="showAIChat = false" class="ai-chat-close">×</button>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
@primary-color: #2b6fc2;
@text-color: #666;
@bg-color: #f9f9f9;

.home-container {
  padding: 0;
  margin-top: 20px;

  @media (max-width: 768px) {
    margin-top: 10px;
    padding: 0 10px;
  }

  @media (max-width: 480px) {
    margin-top: 5px;
    padding: 0 5px;
  }

  .hero-image {
    width: 1200px;
    height: 500px;
    margin: 20px auto;
    display: block;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

    @media (max-width: 1200px) {
      width: 100%;
      height: 400px;
      margin: 15px auto;
    }

    @media (max-width: 768px) {
      width: 100%;
      height: 250px;
      margin: 10px auto;
      border-radius: 4px;
    }

    @media (max-width: 480px) {
      width: 100%;
      height: 200px;
      margin: 10px auto;
    }
  }
}

h2 {
  text-align: center;
  color: @primary-color;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    font-size: 20px;
    margin-bottom: 15px;
    padding: 0 10px;
  }

  @media (max-width: 480px) {
    font-size: 18px;
    margin-bottom: 10px;
  }
}

.info-section {
  text-align: center;
  margin-bottom: 30px;
  color: @text-color;
  line-height: 1.6;

  @media (max-width: 768px) {
    margin-bottom: 20px;
    padding: 0 15px;
    font-size: 14px;
  }

  @media (max-width: 480px) {
    margin-bottom: 15px;
    padding: 0 10px;
    font-size: 13px;
  }
}

.quick-actions {
  display: flex;
  justify-content: space-between;
  margin: 30px 0;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    margin: 20px 0;
    padding: 0 10px;
  }

  @media (max-width: 480px) {
    margin: 15px 0;
    padding: 0 5px;
  }
}

.action-card {
  width: 32%;
  transition: all 0.3s;
  margin-bottom: 20px;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
  }

  .card-header {
    display: flex;
    justify-content: center;
    align-items: center;

    h3 {
      margin: 0;
      font-size: 18px;
      color: @primary-color;

      @media (max-width: 768px) {
        font-size: 16px;
      }

      @media (max-width: 480px) {
        font-size: 14px;
      }
    }
  }

  .card-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;

    @media (max-width: 768px) {
      padding: 15px;
    }

    @media (max-width: 480px) {
      padding: 10px;
    }

    .el-icon {
      margin-bottom: 15px;

      @media (max-width: 768px) {
        margin-bottom: 10px;
        font-size: 60px !important;
      }

      @media (max-width: 480px) {
        margin-bottom: 8px;
        font-size: 50px !important;
      }
    }

    p {
      @media (max-width: 768px) {
        font-size: 14px;
        margin-bottom: 10px;
      }

      @media (max-width: 480px) {
        font-size: 12px;
        margin-bottom: 8px;
      }
    }

    .el-button {
      @media (max-width: 768px) {
        font-size: 14px;
        padding: 8px 16px;
      }

      @media (max-width: 480px) {
        font-size: 12px;
        padding: 6px 12px;
      }
    }
  }

  .card-image {
    margin-bottom: 15px;
    border-radius: 5px;
  }
}

.statistics-section {
  margin: 40px 0 20px;

  @media (max-width: 768px) {
    margin: 30px 0 15px;
    padding: 0 10px;
  }

  @media (max-width: 480px) {
    margin: 20px 0 10px;
    padding: 0 5px;
  }
}

.statistic-card {
  background-color: @bg-color;
  border-radius: 8px;
  padding: 20px;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);

  @media (max-width: 768px) {
    padding: 15px;
    margin-bottom: 15px;
  }

  @media (max-width: 480px) {
    padding: 12px;
    margin-bottom: 10px;
    flex-direction: column;
    text-align: center;
  }

  .statistic-icon {
    font-size: 30px;
    color: @primary-color;
    margin-right: 15px;

    @media (max-width: 768px) {
      font-size: 25px;
      margin-right: 12px;
    }

    @media (max-width: 480px) {
      font-size: 20px;
      margin-right: 0;
      margin-bottom: 8px;
    }
  }

  .statistic-info {
    .statistic-value {
      font-size: 24px;
      font-weight: bold;
      color: @primary-color;

      @media (max-width: 768px) {
        font-size: 20px;
      }

      @media (max-width: 480px) {
        font-size: 18px;
      }
    }

    .statistic-label {
      font-size: 14px;
      color: @text-color;
      margin-top: 5px;

      @media (max-width: 768px) {
        font-size: 13px;
      }

      @media (max-width: 480px) {
        font-size: 12px;
        margin-top: 3px;
      }
    }
  }
}

@media (max-width: 768px) {
  .action-card {
    width: 100%;
  }
}

/* AI助手按钮样式 */
.ai-assistant {
  position: fixed;
  right: 50px;
  bottom: 50px;
  z-index: 1000;

  // 移动端适配
  @media (max-width: 768px) {
    right: 20px;
    bottom: 20px;
  }
}

.ai-btn {
  width: 60px;
  height: 60px;
  font-size: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;

  // 移动端适配
  @media (max-width: 768px) {
    width: 50px;
    height: 50px;
    font-size: 20px;
  }

  // 超小屏幕适配
  @media (max-width: 480px) {
    width: 45px;
    height: 45px;
    font-size: 18px;
  }

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
  }

  &.ai-btn-active {
    background-color: #67c23a;
    transform: rotate(45deg);
  }
}

.ai-chat-dialog {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1001;
  animation: fadeIn 0.3s ease-out;

  .ai-chat-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
  }

  .ai-chat-container {
    position: relative;
    width: 90%;
    max-width: 900px;
    height: 85vh;
    max-height: 800px;
    background-color: transparent;
    padding: 0;
    border-radius: 20px;
    overflow: hidden;
    animation: slideUp 0.3s ease-out;

    // 移动端适配
    @media (max-width: 768px) {
      width: 95%;
      height: 90vh;
      max-height: none;
    }

    // 超小屏幕适配
    @media (max-width: 480px) {
      width: 100%;
      height: 100vh;
      border-radius: 0;
    }

    .ai-chat-close {
      position: absolute;
      top: 15px;
      right: 15px;
      background: rgba(255, 255, 255, 0.9);
      border: none;
      font-size: 24px;
      cursor: pointer;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10;
      transition: all 0.3s ease;
      color: #666;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

      &:hover {
        background: rgba(255, 255, 255, 1);
        color: #333;
        transform: scale(1.1);
      }

      // 移动端适配
      @media (max-width: 768px) {
        top: 10px;
        right: 10px;
        width: 35px;
        height: 35px;
        font-size: 20px;
      }
    }
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
</style>
