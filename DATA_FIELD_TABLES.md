# 数据字段表

这份表是给队友收集数据时直接用的。

目标：

- 产品数据按固定字段收集
- 博主数据按固定字段收集
- 如果要加“相关视频”，也按固定字段收集
- 所有枚举值尽量用下面列出来的标准值，不要自由发挥


## 1. 产品数据总说明

每个产品都必须有：

- 公共字段
- 对应品类专属字段

当前只支持 3 个品类：

- `foundation`
- `lipstick`
- `eyeshadow`


## 2. 产品公共字段

| 字段名 | 类型 | 必填 | 说明 | 示例 / 可选值 |
| --- | --- | --- | --- | --- |
| `id` | string | 是 | 产品唯一 ID，后端内部使用，不能重复 | `foundation_dw` |
| `name` | string | 是 | 产品名称 | `雅诗兰黛 Double Wear 粉底液` |
| `brand` | string | 是 | 品牌名 | `Estee Lauder` |
| `category` | string | 是 | 产品品类 | `foundation` / `lipstick` / `eyeshadow` |
| `price` | number | 是 | 产品价格，只填数字 | `450` |
| `budget_level` | string | 是 | 预算档位 | `low` / `mid` / `high` |
| `link` | string | 是 | 商品购买链接 | `https://...` |
| `fit_scenes` | string[] | 是 | 更适合哪些使用场景 | `daily` / `office` / `date` / `event` / `travel` |
| `tags` | string[] | 是 | 产品核心标签，后端筛选会用 | 见“产品标签建议” |
| `risk_tags` | string[] | 是 | 风险标签，没有就填空数组 `[]` | `drying` / `fallout` / `high_risk` |


## 3. 粉底液字段

适用 `category = foundation`

| 字段名 | 类型 | 必填 | 说明 | 可选值 |
| --- | --- | --- | --- | --- |
| `fit_skin_types` | string[] | 是 | 适合哪些肤质 | `dry` / `oily` / `combination` / `sensitive` |
| `finish` | string | 是 | 妆效类型 | `matte` / `natural` / `glowy` |
| `coverage` | string | 是 | 遮瑕强度 | `light` / `medium` / `high` |
| `longwear_level` | string | 是 | 持妆强度 | `low` / `medium` / `high` |

### 粉底液示例

```json
{
  "id": "foundation_dw",
  "name": "雅诗兰黛 Double Wear 粉底液",
  "brand": "Estee Lauder",
  "category": "foundation",
  "price": 450,
  "budget_level": "high",
  "link": "https://...",
  "fit_scenes": ["daily", "office", "event"],
  "tags": ["big_brand", "good_finish", "longwear", "popular", "oil_control", "high_coverage"],
  "risk_tags": ["drying"],
  "fit_skin_types": ["oily", "combination"],
  "finish": "matte",
  "coverage": "high",
  "longwear_level": "high"
}
```


## 4. 口红字段

适用 `category = lipstick`

| 字段名 | 类型 | 必填 | 说明 | 可选值 |
| --- | --- | --- | --- | --- |
| `texture` | string | 是 | 质地偏好 | `matte` / `velvet` / `glossy` / `tint` |
| `finish` | string | 是 | 最终妆面，可先与 texture 保持一致或接近 | 一般可填 `matte` / `glossy` |
| `color_family` | string | 是 | 色系 | `red` / `nude` / `pink` / `brown` / `coral` |
| `longwear_level` | string | 是 | 持久度 | `low` / `medium` / `high` |
| `comfort_level` | string | 是 | 舒适度 | `low` / `medium` / `high` |

### 口红示例

```json
{
  "id": "lipstick_ysl_1966",
  "name": "YSL 小金条 1966",
  "brand": "YSL",
  "category": "lipstick",
  "price": 390,
  "budget_level": "high",
  "link": "https://...",
  "fit_scenes": ["office", "date", "event"],
  "tags": ["big_brand", "popular", "velvet", "brighten"],
  "risk_tags": [],
  "texture": "velvet",
  "finish": "matte",
  "color_family": "brown",
  "longwear_level": "high",
  "comfort_level": "medium"
}
```


