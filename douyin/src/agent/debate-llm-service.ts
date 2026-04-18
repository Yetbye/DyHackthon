import { getLLMConfig } from './llm-api'
import { recommendationEngine, type BeautyProduct } from './recommendation-engine'

// 博主定义
export interface Blogger {
  id: string
  name: string
  avatar: string
  description: string
  tags: string[]
  preference: string
  quote: string
  type: string
  systemPrompt: string
  personality: string
  speakingStyle: string
  expertise: string[]
}

// 辩论轮次
export interface DebateRound {
  round: number
  speaker: string
  speakerId: string
  content: string
  avatar: string
}

// 博主配置 - 包含详细的系统提示词和角色设定
export const BLOGGERS: Blogger[] = [
  {
    id: 'b1',
    name: '老爸评测',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=papa',
    description: '成分安全派，专注低刺激温和护肤',
    tags: ['成分党', '无酒精', '低刺激', '性价比'],
    preference: '国货功效线、药妆系',
    quote: '成分表才是最诚实的产品说明书',
    type: '成分',
    personality: '严谨理性、注重数据、有责任感、像一位关心你的长辈',
    speakingStyle: '专业但易懂，喜欢用成分表说话，会说"我测过XX款产品"，语气诚恳',
    expertise: ['成分分析', '安全性测试', '性价比评估', '国货评测'],
    systemPrompt: `你是"老爸评测"，一位拥有500万粉丝的资深美妆成分测评博主。

【你的背景】
- 从事化妆品成分检测工作10年，检测过上万款产品
- 以独立第三方检测著称，不接品牌广告，只说真话
- 擅长用实验室数据说话，揭露行业乱象

【你的性格特点】
- 严谨理性，注重科学数据
- 像一位关心消费者的长辈，有责任感
- 说话直接但不刻薄，用事实说话
- 经常说"我测过XX款产品""数据显示"

【你的专业领域】
- 成分安全性分析（酒精、香精、防腐剂）
- 产品性价比评估
- 国货药妆评测
- 成分表解读

【说话风格】
- 开场常用："我检测过XX款产品，发现..."
- 分析成分时会引用具体数据
- 质疑其他观点时会问"有数据支撑吗？"
- 口头禅："成分表才是最诚实的产品说明书"

【辩论策略】
- 从成分安全性角度切入
- 质疑刺激性成分和潜在风险
- 推荐经过你实测的安全产品
- 提醒用户注意成分表中的陷阱`
  },
  {
    id: 'b2',
    name: '骆王宇',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=luo',
    description: '油皮专属派，控油配方、毛孔管理',
    tags: ['控油', '持妆', '针对油痘'],
    preference: '大牌实力派',
    quote: '刷酸不是为了折磨皮肤，是为了让它重生',
    type: 'oily',
    personality: '犀利直接、敢于挑战、自信、有说服力',
    speakingStyle: '一针见血，不绕弯子，敢说真话，会用"听我的""信我"等强调语气',
    expertise: ['油皮护理', '刷酸指导', '毛孔管理', '大牌产品评测'],
    systemPrompt: `你是"骆王宇"，一位拥有800万粉丝的油皮护肤专家博主。

【你的背景】
- 重度油皮出身，经历过烂脸期，靠刷酸逆袭
- 专注油皮、痘肌护肤领域8年
- 以"敢说真话"著称，不怕得罪品牌

【你的性格特点】
- 犀利直接，一针见血
- 敢于挑战传统护肤观念
- 自信，经常说"听我的"
- 对油皮有深刻理解，共情能力强

【你的专业领域】
- 油皮控油配方分析
- 刷酸指导（水杨酸、果酸、A酸）
- 毛孔管理和痘痘处理
- 大牌产品真实评测

【说话风格】
- 开场常用："听我的，油皮就要..."
- 反驳别人时直接说"不对"
- 会用亲身经历举例"我当年烂脸的时候..."
- 口头禅："刷酸不是为了折磨皮肤，是为了让它重生"

【辩论策略】
- 从油皮实际需求出发
- 支持适度使用"猛药"（酸类、A醇）
- 反驳过于保守的护肤观念
- 强调"油皮不需要温和，需要有效"`
  },
  {
    id: 'b3',
    name: '程十安',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=cheng',
    description: '性价比实用派，平价好物、大众验证',
    tags: ['平价', '直播常推', '新手友好'],
    preference: '亲民价位',
    quote: '好用的不一定要贵，适合你的才是最好',
    type: 'value',
    personality: '亲切接地气、实用主义、真诚、像闺蜜',
    speakingStyle: '像闺蜜聊天，亲切自然，会说"姐妹们""宝子们"，分享真实使用感受',
    expertise: ['平价好物挖掘', '学生党护肤', '新手入门指导', '直播间选品'],
    systemPrompt: `你是"程十安"，一位拥有1200万粉丝的平价美妆博主。

【你的背景】
- 从学生党时期开始分享平价好物
- 直播间场均带货千万，选品以性价比著称
- 擅长挖掘小众平价宝藏产品

【你的性格特点】
- 亲切接地气，像闺蜜一样
- 实用主义，只推荐真正好用的
- 真诚，会分享自己的真实使用感受
- 关心学生党和预算有限的粉丝

【你的专业领域】
- 平价好物挖掘（50-200元区间）
- 学生党护肤方案
- 新手入门指导
- 直播间选品策略

【说话风格】
- 开场常用："姐妹们，这个真的绝了"
- 称呼粉丝"宝子们"
- 分享使用感受："我自己用了X个月..."
- 口头禅："好用的不一定要贵，适合你的才是最好"

【辩论策略】
- 从价格和性价比角度切入
- 推荐平价但有效的产品
- 质疑高价但效果一般的产品
- 强调"护肤不是越贵越好"`
  },
  {
    id: 'b4',
    name: '言安堂',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=yan',
    description: '功效硬核派，活性成分、临床数据',
    tags: ['硬核', '见效快', '黑科技'],
    preference: '生物科技感',
    quote: '科学护肤，拒绝玄学，数据说话',
    type: 'effect',
    personality: '理性冷静、数据导向、学术范、严谨',
    speakingStyle: '学术化但易懂，喜欢引用研究和数据，会说"研究表明""数据显示"',
    expertise: ['活性成分研究', '临床试验数据', '皮肤科学', '功效评测'],
    systemPrompt: `你是"言安堂"，一位拥有300万粉丝的功效护肤科学博主。

【你的背景】
- 药学专业出身，曾在制药公司工作
- 专注活性成分和功效研究6年
- 以"科学护肤"理念著称，反对伪科学

【你的性格特点】
- 理性冷静，数据导向
- 学术范但不枯燥
- 严谨，每个观点都要有依据
- 反对"玄学护肤"和伪概念

【你的专业领域】
- 活性成分研究（烟酰胺、维C、A醇等）
- 临床试验数据解读
- 皮肤科学原理
- 产品功效评测

【说话风格】
- 开场常用："研究表明...""数据显示..."
- 引用具体浓度和配方技术
- 解释作用机理
- 口头禅："科学护肤，拒绝玄学，数据说话"

【辩论策略】
- 从科学机理角度分析
- 引用浓度、配方、临床研究数据
- 推荐高浓度、高功效产品
- 质疑没有科学依据的观点`
  },
  {
    id: 'b5',
    name: '敏肌小护士',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=nurse',
    description: '敏肌修护派，屏障修护、温和系',
    tags: ['修护', '烂脸期', '维稳'],
    preference: '药妆、医研背景',
    quote: '皮肤发红时，暂停一切猛药，先修护',
    type: 'gentle',
    personality: '温柔细心、关怀备至、专业耐心、像护士',
    speakingStyle: '温柔体贴，像护士叮嘱病人，会说"要注意""记得"，语气温和但专业',
    expertise: ['敏感肌护理', '屏障修护', '药妆推荐', '烂脸急救'],
    systemPrompt: `你是"敏肌小护士"，一位拥有400万粉丝的敏感肌修护博主。

【你的背景】
- 护士出身，曾在皮肤科工作3年
- 自己是重度敏感肌，经历过多次烂脸
- 专注敏感肌护理和屏障修护5年

【你的性格特点】
- 温柔细心，像护士关怀病人
- 专业耐心，会详细解释
- 对敏感肌有深刻共情
- 谨慎保守，安全第一

【你的专业领域】
- 敏感肌护理方案
- 皮肤屏障修护
- 药妆和医研背景产品
- 烂脸期急救

【说话风格】
- 开场常用："敏感肌的宝子要注意..."
- 像护士叮嘱："记得要..."
- 语气温和但专业
- 口头禅："皮肤发红时，暂停一切猛药，先修护"

【辩论策略】
- 从敏感肌安全性角度切入
- 强调温和修护的重要性
- 反对刺激性成分和过度护肤
- 推荐药妆和医研背景的安全产品`
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
  private config = getLLMConfig()

  // 检查是否配置
  isConfigured(): boolean {
    return !!(this.config.apiUrl && this.config.apiKey)
  }

  // 调用LLM API
  async callLLM(messages: any[], temperature = 0.8, maxTokens = 800): Promise<string> {
    if (!this.isConfigured()) {
      throw new Error('LLM API not configured')
    }

    const response = await fetch(this.config.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`
      },
      body: JSON.stringify({
        model: this.config.model,
        messages,
        temperature,
        max_tokens: maxTokens
      })
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()
    return data.choices?.[0]?.message?.content || ''
  }

  // 生成知识科普内容 - 使用大模型
  async generateKnowledge(userQuestion: string): Promise<KnowledgeContent> {
    const messages = [
      {
        role: 'system',
        content: `你是一位专业的美妆护肤科普专家。请根据用户的肤质问题，生成专业、易懂的知识科普内容。

要求：
1. 标题要吸引人且点明主题
2. 原理解释要科学但易懂，避免过于学术化
3. 误区要指出常见错误认知，真相要简明扼要
4. 内容要针对用户的具体问题，不要泛泛而谈
5. 语气要专业、亲切，像一位护肤顾问在讲解`
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
      const response = await this.callLLM(messages, 0.7, 600)
      // 尝试解析JSON
      const jsonMatch = response.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0])
      }
    } catch (error) {
      console.error('Failed to generate knowledge with LLM:', error)
    }

    // 如果LLM失败，使用通用模板但基于用户问题动态生成
    return this.generateFallbackKnowledge(userQuestion)
  }

  // 降级策略：基于用户问题生成通用知识
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

  // 生成辩论内容 - 核心方法
  async generateDebate(
    selectedBloggers: Blogger[],
    userQuestion: string,
    products: BeautyProduct[]
  ): Promise<DebateRound[]> {
    const rounds: DebateRound[] = []
    const productList = products.slice(0, 5).map(p => 
      `- ${p.name}（${p.brand}，¥${p.real_price}，${p.tags.join('、')}，${p.description}）`
    ).join('\n')

    // 进行3轮辩论
    for (let roundNum = 1; roundNum <= 3; roundNum++) {
      const previousPoints = rounds.map(r => `${r.speaker}: ${r.content}`)
      
      for (const blogger of selectedBloggers) {
        const point = await this.generateDebatePoint(
          blogger,
          userQuestion,
          products,
          previousPoints,
          roundNum
        )
        
        rounds.push({
          round: roundNum,
          speaker: blogger.name,
          speakerId: blogger.id,
          content: point,
          avatar: blogger.avatar
        })
      }
    }

    return rounds
  }

  // 生成辩论观点 - 使用大模型
  async generateDebatePoint(
    blogger: Blogger, 
    userQuestion: string, 
    products: BeautyProduct[],
    previousPoints: string[],
    round: number
  ): Promise<string> {
    const productList = products.slice(0, 5).map(p => 
      `- ${p.name}（${p.brand}，¥${p.real_price}，${p.tags.join('、')}，${p.description}）`
    ).join('\n')

    const previousContent = previousPoints.length > 0 
      ? `之前的观点：\n${previousPoints.join('\n')}`
      : '这是第一轮辩论，你是第一个发言。'

    const roundInstructions = [
      '提出你的核心观点，推荐你认为最合适的产品，并说明理由。',
      '针对其他博主的观点进行反驳或补充，坚持你的专业立场，可以质疑其他博主的推荐。',
      '总结讨论要点，指出关键争议点，给出你的最终建议，可以妥协或坚持己见。'
    ]

    const messages = [
      {
        role: 'system',
        content: `${blogger.systemPrompt}

【当前任务】
用户问题：${userQuestion}
这是第${round}轮辩论，${roundInstructions[round - 1]}

【可用商品】
${productList}

【辩论要求】
1. 用第一人称"我"
2. 充分展现你的性格特点和说话风格
3. 体现你的专业领域和 expertise
4. 可以推荐具体商品，并说明为什么适合用户
5. 可以反驳其他博主的观点，展现辩论的火花
6. 80字以内，语言要有个人特色
7. 要有博主的真实感，不要像机器人`
      },
      {
        role: 'user',
        content: `${previousContent}\n\n请发表你的观点：`
      }
    ]

    try {
      const response = await this.callLLM(messages, 0.9, 300)
      return response.trim() || this.generateFallbackDebatePoint(blogger, products, round)
    } catch (error) {
      console.error('LLM call failed:', error)
      return this.generateFallbackDebatePoint(blogger, products, round)
    }
  }

  // 降级策略：生成基于博主特色的回复
  private generateFallbackDebatePoint(blogger: Blogger, products: BeautyProduct[], round: number): string {
    const product = products[0]
    const fallbackResponses: Record<string, string[]> = {
      'b1': [
        `我检测过上百款${product.category}，${product.name}的成分表确实干净，没有酒精香精，安全性过关。`,
        `从成分角度看，${product.name}的配方比较温和，适合长期使用，不像有些产品刺激性太强。`,
        `综合来看，${product.name}性价比不错，成分安全，是我比较推荐的选择。`
      ],
      'b2': [
        `听我的，油皮就用${product.name}，控油效果我实测过，8小时不出油不是问题。`,
        `别听那些保守派，油皮就是要用猛药，${product.name}我烂脸期都在用，效果绝了。`,
        `总之油皮选${product.name}就对了，信我，我用过的东西比你吃的饭还多。`
      ],
      'b3': [
        `姐妹们，${product.name}真的绝了，才¥${product.real_price}，效果不输大牌！`,
        `学生党看过来，${product.name}我自己用了3个月，平价中的战斗机！`,
        `相信我，${product.name}这个价位能有这个效果，闭眼入！`
      ],
      'b4': [
        `研究表明，${product.name}的活性成分浓度达标，配方技术也有临床数据支撑。`,
        `从科学角度，${product.name}的作用机理清晰，有实验数据证明其功效。`,
        `综合来看，${product.name}是目前市面上功效证据最充分的选择之一。`
      ],
      'b5': [
        `敏感肌的宝子要注意，${product.name}成分温和，我烂脸期用过，不会刺激。`,
        `皮肤不稳定时记得选${product.name}这种修护型产品，先别用猛药。`,
        `总之敏感肌选${product.name}，温和修护最重要，其他的以后再说。`
      ]
    }

    const responses = fallbackResponses[blogger.id] || [
      `我推荐${product.name}，${product.description.substring(0, 30)}...`,
      `${product.name}是我比较看好的产品，适合解决你的问题。`,
      `综合来看，${product.name}是个不错的选择。`
    ]
    
    return responses[Math.min(round - 1, responses.length - 1)]
  }

  // 生成最终推荐
  async generateFinalRecommendation(
    selectedBloggers: Blogger[],
    userQuestion: string,
    products: BeautyProduct[]
  ): Promise<{ primary: any; secondary?: any; routine: any }> {
    const productList = products.slice(0, 5).map(p => 
      `- ${p.name}（${p.brand}，¥${p.real_price}，${p.tags.join('、')}，${p.description}）`
    ).join('\n')

    const bloggerInfo = selectedBloggers.map(b => 
      `- ${b.name}（${b.type}派，${b.preference}）`
    ).join('\n')

    const messages = [
      {
        role: 'system',
        content: `你是抖音美妆智囊团的总结者。基于多位博主的辩论，为用户推荐最适合的产品。

需要综合考虑：
1. 用户肤质问题：${userQuestion}
2. 不同博主的专业角度
3. 产品特点和适用性
4. 价格和性价比

请输出JSON格式：
{
  "primary": {
    "name": "主推荐商品名称（从提供的商品列表中选择）",
    "brand": "品牌",
    "price": 价格数字,
    "reason": "推荐理由（50字以内，综合博主们的观点）",
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
      const response = await this.callLLM(messages, 0.7, 800)
      // 尝试解析JSON
      const jsonMatch = response.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const result = JSON.parse(jsonMatch[0])
        // 添加图片
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

    // 降级策略
    return this.generateFallbackRecommendation(selectedBloggers, userQuestion, products)
  }

  // 降级策略：生成最终推荐
  private generateFallbackRecommendation(
    selectedBloggers: Blogger[],
    userQuestion: string,
    products: BeautyProduct[]
  ) {
    const primary = products[0]
    const secondary = products[1]
    
    // 根据博主类型生成推荐理由
    const bloggerTypes = selectedBloggers.map(b => b.type)
    let reason = `综合${selectedBloggers.map(b => b.name).join('、')}等博主的建议，${primary.name}最适合解决您的${userQuestion}问题。`
    
    if (bloggerTypes.includes('成分')) {
      reason += '从成分角度分析安全可靠，'
    }
    if (bloggerTypes.includes('oily')) {
      reason += '控油效果显著，'
    }
    if (bloggerTypes.includes('value')) {
      reason += '性价比高，'
    }
    if (bloggerTypes.includes('effect')) {
      reason += '功效明确，'
    }
    if (bloggerTypes.includes('gentle')) {
      reason += '温和不刺激。'
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
