import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// 用户行为类型
export interface ViewRecord {
  videoId: string
  videoTitle: string
  watchDuration: number
  watchTime: number
  completed: boolean
}

export interface SearchRecord {
  keyword: string
  searchTime: number
}

export interface LikeRecord {
  videoId: string
  videoTitle: string
  likeTime: number
}

export interface CollectRecord {
  videoId: string
  videoTitle: string
  collectTime: number
}

export interface CommentRecord {
  videoId: string
  videoTitle: string
  content: string
  commentTime: number
}

export interface FeedbackRecord {
  productId: string
  productName: string
  feedback: 'like' | 'dislike'
  feedbackTime: number
  reason?: string
}

// 用户画像
export interface UserProfile {
  skinType?: string[]
  preferences: {
    categories: string[]
    brands: string[]
    priceRange: 'low' | 'medium' | 'high'
  }
  concerns: string[]
  favoriteTags: string[]
}

// 推荐历史
export interface RecommendationHistory {
  productId: string
  productName: string
  recommendTime: number
  context: string
  clicked: boolean
}

// Agent状态
export const useAgentStore = defineStore('agent', () => {
  // 行为数据
  const viewHistory = ref<ViewRecord[]>([])
  const searchHistory = ref<SearchRecord[]>([])
  const likeHistory = ref<LikeRecord[]>([])
  const collectHistory = ref<CollectRecord[]>([])
  const commentHistory = ref<CommentRecord[]>([])
  const feedbackHistory = ref<FeedbackRecord[]>([])

  // 用户画像
  const userProfile = ref<UserProfile>({
    preferences: {
      categories: [],
      brands: [],
      priceRange: 'medium'
    },
    concerns: [],
    favoriteTags: []
  })

  // 推荐历史
  const recommendationHistory = ref<RecommendationHistory[]>([])

  // 当前推荐
  const currentRecommendation = ref<any>(null)
  const isShowingCard = ref(false)

  // 计算属性：获取美妆相关偏好
  const beautyPreferences = computed(() => {
    const categories = new Set<string>()
    const brands = new Set<string>()
    const tags = new Set<string>()

    // 从浏览记录提取
    viewHistory.value.forEach(record => {
      if (record.videoTitle.includes('口红')) categories.add('口红')
      if (record.videoTitle.includes('粉底')) categories.add('粉底')
      if (record.videoTitle.includes('护肤')) categories.add('护肤')
      if (record.videoTitle.includes('眼影')) categories.add('眼影')
      if (record.videoTitle.includes('精华')) categories.add('精华')
      if (record.videoTitle.includes('面霜')) categories.add('面霜')
    })

    // 从搜索记录提取
    searchHistory.value.forEach(record => {
      const keyword = record.keyword.toLowerCase()
      if (keyword.includes('ysl') || keyword.includes('圣罗兰')) brands.add('YSL圣罗兰')
      if (keyword.includes('dior') || keyword.includes('迪奥')) brands.add('Dior迪奥')
      if (keyword.includes('mac') || keyword.includes('魅可')) brands.add('MAC魅可')
      if (keyword.includes('chanel') || keyword.includes('香奈儿')) brands.add('Chanel香奈儿')
      if (keyword.includes('sk2') || keyword.includes('sk-ii')) brands.add('SK-II')
      if (keyword.includes('lancome') || keyword.includes('兰蔻')) brands.add('Lancome兰蔻')
    })

    return {
      categories: Array.from(categories),
      brands: Array.from(brands),
      tags: Array.from(tags)
    }
  })

  // 计算属性：获取用户肤质
  const userSkinType = computed(() => {
    const concerns = new Set<string>()
    
    searchHistory.value.forEach(record => {
      const keyword = record.keyword
      if (keyword.includes('干皮')) concerns.add('干性')
      if (keyword.includes('油皮')) concerns.add('油性')
      if (keyword.includes('混合')) concerns.add('混合性')
      if (keyword.includes('敏感')) concerns.add('敏感肌')
      if (keyword.includes('痘痘')) concerns.add('痘痘肌')
    })

    return Array.from(concerns)
  })

  // 记录浏览行为
  function recordView(videoId: string, videoTitle: string, watchDuration: number, completed: boolean = false) {
    viewHistory.value.push({
      videoId,
      videoTitle,
      watchDuration,
      watchTime: Date.now(),
      completed
    })
    saveToStorage()
  }

  // 记录搜索行为
  function recordSearch(keyword: string) {
    searchHistory.value.push({
      keyword,
      searchTime: Date.now()
    })
    saveToStorage()
  }

  // 记录点赞行为
  function recordLike(videoId: string, videoTitle: string) {
    likeHistory.value.push({
      videoId,
      videoTitle,
      likeTime: Date.now()
    })
    saveToStorage()
  }

  // 记录收藏行为
  function recordCollect(videoId: string, videoTitle: string) {
    collectHistory.value.push({
      videoId,
      videoTitle,
      collectTime: Date.now()
    })
    saveToStorage()
  }

  // 记录评论行为
  function recordComment(videoId: string, videoTitle: string, content: string) {
    commentHistory.value.push({
      videoId,
      videoTitle,
      content,
      commentTime: Date.now()
    })
    saveToStorage()
  }

  // 记录反馈
  function recordFeedback(productId: string, productName: string, feedback: 'like' | 'dislike', reason?: string) {
    feedbackHistory.value.push({
      productId,
      productName,
      feedback,
      feedbackTime: Date.now(),
      reason
    })
    saveToStorage()
  }

  // 记录推荐历史
  function recordRecommendation(productId: string, productName: string, context: string) {
    recommendationHistory.value.push({
      productId,
      productName,
      recommendTime: Date.now(),
      context,
      clicked: false
    })
    saveToStorage()
  }

  // 标记推荐已点击
  function markRecommendationClicked(productId: string) {
    const rec = recommendationHistory.value.find(r => r.productId === productId)
    if (rec) {
      rec.clicked = true
      saveToStorage()
    }
  }

  // 设置当前推荐
  function setCurrentRecommendation(product: any) {
    currentRecommendation.value = product
  }

  // 显示/隐藏卡片
  function showCard() {
    isShowingCard.value = true
  }

  function hideCard() {
    isShowingCard.value = false
  }

  // 获取不推荐商品列表（用户点过dislike的）
  function getDislikedProductIds(): string[] {
    return feedbackHistory.value
      .filter(f => f.feedback === 'dislike')
      .map(f => f.productId)
  }

  // 保存到localStorage
  function saveToStorage() {
    const data = {
      viewHistory: viewHistory.value,
      searchHistory: searchHistory.value,
      likeHistory: likeHistory.value,
      collectHistory: collectHistory.value,
      commentHistory: commentHistory.value,
      feedbackHistory: feedbackHistory.value,
      userProfile: userProfile.value,
      recommendationHistory: recommendationHistory.value
    }
    localStorage.setItem('beautyAgentData', JSON.stringify(data))
  }

  // 从localStorage加载
  function loadFromStorage() {
    const stored = localStorage.getItem('beautyAgentData')
    if (stored) {
      try {
        const data = JSON.parse(stored)
        viewHistory.value = data.viewHistory || []
        searchHistory.value = data.searchHistory || []
        likeHistory.value = data.likeHistory || []
        collectHistory.value = data.collectHistory || []
        commentHistory.value = data.commentHistory || []
        feedbackHistory.value = data.feedbackHistory || []
        userProfile.value = data.userProfile || {
          preferences: { categories: [], brands: [], priceRange: 'medium' },
          concerns: [],
          favoriteTags: []
        }
        recommendationHistory.value = data.recommendationHistory || []
      } catch (e) {
        console.error('Failed to load agent data:', e)
      }
    }
  }

  // 清空所有数据
  function clearAllData() {
    viewHistory.value = []
    searchHistory.value = []
    likeHistory.value = []
    collectHistory.value = []
    commentHistory.value = []
    feedbackHistory.value = []
    recommendationHistory.value = []
    userProfile.value = {
      preferences: { categories: [], brands: [], priceRange: 'medium' },
      concerns: [],
      favoriteTags: []
    }
    localStorage.removeItem('beautyAgentData')
  }

  // 初始化时加载数据
  loadFromStorage()

  return {
    viewHistory,
    searchHistory,
    likeHistory,
    collectHistory,
    commentHistory,
    feedbackHistory,
    userProfile,
    recommendationHistory,
    currentRecommendation,
    isShowingCard,
    beautyPreferences,
    userSkinType,
    recordView,
    recordSearch,
    recordLike,
    recordCollect,
    recordComment,
    recordFeedback,
    recordRecommendation,
    markRecommendationClicked,
    setCurrentRecommendation,
    showCard,
    hideCard,
    getDislikedProductIds,
    saveToStorage,
    loadFromStorage,
    clearAllData
  }
})
