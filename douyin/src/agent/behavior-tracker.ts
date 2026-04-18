import { useAgentStore } from '@/stores/agent'

// 行为追踪器
class BehaviorTracker {
  private store = useAgentStore()
  private viewStartTime: number = 0
  private currentVideoId: string = ''
  private currentVideoTitle: string = ''

  // 开始观看视频
  startView(videoId: string, videoTitle: string) {
    this.viewStartTime = Date.now()
    this.currentVideoId = videoId
    this.currentVideoTitle = videoTitle
  }

  // 结束观看视频
  endView(completed: boolean = false) {
    if (this.viewStartTime && this.currentVideoId) {
      const duration = Date.now() - this.viewStartTime
      // 只记录观看超过3秒的视频
      if (duration > 3000) {
        this.store.recordView(
          this.currentVideoId,
          this.currentVideoTitle,
          duration,
          completed
        )
      }
    }
    this.reset()
  }

  // 记录搜索
  trackSearch(keyword: string) {
    if (keyword.trim()) {
      this.store.recordSearch(keyword.trim())
    }
  }

  // 记录点赞
  trackLike(videoId: string, videoTitle: string) {
    this.store.recordLike(videoId, videoTitle)
  }

  // 记录收藏
  trackCollect(videoId: string, videoTitle: string) {
    this.store.recordCollect(videoId, videoTitle)
  }

  // 记录评论
  trackComment(videoId: string, videoTitle: string, content: string) {
    if (content.trim()) {
      this.store.recordComment(videoId, videoTitle, content.trim())
    }
  }

  // 重置
  private reset() {
    this.viewStartTime = 0
    this.currentVideoId = ''
    this.currentVideoTitle = ''
  }

  // 获取用户行为摘要（用于LLM）
  getBehaviorSummary(): string {
    const store = this.store
    const recentViews = store.viewHistory.slice(-10)
    const recentSearches = store.searchHistory.slice(-5)
    const recentLikes = store.likeHistory.slice(-5)

    let summary = '用户行为摘要：\n'

    if (recentViews.length > 0) {
      summary += '\n最近观看的视频：\n'
      recentViews.forEach(v => {
        summary += `- ${v.videoTitle}\n`
      })
    }

    if (recentSearches.length > 0) {
      summary += '\n最近搜索关键词：\n'
      recentSearches.forEach(s => {
        summary += `- ${s.keyword}\n`
      })
    }

    if (recentLikes.length > 0) {
      summary += '\n最近点赞的视频：\n'
      recentLikes.forEach(l => {
        summary += `- ${l.videoTitle}\n`
      })
    }

    const preferences = store.beautyPreferences
    if (preferences.categories.length > 0) {
      summary += `\n偏好品类：${preferences.categories.join('、')}\n`
    }
    if (preferences.brands.length > 0) {
      summary += `偏好品牌：${preferences.brands.join('、')}\n`
    }

    return summary
  }
}

// 单例导出
export const behaviorTracker = new BehaviorTracker()
export default behaviorTracker
