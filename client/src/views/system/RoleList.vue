<template>
    <div class="files">
        <div class="pagetopBox">
            <h2 class="pageTitle">权限管理</h2>
            <el-button type="success" icon='el-icon-plus' @click="goAddParse">新增权限角色</el-button>
        </div>
        <div class="course_box">
            <el-table :data="roleData" border style="width: 100%;" v-loading="listloading">
                <el-table-column prop="name" label="角色" align="center"  />
                <el-table-column prop="creator" label="创建人" align="center" width="140" />
                <el-table-column prop="create_time" label="创建时间" align="center" width="180" />
                <el-table-column prop="roleviews" label="权限一览" align="center" />
                <el-table-column label="启用禁用" align="center" width="120" v-if="hasEditRole">
                    <template slot-scope="scope">
                        <el-tooltip :content="scope.row.state==1?'当前已启用':'当前已禁用'" placement="top">
                            <el-switch
                                v-model="scope.row.state1"
                                :active-value="1" active-color="#67C23A"
                                :inactive-value="0" @change='handleToggle(scope.row)'>
                            </el-switch>
                        </el-tooltip>    
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" width="160" fixed="right" v-if="hasEditRole">
                    <template slot-scope="scope">
                        <el-button size="mini" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
                        <el-button size="mini" type="danger" @click="handleDel(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
    import {roleArr} from '@/utils/config';
    export default {
        data() {
            return {
                loading:true,
                hasEditRole:false,
                listloading:false,
                roleData: []
            }
        },
        methods: {
            goAddParse(){
                this.$router.push({name:"RoleAdd"});
            },
            getRoleList(){
                this.roleData = [];
                this.listloading = true;
                this.$ajax({
                    method: 'post',
                    url:  '/admin/role/list'
                }).then( (res)=> {
                    this.listloading = false;
                    let roles = res;
                    for(let i in roles){
                        let rolestr = roles[i].rules;
                        roles[i].state1 = roles[i].state;
                        let autharr = rolestr.split(",");
                        let roleviews = '';
                        for(let j in autharr){
                            let rolename = this.getRoleNameByValue(autharr[j]);
                            if(roleviews){
                                roleviews += "，" + rolename;
                            }else{
                                roleviews += rolename
                            }
                        }
                        roles[i].roleviews = roleviews;
                    }
                    this.roleData = roles;
                }).catch( (res)=> {
                    this.listloading = false;
                });
            },
            //根据权限名字获取权限名称
            getRoleNameByValue(name){
                let str = "";
                for(let i in roleArr){
                    let r = roleArr[i];
                    if(r.child){
                        for(let j in r.child){
                            let o = r.child[j];
                            if(o.value == name){
                                str =r.title + "-"+ o.name;
                            }
                        }
                    }
                }
                return str;
            },
            //启用禁用
            handleToggle(rd){
                let resultstate = rd.state==1?0:1;
                this.handleState(rd.id,resultstate);
            },
            //更改状态
            handleState(id,state){
                this.listloading = true;
                this.$ajax({
                    method: 'post',
                    url:  '/admin/role/changestate',
                    data:this.qs.stringify({
                        id:id,
                        state:state,
                    })
                }).then( (res)=> {
                    this.listloading = false;
                    this.getRoleList();
                }).catch( (res)=> {
                    this.listloading = false;
                });
            },
            handleEdit(rd){
                let r_id = rd.id;
                this.$router.push({name:"RoleEdit",params:{id:r_id}});
            },
            //删除
            handleDel(rd){
                this.$confirm('确定删除该权限吗', '提示', {
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
            this.hasEditRole = this.isHasAuth("ab2");
            if(!this.isHasAuth("ab")){
                this.$router.replace({name: 'P403'});
            };
            this.getRoleList();
        }
    };
</script>

