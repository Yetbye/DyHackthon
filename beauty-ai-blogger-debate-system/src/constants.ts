/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Blogger } from './types';

export const BLOGGERS: Blogger[] = [
  {
    id: 'b1',
    name: '老爸评测',
    avatar: 'https://picsum.photos/seed/papa/200/200',
    description: '成分安全派，专注低刺激温和护肤',
    tags: ['成分党', '无酒精', '低刺激', '性价比'],
    preference: '国货功效线、药妆系',
    quote: '成分表才是最诚实的产品说明书',
    type: '成分'
  },
  {
    id: 'b2',
    name: '骆王宇',
    avatar: 'https://picsum.photos/seed/luo/200/200',
    description: '油皮专属派，控油配方、毛孔管理',
    tags: ['控油', '持妆', '针对油痘'],
    preference: '大牌实力派',
    quote: '刷酸不是为了折磨皮肤',
    type: 'oily'
  },
  {
    id: 'b3',
    name: '程十安',
    avatar: 'https://picsum.photos/seed/cheng/200/200',
    description: '性价比实用派，平价好物、大众验证',
    tags: ['平价', '直播常推', '新手友好'],
    preference: '亲民价位',
    quote: '好用的不一定要贵',
    type: 'value'
  },
  {
    id: 'b4',
    name: '言安堂',
    avatar: 'https://picsum.photos/seed/yan/200/200',
    description: '功效硬核派，活性成分、临床数据',
    tags: ['硬核', '见效快', '黑科技'],
    preference: '生物科技感',
    quote: '科学护肤，拒绝玄学',
    type: 'effect'
  },
  {
    id: 'b5',
    name: '敏肌小护士',
    avatar: 'https://picsum.photos/seed/nurse/200/200',
    description: '敏肌修护派，屏障修护、温和系',
    tags: ['修护', '烂脸期', '维稳'],
    preference: '药妆、医研背景',
    quote: '皮肤发红时，暂停一切猛药',
    type: 'gentle'
  },
  {
    id: 'b6',
    name: '李佳琦',
    avatar: 'https://picsum.photos/seed/austin/200/200',
    description: '大牌轻奢派，精致感、品牌力',
    tags: ['大牌', '限定', '质感'],
    preference: '国际一线',
    quote: 'OMG，买它！',
    type: 'luxury'
  },
  {
    id: 'b7',
    name: '国货真香',
    avatar: 'https://picsum.photos/seed/china/200/200',
    description: '国货钻研派，中国品牌、原料溯源',
    tags: ['中国芯', '原料', '性价比'],
    preference: '新锐国货',
    quote: '国货早已不是当年的模样',
    type: 'local'
  },
  {
    id: 'b8',
    name: '极简主义者',
    avatar: 'https://picsum.photos/seed/simple/200/200',
    description: '极简护肤派，少即是多、懒人友好',
    tags: ['精简', '一瓶多效', '逻辑'],
    preference: 'All-in-one',
    quote: '护肤只要三步就够了',
    type: 'minimalist'
  },
  {
    id: 'b9',
    name: '实验数据控',
    avatar: 'https://picsum.photos/seed/lab/200/200',
    description: '数据实测派，亲测对比、量化评分',
    tags: ['数据', '分时测评', '盲测'],
    preference: '指标导向',
    quote: '没有数据支撑的推荐都是耍流氓',
    type: 'data'
  },
  {
    id: 'b10',
    name: '学生党省钱君',
    avatar: 'https://picsum.photos/seed/student/200/200',
    description: '学生党省钱派，极致便宜、大碗实用',
    tags: ['白菜价', '学生', '平替'],
    preference: '超市货架、新锐平价',
    quote: '两位数也能买到好护肤',
    type: 'budget'
  }
];

export const KNOWLEDGE_BASE = {
  acne: {
    title: "油痘肌控油原理",
    content: "油痘肌的核心在于皮脂腺分泌过盛与毛孔导管角化异常。控油应不仅停留在表层吸附，更需通过抑制5α-还原酶活性来减少油脂产生，同时配合水杨酸剥脱老废角质，防止毛孔堵塞。",
    misconception: "误区：油皮不需要补水。真相：过度控油而不保湿会破坏皮脂膜，导致补偿性出油。"
  }
};
