<template>
    <div class="adminTop">
        <div class="adminTop-left"><img src="../../assets/images/logo.jpg"></div>
        <div class="adminTop-right">
            <div class="adminleft-user">
                <div class="adminleft-name">
                    <el-dropdown @command="handleTopUserMenu">
                        <div class="el-dropdown-link">
                           欢迎， {{user.real_name}} 老师<i class="el-icon-caret-bottom el-icon-right"></i>
                        </div>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="edit"><i class="mb mb-bianji"></i> 修改密码</el-dropdown-item>
                            <el-dropdown-item command="logout"><i class="mb mb-tuichu"></i> 退出登录</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
            </div>
        </div>

        <!--修改密码-->
        <el-dialog title="修改密码" :visible.sync="dialogFormVisible" :append-to-body="true">
            <el-alert
    title="请输入相关信息进行修改密码的验证"
    type="info"
    description="密码长度需为8-20位，需包含英文字符/数字（英文字符区分大小写，符号区分全角/半角）"
    show-icon /> 
            <el-form ref="editForm" class="editPass" label-width="100px" :model="editpwd" :rules="rules" style="margin-top:20px">
                <el-form-item prop="oldPass" label="原密码">
                    <el-col :span="22">
                        <el-input auto-complete="off" v-model="editpwd.oldPass" show-password />
                    </el-col>
                </el-form-item>
                <el-form-item label="新密码" prop="newPass">
                    <el-col :span="22">
                        <el-input auto-complete="off" v-model="editpwd.newPass" show-password />
                    </el-col>
                </el-form-item>
                <el-form-item label="确认新密码" prop="checkPass">
                    <el-col :span="22">
                        <el-input auto-complete="off" v-model="editpwd.checkPass" show-password />
                    </el-col>
                </el-form-item>
                <el-form-item prop="uCode" label="验证码">
                    <el-col :span="14">
                        <el-input auto-complete="off" placeholder="请输入验证码" v-model="editpwd.uCode"></el-input> 
                    </el-col>
                    <el-col :span="6"><valid-code ref="validCodeComp" :value.sync="validCode" height="50px" style="margin-left:4px;" /> </el-col>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="editPwdFn" :loading="loading">确定修改</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import ValidCode from '@/components/ValidCode'
    export default {
        data() {
            const checkValidCode = (rule, value, callback) => {
                if (!value) {
                    callback(new Error('请输入验证码'))
                } else if (value.toUpperCase() !== this.validCode.toUpperCase()) {
                    callback(new Error('验证码不正确'))
                } else {
                    callback()
                }
            }
            const checkNewPwd= (rule, value, callback) => {
                if (value.length<8 || value.length>20) {
                    callback(new Error('长度在 8 到 20 个字符'));
                }else {
                    if(this.checkPassFormat(value)){
                        callback()
                    }else{
                        callback(new Error('最少拥有大写字母/小写字母/数字中的两项'));
                    }
                }
            }
            const checkConfirmPwd= (rule, value, callback) => {
                if (value!=this.editpwd.newPass) {
                    callback(new Error('两次输入密码不一致'));
                }else {
                    callback();
                }
            }
            return {
               user:"",
               dialogFormVisible:false,
               loading:false,
               validCode:"",
               editpwd:{
                   oldPass:'',
                   newPass:'',
                   checkPass:'',
                   uCode:''
               },
               rules: {
                    oldPass:[
                        { required: true, message: '请输入原密码', trigger: 'blur' },
                        { min:8, max: 20, message: '长度在 8 到 20 个字符', trigger: 'blur' }
                    ],
                    newPass: [
                        { required: true, message: '请输入新密码', trigger: 'blur' },
                        { validator: checkNewPwd, trigger: 'change' }
                    ],
                    checkPass: [
                        { required: true, message: '请输入确认新密码', trigger: 'blur' },
                        { validator: checkConfirmPwd, trigger: 'blur' }
                    ],
                    uCode:[
                        { validator: checkValidCode, trigger: 'blur' }
                    ]
                }
            }
        },
        components: {
            ValidCode
        },
        methods: {
            handleTopUserMenu(command){
                switch(command){
                    case "edit":
                        this.showPwdFn();
                        break;
                    case "logout":
                        this.logoutFn();
                        break;
                }
            },
            //退出登录
            logoutFn(){
                this.$ajax({
                    method: 'post',
                    url:  'resource/member/logut',
                    data: this.qs.stringify({
                        uid: this.user.uid
                    })
                }).then( (res)=> {
                    this.$store.dispatch('LogoutUser');
                    this.$router.replace("/login");
                }).catch((response) => {
                    this.$router.replace("/login");
                    this.$store.dispatch('LogoutUser');
                });
            },
            //显示修改密码弹框
            showPwdFn(){
                this.dialogFormVisible= true;
                if(this.$refs["validCodeComp"]){
                    this.$refs["validCodeComp"].refreshCode();
                }
            },
            //修改密码
            editPwdFn(){
                this.$refs["editForm"].validate((valid) => {
                    if (valid) {
                        this.loading = true;
                        this.$ajax({
                            method: 'post',
                            url:  'resource/member/usersavepwd',
                            data: this.qs.stringify(
                                {
                                    user_id:this.user.uid,
                                    user_new_pwd:this.md5(this.editpwd.newPass),
                                    user_old_pwd:this.md5(this.editpwd.oldPass)
                                }
                            )
                        }).then( (res)=> {
                            this.loading = false;
                            this.$notify({title: '修改成功', message: '成功修改密码，请重新登录!',type: 'success'});
                            this.dialogFormVisible=false;
                            this.$store.dispatch('LogoutUser');
                            this.$router.replace("/login");
                        }).catch( (res)=> {
                            this.loading = false;
                            this.editpwd.uCode='';
                            this.$refs["validCodeComp"].refreshCode();
                        });
                    } else {
                        return false;
                    }
                });
            }
        },
        mounted(){
            let userinfo = this.$store.getters.user;
            if(userinfo){
                this.user = JSON.parse(userinfo);
            }
        }
    }

