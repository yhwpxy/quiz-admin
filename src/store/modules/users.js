import { getItem, setItem } from '@/utils/storage'

const STORAGE_KEY = 'quiz_users'

// 初始模拟数据
const SEED = [
  { id: 1, username: '张三', password: '123456', email: 'zhangsan@qq.com', registerTime: '2016-05-02 10:20:30' },
  { id: 2, username: '李四', password: '123455', email: 'lisi@163.com', registerTime: '2016-05-04 09:15:22' },
  { id: 3, username: '王五', password: '123456', email: 'wangwu@126.com', registerTime: '2016-05-09 14:30:08' },
  { id: 4, username: '赵六', password: '123456', email: 'zhaoliu@qq.com', registerTime: '2016-05-12 16:45:50' },
  { id: 5, username: '孙七', password: 'abc123', email: 'sunqi@outlook.com', registerTime: '2016-06-01 08:05:11' },
  { id: 6, username: '周八', password: '123456', email: 'zhouba@qq.com', registerTime: '2016-06-08 11:22:33' },
  { id: 7, username: '吴九', password: '666666', email: 'wujiu@163.com', registerTime: '2016-06-15 20:18:44' }
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
  fetchUsers({ commit }) {
    commit('SET_LIST', load())
  },
  addUser({ state, commit }, user) {
    const list = [{ ...user, id: Date.now() }, ...state.list]
    commit('SET_LIST', list)
    setItem(STORAGE_KEY, JSON.stringify(list))
  },
  updateUser({ state, commit }, user) {
    const list = state.list.map(item => (item.id === user.id ? user : item))
    commit('SET_LIST', list)
    setItem(STORAGE_KEY, JSON.stringify(list))
  },
  deleteUser({ state, commit }, id) {
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
