<script setup>
import { ref, reactive, onMounted } from 'vue'
import { createSession, getOnlineInfo } from '@/api/app'
import { useRoute } from 'vue-router'
import { parseEventStream, scrollToBottom } from '@/utils/index'
import { marked } from 'marked'

// 获取路由参数
const $route = useRoute()
const { bot_id } = $route.query
const state = reactive({
  // 智能体信息
  agentInfo: {
    bot_id: '',
    icon_url: '',
    name: ''
  },
  // 聊天列表
  chatMessageList: []
})
// 输入框的值
const inputValue = ref('')

onMounted(() => {
  getOnlineInfoFn()
})
// 根据 bot_id 获取智能体信息
const getOnlineInfoFn = async () => {
  const res = await getOnlineInfo({ bot_id })
  // 批量更新智能体信息
  Object.assign(state.agentInfo, res.data)
}
// 发送消息
const createSessionFn = async () => {
  const chat_content_el = document.querySelector('.chat-content')
  if (!inputValue.value) return
  const { bot_id } = state.agentInfo
  const content = inputValue.value
  state.chatMessageList.push({
    id: new Date().getTime(),
    content,
    type: 'user'
  })
  scrollToBottom(chat_content_el)
  inputValue.value = ''
  const params = {
    bot_id: bot_id,
    user_id: 'admin',
    stream: true,
    auto_save_history: true,
    additional_messages: [
      {
        role: 'user',
        content: content,
        content_type: 'text'
      }
    ]
  }
  // 创建对话
  createSession(params).then(async (response) => {
    // 通过事件流获取对话消息
    const reader = response.data.getReader() // 获取 ReadableStream 的 reader
    const decoder = new TextDecoder('utf-8') // 用于将二进制数据解码为字符串
    let stream_list = []
    while (true) {
      const { done, value } = await reader.read() // 读取数据块
      if (done) {
        console.log('数据流接收完成')
        break
      }

      const stream = parseEventStream(decoder.decode(value))
      stream_list.push(stream)
      console.log('stream_list:', stream_list.flat())
      const { chat_agent_message_id, answer_data_content } = handleStreamList(stream_list.flat())
      const chat_agent_message = {}
      chat_agent_message.id = chat_agent_message_id
      chat_agent_message.content = answer_data_content
      // 判断如果state.chatMessageList 存在id一致的，则文本追加
      const id_index = state.chatMessageList.findIndex((c) => c.id === chat_agent_message_id)
      if (id_index > -1) {
        state.chatMessageList[id_index].content = marked(answer_data_content)
      } else {
        state.chatMessageList.push(chat_agent_message)
      }
      console.log(state.chatMessageList)
      scrollToBottom(chat_content_el)
    }
  })
}
// 处理stream_list数据
const handleStreamList = (stream_list) => {
  /**
   * conversation.message.delta 增量消息，通常是 type=answer 时的增量消息。
   */
  const chat_agent_message_id = stream_list.filter((item) => item.event === 'conversation.chat.created')[0].data.id
  const answer_data_list = stream_list.filter((item) => item.event === 'conversation.message.delta').map((item) => item.data)
  console.log('answer_data_list:', answer_data_list)
  const answer_data_content = answer_data_list.map((item) => item.content).join('')
  console.log('answer_data_content:', answer_data_content)
  return {
    chat_agent_message_id,
    answer_data_content
  }
}
</script>

<template>
  <div class="chat-body">
    <!-- 生成一个聊天界面 -->
    <div class="chat">
      <div class="chat-header">
        <img :src="state.agentInfo.icon_url" alt="icon" />
        <p>{{ state.agentInfo.name }}</p>
      </div>
      <div class="chat-content">
        <div v-for="item in state.chatMessageList" :key="item.id" class="chat-item">
          <div v-if="item.type === 'user'" class="chat-item-user">
            <p v-html="item.content"></p>
          </div>
          <div v-else class="chat-item-agent">
            <p v-if="item.content" v-html="item.content"></p>
          </div>
        </div>
      </div>
      <div class="chat-input">
        <input v-model="inputValue" @keyup.enter="createSessionFn" />
        <button @click="createSessionFn">发送</button>
      </div>
    </div>
  </div>
</template>
<style scoped>
.chat-body {
  width: 100vw;
  height: 100vh;
  display: grid;
  place-content: center;
}
.chat {
  display: flex;
  flex-direction: column;
  width: 100vw;
  max-width: 500px;
  height: 100vh;
}
.chat-header {
  display: flex;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #f3f3f3;
  font-size: 0.88rem;
  color: #5a5a5a;
}
.chat-header img {
  width: 4rem;
  height: 4rem;
  margin-right: 1rem;
}
.chat-content {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  color: #222;
  font-size: 0.88rem;
  font-weight: 200;
}
.chat-content p {
  display: inline-block;
  padding: 0.8rem;
  margin: 0;
  background: #f3f3f3;
  border-radius: 0.5rem;
  line-height: 1.5em;
  letter-spacing: 0.1em;
}
.chat-item {
  margin: 10px 0;
}
.chat-item-user {
  text-align: right;
}
.chat-item-user p {
  background: #d0bef3;
}
.chat-item-agent {
  text-align: left;
}
.chat-input {
  display: flex;
  align-items: center;
  padding: 0.8rem;
  border-top: 1px solid #f3f3f3;
  height: 2.5rem;
}
.chat-input input {
  display: block;
  width: 100%;
  height: 100%;
  margin-right: 10px;
  box-sizing: border-box;
  border-radius: 0.5rem;
  border: 1px solid #e0e0e0;
  outline: none;
  padding: 0.5rem;
  color: #5a5a5a;
}
.chat-input button {
  min-width: 25%;
  height: 100%;
  padding: 5px 10px;
  background: #8a53f9;
  color: white;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
}
</style>
