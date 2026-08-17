<template>
  <div class="chat-bubble" :class="messageClass">
    <div class="bubble-content">
      <div class="message-text" v-if="message.role === 'user'">{{ message.content }}</div>
      <div
        v-else
        class="message-text ai-message markdown-body"
        v-html="renderedContent"
      ></div>
    </div>
    <div class="message-time" v-if="showTime">{{ formatTime }}</div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  message: {
    type: Object,
    required: true
  }
})

const messageClass = computed(() => {
  return props.message.role === 'user' ? 'user-message' : 'ai-message'
})

const showTime = computed(() => {
  return props.message.timestamp && props.message.content
})

const formatTime = computed(() => {
  if (!props.message.timestamp) return ''
  const date = new Date(props.message.timestamp)
  return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
})

// 轻量级 Markdown 解析（支持 标题/加粗/斜体/列表/代码/换行）
const renderedContent = computed(() => {
  if (!props.message.content) return ''
  return parseMarkdown(props.message.content)
})

function parseMarkdown(text) {
  if (!text) return ''

  // 1. 转义 HTML，防止 XSS
  let escaped = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  // 2. 行内样式：先 code 再 bold 再 italic
  escaped = escaped.replace(/`([^`]+)`/g, '<code>$1</code>')
  escaped = escaped.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  escaped = escaped.replace(/(^|[^*])\*([^*\n]+)\*(?!\*)/g, '$1<em>$2</em>')

  // 3. 块级处理：标题、列表、段落
  const lines = escaped.split('\n')
  const result = []
  let inUl = false
  let inOl = false

  const closeLists = () => {
    if (inUl) { result.push('</ul>'); inUl = false }
    if (inOl) { result.push('</ol>'); inOl = false }
  }

  for (const line of lines) {
    const trimmed = line.trim()

    if (!trimmed) {
      closeLists()
      continue
    }

    // 标题
    const hMatch = trimmed.match(/^(#{1,6})\s+(.*)$/)
    if (hMatch) {
      closeLists()
      const level = hMatch[1].length
      result.push(`<h${level}>${hMatch[2]}</h${level}>`)
      continue
    }

    // 无序列表
    if (/^[-*]\s+/.test(trimmed)) {
      if (!inUl) { closeLists(); result.push('<ul>'); inUl = true }
      result.push(`<li>${trimmed.replace(/^[-*]\s+/, '')}</li>`)
      continue
    }

    // 有序列表
    if (/^\d+\.\s+/.test(trimmed)) {
      if (!inOl) { closeLists(); result.push('<ol>'); inOl = true }
      result.push(`<li>${trimmed.replace(/^\d+\.\s+/, '')}</li>`)
      continue
    }

    closeLists()
    result.push(`<p>${trimmed}</p>`)
  }
  closeLists()

  return result.join('')
}
</script>

<style scoped>
.chat-bubble {
  display: flex;
  flex-direction: column;
  max-width: 80%;
}

.user-message {
  align-self: flex-end;
  align-items: flex-end;
}

.ai-message {
  align-self: flex-start;
  align-items: flex-start;
}

.bubble-content {
  padding: 12px 16px;
  border-radius: 16px;
  font-size: 15px;
  line-height: 1.5;
  word-break: break-word;
}

.user-message .bubble-content {
  background-color: #1989fa;
  color: #fff;
}

.ai-message .bubble-content {
  background-color: #f4f4f5;
  color: #333;
}

.message-time {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
  padding: 0 4px;
}

/* ====== Markdown 渲染样式（需用 :deep 选中 v-html 注入元素） ====== */
.markdown-body {
  font-size: 15px;
  line-height: 1.7;
  word-break: break-word;
}

.markdown-body :deep(p) {
  margin: 6px 0;
}

.markdown-body :deep(p:first-child) {
  margin-top: 0;
}

.markdown-body :deep(p:last-child) {
  margin-bottom: 0;
}

.markdown-body :deep(h1),
.markdown-body :deep(h2),
.markdown-body :deep(h3),
.markdown-body :deep(h4),
.markdown-body :deep(h5),
.markdown-body :deep(h6) {
  font-weight: 600;
  margin: 12px 0 8px;
  line-height: 1.4;
  color: #1a1a1a;
}

.markdown-body :deep(h1) { font-size: 20px; }
.markdown-body :deep(h2) { font-size: 18px; }
.markdown-body :deep(h3) { font-size: 17px; }
.markdown-body :deep(h4) { font-size: 16px; }
.markdown-body :deep(h5),
.markdown-body :deep(h6) { font-size: 15px; }

.markdown-body :deep(strong) {
  font-weight: 600;
  color: #1989fa;
}

.markdown-body :deep(em) {
  font-style: italic;
}

.markdown-body :deep(code) {
  background: rgba(0, 0, 0, 0.06);
  padding: 2px 6px;
  border-radius: 4px;
  font-family: Menlo, Consolas, monospace;
  font-size: 13px;
}

.markdown-body :deep(ul),
.markdown-body :deep(ol) {
  padding-left: 22px;
  margin: 6px 0;
}

.markdown-body :deep(li) {
  margin: 4px 0;
}

.markdown-body :deep(li:last-child) {
  margin-bottom: 0;
}

.markdown-body :deep(li > ul,
.markdown-body li > ol) {
  margin: 4px 0;
}
</style>