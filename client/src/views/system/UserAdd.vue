<template>
    <div class="files">
        <div class="pagetopBox">
            <h2 class="pageTitle">新增用户</h2>
        </div>
        <div class="course_box">
            <el-form ref="addform" :model="adduser" :rules="rules" label-width="180px" label-position="right">
                <el-form-item label="昵称" prop="nickname">
                    <el-col :span="11">
                        <el-input v-model="adduser.nickname" /> 
                    </el-col>
                </el-form-item>
                <el-form-item label="登录名" prop="name">
                    <el-col :span="11">
                        <el-input v-model="adduser.name" />
                    </el-col>
                </el-form-item>
                <el-form-item label="密码" prop="pwd">
                    <el-col :span="11">
                        <el-input v-model="adduser.pwd"  show-password />
                    </el-col>
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
                    nickname:"",
                    pwd:"",
                    name:"",
                    role_id:""
                },
                rules: {
                    nickname:[
                        { required: true, message: '请输入昵称', trigger: 'blur' },
                        {  max: 12, message: '长度不超过 12 个字符', trigger: 'blur' }
                    ],
                    name: [
                        { required: true, message: '请输入登录名', trigger: 'change' },
                        { validator: checkuname, trigger: 'change' }
                    ],
                    pwd: [
                        { required: true, message: '请输入密码', trigger: 'change' },
                        { min:6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
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
                    url:  '/admin/role/list'
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
                            url:  '/admin/user/add',
                            data: this.qs.stringify(
                                {
                                    name:this.adduser.name,
                                    pwd:this.md5(this.SECERT + this.adduser.pwd),
                                    nickname:this.adduser.nickname,
                                    role_id:this.adduser.role_id
                                }
                            )
                        }).then( (res)=> {
                            this.loading = false;
                            this.$notify({title: '成功', message: '添加用户'+this.adduser.nickname+'成功!',type: 'success'});
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
            if(!this.isHasAuth("aa")){
                this.$router.replace({name: 'P403'});
            };
            this.getRoleList();
        }
    };
</script>

