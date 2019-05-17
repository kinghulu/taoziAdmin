import Vue from 'vue'

import ElementUI from 'element-ui';
//import 'element-ui/lib/theme-chalk/index.css';
import './assets/css/c.scss';

import NProgress from 'nprogress'; // Progress 进度条
import 'nprogress/nprogress.css';// Progress 进度条 样式

import axios from 'axios'
import App from './App.vue'

import router from './router'
import store from './store'

var md5 = require('js-md5');
Vue.prototype.md5 = md5;

Vue.config.productionTip = false
Vue.use(ElementUI);

var qs = require('qs');
Vue.prototype.qs = qs;


Vue.prototype.$ajax = axios;
//axios.defaults.withCredentials = true;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

//接口地址
Vue.prototype.baseURL  = process.env.NODE_ENV === 'production'
? 'https://mlstu.baidu.cn/'
: 'http://localhost:3000/';

axios.defaults.baseURL = Vue.prototype.baseURL;
//工具
import util from './utils/tools'
Vue.use(util);

//生成Token
Vue.prototype.initToken();



// 请求前加密参数
axios.interceptors.request.use( config => {
   if(config.data){
     let sign = Vue.prototype.getSign(config.data);
     config.data+="&sign="+sign;
   }
   Vue.prototype.initRequestConfig(config);
   return config;
}, (error) => {
  // Do something with request error
  return Promise.reject(error);
});

//请求成功拦截器，错误处理跳转401等
axios.interceptors.response.use(
  response => {
      let rd = response.data;
      if(rd.code == 20000){
          return rd.data;
      }else{
          Vue.prototype.$message.error(rd.msg);
      }
      if(rd.code == "400025"){
          store.dispatch('LogoutUser')
          router.replace({path: '/login'});
      }
      if(rd.code == "400003"){
         router.replace({path: '/nopermission'});
      }
      return Promise.reject(rd)   // 返回接口返回的错误信息
  },
  error => {
      if (error.response) {
          switch (error.response.status) {
              case 401:
                  // 返回 401 清除token信息并跳转到登录页面
                  router.replace({path: '/401'})
                  break;
              case 404:
                  router.replace({path: '/404'})
                  break;
          }
      }else{
          Vue.prototype.$message.error('网络请求失败，请重试！');
      }
      return Promise.reject(error.response.data)   // 返回接口返回的错误信息
  }
);

//是否已登录登录
const noLoginList = ["/login","/nopermission"];// 不需登录页面名单
router.beforeEach((to, from, next) => {
    NProgress.start(); // 开启Progress
    if (noLoginList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
        next()
    } else {
        let user = store.getters.user
        if (user) { // 判断是否有选择,没有登录 
            //判断是否被更改            
            let u_obj = JSON.parse(user);
            axios.defaults.headers.common['Authorization'] = u_obj.token;
            let tmpkey =  md5(u_obj.name+u_obj.avatar+"taoziadmin");
            if(u_obj.localkey == tmpkey){
                next();            
            }else{
                next({ path: '/login' });
            }
        } else {
            next({ path: '/login' });
            NProgress.done(); // 在hash模式下 改变手动改变hash 重定向回来 不会触发afterEach 暂时hack方案 ps：history模式下无问题，可删除该行！
        }
    }
   
        //next({ path: '/nopermission' });
 
});

router.afterEach(() => {
    NProgress.done(); // 结束Progress
});



new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')