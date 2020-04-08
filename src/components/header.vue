<template>
  <div class="header">
    <img src="../../public/images/logo.png" alt="">
    <div class="name" v-if="$store.state.projectInfo.projectInfo">
      {{$store.state.projectInfo.projectInfo.project_name}}
    </div>
    <i class="iconfont icon-guanxiafanwei" @click="zoomToProject"></i>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: 'nav-header',
  computed: {
    ...mapState({
      pit_road_postion: function (state) {
        return state.screen.pit_road_postion
      }
    })
  },
  methods: {
    zoomToProject () {
      // gwmap.dataManager.locat2Layer();
      gwmap.dataManager.locat2LayerNew()
    }
  }
}
</script>

<style scoped lang="less">
.header {
  z-index: 1000;
  position: fixed;
  left: 0;
  top: 4px;
  width: calc(100% - 45px);
  height: 40px;
  .flex-style();
  > img {
    position: relative;
    z-index: 2;
    margin-left: 14px;
  }
  > i {
    color: @solidColor;
    font-size: 24px;
    margin-left: 3px;
    cursor: pointer;
  }
  .name {
    width: auto;
    height: 30px;
    line-height: 32px;
    padding: 0 30px;
    background: @hotColor;
    background-clip: content-box;
    position: relative;
    margin-left: -20px;
    font-size: 16px;
    font-weight: 500;
    color: @commonColor;
    &:before,
    &:after {
      content: "";
      width: 30px;
      height: 30px;
      background: url("../../public/images/sector.png") no-repeat center;
      position: absolute;
      left: 0;
      top: 0;
    }
    &:after {
      left: auto;
      right: 0;
      transform: rotate(180deg);
    }
  }
}
</style>
