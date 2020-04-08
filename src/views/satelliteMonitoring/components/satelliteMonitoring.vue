<template>
            <div class="carousel_images">
                <div class="carousel-item-content" v-for="(item, index) in carouselDataWithShow" :key="index" @dblclick="handleClickCarousel(index)"  :id="`carousel${index}`">
                    <div class="carousel-item">
                        <div class="tip">
                        <p>数据源: Sentinel-2</p>
                        <p>分辨率: 10m </p>
                        <p>时间: {{item.time}} </p>
                        </div>
                        <img :src="`${preUrl}${item.url}${item.img_name}`" alt="" :ref="`carouselImg${index}`"  class="dragAble">
                    </div>
                </div>
            </div>
</template>
<script>
  import {initDrag, fnWheel} from '@/utils/zoomPicture'

  export default {
    name: 'satelliteMonitoringSon',
    props: [],
    data() {
      return {
        preUrl: '/wrinternal',
        carouselData: [],
        carouselDataWithShow:[],
        images: [],
        timer: null,
        showTimer: true
      }
    },
    watch: {},
    mounted() {

    },
    methods: {
      initEvent() {
        fnWheel(document.getElementsByClassName('dragAble'), function (down, oEvent) {
          var oldWidth = this.offsetWidth;
          var oldHeight = this.offsetHeight;
          var oldLeft = this.offsetLeft;
          var oldTop = this.offsetTop;
          var scaleX = (oEvent.clientX - oldLeft) / oldWidth; //比例
          var scaleY = (oEvent.clientY - oldTop) / oldHeight;
          let width, height, left, top
          if (down) {
            width = this.offsetWidth * 0.9 + "px";
            height = this.offsetHeight * 0.9 + "px";
          } else {
            width = this.offsetWidth * 1.1 + "px";
            height = this.offsetHeight * 1.1 + "px";
          }
          document.getElementsByClassName('dragAble').forEach(function (item) {
            item.style.width = width
            item.style.height = height
          })
          var newWidth = this.offsetWidth;
          var newHeight = this.offsetHeight;

          left = oldLeft - scaleX * (newWidth - oldWidth) + "px";
          top = oldTop - scaleY * (newHeight - oldHeight) + "px";

          document.getElementsByClassName('dragAble').forEach(function (item) {
            item.style.left = left
            item.style.top = top
          })
        });
      },
      initTimer(index){
        if(!index){
          index = 0
        }
        let len = this.carouselData.length
        let _this = this
        this.timer = setInterval(function () {
          index ++
          if(index > len-1 ){
            index = 0
            if( document.getElementById(`carousel${[len-1]}`)){
              document.getElementById(`carousel${[len-1]}`).style.display = 'none'
            }
          }else {
            if( document.getElementById(`carousel${[index-1]}`)){
              document.getElementById(`carousel${[index-1]}`).style.display = 'none'
            }
          }
          if( document.getElementById(`carousel${[index]}`)){
            document.getElementById(`carousel${[index]}`).style.display = 'block'
          }
        }, 1000)
      },
      handleClickCarousel(index){
        this.showTimer = !this.showTimer
        if(this.showTimer){
          _toast('开 始')
          this.initTimer(index)
        }else {
          _toast('暂 停')
          clearInterval(this.timer)
        }
      }
    },
    watch: {
      carouselData() {
        if (this.carouselData) {
           let _this = this
          _this.carouselDataWithShow = _this.carouselData.concat([])
          setTimeout(function () {
            _this.initEvent()
            _this.initTimer()
          }, 100)

        }
      }
    }
  }
</script>

<style scoped lang="less">
    .carousel_images{
        height: 100%;
        /deep/ .carousel-item-content{
            height: 100%;
            overflow: hidden;
            &.show{
                display: block;
            }
            &.none{
                display: none;
            }
            .carousel-item {
                position: relative;
                width: 100%;
                height: 100%;
                .tip{
                    position: absolute;
                    right: 20px;
                    top: 60px;
                    font-size: 18px;
                    color: yellow;
                    z-index: 10;
                }
                img {
                    position: absolute;
                    width: 100%;
                    object-fit: contain;
                    cursor: move;
                }
            }
        }
    }
</style>
