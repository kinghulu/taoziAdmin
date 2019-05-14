<template>
    <div class="files">
        <div class="pagetopBox">
            <h2 class="pageTitle">个人密码修改</h2>
        </div>
        <div class="course_box">
            <el-alert :closable='false'
                title="请输入相关信息进行修改密码的验证"
                type="warning"
                description="密码长度需为8-20位，需包含英文字符/数字（英文字符区分大小写，符号区分全角/半角）">
            </el-alert>
            <el-form ref="form" :model="editform" label-width="180px" label-position="right" style="margin-top:30px;">
                <el-form-item label="原密码">
                    <el-col :span="11">
                        <el-input v-model="editform.oldpwd" type="password"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="新密码">
                    <el-col :span="11">
                        <el-input v-model="editform.newpwd" type="password"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="确认新密码">
                    <el-col :span="11">
                        <el-input v-model="editform.confirmpwd" type="password"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="验证码">
                    <el-col :span="4">
                        <el-input v-model="editform.verifycode"></el-input>
                    </el-col>
                    <el-col :span="4">
                        r4t4
                    </el-col>
                </el-form-item>
                <el-form-item label="">
                    <el-button type="success">确定修改密码</el-button>
                    <el-button>取消修改并返回</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                loading:true,
                editform:{
                    name:"",
                    account:""
                }
            }
        },
        methods: {
            goAddParse(){
                this.$router.push({name:"AddParse"});
            }
        },
        watch: {
            
        },
        mounted() {}
    };
</script>

