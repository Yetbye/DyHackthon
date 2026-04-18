<template>
  <div class="agent-config-page">
    <div class="header">
      <div class="back-btn" @click="goBack">
        <img src="@/assets/img/icon/back.png" alt="返回" />
      </div>
      <div class="title">AI配置</div>
      <div class="save-btn" @click="saveConfig">保存</div>
    </div>

    <div class="config-content">
      <div class="config-section">
        <div class="section-title">大模型API配置</div>
        <div class="form-item">
          <label>API地址</label>
          <input 
            v-model="config.apiUrl" 
            type="text" 
            placeholder="https://api.example.com/v1/chat/completions"
          />
        </div>
        <div class="form-item">
          <label>API密钥</label>
          <input 
            v-model="config.apiKey" 
            type="password" 
            placeholder="sk-xxxxxxxxxxxxxxxx"
          />
        </div>
        <div class="form-item">
          <label>模型名称</label>
          <input 
            v-model="config.model" 
            type="text" 
            placeholder="gpt-3.5-turbo"
          />
        </div>
        <div class="test-section">
          <button 
            class="test-btn" 
            @click="testAPI" 
            :disabled="isTesting"
          >
            {{ isTesting ? '测试中...' : '测试API连接' }}
          </button>
          <div v-if="testResult" class="test-result" :class="testResult.status">
            {{ testResult.message }}
          </div>
        </div>
      </div>

      <div class="config-section">
        <div class="section-title">高级设置</div>
        <div class="form-item">
          <label>Temperature (创造性)</label>
          <input 
            v-model.number="config.temperature" 
            type="range" 
            min="0" 
            max="1" 
            step="0.1"
          />
          <span class="range-value">{{ config.temperature }}</span>
        </div>
        <div class="form-item">
          <label>最大Token数</label>
          <input 
            v-model.number="config.maxTokens" 
            type="number" 
            placeholder="500"
          />
        </div>
      </div>

      <div class="config-section">
        <div class="section-title">数据管理</div>
        <div class="data-actions">
          <button class="action-btn danger" @click="clearAllData">
            清空所有数据
          </button>
          <p class="action-desc">这将清除您的浏览历史、搜索记录、推荐记录等所有数据</p>
        </div>
      </div>

      <div class="config-section">
        <div class="section-title">关于</div>
        <div class="about-content">
          <p>美妆小助手 v1.0</p>
          <p>基于大语言模型的智能美妆推荐系统</p>
          <p>支持个性化推荐、智能问答、商品推荐等功能</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getLLMConfig, saveLLMConfig } from '@/agent/llm-api'
import { useAgentStore } from '@/stores/agent'

const router = useRouter()
const store = useAgentStore()

const config = ref({
  apiUrl: 'https://api.longcat.chat/openai/v1/chat/completions',
  apiKey: '',
  model: 'LongCat-Flash-Lite',
  temperature: 0.7,
  maxTokens: 2000
})

const isTesting = ref(false)
const testResult = ref<{ status: 'success' | 'error'; message: string } | null>(null)

onMounted(() => {
  const savedConfig = getLLMConfig()
  config.value = { ...config.value, ...savedConfig }
})

const goBack = () => {
  router.back()
}

const saveConfig = () => {
  saveLLMConfig(config.value)
  alert('配置已保存')
  goBack()
}

const testAPI = async () => {
  if (!config.value.apiUrl || !config.value.apiKey) {
    testResult.value = { status: 'error', message: '请先填写API地址和密钥' }
    return
  }

  isTesting.value = true
  testResult.value = null

  try {
    const response = await fetch(config.value.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.value.apiKey}`
      },
      body: JSON.stringify({
        model: config.value.model,
        messages: [
          { role: 'user', content: '你好' }
        ],
        max_tokens: 10
      })
    })

    if (response.ok) {
      testResult.value = { status: 'success', message: '✅ API连接成功！' }
    } else {
      const error = await response.text()
      testResult.value = { status: 'error', message: `❌ API错误: ${response.status} - ${error}` }
    }
  } catch (error: any) {
    testResult.value = { status: 'error', message: `❌ 连接失败: ${error.message}` }
  } finally {
    isTesting.value = false
  }
}

const clearAllData = () => {
  if (confirm('确定要清空所有数据吗？此操作不可恢复。')) {
    store.clearAllData()
    alert('数据已清空')
  }
}
</script>

<style scoped lang="less">
.agent-config-page {
  min-height: 100vh;
  background: #f5f5f5;
}

.header {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background: #161823;
  color: white;
}

.back-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  
  img {
    width: 24px;
    height: 24px;
  }
}

.title {
  flex: 1;
  text-align: center;
  font-size: 17px;
  font-weight: 600;
}

.save-btn {
  width: 50px;
  text-align: right;
  color: #ff69b4;
  font-size: 15px;
  cursor: pointer;
}

.config-content {
  padding: 16px;
}

.config-section {
  background: white;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
}

.section-title {
  font-size: 15px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
}

.form-item {
  margin-bottom: 16px;
  
  &:last-child {
    margin-bottom: 0;
  }
  
  label {
    display: block;
    font-size: 14px;
    color: #666;
    margin-bottom: 8px;
  }
  
  input[type="text"],
  input[type="password"],
  input[type="number"] {
    width: 100%;
    padding: 12px;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    font-size: 14px;
    box-sizing: border-box;
    
    &:focus {
      outline: none;
      border-color: #ff69b4;
    }
  }
  
  input[type="range"] {
    width: calc(100% - 50px);
    vertical-align: middle;
  }
  
  .range-value {
    display: inline-block;
    width: 40px;
    text-align: right;
    font-size: 14px;
    color: #ff69b4;
    font-weight: 600;
  }
}

.data-actions {
  .action-btn {
    width: 100%;
    padding: 14px;
    border: none;
    border-radius: 8px;
    font-size: 15px;
    cursor: pointer;
    transition: all 0.2s;
    
    &.danger {
      background: #ff4757;
      color: white;
      
      &:hover {
        background: #ff3344;
      }
    }
  }
  
  .action-desc {
    font-size: 12px;
    color: #999;
    margin-top: 8px;
    text-align: center;
  }
}

.about-content {
  text-align: center;
  
  p {
    font-size: 14px;
    color: #666;
    margin-bottom: 8px;
    
    &:first-child {
      font-size: 16px;
      font-weight: 600;
      color: #333;
    }
  }
}

.test-section {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}

.test-btn {
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #ff69b4, #ff1493);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover:not(:disabled) {
    opacity: 0.9;
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

.test-result {
  margin-top: 12px;
  padding: 10px;
  border-radius: 6px;
  font-size: 14px;
  text-align: center;
  
  &.success {
    background: #d4edda;
    color: #155724;
  }
  
  &.error {
    background: #f8d7da;
    color: #721c24;
  }
}
</style>
