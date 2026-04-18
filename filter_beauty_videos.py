import json

# 扩展的美妆关键词列表
beauty_keywords = [
    # 基础美妆
    "化妆", "护肤", "口红", "眼影", "粉底", "彩妆", "美妆", "美容",
    "makeup", "cosmetic", "唇釉", "底妆", "卸妆", "面膜", "精华",
    "面霜", "眉笔", "睫毛膏", "腮红", "遮瑕", "定妆", "散粉",
    "隔离", "防晒", "美白", "保湿", "抗衰老", "痘痘", "敏感肌",
    # 扩展关键词
    "素颜", "防晒", "穿搭", "爱用", "分享", "教程", "测评", "推荐",
    "好物", "日常", "妆容", "妆前", "妆后", "眼妆", "唇妆", "修容",
    "高光", "阴影", "眼线", "睫毛", "眉毛", "美甲", "美睫", "皮肤",
    "保养", "护理", "清洁", "补水", "控油", "祛痘", "淡斑", "紧致",
    "眼霜", "乳液", "爽肤水", "洗面奶", "洁面乳", "防晒霜", "气垫",
    "粉饼", "bb霜", "cc霜", "粉底液", "遮瑕膏", "润唇膏", "唇彩",
    "香水", "护肤", "保养", "抗老", "修复", "舒缓", "去角质", "黑头",
    "毛孔", "细纹", "皱纹", "肤色", "暗沉", "提亮", "光泽", "水润",
    "滋润", "清爽", "温和", "天然", "有机", "成分", "配方", "品牌",
    "专柜", "平价", "大牌", "国货", "进口", "韩妆", "日妆", "欧美"
]

# 转换为小写用于不区分大小写的匹配
beauty_keywords_lower = [k.lower() for k in beauty_keywords]

def is_beauty_video(video):
    """检查视频是否与美妆相关"""
    # 检查 desc 字段
    desc = video.get("desc", "")
    if desc:
        desc_lower = desc.lower()
        for keyword in beauty_keywords_lower:
            if keyword in desc_lower:
                return True
    
    # 检查 text_extra 中的 hashtag_name
    text_extra = video.get("text_extra", [])
    if text_extra:
        for item in text_extra:
            hashtag = item.get("hashtag_name", "")
            if hashtag:
                hashtag_lower = hashtag.lower()
                for keyword in beauty_keywords_lower:
                    if keyword in hashtag_lower:
                        return True
    
    return False

# 读取 videos.json
print("正在读取 videos.json 文件...")
with open("d:/saiker/DyHackthon/douyin/public/data/videos.json", "r", encoding="utf-8") as f:
    videos = json.load(f)

print(f"总共读取了 {len(videos)} 条视频")

# 筛选美妆视频
print("正在筛选美妆相关视频...")
beauty_videos = []
for video in videos:
    if is_beauty_video(video):
        beauty_videos.append(video)

print(f"筛选出 {len(beauty_videos)} 条美妆相关视频")

# 保存到 beauty-videos.json
output_path = "d:/saiker/DyHackthon/douyin/public/data/beauty-videos.json"
with open(output_path, "w", encoding="utf-8") as f:
    json.dump(beauty_videos, f, ensure_ascii=False, indent=2)

print(f"已保存到: {output_path}")

# 显示一些示例
if beauty_videos:
    print("\n前10条美妆视频的标题:")
    for i, video in enumerate(beauty_videos[:10], 1):
        desc = video.get('desc', '无标题')
        print(f"{i}. {desc[:60]}...")
