<template>
    <section class="adminmain">
        <Top/>
        <LeftNav/>
        <div class="container">
            <!-- <Crumbs/> -->
            <section class="mainBox">
                <transition name="fadeDown" mode="out-in" appear>
                    <router-view />
                </transition>
            </section>
            <Footer/>
        </div>
    </section>
</template>
<script>
    import Top from './Top';
    import LeftNav from './LeftNav';
    import Footer from './Footer';
    //import Crumbs from './Crumbs';
    export default {
        data() {
            return {
            }
        },
        methods: {
        },
        components: {
            Top,
            LeftNav,
            Footer,
            //Crumbs
        }
    }
</script>
<style rel="stylesheet/scss"  type="text/scss" lang="scss">
    .container{ padding:70px 0px 40px 220px; position: relative; box-sizing: border-box; min-height: 100vh;}
    .mainBox{ position: relative; padding:20px;}
    
    @media screen and (max-width:764px){
        .container{ padding:60px 0px 0px;}
    }
</style>