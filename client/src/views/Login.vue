<template>
    <div class="loginBody">
        <div class="loginBox">
            <div class="loginlogo"><div class="logoimg"></div></div>
            <div class="loginTitle">管理后台</div>
            <div class="loginForm">
                <el-form ref="loginform" :model="logform" :rules="rules">
                    <el-form-item prop="uname">
                        <span class="mb mb-yonghu"></span>
                        <el-input placeholder="账号" v-model="logform.uname" auto-complete="off" @keydown.native="keydownForLogin"></el-input>
                    </el-form-item>
                    <el-form-item prop="upass">
                        <span class="mb mb-mima"></span>
                        <el-input auto-complete="off" placeholder="密码"  show-password v-model="logform.upass" @keydown.native="keydownForLogin"></el-input>
                    </el-form-item>
                    <el-form-item prop="ucode">
                        <el-col :span="14">
                        <span class="mb mb-yanzheng"></span>
                        <el-input auto-complete="off" placeholder="验证码" v-model="logform.ucode" @keydown.native="keydownForLogin"></el-input> 
                        </el-col>
                        <el-col :span="6"><valid-code ref="validCodeComp" :value.sync="validCode" height="50px" style="margin-left:4px;" /> </el-col>
                    </el-form-item>
                    <el-form-item>
                        <div class="loginBtnbox"><el-button type="warning" :loading="loginLoading" @click="submitForm" size="large">登录</el-button></div>
                        <!-- <div class="tips">如忘记密码，请联系管理员</div> -->
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <div class="copyright">Copyright© Taozi 版权所有</div>
    </div>
</template>
<script>
    import ValidCode from '@/components/ValidCode'
    export default {
        data() {
            const checkValidCode = (rule, value, callback) => {
                if (!value) {
                    //callback(new Error('请输入验证码'))
                    callback()
                } else if (value.toUpperCase() !== this.validCode.toUpperCase()) {
                    callback(new Error('验证码不正确'))
                } else {
                    callback()
                }
            }
            return {
                loginLoading:false,
                validCode:"",
                logform:{
                    uname:"",  //admin
                    upass:"", //Ml2019stu
                    ucode:''
                },
                rules: {
                    uname: [
                        { required: true, message: '请输入用户名', trigger: 'blur' },
                        { min: 2, max: 15, message: '长度在 2 到 15 个字符', trigger: 'blur' }
                    ],
                    upass: [
                        { required: true, message: '请输入密码', trigger: 'blur' }
                    ],
                    ucode:[
                        { validator: checkValidCode, trigger: 'blur' }
                    ]
                }
            }
        },
        components: {
            ValidCode
        },
        methods: {
            submitForm() {
                //this.$router.replace("/");
                this.$refs['loginform'].validate((valid) => {
                    if (valid) {
                        this.loginLoading = true;
                        this.$ajax({
                            method: 'post',
                            url:  '/admin/user/login',
                            data: this.qs.stringify({
                                name:this.logform.uname,
                                pwd:this.md5(this.SECERT + this.logform.upass)
                            })
                        }).then( (res)=> {
                            this.loginLoading = false;
                            let userobj = res;

                            this.$ajax.defaults.headers.common['Authorization'] = userobj.token;

                            //读取时判断是否一直
                            userobj.localkey = this.md5(userobj.name+userobj.role+"taoziadmin");
                            this.$store.dispatch('LoginByName',userobj);
                            this.$router.replace("/");
                        }).catch( (res)=> {
                            this.loginLoading = false;
                            this.logform.ucode='';
                            this.$refs["validCodeComp"].refreshCode();
                        });
                    } else {
                        return false;
                    }
                });
            },
            keydownForLogin(v){
                if(v.keyCode == 13){
                    //回车登录
                    this.submitForm();
                }
            }
        },
        mounted(){
            //判断是否已登录
            let user = this.$store.getters.user;
            if (user) {
                let u_obj = JSON.parse(user);
                //判断是否被更改
                let tmpkey =  this.md5(u_obj.name+u_obj.avatar+"taoziadmin");
                if(u_obj.localkey == tmpkey){
                    this.$router.replace("/");
                }else{
                    this.$store.dispatch('LogoutUser');
                }
            }
        }
    }
    //
</script>
<style lang="scss">
    .loginTitle{ padding:60px 10px 0; color:#fff;  border-radius: 10px 10px 0px 0px; font-size:24px; text-align: center;color:#333; text-align: center;}
    .loginTitle i{ font-size:10px; display: inline-block; margin-left: 10px; font-style: normal; background: #fff; color:#20a0ff; border-radius: 4px; padding:3px 5px;}
    .loginBody{ width:100%; height:100vh; background-size: cover; background-image: -webkit-linear-gradient( 135deg, #008bfe 0%, #02c6ff 100%);
  background-image: linear-gradient( 135deg, #008bfe 0%, #02c6ff 100%); background-position: center center; 
 overflow: hidden; box-sizing: border-box; padding-bottom:30px;}
    .loginlogo{ width: 150px; height: 150px; position: absolute; left:50%; margin-left: -75px; background-size:cover; top:-75px;}
    .logoimg{  background-size:cover; width:100%; height: 100%;-webkit-animation:circle 10s infinite linear; -moz-animation:circle 10s infinite linear;  animation:circle 10s infinite linear; }
    .loginBox{width: 400px; height:450px; left:50%; top:50%; transform:translate(-50%,-50%);  box-sizing: border-box; border-radius:4px;  background:rgba(255,255,255,0.9); border-radius: 10px; box-shadow: 0 10px 10px rgba(0,0,0,0.1); }
    .loginForm{
        padding:30px 40px 20px;
    }
    .loginMan{ position: absolute;}
    .loginBtnbox{ text-align: center; padding-top:20px;}
    .loginBtnbox .el-button{ width: 100%; padding: 14px 20px;}
    .loginBox{
        position: absolute; right:10%;
        input{
            padding: 12px 5px 12px 15px;
            height: 50px;
            padding-left: 40px;
            color:#333;
        }
        .el-form-item{ position: relative;}
        .iconfont{ position: absolute; left:10px; top:6px; z-index: 2; color:#999; font-size:20px;}
        .tips{ color:#999; text-align: center;}
    }
    .copyright{ position: absolute; bottom:15px; left:0; width:100%; text-align: center; color:#fff; opacity: 0.4; font-size:12px; padding:10px; box-sizing: border-box;}
    .el-form-item__content{ position: relative;}
    .el-form-item__content .mb{ position: absolute; left:14px; top:5px; z-index: 222; font-size:20px; color:#666}
    @media screen and (max-width:764px){
        .loginMan{ display: none;}
        .loginTitle{ background:none; color:#fff; }
        .loginBox{ background: none;box-shadow: none; width:100%; right:0%;}
        .el-checkbox{ color:#fff}
        .loginBtnbox .el-button{ min-width: 100%;}
        .loginlogo{ transform: scale(0.6); top:-40px;}
    }
    @-webkit-keyframes circle {
        0%	 { -webkit-transform: rotate(0deg); }
        100% {-webkit-transform: rotate(360deg); }
    }
    @-moz-keyframes circle {
        0%	 { -moz-transform: rotate(0deg); }
        100% {-moz-transform: rotate(360deg);}
    }
    @keyframes circle {
        0%	 { transform: rotate(0deg); }
        100% {transform: rotate(360deg); }
    }
</style>