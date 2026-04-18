# 抖音美妆Agent集成任务列表

## 阶段一：数据准备与筛选

- [x] **Task 1: 筛选美妆相关视频数据**
  - [x] SubTask 1.1: 分析现有videos.json中的美妆视频
  - [x] SubTask 1.2: 编写视频数据筛选脚本，提取美妆相关内容
  - [x] SubTask 1.3: 生成新的beauty-videos.json数据文件
  - [x] SubTask 1.4: 验证筛选后的视频数据完整性

- [x] **Task 2: 筛选美妆博主数据**
  - [x] SubTask 2.1: 分析现有users.json中的美妆博主
  - [x] SubTask 2.2: 为博主添加美妆分类标签
  - [x] SubTask 2.3: 生成新的beauty-users.json数据文件

- [x] **Task 3: 替换美妆商品数据**
  - [x] SubTask 3.1: 设计美妆商品数据结构
  - [x] SubTask 3.2: 收集美妆商品样本数据（口红、粉底、护肤等）
  - [x] SubTask 3.3: 生成新的beauty-goods.json数据文件
  - [x] SubTask 3.4: 准备商品图片资源

## 阶段二：Agent核心模块开发

- [x] **Task 4: 创建用户行为追踪系统**
  - [x] SubTask 4.1: 创建behavior-tracker.ts模块
  - [x] SubTask 4.2: 实现浏览行为追踪（视频ID、观看时长）
  - [x] SubTask 4.3: 实现搜索行为追踪（关键词记录）
  - [x] SubTask 4.4: 实现点赞/收藏/评论行为追踪
  - [x] SubTask 4.5: 使用localStorage持久化行为数据

- [x] **Task 5: 创建Agent状态管理**
  - [x] SubTask 5.1: 创建stores/agent.ts Pinia store
  - [x] SubTask 5.2: 定义Agent状态接口（用户画像、推荐历史、反馈记录）
  - [x] SubTask 5.3: 实现用户画像构建逻辑
  - [x] SubTask 5.4: 实现推荐历史管理

- [x] **Task 6: 集成大模型API**
  - [x] SubTask 6.1: 创建llm-api.ts服务模块
  - [x] SubTask 6.2: 实现API配置管理（地址、密钥、参数）
  - [x] SubTask 6.3: 实现推荐请求封装
  - [x] SubTask 6.4: 实现API错误处理和降级策略

- [x] **Task 7: 实现个性化推荐引擎**
  - [x] SubTask 7.1: 创建recommendation-engine.ts模块
  - [x] SubTask 7.2: 实现用户行为特征提取
  - [x] SubTask 7.3: 实现LLM API调用生成推荐
  - [x] SubTask 7.4: 实现推荐结果与商品库匹配

## 阶段三：UI组件开发

- [x] **Task 8: 开发Agent商品卡片组件**
  - [x] SubTask 8.1: 创建AgentProductCard.vue组件
  - [x] SubTask 8.2: 实现卡片UI设计（圆角、阴影、渐变）
  - [x] SubTask 8.3: 实现商品信息展示（图片、名称、价格、推荐理由）
  - [x] SubTask 8.4: 实现打勾/打叉反馈按钮
  - [x] SubTask 8.5: 实现卡片动画效果（滑入、滑出）

- [x] **Task 9: 开发Agent私信聊天界面**
  - [x] SubTask 9.1: 创建AgentChat.vue页面组件
  - [x] SubTask 9.2: 实现聊天消息列表UI
  - [x] SubTask 9.3: 实现消息输入框和发送功能
  - [x] SubTask 9.4: 实现商品卡片在聊天中的展示
  - [x] SubTask 9.5: 添加Agent聊天入口到消息页面

- [x] **Task 10: 集成商品卡片到视频播放页**
  - [x] SubTask 10.1: 创建AgentVideoIntegration.vue组件
  - [x] SubTask 10.2: 实现卡片展示时机控制（观看3秒后）
  - [x] SubTask 10.3: 实现卡片与视频内容的关联推荐
  - [x] SubTask 10.4: 实现点击卡片跳转商品详情

