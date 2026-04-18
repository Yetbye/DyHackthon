<template>
  <div class="agent-debate-chat">
    <!-- Step 1: Input -->
    <div v-if="step === 'input'" class="step-container input-step">
      <header class="header">
        <div class="logo">
          <div class="logo-icon">
            <span class="sparkle">✨</span>
          </div>
          <h1>BEAUTY <span class="highlight">AI</span></h1>
        </div>
        <div class="beta-badge">BETA LIVE</div>
      </header>

      <div class="hero-section">
        <div class="tag">✨ AI 选品新方式</div>
        <h2 class="title">
          有问题？<br />
          陪你 <span class="gradient-text">辩论</span> 到底
        </h2>
        <p class="subtitle">
          不管是平替还是贵妇，不管是成分还是包装，<br />
          在这里，我们只说真话。
        </p>
      </div>

      <div class="search-wrapper">
        <div class="search-box">
          <span class="search-icon">🔍</span>
          <input 
            v-model="input" 
            type="text" 
            placeholder="今年夏天最火的防晒，真的好用吗？"
            @keyup.enter="startToKnowledge"
          />
          <button class="send-btn" @click="startToKnowledge">
            <span class="arrow">→</span>
          </button>
        </div>
      </div>

      <div class="hot-tags">
        <button 
          v-for="tag in hotTags" 
          :key="tag"
          class="tag-btn"
          @click="quickInput(tag)"
        >
          {{ tag }}
        </button>
      </div>

      <button class="back-btn" @click="goBack">返回</button>
    </div>

    <!-- Step 2: Knowledge -->
    <div v-if="step === 'knowledge'" class="step-container knowledge-step">
      <div v-if="isLoadingKnowledge" class="loading-state">
        <div class="loading-spinner"></div>
        <p>AI正在分析您的肌肤问题...</p>
      </div>
      
      <template v-else>
        <div class="knowledge-layout">
          <div class="knowledge-main">
            <div class="knowledge-card">
              <div class="card-header">
                <span class="icon">💧</span>
                <span class="label">肤质底层逻辑</span>
              </div>
              <h3>{{ currentKnowledge.title }}</h3>
              <p>{{ currentKnowledge.content }}</p>
            </div>

            <div class="misconception-card">
              <div class="warning-icon">⚡</div>
              <div class="warning-content">
                <div class="warning-label">误区提醒</div>
                <p>{{ currentKnowledge.misconception }}</p>
              </div>
            </div>
          </div>

          <div class="focus-section">
            <h4 class="focus-title">
              <span class="arrow">→</span> 二次聚焦筛选
            </h4>
            <div class="focus-options">
              <div 
                v-for="opt in focusOptions" 
                :key="opt.id"
                class="focus-card"
                @click="handleFocus(opt.id)"
              >
                <div class="focus-indicator" :class="opt.color"></div>
                <div class="focus-header">
                  <span class="option-label">Option {{ opt.id }}</span>
                  <div class="dot" :class="opt.color"></div>
                </div>
                <div class="focus-title-text">{{ opt.title }}</div>
                <div class="focus-desc">{{ opt.sub }}</div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>

    <!-- Step 3: Matching -->
    <div v-if="step === 'matching'" class="step-container matching-step">
      <div class="matching-header">
        <div class="header-text">
          <h2>为您精准匹配博主</h2>
          <p>请自主挑选 3 位进入后续辩论环节</p>
        </div>
        <div class="selected-badge">
          <span class="users-icon">👥</span>
          <span>已选 {{ selectedBloggerIds.length }} / 3</span>
        </div>
      </div>

      <div class="bloggers-grid">
        <div 
          v-for="blogger in bloggers" 
          :key="blogger.id"
          class="blogger-card"
          :class="{ selected: selectedBloggerIds.includes(blogger.id) }"
          @click="toggleBloggerSelection(blogger.id)"
        >
          <div v-if="selectedBloggerIds.includes(blogger.id)" class="check-badge">
            <span class="check">✓</span>
          </div>
          <img :src="blogger.avatar" class="blogger-avatar" :alt="blogger.name" />
          <div class="blogger-info">
            <h3>{{ blogger.name }}</h3>
            <span class="persona-tag">{{ blogger.persona }}</span>
          </div>
          <p class="blogger-quote">"{{ getShortQuote(blogger) }}"</p>
        </div>
      </div>

      <button 
        class="start-debate-btn"
        :disabled="selectedBloggerIds.length !== 3"
        @click="startDebate"
      >
        开始辩论直播
        <span class="arrow">→</span>
      </button>
    </div>

    <!-- Step 4: Debate (Livestream Style) -->
    <div v-if="step === 'debate'" class="step-container debate-step">
      <div class="livestream-container">
        <!-- Live Background -->
        <div class="live-bg"></div>
        
        <!-- Floating Hearts -->
        <div class="floating-hearts">
          <div class="heart" style="animation-delay: 0s">❤️</div>
          <div class="heart" style="animation-delay: 0.5s">💙</div>
          <div class="heart" style="animation-delay: 1s">💛</div>
        </div>

        <!-- Top Overlay -->
        <div class="top-overlay">
          <div class="host-info">
            <img :src="selectedBloggers[0]?.avatar" class="host-avatar" alt="" />
            <div class="host-text">
              <div class="host-name">{{ selectedBloggers[0]?.name }}</div>
              <div class="host-stats">
                <span>👥 12.8w 本场关注</span>
              </div>
            </div>
            <button class="follow-btn">关注</button>
          </div>
          <div class="live-badge">
            <span class="live-dot"></span>
            LIVE 辩论中
          </div>
        </div>

        <!-- Co-hosts -->
        <div class="cohosts">
          <img 
            v-for="blogger in selectedBloggers.slice(1)" 
            :key="blogger.id"
            :src="blogger.avatar" 
            class="cohost-avatar"
            :alt="blogger.name"
          />
        </div>

        <!-- Messages Feed -->
        <div class="messages-feed" ref="messagesRef">
          <div 
            v-for="(message, idx) in displayedMessages" 
            :key="idx"
            class="message"
            :class="{ 'user-message': message.isUser }"
          >
            <img :src="message.avatar" class="msg-avatar" alt="" />
            <div class="msg-bubble">
              <span class="msg-speaker">{{ message.speaker }}:</span>
              <span class="msg-content">{{ message.content }}</span>
            </div>
          </div>
        </div>

        <!-- User Input Area - 辩论结束后显示 -->
        <div v-if="debateEnded" class="user-input-area">
          <div class="input-prompt">
            <p>💬 辩论已结束！发表你的看法，或查看推荐商品</p>
          </div>
          <div class="input-box">
            <input 
              v-model="userComment"
              type="text"
              :disabled="isSubmitting"
              placeholder="说点什么，为喜欢的博主打Call..."
              @keyup.enter="submitUserComment"
            />
            <button class="send-btn" :disabled="isSubmitting" @click="submitUserComment">
              {{ isSubmitting ? '发送中...' : '发送' }}
            </button>
          </div>
          <div class="action-buttons">
            <button class="result-btn" @click="goToResult">
              查看推荐商品
            </button>
          </div>
        </div>

        <!-- Bottom Controls - 辩论进行中显示 -->
        <div v-else class="bottom-controls">
          <div class="input-hint">
            说点什么，为喜欢的博主打 Call...
          </div>
          <div class="control-btns">
            <button class="gift-btn">🎁</button>
            <button class="like-btn">❤️</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Step 5: Result -->
    <div v-if="step === 'result'" class="step-container result-step">
      <div class="result-header">
        <div class="success-badge">✓</div>
        <h2>为您挑到宝啦！</h2>
        <p>综合博主实测与辩论共识，该选品最值得入手</p>
      </div>

      <div v-if="recommendation" class="recommendation-card">
        <div class="product-showcase">
          <div class="product-image">
            <img :src="recommendation.primary.image" :alt="recommendation.primary.name" />
          </div>
        </div>
        
        <div class="product-details">
          <div class="product-tags">
            <span class="tag brand">{{ recommendation.primary.brand }}</span>
            <span class="tag official">官方授权</span>
          </div>
          <h3 class="product-name">{{ recommendation.primary.name }}</h3>
          <div class="product-price">
            ¥{{ recommendation.primary.price }}
            <span class="price-label">官方直播价</span>
          </div>
          
          <div class="consensus-box">
            <div class="consensus-label">辩论达成共识</div>
            <p>{{ recommendation.primary.reason }}</p>
          </div>

          <button class="buy-btn" @click="goToProduct(recommendation.primary)">
            立即领取福利并购买
          </button>
        </div>
      </div>

      <div v-if="recommendation?.secondary" class="secondary-section">
        <h4>备选方案</h4>
        <div class="secondary-product">
          <span class="name">{{ recommendation.secondary.name }}</span>
          <span class="diff">{{ recommendation.secondary.difference }}</span>
        </div>
      </div>

      <div v-if="recommendation?.routine" class="routine-section">
        <h4>护肤步骤</h4>
        <div class="routine-item">
          <span class="label">早间:</span>
          <span class="steps">{{ recommendation.routine.morning.join(' → ') }}</span>
        </div>
        <div class="routine-item">
          <span class="label">晚间:</span>
          <span class="steps">{{ recommendation.routine.evening.join(' → ') }}</span>
        </div>
      </div>

      <button class="restart-btn" @click="resetChat">重新开启咨询模式</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, watch } from 'vue'
