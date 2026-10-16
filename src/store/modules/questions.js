import { getItem, setItem } from '@/utils/storage'

const STORAGE_KEY = 'quiz_questions'

// 题型 / 难度 / 章节 常量
export const QUESTION_TYPES = ['单选题', '多选题', '判断题', '填空题', '简答题']
export const DIFFICULTIES = ['简单', '中等', '困难']
export const CHAPTERS = ['第一章', '第二章', '第三章', '第四章', '第五章']

// 初始模拟题目数据
const SEED = [
  {
    id: 1,
    type: '单选题',
    content: 'HTML 中用于表示“超链接”的标签是？',
    options: ['<a>', '<link>', '<href>', '<url>'],
    answer: 'A',
    chapter: '第一章',
    difficulty: '简单',
    createTime: '2026-01-05 09:20:00'
  },
  {
    id: 2,
    type: '单选题',
    content: 'CSS 中设置背景颜色的属性是？',
    options: ['color', 'bgcolor', 'background-color', 'background'],
    answer: 'C',
    chapter: '第一章',
    difficulty: '简单',
    createTime: '2026-01-05 09:30:00'
  },
  {
    id: 3,
    type: '多选题',
    content: '下列属于前端框架的有？',
    options: ['Vue', 'React', 'Angular', 'Django'],
    answer: 'A,B,C',
    chapter: '第二章',
    difficulty: '中等',
    createTime: '2026-01-06 10:00:00'
  },
  {
    id: 4,
    type: '判断题',
    content: 'JavaScript 是一门编译型语言。',
    options: ['正确', '错误'],
    answer: '错误',
    chapter: '第一章',
    difficulty: '简单',
    createTime: '2026-01-06 10:20:00'
  },
  {
    id: 5,
    type: '填空题',
    content: 'Vue 中用于实现组件间通信的全局状态管理库是 ____。',
    options: [],
    answer: 'Vuex',
    chapter: '第三章',
    difficulty: '中等',
    createTime: '2026-01-07 11:00:00'
  },
  {
    id: 6,
    type: '简答题',
    content: '请简述 Element UI 中 el-table 组件的作用。',
    options: [],
    answer: '用于以表格形式展示数据，支持排序、筛选、多选、分页等能力。',
    chapter: '第四章',
    difficulty: '中等',
    createTime: '2026-01-07 14:30:00'
  },
  {
    id: 7,
    type: '单选题',
    content: 'Vue Router 中默认使用的路由模式是？',
    options: ['history', 'hash', 'abstract', 'memory'],
    answer: 'B',
    chapter: '第三章',
    difficulty: '简单',
    createTime: '2026-01-08 09:00:00'
  },
  {
    id: 8,
    type: '多选题',
    content: 'Element UI 中常用的表单组件有？',
    options: ['el-input', 'el-select', 'el-date-picker', 'el-upload'],
    answer: 'A,B,C,D',
    chapter: '第四章',
    difficulty: '简单',
    createTime: '2026-01-08 15:10:00'
  },
  {
    id: 9,
    type: '填空题',
    content: '在 Vuex 中，修改 state 的唯一途径是提交 ____。',
    options: [],
    answer: 'mutation',
    chapter: '第三章',
    difficulty: '困难',
    createTime: '2026-01-09 10:40:00'
  },
  {
    id: 10,
    type: '判断题',
    content: 'Element UI 的 el-menu 组件支持路由跳转模式。',
    options: ['正确', '错误'],
    answer: '正确',
    chapter: '第四章',
    difficulty: '简单',
    createTime: '2026-01-09 16:00:00'
  },
  {
    id: 11,
    type: '单选题',
    content: 'localStorage 中保存的数据在什么情况下会被清除？',
    options: ['刷新页面', '关闭浏览器', '手动删除', '退出登录'],
    answer: 'C',
    chapter: '第五章',
    difficulty: '中等',
    createTime: '2026-01-10 09:15:00'
  },
  {
    id: 12,
    type: '简答题',
    content: '谈谈你对前后端分离开发模式的理解。',
    options: [],
    answer: '前端负责界面与交互，后端负责接口与数据，两者通过 HTTP 接口通信。',
    chapter: '第五章',
    difficulty: '困难',
    createTime: '2026-01-10 11:30:00'
  }
]

function load() {
  const raw = getItem(STORAGE_KEY)
  if (raw) {
    try {
      const data = JSON.parse(raw)
      if (Array.isArray(data)) return data
    } catch (e) {
      /* 数据损坏则回退到初始数据 */
    }
  }
  return SEED.slice()
}

const state = {
  list: load()
}

const mutations = {
  SET_LIST(state, list) {
    state.list = list
  }
}

const actions = {
  fetchQuestions({ commit }) {
    commit('SET_LIST', load())
  },
  addQuestion({ state, commit }, question) {
    const list = [{ ...question, id: Date.now() }, ...state.list]
    commit('SET_LIST', list)
    setItem(STORAGE_KEY, JSON.stringify(list))
  },
  updateQuestion({ state, commit }, question) {
    const list = state.list.map(item => (item.id === question.id ? question : item))
    commit('SET_LIST', list)
    setItem(STORAGE_KEY, JSON.stringify(list))
  },
  deleteQuestion({ state, commit }, id) {
    const list = state.list.filter(item => item.id !== id)
    commit('SET_LIST', list)
    setItem(STORAGE_KEY, JSON.stringify(list))
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
