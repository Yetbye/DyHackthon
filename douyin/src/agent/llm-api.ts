import { productKnowledgeBase } from './product-knowledge-base'

// LLM API 配置接口
export interface LLMConfig {
  apiUrl: string
  apiKey: string
  model: string
  temperature: number
  maxTokens: number
}

// 默认配置 - LongCat API
// 文档: https://longcat.chat/platform/docs/zh/APIDocs.html
// 端点: POST https://api.longcat.chat/openai/v1/chat/completions
const defaultConfig: LLMConfig = {
  apiUrl: 'https://api.longcat.chat/openai/v1/chat/completions',
  apiKey: 'ak_2tf2il7sp1yb4c887T7MK9U71tY1K',
  model: 'LongCat-Flash-Lite',
  temperature: 0.7,
  maxTokens: 2000
}

// 从localStorage加载配置
function loadConfig(): LLMConfig {
  const stored = localStorage.getItem('llmConfig')
  if (stored) {
    try {
      return { ...defaultConfig, ...JSON.parse(stored) }
    } catch (e) {
      console.error('Failed to load LLM config:', e)
    }
  }
  return { ...defaultConfig }
}

// 保存配置到localStorage
export function saveLLMConfig(config: Partial<LLMConfig>) {
  const current = loadConfig()
  const newConfig = { ...current, ...config }
  localStorage.setItem('llmConfig', JSON.stringify(newConfig))
}

// 获取当前配置
export function getLLMConfig(): LLMConfig {
  return loadConfig()
}

// 推荐请求接口
export interface RecommendationRequest {
  userBehavior: string
  currentVideoContext: string
  availableProducts: any[]
  userPreferences: {
    categories: string[]
    brands: string[]
    skinType: string[]
  }
}

// 推荐响应接口
export interface RecommendationResponse {
  productId: string
  reason: string
  confidence: number
}

// LLM API 服务
class LLMApiService {
  private config: LLMConfig

  constructor() {
    this.config = loadConfig()
  }

  // 更新配置
  updateConfig(config: Partial<LLMConfig>) {
    this.config = { ...this.config, ...config }
    saveLLMConfig(config)
  }

  // 检查是否已配置
  isConfigured(): boolean {
    return !!(this.config.apiUrl && this.config.apiKey)
  }

