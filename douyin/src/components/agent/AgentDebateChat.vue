<template>
  <div class="agent-debate-chat">
    <!-- Step 1: Input -->
    <div v-if="step === 'input'" class="step-container input-step">
      <div class="welcome-card">
        <h1 class="title">
          你的美妆<span class="highlight">辩论</span>智囊团
        </h1>
        <p class="subtitle">输入你的肤质问题，让专业博主为你吵个高下</p>
      </div>

      <div class="search-container">
        <div class="search-box">
          <input 
            v-model="input" 
            type="text" 
            placeholder="例如：油痘肌怎么控油？最近换季总是长闭口..."
            @keyup.enter="startToKnowledge"
          />
          <button class="send-btn" @click="startToKnowledge">
            <img src="@/assets/img/icon/message/chat/send.png" alt="发送" />
          </button>
        </div>
      </div>

      <div class="hot-tags">
        <span class="tag-label">热门：</span>
        <span class="tag" @click="quickInput('祛痘印')">祛痘印</span>
        <span class="tag" @click="quickInput('大牌平替')">大牌平替</span>
        <span class="tag" @click="quickInput('敏肌维稳')">敏肌维稳</span>
      </div>

      <button class="back-btn-bottom" @click="goBack">返回</button>
    </div>

    <!-- Step 2: Knowledge -->
    <div v-if="step === 'knowledge'" class="step-container knowledge-step">
      <div v-if="isLoadingKnowledge" class="loading-state">
        <div class="loading-spinner"></div>
        <p>AI正在分析您的肌肤问题...</p>
      </div>
      
      <template v-else>
        <div class="knowledge-card">
          <div class="card-badge">原理科普</div>
          <h2>{{ currentKnowledge.title }}</h2>
          <p class="knowledge-content">{{ currentKnowledge.content }}</p>
        </div>

        <div class="misconception-card">
          <div class="warning-icon">&#9888;</div>
          <p>{{ currentKnowledge.misconception }}</p>
        </div>

        <div class="focus-section">
          <h3>二次聚焦筛选</h3>
          <div class="focus-options">
            <div class="focus-card" @click="handleFocus('A')">
              <div class="focus-title">A. 预算优先</div>
              <div class="focus-desc">200元内，高性价比选品方案</div>
            </div>
            <div class="focus-card" @click="handleFocus('B')">
              <div class="focus-title">B. 效果优先</div>
              <div class="focus-desc">成分硬核，追求极致见效速度</div>
            </div>
            <div class="focus-card" @click="handleFocus('C')">
              <div class="focus-title">C. 温和修护</div>
              <div class="focus-desc">不刺激，针对爆痘期的敏感状态</div>
            </div>
          </div>
        </div>
      </template>
    </div>

    <!-- Step 3: Matching -->
    <div v-if="step === 'matching'" class="step-container matching-step">
      <div class="matching-header">
        <h2>为您匹配了 {{ bloggers.length }} 位博主</h2>
        <p>请从中挑选 3 位进入辩论直播间</p>
        <span class="selected-count">已选 {{ selectedBloggerIds.length }}/3</span>
      </div>

      <div class="bloggers-grid">
        <div 
          v-for="blogger in bloggers" 
          :key="blogger.id"
          class="blogger-card"
          :class="{ selected: selectedBloggerIds.includes(blogger.id) }"
          @click="toggleBloggerSelection(blogger.id)"
        >
          <div class="blogger-avatar">
            <img :src="blogger.avatar" :alt="blogger.name" />
            <div v-if="selectedBloggerIds.includes(blogger.id)" class="check-mark">&#10003;</div>
          </div>
          <div class="blogger-info">
            <div class="blogger-name">{{ blogger.name }}</div>
            <div class="blogger-desc">{{ blogger.description }}</div>
            <div class="blogger-quote">{{ blogger.quote }}</div>
            <div class="blogger-tags">
              <span v-for="tag in blogger.tags" :key="tag" class="tag">{{ tag }}</span>
            </div>
          </div>
        </div>
      </div>

      <button 
        class="start-debate-btn"
        :disabled="selectedBloggerIds.length !== 3"
        @click="startDebate"
      >
        开始辩论
      </button>
    </div>

    <!-- Step 4: Debate -->
    <div v-if="step === 'debate'" class="step-container debate-step">
      <div class="debate-header">
        <div class="selected-avatars">
          <img v-for="id in selectedBloggerIds" :key="id" :src="getBloggerById(id)?.avatar" :alt="getBloggerById(id)?.name" />
        </div>
        <div class="debate-status">
          <span class="live-dot"></span>
          美妆辩论进行中...
        </div>
        <div class="round-indicator">轮次 {{ currentRoundDisplay }} / {{ totalRounds }}</div>
      </div>

      <div class="debate-messages" ref="debateMessagesRef">
        <div 
          v-for="(message, index) in displayedMessages" 
          :key="index"
          class="message"
          :class="{ 'message-right': index % 2 === 1 }"
        >
          <img :src="message.avatar" class="message-avatar" :alt="message.speaker" />
          <div class="message-content">
            <div class="message-speaker">{{ message.speaker }}</div>
            <div class="message-bubble">{{ message.content }}</div>
          </div>
        </div>
      </div>

      <button v-if="debateEnded" class="view-result-btn" @click="goToResult">
        查看最终推荐方案
      </button>
    </div>

    <!-- Step 5: Result -->
    <div v-if="step === 'result'" class="step-container result-step">
      <div class="result-header">
        <h2>为您最终决策</h2>
        <p>基于 {{ selectedBloggerIds.length }} 位博主的辩论共识</p>
      </div>

      <div v-if="recommendation" class="recommendation-card">
        <div class="product-image">
          <img :src="recommendation.primary.image" :alt="recommendation.primary.name" />
        </div>
        <div class="product-info">
          <div class="product-tags">
            <span class="tag brand">{{ recommendation.primary.brand }}</span>
            <span class="tag official">官方授权</span>
          </div>
          <h3 class="product-name">{{ recommendation.primary.name }}</h3>
          <div class="product-price">¥{{ recommendation.primary.price }}</div>
          <div class="product-reason">
            <div class="reason-title">推荐理由</div>
            <p>{{ recommendation.primary.reason }}</p>
          </div>
          <button class="buy-btn" @click="goToProduct(recommendation.primary)">
            立即前往抖音电商购买
          </button>
        </div>
      </div>

      <div v-if="recommendation?.secondary" class="secondary-section">
        <h4>备选方案</h4>
        <div class="secondary-product">
          <span class="secondary-name">{{ recommendation.secondary.name }}</span>
          <span class="secondary-diff">{{ recommendation.secondary.difference }}</span>
        </div>
      </div>

      <div v-if="recommendation?.routine" class="routine-section">
        <h4>护肤步骤</h4>
        <div class="routine-item">
          <span class="routine-label">早间:</span>
          <span class="routine-steps">{{ recommendation.routine.morning.join(' -> ') }}</span>
        </div>
        <div class="routine-item">
          <span class="routine-label">晚间:</span>
          <span class="routine-steps">{{ recommendation.routine.evening.join(' -> ') }}</span>
        </div>
      </div>

      <button class="restart-btn" @click="resetChat">重新开始咨询</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { debateLLMService, BLOGGERS, type Blogger, type DebateRound, type KnowledgeContent } from '@/agent/debate-llm-service'
