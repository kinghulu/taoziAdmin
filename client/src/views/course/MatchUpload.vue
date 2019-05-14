<!--
* 根据类型资源新增
-->
<template>
    <div class="">
        <el-breadcrumb class="breadcrumbs" separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>
                <router-link :to="{name:'CourseMatch'}">课程资源匹配</router-link>
            </el-breadcrumb-item>
            <el-breadcrumb-item>
                <router-link :to="{name:'MatchDetail'}">具体课次配置</router-link>
            </el-breadcrumb-item>
            <el-breadcrumb-item>
                <router-link :to="{name:'MatchedList',query:c_route.query}">{{getMoudleType(resource_module)}}模块资源上传</router-link>
            </el-breadcrumb-item>
            <el-breadcrumb-item>
                <span>资源新增</span>
            </el-breadcrumb-item>
        </el-breadcrumb>
        <h2 class="pageTitle">{{currentName}}</h2>
        <div class="formbox">
            <el-form ref="form" :model="forms" label-width="180px" label-position="right" v-loading="loading">
                <div class="file_item" v-for="(item,index) in forms.uplist" :key="index">
                    <el-form-item label="资源名称" :prop="'uplist.' + index + '.title'"
                        :rules="[
                            { required: true, message: '请输入资源名称', trigger: 'blur' },
                            { max: 50, message: '不超过50个字符', trigger: ['blur', 'change'] }
                        ]">
                        <el-col :span="11">
                            <el-input v-model="item.title"></el-input>
                        </el-col>
                        <el-col :span="11" v-if="index>=1">
                            <el-button type="info" @click="delectOneFile(index)" icon="el-icon-delete" circle style=" margin-left:10px;"></el-button>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="资源类型" :prop="'uplist.' + index + '.type'"
                        :rules="[
                            { required: true, message: '请选择资源类型', trigger: 'change' } 
                        ]">
                        <el-select v-model="item.type" placeholder="请选择资源类型">
                            <el-option :label="teach.name" :value="teach.value" v-for='(teach,tindex) in filesType' :key="tindex"></el-option>
                        </el-select>
                    </el-form-item>
                    <!--资源类型（1：视频 2：PDF 3：链接 4：修炼资源包）-->
                    <div v-if="item.type==2">
                        <el-form-item label="PDF" :prop="'uplist.' + index + '.uri_path'"
                        :rules="[
                            { required: true, message: '请上传PDF!', trigger: 'change' }
                        ]">
                            <el-col :span="11">
                                <el-upload class="upload-demo" action="" :http-request="UploadFile(index)"
                                    :show-file-list="true" :limit="1" :on-remove="handleFileRemove(index)" :on-exceed="handleExceed" :before-upload="beforeUploadFn(index)" :file-list="item.fileList">
                                    <el-button size="small" type="warning" icon="el-icon-upload">
                                        点击上传  
                                    </el-button>
                                    <div slot="tip" class="el-upload__tip">只能上传PDF文件</div>
                                </el-upload>
                                <div class="upload_progress" v-show="item.progress>0">
                                    <div class="p_bar"><div class="p_v" :style="{width:item.progress+'%'}"></div></div>
                                    <div class="p_txt">{{item.progress}}%</div>
                                </div>
                            </el-col>
                        </el-form-item>
                    </div>
                    <div v-else-if="item.type==4">
                        <el-form-item label="资源包上传" :prop="'uplist.' + index + '.uri_path'"
                        :rules="[
                            { required: true, message: '请上传资源包!', trigger: 'change' }
                        ]">
                            <el-col :span="11">
                                <el-upload class="upload-demo" action="" :http-request="UploadFile(index)"
                                    :show-file-list="true" :limit="1" :on-remove="handleFileRemove(index)" :on-exceed="handleExceed" :before-upload="beforeUploadFn(index)" :file-list="item.fileList">
                                    <el-button size="small" type="warning" icon="el-icon-upload">点击上传</el-button>
                                    <div slot="tip" class="el-upload__tip">只能上传zip文件</div>
                                </el-upload>
                                <div class="upload_progress" v-show="item.progress>0">
                                    <div class="p_bar"><div class="p_v" :style="{width:item.progress+'%'}"></div></div>
                                    <div class="p_txt">{{item.progress}}%</div>
                                </div>
                            </el-col>
                        </el-form-item>
                        <el-form-item label="题目数量" :prop="'uplist.' + index + '.id_code'"
                        :rules="[
                            { required: true, message: '请正确输入题目数量', trigger: 'change' } 
                        ]">
                            <el-col :sm="11">
                                <el-input v-model="item.id_code"></el-input>
                            </el-col>
                            <el-col :sm="11">
                                <div class="form_tips">填写资源部分及题目数量以1|3，代表第一部分有3道题，例：1|4#2|4#3|2#4|5 <br>每部分题目数量必须填写清楚。</div>
                            </el-col>
                        </el-form-item>
                    </div>
                    <div v-if="item.type==1||item.type==3">
                        <el-form-item label="资源链接" :prop="'uplist.' + index + '.uri_path'"
                        :rules="[
                            { required: true, message: '请输入资源链接', trigger: 'change' } ,
                            { type: 'url', message: '请输入正确的链接地址', trigger: ['blur', 'change'] }
                        ]">
                            <el-col :span="11">
                                <el-input v-model="item.uri_path"></el-input>
                            </el-col>
                        </el-form-item>
                    </div>
                </div>
                <el-form-item>
                    <el-button type="primary" @click="handleAddSave">上传并保存</el-button>
                    <el-button @click="handleCancle">取消</el-button>
                </el-form-item>
            </el-form>
            <div style="display:none">{{updateView}}</div>
        </div>
    </div>
