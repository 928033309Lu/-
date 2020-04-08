<template>
    <div class="errorPanel">
        <div>
            <img src="/images/auth2.png" alt="">
            <div class="codeTxt" v-if="codeTxt != 404">
                <span> {{codeTxt}} </span>
                很抱歉，您没有权限访问该页面，请联系管理员！
            </div>
            <div class="codeTxt" v-if="codeTxt == 404">
                <span> {{codeTxt}} </span>
                很抱歉，您要访问的页面不存在，请联系管理员！
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'error',
    computed: {
        codeTxt () {
            return this.$route.params.code || null;
        }
    },
}
</script>
<style lang="less" scoped>
.errorPanel{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 9999;
    background: radial-gradient(#fff,#ccc);
    color: #000;
    &>div{
        position: absolute;
        top: 0; left: 0; right: 0; bottom: 0;
        margin: auto;
        width: 100%;
        height: 50%;
        text-align: center;
        font-size: 28px;
        font-weight: bold;
    }
}
</style>