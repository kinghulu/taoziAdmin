<template>
    <div class="files">
        <div class="pagetopBox">
            <h2 class="pageTitle">用户管理</h2>
            <el-button type="success" icon='el-icon-plus' @click="goAddParse">新增用户</el-button>
        </div>
        <div class="course_box">
            <el-table :data="userData" border style="width: 100%;" v-loading="listloading">
                <el-table-column prop="nickname" label="昵称" align="center" width="150"  />
                <el-table-column prop="name" label="登录名" align="center" width="150"  />
                <el-table-column prop="creat_time" label="创建时间" align="center"/>
                <el-table-column prop="last_login_time" label="最近登录" align="center" />
                <el-table-column prop="rolename" label="权限角色" align="center" />
                <el-table-column label="启用禁用" align="center" width="120" fixed="right" v-if="hasEditRole">
                    <template slot-scope="scope">
                        <el-tooltip :content="scope.row.state==1?'当前已启用':'当前已禁用'" placement="top">
                            <el-switch :disabled="scope.row.role=='admin'"
                                v-model="scope.row.state1"
                                :active-value="1" active-color="#67C23A"
                                :inactive-value="0" @change='handleToggle(scope.row)'>
                            </el-switch>
                        </el-tooltip>    
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" width="180" fixed="right" v-if=" hasEditRole">
                    <template slot-scope="scope">
                        <el-button size="mini" type="primary" :disabled="scope.row.role=='admin'" @click="handleEdit(scope.row)" v-if=" hasEditRole">编辑</el-button>
                        <el-button size="mini" type="danger" :disabled="scope.row.role=='admin'" @click="handleDel(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <!--编辑用户-->
        <el-dialog title="编辑用户" :visible.sync="dialogFormVisible" class="bigEleDialog">
            <el-form ref="editform" :model="edituser" :rules="rules" label-width="120px">
                <el-form-item label="用户姓名" prop="nickname">
                    <el-col :span="22">
                        <el-input v-model="edituser.nickname" /> 
                    </el-col>
                </el-form-item>
                <el-form-item label="用户账号" prop="name">
                    <el-col :span="22">
                        <el-input v-model="edituser.name" />
                    </el-col>
                </el-form-item>
                <el-form-item label="用户密码" prop="pwd">
                    <el-col :span="22">
                        <el-input v-model="edituser.pwd" placeholder="不填写密码则不更改" show-password />
                    </el-col>
                </el-form-item>
                <el-form-item label="权限角色" prop="roleid">
                    <el-select v-model='edituser.roleid' placeholder="请选择权限角色">
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
            return {
                hasEditRole:true,
                listloading:false,
                userData:[],
                loading:false,
                dialogFormVisible:false,
                edituser:{
                    id:'',
                    name:"",
                    pwd:"",
                    nickname:"",
                    roleid:5
                },
                rules: {
                    nickname:[
                        { required: true, message: '请输入昵称', trigger: 'blur' },
                        {  max: 12, message: '长度不超过 12 个字符', trigger: 'blur' }
                    ],
                    name: [
                        { required: true, message: '请输入用户账号', trigger: 'blur' },
                        { min: 1, max: 32, message: '长度不超过 32 个字符', trigger: 'blur' }
                    ],
                    pwd: [
                        { max: 32, message: '长度不超过 32 个字符', trigger: 'blur' }
                    ],
                    roleid: [
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
                    url:  '/admin/user/list'
                }).then( (res)=> {
                    this.listloading = false;
                    for(let i in res){
                        res[i].state1 = res[i].state;
                        if(res[i].rolename==""){
                            res[i].rolename = res[i].nickname;
                        }
                    }
                    this.userData = res;
                }).catch( (res)=> {
                    this.listloading = false;
                });
            },
            //启用禁用
            handleToggle(rd){
                let resultstate = rd.state==1?0:1;
                this.handleState(rd.id,resultstate);
            },
            //编辑
            handleEdit(rd){
                this.getRoleList();
                this.listloading = true;
                this.$ajax({
                    method: 'post',
                    url:  '/admin/user/detail',
                    data:this.qs.stringify({
                        id:rd.id
                    })
                }).then( (res)=> {
                    this.listloading = false;
                    this.edituser = {
                        id:res.id,
                        name:res.name,
                        pwd:"",
                        nickname:res.nickname,
                        roleid:res.roleid
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
                    url:  '/admin/role/list'
                }).then( (res)=> {
                    this.rolelist = res;
                })
            },
            //编辑用户
            editUserFn(){
                this.$refs["editform"].validate((valid) => {
                    if (valid) {
                        this.loading = true;
                        let upwd = this.edituser.pwd?this.md5(this.SECERT + this.edituser.pwd):"";
                        this.$ajax({
                            method: 'post',
                            url:  '/admin/user/update',
                            data: this.qs.stringify(
                                {
                                    id:this.edituser.id,
                                    name:this.edituser.name,
                                    pwd:upwd,
                                    nickname:this.edituser.nickname,
                                    roleid:this.edituser.roleid
                                }
                            )
                        }).then( (res)=> {
                            this.loading = false;
                            this.$notify({title: '操作成功', message: '修改用户'+this.edituser.nickname+'成功!',type: 'success'});
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
            },
            //更改状态
            handleState(id,state){
                this.listloading = true;
                this.$ajax({
                    method: 'post',
                    url:  '/admin/user/changestate',
                    data:this.qs.stringify({
                        id:id,
                        state:state,
                    })
                }).then( (res)=> {
                    this.listloading = false;
                    this.getUserList();
                }).catch( (res)=> {
                    this.listloading = false;
                });
            },
            //删除
            handleDel(rd){
                this.$confirm('确定删除该用户吗', '提示', {
                    confirmButtonText: '确定删除',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let r_id = rd.id;
                    this.handleState(r_id,-1);
                    this.$message({type: 'success',message: '删除成功!'});
                }).catch(() => {});
                
            }
        },
        watch: {
            
        },
        mounted() {
            if(!this.isHasAuth("aa")){
                this.$router.replace({name: 'P403'});
            };
            this.hasEditRole = this.isHasAuth("aa2");
            this.getUserList();
        }
    };
</script>