import { recommendationEngine, type BeautyProduct } from '@/agent/recommendation-engine'

type Step = 'input' | 'knowledge' | 'matching' | 'debate' | 'result'
type FocusType = 'A' | 'B' | 'C'

const router = useRouter()
const debateMessagesRef = ref<HTMLElement>()

// State
const step = ref<Step>('input')
const input = ref('')
const selectedBloggerIds = ref<string[]>([])
const isDebating = ref(false)
const debateRounds = ref<DebateRound[]>([])
const currentRound = ref(0)
const recommendation = ref<any>(null)
const products = ref<BeautyProduct[]>([])
const currentKnowledge = ref<KnowledgeContent>({
  title: '',
  content: '',
  misconception: ''
})
const isLoadingKnowledge = ref(false)

// Computed
const bloggers = computed(() => BLOGGERS)

const currentRoundDisplay = computed(() => Math.ceil((currentRound.value + 1) / 3))

const totalRounds = computed(() => Math.ceil(debateRounds.value.length / 3))

const displayedMessages = computed(() => {
  return debateRounds.value.slice(0, currentRound.value + 1).map(round => ({
    speaker: round.speaker,
    content: round.content,
    avatar: getBloggerById(round.speakerId)?.avatar || ''
  }))
})

const debateEnded = computed(() => !isDebating.value && currentRound.value >= debateRounds.value.length - 1)

// Methods
const goBack = () => {
  router.back()
}

const resetChat = () => {
  step.value = 'input'
  input.value = ''
  selectedBloggerIds.value = []
  isDebating.value = false
  debateRounds.value = []
  currentRound.value = 0
  recommendation.value = null
  currentKnowledge.value = { title: '', content: '', misconception: '' }
}

const quickInput = (text: string) => {
  input.value = text
  startToKnowledge()
}

