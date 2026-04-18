import beautyVideos from '@/assets/data/beauty-videos.json'

// 模拟API延迟
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// 获取美妆视频推荐
export async function recommendedBeautyVideo(params?: any) {
  await delay(300) // 模拟网络延迟
  
  const start = params?.start || 0
  const pageSize = params?.pageSize || 10
  
  // 将本地数据格式转换为API返回格式
  const list = beautyVideos.slice(start, start + pageSize).map(video => ({
    id: video.id,
    video: video.video,
    cover: video.cover,
    cover_imgs: video.cover_imgs,
    title: video.title,
    type: video.type,
    create_time: video.create_time,
    author: video.author,
    music: video.music,
    statistics: video.statistics,
    isLiked: video.isLiked,
    isCollect: video.isCollect,
    tags: video.tags,
    comment_list: video.comment_list
  }))
  
  return {
    success: true,
    data: {
      list,
      total: beautyVideos.length
    }
  }
}

// 获取关注的美妆博主视频
export async function followBeautyVideo(params?: any) {
  await delay(300)
  
  const start = params?.start || 0
  const pageSize = params?.pageSize || 10
  
  // 只返回有标签的美妆视频
  const beautyOnly = beautyVideos.filter(v => v.tags && v.tags.length > 0)
  const list = beautyOnly.slice(start, start + pageSize)
  
  return {
    success: true,
    data: {
      list,
      total: beautyOnly.length
    }
  }
}

// 获取同城美妆视频
export async function localBeautyVideo(params?: any) {
  await delay(300)
  
  const start = params?.start || 0
  const pageSize = params?.pageSize || 10
  
  // 随机打乱顺序模拟不同内容
  const shuffled = [...beautyVideos].sort(() => Math.random() - 0.5)
  const list = shuffled.slice(start, start + pageSize)
  
  return {
    success: true,
    data: {
      list,
      total: beautyVideos.length
    }
  }
}
