import { useAgentStore } from '@/stores/agent'
import { llmApiService } from './llm-api'
import behaviorTracker from './behavior-tracker'

// 商品接口
export interface BeautyProduct {
  id: string
  name: string
  cover: string
  imgs: string[]
  price: number
  real_price: number
  isLowPrice: boolean
  discount: string
  sold: number
  brand: string
  category: string
  tags: string[]
  skinType: string[]
  description: string
}

// 推荐结果
export interface RecommendationResult {
  product: BeautyProduct
  reason: string
  confidence: number
}

// 推荐引擎
class RecommendationEngine {
  private products: BeautyProduct[] = []
  private store = useAgentStore()

  // 加载商品数据
  async loadProducts(): Promise<void> {
    try {
      const response = await fetch('/data/beauty-goods.json')
      this.products = await response.json()
    } catch (error) {
      console.error('Failed to load beauty products:', error)
      this.products = []
    }
  }

  // 获取所有商品
  getAllProducts(): BeautyProduct[] {
    return this.products
  }

  // 生成推荐
  async generateRecommendation(videoContext: string = ''): Promise<RecommendationResult | null> {
    // 确保商品数据已加载
    if (this.products.length === 0) {
      await this.loadProducts()
    }

    // 获取用户不喜欢的商品ID
    const dislikedIds = this.store.getDislikedProductIds()
    
    // 过滤掉不喜欢的商品
    const availableProducts = this.products.filter(p => !dislikedIds.includes(p.id))

    if (availableProducts.length === 0) {
      return null
    }

    // 获取用户行为摘要
    const userBehavior = behaviorTracker.getBehaviorSummary()

    // 获取用户偏好
    const preferences = this.store.beautyPreferences
    const skinType = this.store.userSkinType

    // 调用LLM API生成推荐
    const recommendation = await llmApiService.generateRecommendation({
      userBehavior,
      currentVideoContext: videoContext,
      availableProducts,
      userPreferences: {
        categories: preferences.categories,
        brands: preferences.brands,
        skinType
      }
    })

    if (!recommendation) {
      return null
    }

    // 查找对应商品
    const product = this.products.find(p => p.id === recommendation.productId)
    if (!product) {
      return null
    }

    // 记录推荐历史
    this.store.recordRecommendation(product.id, product.name, videoContext)

    return {
      product,
      reason: recommendation.reason,
      confidence: recommendation.confidence
    }
  }

  // 基于视频内容快速推荐（无需LLM）
  quickRecommendByVideo(videoTitle: string): RecommendationResult | null {
    const dislikedIds = this.store.getDislikedProductIds()
    const availableProducts = this.products.filter(p => !dislikedIds.includes(p.id))

    if (availableProducts.length === 0) {
      return null
    }

    const title = videoTitle.toLowerCase()
    
    // 根据视频标题匹配
    const scoredProducts = availableProducts.map(product => {
      let score = 0

      // 类别匹配
      if (title.includes(product.category)) {
        score += 5
      }

      // 标签匹配
      product.tags.forEach(tag => {
        if (title.includes(tag)) {
          score += 3
        }
      })

      // 品牌匹配
      if (title.includes(product.brand)) {
        score += 2
      }

      // 关键词匹配
      const keywords = ['口红', '唇釉', '粉底', '眼影', '精华', '面霜', '护肤', '彩妆']
      keywords.forEach(keyword => {
        if (title.includes(keyword) && product.name.includes(keyword)) {
          score += 2
        }
      })

      // 热销度
      score += Math.min(product.sold / 20000, 1)

      return { product, score }
    })

    // 排序并返回最佳匹配
    scoredProducts.sort((a, b) => b.score - a.score)
    const best = scoredProducts[0]

    if (best && best.score > 0) {
      return {
        product: best.product,
        reason: `根据视频"${videoTitle.substring(0, 20)}..."的内容推荐`,
        confidence: Math.min(best.score / 10, 1)
      }
    }

    // 如果没有匹配，返回热销商品
    const hotProducts = [...availableProducts].sort((a, b) => b.sold - a.sold)
    if (hotProducts.length > 0) {
      return {
        product: hotProducts[0],
        reason: '为您推荐热门美妆好物',
        confidence: 0.5
      }
    }

    return null
  }

  // 获取相关推荐（基于当前商品）
  getRelatedProducts(productId: string, limit: number = 4): BeautyProduct[] {
    const currentProduct = this.products.find(p => p.id === productId)
    if (!currentProduct) {
      return []
    }

    const dislikedIds = this.store.getDislikedProductIds()

    const scoredProducts = this.products
      .filter(p => p.id !== productId && !dislikedIds.includes(p.id))
      .map(product => {
        let score = 0

        // 同类别加分
        if (product.category === currentProduct.category) {
          score += 5
        }

        // 同品牌加分
        if (product.brand === currentProduct.brand) {
          score += 3
        }

        // 标签相似度
        const commonTags = product.tags.filter(tag => 
          currentProduct.tags.includes(tag)
        )
        score += commonTags.length * 2

        // 价格相近
        const priceDiff = Math.abs(product.real_price - currentProduct.real_price)
        if (priceDiff < 50) {
          score += 2
        }

        return { product, score }
      })

    scoredProducts.sort((a, b) => b.score - a.score)
    return scoredProducts.slice(0, limit).map(item => item.product)
  }

  // 获取个性化推荐（用于聊天场景）
  async getPersonalizedRecommendations(query: string, limit: number = 3): Promise<BeautyProduct[]> {
    const dislikedIds = this.store.getDislikedProductIds()
    const availableProducts = this.products.filter(p => !dislikedIds.includes(p.id))

    // 根据查询关键词匹配
    const query_lower = query.toLowerCase()
    const scoredProducts = availableProducts.map(product => {
      let score = 0

      // 类别匹配
      if (query_lower.includes(product.category)) {
        score += 5
      }

      // 品牌匹配
      if (query_lower.includes(product.brand.toLowerCase())) {
        score += 4
      }

      // 标签匹配
      product.tags.forEach(tag => {
        if (query_lower.includes(tag)) {
          score += 3
        }
      })

      // 肤质匹配
      product.skinType.forEach(type => {
        if (query_lower.includes(type)) {
          score += 3
        }
      })

      // 名称匹配
      if (product.name.toLowerCase().includes(query_lower)) {
        score += 2
      }

      return { product, score }
    })

    scoredProducts.sort((a, b) => b.score - a.score)
    return scoredProducts.slice(0, limit).map(item => item.product)
  }

  // 根据ID获取商品
  getProductById(id: string): BeautyProduct | undefined {
    return this.products.find(p => p.id === id)
  }

  // 按类别获取商品
  getProductsByCategory(category: string): BeautyProduct[] {
    return this.products.filter(p => p.category === category)
  }

  // 按品牌获取商品
  getProductsByBrand(brand: string): BeautyProduct[] {
    return this.products.filter(p => p.brand === brand)
  }
}

// 单例导出
export const recommendationEngine = new RecommendationEngine()
export default recommendationEngine
