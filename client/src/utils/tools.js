import { resolve } from '_any-promise@1.3.0@any-promise';

const KEY = "15a303177bc3fbd375fc2769c6d9bdc7";
const SECERT = "15a303177bc3fbd375fc2769c6d9bdc7";
var token = "";
var timediff = 0; //服务器跟本机的时间差
export default {
    install(Vue, options) {
        //数据每页条数
        Vue.prototype.page_size = 12;
        Vue.prototype.SECERT = SECERT;

        //去除两端空格
        Vue.prototype.trim = function (s) {
            s = s.toString();
            return s.replace(/(^\s*)|(\s*$)/g, "");
        }
        
        //生成token
        Vue.prototype.initToken = function () {
            let localdate = new Date();
            let localstamp = Math.floor(localdate.getTime()/1000);
            let timestamp = localstamp;
            if(!token){
                this.$ajax({
                    method: 'post',
                    url:  '/admin/time'
                }).then( (res)=> {
                    let rd=res.data;
                    if(rd.code==200000){
                        timestamp = rd.data.timestamp;
                        timediff = timestamp - localstamp;
                    }
                })
            }
        }

        //生成请求参数sign
        Vue.prototype.getSign = function(datastr){
            //qs转义回来进行加密处理
            let obj=this.qs.parse(datastr);
            let tmparr = [];
            for(let i in obj){
                let itemstr = i+"="+obj[i];
                tmparr.push(itemstr);
            }
            tmparr=tmparr.sort();
            let pstr = tmparr.join("");
            pstr = pstr + SECERT;
            let sign = this.md5(pstr);
            //设置每次时间戳
            return sign;
        }

        
        //验证是否有权限
        Vue.prototype.isHasAuth = function(rolename){
            let ustr = this.$store.getters.user;
            let uobj = JSON.parse(ustr);
            if(uobj.uid==1){
                return true;
            }else{
                let enable = uobj.auth.indexOf(rolename)>-1;
                if(enable){
                    return true;
                }else{
                    return false;
                }
            }
            
        }

        //生成请求参数sign
        Vue.prototype.initRequestConfig = function(config){
            let localdate = new Date();
            let localstamp = Math.floor(localdate.getTime()/1000);  
            var curstamp = localstamp + timediff; 
            var strmd5 = KEY + "&" + SECERT + "&"+ curstamp;
            token = this.md5(strmd5); 
            //config.headers['KEY'] = KEY;
            //config.headers['stu-token'] = token;
            //config.headers['timestamp'] = curstamp;
        }

        /**
        * Fisher-Yates 洗牌算法
        * 对传入数组进行随机排序，然后把这个数组返回出来
        */
        Vue.prototype.shuffleArray = function (array) {
            const endIndex = array.length - 2;
            for (let i = 0; i <= endIndex; i++) {
                const j = i + Math.floor(Math.random() * (array.length - i));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array
        }
        
        /**
        * 检测输入的密码格式是否正确
        */
        Vue.prototype.checkPassFormat = (value) => {
            let reg1 =  /[0-9]/;
            let reg2 =  /[a-z]/;
            let reg3 =  /[A-Z]/; 
            var reglen = 0;//包含组合数量
            if(reg1.test(value)){
                reglen++;
            }
            if(reg2.test(value)){
                reglen++;
            }
            if(reg3.test(value)){
                reglen++;
            }
            if(reglen<2){
                return false;
            }else{
                return true;
            }
        }
    }
}
