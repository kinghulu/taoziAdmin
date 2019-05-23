<template>
    <el-breadcrumb class="breadcrumbs" separator-class="el-icon-arrow-right" v-if='routernav.length'>
        <transition-group name="breadcrumb">
            <el-breadcrumb-item v-for="(item,index) in levelList" :key="item.name">
                <span v-if='index==levelList.length-1'>{{item.name}}</span>
                <router-link v-else :to="item.path">{{item.name}}</router-link>
            </el-breadcrumb-item>
        </transition-group>
  </el-breadcrumb>
</template>
<script>
    export default {
        data() {
            return {
                levelList: null,
                routernav:[]
            }
        },
        mounted() {
            this.getBreadcrumb()
        },
        watch: {
            $route() {
                this.getBreadcrumb()
            }
        },
        methods: {
            getBreadcrumb() {
                this.routernav = [];
                let matched = this.$route.matched.filter(item => item.name);
                console.log(matched)
                const first = matched[0];
                if(first&&first.path != "/"){
                    //首页不显示面包屑
                    this.getParentNode(first);
                }
                
                this.levelList = this.routernav;
            },
            getParentNode(tree){
                let r_obj = {};
                if (tree && tree.path === '') {
                    r_obj.path = '/';
                }else{
                    r_obj.path = tree.path;
                }
                if(tree.meta){
                    r_obj.name = tree.meta.cn;
                }
                this.routernav.unshift(r_obj);
                
                var parent = tree.parent;
                if(parent){
                    this.getParentNode(parent);
                }
            }
        }
    }
</script>
<style>
    .container .breadcrumbs{  padding:10px; line-height: 30px; box-sizing: border-box; box-shadow: 0 1px 6px rgba(0,0,0,0.1);}
</style>
