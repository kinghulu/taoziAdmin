<template>
    <div class="files">
        <el-breadcrumb class="breadcrumbs" separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>
                <router-link :to="{name:'LivesMatch'}">课程资源配置</router-link>
            </el-breadcrumb-item>
            <el-breadcrumb-item>
                <router-link :to="{name:'LivesMatch'}">直播回看视频匹配</router-link>
            </el-breadcrumb-item>
            <el-breadcrumb-item>
                <span>直播回看详情</span>
            </el-breadcrumb-item>
        </el-breadcrumb>
        <div class="pagetopBox">
            <h2 class="pageTitle">直播回看详情</h2>
            <el-button icon='el-icon-back' size="small" @click="gobackFn">返回</el-button>
        </div>
        <div class="course_box">
            <div class="lives_item">
                <div class="lives_item_name">ID</div>
                <div class="lives_item_value">{{info.id}}</div>
            </div>
            <div class="lives_item">
                <div class="lives_item_name">班次记录ID</div>
                <div class="lives_item_value">{{info.ycl_id}}</div>
            </div> 
            <div class="lives_item">
                <div class="lives_item_name">讲次序号</div>
                <div class="lives_item_value">{{info.course_sn}}</div>
            </div> 
            <div class="lives_item">
                <div class="lives_item_name">视频名称</div>
                <div class="lives_item_value">{{info.title}}</div>
            </div>
            <div class="lives_item">
                <div class="lives_item_name">视频地址</div>
                <div class="lives_item_value">{{info.uri_path}}</div>
            </div>
            <div class="lives_item">
                <div class="lives_item_name">类型</div>
                <div class="lives_item_value">
                    <span v-if="info.type==1">共享视频</span>
                    <span v-else>个别视频</span>
                </div>
            </div>   
            <div class="lives_item">
                <div class="lives_item_name">排序</div>
                <div class="lives_item_value">{{info.sort}}</div>
            </div>   
            <div class="lives_item">
                <div class="lives_item_name">状态</div>
                <div class="lives_item_value">
                    <el-tag type="success" v-if="info.state==2">已发布</el-tag>
                    <el-tag type="info" v-else>未发布</el-tag>
                </div>
            </div>  
            <div class="lives_item">
                <div class="lives_item_name">操作人</div>
                <div class="lives_item_value">{{info.opt_name}}</div>
            </div>  
            <div class="lives_item">
                <div class="lives_item_name">创建时间</div>
                <div class="lives_item_value">{{info.create_time}}</div>
            </div>  
            <div class="lives_item">
                <div class="lives_item_name">更新时间</div>
                <div class="lives_item_value">{{info.update_time}}</div>
            </div>   
            <div class="lives_item">
                <div class="lives_item_name">分校</div>
                <div class="lives_item_value">{{info.school_name}}</div>
            </div> 
            <div class="lives_item">
                <div class="lives_item_name">年份</div>
                <div class="lives_item_value">{{info.year}}</div>
            </div> 
            <div class="lives_item">
                <div class="lives_item_name">产品小类</div>
                <div class="lives_item_value">{{info.small_type_name}}</div>
            </div> 
            <div class="lives_item">
                <div class="lives_item_name">学科</div>
                <div class="lives_item_value">{{info.subject_name}}</div>
            </div> 
            <div class="lives_item">
                <div class="lives_item_name">年级</div>
                <div class="lives_item_value">{{info.grade_name}}</div>
            </div> 
            <div class="lives_item">
                <div class="lives_item_name">班次名称</div>
                <div class="lives_item_value">{{info.level_name}}</div>
            </div>            
        </div>
        <div class="formbtnbox">
            <el-button icon='el-icon-back' type="primary" @click="gobackFn">返回</el-button>
        </div>
    </div>
</template>

<script>
    
    export default {
        data() {
            return {
                loading:false,
                id:"",
                info:{

                }
            }
        },
        methods: {
            gobackFn(){
                this.$router.push({name:"LivesMatch"});
            },
            getLiveInfoDetail(){
                this.loading=true;
                this.$ajax({
                    method: 'post',
                    url:  'resource/videoreview/getinfo',
                    data:this.qs.stringify({
                        id:this.id,
                    })
                }).then( (res)=> {
                    this.loading=false;
                    this.info = res;
                }).catch( (res)=> {
                    this.loading=false;
                });
            }
        },
        mounted() {
            this.id = this.$route.params.id;
            this.getLiveInfoDetail();
        }
    };
</script>