## 5. 眼影字段

适用 `category = eyeshadow`

| 字段名 | 类型 | 必填 | 说明 | 可选值 |
| --- | --- | --- | --- | --- |
| `color_tone` | string | 是 | 主色调 | `earth` / `pink` / `orange` / `cool` / `neutral` |
| `sparkle_type` | string | 是 | 闪片结构 | `matte` / `shimmer` / `mixed` |
| `beginner_friendly` | boolean | 是 | 是否更适合新手 | `true` / `false` |
| `pigmentation_level` | string | 否 | 显色度，当前后端不依赖，但建议保留 | `light` / `medium` / `high` |
| `fallout_risk` | string | 否 | 飞粉程度，当前后端不直接打分，但建议保留 | `low` / `medium` / `high` |

### 眼影示例

```json
{
  "id": "eyeshadow_3ce_overtake",
  "name": "3CE Overtake 九宫格眼影",
  "brand": "3CE",
  "category": "eyeshadow",
  "price": 265,
  "budget_level": "mid",
  "link": "https://...",
  "fit_scenes": ["daily", "date", "travel"],
  "tags": ["popular", "daily_friendly", "shimmer", "good_finish"],
  "risk_tags": [],
  "color_tone": "pink",
  "sparkle_type": "mixed",
  "beginner_friendly": true,
  "pigmentation_level": "medium",
  "fallout_risk": "low"
}
```


## 6. 产品标签建议

产品的 `tags` 最好优先用这一批词，方便后端匹配。

| 标签值 | 含义 |
| --- | --- |
| `big_brand` | 大牌 |
| `good_finish` | 妆效好 |
| `longwear` | 持妆强 |
| `natural_finish` | 自然妆感 |
| `popular` | 热门 |
| `oil_control` | 控油 |
| `high_coverage` | 高遮瑕 |
| `glow` | 光泽感 |
| `comfortable` | 舒适度高 |
| `stable` | 更稳妥 |
| `daily_friendly` | 日常友好 |
| `value_pick` | 性价比 |
| `brighten` | 显白提气色 |
| `velvet` | 丝绒质地 |
| `classic_red` | 经典红调 |
| `soft_focus` | 柔焦感 |
| `shimmer` | 珠光亮片 |
| `earth_tone` | 大地色 |
| `beginner_friendly` | 新手友好 |


## 7. 风险标签建议

产品的 `risk_tags` 建议只用少量固定值。

| 标签值 | 含义 |
| --- | --- |
| `drying` | 可能偏干 / 容易拔干 |
| `fallout` | 有飞粉风险 |
| `high_risk` | 整体风险偏高，不太适合稳妥推荐 |


## 8. 博主数据字段

博主虽然是真人，但后端跑逻辑依赖的是“标签”和“权重”。

| 字段名 | 类型 | 必填 | 说明 | 示例 / 可选值 |
| --- | --- | --- | --- | --- |
| `id` | string | 是 | 博主唯一 ID | `lijiaqi` |
| `name` | string | 是 | 博主名 | `李佳琦` |
| `fit_categories` | string[] | 是 | 这个博主适合评测哪些品类 | `foundation` / `lipstick` / `eyeshadow` |
| `style_tags` | string[] | 否 | 风格标签，当前不是硬依赖，但建议保留 | `trend_finish` |
| `preferred_product_tags` | string[] | 是 | 这个博主更容易支持哪些产品标签 | `["big_brand", "good_finish"]` |
| `avoid_product_tags` | string[] | 是 | 这个博主更容易反对哪些产品标签 | `["drying", "fallout"]` |
| `tone` | string | 是 | 一句话描述这个博主说话风格 | `结论快、偏种草、强调热门和妆效` |
| `focus_weights` | object | 是 | 博主关注点权重，1 到 5 分 | 见下一张表 |


