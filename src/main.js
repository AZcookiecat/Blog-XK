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

// 创建自定义鼠标元素
const createCustomCursor = () => {
  // 创建自定义光标元素
  const cursor = document.createElement('div')
  cursor.id = 'custom-cursor'
  document.body.appendChild(cursor)
  
  // 监听鼠标移动事件，更新自定义光标的位置
  document.addEventListener('mousemove', (e) => {
    cursor.style.left = `${e.clientX}px`
    cursor.style.top = `${e.clientY}px`
  })
  
  // 监听鼠标离开视窗事件，隐藏光标
  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0'
  })
  
  // 监听鼠标进入视窗事件，显示光标
  document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1'
  })
  
  // 定义可点击元素选择器
  const clickableElements = 'a, button, [role="button"], .clickable, .btn, input[type="button"], input[type="submit"], input[type="reset"]'
  
  // 为可点击元素添加悬停事件监听
  const observeClickables = () => {
    // 为现有元素添加事件监听
    document.querySelectorAll(clickableElements).forEach(element => {
      element.addEventListener('mouseenter', () => {
        cursor.classList.add('cursor-hover')
      })
      element.addEventListener('mouseleave', () => {
        cursor.classList.remove('cursor-hover')
      })
    })
  }
  
  // 初始调用
  observeClickables()
  
  // 使用MutationObserver监听DOM变化，为新添加的可点击元素添加事件
  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      if (mutation.addedNodes.length) {
        observeClickables()
      }
    })
  })
  
  // 开始观察DOM变化
  observer.observe(document.body, { childList: true, subtree: true })
}

// 当DOM加载完成后创建自定义鼠标
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', createCustomCursor)
} else {
  createCustomCursor()
}