## 阶段四：反馈训练与优化

- [x] **Task 11: 实现反馈数据收集**
  - [x] SubTask 11.1: 创建反馈记录逻辑
  - [x] SubTask 11.2: 实现打勾反馈记录
  - [x] SubTask 11.3: 实现打叉反馈记录
  - [x] SubTask 11.4: 将反馈数据关联到用户画像

- [x] **Task 12: 实现推荐优化逻辑**
  - [x] SubTask 12.1: 基于反馈数据调整推荐权重
  - [x] SubTask 12.2: 实现负反馈过滤机制
  - [x] SubTask 12.3: 实现推荐结果去重

## 阶段五：测试与验证

- [x] **Task 13: 功能测试**
  - [x] SubTask 13.1: 测试行为追踪功能
  - [x] SubTask 13.2: 测试推荐生成逻辑
  - [x] SubTask 13.3: 测试商品卡片展示
  - [x] SubTask 13.4: 测试反馈收集功能
  - [x] SubTask 13.5: 测试私信聊天功能

- [x] **Task 14: 数据验证**
  - [x] SubTask 14.1: 验证美妆视频数据完整性（85条美妆视频）
  - [x] SubTask 14.2: 验证美妆商品数据完整性（20个美妆商品）
  - [x] SubTask 14.3: 验证数据过滤逻辑正确性

## 额外完成的任务

- [x] **创建API配置页面**
  - [x] 创建AgentConfig.vue配置组件
  - [x] 添加API地址、密钥、模型参数配置
  - [x] 添加数据清空功能
  - [x] 添加路由配置

- [x] **消息页面集成**
  - [x] 在Message.vue添加Agent入口
  - [x] 添加AI标识和样式
  - [x] 实现点击跳转Agent聊天

## 项目文件结构

```
douyin/src/
├── agent/
│   ├── behavior-tracker.ts      # 用户行为追踪
│   ├── llm-api.ts               # 大模型API集成
│   └── recommendation-engine.ts # 推荐引擎
├── components/agent/
│   ├── AgentProductCard.vue     # 商品卡片组件
│   ├── AgentChat.vue            # 聊天界面
│   ├── AgentVideoIntegration.vue # 视频集成组件
│   └── AgentConfig.vue          # 配置页面
├── stores/
│   └── agent.ts                 # Agent状态管理
└── router/
    └── routes.ts                # 路由配置（已添加Agent路由）

douyin/public/data/
├── beauty-videos.json           # 美妆视频数据（85条）
├── beauty-users.json            # 美妆博主数据（4位）
└── beauty-goods.json            # 美妆商品数据（20个）
```

## 使用说明

1. **配置大模型API**
   - 访问 `/agent-config` 页面
   - 填写API地址、密钥和模型名称
   - 支持OpenAI API格式

2. **使用Agent聊天**
   - 在消息页面点击"美妆小助手"
   - 或访问 `/agent-chat` 页面
   - 可以咨询美妆问题，获取个性化推荐

3. **视频推荐**
   - 观看美妆视频3秒后，Agent会自动弹出商品推荐卡片
   - 点击"喜欢"或"不喜欢"进行反馈训练
   - 点击卡片可跳转到商品详情

## 任务依赖关系

```
Task 1 (视频数据) ──┐
Task 2 (博主数据) ──┼──> Task 4 (行为追踪) ──> Task 5 (状态管理) ──┐
Task 3 (商品数据) ──┘                                            │
                                                                 ├──> Task 7 (推荐引擎) ──> Task 8 (卡片UI) ──> Task 10 (集成)
Task 6 (LLM API) ────────────────────────────────────────────────┘
                                                                     │
Task 9 (聊天UI) <────────────────────────────────────────────────────┘
                                                                     │
Task 10 (集成) ──> Task 11 (反馈收集) ──> Task 12 (推荐优化)
                                                                     │
Task 13, 14 (测试) <─────────────────────────────────────────────────┘
```
