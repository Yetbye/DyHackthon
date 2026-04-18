import { recommendationEngine, type BeautyProduct } from './recommendation-engine'

// 商品知识库 - 基于真实商品数据生成回答
class ProductKnowledgeBase {
  private products: BeautyProduct[] = []

  // 加载商品数据
  async loadProducts() {
    await recommendationEngine.loadProducts()
    this.products = recommendationEngine.getAllProducts()
  }

  // 获取所有商品
  getAllProducts(): BeautyProduct[] {
    return this.products
  }

  // 根据ID获取商品
  getProductById(id: string): BeautyProduct | undefined {
    return this.products.find(p => p.id === id)
  }

  // 根据类别获取商品
  getProductsByCategory(category: string): BeautyProduct[] {
    return this.products.filter(p => p.category === category)
  }

  // 根据品牌获取商品
  getProductsByBrand(brand: string): BeautyProduct[] {
    return this.products.filter(p => p.brand.includes(brand))
  }

  // 根据肤质推荐
  getProductsBySkinType(skinType: string): BeautyProduct[] {
    return this.products.filter(p => 
      p.skinType.includes(skinType) || p.skinType.includes('所有肤质')
    )
  }

  // 根据关键词搜索
  searchProducts(keyword: string): BeautyProduct[] {
    const lowerKeyword = keyword.toLowerCase()
    return this.products.filter(p => 
      p.name.toLowerCase().includes(lowerKeyword) ||
      p.brand.toLowerCase().includes(lowerKeyword) ||
      p.category.includes(lowerKeyword) ||
      p.tags.some(tag => tag.includes(keyword)) ||
      p.description.toLowerCase().includes(lowerKeyword)
    )
  }

  // 生成商品详情介绍
  generateProductIntroduction(product: BeautyProduct): string {
    const parts = [
      `【${product.brand}】${product.name}`,
      ``,
      `💰 价格：¥${product.real_price}${product.price > product.real_price ? `（原价¥${product.price}）` : ''}`,
      `🏷️ 类别：${product.category}`,
      `✨ 特点：${product.tags.join('、')}`,
      `👤 适合肤质：${product.skinType.join('、')}`,
      `📦 销量：${product.sold}件`,
      ``,
      `📝 商品介绍：${product.description}`,
      product.discount ? `\n🎁 优惠信息：${product.discount}` : ''
    ]
    return parts.filter(Boolean).join('\n')
  }

  // 生成商品对比
  generateProductComparison(products: BeautyProduct[]): string {
    if (products.length < 2) {
      return '至少需要2个商品才能对比哦~'
    }

    let comparison = '🔍 商品对比：\n\n'
    
    // 表头
    comparison += '商品名称 | 价格 | 特点\n'
    comparison += '---|---|---\n'
    
    // 对比内容
    products.slice(0, 3).forEach(p => {
      comparison += `${p.name.substring(0, 15)}... | ¥${p.real_price} | ${p.tags.slice(0, 2).join('、')}\n`
    })
    
    comparison += '\n💡 建议：\n'
    
    // 找出最便宜和最贵的
    const sortedByPrice = [...products].sort((a, b) => a.real_price - b.real_price)
    comparison += `• 性价比之选：${sortedByPrice[0].name}（¥${sortedByPrice[0].real_price}）\n`
    
    // 找出销量最高的
    const sortedBySold = [...products].sort((a, b) => b.sold - a.sold)
    comparison += `• 人气之选：${sortedBySold[0].name}（已售${sortedBySold[0].sold}件）\n`
    
    return comparison
  }

