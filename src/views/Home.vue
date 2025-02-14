<script setup>
import { publishedBotsList } from '@/api/app'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

// 智能体列表
const agentList = ref([])
const $router = useRouter()

onMounted(() => {
  publishedBotsListFn()
})
// 获取智能体列表
const publishedBotsListFn = async () => {
  // 工作空间ID
  const space_id = '7337522374511853580'
  const res = await publishedBotsList({ space_id })
  agentList.value = res.data.space_bots
  agentList.value.push({
    bot_id: 'coze',
    icon_url: 'https://lf-cdn.coze.cn/obj/unpkg/flow-platform/chat-app-sdk/1.1.0-beta.3/libs/cn/836ebe4738d6a87f1d14.png',
    bot_name: 'coze'
  })
}
// 点击智能体，页面跳转，携带智能体ID
const clickAgentItem = (item) => {
  console.log(item)
  if (item.bot_id === 'coze') {
    window.cozeWebSDK.showChatBot()
    return
  }
  // 跳转到聊天页面
  $router.push({ path: '/chat', query: { bot_id: item.bot_id } })
}
</script>
<!-- 生成一个居中在页面的表格table，展示 agentList 包含 icon_url bot_name -->
<template>
  <div class="home">
    <ul class="agent-list">
      <li v-for="item in agentList" :key="item.bot_id" @click="clickAgentItem(item)">
        <img :src="item.icon_url" alt="icon" />
        <span class="name">{{ item.bot_name }}</span>
      </li>
    </ul>
  </div>
</template>
<style scoped>
.home {
  height: 100vh;
}
.agent-list {
  --size: clamp(1rem, calc(100vw / 3), 10rem);
  list-style: none;
  display: grid;
  grid-template-columns: repeat(auto-fill, var(--size));
  padding: 0;
  margin: 0;
}
.agent-list li {
  height: var(--size);
  border: 1px solid #f3f3f3;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-top: none;
  border-left: none;
}
.agent-list img {
  width: 50%;
  height: 50%;
}
.agent-list .name{
    display: block;
    margin-top: 1rem;
    font-size: 14px;
    color: #333;
    text-align: center;
}
</style>
