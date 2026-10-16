import { getItem, setItem, removeItem } from '@/utils/storage'

const state = {
  token: getItem('quiz_token'),
  username: getItem('quiz_username')
}

const mutations = {
  SET_TOKEN(state, token) {
    state.token = token
  },
  SET_USERNAME(state, username) {
    state.username = username
  }
}

const actions = {
  // 模拟登录，账号 admin / 密码 123456
  login({ commit }, { username, password }) {
    return new Promise((resolve, reject) => {
      if (username === 'admin' && password === '123456') {
        const token = 'quiz-token-' + Date.now()
        commit('SET_TOKEN', token)
        commit('SET_USERNAME', username)
        setItem('quiz_token', token)
        setItem('quiz_username', username)
        resolve({ token, username })
      } else {
        reject(new Error('用户名或密码错误'))
      }
    })
  },
  logout({ commit }) {
    commit('SET_TOKEN', '')
    commit('SET_USERNAME', '')
    removeItem('quiz_token')
    removeItem('quiz_username')
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
