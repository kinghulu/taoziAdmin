<template>
    <div class="home">
        <h3>欢迎！</h3>

        <div class="info">
            <p>欢迎您使用学习资料系统！</p>

            <p>进行课件上传的功能如下:</p>

            <p>1、新增资源：根据分类上传相关资源</p>

            <p>2、资源匹配：将资源匹配到具体的课次上（可以同一个资源匹配到多个课次上）</p>

            <p>3、预习资源上传：上传相关的课堂预习资源</p>

            <p>4、课后修炼资源上传：填写修炼题目数量，上传对应的资源包</p>

            <p>5、复习资源上传：上传相关的课程复习资源</p>

            <p>6、发布：确认信息无误后可点击</p>
            <p>特别提示：发布后，学员开始做题后，禁止修改课件信息</p>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {

            }
        },
        methods: {
            getRoleList() {
                this.$ajax({
                    method: 'post',
                    url: 'resource/role/rolelist'
                }).then((res) => {})
            },
        },
        mounted() {
            //验证接口是否过期
            this.getRoleList();
        }
    };
</script>
<style scoped>
    h3 {
        font-size: 20px;
    }

    .info {
        padding: 20px;
        font-size: 16px;
        line-height: 40px;
    }
</style>