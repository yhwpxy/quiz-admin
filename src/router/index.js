import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '@/layout/index.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: { title: '登录' }
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        meta: { title: '首页', icon: 'el-icon-s-home' }
      },
      {
        path: 'user',
        name: 'UserManage',
        component: () => import('@/views/user/index.vue'),
        meta: { title: '用户管理', icon: 'el-icon-user' }
      },
      {
        path: 'question',
        name: 'QuestionManage',
        component: () => import('@/views/question/index.vue'),
        meta: { title: '题目管理', icon: 'el-icon-document' }
      },
      {
        path: 'system',
        name: 'SystemInfo',
        component: () => import('@/views/system/index.vue'),
        meta: { title: '系统信息', icon: 'el-icon-info' }
      }
    ]
  },
  { path: '*', redirect: '/dashboard' }
]

const router = new VueRouter({
  routes
})

// 全局前置守卫：未登录跳转到登录页
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('quiz_token')
  if (to.path !== '/login' && !token) {
    next('/login')
  } else if (to.path === '/login' && token) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router
