<template>
    <div class="files" v-loading="loading">
        <el-breadcrumb class="breadcrumbs" separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>
                <router-link :to="{name:'CourseMatch'}">课程资源匹配</router-link>
            </el-breadcrumb-item>
            <el-breadcrumb-item>
                <router-link :to="{name:'ParseMatch'}">解析视频匹配</router-link>
            </el-breadcrumb-item>
            <el-breadcrumb-item>
                <span>编辑解析视频</span>
            </el-breadcrumb-item>
        </el-breadcrumb>
        <div class="pagetopBox">
            <h2 class="pageTitle">编辑解析视频</h2>
        </div>
        <div class="course_box">
            <el-row class="course_select">
                <el-col :span="3">
                    <el-select v-model="forms.school" placeholder="分校" :loading="jilianLoading" clearable size="small" @clear="clearAfterSelect('school')" @visible-change="changeSchoolFn">
                        <el-option
                        v-for="(item,index) in options.school"
                        :key="index"
                        :label="item.bd_school_name"
                        :value="item.bd_school">
                        </el-option>
                    </el-select>
                </el-col>
                <el-col :span="2">
                    <el-select v-model="forms.year" placeholder="年份" :loading="jilianLoading" clearable size="small" @clear="clearAfterSelect('year')" @visible-change="changeYearFn">
                        <el-option
                        v-for="(item,index) in options.year"
                        :key="index"
                        :label="item.bd_year_name"
                        :value="item.bd_year_name">
                        </el-option>
                    </el-select>
                </el-col>
                <el-col :span="3">
                    <el-select v-model="forms.smalltype" placeholder="产品小类" :loading="jilianLoading" clearable @clear="clearAfterSelect('smalltype')" size="small" @visible-change="changeSmallTypeFn">
                        <el-option
                        v-for="(item,index) in options.smalltype"
                        :key="index"
                        :label="item.bd_producttype_small_name"
                        :value="item.bd_producttype_small">
                        </el-option>
                    </el-select>
                </el-col>
                <el-col :span="2">
                    <el-select v-model="forms.subject" placeholder="学科" :loading="jilianLoading" clearable @clear="clearAfterSelect('subject')" size="small" @visible-change="changeSubjectFn">
                        <el-option
                        v-for="(item,index) in options.subject"
                        :key="index"
                        :label="item.bd_subject_name"
                        :value="item.bd_subject">
                        </el-option>
                    </el-select>
                </el-col>
                <el-col :span="2">
                    <el-select v-model="forms.grade" placeholder="年级" :loading="jilianLoading" clearable @clear="clearAfterSelect('grade')" size="small" @visible-change="changeGradeFn">
                        <el-option
                        v-for="(item,index) in options.grade"
                        :key="index"
                        :label="item.bd_grade_name"
                        :value="item.bd_grade">
                        </el-option>
                    </el-select>
                </el-col>
                <el-col :span="3">
                    <el-select v-model="forms.classlevel" placeholder="班次" :loading="jilianLoading"  @clear="clearAfterSelect('classlevel')" clearable size="small" @visible-change="showClasslevelFn" @change="changeClasslevelFn">
                        <el-option
                        v-for="(item,index) in options.classlevel"
                        :key="index"
                        :label="item.bd_cla_class_name"
                        :value="item.bd_class_name">
                        </el-option>
                    </el-select>
                </el-col>
                <el-col :span="2">
                    <el-select v-model="forms.course" placeholder="课次" :loading="jilianLoading" @visible-change="showCourseFn" clearable size="small">
                        <el-option
                        v-for="(item,index) in options.course"
                        :key="index"
                        :label="item"
                        :value="item">
                        </el-option>
                    </el-select>
                </el-col>
            </el-row>            
        </div> 

        <el-form ref="form" style="margin-top:20px;" :model="forms" label-width="180px" label-position="right">
            <el-form-item label="资源序号" prop="findex" :rules="[
                            { required: true, message: '请输入资源序号', trigger: 'blur' } ,
                            { type: 'number', message: '请输入正确的资源序号' } 
                        ]">
                <el-col :span="11">
                    <el-input v-model.number="forms.findex" placeholder="注：资源分为几部分，此处应填写匹配的第几部分"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="题号" prop="sn" :rules="[
                            { required: true, message: '请输入题号', trigger: 'blur' } 
                        ]">
                <el-col :span="11">
                    <el-input-number v-model="forms.sn" controls-position="right" :min="1" :max="100" />
                </el-col>
            </el-form-item>
            <el-form-item label="解析视频链接" prop="uri" :rules="[
                            { required: true, message: '请输入解析视频链接', trigger: 'blur' } ,
                            { type: 'url', message: '请输入正确的视频链接', trigger: 'blur' } 
                        ]">
                <el-col :span="22">
                    <el-input v-model="forms.uri"></el-input>
                </el-col>
            </el-form-item>
            
            <el-form-item label=''>
                <el-button type="primary" @click="saveParseMatch" v-loading="addloading">保存</el-button>
                <el-button type="text" style="width:60px;" @click="cancleSaveFn">取消</el-button>
            </el-form-item>
        </el-form>

        <div class="course_box"  style="margin-top:60px;">
            <h3>视频已绑定课程</h3>
            <el-table :data="currentParseData" border style="width: 100%; margin-top:15px;">
                <el-table-column prop="school_name" label="分校" align="center" />
                <el-table-column prop="year" label="年份" align="center" width="90" />
                <el-table-column prop="small_type_name" label="产品小类" align="center" width="120" />
                <el-table-column prop="subject_name" label="学科" align="center" width="110" />
                <el-table-column prop="grade_name" label="年级" align="center" width="110" />
                <el-table-column prop="level_name" label="班次" align="center" />
                <el-table-column prop="course_sn" label="课次" align="center" width="60" />
                <el-table-column prop="id_code" label="资源序号" align="center" width="80" />
                <el-table-column prop="q_id" label="题号" align="center" width="60" />
                <el-table-column prop="uri_path" label="视频链接" align="center" />
            </el-table>
        </div>
        
    </div>
