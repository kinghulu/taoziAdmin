<template>
    <section class="footer">
        Copyright© Taozi 版权所有
    </section>
</template>
<script>
    export default {
        data() {
            return {
                
            }
        }
    }
</script>

<style rel="stylesheet/scss"  type="text/scss" lang="scss">
    .footer{ position: absolute; left:220px; right:20px; bottom:20px; font-size:12px; text-align: center; overflow: hidden; color:#ccc; pointer-events: none;}
    @media screen and (max-width:764px) {
        .footer{left:20px; padding:20px; bottom:10px; right:20px;}
    }

</style>
