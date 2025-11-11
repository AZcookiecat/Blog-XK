import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import BlogView from '../views/BlogView.vue'
import ProjectView from '../views/ProjectView.vue'
import BlogDetailView from '../views/BlogDetailView.vue'
import ProjectDetailView from '../views/ProjectDetailView.vue'
import CollaborationView from '../views/CollaborationView.vue'
import InterviewView from '../views/InterviewView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/blog',
      name: 'blog',
      component: BlogView
    },
    {
      path: '/blog/:id',
      name: 'blog-detail',
      component: BlogDetailView
    },
    {
      path: '/projects',
      name: 'projects',
      component: ProjectView
    },
    {
      path: '/projects/:id',
      name: 'project-detail',
      component: ProjectDetailView
    },
    {
      path: '/contact',
      name: 'contact',
      redirect: { name: 'home' }
    },
    {
      path: '/collaboration',
      name: 'collaboration',
      component: CollaborationView
    },
    {
      path: '/interview',
      name: 'interview',
      component: InterviewView
    }
  ]
})

export default router