import { useRouter } from 'vue-router'
import { debateLLMService, BLOGGERS, type Blogger, type DebateRound, type KnowledgeContent } from '@/agent/debate-llm-service'
import { recommendationEngine, type BeautyProduct } from '@/agent/recommendation-engine'

type Step = 'input' | 'knowledge' | 'matching' | 'debate' | 'result'
type FocusType = 'A' | 'B' | 'C'

const router = useRouter()
const messagesRef = ref<HTMLElement>()

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
const userComment = ref('')
const userComments = ref<string[]>([])

// Hot tags
const hotTags = ['200元平替', '油痘肌必看', '敏肌救星', '早C晚A']

// Focus options
const focusOptions = [
  { id: 'A', title: '预算优先', sub: '200元内，性价比最大化', color: 'emerald' },
  { id: 'B', title: '效果优先', sub: '成分硬核，快速见效', color: 'orange' },
  { id: 'C', title: '温和修护', sub: '屏障修复，温和无刺激', color: 'indigo' }
]

// Computed
const bloggers = computed(() => BLOGGERS)

const selectedBloggers = computed(() => {
  return BLOGGERS.filter(b => selectedBloggerIds.value.includes(b.id))
})

const displayedMessages = computed(() => {
  return debateRounds.value
})

const debateEnded = computed(() => {
  return !isDebating.value && debateRounds.value.length > 0
})

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
  userComment.value = ''
  userComments.value = []
  isSubmitting.value = false
}