  // 生成推荐
  async generateRecommendation(request: RecommendationRequest): Promise<RecommendationResponse | null> {
    if (!this.isConfigured()) {
      console.warn('LLM API not configured, using fallback recommendation')
      return this.fallbackRecommendation(request)
    }

    try {
      const prompt = this.buildPrompt(request)
      
      const response = await fetch(this.config.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`
        },
        body: JSON.stringify({
          model: this.config.model,
          messages: [
            {
              role: 'system',
              content: '你是一个专业的美妆顾问AI助手。根据用户的行为数据和当前观看的视频内容，从提供的商品列表中选择最适合推荐给用户的美妆产品。请只返回JSON格式的推荐结果。'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: this.config.temperature,
          max_tokens: this.config.maxTokens
        })
      })

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`)
      }

      const data = await response.json()
      const content = data.choices?.[0]?.message?.content

      if (content) {
        try {
          // 尝试解析JSON响应
          const parsed = JSON.parse(content)
          return {
            productId: parsed.productId,
            reason: parsed.reason,
            confidence: parsed.confidence || 0.8
          }
        } catch (e) {
          // 如果不是JSON，尝试提取产品ID
          const match = content.match(/productId["\']?\s*[:=]\s*["\']?([^"\',}\s]+)/)
          if (match) {
            const product = request.availableProducts.find(p => p.id === match[1])
            if (product) {
              return {
                productId: product.id,
                reason: content.substring(0, 100),
                confidence: 0.7
              }
            }
          }
        }
      }

      // 如果API调用失败或解析失败，使用降级策略
      return this.fallbackRecommendation(request)
    } catch (error) {
      console.error('LLM API call failed:', error)
      return this.fallbackRecommendation(request)
    }
  }

  // 构建提示词
  private buildPrompt(request: RecommendationRequest): string {
    const { userBehavior, currentVideoContext, availableProducts, userPreferences } = request

    let prompt = `${userBehavior}\n\n`
    prompt += `当前观看视频内容：${currentVideoContext}\n\n`
    
    if (userPreferences.categories.length > 0) {
      prompt += `用户偏好品类：${userPreferences.categories.join('、')}\n`
    }
    if (userPreferences.brands.length > 0) {
      prompt += `用户偏好品牌：${userPreferences.brands.join('、')}\n`
    }
    if (userPreferences.skinType.length > 0) {
      prompt += `用户肤质：${userPreferences.skinType.join('、')}\n`
    }

    prompt += `\n可选商品列表：\n`
    availableProducts.forEach((product, index) => {
      prompt += `${index + 1}. ID: ${product.id}, 名称: ${product.name}, 品牌: ${product.brand}, 类别: ${product.category}, 价格: ¥${product.real_price}, 标签: ${product.tags?.join(', ') || '无'}\n`
    })

    prompt += `\n请从以上商品中选择最适合推荐给用户的1个产品，返回以下JSON格式：\n`
    prompt += `{"productId": "商品ID", "reason": "推荐理由（30字以内）", "confidence": 0.9}\n`
    prompt += `推荐理由要个性化，结合用户行为和当前视频内容。`

    return prompt
  }

  // 降级推荐策略（基于规则）
  private fallbackRecommendation(request: RecommendationRequest): RecommendationResponse | null {
    const { availableProducts, userPreferences, currentVideoContext } = request

    if (availableProducts.length === 0) {
      return null
    }

    // 根据用户偏好排序
    let scoredProducts = availableProducts.map(product => {
      let score = 0

      // 匹配偏好品类
      if (userPreferences.categories.includes(product.category)) {
        score += 3
      }

      // 匹配偏好品牌
      if (userPreferences.brands.includes(product.brand)) {
        score += 2
      }

      // 匹配当前视频内容
      const videoContext = currentVideoContext.toLowerCase()
      if (videoContext.includes(product.category) || 
          product.name.toLowerCase().includes(videoContext) ||
          product.tags?.some((tag: string) => videoContext.includes(tag))) {
        score += 2
      }

      // 热销商品加分
      score += Math.min(product.sold / 10000, 2)

      return { product, score }
    })

    // 按分数排序
    scoredProducts.sort((a, b) => b.score - a.score)

    const bestMatch = scoredProducts[0]
    if (bestMatch) {
      return {
        productId: bestMatch.product.id,
        reason: `根据您的浏览偏好，推荐${bestMatch.product.brand}的${bestMatch.product.category}产品`,
        confidence: Math.min(bestMatch.score / 10, 1)
      }
    }

    return null
  }

  // 聊天回复 - 基于真实商品数据
  async chatReply(message: string, context: string): Promise<{ reply: string; products: any[] }> {
    // 首先加载商品数据
    await productKnowledgeBase.loadProducts()
    
    // 使用商品知识库生成基于真实商品的回答
    const { answer, relatedProducts } = productKnowledgeBase.generateAnswer(message)
    
    // 如果有API配置，尝试使用LLM优化回答
    if (this.isConfigured()) {
      try {
        const systemPrompt = productKnowledgeBase.generateSystemPrompt()
        const response = await fetch(this.config.apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.config.apiKey}`
          },
          body: JSON.stringify({
            model: this.config.model,
            messages: [
              {
                role: 'system',
                content: systemPrompt
              },
              {
                role: 'user',
                content: `用户问题：${message}\n\n基于商品数据的参考回答：${answer}\n\n请优化这个回答，让它更自然、专业，但不要改变商品信息。如果用户询问具体商品，请详细介绍。`
              }
            ],
            temperature: this.config.temperature,
            max_tokens: this.config.maxTokens
          })
        })

        if (response.ok) {
          const data = await response.json()
          const llmReply = data.choices?.[0]?.message?.content
          if (llmReply) {
            return { reply: llmReply, products: relatedProducts }
          }
        }
      } catch (error) {
        console.error('LLM API call failed, using product-based reply:', error)
      }
    }
    
    // 使用基于商品的回答（降级策略）
    return { reply: answer, products: relatedProducts }
  }
}

// 单例导出
export const llmApiService = new LLMApiService()
export default llmApiService
