<template>
    <div class="errorPanel">
        <div>
            <div class="codeTxt">
                <img src="/images/auth.png" alt="">
                <div>很抱歉，您没有权限访问该页面，请联系管理员 ！</div>
                <!-- <div @click="comeBack" class="comeBack"> 返回上一步 </div> -->
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'authArror',
    data (){
        return{

        }
    },
    methods:{
        comeBack(){
            this.$router.go(-1)
        }
    }
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
    .comeBack{
        width: 150px;
        height: 40px;
        text-align: center;
        line-height: 40px;
        color: #fff;
        background: #39CFB8;
        font-size: 14px;
        margin: 0 auto;
        margin-top: 20px;
        cursor: pointer;
    }
}
</style>