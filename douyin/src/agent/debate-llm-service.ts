import { recommendationEngine, type BeautyProduct } from './recommendation-engine'

// 博主定义
export interface Blogger {
  id: string
  name: string
  avatar: string
  style: string
  persona: string
  strength_stage: string
  character_prompt: string
}

// 辩论轮次
export interface DebateRound {
  round: number
  speaker: string
  speakerId: string
  content: string
  avatar: string
  isUser?: boolean
  isStreaming?: boolean
}

// API 配置
const API_CONFIG = {
  url: 'https://api.longcat.chat/openai/v1/chat/completions',
  model: 'LongCat-Flash-Lite',
  keys: [
    'ak_2tf2il7sp1yb4c887T7MK9U71tY1K',
    'ak_2LE5Ci53W8TP3MX7lb7AW4as6sF0G',
    'ak_2ud5LY5hR99w7Ol9az7jo1jT67S2e'
  ]
}

// 从 AgentsConfig.json 加载的博主配置
export const BLOGGERS: Blogger[] = [
  {
    id: 'C001',
    name: '李佳琦Austin',
    avatar: '/avatars/1.jpg',
    style: 'high_energy_sales',
    persona: 'seller',
    strength_stage: 'decision',
    character_prompt: '你是一位情绪非常饱满的带货主播，说话节奏很快，几乎不停顿。你会不断重复强调卖点，比如"这个颜色真的太好看了！""一定要买！真的一定要买！"。你擅长用夸张表达和对比制造冲击感，比如"这个一上嘴你整个人气色直接不一样"。你会主动替用户做决定，减少思考成本。你经常使用短句、重复句、感叹句，让情绪不断堆高。你的核心目标不是分析产品，而是快速种草、推动下单。'
  },
  {
    id: 'C002',
    name: '老爸评测',
    avatar: '/avatars/2.png',
    style: 'scientific_rational',
    persona: 'expert',
    strength_stage: 'consideration',
    character_prompt: '你是一位非常理性严谨的测评专家，说话基于数据和实验结果。你习惯用"我们测试发现…""从成分上来看…"作为开头，而不是主观感受。你会拆解产品配方、功效机制，并指出潜在风险，比如刺激性、虚假宣传等。你的语气冷静、克制，不使用感叹句，也不会情绪化表达。你更关注"是否安全""是否有效"，而不是"好不好看"。你的表达结构清晰，有结论、有依据，让人信任你的专业性。'
  },
  {
    id: 'C003',
    name: '胡楚靓',
    avatar: '/avatars/3.jpg',
    style: 'gentle_professional',
    persona: 'mentor',
    strength_stage: 'consideration',
    character_prompt: '你是一位温和且专业的美妆导师，说话节奏平稳，有耐心，像在给学生讲课。你不会用强烈情绪词，而是更习惯用总结性表达，比如"其实很多人都会有这个问题""更适合…人群""底层逻辑是…"。你擅长把零散技巧归纳成方法论，让人理解为什么，而不是只学怎么做。你的句式偏完整，经常先给结论，再解释原因。你不会轻易否定，而是用更委婉的方式表达，比如"如果这样调整，会更自然一些"。你的语言有一种稳定的信任感，让人觉得专业、可靠、可以长期跟随学习。'
  },
  {
    id: 'C004',
    name: '勇仔leo',
    avatar: '/avatars/4.jpg',
    style: 'structured_critical',
    persona: 'coach_friend',
    strength_stage: 'consideration',
    character_prompt: '你是一位逻辑很强、但有点毒舌的美妆博主，像女生身边那个很敢说实话的男闺蜜。你讲话喜欢先拆问题，再给解决方案，经常用"你现在的问题是…""先别急，你这一步就错了"这样的开头。你不会盲目夸产品，反而更习惯先指出问题，比如"这个真的不行""你这样只会更显脏更显老"。你吐槽会有点犀利，但不是为了攻击，而是为了让对方快速意识到问题。你经常用对比表达，比如"这样画 vs 那样画"，强调差别。语气是理性中带点不耐烦，但又会在结尾给出明确可执行的建议。避免使用过于温柔或情绪化的表达，你更像在纠错和改作业。'
  },
  {
    id: 'C005',
    name: '大茉莉jasmine呀',
    avatar: '/avatars/5.jpg',
    style: 'emotional_excited',
    persona: 'bestie',
    strength_stage: 'awareness',
    character_prompt: '你是一位非常容易被产品打动的美妆博主，像一个话很多、很爱分享的邻家小姐妹。你说话节奏快、语气兴奋，经常用"真的！这个真的很好看！""我最近疯狂在用这个！"这样的表达。你很擅长放大优点，会第一时间分享"好用在哪里"，甚至会有点上头，比如"我已经用空好几次了"。你不太喜欢讲复杂原理，而是更偏直觉表达，比如"上脸就是很干净很高级"。你会频繁使用感叹句、重复词和情绪词（真的、绝了、好爱）。你偶尔也会提到缺点，但不会深入分析，很快又会被优点拉回来。整体像在和闺蜜安利，而不是在做理性评测。'
  },
  {
    id: 'C006',
    name: '草莓探险家',
    avatar: '/avatars/6.jpg',
    style: 'authentic_calm',
    persona: 'real_user',
    strength_stage: 'decision',
    character_prompt: '你是一位主打真实体验的美妆博主，说话很自然，像在记录生活。你不太会刻意组织语言，经常是边用边说，比如"我最近就在用这个""这个是我刚试的"。你会强调真实感，比如"这是原相机效果，没有滤镜"。你的语气比较平淡，不会夸张种草，也不会强推产品，而是把体验如实说出来。你会讲使用感受（好不好推、服不服帖），但不会上升到复杂分析。你的表达让人感觉"她用什么我也可以试试"，重点是可信度，而不是感染力。'
  },
  {
    id: 'C007',
    name: '野生芫荽',
    avatar: '/avatars/7.jpg',
    style: 'aesthetic_calm',
    persona: 'quiet_beauty',
    strength_stage: 'awareness',
    character_prompt: '你是一位气质很淡的美妆博主，说话很轻、很慢，带一点疏离感。你不会用夸张的词，而是偏向克制表达，比如"这个颜色会让人看起来更温柔一点""整体会有一种很干净的感觉"。你更关注氛围和气质，而不是具体步骤，很少讲细节操作。你的句子通常不长，但有画面感，像在描述一种状态。你不会频繁互动或强调推荐，而是让用户自己被吸引。避免使用"必须买""真的绝了"这类强情绪词，你更像在营造一种安静但高级的审美氛围。'
  }
]

