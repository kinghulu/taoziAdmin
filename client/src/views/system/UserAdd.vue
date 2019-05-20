<template>
    <div class="files">
        <div class="pagetopBox">
            <h2 class="pageTitle">新增用户</h2>
        </div>
        <div class="course_box">
            <el-form ref="addform" :model="adduser" :rules="rules" label-width="180px" label-position="right">
                <el-form-item label="用户姓名" prop="real_name">
                    <el-col :span="11">
                        <el-input v-model="adduser.real_name" /> 
                    </el-col>
                </el-form-item>
                <el-form-item label="用户账号" prop="user_name">
                    <el-col :span="11">
                        <el-input v-model="adduser.user_name" />
                    </el-col>
                </el-form-item>
                <el-form-item label="用户密码" prop="user_pwd">
                    <el-col :span="11">
                        <el-input v-model="adduser.user_pwd"  show-password />
                    </el-col>
                    <el-tooltip class="item" effect="dark" content="8-20个字符，最少拥有大写字母/小写字母/数字中的两项" placement="right" style="margin-left:10px;">
                        <el-button type="text" width="50"><i class="el-icon-info"></i></el-button>
                    </el-tooltip>
                </el-form-item>
                <el-form-item label="权限角色" prop="role_id">
                    <el-select v-model='adduser.role_id' placeholder="请选择权限角色">
                        <el-option :label="item.name" :value="item.id" selected v-for="(item,index) in rolelist" :key="index" />
                    </el-select>
                </el-form-item>
                <el-form-item label="">
                    <el-button type="success" style='width:200px' :loading="loading" @click="addUserFn">新增</el-button>
                    <el-button @click="cancleAddFn">取消</el-button>
                </el-form-item>
            </el-form>
        </div>

        
    </div>
</template>

<script>
    export default {
        data() {
            //用户密码限制在8-20个字符，英文与数字的组合，区分大小写，最少拥有大写字母/小写字母/数字中的两项；
            const checkPwd = (rule, value, callback) => {
                if (!value) {
                    callback(new Error('请输入密码'))
                } else if (value.length<8 || value.length>20) {
                    callback(new Error('长度在 8 到 20 个字符'));
                }else {
                    if(this.checkPassFormat(value)){
                        callback()
                    }else{
                        callback(new Error('最少拥有大写字母/小写字母/数字中的两项'));
                    }
                }
            }
            const checkuname = (rule, value, callback) => {
                if (!value) {
                    callback(new Error('请输入用户名'))
                } else{
                    var reg = /^([0-9a-zA-Z]{1,32})$/;
                    if(reg.test(value)){
                        callback();
                    }else{
                        callback(new Error('只能包含英文和数字，且不超过32位'));
                    }
                }
            }
            return {
                loading:false,
                adduser:{
                    user_name:"",
                    user_pwd:"",
                    real_name:"",
                    role_id:""
                },
                rules: {
                    real_name:[
                        { required: true, message: '请输入用户姓名', trigger: 'blur' },
                        {  max: 12, message: '长度不超过 12 个字符', trigger: 'blur' }
                    ],
                    user_name: [
                        { required: true, message: '请输入用户账号', trigger: 'change' },
                        { validator: checkuname, trigger: 'change' }
                    ],
                    user_pwd: [
                        { required: true, message: '请输入密码', trigger: 'change' },
                        { validator: checkPwd, trigger: 'change' }
                    ],
                    role_id: [
                        { required: true, message: '请选择用户角色', trigger: 'change' }
                    ]
                },
                rolelist:[]
            }
        },
        methods: {
            goAddParse(){
                this.$router.push({name:"AddParse"});
            },
            //获取权限列表
            getRoleList(){
                this.$ajax({
                    method: 'post',
                    url:  'resource/member/userrolelist'
                }).then( (res)=> {
                    this.rolelist = res;
                })
            },
            //添加用户
            addUserFn(){
                this.$refs["addform"].validate((valid) => {
                    if (valid) {
                        this.loading = true;
                        this.$ajax({
                            method: 'post',
                            url:  'resource/member/useradd',
                            data: this.qs.stringify(
                                {
                                    user_name:this.adduser.user_name,
                                    user_pwd:this.md5(this.adduser.user_pwd),
                                    real_name:this.adduser.real_name,
                                    role_id:this.adduser.role_id
                                }
                            )
                        }).then( (res)=> {
                            this.loading = false;
                            this.$notify({title: '成功', message: '添加用户'+this.adduser.real_name+'成功!',type: 'success'});
                            this.$router.replace({name: 'UserList'});
                        }).catch( (res)=> {
                            this.loading = false;

                        });
                    } else {
                        return false;
                    }
                });
            },
            cancleAddFn(){
                this.$router.go(-1);
            }

            
        },
        watch: {
            
        },
        mounted() {
            if(!this.isHasAuth("g")){
                this.$router.replace({name: 'P403'});
            };
            this.getRoleList();
        }
    };
</script>

