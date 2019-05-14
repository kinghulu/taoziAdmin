<!--
* 资源匹配
-->
<template>
    <div class="">
        <el-breadcrumb class="breadcrumbs" separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>
                <router-link :to="{name:'CourseMatch'}">课程资源匹配</router-link>
            </el-breadcrumb-item>
            <el-breadcrumb-item>
                <router-link :to="{name:'FilesList'}">资源上传匹配</router-link>
            </el-breadcrumb-item>
            <el-breadcrumb-item>
                <span>资源匹配</span>
            </el-breadcrumb-item>
        </el-breadcrumb>
        <h2 class="pageTitle">{{$route.meta.cn}}</h2>
        
        <div class="currentfile" v-loading="detailloading">
            <el-form ref="form" :model="curr" inline="" label-width="100px" label-position="right">
                <el-form-item label="资源名称：">
                    <span class="t_grey">{{curr.title}}</span>
                </el-form-item>
                <el-form-item label="资源类型：">
                    <span class="t_grey">{{getFileType(curr.type)}}</span>
                </el-form-item>
                <el-form-item label="资源：">
                    <span class="t_grey">{{curr.uri_path}}</span>
                </el-form-item>
            </el-form>
        </div>

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
            <el-col :span="2">
                <el-select v-model="forms.subject" clearable placeholder="学科" size="small" @change="changeSubjectFn">
                    <el-option
                    v-for="(item,index) in options.subject"
                    :key="index"
                    :label="item.bd_subject_name"
                    :value="item.bd_subject">
                    </el-option>
                </el-select>
            </el-col>
            <el-col :span="2">
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
                <el-select v-model="forms.classlevel" clearable placeholder="班次" size="small" @change="changeClasslevelFn">
                    <el-option
                    v-for="(item,index) in options.classlevel"
                    :key="index"
                    :label="item.bd_cla_class_name"
                    :value="item.bd_class_name">
                    </el-option>
                </el-select>
            </el-col>
            <el-col :span="2">
                <el-select v-model="forms.course" clearable placeholder="课次" size="small">
                    <el-option
                    v-for="(item,index) in options.course"
                    :key="index"
                    :label="item"
                    :value="item">
                    </el-option>
                </el-select>
            </el-col>
            <el-col :span="3">
                <el-select v-model="forms.moduleType" clearable placeholder="资源模块" size="small">
                    <el-option
                    v-for="(item,index) in options.moduleType"
                    :key="index"
                    :label="item"
                    :value="index">
                    </el-option>
                </el-select>
            </el-col>
            <el-col :span="3">
                <el-button type="primary" size="small" @click="matchAddHandle">匹配添加</el-button>
            </el-col>
        </el-row>
        <div class="course_box">
            <h3>新增匹配课次列表</h3>
            <el-table :data="MatchNewData" border style="width: 100%; margin-top:15px;">
                <el-table-column label="序号" width="60" align="center" type="index" />
                <el-table-column prop="school_name" label="分校" align="center" />
                <el-table-column prop="year" label="年份" align="center" width="80" />
                <el-table-column prop="small_type_name" label="产品小类" align="center" />
                <el-table-column prop="subject_name" label="学科" align="center" width="80" />
                <el-table-column prop="grade_name" label="年级" align="center" width="100" />
                <el-table-column prop="level_name" label="班次" align="center" />
                <el-table-column prop="course_sn" label="课次" align="center" width="60" />
                <el-table-column label="资源模块" align="center">
                    <template slot-scope="scope">
                        {{getMoudleType(scope.row.resource_module)}}
                    </template>
                </el-table-column>
                <el-table-column prop="sort" label="排序" align="center" width="60" />
                <el-table-column label="操作" align="center" width="120" fixed="right">
                    <template slot-scope="scope">
                        <el-button size="mini" type="danger" @click="deleteMatchNew(scope.$index)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        
        <div class="formbtnbox">
            <el-button type="primary" style="width:200px;" @click="handleSave" v-loading="saveloading"> 保 存 </el-button>
            <el-button type="text" style="width:60px;" @click="cancleSaveFn">取消</el-button>
        </div>
        <div class="course_box">
            <h3>已匹配课次列表</h3>
            <el-table :data="MatchDetailData" border style="width: 100%; margin-top:15px;">
                <el-table-column label="序号" width="60" align="center" type="index" />
                <el-table-column prop="school_name" label="分校" align="center" />
                <el-table-column prop="year" label="年份" align="center" width="80" />
                <el-table-column prop="small_type_name" label="产品小类" align="center" />
                <el-table-column prop="subject_name" label="学科" align="center" width="80" />
                <el-table-column prop="grade_name" label="年级" align="center" width="100" />
                <el-table-column prop="level_name" label="班次" align="center" />
                <el-table-column prop="course_sn" label="课次" align="center" width="60" />
                <el-table-column label="资源模块" align="center">
                    <template slot-scope="scope">
                        {{getMoudleType(scope.row.resource_module)}}
                    </template>
                </el-table-column>
                <el-table-column prop="sort" label="排序" align="center" width="60" />
                <el-table-column label="操作" align="center" width="120" fixed="right">
                    <template slot-scope="scope">
                        <el-button size="mini" type="danger" @click="deleteMatchFn(scope.row.id)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
    import {filesType,moduleType} from '@/utils/config';
    export default {
        data() {
            return {
                loading:true,
                detailloading:false,
                jilianLoading:false,
                saveloading:false,
                f_id:'',
                curr:{
                    title:"2dgadsgggg",
                    type:3,
                    uri_path:"",
                    id_code:"1|4#2|4#3|2#4|5"
                },
                forms:{
                    school:"",
                    year:"",
                    smalltype:"",
                    subject:"",
                    grade:"",
                    classlevel:"",
                    course:"",
                    moduleType:''
                },
                options:{
                    school:[],
                    year:[],
                    smalltype:[],
                    subject:[],
                    grade:[],
                    classlevel:[],
                    moduleType:{},
                    course:[],
                },
                MatchDetailData:[],
                MatchNewData:[]
            }
        },
        methods: {
            //获取资源编辑详情
            getFileDetail(){
                this.detailloading = true;
                this.$ajax({
                    method: 'post',
                    url:  'resource/curriculum/editresourcelist',
                    data:this.qs.stringify({
                        id:this.f_id
                    })
                }).then( (res)=> {
                    this.detailloading = false;
                    this.curr.uri_path = res.uri_path;
                    this.curr.title = res.title;
                    this.curr.type = res.type;

                    //修炼资源包仅可以匹配至进阶修炼模块，视频/PDF/链接可以匹配至预习模块/复习模块；
                    if(this.curr.type==4){
                        this.options.moduleType[2] = moduleType[2];
                    }else{
                        this.options.moduleType[1] = moduleType[1];
                        this.options.moduleType[3] = moduleType[3];
                    }
                    
                }).catch( (res)=> {
                    this.detailloading = false;
                });
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
            //获取资源类型
            getMoudleType(v){
                return moduleType[v];
            },
            //匹配添加
            matchAddHandle(){
                //判断是否都为空
                for(let i in this.forms){
                    if(this.forms[i]==""){
                        this.$message.error("级联选项必须全选")
                        return false;
                    }
                                      
                }

                this.jilianLoading = true;
                this.$ajax({
                    method: 'post',
                    url:  'resource/curriculum/resourcemateadd',
                    data:this.qs.stringify({
                        school_id:this.forms.school,
                        year:this.forms.year,
                        small_type_id:this.forms.smalltype,
                        subject_id:this.forms.subject,
                        grade_id:this.forms.grade,
                        level_id:this.forms.classlevel,
                        course_sn:this.forms.course,
                        resource_module:this.forms.moduleType,
                        resource_id:this.f_id
                    })
                }).then( (res)=> {
                    this.jilianLoading = false;
                    
                    for(let i in this.MatchNewData){
                        let item = this.MatchNewData[i];
                        if(item.ycl_id==res.ycl_id && item.course_sn==res.course_sn && item.resource_module==res.resource_module){
                            this.$message.error("已经匹配至该课，不允许重复匹配！");
                            return false;
                        }
                    }
                    let obj = {
                        grade_name: res.grade_name,
                        level_name: res.level_name,
                        school_name: res.school_name,
                        small_type_name: res.small_type_name,
                        subject_name: res.subject_name,
                        sort:0,
                        year: res.year,
                        ycl_id: res.ycl_id,
                        course_sn: res.course_sn,
                        resource_module: res.resource_module,
                    }
                    this.MatchNewData.push(obj);

                }).catch( (res)=> {
                    this.jilianLoading = false;
                });

            },
            //删除匹配
            deleteMatchFn(id){
                this.$confirm(`您将要删除该资源匹配吗？`, '确认删除？', {
                    confirmButtonText: '删除',
                    cancelButtonText: `取消`,
                    type: 'warning'
                }).then(() => {
                    //
                    this.loading = true;
                    this.$ajax({
                        method: 'post',
                        url:  'resource/curriculum/delmatestate',
                        data:this.qs.stringify({
                            id:id,
                        })
                    }).then( (res)=> {
                        this.loading = false;
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getMatecoursedetails(this.f_id);
                    }).catch( (res)=> {
                        this.loading = false;
                    });
                }).catch(() => {
                       
                });
            },
            //取消保存
            cancleSaveFn(){
                this.$confirm(`确定取消保存吗？`, '提示', {
                    confirmButtonText: '确定取消',
                    cancelButtonText: `再想想`,
                    type: 'warning'
                }).then(() => {
                    this.$router.go(-1);
                }).catch(() => {});
            },
            //删除内容
            deleteMatchNew(index){
                this.$confirm(`确定删除吗`, '提示', {
                    confirmButtonText: '确定删除',
                    cancelButtonText: `再想想`,
                    type: 'warning'
                }).then(() => {
                    this.MatchNewData.splice(index,1);
                }).catch(() => {});
            },
            //保存
            handleSave(){
                this.saveloading = true;
                let cdata = [];
                for(let i in this.MatchNewData){
                    let item = this.MatchNewData[i];
                    let obj = {
                        resource_id: this.f_id,
                        ycl_id:item.ycl_id,
                        course_sn:item.course_sn,
                        resource_module:item.resource_module,
                    };
                    cdata.push(obj);
                }
                
                this.$ajax({
                    method: 'post',
                    url:  'resource/curriculum/resourcemate',
                    data:this.qs.stringify({
                        data:JSON.stringify(cdata),
                    })
                }).then( (res)=> {
                    this.saveloading = false;
                    this.$notify({
                        title: '课件匹配成功',
                        message: '课件资源匹配成功，请在课件匹配列表或对应课次中查看课件的匹配情况。',
                        type: 'success'
                    });
                    this.getMatecoursedetails(this.f_id);
                    this.MatchNewData=[];
                }).catch( (res)=> {
                    this.saveloading = false;
                });
            }
        },
        watch: {
            
        },
        mounted() {
            if(!this.isHasAuth("d2")){
                this.$router.replace({name: 'P403'});
            };
            this.f_id = this.$route.params.fid;
            this.getFileDetail();
            this.getMatecoursedetails(this.f_id);
            this.getCascadeFn({
                level_name:"school"
            });
        }
    };
</script>
