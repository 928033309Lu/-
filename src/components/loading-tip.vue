<template>
    <div class="loading-panel" v-if="loadingObj.loading">
        <div>
            <div class="loading">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
            </div>
            <p>{{loadingObj.text}}</p>
        </div>
    </div>
</template>
<script>
export default {
    name:"loading-panel",
    computed:{
        loadingObj () {
            return this.$store.state.screen.loadingObj;
        }
    }
}
</script>
<style lang="less">
.loading-panel{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
    color: #fff;
    z-index: 9999;
    &>div{
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        right: 0;
        margin: auto;
        width: 300px;
        height: 300px;
        text-align: center;
        p{
            margin-top: 30px;
        }
    }
}
.loading{
    width: 80px;
    height: 50px;
    margin: 0 auto;
}
.loading span{
    display: inline-block;
    width: 8px;
    height: 100%;
    margin: 0 1px;
    border-radius: 4px;
    background: #2cd0b9;;
    -webkit-animation: load 1s ease infinite;
}
@-webkit-keyframes load{
    0%,100%{
        height: 40px;
        background: #2cd0b9;;
    }
    50%{
        height: 70px;
        margin: -14px 1px;
        background: #2cd0b9;;
    }
}
.loading span:nth-child(2){
    -webkit-animation-delay:0.2s;
}
.loading span:nth-child(3){
    -webkit-animation-delay:0.4s;
}
.loading span:nth-child(4){
    -webkit-animation-delay:0.6s;
}
.loading span:nth-child(5){
    -webkit-animation-delay:0.8s;
}
</style>