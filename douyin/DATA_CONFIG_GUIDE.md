# 抖音美妆Agent - 数据配置指南

## 一、大模型API配置

### 1. 配置页面
访问：`http://localhost:3000/agent-config`

### 2. 支持的API格式
项目使用OpenAI兼容的API格式，支持以下提供商：

#### OpenAI
- API地址：`https://api.openai.com/v1/chat/completions`
- 模型：`gpt-3.5-turbo`, `gpt-4`
- 密钥格式：`sk-xxxxxxxxxxxxxxxx`

#### 国内API（推荐）
- **LongCat**: `https://api.longcat.chat/openai`
- **Moonshot**: `https://api.moonshot.cn/v1/chat/completions`
- **智谱AI**: `https://open.bigmodel.cn/api/paas/v4/chat/completions`

### 3. 配置步骤
1. 打开配置页面
2. 填写API地址、密钥和模型名称
3. 点击"测试API连接"按钮验证
4. 测试成功后点击"保存"

---

## 二、商品数据配置

### 文件位置
`src/assets/data/beauty-goods.json`

### 商品数据格式
```json
{
  "id": "beauty-001",           // 商品唯一ID
  "name": "商品名称",            // 显示名称
  "cover": "cover.jpg",         // 封面图片（放在public/images/goods/）
  "imgs": ["cover.jpg"],        // 图片列表
  "price": 390,                 // 原价
  "real_price": 350,            // 实际售价
  "isLowPrice": true,           // 是否特价
  "discount": "满300减40",       // 优惠信息
  "sold": 12580,                // 销量
  "brand": "YSL圣罗兰",          // 品牌
  "category": "口红",            // 类别（口红、粉底、精华等）
  "tags": ["显白", "哑光"],      // 标签
  "skinType": ["所有肤质"],      // 适用肤质
  "description": "商品描述"      // 描述
}
```

### 添加自己的商品

#### 方法1：直接编辑JSON文件
1. 打开 `src/assets/data/beauty-goods.json`
2. 按照格式添加新商品
3. 保存文件

#### 方法2：使用脚本批量导入
创建一个导入脚本：

```javascript
// scripts/import-goods.js
const fs = require('fs');

// 你的商品数据
const myGoods = [
  {
    id: "my-001",
    name: "你的商品名称",
    cover: "your-image.jpg",
    imgs: ["your-image.jpg"],
    price: 299,
    real_price: 199,
    isLowPrice: true,
    discount: "限时特惠",
    sold: 5000,
    brand: "你的品牌",
    category: "口红",
    tags: ["显白", "持久"],
    skinType: ["所有肤质"],
    description: "商品描述"
  }
  // ... 更多商品
];

// 保存到文件
fs.writeFileSync(
  'src/assets/data/beauty-goods.json', 
  JSON.stringify(myGoods, null, 2)
);
console.log('商品数据已导入！');
```

### 商品图片配置
1. 将商品图片放入 `public/images/goods/` 目录
2. 图片名称与JSON中的 `cover` 字段对应
3. 建议尺寸：400x400px，格式：jpg/png

---

## 三、视频数据配置

### 文件位置
`src/assets/data/beauty-videos.json`

### 视频数据格式
```json
{
  "id": "beauty-001",
  "video": "视频URL",           // 视频链接
  "cover": "封面图URL",         // 封面图片
  "title": "视频标题",          // 显示标题
  "type": "beauty",            // 类型
  "create_time": "2024-01-15", // 创建时间
  "author": {
    "id": "user-001",
    "nickname": "博主昵称",
    "avatar": "头像URL",
    "certified": true          // 是否认证
  },
  "statistics": {
    "comment_count": 1250,
    "digg_count": 8560,
    "share_count": 320,
    "collect_count": 2100
  },
  "tags": ["化妆教程", "日常妆"]  // 标签，用于推荐匹配
}
```

### 添加自己的视频

1. 准备视频文件或链接
2. 编辑 `src/assets/data/beauty-videos.json`
3. 添加视频信息
4. 确保视频标题包含美妆关键词（如：口红、粉底、护肤等）

---

## 四、博主数据配置

### 文件位置
`src/assets/data/beauty-users.json`

### 博主数据格式
```json
{
  "id": "user-001",
  "nickname": "美妆博主昵称",
  "avatar": "头像URL",
  "certified": true,
  "category": "美妆",          // 分类
  "tags": ["护肤", "彩妆"],     // 标签
  "followers": 100000,
  "following": 100
}
```

---

## 五、快速配置示例

### 示例1：添加一个口红商品

1. 准备图片 `public/images/goods/my-lipstick.jpg`

2. 编辑 `src/assets/data/beauty-goods.json`，添加：
```json
{
  "id": "my-lipstick-001",
  "name": "我的品牌丝绒口红 #01正红色",
  "cover": "my-lipstick.jpg",
  "imgs": ["my-lipstick.jpg"],
  "price": 199,
  "real_price": 159,
  "isLowPrice": true,
  "discount": "新品上市",
  "sold": 3000,
  "brand": "我的品牌",
  "category": "口红",
  "tags": ["显白", "丝绒", "正红"],
  "skinType": ["所有肤质"],
  "description": "丝绒质地，显白不挑皮，持久不脱妆"
}
```

3. 重启开发服务器

### 示例2：配置自己的API

1. 访问 `http://localhost:3000/agent-config`
2. 填写：
   - API地址：`https://你的API地址`
   - API密钥：`你的密钥`
   - 模型：`gpt-3.5-turbo`
3. 点击"测试API连接"
4. 测试通过后保存

---

## 六、数据备份与恢复

### 备份用户数据
用户数据（浏览记录、偏好等）存储在浏览器localStorage中：
- 键名：`beautyAgentData`
- 键名：`llmConfig`

### 导出数据
在浏览器控制台执行：
```javascript
const data = localStorage.getItem('beautyAgentData');
console.log(data);
```

### 导入数据
```javascript
const data = '{"你的数据JSON"}';
localStorage.setItem('beautyAgentData', data);
```

---

## 七、常见问题

### Q1: API测试失败怎么办？
- 检查API地址是否正确
- 确认密钥是否有效
- 查看浏览器控制台网络请求详情
- 确认是否支持跨域（CORS）

### Q2: 商品图片不显示？
- 确认图片放在 `public/images/goods/` 目录
- 检查文件名是否与JSON中一致
- 重启开发服务器

### Q3: 如何清空所有数据？
- 访问配置页面 `/agent-config`
- 点击"清空所有数据"按钮
- 或在浏览器控制台执行：`localStorage.clear()`

### Q4: 推荐不精准？
- 多浏览、点赞美妆视频，让系统学习偏好
- 在聊天中告诉Agent你的肤质和喜好
- 对推荐商品进行"喜欢/不喜欢"反馈

---

## 八、联系支持

如有问题，请查看：
- 项目文档：`spec.md`
- 任务列表：`tasks.md`
- 验收清单：`checklist.md`