</template>

<script>
    export default {
        data() {
            return {
                loading:true,
                id:'',
                jilianLoading:false,
                addloading:false,
                page_num:1,//当前页码
                total_rec: 1,
                sn_num:6,

                forms:{
                    school:"",
                    year:"",
                    smalltype:"",
                    subject:"",
                    grade:"",
                    classlevel:"",
                    course:"",
                    findex:"",
                    sn:"",
                    uri:""
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

                currentParseData: []
            }
        },
        methods: {
            getBindcourse(){
                this.loading=true;
                this.$ajax({
                    method: 'post',
                    url:  'resource/videoanaly/getbindcourse',
                    data:this.qs.stringify({
                        id:this.id
                    })
                }).then( (res)=> {
                    this.loading=false;
                    let item = JSON.parse(JSON.stringify(res));
                    this.currentParseData.push(item);

                    
                    this.forms.findex = Math.floor(res.id_code);
                    this.forms.sn =res.q_id;
                    this.forms.uri =res.uri_path;
                    //分校
                    this.options.school[0]={
                        bd_school : res.school_id,
                        bd_school_name: res.school_name
                    }
                    this.forms.school = res.school_id;
                    //年份
                    this.options.year[0]={
                        bd_year_name : res.year
                    }
                    this.forms.year = res.year;
                    //产品小类
                    this.options.smalltype[0]={
                        bd_producttype_small : res.small_type_id,
                        bd_producttype_small_name: res.small_type_name
                    }
                    this.forms.smalltype = res.small_type_id;

                     
                    //学科
                    this.options.subject[0]={
                        bd_subject : res.subject_id,
                        bd_subject_name: res.subject_name
                    }
                    this.forms.subject = res.subject_id;

                    //年级
                    this.options.grade[0]={
                        bd_grade : res.grade_id,
                        bd_grade_name: res.grade_name
                    }
                    this.forms.grade = res.grade_id;

                    //班次
                    this.options.classlevel[0]={
                        bd_class_name: res.level_id,
                        bd_cla_class_name: res.level_name
                    }
                    this.forms.classlevel = res.level_id;

                    this.options.course[0]=res.course_sn;
                    this.forms.course=res.course_sn;

                    this.sn_num = res.sn_num;
                }).catch( (res)=> {
                    this.loading=false;
                });
            },
            goAddParse(){
                this.$router.push({name:"ParseAdd"});
            },
            //分校改变
            changeSchoolFn(v){
                if(!v) return;
                let obj = {
                    level_name:"school"
                }
                this.clearAfterSelect(obj.level_name);
                this.getCascadeFn(obj);
            },
            //年份更改
            changeYearFn(v){
                if(!v) return;   
                let obj = {
                    level_name:"year",
                    school_id:this.forms.school
                }
                this.clearAfterSelect(obj.level_name);
                if(this.forms.school){
                    this.getCascadeFn(obj);
                }
            },
            //产品小类更改
            changeSmallTypeFn(v){
                if(!v) return;   
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
            //学科更改
            changeSubjectFn(v){
                if(!v) return;
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
            //年级更改
            changeGradeFn(v){
                if(!v) return;
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
            showClasslevelFn(v){
                if(!v) return;
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
                this.sn_num = _total;
                for(let j=1; j<=_total; j++){
                    this.options.course.push(j);
                }
                //this.clearAfterSelect("course");
            },
            //课次点击，如果
            showCourseFn(v){        
                if(!v) return;
                this.options.course = [];
                for(let j=1; j<=this.sn_num; j++){
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
            saveParseMatch(){
                 this.$refs["form"].validate((valid) => {
                    if (valid) {
                        let isAllSelect = true;
                        for(let i in this.forms){
                            if(!this.forms[i]){
                                isAllSelect = false;
                            }
                        }
                        if(isAllSelect){
                            this.addloading=true;
                            this.$ajax({
                                method: 'post',
                                url:  'resource/videoanaly/updateanalyres',
                                data:this.qs.stringify({
                                    id:this.id,
                                    school_id:this.forms.school,
                                    year:this.forms.year,
                                    small_type_id:this.forms.smalltype,
                                    subject_id:this.forms.subject,
                                    grade_id:this.forms.grade,
                                    level_id:this.forms.classlevel,
                                    course_sn:this.forms.course,
                                    id_code:this.forms.findex,
                                    q_id:this.forms.sn,
                                    uri_path:this.forms.uri
                                })
                            }).then( (res)=> {
                                this.addloading=false;
                                this.$message({
                                    type:"success",
                                    message:"修改成功！"
                                });
                                this.$router.go(-1);
                            }).catch( (res)=> {
                                this.addloading=false;
                            });
                        }else{
                            this.$message.error("条件必须全选");
                        }
                    }
                });
            },

            //产品小类点击
            showSmallType(v){
                if(v){
                    this.changeYearFn();
                }
            }
        },
        watch: {
            
        },
        mounted() {
            if(!this.isHasAuth("e2")){
                this.$router.replace({name: 'P403'});
            };
            this.id = this.$route.query.id;
            this.getBindcourse();
            // this.getCascadeFn({
            //     level_name:"school"
            // });
        }
    };
</script>


