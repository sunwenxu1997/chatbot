<script setup>
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import { getCurrentInstance } from 'vue'

// 获取全局代理对象
// const { proxy } = getCurrentInstance()
// proxy.$message.success('This is a success message')

onMounted(() => {
  console.log('App.vue mounted')
})
</script>

<template>
  <RouterView />
</template>

<style scoped></style>
