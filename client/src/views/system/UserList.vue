<template>
    <div class="files">
        <el-breadcrumb class="breadcrumbs" separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>
                <router-link :to="{name:'UserList'}">系统管理</router-link>
            </el-breadcrumb-item>
            <el-breadcrumb-item>
                <span>用户管理</span>
            </el-breadcrumb-item>
        </el-breadcrumb>
        <div class="pagetopBox">
            <h2 class="pageTitle">用户管理</h2>
            <el-button type="success" icon='el-icon-plus' @click="goAddParse">新增用户</el-button>
        </div>
        <div class="course_box">
            <el-table :data="userData" border style="width: 100%;" v-loading="listloading">
                <el-table-column prop="real_name" label="用户名" align="center" width="150"  />
                <el-table-column prop="user_name" label="账号" align="center" width="150"  />
                <el-table-column prop="create_time" label="创建时间" align="center"/>
                <el-table-column prop="update_time" label="最后更新时间" align="center" />
                <el-table-column prop="role_name" label="权限角色" align="center" />
                <el-table-column label="操作" align="center" width="200">
                    <template slot-scope="scope">
                        <el-button size="mini" :disabled="scope.row.id==1" :type="scope.row.state==1?'primary':'danger'" @click="handleToggle(scope.row)">
                            <span v-if="scope.row.state==1">已启用</span>
                            <span v-else>已禁用</span>
                        </el-button>
                        <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <!--编辑用户-->
        <el-dialog title="编辑用户" :visible.sync="dialogFormVisible" class="bigEleDialog">
            <el-form ref="editform" :model="edituser" :rules="rules" label-width="120px">
                <el-form-item label="用户姓名" prop="real_name">
                    <el-col :span="22">
                        <el-input v-model="edituser.real_name" /> 
                    </el-col>
                </el-form-item>
                <el-form-item label="用户账号" prop="user_name">
                    <el-col :span="22">
                        <el-input v-model="edituser.user_name" />
                    </el-col>
                </el-form-item>
                <el-form-item label="用户密码" prop="user_pwd">
                    <el-col :span="22">
                        <el-input v-model="edituser.user_pwd" placeholder="不填写密码则不更改" show-password />
                    </el-col>
                    <el-tooltip class="item" effect="dark" content="8-20个字符，最少拥有大写字母/小写字母/数字中的两项" placement="right" style="margin-left:10px;">
                        <el-button type="text" width="50"><i class="el-icon-info"></i></el-button>
                    </el-tooltip>
                </el-form-item>
                <el-form-item label="权限角色" prop="role_id">
                    <el-select :disabled="isAdminRole" v-model='edituser.role_id' placeholder="请选择权限角色">
                        <el-option :label="item.name" :value="item.id" selected v-for="(item,index) in rolelist" :key="index" />
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="editUserFn" :loading="loading">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>

    export default {
        data() {
            //用户密码限制在8-20个字符，英文与数字的组合，区分大小写，最少拥有大写字母/小写字母/数字中的两项；
            const checkPwd = (rule, value, callback) => {
                if(value.length>0){
                    if (value.length<8 || value.length>20) {
                        callback(new Error('长度在 8 到 20 个字符'));
                    }else {
                        if(this.checkPassFormat(value)){
                            callback()
                        }else{
                            callback(new Error('最少拥有大写字母/小写字母/数字中的两项'));
                        }
                    }
                }else{
                    callback()
                }
            }
            return {
                listloading:false,
                userData:[],
                isAdminRole:false,
                loading:false,
                dialogFormVisible:false,
                edituser:{
                    user_id:'',
                    user_name:"",
                    user_pwd:"",
                    real_name:"",
                    role_id:5
                },
                rules: {
                    real_name:[
                        { required: true, message: '请输入用户姓名', trigger: 'blur' },
                        {  max: 12, message: '长度不超过 12 个字符', trigger: 'blur' }
                    ],
                    user_name: [
                        { required: true, message: '请输入用户账号', trigger: 'blur' },
                        { min: 1, max: 32, message: '长度不超过 32 个字符', trigger: 'blur' }
                    ],
                    user_pwd: [
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
                this.$router.push({name:"UserAdd"});
            },
            getUserList(){
                this.listloading = true;
                this.$ajax({
                    method: 'post',
                    url:  'resource/member/userList'
                }).then( (res)=> {
                    this.listloading = false;
                    let udata = [];
                    for(let i in res){
                        if(res[i].id=="1"){
                            res[i].role_name = "超级管理员"
                        }
                        if(res[i].state!=-1){
                            udata.push(res[i]);
                        }
                    }
                    this.userData = udata;
                }).catch( (res)=> {
                    this.listloading = false;
                });
            },
            //启用禁用
            handleToggle(rd){
                this.listloading = true;
                let resultstate = rd.state==1?0:1;
                this.$ajax({
                    method: 'post',
                    url:  'resource/member/usersavestate',
                    data:this.qs.stringify({
                        user_id:rd.id,
                        state:resultstate,
                    })
                }).then( (res)=> {
                    this.listloading = false;
                    this.getUserList();
                }).catch( (res)=> {
                    this.listloading = false;
                });
            },
            //编辑
            handleEdit(rd){
                this.getRoleList();
                this.listloading = true;
                this.$ajax({
                    method: 'post',
                    url:  'resource/member/usersavelist',
                    data:this.qs.stringify({
                        user_id:rd.id
                    })
                }).then( (res)=> {
                    this.listloading = false;
                    this.edituser = {
                        user_id:res.id,
                        user_name:res.user_name,
                        user_pwd:"",
                        real_name:res.real_name,
                        role_id:res.role_id
                    }
                    //超级管理员
                    if(res.role_id == 0){
                        this.isAdminRole = true;
                    }else{
                        this.isAdminRole = false;
                    }
                //this.edituser.role_id = 5;
                    this.dialogFormVisible=true;
                }).catch((res)=>{
                    this.listloading = false;
                })
                
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
            //编辑用户
            editUserFn(){
                this.$refs["editform"].validate((valid) => {
                    if (valid) {
                        this.loading = true;
                        let upwd = this.edituser.user_pwd?this.md5(this.edituser.user_pwd):"";
                        this.$ajax({
                            method: 'post',
                            url:  'resource/member/usersave',
                            data: this.qs.stringify(
                                {
                                    user_id:this.edituser.user_id,
                                    user_name:this.edituser.user_name,
                                    user_pwd:upwd,
                                    real_name:this.edituser.real_name,
                                    role_id:this.edituser.role_id
                                }
                            )
                        }).then( (res)=> {
                            this.loading = false;
                            this.$notify({title: '操作成功', message: '修改用户'+this.edituser.real_name+'成功!',type: 'success'});
                            this.dialogFormVisible=false;
                            this.getUserList();
                        }).catch( (res)=> {
                            this.loading = false;
                            this.getUserList();
                        });
                    } else {
                        return false;
                    }
                });
            }
        },
        watch: {
            
        },
        mounted() {
            if(!this.isHasAuth("g")){
                this.$router.replace({name: 'P403'});
            };
            this.getUserList();
        }
    };
</script>

