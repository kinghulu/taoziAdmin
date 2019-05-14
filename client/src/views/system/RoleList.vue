<template>
    <div class="files">
        <el-breadcrumb class="breadcrumbs" separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>
                <router-link :to="{name:'RoleList'}">系统管理</router-link>
            </el-breadcrumb-item>
            <el-breadcrumb-item>
                <span>权限管理</span>
            </el-breadcrumb-item>
        </el-breadcrumb>
        <div class="pagetopBox">
            <h2 class="pageTitle">权限管理</h2>
            <el-button type="success" icon='el-icon-plus' @click="goAddParse">新增权限角色</el-button>
        </div>
        <div class="course_box">
            <el-table :data="roleData" border style="width: 100%;" v-loading="listloading">
                <el-table-column prop="name" label="角色" align="center"  />
                <el-table-column prop="create_time" label="创建时间" align="center" width="180" />
                <el-table-column prop="update_time" label="最后更新时间" align="center" width="180" />
                <el-table-column prop="roleviews" label="权限一览" align="center" />
                <el-table-column label="操作" align="center" width="250">
                    <template slot-scope="scope">
                        <el-button size="mini" :type="scope.row.state==1?'primary':'danger'" @click="handleToggle(scope.row)">
                            <span v-if="scope.row.state==1">已启用</span>
                            <span v-else>已禁用</span>
                        </el-button>
                        <el-button size="mini" type="warning" @click="handleEdit(scope.row)">编辑</el-button>
                        <el-button size="mini" @click="handleCopy(scope.row)">复制</el-button>
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
                listloading:false,
                roleData: []
            }
        },
        methods: {
            goAddParse(){
                this.$router.push({name:"RoleAdd"});
            },
            getRoleList(){
                this.listloading = true;
                this.$ajax({
                    method: 'post',
                    url:  'resource/role/rolelist'
                }).then( (res)=> {
                    this.listloading = false;
                    let roles = res;
                    for(let i in roles){
                        let rolestr = roles[i].auth;
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
                this.listloading = true;
                let resultstate = rd.state==1?0:1;
                this.$ajax({
                    method: 'post',
                    url:  'resource/role/rolesavestate',
                    data:this.qs.stringify({
                        role_id:rd.id,
                        state:resultstate,
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
                this.$router.push({name:"RoleEdit",params:{id:r_id,type:"edit"}});
            },
            handleCopy(rd){
                let r_id = rd.id;
                this.$router.push({name:"RoleEdit",params:{id:r_id,type:"copy"}});
            },
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

