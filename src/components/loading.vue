<template>
  <div id="pageLoading" v-show="isShowLoad">
    <div class="circle_load">
      <img class="circle-3" src="/images/load/circle-3.png" alt="">
      <img class="circle-2" src="/images/load/circle-2.png" alt="">
      <img class="circle-1" src="/images/load/circle-1.png" alt="">
      <span id="load-percent">{{speedNum}}%</span>
      <span class="load-text">正在加载中...</span>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
  name: 'loading',
  data () {
    return {
      progress: '0',
      timer: null,
      speedNum: 0,
      isShowLoad: true
    }
  },
  computed: {
    ...mapState({
      loadNumber: function (state) {
        return state.screen.loadNumber
      }
    })
  },
  watch:{
    loadNumber (val){
      // console.log(val)
      if (val >= 100){
        this.isShowLoad = false
      }
    }
  },
  mounted () {
    this.setSpeedInterval()
  },
  methods: {
    setSpeedInterval () {
      let _this = this
      // let timer = setInterval(function () {
      //   if (_this.speedNum == 100) {
      //     clearInterval(timer)
      //     _this.isShowLoad = false
      //   } else {
      //     _this.speedNum += 10
      //   }
      // }, 100)
      let timer = setInterval(function () {
        if (_this.loadNumber == 100) {
          clearInterval(timer)
          _this.$store.commit('screen/loadNumber', _this.speedNum)
          _this.isShowLoad = false
        } 
        else if (_this.loadNumber == 90){
          clearInterval(timer)
          _this.$store.commit('screen/loadNumber', 90)
        }
        else {
          _this.speedNum += 5
          _this.$store.commit('screen/loadNumber', _this.speedNum)
        }
      }, 200)
    }
  }

}

</script>

<style scoped lang="less">
#pageLoading {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(25, 33, 46, 1);
  z-index: 999 !important;
  .circle_load {
    width: 100%;
    height: 100%;
    position: relative;
    img {
      position: absolute;
      left: 50%;
      top: 50%;
      &.circle-3 {
        margin-left: -110px;
        margin-top: -107px;
        animation: rotate2 5s linear infinite;
      }
      &.circle-2 {
        margin-left: -97px;
        margin-top: -97px;
      }
      &.circle-1 {
        margin-left: -73px;
        margin-top: -76px;
        animation: rotate1 5s linear infinite;
      }
    }
    #load-percent {
      position: absolute;
      display: inline-block;
      width: 100%;
      margin-top: -8px;
      text-align: center;
      top: 50%;
      font-size: 23px;
      font-weight: bold;
      color: rgba(30, 234, 179, 1);
      line-height: 26px;
    }
    .load-text {
      position: absolute;
      color: rgba(149, 167, 183, 1);
      line-height: 60px;
      width: 100%;
      margin-top: 120px;
      text-align: center;
      top: 50%;
      font-size: 14px;
    }
  }
}
#load-percent {
  position: absolute;
  display: inline-block;
  width: 100%;
  margin-top: -8px;
  text-align: center;
  top: 50%;
  font-size: 23px;
  font-weight: bold;
  color: rgba(30, 234, 179, 1);
  line-height: 26px;
}
.load-text {
  position: absolute;
  color: rgba(149, 167, 183, 1);
  line-height: 60px;
  width: 100%;
  margin-top: 120px;
  text-align: center;
  top: 50%;
  font-size: 26px;
}

@keyframes rotate2 {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(-360deg);
  }
}

@keyframes rotate1 {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
