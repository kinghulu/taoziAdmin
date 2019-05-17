<template id="leftNavBox">
    <div class="adminleft">
        <div class="adminleft-nav">
            <!-- <el-menu :default-active="$route.meta.id" class="el-menu-admin" router>
                <el-menu-item v-for="(item,i) in navlist" :key="i" :index="item.meta.id" :route="{name:item.name}" v-show="!item.meta.hidden"><i class="mb" :class="item.meta.ico"></i><span>{{item.meta.cn}}</span></el-menu-item>
            </el-menu> -->

            <el-menu :default-active="$route.meta.id" :collapse="isCollapse" router>
                <template v-for="(item,i) in navlist">
                    <el-submenu :index="item.meta.id" :key="i" v-if="item.children&&item.children.length>0">
                        <template slot="title">
                            <i class="mb" :class="item.meta.ico"></i>
                            <span slot="title">{{item.meta.cn}}</span>
                        </template>
                        <el-menu-item v-for="(citem,j) in item.children" :index="citem.meta.id" :route="{name:citem.name}" :key="j">{{citem.meta.cn}}</el-menu-item>
                    </el-submenu>
                    <el-menu-item :index="item.meta.id" :route="{name:item.name}" :key="i" v-else>
                        <i class="mb" :class="item.meta.ico"></i>
                        <span slot="title">{{item.meta.cn}}</span>
                    </el-menu-item>
                </template>
            </el-menu>
        </div>
    </div>
</template>
<script>
    //后期导入根据权限生成的路由表
    import {constantRouterMap} from '@/router'
    export default {
        data() {
            return {
                //navtype:sidebar.navtype,  //pcSmall,pcBig,mobile
                isCollapse: false,
                navselected:"",
                navlist:[]
            }
        },
        methods: {
            initNavList(){
                for(let i in constantRouterMap){
                    let _meta=constantRouterMap[i].meta;
                    if(_meta&&_meta.title=="main"){
                        let navdata = JSON.parse(JSON.stringify(constantRouterMap[i].children));
                        let newNav=[];
                        let user = this.$store.getters.user;
                        let u_obj = JSON.parse(user);
                        let u_auth = u_obj.auth;
                        u_auth = u_auth ? u_auth:'';
                        let u_id = u_obj.uid;
                        //根据权限生成相应得navlist;
                        for(let i in navdata){
                            let p_item = navdata[i];
                            if(p_item.meta&&!p_item.meta.hidden){
                                let _rolearr = p_item.meta.role.split(",");
                                let _hasrole = false;
                                for(let i in _rolearr){
                                    if(u_auth.indexOf(_rolearr[i])>-1 || u_id ==1){
                                        _hasrole = true;
                                        break;
                                    }
                                }
                                if(_hasrole){
                                    let carr=[];
                                    for(let j in p_item.children){
                                        let c_item = p_item.children[j];
                                        if(u_auth.indexOf(c_item.meta.role)>-1 || u_id ==1){
                                            if(!c_item.meta.hidden){
                                                carr.push(c_item);
                                            }
                                        }
                                    }
                                    p_item.children = carr;
                                    newNav.push(p_item);
                                }
                            }
                        }
                        this.navlist=newNav;
                    }
                }
            }
        },mounted(){
           this.initNavList();
        }
    }

</script>
<style scoped>
    .adminleft{ position: fixed; left:0; top:60px; bottom:0; width:220px;z-index:22; overflow: hidden; overflow-y: auto;}
    .el-menu-admin{ padding-top: 0px;}
    @media screen and (max-width:764px){
        .el-menu-admin{ padding-top:0px;}
        .adminleft{font-size:14px; position: relative; left:0;top:70px; width:100%; bottom: auto;}
    }
</style>
<style rel="stylesheet/scss"  type="text/scss" lang="scss">
    .adminleft-nav{ position: absolute; left:0; right:0; top:0; bottom:0; background:#3B3944;-webkit-transition: all .28s ease-out; transition: all .28s ease-out;}
    .adminleft-nav > .el-menu{background-color: #3B3944; border:none;}
    .adminleft-nav .el-submenu > .el-menu{background-color: #22212A; border:none;}
    .adminleft-nav .el-menu-item i{ color:#bfcbd9;}
    .adminleft-nav .el-menu .el-menu-item, .adminleft-nav .el-menu .el-submenu__title{font-size:14px; color:#bfcbd9; transition: all 0.2s 0s ease;}
    .adminleft-nav .el-menu .el-submenu .el-menu-item{ font-size:14px;}
    .adminleft-nav .el-menu .el-submenu__title{font-size:14px; color:#7599b1}
    .adminleft-nav .el-menu .is-active{ color:#fff;}
    .adminleft-nav .el-menu .is-active i{ color:#fff;}
    .adminleft-nav > .el-menu .el-menu-item{ background:none; color:#bbb}
    .adminleft-nav > .el-menu .el-submenu__title{ background:none; color:#bbb}
    .adminleft-nav > .el-menu .is-active .el-submenu__title{ color:#fff;}
    
    .adminleft-nav > .el-menu  .el-menu  .el-menu-item.is-active{ color:#fff; border-left:3px solid #f4c900;background: #535061}
    
    .adminleft-nav > .el-menu > .el-menu-item.is-active{ color:#fff;}

    .adminleft{
        .el-menu-item span{ margin-left: 15px;}
        .el-submenu__title span{ margin-left: 15px;}
        .el-submenu .el-menu-item{font-size:14px;}
        .el-submenu .iconfont{font-size:14px;}
        -webkit-transition: all .28s ease-out;
        transition: all .28s ease-out;
    }


    @media screen and (max-width:764px){
        .adminleft .el-menu-item.is-active:before{ display: none;}
        .adminleft{
            -webkit-transform: translate(0px);
            transform: translate(0px);
            .adminleft-nav{
                -webkit-transform: translate(0px);
                transform: translate(0px); position: static}
        }
    }
</style>