## 9. 博主关注点权重

`focus_weights` 里必须包含下面这些字段。

| 字段名 | 类型 | 必填 | 说明 | 建议范围 |
| --- | --- | --- | --- | --- |
| `finish` | number | 是 | 多看重妆效 | 1 - 5 |
| `longwear` | number | 是 | 多看重持妆 | 1 - 5 |
| `comfort` | number | 是 | 多看重舒适度 | 1 - 5 |
| `price` | number | 是 | 多看重价格 / 性价比 | 1 - 5 |
| `safety` | number | 是 | 多看重安全 / 风险控制 | 1 - 5 |
| `trend` | number | 是 | 多看重热门度 / 流行度 | 1 - 5 |
| `brand_power` | number | 是 | 多看重大牌和品牌认知 | 1 - 5 |
| `beginner_friendly` | number | 是 | 多看重新手友好程度 | 1 - 5 |
| `real_use` | number | 是 | 多看重真实上脸体验 | 1 - 5 |


## 10. 博主示例

```json
{
  "id": "lijiaqi",
  "name": "李佳琦",
  "fit_categories": ["foundation", "lipstick"],
  "style_tags": ["trend_finish", "brand_driven", "hot_items"],
  "preferred_product_tags": ["big_brand", "good_finish", "popular", "longwear"],
  "avoid_product_tags": ["high_risk", "fallout"],
  "focus_weights": {
    "finish": 5,
    "longwear": 4,
    "comfort": 2,
    "price": 2,
    "safety": 1,
    "trend": 5,
    "brand_power": 5,
    "beginner_friendly": 2,
    "real_use": 3
  },
  "tone": "结论快、偏种草、强调热门和妆效"
}
```


## 11. 相关视频字段

如果后面要加“博主相关视频”，建议单独收集，不要一开始混在博主表里。

| 字段名 | 类型 | 必填 | 说明 | 示例 |
| --- | --- | --- | --- | --- |
| `product_id` | string | 是 | 对应产品 ID | `foundation_dw` |
| `blogger_id` | string | 是 | 对应博主 ID | `lijiaqi` |
| `blogger_name` | string | 是 | 博主名，方便展示 | `李佳琦` |
| `title` | string | 是 | 视频标题 | `DW 粉底液实测` |
| `url` | string | 是 | 视频链接 | `https://...` |
| `platform` | string | 否 | 平台名 | `douyin` / `bilibili` / `xiaohongshu` |
| `cover` | string | 否 | 封面图链接 | `https://...` |
| `summary` | string | 否 | 一句话说明视频角度 | `偏妆效和持妆角度` |


## 12. 推荐给队友的表格表头

### 产品表头

```text
id,name,brand,category,price,budget_level,link,fit_scenes,tags,risk_tags,fit_skin_types,finish,coverage,longwear_level,texture,color_family,comfort_level,color_tone,sparkle_type,beginner_friendly,pigmentation_level,fallout_risk
```

说明：

- 不属于该品类的字段可以留空
- 例如口红不用填 `fit_skin_types`
- 例如粉底液不用填 `color_family`

### 博主表头

```text
id,name,fit_categories,style_tags,preferred_product_tags,avoid_product_tags,tone,finish_weight,longwear_weight,comfort_weight,price_weight,safety_weight,trend_weight,brand_power_weight,beginner_friendly_weight,real_use_weight
```

### 视频表头

```text
product_id,blogger_id,blogger_name,title,url,platform,cover,summary
```


## 13. 队友填数据时的注意事项

1. 不要只给文案介绍，要给结构化字段。
2. 所有枚举值尽量用这份文档里的标准值。
3. 数组字段要写成多个值，不要塞成一句描述。
4. 如果某个字段确实拿不准，可以先空着，但不要乱填新枚举。
5. 如果队友先给你 Excel / CSV 原表，也可以后续再统一转 JSON。
