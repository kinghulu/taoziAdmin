<template>
    <el-breadcrumb class="breadcrumbs" separator-class="el-icon-arrow-right">
        <transition-group name="breadcrumb">
            <el-breadcrumb-item v-for="(item,index) in levelList" :key="item.name">
                <span v-if='index==levelList.length-1'>{{item.meta.cn}}</span>
                <router-link v-else :to="item.path">{{item.meta.cn}}</router-link>
            </el-breadcrumb-item>
        </transition-group>
  </el-breadcrumb>
</template>
<script>
    export default {
        data() {
            return {
                levelList: null
            }
        },
        created() {
            this.getBreadcrumb()
        },
        watch: {
            $route() {
            this.getBreadcrumb()
            }
        },
        methods: {
            getBreadcrumb() {
                let matched = this.$route.matched.filter(item => item.name);
                const first = matched[0];
                if (first && first.path === '') {
                     first.path = '/'
                }
                this.levelList = matched
            }
        }
    }
</script>
<style>
    .container .breadcrumbs{  padding:10px; line-height: 30px; box-sizing: border-box; box-shadow: 0 1px 10px rgba(0,0,0,0.1);}
</style>