// 知识科普接口
export interface KnowledgeContent {
  title: string
  content: string
  misconception: string
}

// 辩论LLM服务
class DebateLLMService {
  // 获取博主对应的API Key（按索引分配）
  private getApiKey(bloggerIndex: number): string {
    return API_CONFIG.keys[bloggerIndex % API_CONFIG.keys.length]
  }

  // 非流式调用LLM API
  async callLLM(messages: any[], temperature = 0.8, maxTokens = 800, apiKeyIndex = 0): Promise<string> {
    const apiKey = API_CONFIG.keys[apiKeyIndex % API_CONFIG.keys.length]
    
    console.log('Calling LLM API with key index:', apiKeyIndex % API_CONFIG.keys.length)

    const response = await fetch(API_CONFIG.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: API_CONFIG.model,
        messages,
        temperature,
        max_tokens: maxTokens,
        stream: false
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('API Error:', response.status, errorText)
      throw new Error(`API error: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    return data.choices?.[0]?.message?.content || ''
  }

  // 流式调用LLM API
  async *streamLLM(messages: any[], temperature = 0.8, maxTokens = 800, apiKeyIndex = 0): AsyncGenerator<string> {
    const apiKey = API_CONFIG.keys[apiKeyIndex % API_CONFIG.keys.length]
    
    console.log('Streaming LLM API with key index:', apiKeyIndex % API_CONFIG.keys.length)

    try {
      const response = await fetch(API_CONFIG.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: API_CONFIG.model,
          messages,
          temperature,
          max_tokens: maxTokens,
          stream: true
        })
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error('No response body')
      }

      const decoder = new TextDecoder()
      let buffer = ''
      let chunkCount = 0

      while (true) {
        const { done, value } = await reader.read()
        if (done) {
          console.log('Stream completed, total chunks:', chunkCount)
          break
        }

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          const trimmedLine = line.trim()
          if (trimmedLine === '') continue
          if (trimmedLine.startsWith('data: ')) {
            const data = trimmedLine.slice(6)
            if (data === '[DONE]') {
              console.log('Stream [DONE] received')
              return
            }

            try {
              const parsed = JSON.parse(data)
              const content = parsed.choices?.[0]?.delta?.content || parsed.choices?.[0]?.text
              if (content) {
                chunkCount++
                yield content
              }
            } catch (e) {
              console.warn('Failed to parse SSE data:', data)
            }
          }
        }
      }
    } catch (error) {
      console.error('Stream error:', error)
      throw error
    }
  }

  // 生成知识科普内容
  async generateKnowledge(userQuestion: string): Promise<KnowledgeContent> {
    const messages = [
      {
        role: 'system',
        content: `你是一位专业的美妆护肤科普专家。请根据用户的肤质问题，生成专业、易懂的知识科普内容。`
      },
      {
        role: 'user',
        content: `用户问题："${userQuestion}"

请生成知识科普内容，包含：
1. 标题：简洁明了，点明主题（15字以内）
2. 原理：解释这个问题的科学原理，150字以内，专业但易懂
3. 误区：指出一个常见的护肤误区，并给出真相（80字以内）

请以JSON格式输出：
{
  "title": "科普标题",
  "content": "原理说明...",
  "misconception": "误区：...真相：..."
}`
      }
    ]

    try {
      const response = await this.callLLM(messages, 0.7, 600, 0)
      const jsonMatch = response.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0])
      }
    } catch (error) {
      console.error('Failed to generate knowledge:', error)
    }

    return this.generateFallbackKnowledge(userQuestion)
  }

  // 降级策略
  private generateFallbackKnowledge(userQuestion: string): KnowledgeContent {
    const question = userQuestion.toLowerCase()
    
    if (question.includes('油') || question.includes('痘') || question.includes('闭口')) {
      return {
        title: '油痘肌控油祛痘原理',
        content: '油痘肌的核心在于皮脂腺分泌过盛与毛孔导管角化异常。控油应不仅停留在表层吸附，更需通过抑制5α-还原酶活性来减少油脂产生，同时配合水杨酸等成分剥脱老废角质，防止毛孔堵塞形成闭口和痘痘。',
        misconception: '误区：油皮不需要补水，越控油越好。真相：过度控油会破坏皮脂膜，导致补偿性出油更严重，水油平衡才是关键。'
      }
    } else if (question.includes('干') || question.includes('起皮')) {
      return {
        title: '干皮保湿修护原理',
        content: '干皮的根源在于皮脂分泌不足和角质层水分流失过快。有效的保湿需要补充细胞间脂质（神经酰胺、胆固醇、脂肪酸），同时在皮肤表面形成封闭性保护膜减少水分蒸发，从内到外重建保湿屏障。',
        misconception: '误区：干皮需要频繁去角质才能吸收产品。真相：干皮本身角质层就薄，过度去角质会损伤屏障，导致更加干燥敏感。'
      }
    } else if (question.includes('敏') || question.includes('红') || question.includes('屏障')) {
      return {
        title: '敏感肌屏障修护原理',
        content: '敏感肌的核心是皮肤屏障功能受损，导致外界刺激物容易渗透引发炎症。修护需要补充细胞间脂质，降低神经末梢敏感度，避免使用含有刺激性成分的产品，给皮肤自我修复的时间和环境。',
        misconception: '误区：敏感肌不能用任何功效产品，只能用清水洗脸。真相：选择温和的修护型功效产品是可以的，完全不护肤会让屏障功能更难恢复。'
      }
    } else if (question.includes('抗老') || question.includes('皱纹') || question.includes('细纹')) {
      return {
        title: '抗老护肤科学原理',
        content: '皮肤衰老主要由胶原蛋白流失、弹性纤维断裂和自由基损伤导致。有效抗老需要刺激胶原蛋白生成（如A醇、胜肽），中和自由基（抗氧化剂如维C、维E），同时加强防晒防止光老化。',
        misconception: '误区：抗老产品越贵越好，年轻不需要抗老。真相：抗老关键在于成分和浓度，20岁开始预防性抗老比30岁补救更有效。'
      }
    } else if (question.includes('美白') || question.includes('提亮') || question.includes('暗沉')) {
      return {
        title: '美白提亮科学原理',
        content: '肤色暗沉和色斑形成与黑色素生成、转运和代谢有关。美白需要从抑制酪氨酸酶活性、阻断黑色素转运、加速角质代谢三个环节入手，同时做好防晒防止新的黑色素生成。',
        misconception: '误区：美白产品可以快速变白，浓度越高越好。真相：美白需要时间，高浓度产品可能刺激皮肤导致炎症性色素沉着，反而更黑。'
      }
    } else {
      return {
        title: '科学护肤基础原理',
        content: '科学护肤的核心是了解皮肤结构和需求，针对性地选择产品。基础护肤包括清洁、保湿、防晒三大步骤，在此基础上根据具体需求（控油、抗老、美白等）添加功效型产品，避免过度护肤。',
        misconception: '误区：护肤品越多越好，步骤越全越好。真相：过度护肤会加重皮肤负担，精简高效的护肤方案往往更适合。'
      }
    }
  }

  // 生成辩论内容 - 流式输出，每个博主使用不同的API key
  async *streamDebate(
    selectedBloggers: Blogger[],
    userQuestion: string,
    products: BeautyProduct[],
    userComments: string[] = []
  ): AsyncGenerator<DebateRound> {
    console.log('Starting debate stream with', selectedBloggers.length, 'bloggers')
    
    const productList = products.slice(0, 5).map(p => 
      `- ${p.name}（${p.brand}，¥${p.real_price}，${p.tags.join('、')}）`
    ).join('\n')

    // 进行2轮辩论
    for (let roundNum = 1; roundNum <= 2; roundNum++) {
      console.log(`Starting round ${roundNum}`)
      const previousPoints: string[] = []
      
      for (let bloggerIndex = 0; bloggerIndex < selectedBloggers.length; bloggerIndex++) {
        const blogger = selectedBloggers[bloggerIndex]
        console.log(`Generating for blogger: ${blogger.name} (using API key ${bloggerIndex % API_CONFIG.keys.length})`)
        
        // 先发送一个占位消息
        const round: DebateRound = {
          round: roundNum,
          speaker: blogger.name,
          speakerId: blogger.id,
          content: '',
          avatar: blogger.avatar,
          isStreaming: true
        }
        yield round

        // 生成内容，使用博主索引对应的API key
        let fullContent = ''
        try {
          for await (const chunk of this.streamDebatePoint(
            blogger,
            userQuestion,
            products,
            previousPoints,
            roundNum,
            userComments,
            bloggerIndex // 传递博主索引用于选择API key
          )) {
            fullContent += chunk
            round.content = fullContent
            yield { ...round }
          }
        } catch (error) {
          console.error(`Error streaming for ${blogger.name}:`, error)
          // 使用降级回复
          fullContent = this.generateFallbackDebatePoint(blogger, products, roundNum)
          round.content = fullContent
          yield { ...round }
        }

        round.isStreaming = false
        yield { ...round }
        
        previousPoints.push(`${blogger.name}: ${fullContent}`)
        
        // 每个博主发言后添加短暂延迟
        await new Promise(resolve => setTimeout(resolve, 300))
      }
    }
    
    console.log('Debate stream completed')
  }

  // 生成辩论观点 - 流式
  async *streamDebatePoint(
    blogger: Blogger, 
    userQuestion: string, 
    products: BeautyProduct[],
    previousPoints: string[],
    round: number,
    userComments: string[] = [],
    apiKeyIndex = 0
  ): AsyncGenerator<string> {
    const productList = products.slice(0, 5).map(p => 
      `- ${p.name}（${p.brand}，¥${p.real_price}）`
    ).join('\n')

    const previousContent = previousPoints.length > 0 
      ? `之前的观点：\n${previousPoints.join('\n')}`
      : '这是第一轮辩论，你是第一个发言。'
    
    const userCommentContent = userComments.length > 0
      ? `用户的反馈：\n${userComments.join('\n')}`
      : ''

    const roundInstructions = [
      '提出你的核心观点，推荐你认为最合适的产品，并说明理由。要体现你的人设特点。',
      '针对其他博主的观点进行反驳或补充，坚持你的专业立场，可以质疑其他博主的推荐。要有辩论的火花。'
    ]

    const messages = [
      {
        role: 'system',
        content: `${blogger.character_prompt}

【当前任务】
用户问题：${userQuestion}
这是第${round}轮辩论，${roundInstructions[round - 1]}

【可用商品】
${productList}

【辩论要求】
1. 用第一人称"我"
2. 充分展现你的人设特点和说话风格
3. 可以推荐具体商品，并说明为什么适合用户
4. 可以反驳其他博主的观点，展现辩论的火花
5. 60字以内，语言要有个人特色
6. 要有博主的真实感，不要像机器人
7. 不要重复之前说过的内容`
      },
      {
        role: 'user',
        content: `${previousContent}\n${userCommentContent}\n\n请发表你的观点：`
      }
    ]

    // 尝试流式，如果失败则使用非流式
    try {
      let hasYielded = false
      for await (const chunk of this.streamLLM(messages, 0.9, 250, apiKeyIndex)) {
        yield chunk
        hasYielded = true
      }
      
      // 如果没有输出任何内容，使用非流式备用
      if (!hasYielded) {
        console.log('Stream yielded no content, falling back to non-stream')
        const response = await this.callLLM(messages, 0.9, 250, apiKeyIndex)
        yield response.trim()
      }
    } catch (error) {
      console.error('Stream failed, using fallback:', error)
      const response = await this.callLLM(messages, 0.9, 250, apiKeyIndex)
      yield response.trim()
    }
  }

  // 降级策略
  private generateFallbackDebatePoint(blogger: Blogger, products: BeautyProduct[], round: number): string {
    const product = products[0]
    const fallbackResponses: Record<string, string[]> = {
      'C001': [
        `OMG！这个${product.name}真的绝了！姐妹们一定要买！信我！`,
        `买它！买它！${product.name}真的太好用了！我强烈推荐！`
      ],
      'C002': [
        `从成分角度分析，${product.name}的配方比较安全，没有刺激性成分。`,
        `我们测试发现，${product.name}的效果有数据支撑，可以考虑。`
      ],
      'C003': [
        `其实很多人都有这个问题，${product.name}的底层逻辑是修护屏障。`,
        `更适合敏感肌人群，${product.name}的配方思路是对的。`
      ],
      'C004': [
        `你现在的问题是盲目跟风，${product.name}虽然不错但不是最适合你的。`,
        `先别急，${product.name}这一步是对的，但还要注意使用方法。`
      ],
      'C005': [
        `真的！${product.name}真的很好看！我最近疯狂在用这个！`,
        `绝了！${product.name}上脸就是很干净很高级！好爱！`
      ],
      'C006': [
        `我最近就在用${product.name}，这是原相机效果，没有滤镜。`,
        `这个${product.name}是我刚试的，感觉还不错，挺自然的。`
      ],
      'C007': [
        `${product.name}会让人看起来更温柔一点，整体很干净。`,
        `这个${product.name}有一种很高级的感觉，适合营造氛围。`
      ]
    }

    const responses = fallbackResponses[blogger.id] || [
      `我推荐${product.name}，适合解决你的问题。`,
      `${product.name}是个不错的选择。`
    ]
    
    return responses[Math.min(round - 1, responses.length - 1)]
  }

  // 生成用户参与的回应 - 流式，使用特定API key
  async *streamUserResponse(
    blogger: Blogger,
    userComment: string,
    userQuestion: string,
    products: BeautyProduct[],
    apiKeyIndex = 0
  ): AsyncGenerator<string> {
    const productList = products.slice(0, 3).map(p => 
      `- ${p.name}（${p.brand}，¥${p.real_price}）`
    ).join('\n')

    const messages = [
      {
        role: 'system',
        content: `${blogger.character_prompt}

【当前任务】
用户问题是：${userQuestion}
可用商品：${productList}

用户刚刚发表了评论："${userComment}"

请回应用户的评论，要：
1. 体现你的人设特点
2. 回应用户的具体问题或观点
3. 可以推荐适合用户的商品
4. 50字以内`
      },
      {
        role: 'user',
        content: '请回应用户的评论：'
      }
    ]

    try {
      for await (const chunk of this.streamLLM(messages, 0.9, 200, apiKeyIndex)) {
        yield chunk
      }
    } catch (error) {
      const response = await this.callLLM(messages, 0.9, 200, apiKeyIndex)
      yield response.trim()
    }
  }

  // 生成最终推荐
  async generateFinalRecommendation(
    selectedBloggers: Blogger[],
    userQuestion: string,
    products: BeautyProduct[]
  ): Promise<{ primary: any; secondary?: any; routine: any }> {
    const productList = products.slice(0, 5).map(p => 
      `- ${p.name}（${p.brand}，¥${p.real_price}，${p.tags.join('、')}）`
    ).join('\n')

    const bloggerInfo = selectedBloggers.map(b => 
      `- ${b.name}（${b.persona}）`
    ).join('\n')

    const messages = [
      {
        role: 'system',
        content: `你是抖音美妆智囊团的总结者。基于多位博主的辩论，为用户推荐最适合的产品。

请输出JSON格式：
{
  "primary": {
    "name": "主推荐商品名称",
    "brand": "品牌",
    "price": 价格数字,
    "reason": "推荐理由（50字以内）",
    "productId": "商品ID"
  },
  "secondary": {
    "name": "备选商品名称",
    "difference": "与主推荐的区别（30字以内）"
  },
  "routine": {
    "morning": ["步骤1", "步骤2", "步骤3"],
    "evening": ["步骤1", "步骤2", "步骤3"]
  }
}`
      },
      {
        role: 'user',
        content: `用户问题："${userQuestion}"

参与辩论的博主：
${bloggerInfo}

可选商品：
${productList}

请推荐最适合用户的产品方案，输出JSON格式。`
      }
    ]

    try {
      const response = await this.callLLM(messages, 0.7, 800, 0)
      const jsonMatch = response.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const result = JSON.parse(jsonMatch[0])
        const primaryProduct = products.find(p => p.name === result.primary.name)
        if (primaryProduct) {
          result.primary.image = primaryProduct.cover
          result.primary.productId = primaryProduct.id
        }
        return result
      }
    } catch (error) {
      console.error('Failed to parse LLM response:', error)
    }

    return this.generateFallbackRecommendation(selectedBloggers, userQuestion, products)
  }

  // 降级策略
  private generateFallbackRecommendation(
    selectedBloggers: Blogger[],
    userQuestion: string,
    products: BeautyProduct[]
  ) {
    const primary = products[0]
    const secondary = products[1]
    
    const bloggerPersonas = selectedBloggers.map(b => b.persona)
    let reason = `综合${selectedBloggers.map(b => b.name).join('、')}等博主的建议，${primary.name}最适合解决您的${userQuestion}问题。`
    
    if (bloggerPersonas.includes('expert')) {
      reason += '从专业角度分析安全可靠，'
    }
    if (bloggerPersonas.includes('seller')) {
      reason += '性价比高值得入手，'
    }
    if (bloggerPersonas.includes('real_user')) {
      reason += '真实用户验证效果好。'
    }

    return {
      primary: {
        name: primary.name,
        brand: primary.brand,
        price: primary.real_price,
        reason: reason,
        image: primary.cover,
        productId: primary.id
      },
      secondary: secondary ? {
        name: secondary.name,
        difference: `更侧重${secondary.tags.join('、')}`
      } : undefined,
      routine: {
        morning: ['氨基酸洁面', '补水喷雾', '保湿乳液'],
        evening: ['卸妆', '洁面', '精华', '面霜']
      }
    }
  }
}

export const debateLLMService = new DebateLLMService()
export default debateLLMService
