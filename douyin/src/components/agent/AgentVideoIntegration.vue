<template>
  <div class="agent-video-integration">
    <AgentProductCard
      :visible="showCard"
      :product="currentProduct"
      :reason="recommendReason"
      @close="hideCard"
      @feedback="handleFeedback"
      @click="goToProduct"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import AgentProductCard from './AgentProductCard.vue'
import { useAgentStore } from '@/stores/agent'
import { recommendationEngine, type BeautyProduct, type RecommendationResult } from '@/agent/recommendation-engine'
import behaviorTracker from '@/agent/behavior-tracker'

interface Props {
  videoId: string
  videoTitle: string
  isPlaying: boolean
}

const props = defineProps<Props>()

const router = useRouter()
const store = useAgentStore()

const showCard = ref(false)
const currentProduct = ref<BeautyProduct | null>(null)
const recommendReason = ref('')
const viewStartTime = ref(0)
const cardTimer = ref<number | null>(null)

// 开始观看
const startView = () => {
  viewStartTime.value = Date.now()
  behaviorTracker.startView(props.videoId, props.videoTitle)
  
  // 3秒后显示推荐卡片
  cardTimer.value = window.setTimeout(async () => {
    await showRecommendation()
  }, 3000)
}

// 结束观看
const endView = (completed: boolean = false) => {
  if (cardTimer.value) {
    clearTimeout(cardTimer.value)
    cardTimer.value = null
  }
  
  behaviorTracker.endView(completed)
}

// 显示推荐
const showRecommendation = async () => {
  if (showCard.value) return
  
  const result = await recommendationEngine.generateRecommendation(props.videoTitle)
  
  if (result) {
    currentProduct.value = result.product
    recommendReason.value = result.reason
    showCard.value = true
    store.showCard()
    
    // 记录推荐
    store.recordRecommendation(result.product.id, result.product.name, props.videoTitle)
  }
}

// 隐藏卡片
const hideCard = () => {
  showCard.value = false
  store.hideCard()
}

// 处理反馈
const handleFeedback = (type: 'like' | 'dislike') => {
  if (currentProduct.value) {
    store.recordFeedback(
      currentProduct.value.id,
      currentProduct.value.name,
      type
    )
  }
  hideCard()
}

// 跳转到商品详情
const goToProduct = () => {
  if (currentProduct.value) {
    store.markRecommendationClicked(currentProduct.value.id)
    router.push(`/shop/detail?id=${currentProduct.value.id}`)
  }
}

// 监听播放状态
watch(() => props.isPlaying, (newVal) => {
  if (newVal) {
    startView()
  } else {
    endView()
  }
})

onMounted(() => {
  recommendationEngine.loadProducts()
  if (props.isPlaying) {
    startView()
  }
})

onUnmounted(() => {
  endView()
})
</script>

<style scoped lang="less">
.agent-video-integration {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  pointer-events: none;
  z-index: 1000;
  
  > * {
    pointer-events: auto;
  }
}
</style>