const startToKnowledge = async () => {
  if (!input.value.trim()) return
  
  isLoadingKnowledge.value = true
  step.value = 'knowledge'
  
  // 使用大模型生成知识科普
  try {
    currentKnowledge.value = await debateLLMService.generateKnowledge(input.value)
  } catch (error) {
    console.error('Failed to generate knowledge:', error)
    // 使用默认内容
    currentKnowledge.value = {
      title: '护肤知识科普',
      content: '针对您的肌肤问题，建议从清洁、保湿、修护三个维度入手，选择适合自己肤质的产品。',
      misconception: '误区：护肤品越贵越好。真相：适合自己的才是最好的。'
    }
  } finally {
    isLoadingKnowledge.value = false
  }
}

const handleFocus = (option: FocusType) => {
  step.value = 'matching'
}

const toggleBloggerSelection = (id: string) => {
  const index = selectedBloggerIds.value.indexOf(id)
  if (index > -1) {
    selectedBloggerIds.value.splice(index, 1)
  } else if (selectedBloggerIds.value.length < 3) {
    selectedBloggerIds.value.push(id)
  }
}

const getBloggerById = (id: string): Blogger | undefined => {
  return BLOGGERS.find(b => b.id === id || b.name === id)
}

const startDebate = async () => {
  step.value = 'debate'
  isDebating.value = true
  
  // 加载商品数据
  await recommendationEngine.loadProducts()
  products.value = recommendationEngine.getAllProducts()
  
  // 获取选中的博主
  const selectedBloggers = selectedBloggerIds.value.map(id => getBloggerById(id)).filter(Boolean) as Blogger[]
  
  // 生成辩论内容
  try {
    debateRounds.value = await debateLLMService.generateDebate(
      selectedBloggers,
      input.value,
      products.value
    )
    
    // 模拟辩论进行
    currentRound.value = 0
    const interval = setInterval(() => {
      if (currentRound.value < debateRounds.value.length - 1) {
        currentRound.value++
        scrollToBottom()
      } else {
        clearInterval(interval)
        isDebating.value = false
      }
    }, 2000)
  } catch (error) {
    console.error('Failed to generate debate:', error)
    isDebating.value = false
  }
}

const scrollToBottom = async () => {
  await nextTick()
  if (debateMessagesRef.value) {
    debateMessagesRef.value.scrollTop = debateMessagesRef.value.scrollHeight
  }
}

const goToResult = async () => {
  step.value = 'result'
  
  // 生成最终推荐
  const selectedBloggers = selectedBloggerIds.value.map(id => getBloggerById(id)).filter(Boolean) as Blogger[]
  
  try {
    recommendation.value = await debateLLMService.generateFinalRecommendation(
      selectedBloggers,
      input.value,
      products.value
    )
  } catch (error) {
    console.error('Failed to generate recommendation:', error)
  }
}

const goToProduct = (product: any) => {
  if (product.productId) {
    router.push(`/shop/detail?id=${product.productId}`)
  }
}
</script>

