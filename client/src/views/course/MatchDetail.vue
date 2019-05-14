<template>
    <div class="course">
        <el-breadcrumb class="breadcrumbs" separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>
                <router-link :to="{name:'CourseMatch'}">课程资源匹配</router-link>
            </el-breadcrumb-item>
            <el-breadcrumb-item>
                <span>具体课次资源配置</span>
            </el-breadcrumb-item>
        </el-breadcrumb>
        <div class="pagetopBox">
            <h2 class="pageTitle">{{this.courseMatchObj.level_name}}</h2>
            <el-button  size="mini" @click="gobackFn">返回</el-button>
        </div>
        <!--
        <div class="course_box" v-loading="loading">
            <el-table :data="courseData" border stripe style="width: 100%">
                <el-table-column prop="cindex" label="讲次" align="center" width="80" />
                <el-table-column label="预习模块上传情况" align="center">
                    <template slot-scope="scope">
                        <div v-if="scope.row.module1.configure_num>0">已匹配<br>
                            {{getTimeDaystr(scope.row.module1.configure_time)}}
                        </div>
                        <span v-else class="t_grey">未匹配</span>
                    </template>
                </el-table-column>
                <el-table-column label="预习模块资源" align="center">
                    <template slot-scope="scope">
                        <el-button size="mini" type="primary" @click="handleEdit(scope.row,1)">资源管理</el-button>
                    </template>
                </el-table-column>
                <el-table-column label="课后模块上传情况" align="center">
                    <template slot-scope="scope">
                        <div v-if="scope.row.module2.configure_num>0">已匹配<br>
                            {{getTimeDaystr(scope.row.module2.configure_time)}}
                        </div>
                        <span v-else class="t_grey">未匹配</span>
                    </template>
                </el-table-column>
                <el-table-column label="课后模块资源" align="center">
                    <template slot-scope="scope">
                        <el-button size="mini" type="primary" @click="handleEdit(scope.row,2)">资源管理</el-button>
                    </template>
                </el-table-column>
                <el-table-column label="复习模块上传情况" align="center">
                    <template slot-scope="scope">
                        <div v-if="scope.row.module3.configure_num>0">已匹配<br>
                            {{getTimeDaystr(scope.row.module3.configure_time)}}
                        </div>
                        <span v-else class="t_grey">未匹配</span>
                    </template>
                </el-table-column>
                <el-table-column label="复习模块资源" align="center">
                    <template slot-scope="scope">
                        <el-button size="mini" type="primary" @click="handleEdit(scope.row,3)">资源管理</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        -->
        <div class="ycourse" v-loading="loading">
            <div class="ycourse_item" v-for="(item,index) in courseData" :key="index">
                <div class="ycourse_index">{{item.cindex}}<sub>讲次</sub></div>
                <div class="ycourse_moudle ycourse_moudle_yx" :class="item.module1.configure_num>0?'configed':''" @click="handleEdit(item,1)">
                    <h2>预习模块</h2>
                    <div class="ycourse_time">
                        <div v-if="item.module1.configure_num>0">{{getTimeDaystr(item.module1.configure_time)}} 已匹配</div>
                        <div v-else>未匹配</div>
                    </div>
                </div>
                <div class="ycourse_moudle ycourse_moudle_kh" :class="item.module2.configure_num>0?'configed':''" @click="handleEdit(item,2)">
                    <h2>课后模块</h2>
                    <div class="ycourse_time">
                        <div v-if="item.module2.configure_num>0"> {{getTimeDaystr(item.module2.configure_time)}} 已匹配</div>
                        <div v-else>未匹配</div>
                    </div>
                </div>
                <div class="ycourse_moudle ycourse_moudle_fx" :class="item.module3.configure_num>0?'configed':''" @click="handleEdit(item,3)">
                    <h2>复习模块</h2>
                    <div class="ycourse_time">
                        <div v-if="item.module3.configure_num>0">{{getTimeDaystr(item.module3.configure_time)}} 已匹配</div>
                        <div v-else>未匹配</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                loading:true,
                courseMatchObj:'',
                courseData: [],
                ycl_id:''
            }
        },
        methods: {
            gobackFn(){
                this.$router.push({name:'CourseMatch'});
            },
            //获取具体配置信息
            getCourseDetail(){
                this.loading = true;
                this.$ajax({
                    method: 'post',
                    url:  'resource/curriculum/configcourselist',
                    data:this.qs.stringify({
                        school_id:this.courseMatchObj.school_id,		
                        year:this.courseMatchObj.year,		
                        small_type_id:this.courseMatchObj.small_type_id,		
                        subject_id:this.courseMatchObj.subject_id,		
                        grade_id:this.courseMatchObj.grade_id,		
                        level_id:this.courseMatchObj.level_id	
                    })

                }).then( (res)=> {
                    this.loading = false;

                    let courseobj = [];
                    //根据总课次生成列表数据
                    for(let i=1; i<=this.courseMatchObj.sn_num; i++){
                        let obj = {
                            cindex:i,
                            ycl_id:'',
                            module1:{},
                            module2:{},
                            module3:{}
                        }
                        for(let j in res.list){
                            let item=res.list[j];
                            let c_sn = item.course_sn;
                            if(c_sn==i){
                                if(item.module1){
                                    obj.module1 = item.module1;
                                }
                                if(item.module2){
                                    obj.module2 = item.module2;
                                }
                                if(item.module3){
                                    obj.module3 = item.module3;
                                }
                                obj.ycl_id = item.ycl_id;
                                break;
                            }
                        }
                        courseobj.push(obj);
                    }


                    this.courseData = courseobj;
                    this.ycl_id = res.ycl_id;

                }).catch( (res)=> {
                    this.loading = false;
                });
            },
            //获取日期
            getTimeDaystr(datestr){
                return datestr.split(" ")[0]
            },
            handleEdit(row,mid){
                if(this.ycl_id){
                    this.$router.push({name:'MatchedList',query:{sn:row.cindex,module:mid,yclid:this.ycl_id}});
                }else{
                    this.$message.error("数据不全：ycl_id为空")
                }
                
            }
        },
        watch: {
            
        },
        mounted() {
            let courseobj = this.$store.getters.coursematch;
            if(courseobj){
                this.courseMatchObj = JSON.parse(courseobj);
                this.getCourseDetail();
            }else{
                this.$message.error("获取课次数据失败~");
                this.$router.replace({name:'CourseMatch'});
            }
        }
    };
</script>