</script>
<style rel="stylesheet/scss"  type="text/scss" lang="scss">
.adminTop{ height:70px; position: fixed; left:0; top:0; right:0; z-index: 32; background:#FCD000;   font-size:18px; color:#666666;}
    .adminTop-left{ float:left; height:55px;padding-left: 6px; margin-top:4px; line-height: 42px;}
    .adminTop-left img{ user-select: none; height:55px; max-width:100%; float:left; margin-top:4px;}
    .adminCont{ padding-top:70px; padding-left:220px; box-sizing: border-box; min-height:100vh; background: #f6f8f7;}
    .adminTop-right{float:right;}
    .adminBox{ padding:20px;}
    .adminleft-pic{ float:left; height:35px; width:35px; overflow: hidden; border-radius: 50%; margin-top: 11px; margin-right:6px;}
    .adminleft-pic img{ width:100%; height:100%;}
    .adminleft-name{ float:left; height:70px; margin-top:0px; line-height:70px; padding:0 10px 0 10px; cursor: pointer;}
    .adminleft-name:hover{ background: rgba(255,255,255,0.1);}
    .adminFoot{ text-align: center; color:#999; font-size:12px; padding:10px;}
    .adminleft-user{ float:left;}
    .adminleft-user .el-dropdown{ color:#666;}
    .adminTop img{ vertical-align: top;}
    
    .el-dropdown-menu{
        .iconfont{color:#666; font-size:14px; margin-right: 4px;}
    }
    @media screen and (max-width:764px){
        .adminCont{padding-left:0px; padding-top:0px;}
        .adminTop{ font-size:12px;}
        .adminTop-left{ width:50%}
        .adminTop-left img{ float:left; max-width: 100%;}
        .adminTop-left span{ margin-top:20px; white-space: pre-wrap; word-break: break-all;}
    }
    @media screen and (max-width:320px){
        .adminTop{ font-size:12px;}
        .adminleft-pic{ display: none;}
    }
</style>
