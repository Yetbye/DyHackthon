<template>
  <Transition name="slide-up">
    <div v-if="visible" class="agent-product-card" @click="handleCardClick">
      <div class="card-header">
        <div class="agent-avatar">
          <img src="@/assets/img/avatar.png" alt="AI Agent" />
          <div class="agent-badge">AI</div>
        </div>
        <div class="agent-info">
          <div class="agent-name">美妆小助手</div>
          <div class="recommend-text">{{ recommendText }}</div>
        </div>
        <div class="close-btn" @click.stop="handleClose">
          <img src="@/assets/img/icon/close-white.png" alt="关闭" />
        </div>
      </div>
      
      <div class="card-body">
        <div class="product-image">
          <img :src="getProductImage(product.cover)" :alt="product.name" />
          <div v-if="product.isLowPrice" class="discount-badge">特惠</div>
        </div>
        <div class="product-info">
          <div class="product-brand">{{ product.brand }}</div>
          <div class="product-name">{{ product.name }}</div>
          <div class="product-tags">
            <span v-for="tag in product.tags.slice(0, 2)" :key="tag" class="tag">{{ tag }}</span>
          </div>
          <div class="product-price">
            <span class="real-price">¥{{ product.real_price }}</span>
            <span v-if="product.price > product.real_price" class="original-price">¥{{ product.price }}</span>
            <span class="sold">{{ formatSold(product.sold) }}人付款</span>
          </div>
        </div>
      </div>
      
      <div class="card-footer">
        <div class="feedback-text">这个推荐符合您的喜好吗？</div>
        <div class="feedback-buttons">
          <button class="feedback-btn like" @click.stop="handleFeedback('like')">
            <img src="@/assets/img/icon/love.svg" alt="喜欢" />
            <span>喜欢</span>
          </button>
          <button class="feedback-btn dislike" @click.stop="handleFeedback('dislike')">
            <img src="@/assets/img/icon/dislike.svg" alt="不喜欢" />
            <span>不喜欢</span>
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { BeautyProduct } from '@/agent/recommendation-engine'

interface Props {
  visible: boolean
  product: BeautyProduct
  reason?: string
}

const props = withDefaults(defineProps<Props>(), {
  reason: ''
})

const emit = defineEmits<{
  close: []
  feedback: [type: 'like' | 'dislike']
  click: []
}>()

const recommendText = computed(() => {
  if (props.reason) {
    return props.reason
  }
  return '猜你喜欢'
})

const getProductImage = (cover: string) => {
  // 如果是完整URL直接使用，否则添加前缀
  if (cover.startsWith('http')) {
    return cover
  }
  return `/images/goods/${cover}`
}

const formatSold = (sold: number) => {
  if (sold >= 10000) {
    return (sold / 10000).toFixed(1) + '万'
  }
  return sold.toString()
}

const handleClose = () => {
  emit('close')
}

const handleFeedback = (type: 'like' | 'dislike') => {
  emit('feedback', type)
  emit('close')
}

const handleCardClick = () => {
  emit('click')
}
</script>

<style scoped lang="less">
.agent-product-card {
  position: fixed;
  bottom: 120px;
  left: 16px;
  right: 16px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 245, 250, 0.95) 100%);
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15), 0 2px 8px rgba(255, 105, 180, 0.1);
  backdrop-filter: blur(10px);
  z-index: 1000;
  border: 1px solid rgba(255, 182, 193, 0.3);
}

.card-header {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.agent-avatar {
  position: relative;
  width: 40px;
  height: 40px;
  margin-right: 12px;
  
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid #ff69b4;
  }
  
  .agent-badge {
    position: absolute;
    bottom: -2px;
    right: -2px;
    background: linear-gradient(135deg, #ff69b4, #ff1493);
    color: white;
    font-size: 10px;
    padding: 2px 6px;
    border-radius: 10px;
    font-weight: bold;
  }
}

.agent-info {
  flex: 1;
}

.agent-name {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 2px;
}

.recommend-text {
  font-size: 12px;
  color: #ff69b4;
}

.close-btn {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0.6;
  transition: opacity 0.2s;
  
  &:hover {
    opacity: 1;
  }
  
  img {
    width: 16px;
    height: 16px;
  }
}

.card-body {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
}

.product-image {
  position: relative;
  width: 100px;
  height: 100px;
  border-radius: 12px;
  overflow: hidden;
  flex-shrink: 0;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .discount-badge {
    position: absolute;
    top: 8px;
    left: 8px;
    background: linear-gradient(135deg, #ff4757, #ff6348);
    color: white;
    font-size: 10px;
    padding: 4px 8px;
    border-radius: 12px;
    font-weight: 600;
  }
}

.product-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.product-brand {
  font-size: 12px;
  color: #ff69b4;
  font-weight: 500;
  margin-bottom: 4px;
}

.product-name {
  font-size: 14px;
  color: #333;
  font-weight: 600;
  line-height: 1.4;
  margin-bottom: 8px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-tags {
  display: flex;
  gap: 6px;
  margin-bottom: 8px;
  
  .tag {
    font-size: 10px;
    color: #666;
    background: rgba(255, 105, 180, 0.1);
    padding: 2px 8px;
    border-radius: 10px;
  }
}

.product-price {
  display: flex;
  align-items: baseline;
  gap: 8px;
  
  .real-price {
    font-size: 18px;
    font-weight: 700;
    color: #ff4757;
  }
  
  .original-price {
    font-size: 12px;
    color: #999;
    text-decoration: line-through;
  }
  
  .sold {
    font-size: 11px;
    color: #999;
    margin-left: auto;
  }
}

.card-footer {
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  padding-top: 12px;
}

.feedback-text {
  font-size: 12px;
  color: #666;
  text-align: center;
  margin-bottom: 10px;
}

.feedback-buttons {
  display: flex;
  gap: 12px;
}

.feedback-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px 16px;
  border-radius: 20px;
  border: none;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  img {
    width: 16px;
    height: 16px;
  }
  
  &.like {
    background: linear-gradient(135deg, #ff69b4, #ff1493);
    color: white;
    
    &:hover {
      transform: scale(1.02);
      box-shadow: 0 4px 12px rgba(255, 105, 180, 0.3);
    }
  }
  
  &.dislike {
    background: rgba(0, 0, 0, 0.05);
    color: #666;
    
    &:hover {
      background: rgba(0, 0, 0, 0.1);
    }
  }
}

// 动画
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(100%);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translateY(100%);
}
</style>
