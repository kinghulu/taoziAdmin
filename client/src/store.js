import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
     user:window.localStorage.getItem("user"),
     token:window.localStorage.getItem("token"),//后台登录存储身份信息
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
    //设置登录信息
    SET_TOKEN: (state, str) => {
      state.token= str;
    },
    //登出
    CLEAR_TOKEN: (state) => {
        state.token= '';
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
      commit('SET_TOKEN',userInfo.login_token);
      window.localStorage.setItem("user",JSON.stringify(userInfo));
      window.localStorage.setItem("token",userInfo.login_token);
    },
    //登出
    LogoutUser({ commit }) {
        commit('LOGOUT_USER');
        commit('CLEAR_TOKEN');
        window.localStorage.removeItem("user");
        window.localStorage.removeItem("token");
    },
    //设置当前配置课次的对象
    setCourseMatch({ commit }, obj) {
        commit('SET_COURSEMATCH',JSON.stringify(obj));
        window.sessionStorage.setItem("coursematch",JSON.stringify(obj));
    },
  }
})
