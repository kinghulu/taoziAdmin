<template>
    <div class="files">
        <el-breadcrumb class="breadcrumbs" separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>
                <router-link :to="{name:'CourseMatch'}">课程资源匹配</router-link>
            </el-breadcrumb-item>
            <el-breadcrumb-item>
                <span>解析视频匹配</span>
            </el-breadcrumb-item>
        </el-breadcrumb>
        <div class="pagetopBox">
            <h2 class="pageTitle">解析视频匹配</h2>
            <el-button type="success" icon='el-icon-plus' @click="goAddParse" :class="hasEditRole?'':'disabled'">新增解析视频</el-button>
        </div>
        <div class="course_box">
            <el-row class="course_select" v-loading="jilianLoading">
                <el-col :span="3">
                    <el-select v-model="forms.school" placeholder="分校" clearable size="small" @change="changeSchoolFn">
                        <el-option
                        v-for="(item,index) in options.school"
                        :key="index"
                        :label="item.bd_school_name"
                        :value="item.bd_school">
                        </el-option>
                    </el-select>
                </el-col>
                <el-col :span="2">
                    <el-select v-model="forms.year" placeholder="年份" clearable size="small" @change="changeYearFn">
                        <el-option
                        v-for="(item,index) in options.year"
                        :key="index"
                        :label="item.bd_year_name"
                        :value="item.bd_year_name">
                        </el-option>
                    </el-select>
                </el-col>
                <el-col :span="3">
                    <el-select v-model="forms.smalltype" placeholder="产品小类" clearable size="small" @change="changeSmallTypeFn">
                        <el-option
                        v-for="(item,index) in options.smalltype"
                        :key="index"
                        :label="item.bd_producttype_small_name"
                        :value="item.bd_producttype_small">
                        </el-option>
                    </el-select>
                </el-col>
                <el-col :span="2">
                    <el-select v-model="forms.subject" placeholder="学科" clearable size="small" @change="changeSubjectFn">
                        <el-option
                        v-for="(item,index) in options.subject"
                        :key="index"
                        :label="item.bd_subject_name"
                        :value="item.bd_subject">
                        </el-option>
                    </el-select>
                </el-col>
                <el-col :span="2">
                    <el-select v-model="forms.grade" placeholder="年级" clearable size="small" @change="changeGradeFn">
                        <el-option
                        v-for="(item,index) in options.grade"
                        :key="index"
                        :label="item.bd_grade_name"
                        :value="item.bd_grade">
                        </el-option>
                    </el-select>
                </el-col>
                <el-col :span="3">
                    <el-select v-model="forms.classlevel" placeholder="班次" clearable size="small" @change="changeClasslevelFn">
                        <el-option
                        v-for="(item,index) in options.classlevel"
                        :key="index"
                        :label="item.bd_cla_class_name"
                        :value="item.bd_class_name">
                        </el-option>
                    </el-select>
                </el-col>
                <el-col :span="2">
                    <el-select v-model="forms.course" placeholder="课次" clearable size="small">
                        <el-option
                        v-for="(item,index) in options.course"
                        :key="index"
                        :label="item"
                        :value="item">
                        </el-option>
                    </el-select>
                </el-col>
                <el-col :span="3">
                    <el-button type="primary" size="small" @click="searchListFn">搜索</el-button>
                </el-col>
            </el-row>
            <div v-if="filesData.length" style="padding-top:10px;">
                <div class="ylives_box">
                    <div class="ylives_item" v-for="(item,index) in filesData" :key="index">
                        <div class="ylives_video">
                            <!--<video controls="controls" :src="item.uri_path" controlslist="nodownload" oncontextmenu="return false">
                                {{item.uri_path}}
                            </video>
                            -->
                             <iframe :src="item.uri_path" style="width:100%; height:100%; border:none; background:#eee; border:1px solid #eee;"></iframe>
                        </div>
                        <div class="ylives_main">
                            <h2 :title='item.small_type_name + " " + item.level_name + " 第" + item.course_sn + "讲"'><a :href='item.uri_path' target="_blank">{{item.small_type_name + " " + item.level_name + " 第" + item.course_sn + "讲"}}</a></h2>
                            <div class="ylives_item_time">{{item.create_time}}</div>
                            <div class="ylives_item_info">
                                <div class="ylives_item_info_f">年份：{{item.year}}</div>
                                <div class="ylives_item_info_f">分校：{{item.school_name}}</div>
                                <div class="ylives_item_info_f">学科：{{item.subject_name}}</div>
                                <div class="ylives_item_info_f">年级：{{item.grade_name}}</div>
                                <div class="ylives_item_info_f">资源序号：{{item.id_code}}</div>
                                <div class="ylives_item_info_f">题号：{{item.q_id}}</div>
                            </div>
                            <div class="ylives_item_btn">
                                <el-button size="mini" :class="hasEditRole?'':'disabled'" :type="item.state==2?'warning':'primary'" @click="handleToggle(item)">
                                    <span v-if="item.state==2">取消发布</span>
                                    <span v-else>发布</span>
                                </el-button>
                                <el-button size="mini" type="success" :class="hasEditRole?'':'disabled'" @click='handleEdit(item)'>编辑</el-button>
                            </div>
                        </div>
                    </div>
                </div>
                <!--
                <el-table :data="filesData" border style="width: 100%; margin-top:15px;">
                    <el-table-column label="序号" width="60" align="center" type="index" />
                    <el-table-column prop="school_name" label="分校" align="center" />
                    <el-table-column prop="year" label="年份" align="center" width="90" />
                    <el-table-column prop="small_type_name" label="产品小类" align="center" width="120" />
                    <el-table-column prop="subject_name" label="学科" align="center" width="100" />
                    <el-table-column prop="grade_name" label="年级" align="center" width="100" />
                    <el-table-column prop="level_name" label="班次" align="center" width="160" />
                    <el-table-column prop="course_sn" label="课次" align="center" width="80" />
                    <el-table-column prop="id_code" label="资源序号" align="center" width="80" />
                    <el-table-column prop="q_id" label="题号" align="center" width="70" />
                    <el-table-column prop="uri_path" label="视频链接" align="center" width="260" />
                    <el-table-column label="状态" align="center" width="120">
                        <template slot-scope="scope">
                            <el-tag type="success" v-if="scope.row.state==2">已发布</el-tag>
                            <el-tag type="info" v-else>未发布</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" align="center" width="180" fixed="right">
                        <template slot-scope="scope">
                            <el-button size="mini" :type="scope.row.state==2?'warning':'primary'" @click="handleToggle(scope.row)"  :class="hasEditRole?'':'disabled'">
                                <span v-if="scope.row.state==2">取消发布</span>
                                <span v-else>发布</span>
                            </el-button>
                            <el-button size="mini" @click="handleEdit(scope.row)"  :class="hasEditRole?'':'disabled'">编辑</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                -->
                <div class="page_box">
                    <el-pagination
                    layout="prev, pager, next" :page-size="page_size"
                    :total="total_rec" @current-change="handlePageChange"
                :current-page.sync="page_num">
                    </el-pagination>
                </div>
            </div>
            <div class="emptyBox" v-else>
                暂无数据
            </div>
        </div>


        
    </div>