</template>

<script>
    import {filesType,moduleType} from '@/utils/config';
    export default {
        data() {
            return {
                tempUrl: '', //存上传后的图片url
                resource_module:'',
                currentName:'',
                course_sn:"",
                c_route:{},
                ycl_id:'',
                f_id:'',
                pdfProgress:0,//进度条
                loading:false,
                filesType:[],
                updateView:0,
                pdfFileList: [],
                forms:{
                    uplist:[
                        {
                            title:'',
                            type:'',
                            uri_path:'',
                            id_code:'',
                            ossclient:'',
                            progress:0,//当前上传进度
                        }
                    ]
                }
            }
        },
        methods: {           
            //获取资源类型
            getMoudleType(v){
                return moduleType[v];
            },
            beforeUploadFn(index) {
                //--资源类型（1：视频 2：PDF 3：链接 4：修炼资源包）
                let uptype = this.forms.uplist[index].type;
                let limittype = "";
                let errormsg = "上传类型不正确";
                if(uptype==2){
                    limittype = 'application/pdf';
                    errormsg = '只能上传 PDF 格式!'
                }
                if(uptype==4){
                    limittype = 'application/x-zip-compressed';
                    errormsg = '只能上传 Zip 压缩包格式!'
                }
                return (file)=>{
                    const isFileType = file.type === limittype;
                    const isLt200M = file.size / 1024 / 1024 < 200;
                    if(limittype){
                        if (!isFileType) {
                            this.$message.error(errormsg);
                        }
                    }                   
                    if (!isLt200M) {
                        this.$message.error('上传资源大小不能超过 200MB!');
                    }
                    return isFileType && isLt200M;
                }
                
            },
            addOneFileFn(){
                if(this.forms.uplist.length>4){
                    this.$message("最多添加5条！")
                }else{
                    this.forms.uplist.push(
                        {
                            title:'',
                            type:'',
                            uri_path:'',
                            id_code:''
                        }
                    );
                }
            },
            delectOneFile(index){
                this.forms.uplist.splice(index,1);
            },
            handleAddSave(){               
                this.$refs["form"].validate((valid) => {
                    if (valid) {
                        let validType = true;
                        //再次判断文件类型和地址是否一致
                        let submitdata = [];
                        for(let i in this.forms.uplist){
                            let item =  this.forms.uplist[i]; 
                            let obj = {
                                title:item.title,
                                type:item.type,
                                uri_path:item.uri_path,
                                id_code:item.id_code
                            }
                            const tmpcnt = item.uri_path.lastIndexOf(".");
                            const exname = item.uri_path.substring(tmpcnt + 1);
                            submitdata.push(obj);
                            if(item.type==2&&exname!=='pdf'){
                                this.$message.error(`第${Math.floor(i)+1}个文件类型不匹配，请上传pdf格式`);
                                validType = false;
                                break;
                            }
                            if(item.type==4&&exname!=='zip'){
                                this.$message.error(`第${Math.floor(i)+1}个文件类型不匹配，请上传zip格式`);
                                validType = false;
                                break;
                            }
                        }
                        if(validType){
                            //新增提交
                            this.loading = true;                         
                                this.$ajax({
                                    method: 'post',
                                    url:  'resource/curriculum/addresource',
                                    data:this.qs.stringify({
                                            ycl_id:this.ycl_id,
                                            course_sn:this.course_sn,
                                            resource_module:this.resource_module,
                                            title:submitdata[0].title,
                                            type:submitdata[0].type,
                                            uri_path:submitdata[0].uri_path,
                                            id_code:submitdata[0].id_code
                                    })
                                }).then( (res)=> {
                                    this.loading = false;
                                    this.$message({
                                        message: '上传成功',
                                        type: 'success'
                                    });
                                    this.$router.replace({name:'MatchedList',query:this.c_route.query});
                                }).catch( (res)=> {
                                    this.loading = false;
                                });
                            
                        }
                    }
                })
            },
            handleExceed(files, fileList){
                this.$message.warning("当前限制选择 1 个文件，请先删除列表中的文件");
            },
            handleCancle(){
                this.$confirm(`您将要放弃本次资源${this.$route.meta.cn}吗？（确认放弃则本次录入的信息失效。）`, '确认放弃？', {
                    confirmButtonText: '确认放弃',
                    cancelButtonText: `继续${this.$route.meta.cn}`,
                    type: 'warning'
                }).then(() => {
                    this.$router.go(-1);    
                }).catch(() => {
                       
                });
            },
            handleFileRemove(index){
                return(file,fileList)=>{
                    let oclient = this.forms.uplist[index].ossclient;
                    if(oclient){
                        oclient.cancleUpload();
                    }
                    this.forms.uplist[index].progress = 0;
                    this.updateView ++;
                }
            },
            UploadFile(index){
                return (file)=>{
                    //判断扩展名
                    const tmpcnt = file.file.name.lastIndexOf(".");
                    const exname = file.file.name.substring(tmpcnt + 1)
                    const names = ['jpg', 'jpeg', 'webp', 'png','bmp']
                    // if(names.indexOf(exname)< 0 ){
                    // this.$message.error("不支持的格式!")
                    //     return
                    // }
                    let filefolder  = "others";
                    let uptype = this.forms.uplist[index].type;
                    if(uptype==2){
                        filefolder = "pdf";
                    }
                    if(uptype==4){
                        filefolder = "zip";
                    }
                    this.forms.uplist[index].ossclient = new this.ossclient2(); //初始化上传对象
                    let fileurl = this.forms.uplist[index].ossclient.multipartUpload(file,filefolder,
                        (url)=>{
                            this.forms.uplist[index].uri_path = url;
                        },
                        (p)=>{
                            this.forms.uplist[index].progress = p;
                            this.updateView ++;
                        }
                    )
                }
            },
            //获取资源编辑详情
            getFileDetail(){
                this.loading = true;
                this.$ajax({
                    method: 'post',
                    url:  'resource/curriculum/editresourcelist',
                    data:this.qs.stringify({
                        id:this.f_id

                    })
                }).then( (res)=> {
                    this.loading = false;
                    this.forms.uplist[0].title= res.title;
                    this.forms.uplist[0].type= res.type;
                    this.forms.uplist[0].uri_path= res.uri_path;
                    this.forms.uplist[0].id_code= res.id_code;
                    this.forms.uplist[0].ossclient= '';
                    this.forms.uplist[0].progress= 0;
                }).catch( (res)=> {
                    this.loading = false;
                });
            }
        },
        watch: {
            
        },
        mounted() {
            if(!this.isHasAuth("a2")){
                this.$message.error("没有操作权限");
                this.$router.replace({name: 'P403'});
            };
            this.c_route = this.$route;
            this.currentName = this.c_route.meta.cn;
            this.course_sn = this.c_route.query.sn;
            this.resource_module = this.c_route.query.module;
            this.ycl_id = this.c_route.query.yclid;   
            let f_type = [];
            if(this.resource_module == 2){
                //只显示资源修炼包
                for(let i in filesType){
                    if(filesType[i].value ==4){
                        f_type.push(filesType[i])
                    }
                }
            }else{
                //只显示资源修炼包
                for(let i in filesType){
                    if(filesType[i].value !=4){
                        f_type.push(filesType[i])
                    }
                }
            }
            this.filesType=f_type; 
           
        }
    };
</script>