  // 根据用户问题生成基于商品的回答
  generateAnswer(userQuestion: string): { answer: string; relatedProducts: BeautyProduct[] } {
    const lowerQuestion = userQuestion.toLowerCase()
    let relatedProducts: BeautyProduct[] = []
    let answer = ''

    // 1. 询问具体商品
    const productKeywords = ['小金条', '小棕瓶', '神仙水', '粉底液', '眼影盘', '口红', '唇釉', '面霜', '精华']
    for (const keyword of productKeywords) {
      if (lowerQuestion.includes(keyword)) {
        relatedProducts = this.searchProducts(keyword)
        if (relatedProducts.length > 0) {
          const mainProduct = relatedProducts[0]
          answer = this.generateProductIntroduction(mainProduct)
          if (relatedProducts.length > 1) {
            answer += `\n\n📌 还有${relatedProducts.length - 1}款相关商品，可以告诉我你想了解哪一款~`
          }
          return { answer, relatedProducts }
        }
      }
    }

    // 2. 按类别询问
    const categoryKeywords: Record<string, string> = {
      '口红': '口红',
      '唇釉': '唇釉',
      '粉底': '粉底',
      '底妆': '粉底',
      '眼影': '眼影',
      '精华': '精华',
      '护肤': '精华',
      '面霜': '面霜',
      '乳液': '乳液',
      '洁面': '洁面',
      '洗面奶': '洁面',
      '防晒': '防晒',
      '香水': '香水',
      '腮红': '腮红',
      '散粉': '散粉',
      '定妆': '散粉',
      '眼霜': '眼霜'
    }

    for (const [keyword, category] of Object.entries(categoryKeywords)) {
      if (lowerQuestion.includes(keyword)) {
        relatedProducts = this.getProductsByCategory(category)
        if (relatedProducts.length > 0) {
          answer = `💄 ${category}推荐：\n\n`
          relatedProducts.slice(0, 3).forEach((p, index) => {
            answer += `${index + 1}. ${p.name}\n   💰 ¥${p.real_price} | ✨ ${p.tags.join('、')}\n\n`
          })
          if (relatedProducts.length > 3) {
            answer += `还有${relatedProducts.length - 3}款${category}商品，告诉我你的预算和偏好，我帮你精准推荐~`
          }
          return { answer, relatedProducts }
        }
      }
    }

    // 3. 按肤质询问
    const skinTypeKeywords: Record<string, string> = {
      '干皮': '干性',
      '油皮': '油性',
      '混合': '混合性',
      '敏感': '敏感肌',
      '痘痘': '痘痘肌'
    }

    for (const [keyword, skinType] of Object.entries(skinTypeKeywords)) {
      if (lowerQuestion.includes(keyword)) {
        relatedProducts = this.getProductsBySkinType(skinType)
        if (relatedProducts.length > 0) {
          answer = `💧 适合${skinType}的产品推荐：\n\n`
          relatedProducts.slice(0, 3).forEach((p, index) => {
            answer += `${index + 1}. ${p.name}\n   💰 ¥${p.real_price} | 🏷️ ${p.category}\n\n`
          })
          return { answer, relatedProducts }
        }
      }
    }

    // 4. 按品牌询问
    const brandKeywords = ['YSL', '圣罗兰', 'Dior', '迪奥', 'MAC', '魅可', 'SK-II', '兰蔻', '雅诗兰黛', '香奈儿', '完美日记', '花西子', '3CE']
    for (const brand of brandKeywords) {
      if (lowerQuestion.includes(brand.toLowerCase())) {
        relatedProducts = this.getProductsByBrand(brand)
        if (relatedProducts.length > 0) {
          answer = `🏷️ ${brand}品牌产品：\n\n`
          relatedProducts.forEach((p, index) => {
            answer += `${index + 1}. ${p.name} - ¥${p.real_price}\n`
          })
          return { answer, relatedProducts }
        }
      }
    }

    // 5. 推荐/求推荐
    if (lowerQuestion.includes('推荐') || lowerQuestion.includes('什么') || lowerQuestion.includes('哪个')) {
      // 热销商品
      const hotProducts = [...this.products].sort((a, b) => b.sold - a.sold).slice(0, 3)
      answer = `🔥 本店热销TOP3：\n\n`
      hotProducts.forEach((p, index) => {
        answer += `${index + 1}. ${p.name}\n   💰 ¥${p.real_price} | 📦 已售${p.sold}件 | ✨ ${p.tags.slice(0, 2).join('、')}\n\n`
      })
      answer += `告诉我你的肤质（干皮/油皮/混合皮）和预算，我帮你精准推荐！`
      relatedProducts = hotProducts
      return { answer, relatedProducts }
    }

    // 默认回复
    answer = `你好！我是你的美妆小助手💄\n\n我可以帮你：\n• 推荐适合你的美妆产品\n• 介绍具体商品详情\n• 根据肤质给出建议\n• 对比不同商品\n\n我们店里有${this.products.length}款精选美妆商品，包括口红、粉底、精华、护肤等。\n\n你想了解什么呢？可以直接问我：\n- "适合干皮的粉底液"\n- "YSL口红推荐"\n- "小棕瓶精华怎么样"`
    
    return { answer, relatedProducts }
  }

  // 生成LLM的系统提示词（基于真实商品）
  generateSystemPrompt(): string {
    const categories = [...new Set(this.products.map(p => p.category))]
    const brands = [...new Set(this.products.map(p => p.brand))]
    
    return `你是抖音美妆小助手，一个专业的美妆顾问AI。

【店铺商品信息】
本店共有${this.products.length}款精选美妆商品：
- 商品类别：${categories.join('、')}
- 品牌：${brands.join('、')}

【服务原则】
1. 所有推荐必须基于本店实际商品数据
2. 回答要专业、友好、简洁
3. 主动询问用户肤质和预算以精准推荐
4. 可以介绍商品特点、价格、适用肤质等详细信息

【推荐策略】
- 热销商品：${this.products.sort((a, b) => b.sold - a.sold).slice(0, 3).map(p => p.name).join('、')}
- 价格区间：¥${Math.min(...this.products.map(p => p.real_price))} - ¥${Math.max(...this.products.map(p => p.real_price))}

请用专业的美妆顾问口吻回答用户问题。`
  }
}

// 单例导出
export const productKnowledgeBase = new ProductKnowledgeBase()
export default productKnowledgeBase
