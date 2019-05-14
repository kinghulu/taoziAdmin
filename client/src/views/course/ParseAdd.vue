<template>
    <div class="files">
        <el-breadcrumb class="breadcrumbs" separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>
                <router-link :to="{name:'CourseMatch'}">课程资源匹配</router-link>
            </el-breadcrumb-item>
            <el-breadcrumb-item>
                <router-link :to="{name:'ParseMatch'}">解析视频匹配</router-link>
            </el-breadcrumb-item>
            <el-breadcrumb-item>
                <span>新增解析视频匹配</span>
            </el-breadcrumb-item>
        </el-breadcrumb>
        <div class="pagetopBox">
            <h2 class="pageTitle">新增解析视频匹配</h2>
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
            </el-row>
            
        </div>

        <el-form ref="form" style="margin-top:20px;" :model="forms" label-width="180px" label-position="right">
            <el-form-item label="资源序号" prop="findex" :rules="[
                            { required: true, message: '请输入资源序号', trigger: 'blur' } ,
                            { type: 'number', message: '请输入正确的资源序号', trigger: 'blur' } 
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
                <el-col :span="20">
                    <el-input v-model="forms.uri"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="">
                <el-button type="primary" @click="addNewParseMatch" v-loading="addloading">新增匹配</el-button>
            </el-form-item>
        </el-form>

        <div class="course_box" v-if="currentParseData.length" >
            <h3>本次匹配视频列表</h3>
            <el-table :data="currentParseData" border style="width: 100%; margin-top:15px;">
                <el-table-column label="序号" width="60" align="center" type="index"></el-table-column>
                <el-table-column prop="school" label="分校" align="center" />
                <el-table-column prop="year" label="年份" align="center" width="90" />
                <el-table-column prop="smalltype" label="产品小类" align="center" width="160" />
                <el-table-column prop="subject" label="学科" align="center" width="130" />
                <el-table-column prop="grade" label="年级" align="center" width="130" />
                <el-table-column prop="classlevel" label="班次" align="center" />
                <el-table-column prop="course" label="课次" align="center" width="60" />
                <el-table-column prop="findex" label="资源序号" align="center" width="80" />
                <el-table-column prop="sn" label="题号" align="center" width="60" />
                <el-table-column prop="uri" label="视频链接" align="center" width="80" />
                <el-table-column label="操作" align="center" width="100" fixed="right">
                    <template slot-scope="scope">
                        <el-button type="warning" @click="editRow(scope.row)" size="mini">编辑</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        
    </div>
</template>

<script>
    export default {
        data() {
            return {
                loading:true,
                jilianLoading:true,
                addloading:false,
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
            goAddParse(){
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
            editRow(row){
                this.$router.push({name:'ParseEdit',query:{id:row.id}});
            },
            addNewParseMatch(){
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
                                url:  'resource/videoanaly/addanalyres',
                                data:this.qs.stringify({
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
                                let cur = {
                                    id:res.id,
                                    year:this.forms.year,
                                    course:this.forms.course,
                                    findex:this.forms.findex,
                                    sn:this.forms.sn,
                                    uri:this.forms.uri
                                }
                                //根据分校值，取分名字
                                for(let i in this.options.school){
                                    if(this.options.school[i].bd_school == this.forms.school){
                                        cur.school = this.options.school[i].bd_school_name;
                                        break;
                                    }
                                }
                                //产品小类
                                for(let i in this.options.smalltype){
                                    if(this.options.smalltype[i].bd_producttype_small == this.forms.smalltype){
                                        cur.smalltype = this.options.smalltype[i].bd_producttype_small_name;
                                        break;
                                    }
                                }
                                //学科
                                for(let i in this.options.subject){
                                    if(this.options.subject[i].bd_subject == this.forms.subject){
                                        cur.subject = this.options.subject[i].bd_subject_name;
                                        break;
                                    }
                                }
                                //年级
                                for(let i in this.options.grade){
                                    if(this.options.grade[i].bd_grade == this.forms.grade){
                                        cur.grade = this.options.grade[i].bd_grade_name;
                                        break;
                                    }
                                }
                                //班次
                                for(let i in this.options.classlevel){
                                    if(this.options.classlevel[i].bd_class_name == this.forms.classlevel){
                                        cur.classlevel = this.options.classlevel[i].bd_cla_class_name;
                                        break;
                                    }
                                }

                                this.currentParseData.push(cur);
                            }).catch( (res)=> {
                                this.addloading=false;
                            });

                        }else{
                            this.$message.error("条件必须全选")
                        }
                    }
                });
                
            }
        },
        watch: {
            
        },
        mounted() {
            if(!this.isHasAuth("e2")){
                this.$router.replace({name: 'P403'});
            };
            this.getCascadeFn({
                level_name:"school"
            });
        }
    };
</script>