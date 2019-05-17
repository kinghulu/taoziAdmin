import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
     user:window.localStorage.getItem("user"),
     coursematch:window.sessionStorage.getItem("coursematch"),//当前具体课次配置对象
  },
  getters: {
    user: state => {
      return state.user;
    },
    token:state=>{
      return state.token;
    },
    coursematch:state=>{
      return state.coursematch;
    }
  },
  mutations: {
    //设置登录信息
    SET_USER: (state, obj) => {
      state.user= obj;
    },
    //登出
    LOGOUT_USER: (state) => {
        state.user= '';
    },
    //设置
    SET_COURSEMATCH: (state, obj) => {
        state.coursematch= obj;
    },
  },
  actions: {
    //登录后保存Token
    LoginByName({ commit }, userInfo) {
      commit('SET_USER',JSON.stringify(userInfo));
      window.localStorage.setItem("user",JSON.stringify(userInfo));
    },
    //登出
    LogoutUser({ commit }) {
        commit('LOGOUT_USER');
        window.localStorage.removeItem("user");
    },
  }
})
