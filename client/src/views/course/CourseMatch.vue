<!--
* 课程资源匹配
-->
<template>
    <div class="course">
        <h2 class="pageTitle">课程资源匹配</h2>
        <el-row class="course_select" v-loading="jilianLoading">
            <el-col :span="3">
                <el-select v-model="forms.school" clearable placeholder="分校" size="small" @change="changeSchoolFn">
                    <el-option
                    v-for="(item,index) in options.school"
                    :key="index"
                    :label="item.bd_school_name"
                    :value="item.bd_school">
                    </el-option>
                </el-select>
            </el-col>
            <el-col :span="2">
                <el-select v-model="forms.year" clearable placeholder="年份" size="small" @change="changeYearFn">
                    <el-option
                    v-for="(item,index) in options.year"
                    :key="index"
                    :label="item.bd_year_name"
                    :value="item.bd_year_name">
                    </el-option>
                </el-select>
            </el-col>
            <el-col :span="3">
                <el-select v-model="forms.smalltype" clearable placeholder="产品小类" size="small" @change="changeSmallTypeFn">
                    <el-option
                    v-for="(item,index) in options.smalltype"
                    :key="index"
                    :label="item.bd_producttype_small_name"
                    :value="item.bd_producttype_small">
                    </el-option>
                </el-select>
            </el-col>
            <el-col :span="3">
                <el-select v-model="forms.subject" clearable placeholder="学科" size="small" @change="changeSubjectFn">
                    <el-option
                    v-for="(item,index) in options.subject"
                    :key="index"
                    :label="item.bd_subject_name"
                    :value="item.bd_subject">
                    </el-option>
                </el-select>
            </el-col>
            <el-col :span="3">
                <el-select v-model="forms.grade" clearable placeholder="年级" size="small" @change="changeGradeFn">
                    <el-option
                    v-for="(item,index) in options.grade"
                    :key="index"
                    :label="item.bd_grade_name"
                    :value="item.bd_grade">
                    </el-option>
                </el-select>
            </el-col>
            <el-col :span="3">
                <el-select v-model="forms.classlevel" clearable placeholder="班次" size="small">
                    <el-option
                    v-for="(item,index) in options.classlevel"
                    :key="index"
                    :label="item.bd_cla_class_name"
                    :value="item.bd_class_name">
                    </el-option>
                </el-select>
            </el-col>
            <el-col :span="3">
                <el-button type="primary" size="small" @click="handleSearch" style="width:100px;">搜索</el-button>
            </el-col>
        </el-row>

        <div class="course_box" v-loading="loading">
            <el-table :data="courseData" border style="width: 100%" empty-text="暂无数据" >
                <el-table-column prop="level_name" label="班次整体名称" />
                <el-table-column prop="sn_num" label="讲次数量" width="80" align="center" />
                <el-table-column prop="configured_num" label="已配置讲次数量" width="150" align="center" />
                <el-table-column prop="unconfigured_num" width="150" label="未配置讲次数量" align="center" />
                <el-table-column width="180" label="操作" align="center" fixed="right">
                    <template slot-scope="scope">
                        <el-button  icon="el-icon-edit"
                        size="mini" type="primary" @click="handleEdit(scope.row)">配置</el-button>
                        <el-button size="mini" @click="handleView(scope.row)">预览</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="page_box">
                <el-pagination
                layout="prev, pager, next"
                 :page-size="p_size"
                :total="total_rec" @current-change="handlePageChange"
                 :current-page.sync="page_num">
                </el-pagination>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                jilianLoading:false,
                forms:{
                    school:"",
                    year:"",
                    smalltype:"",
                    subject:"",
                    grade:"",
                    classlevel:""
                },
                options:{
                    school:[],
                    year:[],
                    smalltype:[],
                    subject:[],
                    grade:[],
                    classlevel:[]
                },
                page_num:1, //当前页码
                loading:false,
                total_rec:1,
                p_size:0,
                courseData: []
            }
        },
        methods: {
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
            handleSearch(){
                this.page_num = 1;
                this.searchListFn();
            },
            //搜索事件
            searchListFn(){
                if(!this.forms.school){
                    this.$message.error("至少选择一项进行搜索");
                    return false;
                }else{
                    this.loading = true;
                    this.$ajax({
                        method: 'post',
                        url:  'resource/curriculum/indexsearch',
                        data:this.qs.stringify({
                            school_id:this.forms.school,
                            year:this.forms.year,
                            small_type_id:this.forms.smalltype,
                            subject_id:this.forms.subject,
                            grade_id:this.forms.grade,
                            level_id:this.forms.classlevel,
                            page_num:this.page_num,
                            page_size:this.page_size,
                        })
                    }).then( (res)=> {
                        this.loading = false;
                        if(res.total_rec){
                            this.total_rec = res.total_rec;
                            this.courseData = res.list;
                        }else{
                            this.courseData = [];
                        }
                    }).catch( (res)=> {
                        this.loading = false;
                    });
                }
            },
            //分页改变
            handlePageChange(val){
                this.page_num = val;
                this.searchListFn();
            },
            handleView(){
                this.$message('预览开发中...');
            },
            handleEdit(row){
                this.$store.dispatch('setCourseMatch',row);
                this.$router.push({name:'MatchDetail'});
            }
        },
        watch: {
            
        },
        mounted() {
            this.p_size = this.page_size;
            this.getCascadeFn({
                level_name:"school"
            });
        }
    };
</script>