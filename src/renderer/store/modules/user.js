import { login, logout, getInfo } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'

const user = {
  state: {
    token: getToken(),
    userId: '',
    status: '',
    code: '',
    name: '',
    avatar: '',
    introduction: '',
    birday: '',
    gender: '',
    addres: '',
    mobile: '',
    roles: [],
    setting: {
      articlePlatform: []
    },
    ip: '',
    // 定时器队列
    queueCron: []
  },

  mutations: {
    SET_USER: (state, user) => {
      state.userId = user.id
      state.name = user.nickname
      state.avatar = user.image ? user.image : 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif'
      state.introduction = user.nickname
      state.birday = user.birday
      state.gender = user.gender
      state.addres = user.addres
      state.mobile = user.mobile
      state.roles = user.roles
      state.queueCron = []
    },
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_QUEUECRON: (state, queueCron) => {
      state.queueCron = queueCron
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        login(username, userInfo.password).then(data => {
          setToken(data.token)
          commit('SET_TOKEN', data.token)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo({ commit }) {
      return new Promise((resolve, reject) => {
        getInfo().then(response => {
          const { user } = response
          if (!user) {
            reject('获取用户信息失败！')
          }
          if (user.roles && user.roles.length > 0) { // 验证返回的roles是否是一个非空数组
            commit('SET_ROLES', user.roles)
          } else {
            reject('获取用户权限失败！')
          }
          commit('SET_USER', user)
          resolve(user)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          commit('SET_QUEUECRON', [])
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        removeToken()
        commit('SET_TOKEN', '')
        commit('SET_QUEUECRON', [])
        resolve()
      })
    }
  }
}

export default user
