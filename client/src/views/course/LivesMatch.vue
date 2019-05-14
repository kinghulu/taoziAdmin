<template>
    <div class="files">
        <el-breadcrumb class="breadcrumbs" separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>
                <router-link :to="{name:'LivesMatch'}">课程资源配置</router-link>
            </el-breadcrumb-item>
            <el-breadcrumb-item>
                <span>直播回看视频匹配</span>
            </el-breadcrumb-item>
        </el-breadcrumb>
        <div class="pagetopBox">
            <h2 class="pageTitle">直播回看视频匹配</h2>
            <el-button type="success" icon='el-icon-plus' @click="goAddLives" :class="hasEditRole?'':'disabled'">新增</el-button>
        </div>
        <div class="course_box">
            <!--<el-form :inline="true" size="small" :model="formSearch" class="demo-form-inline">
                <el-form-item label="视频名称">
                    <el-input v-model="formSearch.title" placeholder="视频名称" clearable @clear="clearSearch"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="searchFn">搜索</el-button>
                </el-form-item>
            </el-form>-->
            <div style="min-width:300px; width:100%; max-width:600px; padding-bottom:10px;">
                <el-input placeholder="请输入视频名称" v-model="formSearch.title" class="input-with-select" clearable @clear="clearSearch">
                    <el-button slot="append" icon="el-icon-search" @click="searchFn"></el-button>
                </el-input>
            </div>
            <div v-if="listData.length">
                <div class="ylives_box">
                    <div class="ylives_item" v-for="(item,index) in listData" :key="index">
                        <div class="ylives_video">
                            <!--
                            <video controls="controls" :src="item.uri_path" controlslist="nodownload" oncontextmenu="return false">
                                {{item.uri_path}}
                            </video>
                            -->
                            <iframe :src="item.uri_path" style="width:100%; height:100%; border:none; background:#eee; border:1px solid #eee;"></iframe>
                        </div>
                        <div class="ylives_main">
                            <h2 :title="item.title"><a :href='item.uri_path' target="_blank">{{item.title}}</a></h2>
                            <div class="ylives_item_time">{{item.create_time}}</div>
                            <div class="ylives_item_info">
                                <div class="ylives_item_info_f">ID：{{item.id}}</div>
                                <div class="ylives_item_info_f">班次记录ID：{{item.ycl_id}}</div>
                                <div class="ylives_item_info_f">讲次序号：{{item.course_sn}}</div>
                                <div class="ylives_item_info_f">排序：{{item.sort}}</div>
                            </div>
                            <div class="ylives_item_btn">
                                <el-button size="mini" type="info" @click="showLiveDetail(item.id)">详情</el-button>
                                <el-button size="mini" :class="hasEditRole?'':'disabled'" :type="item.state==2?'warning':'primary'" @click="handleToggle(item)">
                                    <span v-if="item.state==2">取消发布</span>
                                    <span v-else>发布</span>
                                </el-button>
                                <el-button size="mini" type="success" :class="hasEditRole?'':'disabled'" @click='editLiveFn(item)'>编辑</el-button>
                            </div>
                            <div class="ylives_item_del" @click="handleDelete(item)" :class="hasEditRole?'':'disabled'">
                                <i class="el-icon-delete"></i>
                            </div>
                        </div>
                    </div>
                </div>   
                <div class="page_box">
                    <el-pagination layout="prev, pager, next"
                    :page-size="page_size"
                    :total="total_rec" 
                    @current-change="handlePageChange"
                    :current-page.sync="page_num"
                    >
                    </el-pagination>
                </div>
            </div>
            <div class="emptyBox" v-else>暂无记录</div>
            <!--
            <el-table :data="listData" border stripe style="width: 100%" v-loading="loading">
                <el-table-column prop="id" label="ID" align="center" />
                <el-table-column prop="title" label="视频名称">
                    <template slot-scope="scope">
                        {{scope.row.title}}
                    </template>
                </el-table-column>
                <el-table-column prop="uri_path" label="视频链接" align="center" width="280" />
                <el-table-column prop="ycl_id" label="班次记录ID" align="center" />
                <el-table-column prop="course_sn" label="讲次序号" align="center" width="80" />
                <el-table-column prop="sort" label="排序" align="center" width="60" />
                <el-table-column label="状态" align="center" width="120">
                    <template slot-scope="scope">
                        <el-tag type="success" v-if="scope.row.state==2">已发布</el-tag>
                        <el-tag type="info" v-else>未发布</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" width="300" fixed="right">
                    <template slot-scope="scope">
                        <el-button size="mini" @click="showLiveDetail(scope.row.id)">详情</el-button>
                        <el-button size="mini" :class="hasEditRole?'':'disabled'" :type="scope.row.state==2?'warning':'primary'" @click="handleToggle(scope.row)">
                            <span v-if="scope.row.state==2">取消发布</span>
                            <span v-else>发布</span>
                        </el-button>
                        <el-button size="mini" type="primary" :class="hasEditRole?'':'disabled'" @click='editLiveFn(scope.row)'>编辑</el-button>
                        <el-button size="mini" type="danger" :class="hasEditRole?'':'disabled'" @click="handleDelete(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            -->
        </div>

        <!--编辑弹框-->
        <el-dialog :title="editTitle" :visible.sync="dialogEditVisible" :append-to-body="true" :close-on-click-modal="false">
            <el-form ref="editForm" class="editPass" label-width="140px" :model="editform" style="margin-top:20px">
                <el-form-item label="回看视频名称" prop="title" :rules="[
                            { required: true, message: '请输入回看视频名称', trigger: 'blur' }]">
                    <el-col :span="22">
                        <el-input v-model="editform.title"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="回看视频链接" prop="uri_path" :rules="[
                            { required: true, message: '请输入回看视频链接', trigger: 'blur' } ,
                            { type: 'url', message: '请输入正确的视频链接', trigger: 'blur' } ]">
                    <el-col :span="22">
                        <el-input v-model="editform.uri_path"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="排序" prop="sort">
                    <el-col :span="11">
                        <el-input-number v-model="editform.sort" :min="0" :max="9999" label="排序" controls-position="right" />
                    </el-col>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogEditVisible = false">取 消</el-button>
                <el-button type="primary" @click="editFn" :loading="editloading">确定修改</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {replayType} from  '@/utils/config'
    export default {
        data() {
            return {
                loading:false,
                hasEditRole:true,
                editloading:false,
                dialogEditVisible:false,
                editTitle : "编辑匹配",
                currentEditRow:"",
                editform:{
                    title:'',
                    uri_path:'',
                    sort:0
                },

                formSearch:{
                    title:''
                },
                page_size:6,
                page_num:1,//当前页码
                total_rec: 1,
                listData: []
            }
        },
        methods: {
            //编辑
            editLiveFn(rd){
                if(!this.hasEditRole){
                    this.$message.error("没有操作权限");
                    return false;
                }
                if(rd.state==2){
                    this.$message.error("发布中不允许修改");
                }else{
                    this.currentEditRow = rd;
                    this.editform = {
                        title:rd.title,
                        uri_path:rd.uri_path,
                        sort:Math.floor(rd.sort)
                    }
                    this.dialogEditVisible = true;
                    this.editTitle = "编辑匹配 - "+rd.title;
                }
            },
            //编辑保存
            editFn(){
                if(!this.hasEditRole){
                    this.$message.error("没有操作权限");
                    return false;
                }
                this.editloading = true;
                this.$ajax({
                    method: 'post',
                    url:  'resource/videoreview/updatereviewres',
                    data:this.qs.stringify({
                        id:this.currentEditRow.id,
                        uri_path:this.editform.uri_path,
                        sort:this.editform.sort,
                        title:this.editform.title
                    })
                }).then( (res)=> {
                    this.editloading = false;
                    this.dialogEditVisible = false;
                    this.$notify({
                        title: '修改成功',
                        message: `视频${this.editform.title}修改成功，返回列表查看~`,
                        type: 'success'
                    });
                    this.getListData();
                }).catch( (res)=> {
                    this.editloading = false;
                });
            },
            goAddLives(){
                if(!this.hasEditRole){
                    this.$message.error("没有操作权限");
                    return false;
                }
                this.$router.push({name:"LivesAdd"});
            },
            getListData(){
                this.loading = true;
                this.$ajax({
                    method: 'post',
                    url:  'resource/videoreview/index',
                    data:this.qs.stringify({
                        page_num:this.page_num,
                        page_size:this.page_size,
                        title:this.formSearch.title
                    })
                }).then( (res)=> {
                    this.loading = false;
                    let list = JSON.parse(JSON.stringify(res.list));
                    for(let i in list){
                        for(let j in replayType){
                            if(replayType[j].value == list[i].type){
                                list[i].typename = replayType[j].name;
                                break;
                            }
                        }
                    }
                    this.listData = list;
                    this.total_rec = res.total_rec;
                }).catch( (res)=> {
                    this.loading = false;
                });
            },
            //搜索
            searchFn(){
                this.page_num = 1;
                this.getListData();
            },
            clearSearch(){
                this.page_num = 1;
                this.getListData();
            },
            handlePageChange(val){
                this.page_num = val;
                this.getListData();
            },
            handleSwitchstate(id,state){
                if(!this.hasEditRole){
                    this.$message.error("没有操作权限");
                    return false;
                }
                this.loading = true;
                this.$ajax({
                    method: 'post',
                    url:  'resource/videoreview/switchstate',
                    data:this.qs.stringify({
                        id:id,
                        state:state,
                    })
                }).then( (res)=> {
                    this.loading = false;
                    this.getListData();
                }).catch( (res)=> {
                    this.loading = false;
                });
            },
            handleToggle(rd){
                if(!this.hasEditRole){
                    this.$message.error("没有操作权限");
                    return false;
                }
                let resultstate = rd.state==1?2:1;
                this.handleSwitchstate(rd.id,resultstate);
            },
            handleDelete(rd){
                if(!this.hasEditRole){
                    this.$message.error("没有操作权限");
                    return false;
                }
                this.$confirm('确定删除该匹配吗?', '提示', {
                    confirmButtonText: '确定删除',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.handleSwitchstate(rd.id,-1);
                    this.$message({type: 'success',message: '删除成功!'});
                }).catch(()=>{})
            },
            showLiveDetail(id){
                this.$router.push({name:'LivesDetail',params:{id:id}})
            }
        },
        mounted() {
            this.hasEditRole = this.isHasAuth("c2");
            this.getListData();
        }
    };
</script>

