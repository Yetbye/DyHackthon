<template>
  <div class="agent-chat-page">
    <!-- 头部 -->
    <div class="chat-header">
      <div class="back-btn" @click="goBack">
        <img src="@/assets/img/icon/back.png" alt="返回" />
      </div>
      <div class="header-info">
        <div class="agent-avatar">
          <img src="@/assets/img/avatar.png" alt="AI Agent" />
          <div class="online-status"></div>
        </div>
        <div class="agent-info">
          <div class="agent-name">美妆小助手</div>
          <div class="agent-status">AI智能推荐</div>
        </div>
      </div>
      <div class="more-btn">
        <img src="@/assets/img/icon/menu-white.png" alt="更多" />
      </div>
    </div>

    <!-- 聊天内容区 -->
    <div class="chat-content" ref="chatContentRef">
      <div class="messages-container">
        <div
          v-for="(message, index) in messages"
          :key="index"
          :class="['message-item', message.type]"
        >
          <!-- AI消息 -->
          <template v-if="message.type === 'agent'">
            <div class="agent-avatar">
              <img src="@/assets/img/avatar.png" alt="AI" />
            </div>
            <div class="message-content">
              <div class="message-bubble">
                <div class="message-text" v-html="formatMessage(message.content)"></div>
              </div>
              <!-- 推荐商品卡片 -->
              <div v-if="message.products && message.products.length > 0" class="product-recommendations">
                <div
                  v-for="product in message.products"
                  :key="product.id"
                  class="product-card"
                  @click="goToProduct(product)"
                >
                  <img :src="getProductImage(product.cover)" :alt="product.name" />
                  <div class="product-info">
                    <div class="product-name">{{ product.name }}</div>
                    <div class="product-price">¥{{ product.real_price }}</div>
                  </div>
                </div>
              </div>
              <div class="message-time">{{ formatTime(message.time) }}</div>
            </div>
          </template>

          <!-- 用户消息 -->
          <template v-else>
            <div class="message-content">
              <div class="message-bubble">
                <div class="message-text">{{ message.content }}</div>
              </div>
              <div class="message-time">{{ formatTime(message.time) }}</div>
            </div>
          </template>
        </div>

        <!-- 加载中 -->
        <div v-if="isLoading" class="message-item agent loading">
          <div class="agent-avatar">
            <img src="@/assets/img/avatar.png" alt="AI" />
          </div>
          <div class="message-content">
            <div class="message-bubble">
              <div class="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 快捷问题 -->
    <div class="quick-questions" v-if="showQuickQuestions">
      <div class="quick-title">常见问题</div>
      <div class="quick-tags">
        <span
          v-for="question in quickQuestions"
          :key="question"
          class="quick-tag"
          @click="sendQuickQuestion(question)"
        >
          {{ question }}
        </span>
      </div>
    </div>

    <!-- 输入区 -->
    <div class="chat-input-area">
      <div class="input-container">
        <input
          v-model="inputMessage"
          type="text"
          placeholder="问我关于美妆的问题..."
          @keyup.enter="sendMessage"
        />
        <button
          class="send-btn"
          :class="{ active: inputMessage.trim() }"
          @click="sendMessage"
          :disabled="!inputMessage.trim() || isLoading"
        >
          <img src="@/assets/img/icon/message/chat/send.png" alt="发送" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { llmApiService } from '@/agent/llm-api'
import { recommendationEngine } from '@/agent/recommendation-engine'
import behaviorTracker from '@/agent/behavior-tracker'
import type { BeautyProduct } from '@/agent/recommendation-engine'

interface Message {
  type: 'user' | 'agent'
  content: string
  time: number
  products?: BeautyProduct[]
}

const router = useRouter()
const chatContentRef = ref<HTMLElement>()
const messages = ref<Message[]>([])
const inputMessage = ref('')
const isLoading = ref(false)
const showQuickQuestions = ref(true)

const quickQuestions = [
  '适合干皮的粉底液推荐',
  '显白口红推荐',
  '油皮护肤套装',
  '新手眼影盘推荐',
  '抗老精华推荐'
]

// 初始化欢迎消息
onMounted(() => {
  recommendationEngine.loadProducts()
  messages.value.push({
    type: 'agent',
    content: '你好！我是你的专属美妆小助手💄\n\n我可以根据你的肤质、喜好为你推荐适合的美妆产品。也可以回答你关于护肤、彩妆的任何问题哦！',
    time: Date.now()
  })
})

const goBack = () => {
  router.back()
}

const formatMessage = (content: string) => {
  return content.replace(/\n/g, '<br>')
}

const formatTime = (time: number) => {
  const date = new Date(time)
  return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
}

const getProductImage = (cover: string) => {
  // 如果是完整URL直接使用，否则添加前缀
  if (cover.startsWith('http')) {
    return cover
  }
  return `/images/goods/${cover}`
}

const goToProduct = (product: BeautyProduct) => {
  // 跳转到商品详情页
  router.push(`/shop/detail?id=${product.id}`)
}

const scrollToBottom = async () => {
  await nextTick()
  if (chatContentRef.value) {
    chatContentRef.value.scrollTop = chatContentRef.value.scrollHeight
  }
}

