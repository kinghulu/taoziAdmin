<template>
    <div class="files">
        <div class="pagetopBox">
            <h2 class="pageTitle">角色权限配置</h2>
        </div>
        <div class="course_box" v-loading="pageloading">
            <el-form ref="addform" :model="addrole" label-width="180px" label-position="right" :rules="rules">
                <el-form-item prop="name" label="角色权限名称">
                    <el-col :span="11">
                        <el-input v-model="addrole.name" />
                    </el-col>
                </el-form-item>
                <el-form-item label="权限配置">
                    <div class="rolebox">
                        <div class="roleitem" v-for="(item,i) in roles" :key="i">
                            <div class="roleitem_title">{{item.title}}</div>
                            <div class="roleitem_check" v-for="(c,j) in item.child" :key="j"  ><el-checkbox v-model="c.checkv">{{c.name}}</el-checkbox>
                              </div>
                        </div>
                    </div>
                </el-form-item>
                
                <el-form-item label="">
                    <el-button type="success" style='width:200px' @click="addRoleFn" :loading="loading">保存</el-button>
                    <el-button @click="cancleAddFn">取消</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
    import {roleArr} from '@/utils/config';
    export default {
        data() {
            return {
                loading:false,
                pageloading:false,
                roles:[],
                addrole:{
                    name:"",
                    rolestr:''
                },
                rules: {
                    name:[
                        { required: true, message: '请输入角色权限名称', trigger: 'blur' },
                        { max: 12, message: '不超过12个字符', trigger: 'blur' }
                    ]
                },
                r_id:"",//编辑的id
                r_type:"edit",// edit / copy
            }
        },
        methods: {
            addRoleFn(){
                this.addrole.rolestr = this.getRoleStr();
                this.$refs["addform"].validate((valid) => {
                    if (valid) {
                        if(this.addrole.rolestr){
                            this.loading = true;
                            if(this.r_type=="edit"){
                                this.$ajax({
                                    method: 'post',
                                    url:  'admin/role/update',
                                    data: this.qs.stringify(
                                        {
                                            name:this.addrole.name,
                                            rules:this.addrole.rolestr,
                                            id:this.r_id
                                        }
                                    )
                                }).then( (res)=> {
                                    this.loading = false;
                                    this.$notify({title: '操作成功', message: '修改角色成功！',type: 'success'});
                                    this.$router.replace({name: "RoleList"});
                                }).catch( (res)=> {
                                    this.loading = false;
                                });
                            }else{
                                this.$ajax({
                                    method: 'post',
                                    url:  'admin/role/add',
                                    data: this.qs.stringify(
                                        {
                                            name:this.addrole.name,
                                            rules:this.addrole.rolestr
                                        }
                                    )
                                }).then( (res)=> {
                                    this.loading = false;
                                    this.$notify({title: '操作成功', message: '添加角色成功！',type: 'success'});
                                    this.$router.replace({name: "RoleList"});
                                }).catch( (res)=> {
                                    this.loading = false;
                                });
                            }
                        }else{
                            this.$alert('请选择权限', '提示')
                        }
                    } else {
                        return false;
                    }
                });


            },
            getRoleStr(){
                let str = "";
                for(let i in this.roles){
                    let r = this.roles[i];
                    if(r.child){
                        for(let j in r.child){
                            let o = r.child[j];
                            if(o.checkv){
                                if(str){
                                    str += "," + o.value;
                                }else{
                                    str += o.value;
                                }
                            }
                        }
                    }
                }
                return str;
            },
            cancleAddFn(){
                this.$router.go(-1);
            },
            //获取权限详情
            getRoleDetail(id){
                this.pageloading = true;
                this.$ajax({
                    method: 'post',
                    url:  '/admin/role/detail',
                    data:this.qs.stringify({
                        id:id
                    })
                }).then( (res)=> {
                    this.pageloading = false;
                    this.addrole.name = res.name;
                    let roles = JSON.parse(JSON.stringify(roleArr));
                    let rolestr = res.rules;
                    let autharr = rolestr.split(",");
                    let rolearr = [];
                    for(let i in roles){
                        if(roles[i].isShow){
                            let r_child = roles[i].child
                            if(r_child){
                                for(let m in r_child){
                                    for(let j in autharr){
                                        if(r_child[m].value == autharr[j]){
                                            r_child[m].checkv = true;
                                        }
                                    }
                                }
                            }
                            rolearr.push(roles[i]);
                        }
                    }
                    this.roles = rolearr;
                }).catch( (res)=> {
                    this.pageloading = false;
                });
            }
        },
        watch: {
            
        },
        mounted() {
            if(this.$route.name == "RoleEdit"){
                this.r_type = "edit"
            }else{
                this.r_type = "add"
            }
            if(!this.isHasAuth("ab")){
                this.$router.replace({name: 'P403'});
            };
            this.r_id = this.$route.params.id;
            if(this.r_id){ 
                this.getRoleDetail(this.r_id);
            }else{
                let roletmp = [];
                let _role = JSON.parse(JSON.stringify(roleArr));
                for(let i in _role){
                    if(_role[i].isShow){
                        roletmp.push(_role[i]);
                    }
                }
                this.roles = roletmp;
            }
            console.log(this.roles)
        }
    };
</script>
<style>
.rolebox{ display: flex; display: -webkit-flex; flex-wrap: wrap; padding-top:5px;}
.roleitem_title{ font-weight: bold;}
.roleitem{ width:49%; padding-bottom: 8px; line-height: 30px;}
</style>
