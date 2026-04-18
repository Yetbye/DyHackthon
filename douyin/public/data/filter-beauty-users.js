import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 美妆关键词
const beautyKeywords = ['化妆', '护肤', '美妆', '彩妆', '美容', 'makeup', 'cosmetic'];

// 读取 users.json
const usersPath = path.join(__dirname, 'users.json');
const videosPath = path.join(__dirname, 'videos.json');
const outputPath = path.join(__dirname, 'beauty-users.json');

const users = JSON.parse(fs.readFileSync(usersPath, 'utf8'));
const videos = JSON.parse(fs.readFileSync(videosPath, 'utf8'));

// 检查文本是否包含美妆关键词
function containsBeautyKeyword(text) {
  if (!text) return false;
  const lowerText = text.toLowerCase();
  return beautyKeywords.some(keyword => lowerText.includes(keyword.toLowerCase()));
}

// 从视频中统计发布过美妆视频的博主
const beautyVideoAuthors = new Set();
videos.forEach(video => {
  const desc = video.desc || '';
  if (containsBeautyKeyword(desc)) {
    beautyVideoAuthors.add(video.author_user_id);
  }
});

console.log(`从视频中找到 ${beautyVideoAuthors.size} 位发布过美妆视频的博主`);

// 筛选美妆博主
const beautyUsers = [];

users.forEach(user => {
  const nickname = user.nickname || '';
  const signature = user.signature || '';
  const uid = user.uid;
  
  // 检查昵称或签名是否包含美妆关键词
  const isBeautyByProfile = containsBeautyKeyword(nickname) || containsBeautyKeyword(signature);
  
  // 检查是否发布过美妆视频
  const isBeautyByVideo = beautyVideoAuthors.has(parseInt(uid));
  
  if (isBeautyByProfile || isBeautyByVideo) {
    // 添加 category 标签
    const beautyUser = {
      ...user,
      category: "beauty"
    };
    beautyUsers.push(beautyUser);
    console.log(`筛选到美妆博主: ${nickname} (UID: ${uid})`);
    if (isBeautyByProfile) {
      console.log(`  - 原因: 昵称或签名包含美妆关键词`);
    }
    if (isBeautyByVideo) {
      console.log(`  - 原因: 发布过美妆视频`);
    }
  }
});

console.log(`\n共筛选出 ${beautyUsers.length} 位美妆博主`);

// 保存到 beauty-users.json
fs.writeFileSync(outputPath, JSON.stringify(beautyUsers, null, 2), 'utf8');
console.log(`已保存到: ${outputPath}`);