const sendQuickQuestion = (question: string) => {
  inputMessage.value = question
  sendMessage()
}

const sendMessage = async () => {
  const message = inputMessage.value.trim()
  if (!message || isLoading.value) return

  // 添加用户消息
  messages.value.push({
    type: 'user',
    content: message,
    time: Date.now()
  })

  inputMessage.value = ''
  showQuickQuestions.value = false
  isLoading.value = true
  await scrollToBottom()

  try {
    // 获取AI回复（基于真实商品数据）
    const context = behaviorTracker.getBehaviorSummary()
    const { reply, products } = await llmApiService.chatReply(message, context)

    // 添加AI消息
    messages.value.push({
      type: 'agent',
      content: reply,
      time: Date.now(),
      products: products.length > 0 ? products : undefined
    })
  } catch (error) {
    console.error('Chat error:', error)
    messages.value.push({
      type: 'agent',
      content: '抱歉，我暂时无法回答这个问题。您可以尝试询问其他美妆相关问题哦！',
      time: Date.now()
    })
  } finally {
    isLoading.value = false
    await scrollToBottom()
  }
}
</script>

<style scoped lang="less">
.agent-chat-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f5f5;
}

// 头部
.chat-header {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background: #161823;
  color: white;
}

.back-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  
  img {
    width: 24px;
    height: 24px;
  }
}

.header-info {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12px;
}

.agent-avatar {
  position: relative;
  width: 44px;
  height: 44px;
  
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid #ff69b4;
  }
  
  .online-status {
    position: absolute;
    bottom: 2px;
    right: 2px;
    width: 12px;
    height: 12px;
    background: #4cd964;
    border-radius: 50%;
    border: 2px solid #161823;
  }
}

.agent-info {
  .agent-name {
    font-size: 16px;
    font-weight: 600;
  }
  
  .agent-status {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.6);
    margin-top: 2px;
  }
}

.more-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  img {
    width: 24px;
    height: 24px;
  }
}

// 聊天内容
.chat-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.messages-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.message-item {
  display: flex;
  gap: 12px;
  
  &.user {
    flex-direction: row-reverse;
    
    .message-bubble {
      background: #ff69b4;
      color: white;
      border-radius: 18px 18px 4px 18px;
    }
    
    .message-time {
      text-align: left;
    }
  }
  
  &.agent {
    .message-bubble {
      background: white;
      color: #333;
      border-radius: 18px 18px 18px 4px;
    }
    
    .message-time {
      text-align: right;
    }
  }
  
  .agent-avatar {
    width: 40px;
    height: 40px;
    flex-shrink: 0;
    
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      object-fit: cover;
    }
  }
  
  .message-content {
    max-width: 70%;
  }
  
  .message-bubble {
    padding: 12px 16px;
    font-size: 14px;
    line-height: 1.5;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }
  
  .message-time {
    font-size: 11px;
    color: #999;
    margin-top: 4px;
  }
}

// 推荐商品
.product-recommendations {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 8px;
}

.product-card {
  display: flex;
  gap: 10px;
  background: white;
  border-radius: 12px;
  padding: 10px;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s;
  
  &:hover {
    transform: scale(1.02);
  }
  
  img {
    width: 60px;
    height: 60px;
    border-radius: 8px;
    object-fit: cover;
  }
  
  .product-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  
  .product-name {
    font-size: 13px;
    color: #333;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  
  .product-price {
    font-size: 14px;
    font-weight: 700;
    color: #ff4757;
    margin-top: 4px;
  }
}

// 输入中动画
.typing-indicator {
  display: flex;
  gap: 4px;
  padding: 8px 12px;
  
  span {
    width: 8px;
    height: 8px;
    background: #ccc;
    border-radius: 50%;
    animation: typing 1.4s infinite;
    
    &:nth-child(2) {
      animation-delay: 0.2s;
    }
    
    &:nth-child(3) {
      animation-delay: 0.4s;
    }
  }
}

@keyframes typing {
  0%, 60%, 100% {
    transform: translateY(0);
  }
  30% {
    transform: translateY(-10px);
  }
}

// 快捷问题
.quick-questions {
  padding: 16px;
  background: white;
  border-top: 1px solid #eee;
}

.quick-title {
  font-size: 13px;
  color: #999;
  margin-bottom: 12px;
}

.quick-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.quick-tag {
  font-size: 13px;
  color: #ff69b4;
  background: rgba(255, 105, 180, 0.1);
  padding: 8px 16px;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: rgba(255, 105, 180, 0.2);
  }
}

// 输入区
.chat-input-area {
  padding: 12px 16px;
  background: white;
  border-top: 1px solid #eee;
}

.input-container {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #f5f5f5;
  border-radius: 24px;
  padding: 8px 8px 8px 16px;
  
  input {
    flex: 1;
    border: none;
    background: transparent;
    font-size: 14px;
    outline: none;
    
    &::placeholder {
      color: #999;
    }
  }
  
  .send-btn {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: none;
    background: #ccc;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s;
    
    img {
      width: 20px;
      height: 20px;
      filter: brightness(0) invert(1);
    }
    
    &.active {
      background: #ff69b4;
      
      &:hover {
        background: #ff1493;
      }
    }
    
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
}
</style>
