<template>
    <div class="course">
        <el-breadcrumb class="breadcrumbs" separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>
                <router-link :to="{name:'CourseMatch'}">课程资源匹配</router-link>
            </el-breadcrumb-item>
            <el-breadcrumb-item>
                <router-link :to="{name:'MatchDetail'}">具体课次配置</router-link>
            </el-breadcrumb-item>
            <el-breadcrumb-item>
                <span>{{getMoudleType(resource_module)}}模块资源上传</span>
            </el-breadcrumb-item>
        </el-breadcrumb>

        <div class="pagetopBox">
            <h2 class="pageTitle">{{courseMatchObj.level_name}} 第 {{course_sn}} 讲</h2>
            <el-button  size="mini" @click="gobackFn">返回</el-button>
        </div>

        <h3 style="margin-top:10px;">已匹配资源列表</h3>
        <div class="course_box">
            <el-table :data="matchData" border stripe  style="width: 100%" empty-text="暂无数据">
                <el-table-column  prop="title"  label="资源名" />
                <el-table-column label="资源类型" width="80" align="center">
                    <template slot-scope="scope">
                        {{getFileType(scope.row.type)}}
                    </template>
                </el-table-column>
                <el-table-column prop="create_time" label="匹配时间" width="180" align="center" />
                <el-table-column prop="opt_user" label="操作人" width="140" align="center" />
                <el-table-column label="状态" align="center" width="120">
                    <template slot-scope="scope">
                        <el-tag type="success" v-if="scope.row.state==2">已发布</el-tag>
                        <el-tag type="info" v-else>未发布</el-tag>
                    </template>
                </el-table-column>
                <el-table-column width="180" label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button size="mini" :type="scope.row.state==2?'warning':'primary'" @click="handleToggle(scope.row)" :class="hasEditRole?'':'disabled'">
                            <span v-if="scope.row.state==2">取消发布</span>
                            <span v-else>发布</span>
                        </el-button>
                        <el-button size="mini" width="100" type="danger" plain @click="handleDelete(scope.row)" :class="hasEditRole?'':'disabled'">删除</el-button>
                    </template>
                </el-table-column>
                <el-table-column width="130" label="排序" align="center" v-if="resource_module!=2">
                    <template slot-scope="scope">
                        <el-input-number size="mini" v-model="scope.row.sort" style="width:100px"  @change="handleSortChange(scope.row)" controls-position="right" :min="0" :max="9999"></el-input-number>
                    </template>
                </el-table-column>
            </el-table>
            <div class="course_box">
                <el-button type="primary" plain @click="uploadAndMatchFn" :class="hasEditRole?'':'disabled'">新增资源<br>并匹配到当前模块</el-button>
            </div>
        </div>
    </div>
</template>

<script>
    import {filesType,moduleType} from '@/utils/config';
    export default {
        data() {
            return {
                loading:true,
                hasEditRole:true,
                resource_module:'',
                course_sn:"",
                ycl_id:'',
                courseMatchObj:{},
                matchData: []
            }
        },
        methods: {
            gobackFn(){
                this.$router.push({name:'MatchDetail'});
            },
            //获取资源类型
            getMoudleType(v){
                return moduleType[v];
            },
            //获取资源类型
            getFileType(v){
                let cname = "";
                for(let j in filesType){
                    if(filesType[j].value == v){
                        cname = filesType[j].name;
                        break;
                    }
                }
                return cname;
            },
            getMoudleDetail(){
                this.loading = true;
                this.$ajax({
                    method: 'post',
                    url:  'resource/curriculum/matchinglist',
                    data:this.qs.stringify({
                        ycl_id:this.ycl_id,
                        course_sn:this.course_sn,
                        resource_module:this.resource_module
                    })

                }).then( (res)=> {
                    this.loading = false;
                    this.matchData = res;
                }).catch( (res)=> {
                    this.loading = false;
                });
            },
            //切换状态
            handleSwitchstate(rd,state){
                if(!this.hasEditRole){
                    this.$message.error("没有操作权限");
                    return false;
                }
                this.loading = true;
                this.$ajax({
                    method: 'post',
                    url:  'resource/curriculum/saveresourcestate',
                    data:this.qs.stringify({
                        id:rd.id,
                        state:state,
                        ycl_id:this.ycl_id,
                        course_sn:this.course_sn,
                        type:rd.type
                    })
                }).then( (res)=> {
                    this.loading = false;
                    this.getMoudleDetail();
                }).catch( (res)=> {
                    this.loading = false;
                });
            },
            handleToggle(rd){
                let resultstate = rd.state==1?2:1;
                this.handleSwitchstate(rd,resultstate);
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
                    this.handleSwitchstate(rd,-1);
                    this.$message({type: 'success',message: '删除成功!'});
                }).catch(() => {});
            },
            //切换
            handleSortChange(row){
                if(!this.hasEditRole){
                    this.$message.error("没有操作权限");
                    return false;
                }
                this.loading = true;
                this.$ajax({
                    method: 'post',
                    url:  'resource/curriculum/sortresource',
                    data:this.qs.stringify({
                        id:row.id,
                        sort:row.sort
                    })
                }).then( (res)=> {
                    this.loading = false;
                    //this.getMoudleDetail();
                }).catch( (res)=> {
                    this.loading = false;
                });
            },
            uploadAndMatchFn(){
                if(!this.hasEditRole){
                    this.$message.error("没有操作权限");
                    return false;
                }
                this.$router.push({name:'MatchUpload',query:this.$route.query});
            }
        },
        watch: {
            
        },
        mounted() {
            this.hasEditRole = this.isHasAuth("a2");

            let courseobj = this.$store.getters.coursematch;
            this.course_sn = this.$route.query.sn;
            this.resource_module = this.$route.query.module;
            this.ycl_id = this.$route.query.yclid;
            if(courseobj){
                this.courseMatchObj = JSON.parse(courseobj);
                this.getMoudleDetail();
            }else{
                this.$message.error("获取课次数据失败~");
                this.$router.replace({name:'CourseMatch'});
            }
        }
    };
</script>