const quickInput = (text: string) => {
  input.value = text
  startToKnowledge()
}

const startToKnowledge = async () => {
  if (!input.value.trim()) return
  
  isLoadingKnowledge.value = true
  step.value = 'knowledge'
  
  try {
    currentKnowledge.value = await debateLLMService.generateKnowledge(input.value)
  } catch (error) {
    console.error('Failed to generate knowledge:', error)
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

const getShortQuote = (blogger: Blogger) => {
  const quotes: Record<string, string> = {
    'C001': '买它！买它！',
    'C002': '从成分角度分析...',
    'C003': '底层逻辑是...',
    'C004': '你现在的问题是...',
    'C005': '真的！这个真的很好看！',
    'C006': '这是原相机效果',
    'C007': '整体会有一种很干净的感觉'
  }
  return quotes[blogger.id] || '专业推荐'
}

const startDebate = async () => {
  step.value = 'debate'
  isDebating.value = true
  debateRounds.value = []
  currentRound.value = -1
  
  await recommendationEngine.loadProducts()
  products.value = recommendationEngine.getAllProducts()
  
  const selectedBloggersList = selectedBloggers.value
  
  try {
    // 使用流式生成辩论
    for await (const round of debateLLMService.streamDebate(
      selectedBloggersList,
      input.value,
      products.value,
      userComments.value
    )) {
      // 查找是否已存在该博主的发言
      const existingIndex = debateRounds.value.findIndex(
        r => r.speakerId === round.speakerId && r.round === round.round
      )
      
      if (existingIndex >= 0) {
        // 更新现有消息
        debateRounds.value[existingIndex] = round
      } else {
        // 添加新消息
        debateRounds.value.push(round)
        currentRound.value = debateRounds.value.length - 1
      }
      
      scrollToBottom()
    }
    
    isDebating.value = false
  } catch (error) {
    console.error('Failed to generate debate:', error)
    isDebating.value = false
  }
}

const scrollToBottom = async () => {
  await nextTick()
  if (messagesRef.value) {
    messagesRef.value.scrollTop = messagesRef.value.scrollHeight
  }
}

const isSubmitting = ref(false)

const submitUserComment = async () => {
  if (!userComment.value.trim() || isSubmitting.value) return
  
  isSubmitting.value = true
  const comment = userComment.value.trim()
  userComments.value.push(comment)
  
  // 清空输入框
  userComment.value = ''
  
  // Add user message
  debateRounds.value.push({
    round: 99,
    speaker: '我',
    speakerId: 'user',
    content: comment,
    avatar: '/assets/img/avatar.png',
    isUser: true
  })
  currentRound.value++
  
  scrollToBottom()
  
  // Generate responses from bloggers - 流式，每个博主使用不同的API key
  const selectedBloggersList = selectedBloggers.value
  for (let i = 0; i < selectedBloggersList.length; i++) {
    const blogger = selectedBloggersList[i]
    await new Promise(resolve => setTimeout(resolve, 200))
    
    // 先添加占位消息
    const roundIndex = debateRounds.value.length
    debateRounds.value.push({
      round: 99,
      speaker: blogger.name,
      speakerId: blogger.id,
      content: '',
      avatar: blogger.avatar,
      isStreaming: true
    })
    currentRound.value++
    
    try {
      let fullContent = ''
      for await (const chunk of debateLLMService.streamUserResponse(
        blogger,
        comment,
        input.value,
        products.value,
        i // 传递博主索引用于选择API key
      )) {
        fullContent += chunk
        debateRounds.value[roundIndex].content = fullContent
        scrollToBottom()
      }
      debateRounds.value[roundIndex].isStreaming = false
    } catch (error) {
      console.error('Failed to generate user response:', error)
      debateRounds.value[roundIndex].content = '感谢你的分享！'
      debateRounds.value[roundIndex].isStreaming = false
    }
  }
  
  isSubmitting.value = false
}

const goToResult = async () => {
  step.value = 'result'
  
  const selectedBloggersList = selectedBloggers.value
  
  try {
    recommendation.value = await debateLLMService.generateFinalRecommendation(
      selectedBloggersList,
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

watch(displayedMessages, () => {
  scrollToBottom()
})
</script>

<style scoped lang="less">
// Variables
@primary-pink: #FF8E9E;
@primary-yellow: #FFDE59;
@bg-color: #FDF4FF;
@text-main: #2D3436;
@text-secondary: #636E72;

// Mixins
.glass-morphism {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.4);
}

.duo-button {
  box-shadow: 0 4px 0 rgba(0, 0, 0, 0.1);
  transition: all 0.1s ease;
  
  &:active {
    transform: translateY(2px);
    box-shadow: 0 2px 0 rgba(0, 0, 0, 0.1);
  }
}

// Main container
.agent-debate-chat {
  min-height: 100vh;
  background: @bg-color;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.step-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  min-height: 100vh;
}

// Input Step
.input-step {
  padding-top: 40px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 60px;
  padding-bottom: 20px;
  border-bottom: 4px solid rgba(0, 0, 0, 0.05);
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  
  .logo-icon {
    width: 40px;
    height: 40px;
    background: linear-gradient(135deg, #FF9A9E, #FAD0C4);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    transform: rotate(3deg);
    
    .sparkle {
      font-size: 20px;
    }
  }
  
  h1 {
    font-size: 20px;
    font-weight: 900;
    color: @text-main;
    
    .highlight {
      color: @primary-pink;
    }
  }
}

.beta-badge {
  background: @primary-yellow;
  color: @text-main;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 900;
  .duo-button();
}

.hero-section {
  text-align: center;
  margin-bottom: 50px;
  
  .tag {
    display: inline-block;
    background: white;
    padding: 8px 20px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 700;
    color: @primary-pink;
    border: 2px solid #FFC1CC;
    margin-bottom: 24px;
  }
  
  .title {
    font-size: 48px;
    font-weight: 900;
    color: @text-main;
    line-height: 1.2;
    margin-bottom: 20px;
    
    .gradient-text {
      color: #58CC02;
      border-bottom: 4px solid rgba(88, 204, 2, 0.2);
    }
  }
  
  .subtitle {
    font-size: 16px;
    color: @text-secondary;
    font-weight: 600;
    line-height: 1.6;
  }
}

.search-wrapper {
  max-width: 600px;
  margin: 0 auto 30px;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    inset: -8px;
    background: linear-gradient(135deg, #FF9A9E, #FEB692);
    border-radius: 36px;
    opacity: 0.2;
    filter: blur(20px);
  }
}

.search-box {
  position: relative;
  display: flex;
  align-items: center;
  background: white;
  border-radius: 28px;
  padding: 6px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border-bottom: 4px solid rgba(0, 0, 0, 0.08);
  
  .search-icon {
    font-size: 20px;
    margin-left: 20px;
    margin-right: 12px;
  }
  
  input {
    flex: 1;
    border: none;
    padding: 16px 0;
    font-size: 16px;
    font-weight: 600;
    outline: none;
    background: transparent;
    
    &::placeholder {
      color: #ccc;
    }
  }
  
  .send-btn {
    width: 50px;
    height: 50px;
    background: @primary-pink;
    border: none;
    border-radius: 50%;
    color: white;
    font-size: 20px;
    cursor: pointer;
    .duo-button();
    
    &:hover {
      transform: scale(1.05);
    }
  }
}

.hot-tags {
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 40px;
  
  .tag-btn {
    padding: 12px 24px;
    background: white;
    border: none;
    border-radius: 16px;
    font-size: 14px;
    font-weight: 700;
    color: @text-secondary;
    border-bottom: 4px solid rgba(0, 0, 0, 0.05);
    cursor: pointer;
    transition: all 0.2s;
    
    &:hover {
      background: #f8f8f8;
      border-color: rgba(0, 0, 0, 0.1);
    }
    
    &:active {
      transform: translateY(2px);
      border-bottom-width: 2px;
    }
  }
}

.back-btn {
  display: block;
  width: 100%;
  max-width: 200px;
  margin: 0 auto;
  padding: 14px;
  background: transparent;
  border: 2px solid rgba(0, 0, 0, 0.1);
  border-radius: 24px;
  font-size: 14px;
  font-weight: 600;
  color: @text-secondary;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    border-color: @text-main;
    color: @text-main;
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
  padding: 100px 20px;
  
  .loading-spinner {
    width: 50px;
    height: 50px;
    border: 4px solid rgba(255, 142, 158, 0.2);
    border-top-color: @primary-pink;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 20px;
  }
  
  p {
    color: @text-secondary;
    font-weight: 600;
  }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.knowledge-layout {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
}

.knowledge-main {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.knowledge-card {
  .glass-morphism();
  padding: 40px;
  border-radius: 28px;
  
  .card-header {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: #EBF5FF;
    padding: 8px 16px;
    border-radius: 20px;
    margin-bottom: 20px;
    
    .icon {
      font-size: 14px;
    }
    
    .label {
      font-size: 10px;
      font-weight: 800;
      color: #0066CC;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
  }
  
  h3 {
    font-size: 32px;
    font-weight: 800;
    color: @text-main;
    margin-bottom: 16px;
    line-height: 1.3;
  }
  
  p {
    font-size: 17px;
    line-height: 1.7;
    color: @text-secondary;
    font-weight: 500;
  }
}

.misconception-card {
  background: @primary-yellow;
  padding: 28px;
  border-radius: 24px;
  display: flex;
  gap: 16px;
  align-items: flex-start;
  
  .warning-icon {
    font-size: 28px;
    flex-shrink: 0;
  }
  
  .warning-content {
    .warning-label {
      font-size: 10px;
      font-weight: 900;
      color: rgba(0, 0, 0, 0.4);
      text-transform: uppercase;
      letter-spacing: 2px;
      margin-bottom: 6px;
    }
    
    p {
      font-size: 16px;
      font-weight: 700;
      color: rgba(0, 0, 0, 0.85);
      line-height: 1.5;
    }
  }
}

.focus-section {
  .focus-title {
    font-size: 12px;
    font-weight: 900;
    color: @text-secondary;
    text-transform: uppercase;
    letter-spacing: 2px;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .focus-options {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  
  .focus-card {
    .glass-morphism();
    padding: 24px;
    border-radius: 20px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: all 0.2s;
    
    &:hover {
      border-color: @primary-yellow;
      transform: translateY(-2px);
    }
    
    .focus-indicator {
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 4px;
      opacity: 0.3;
      
      &.emerald { background: #10B981; }
      &.orange { background: #F97316; }
      &.indigo { background: #6366F1; }
    }
    
    .focus-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
      
      .option-label {
        font-size: 10px;
        font-weight: 900;
        color: #999;
        text-transform: uppercase;
        letter-spacing: 1px;
      }
      
      .dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        
        &.emerald { background: #10B981; }
        &.orange { background: #F97316; }
        &.indigo { background: #6366F1; }
      }
    }
    
    .focus-title-text {
      font-size: 18px;
      font-weight: 800;
      color: @text-main;
      margin-bottom: 4px;
    }
    
    .focus-desc {
      font-size: 13px;
      color: @text-secondary;
      font-weight: 500;
    }
  }
}

// Matching Step
.matching-step {
  padding-top: 20px;
}

.matching-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
  
  .header-text {
    h2 {
      font-size: 28px;
      font-weight: 800;
      color: @text-main;
      margin-bottom: 8px;
    }
    
    p {
      font-size: 15px;
      color: @text-secondary;
      font-weight: 500;
    }
  }
  
  .selected-badge {
    display: flex;
    align-items: center;
    gap: 8px;
    background: rgba(255, 255, 255, 0.6);
    padding: 10px 20px;
    border-radius: 24px;
    font-size: 12px;
    font-weight: 800;
    color: @text-secondary;
    border: 1px solid rgba(255, 255, 255, 0.4);
    
    .users-icon {
      font-size: 14px;
    }
  }
}

.bloggers-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 40px;
}

.blogger-card {
  .glass-morphism();
  padding: 28px;
  border-radius: 24px;
  text-align: center;
  cursor: pointer;
  position: relative;
  transition: all 0.3s;
  border: 3px solid transparent;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.1);
  }
  
  &.selected {
    border-color: @primary-yellow;
    box-shadow: 0 0 0 4px rgba(255, 222, 89, 0.2);
    transform: scale(1.02);
  }
  
  .check-badge {
    position: absolute;
    top: 0;
    right: 0;
    width: 50px;
    height: 50px;
    background: @primary-yellow;
    clip-path: polygon(0 0, 100% 0, 100% 100%);
    display: flex;
    align-items: flex-start;
    justify-content: flex-end;
    padding: 8px;
    
    .check {
      font-size: 14px;
      font-weight: 900;
      color: @text-main;
    }
  }
  
  .blogger-avatar {
    width: 80px;
    height: 80px;
    border-radius: 28px;
    object-fit: cover;
    border: 4px solid white;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    margin-bottom: 16px;
  }
  
  .blogger-info {
    margin-bottom: 12px;
    
    h3 {
      font-size: 18px;
      font-weight: 800;
      color: @text-main;
      margin-bottom: 6px;
    }
    
    .persona-tag {
      display: inline-block;
      font-size: 10px;
      font-weight: 800;
      color: @primary-yellow;
      background: rgba(255, 222, 89, 0.15);
      padding: 4px 10px;
      border-radius: 6px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
  }
  
  .blogger-quote {
    font-size: 12px;
    color: @text-secondary;
    font-weight: 500;
    line-height: 1.4;
    font-style: italic;
  }
}

.start-debate-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  padding: 20px 40px;
  background: @text-main;
  color: white;
  border: none;
  border-radius: 32px;
  font-size: 18px;
  font-weight: 800;
  cursor: pointer;
  .duo-button();
  
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
    box-shadow: none;
  }
  
  &:not(:disabled):hover {
    background: #000;
  }
  
  .arrow {
    width: 32px;
    height: 32px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
  }
}

// Debate Step (Livestream)
.debate-step {
  padding: 0;
  max-width: 100%;
  min-height: auto;
}

.livestream-container {
  position: relative;
  min-height: calc(100vh - 40px);
  border-radius: 40px;
  overflow: visible;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.live-bg {
  position: absolute;
  inset: 0;
  background: 
    radial-gradient(ellipse at 20% 20%, rgba(255, 142, 158, 0.15) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 80%, rgba(255, 222, 89, 0.1) 0%, transparent 50%),
    radial-gradient(ellipse at 50% 50%, rgba(102, 126, 234, 0.08) 0%, transparent 60%),
    linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%);
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: 
      repeating-linear-gradient(
        90deg,
        transparent,
        transparent 50px,
        rgba(255, 255, 255, 0.02) 50px,
        rgba(255, 255, 255, 0.02) 51px
      );
    pointer-events: none;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: 
      radial-gradient(circle at 30% 30%, rgba(255, 142, 158, 0.08) 0%, transparent 25%),
      radial-gradient(circle at 70% 70%, rgba(255, 222, 89, 0.06) 0%, transparent 25%);
    animation: bgFloat 20s ease-in-out infinite;
    pointer-events: none;
  }
}

@keyframes bgFloat {
  0%, 100% {
    transform: translate(0, 0) rotate(0deg);
  }
  33% {
    transform: translate(2%, 2%) rotate(1deg);
  }
  66% {
    transform: translate(-1%, 1%) rotate(-1deg);
  }
}

.floating-hearts {
  position: absolute;
  right: 40px;
  bottom: 150px;
  z-index: 10;
  
  .heart {
    position: absolute;
    font-size: 24px;
    animation: float-up 2s ease-out infinite;
    opacity: 0;
  }
}

@keyframes float-up {
  0% {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
  100% {
    transform: translateY(-150px) scale(1.5);
    opacity: 0;
  }
}

.top-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  padding: 24px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  background: linear-gradient(180deg, rgba(0,0,0,0.6) 0%, transparent 100%);
  z-index: 20;
}

.host-info {
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(10px);
  padding: 8px 16px 8px 8px;
  border-radius: 40px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  
  .host-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 2px solid @primary-yellow;
  }
  
  .host-text {
    .host-name {
      color: white;
      font-size: 13px;
      font-weight: 800;
    }
    
    .host-stats {
      color: rgba(255, 255, 255, 0.6);
      font-size: 11px;
      font-weight: 600;
    }
  }
  
  .follow-btn {
    margin-left: 8px;
    padding: 6px 14px;
    background: @primary-pink;
    color: white;
    border: none;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 800;
    cursor: pointer;
  }
}

.live-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #FF0050;
  color: white;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 10px;
  font-weight: 900;
  letter-spacing: 1px;
  animation: pulse 1.5s infinite;
  
  .live-dot {
    width: 6px;
    height: 6px;
    background: white;
    border-radius: 50%;
  }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

.cohosts {
  position: absolute;
  top: 90px;
  left: 24px;
  display: flex;
  gap: 8px;
  z-index: 20;
  
  .cohost-avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: 2px solid rgba(255, 255, 255, 0.4);
  }
}

.messages-feed {
  position: absolute;
  top: 140px;
  left: 0;
  right: 0;
  bottom: 120px;
  padding: 24px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: 12px;
  z-index: 15;
}

.message {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  max-width: 85%;
  animation: slide-in 0.3s ease-out;
  
  &.user-message {
    .msg-bubble {
      background: @primary-pink;
      
      .msg-speaker {
        color: rgba(255, 255, 255, 0.8);
      }
    }
  }
}

@keyframes slide-in {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.msg-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid white;
  flex-shrink: 0;
}

.msg-bubble {
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 12px 16px;
  border-radius: 16px;
  border-top-left-radius: 4px;
  
  .msg-speaker {
    color: @primary-yellow;
    font-size: 11px;
    font-weight: 800;
    margin-right: 8px;
    text-transform: uppercase;
  }
  
  .msg-content {
    color: white;
    font-size: 14px;
    font-weight: 600;
    line-height: 1.5;
  }
}

.bottom-controls {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  background: linear-gradient(0deg, rgba(0,0,0,0.8) 0%, transparent 100%);
  z-index: 20;
  
  .input-hint {
    flex: 1;
    height: 48px;
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 24px;
    display: flex;
    align-items: center;
    padding: 0 20px;
    color: rgba(255, 255, 255, 0.5);
    font-size: 14px;
    font-weight: 600;
  }
  
  .control-btns {
    display: flex;
    gap: 12px;
    
    button {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      border: none;
      font-size: 20px;
      cursor: pointer;
      .duo-button();
    }
    
    .gift-btn {
      background: linear-gradient(135deg, #FFDE59, #FF914D);
    }
    
    .like-btn {
      background: #FF0050;
    }
  }
}

// User Input Area
.user-input-area {
  position: absolute;
  bottom: 100px;
  left: 24px;
  right: 24px;
  z-index: 30;
  
  .input-prompt {
    background: rgba(255, 142, 158, 0.9);
    padding: 12px 20px;
    border-radius: 12px;
    margin-bottom: 12px;
    
    p {
      color: white;
      font-size: 13px;
      font-weight: 600;
      text-align: center;
    }
  }
  
  .input-box {
    display: flex;
    gap: 12px;
    margin-bottom: 16px;
    
    input {
      flex: 1;
      height: 48px;
      background: rgba(255, 255, 255, 0.95);
      border: none;
      border-radius: 24px;
      padding: 0 20px;
      font-size: 14px;
      font-weight: 600;
      outline: none;
      
      &::placeholder {
        color: #999;
      }
    }
    
    .send-btn {
      padding: 0 24px;
      background: @primary-pink;
      color: white;
      border: none;
      border-radius: 24px;
      font-size: 14px;
      font-weight: 700;
      cursor: pointer;
      .duo-button();
    }
  }
  
  .action-buttons {
    display: flex;
    gap: 12px;
    
    button {
      flex: 1;
      padding: 14px;
      border-radius: 24px;
      font-size: 14px;
      font-weight: 700;
      cursor: pointer;
      border: none;
      .duo-button();
    }
    
    .continue-btn {
      background: rgba(255, 255, 255, 0.2);
      color: white;
      border: 1px solid rgba(255, 255, 255, 0.3);
    }
    
    .result-btn {
      background: @primary-yellow;
      color: @text-main;
    }
  }
}

// Debate End Overlay
.debate-end-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  
  .end-content {
    text-align: center;
    padding: 40px;
    
    .success-icon {
      width: 80px;
      height: 80px;
      background: @primary-yellow;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 40px;
      font-weight: 900;
      color: @text-main;
      margin: 0 auto 24px;
      .duo-button();
    }
    
    h3 {
      font-size: 28px;
      font-weight: 900;
      color: white;
      margin-bottom: 12px;
    }
    
    p {
      font-size: 15px;
      color: rgba(255, 255, 255, 0.7);
      font-weight: 500;
      margin-bottom: 32px;
    }
    
    .end-actions {
      display: flex;
      gap: 16px;
      justify-content: center;
      
      button {
        padding: 16px 32px;
        border-radius: 28px;
        font-size: 15px;
        font-weight: 800;
        cursor: pointer;
        border: none;
        .duo-button();
      }
      
      .comment-btn {
        background: rgba(255, 255, 255, 0.2);
        color: white;
        border: 1px solid rgba(255, 255, 255, 0.3);
      }
      
      .view-result-btn {
        background: @primary-pink;
        color: white;
      }
    }
  }
}

// Result Step
.result-step {
  padding-top: 20px;
}

.result-header {
  text-align: center;
  margin-bottom: 40px;
  
  .success-badge {
    width: 60px;
    height: 60px;
    background: #58CC02;
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 30px;
    color: white;
    margin: 0 auto 20px;
    .duo-button();
  }
  
  h2 {
    font-size: 32px;
    font-weight: 900;
    color: @text-main;
    margin-bottom: 12px;
  }
  
  p {
    font-size: 16px;
    color: @text-secondary;
    font-weight: 500;
  }
}

.recommendation-card {
  .glass-morphism();
  border-radius: 32px;
  overflow: hidden;
  margin-bottom: 24px;
  
  .product-showcase {
    height: 300px;
    background: linear-gradient(135deg, #FF9A9E, #FAD0C4);
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    
    .product-image {
      width: 200px;
      height: 200px;
      border-radius: 24px;
      overflow: hidden;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
      border: 4px solid white;
      
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
  }
  
  .product-details {
    padding: 32px;
    
    .product-tags {
      display: flex;
      gap: 8px;
      margin-bottom: 16px;
      
      .tag {
        padding: 6px 14px;
        border-radius: 20px;
        font-size: 11px;
        font-weight: 800;
        
        &.brand {
          background: rgba(102, 126, 234, 0.1);
          color: #667eea;
        }
        
        &.official {
          background: @primary-yellow;
          color: @text-main;
        }
      }
    }
    
    .product-name {
      font-size: 24px;
      font-weight: 900;
      color: @text-main;
      margin-bottom: 12px;
      line-height: 1.3;
    }
    
    .product-price {
      font-size: 36px;
      font-weight: 900;
      color: @primary-pink;
      margin-bottom: 20px;
      
      .price-label {
        font-size: 13px;
        font-weight: 600;
        color: @text-secondary;
        margin-left: 8px;
      }
    }
    
    .consensus-box {
      background: rgba(88, 204, 2, 0.1);
      border: 2px solid rgba(88, 204, 2, 0.2);
      border-radius: 20px;
      padding: 20px;
      margin-bottom: 24px;
      
      .consensus-label {
        font-size: 11px;
        font-weight: 900;
        color: #58CC02;
        text-transform: uppercase;
        letter-spacing: 1px;
        margin-bottom: 8px;
        font-style: italic;
      }
      
      p {
        font-size: 14px;
        line-height: 1.6;
        color: @text-secondary;
        font-weight: 600;
      }
    }
    
    .buy-btn {
      width: 100%;
      padding: 18px;
      background: @primary-pink;
      color: white;
      border: none;
      border-radius: 28px;
      font-size: 16px;
      font-weight: 800;
      cursor: pointer;
      .duo-button();
      
      &:hover {
        background: darken(@primary-pink, 5%);
      }
    }
  }
}

.secondary-section, .routine-section {
  .glass-morphism();
  padding: 24px;
  border-radius: 20px;
  margin-bottom: 16px;
  
  h4 {
    font-size: 14px;
    font-weight: 900;
    color: @text-main;
    margin-bottom: 16px;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
}

.secondary-product {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 16px;
  background: #f8f8f8;
  border-radius: 12px;
  border: 1px dashed #ddd;
  
  .name {
    font-size: 15px;
    font-weight: 700;
    color: @text-main;
  }
  
  .diff {
    font-size: 13px;
    color: @text-secondary;
  }
}

.routine-item {
  display: flex;
  gap: 16px;
  margin-bottom: 12px;
  
  &:last-child {
    margin-bottom: 0;
  }
  
  .label {
    font-size: 13px;
    font-weight: 900;
    color: #667eea;
    flex-shrink: 0;
  }
  
  .steps {
    font-size: 13px;
    color: @text-secondary;
    font-weight: 500;
  }
}

.restart-btn {
  display: block;
  width: 100%;
  padding: 16px;
  background: transparent;
  border: 2px solid rgba(0, 0, 0, 0.1);
  border-radius: 24px;
  font-size: 14px;
  font-weight: 700;
  color: @text-secondary;
  cursor: pointer;
  margin-top: 24px;
  transition: all 0.2s;
  
  &:hover {
    border-color: @text-main;
    color: @text-main;
  }
}

// Responsive
@media (max-width: 768px) {
  .knowledge-layout {
    grid-template-columns: 1fr;
  }
  
  .bloggers-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .hero-section .title {
    font-size: 36px;
  }
  
  .message {
    max-width: 95%;
  }
}
</style>
