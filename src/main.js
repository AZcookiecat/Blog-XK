import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
// 导入FontAwesome图标库
import '@fortawesome/fontawesome-free/css/all.css'

const app = createApp(App)

// 使用路由
app.use(router)

app.mount('#app')
