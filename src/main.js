import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import './utils/http'
import ElementPlus, { ElMessage } from 'element-plus'
import 'element-plus/dist/index.css'

const app = createApp(App)

// 全局注册$http
app.config.globalProperties.$message = ElMessage

app.use(ElementPlus)
app.use(createPinia())
app.use(router)

app.mount('#app')