<style scoped lang="less">
.agent-debate-chat {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.step-container {
  max-width: 600px;
  margin: 0 auto;
}

// Input Step
.input-step {
  padding-top: 60px;
}

.welcome-card {
  text-align: center;
  margin-bottom: 40px;
  
  .title {
    font-size: 28px;
    font-weight: 700;
    color: white;
    margin-bottom: 12px;
    
    .highlight {
      color: #FF6B9D;
    }
  }
  
  .subtitle {
    font-size: 16px;
    color: rgba(255, 255, 255, 0.8);
  }
}

.search-container {
  margin-bottom: 24px;
}

.search-box {
  display: flex;
  background: white;
  border-radius: 30px;
  padding: 4px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  
  input {
    flex: 1;
    border: none;
    padding: 16px 20px;
    font-size: 15px;
    outline: none;
    background: transparent;
    
    &::placeholder {
      color: #999;
    }
  }
  
  .send-btn {
    width: 50px;
    height: 50px;
    background: linear-gradient(135deg, #FF6B9D, #FF8E53);
    border: none;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: transform 0.2s;
    
    &:hover {
      transform: scale(1.05);
    }
    
    img {
      width: 24px;
      height: 24px;
      filter: brightness(0) invert(1);
    }
  }
}

.hot-tags {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 40px;
  
  .tag-label {
    color: rgba(255, 255, 255, 0.7);
    font-size: 14px;
  }
  
  .tag {
    background: rgba(255, 255, 255, 0.2);
    color: white;
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 13px;
    cursor: pointer;
    transition: all 0.2s;
    
    &:hover {
      background: rgba(255, 255, 255, 0.3);
    }
  }
}

.back-btn-bottom {
  display: block;
  width: 100%;
  padding: 16px;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  border-radius: 25px;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
}

// Knowledge Step
.knowledge-step {
  padding-top: 20px;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  
  .loading-spinner {
    width: 48px;
    height: 48px;
    border: 4px solid rgba(255, 107, 157, 0.2);
    border-top-color: #FF6B9D;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 20px;
  }
  
  p {
    color: white;
    font-size: 15px;
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.knowledge-card {
  background: white;
  border-radius: 20px;
  padding: 24px;
  margin-bottom: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  
  .card-badge {
    display: inline-block;
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    padding: 6px 14px;
    border-radius: 15px;
    font-size: 12px;
    font-weight: 600;
    margin-bottom: 12px;
  }
  
  h2 {
    font-size: 20px;
    font-weight: 700;
    color: #333;
    margin-bottom: 12px;
  }
  
  .knowledge-content {
    font-size: 14px;
    color: #666;
    line-height: 1.6;
  }
}

.misconception-card {
  background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 24px;
  display: flex;
  gap: 12px;
  
  .warning-icon {
    font-size: 24px;
    flex-shrink: 0;
  }
  
  p {
    font-size: 14px;
    color: #8b4513;
    line-height: 1.5;
  }
}

.focus-section {
  h3 {
    color: white;
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 16px;
  }
}

.focus-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.focus-card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  }
  
  .focus-title {
    font-size: 16px;
    font-weight: 700;
    color: #667eea;
    margin-bottom: 4px;
  }
  
  .focus-desc {
    font-size: 13px;
    color: #666;
  }
}

// Matching Step
.matching-step {
  padding-top: 20px;
}

.matching-header {
  text-align: center;
  margin-bottom: 24px;
  position: relative;
  
  h2 {
    color: white;
    font-size: 22px;
    font-weight: 700;
    margin-bottom: 8px;
  }
  
  p {
    color: rgba(255, 255, 255, 0.8);
    font-size: 14px;
  }
  
  .selected-count {
    position: absolute;
    right: 0;
    top: 0;
    background: #FF6B9D;
    color: white;
    padding: 6px 12px;
    border-radius: 15px;
    font-size: 13px;
    font-weight: 600;
  }
}

.bloggers-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 24px;
}

.blogger-card {
  background: white;
  border-radius: 16px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.2s;
  border: 3px solid transparent;
  
  &.selected {
    border-color: #FF6B9D;
    background: linear-gradient(135deg, #fff5f8, #fff);
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  }
}

.blogger-avatar {
  position: relative;
  width: 60px;
  height: 60px;
  margin: 0 auto 12px;
  
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
  }
  
  .check-mark {
    position: absolute;
    top: -4px;
    right: -4px;
    width: 24px;
    height: 24px;
    background: #FF6B9D;
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: bold;
  }
}

.blogger-info {
  text-align: center;
  
  .blogger-name {
    font-size: 15px;
    font-weight: 700;
    color: #333;
    margin-bottom: 4px;
  }
  
  .blogger-desc {
    font-size: 12px;
    color: #999;
    margin-bottom: 8px;
  }
  
  .blogger-quote {
    font-size: 11px;
    color: #FF6B9D;
    font-style: italic;
    margin-bottom: 8px;
    line-height: 1.3;
  }
  
  .blogger-tags {
    display: flex;
    justify-content: center;
    gap: 4px;
    flex-wrap: wrap;
    
    .tag {
      font-size: 10px;
      color: #667eea;
      background: rgba(102, 126, 234, 0.1);
      padding: 2px 8px;
      border-radius: 10px;
    }
  }
}

.start-debate-btn {
  width: 100%;
  padding: 18px;
  background: linear-gradient(135deg, #FF6B9D, #FF8E53);
  color: white;
  border: none;
  border-radius: 30px;
  font-size: 17px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
  
  &:not(:disabled):hover {
    transform: scale(1.02);
    box-shadow: 0 4px 20px rgba(255, 107, 157, 0.4);
  }
}

// Debate Step
.debate-step {
  padding-top: 20px;
}

.debate-header {
  display: flex;
  align-items: center;
  gap: 12px;
  background: white;
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  
  .selected-avatars {
    display: flex;
    
    img {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      border: 2px solid white;
      margin-left: -10px;
      
      &:first-child {
        margin-left: 0;
      }
    }
  }
  
  .debate-status {
    flex: 1;
    font-size: 15px;
    font-weight: 600;
    color: #333;
    display: flex;
    align-items: center;
    gap: 8px;
    
    .live-dot {
      width: 10px;
      height: 10px;
      background: #FF4757;
      border-radius: 50%;
      animation: pulse 1.5s infinite;
    }
  }
  
  .round-indicator {
    font-size: 13px;
    color: #FF6B9D;
    font-weight: 600;
  }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.debate-messages {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 20px;
  max-height: 400px;
  overflow-y: auto;
}

.message {
  display: flex;
  gap: 12px;
  
  &.message-right {
    flex-direction: row-reverse;
    
    .message-content {
      align-items: flex-end;
      
      .message-bubble {
        background: linear-gradient(135deg, #FF6B9D, #FF8E53);
        color: white;
        border-radius: 18px 18px 4px 18px;
      }
    }
  }
  
  .message-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
    flex-shrink: 0;
  }
  
  .message-content {
    display: flex;
    flex-direction: column;
    gap: 4px;
    max-width: 75%;
    
    .message-speaker {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.7);
      font-weight: 500;
    }
    
    .message-bubble {
      background: white;
      padding: 14px 18px;
      border-radius: 18px 18px 18px 4px;
      font-size: 14px;
      line-height: 1.5;
      color: #333;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }
  }
}

.view-result-btn {
  width: 100%;
  padding: 18px;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  border: none;
  border-radius: 30px;
  font-size: 17px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    transform: scale(1.02);
    box-shadow: 0 4px 20px rgba(240, 147, 251, 0.4);
  }
}

// Result Step
.result-step {
  padding-top: 20px;
}

.result-header {
  text-align: center;
  margin-bottom: 24px;
  
  h2 {
    color: white;
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 8px;
  }
  
  p {
    color: rgba(255, 255, 255, 0.8);
    font-size: 14px;
  }
}

.recommendation-card {
  background: white;
  border-radius: 24px;
  overflow: hidden;
  margin-bottom: 20px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.15);
}

.product-image {
  width: 100%;
  height: 220px;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.product-info {
  padding: 20px;
  
  .product-tags {
    display: flex;
    gap: 8px;
    margin-bottom: 12px;
    
    .tag {
      font-size: 11px;
      padding: 4px 10px;
      border-radius: 12px;
      
      &.brand {
        background: rgba(102, 126, 234, 0.1);
        color: #667eea;
      }
      
      &.official {
        background: linear-gradient(135deg, #ffd700, #ffb700);
        color: #333;
      }
    }
  }
  
  .product-name {
    font-size: 18px;
    font-weight: 700;
    color: #333;
    margin-bottom: 8px;
    line-height: 1.3;
  }
  
  .product-price {
    font-size: 28px;
    font-weight: 800;
    color: #FF4757;
    margin-bottom: 16px;
  }
  
  .product-reason {
    background: linear-gradient(135deg, #f0f8ff, #fff);
    border-radius: 12px;
    padding: 16px;
    margin-bottom: 16px;
    
    .reason-title {
      font-size: 13px;
      font-weight: 700;
      color: #667eea;
      margin-bottom: 8px;
    }
    
    p {
      font-size: 13px;
      color: #666;
      line-height: 1.5;
    }
  }
  
  .buy-btn {
    width: 100%;
    padding: 16px;
    background: linear-gradient(135deg, #FF6B9D, #FF8E53);
    color: white;
    border: none;
    border-radius: 25px;
    font-size: 16px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s;
    
    &:hover {
      transform: scale(1.02);
      box-shadow: 0 4px 20px rgba(255, 107, 157, 0.4);
    }
  }
}

.secondary-section, .routine-section {
  background: white;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 16px;
  
  h4 {
    font-size: 15px;
    font-weight: 700;
    color: #333;
    margin-bottom: 12px;
  }
}

.secondary-product {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px;
  background: #f8f8f8;
  border-radius: 12px;
  border: 1px dashed #ddd;
  
  .secondary-name {
    font-size: 14px;
    font-weight: 600;
    color: #333;
  }
  
  .secondary-diff {
    font-size: 12px;
    color: #999;
  }
}

.routine-item {
  display: flex;
  gap: 12px;
  margin-bottom: 10px;
  
  &:last-child {
    margin-bottom: 0;
  }
  
  .routine-label {
    font-size: 13px;
    font-weight: 700;
    color: #667eea;
    flex-shrink: 0;
  }
  
  .routine-steps {
    font-size: 13px;
    color: #666;
  }
}

.restart-btn {
  width: 100%;
  padding: 16px;
  background: transparent;
  border: 2px solid rgba(255, 255, 255, 0.5);
  color: white;
  border-radius: 25px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: white;
  }
}
</style>