</template>

<script>
    export default {
        data() {
            return {
                loading:true,
                hasEditRole:true,
                jilianLoading:true,
                page_num:1,//当前页码
                total_rec: 1,
                forms:{
                    school:"",
                    year:"",
                    smalltype:"",
                    subject:"",
                    grade:"",
                    classlevel:"",
                    course:""
                },
                options:{
                    school:[],
                    year:[],
                    smalltype:[],
                    subject:[],
                    grade:[],
                    classlevel:[],
                    course:[],
                },

                filesData: []
            }
        },
        methods: {
            goAddParse(){
                if(!this.hasEditRole){
                    this.$message.error("没有操作权限");
                    return false;
                }
                this.$router.push({name:"ParseAdd"});
            },
            //分校改变
            changeSchoolFn(){
                let obj = {
                    level_name:"year",
                    school_id:this.forms.school
                }
                this.clearAfterSelect(obj.level_name);
                if(this.forms.school){
                    this.getCascadeFn(obj);
                }
            },
            //年份更改
            changeYearFn(){
                let obj = {
                    level_name:"smalltype",
                    school_id:this.forms.school,
                    year:this.forms.year
                }
                this.clearAfterSelect(obj.level_name);
                if(this.forms.year){
                    this.getCascadeFn(obj);
                }
            },
            //产品小类更改
            changeSmallTypeFn(){
                let obj = {
                    level_name:"subject",
                    school_id:this.forms.school,
                    year:this.forms.year,
                    small_type_id:this.forms.smalltype
                }
                this.clearAfterSelect(obj.level_name);
                if(this.forms.smalltype){
                    this.getCascadeFn(obj);
                }
            },
            //学科更改
            changeSubjectFn(){
                let obj = {
                    level_name:"grade",
                    school_id:this.forms.school,
                    year:this.forms.year,
                    small_type_id:this.forms.smalltype,
                    subject_id:this.forms.subject
                }
                this.clearAfterSelect(obj.level_name);
                if(this.forms.subject){
                    this.getCascadeFn(obj);
                }
            },
            //年级更改
            changeGradeFn(){
                let obj = {
                    level_name:"classlevel",
                    school_id:this.forms.school,
                    year:this.forms.year,
                    small_type_id:this.forms.smalltype,
                    subject_id:this.forms.subject,
                    grade_id:this.forms.grade
                }
                this.clearAfterSelect(obj.level_name);
                if(this.forms.grade){
                    this.getCascadeFn(obj);
                }
            },
            //班次更改
            changeClasslevelFn(v){
                this.clearAfterSelect("course");
                let _total = 0;
                let c_level = this.options.classlevel;
                for(let i in c_level){
                    if(v==c_level[i].bd_class_name){
                        _total = c_level[i].cla_total;
                    }
                }
                for(let j=1; j<=_total; j++){
                    this.options.course.push(j);
                }
            },
            /**
             * 级联查询接口
             * @obj:{
             *     level_name:"", //级联名称 school:获取校区 year:获取年份 smalltype:获取产品小类 subject:获取学科 grade:获取年级 classlevel:获取班次及课次数
             *     school_id:"" ,//学校id
             *     year:"", //年份
             *     small_type_id:"", //产品小类
             *     subject_id:"", //学科id
             *     grade_id:"" //年级
             * }
             */
            getCascadeFn(obj){
                this.jilianLoading=true;
                this.$ajax({
                    method: 'post',
                    url:  'resource/cascade/getcascade',
                    data:this.qs.stringify(obj)
                }).then( (res)=> {
                    this.jilianLoading=false;
                    this.options[obj.level_name] = res;
                }).catch( (res)=> {
                    this.jilianLoading=false;
                });
            },
            //清空当前选项后的下拉内容
            clearAfterSelect(name){
                let selectindexarr = ["school","year","smalltype","subject","grade","classlevel","course"]; //级联次序，更改后，之后的select值要清空
                let p_index = selectindexarr.indexOf(name);
                for(let i=p_index; i<selectindexarr.length; i++ ){
                    this.options[selectindexarr[i]]=[];
                    this.forms[selectindexarr[i]]='';//清空当前选项
                }
            },
            //搜索事件
            searchListFn(){
                // if(!this.forms.school){
                //     this.$message.error("请至少选择一项");
                // }else{
                //     this.page_num = 1;
                //     this.getFilesList();
                // }
                this.page_num = 1;
                    this.getFilesList();
            },
            getFilesList(){
                this.loading = true;
                this.$ajax({
                    method: 'post',
                    url:  'resource/videoanaly/index',
                    data:this.qs.stringify({
                        page_num:this.page_num,
                        page_size:this.page_size,
                        school_id:this.forms.school,
                        year:this.forms.year,
                        small_type_id:this.forms.smalltype,
                        subject_id:this.forms.subject,
                        grade_id:this.forms.grade,
                        level_id:this.forms.classlevel,
                        course_sn:this.forms.course
                    })

                }).then( (res)=> {
                    this.loading = false;
                    if(res.list){
                        let list = JSON.parse(JSON.stringify(res.list));
                        this.filesData = list;
                        this.total_rec = res.total_rec;
                    }else{
                        this.filesData = [];
                        this.total_rec = 0;
                    }
                    
                }).catch( (res)=> {
                    this.loading = false;
                });
            },
            handlePageChange(val){
                this.page_num = val;
                this.getFilesList();
            },
            //切换状态
            handleSwitchstate(id,state,type){
                this.loading = true;
                this.$ajax({
                    method: 'post',
                    url:  'resource/videoanaly/switchstate',
                    data:this.qs.stringify({
                        id:id,
                        state:state
                    })
                }).then( (res)=> {
                    this.loading = false;
                    this.getFilesList();
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
                this.handleSwitchstate(rd.id,resultstate,rd.type);
            },
            handleEdit(row){
                if(!this.hasEditRole){
                    this.$message.error("没有操作权限");
                    return false;
                }
                if(row.state==2){
                    this.$message.error("发布中不允许修改");
                }else{
                    this.$router.push({name:'ParseEdit',query:{id:row.id}});
                }
            },
        },
        watch: {
            
        },
        mounted() {
            this.hasEditRole = this.isHasAuth("e2");
            this.getFilesList();
            this.getCascadeFn({
                level_name:"school"
            });
        }
    };
</script>

