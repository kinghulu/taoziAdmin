<template>
    <div class="files">
        <el-breadcrumb class="breadcrumbs" separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>
                <router-link :to="{name:'CourseMatch'}">课程资源配置</router-link>
            </el-breadcrumb-item>
            <el-breadcrumb-item>
                <router-link :to="{name:'LivesMatch'}">直播回看视频匹配</router-link>
            </el-breadcrumb-item>
            <el-breadcrumb-item>
                <span>新增直播回看视频</span>
            </el-breadcrumb-item>
        </el-breadcrumb>
        <div class="pagetopBox">
            <h2 class="pageTitle">新增直播回看视频</h2>
        </div>
        <div class="course_box">
            <el-row class="course_select">
                <el-col :span="3">
                    <el-select v-model="forms.school" placeholder="分校" :loading="jilianLoading" clearable size="small" @clear="clearAfterSelect('school')"  @visible-change="changeSchoolFn">
                        <el-option
                        v-for="(item,index) in options.school"
                        :key="index"
                        :label="item.bd_school_name"
                        :value="item.bd_school">
                        </el-option>
                    </el-select>
                </el-col>
                <el-col :span="2">
                    <el-select v-model="forms.year" placeholder="年份" :loading="jilianLoading" clearable @clear="clearAfterSelect('year')" size="small" @visible-change="changeYearFn">
                        <el-option
                        v-for="(item,index) in options.year"
                        :key="index"
                        :label="item.bd_year_name"
                        :value="item.bd_year_name">
                        </el-option>
                    </el-select>
                </el-col>
                <el-col :span="3">
                    <el-select v-model="forms.smalltype" placeholder="产品小类" :loading="jilianLoading" @clear="clearAfterSelect('smalltype')" clearable size="small" @visible-change="changeSmallTypeFn">
                        <el-option
                        v-for="(item,index) in options.smalltype"
                        :key="index"
                        :label="item.bd_producttype_small_name"
                        :value="item.bd_producttype_small">
                        </el-option>
                    </el-select>
                </el-col>
                <el-col :span="2">
                    <el-select v-model="forms.subject" placeholder="学科" :loading="jilianLoading" @clear="clearAfterSelect('subject')" clearable size="small" @visible-change="changeSubjectFn">
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
                    <el-select v-model="forms.classlevel" placeholder="班次" :loading="jilianLoading" clearable @clear="clearAfterSelect('classlevel')" size="small" @visible-change="showClasslevelFn" @change="changeClasslevelFn">
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
                <el-col :span="4">
                    <el-button type="primary" size="small" @click="getyclIdFn" :loading="getloading">添加到匹配班次</el-button>
                </el-col>
            </el-row>
            <div class="course_box">
                <h3>匹配班次</h3>
                <el-table :data="levelData" border style="width: 100%; margin-top:15px;">
                    <el-table-column label="序号" width="60" align="center" type="index"></el-table-column>
                    <el-table-column prop="school" label="分校" align="center" />
                    <el-table-column prop="year" label="年份" align="center" width="90" />
                    <el-table-column prop="smalltype" label="产品小类" align="center" width="160" />
                    <el-table-column prop="subject" label="学科" align="center" width="130" />
                    <el-table-column prop="grade" label="年级" align="center" width="130" />
                    <el-table-column prop="classlevel" label="班次" align="center" width="160" />
                    <el-table-column prop="course_sn" label="课次" align="center" width="80" />
                    <el-table-column label="操作" align="center" width="100" fixed="right">
                        <template slot-scope="scope">
                            <el-button type="danger" @click="deleteRow(scope.$index)" size="mini">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>            
        </div>


        <h3 style="margin-top:20px;">匹配视频</h3>
        <el-form ref="form" style="margin-top:20px;" :model="addlive" label-width="180px" label-position="right">
            <div class="file_item" v-for="(item,index) in addlive.resdata" :key="index">
            <el-form-item label="回看视频名称" :prop="'resdata.' + index + '.title'" :rules="[
                            { required: true, message: '请输入回看视频名称', trigger: 'blur' }
                        ]">
                <el-col :span="11">
                    <el-input v-model="item.title"></el-input>
                </el-col>
                <el-col :span="11" v-if="index>=1">
                    <el-button type="info" @click="delectOneFile(index)" icon="el-icon-delete" circle style=" margin-left:10px;"></el-button>
                </el-col>
            </el-form-item>
            <el-form-item label="回看视频链接" :prop="'resdata.' + index + '.uri_path'" :rules="[
                            { required: true, message: '请输入回看视频链接', trigger: 'blur' } ,
                            { type: 'url', message: '请输入正确的视频链接', trigger: 'blur' } 
                        ]">
                <el-col :span="11">
                    <el-input v-model="item.uri_path"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="排序">
                <el-col :span="11">
                    <el-input-number v-model="item.sort" :min="0" :max="9999" label="排序"  controls-position="right" />
                </el-col>
            </el-form-item>
            </div>
            <el-form-item label="">
                <el-button type="text" icon="el-icon-plus" @click="addOneFileFn">新增一条记录</el-button>
            </el-form-item>
            <el-form-item label="">
                <el-button type="primary" @click="addAndSaveFn" :loading="saveloading">保存并新增</el-button>
                <el-button @click="handleCancle">取消</el-button>
            </el-form-item>
            
        </el-form>
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
                getloading:false,
                saveloading:false,
                addlive:{
                    resdata:[
                        {title:"", uri_path:"",type:1,sort:1000}
                    ]
                },
                levelData:[],
            }
        },
        methods: {
            delectOneFile(index){
                this.addlive.resdata.splice(index,1);
            },
            addOneFileFn(){
                this.addlive.resdata.push(
                    {
                        title:'',
                        uri_path:'',
                        type:1,
                        sort:1000
                    }
                );
            },
            deleteRow(index){
                this.levelData.splice(index,1);
            },
            handleCancle(){
                this.$confirm(`您将要放弃本次视频新增吗？（确认放弃则本次录入的信息失效。）`, '确认放弃？', {
                    confirmButtonText: '确认放弃',
                    cancelButtonText: `继续新增`,
                    type: 'warning'
                }).then(() => {
                    this.$router.go(-1);    
                }).catch(() => {});
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
            //添加到匹配课次
            getyclIdFn(){
                 let isAllSelect = true;
                for(let i in this.forms){
                    if(!this.forms[i]){
                        isAllSelect = false;
                    }
                }
                if(isAllSelect){
                    this.getloading = true;
                    this.$ajax({
                        method: 'post',
                        url:  'resource/videoreview/getyclid',
                        data:this.qs.stringify({
                            school_id:this.forms.school,
                            year:this.forms.year,
                            small_type_id:this.forms.smalltype,
                            subject_id:this.forms.subject,
                            grade_id:this.forms.grade,
                            level_id:this.forms.classlevel
                        })
                    }).then( (res)=> {
                        this.getloading = false;
                        //判重
                        let hasRepeat = false;
                        for(let i in this.levelData){
                            let _item = this.levelData[i]; 
                            if(this.forms.course==_item.course_sn && res.ycl_id==_item.ycl_id){
                                hasRepeat = true;
                                break;
                            }
                        }
                        if(hasRepeat){
                            this.$message.error("不允许重复");
                        }else{
                            let cur = {
                                ycl_id:res.ycl_id,
                                course_sn:this.forms.course,
                                year:this.forms.year
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
                            this.levelData.push(cur);
                        }
                    }).catch( (res)=> {
                        this.getloading = false;
                    });
                }else{
                    this.$message.error("条件必须全选")
                }
            },
            //保存并新增
            addAndSaveFn(){
                //检测参数是否为空
                if(this.levelData.length==0){
                    this.$message.error("匹配班次不能为空~")
                }else{
                    this.$refs["form"].validate((valid) => {
                        if (valid) {
                            let leveldataArr = [];
                            for(let i in this.levelData){
                                let obj = {
                                    ycl_id:this.levelData[i].ycl_id,
                                    course_sn:this.levelData[i].course_sn
                                }
                                leveldataArr.push(obj);
                            }
                            let leveldata = JSON.stringify(leveldataArr);
                            let resdata = JSON.stringify(this.addlive.resdata);
                            
                            this.saveloading=true;
                            this.$ajax({
                                method: 'post',
                                url:  'resource/videoreview/addshareres',
                                data:this.qs.stringify({
                                    leveldata:leveldata,
                                    jsondata:resdata
                                })
                            }).then( (res)=> {
                                this.saveloading=false;
                                this.$router.push({name:"LivesMatch"})
                                this.$notify({
                                    title: '添加成功',
                                    message: '添加直播回看视频成功，返回视频列表查看~',
                                    type: 'success'
                                });
                            }).catch( (res)=> {
                                this.saveloading=false;
                            });
                        }
                    })
                }
            }
        },
        watch: {
            
        },
        mounted() {
            if(!this.isHasAuth("c2")){
                this.$router.replace({name: 'P403'});
            };
        }
    };
</script>

