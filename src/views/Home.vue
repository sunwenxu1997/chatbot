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
}
// 点击智能体，页面跳转，携带智能体ID
const clickAgentItem = (item) => {
  console.log(item)
  // 跳转到聊天页面
  $router.push({ path: '/chat', query: { bot_id: item.bot_id } })
}
</script>
<!-- 生成一个居中在页面的表格table，展示 agentList 包含 icon_url bot_name -->
<template>
  <div class="home">
    <table>
      <tbody>
        <tr v-for="item in agentList" :key="item.bot_id">
          <td @click="clickAgentItem(item)">
            <img :src="item.icon_url" alt="icon" />
            <p>{{ item.bot_name }}</p>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<style scoped>
.home {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
table {
  border-collapse: collapse;
}
td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: center;
  width: 150px;
  height: 150px;
  cursor: pointer;
}
img {
  width: 50px;
  height: 50px;
}
</style>
