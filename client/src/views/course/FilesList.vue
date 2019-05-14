<template>
    <div class="files">
        <el-breadcrumb class="breadcrumbs" separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>
                <router-link :to="{name:'CourseMatch'}">课程资源匹配</router-link>
            </el-breadcrumb-item>
            <el-breadcrumb-item>
                <span>资源上传匹配</span>
            </el-breadcrumb-item>
        </el-breadcrumb>
        <div class="pagetopBox">
            <h2 class="pageTitle">课次匹配查询</h2>
            <el-button type="success" icon="el-icon-upload" @click="goFilesUpload" :class="hasEditRole?'':'disabled'">上传资源</el-button>
        </div>
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
                <el-select v-model="forms.fileType" placeholder="资源类型" clearable size="small">
                    <el-option
                    v-for="(item,index) in options.fileType"
                    :key="index"
                    :label="item.name"
                    :value="item.value">
                    </el-option>
                </el-select>
            </el-col>
            <el-col :span="3">
                <el-button type="primary" size="small" @click="searchListFn">搜索</el-button>
            </el-col>
        </el-row>

        
        <div class="course_box">
            <el-table :data="filesData" border stripe style="width: 100%" v-loading="loading">
                <el-table-column prop="title" label="资源名称" />
                <el-table-column prop="typename" label="资源类型" align="center" />
                <el-table-column prop="create_time" label="创建时间" align="center" width="160"></el-table-column>
                <el-table-column prop="update_time" label="最后修改时间" align="center" width="160" />
                <el-table-column label="已匹配课程课次" align="center" width="160">
                    <template slot-scope="scope">
                        <el-button size="mini" type="info" @click="getMatecoursedetails(scope.row.id)" >详情</el-button>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" width="190">
                    <template slot-scope="scope">
                        <el-button size="mini" type="success" @click="editFileFn(scope.row.id)" :class="hasEditRole?'':'disabled'">编辑</el-button>
                        <el-button size="mini" type="primary" @click="matchFileFn(scope.row.id)" :class="hasEditRole?'':'disabled'">匹配</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="page_box">
                <el-pagination
                layout="prev, pager, next" :page-size="page_size"
                :total="total_rec" @current-change="handlePageChange"
            :current-page.sync="page_num">
                </el-pagination>
            </div>
        </div>

        <!--匹配课次详情-->
        <el-dialog title="匹配详情" :visible.sync="dialogMatchVisible" class="bigWidthDialog">
            <el-table :data="MatchDetailData" empty-text="该资源没有匹配课程">
                <el-table-column label="序号" type="index"></el-table-column>
                <el-table-column property="year" label="日期"></el-table-column>
                <el-table-column property="small_type_name" label="产品小类"></el-table-column>
                <el-table-column property="subject_name" label="学科"></el-table-column>
                <el-table-column property="grade_name" label="年级"></el-table-column>
                <el-table-column property="level_name" label="班次"></el-table-column>
                <el-table-column property="course_sn" label="课次"></el-table-column>
                <el-table-column label="模块">
                    <template slot-scope="scope">
                        {{getMoudleType(scope.row.resource_module)}}
                    </template>
                </el-table-column>
                <el-table-column property="sort" label="排序"></el-table-column>
            </el-table>
        </el-dialog>

    </div>
</template>

<script>
    import {filesType,moduleType} from '@/utils/config';
    export default {
        data() {
            return {
                loading:false,
                hasEditRole:true,
                dialogMatchVisible:false,
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
                    course:"",
                    fileType:''
                },
                options:{
                    school:[],
                    year:[],
                    smalltype:[],
                    subject:[],
                    grade:[],
                    classlevel:[],
                    fileType:[],
                    course:[],
                },
                filesData: [],
                MatchDetailData:[]
            }
        },
        methods: {
            goFilesUpload(){
                if(!this.hasEditRole){
                    this.$message.error("没有操作权限");
                    return false;
                }
                this.$router.push({name:"FilesUpload"});
            },
            getFilesList(){
                this.loading = true;
                this.$ajax({
                    method: 'post',
                    url:  'resource/curriculum/resuploadsearchlist',
                    data:this.qs.stringify({
                        page_num:this.page_num,
                        page_size:this.page_size,
                        school_id:this.forms.school,
                        year:this.forms.year,
                        small_type_id:this.forms.smalltype,
                        subject_id:this.forms.subject,
                        grade_id:this.forms.grade,
                        level_id:this.forms.classlevel,
                        course_sn:this.forms.course,
                        type:this.forms.fileType
                    })

                }).then( (res)=> {
                    this.loading = false;
                    if(res.list){
                        let list = JSON.parse(JSON.stringify(res.list));
                        for(let i in list){
                            let item = list[i];
                            for(let j in filesType){
                                if(filesType[j].value == item.type){
                                    item.typename = filesType[j].name;
                                    break;
                                }
                            }
                        }
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
            //已匹配课程详情
            getMatecoursedetails(id){
                this.loading = true;
                this.$ajax({
                    method: 'post',
                    url:  'resource/curriculum/matecoursedetails',
                    data:this.qs.stringify({
                        id:id
                    })

                }).then( (res)=> {
                    this.loading = false;
                    this.dialogMatchVisible = true;
                    this.MatchDetailData = res;
                }).catch( (res)=> {
                    this.loading = false;
                    this.dialogMatchVisible = true;
                });
            },
            //搜索事件
            searchListFn(){
                this.page_num = 1;
                this.getFilesList();
            },
            //获取资源类型
            getMoudleType(v){
                return moduleType[v];
            },
            editFileFn(id){
                if(!this.hasEditRole){
                    this.$message.error("没有操作权限");
                    return false;
                }
                this.$router.push({name:'FilesEdit',params:{fid:id}})
            },
            matchFileFn(id){
                if(!this.hasEditRole){
                    this.$message.error("没有操作权限");
                    return false;
                }
                this.$router.push({name:'FilesMatch',params:{fid:id}})
            }
        },
        watch: {
            
        },
        mounted() {
            this.hasEditRole = this.isHasAuth("d2");
            this.getFilesList();
            this.options.fileType = filesType;
            this.getCascadeFn({
                level_name:"school"
            });
        }
    };
</script>

