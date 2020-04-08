<template>
  <div id="app">
    <Loading></Loading>
    <loading-tip></loading-tip>
    <nav-header></nav-header>
    <sidebar @enterTurbines="enterTurbines" @enterStation="enterStation" @enterProjectLocation="enterProjectLocation" @enterRoad="enterRoad"></sidebar>
    <router-view class="page_container" />
    <overall-progress-check v-if="isShow" :class="isBottom300?'bottom300':''" ref="overallProgressCheck" id="overallProgressCheck"></overall-progress-check>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import navHeader from "@/components/header.vue";
import sidebar from "@/components/sidebar.vue";
import Loading from '@/components/loading'
import loadingTip from '@/components/loading-tip'

import overallProgressCheck from './views/overallProgress/components/overallProgressCheck'

export default {
  data () {
    return {
      isShow: true,
      isBottom300: false,
      isEnterTurbines: false,
      isEnterStation: false,
      isEnterProjectLocation: false,
      isEnterRoad: false
    }
  },
  components: {
    navHeader,
    sidebar,
    Loading,
    loadingTip,
    overallProgressCheck
  },
  watch: {
    $route (n) {
      let overallProgressCheck = document.getElementById('overallProgressCheck')
      if (n.name == 'satelliteMonitoring') {
        this.isShow = false
      } else if (n.name == 'turbines') {
        overallProgressCheck.style.bottom = '300px'
        this.isShow = true
      } else if(n.name == 'hoistingSequence'){
        setTimeout(function () {
          let clientHeight = document.getElementById('hoist_container').clientHeight
          overallProgressCheck.style.bottom = clientHeight + 30 +'px'
        },10)
      } else {
        this.isShow = true
        overallProgressCheck.style.bottom = '26px'
      }
    },
    showTable1(){
      if(this.showTable1 && this.$route.name == 'bigPart'){
        this.isShow = false
      }else{
        this.isShow = true
      }
    },
    contract_number (val){
      if (!val){
        this.$router.push("/error/404")
      }
    }
  },
  computed: {
    ...mapState({
      // craneLocations: function (state) {
      //   return state.projectGeoInfo.craneLocations
      // }
      showTable1: function (state) {
        return state.bigPart.showTable1
      },
      contract_number: function (state) {
        return state.projectInfo.contract_number
      },
      authority: function (state) {
        return state.projectInfo.authority
      }
    })
  },
  created () {
    window.addEventListener('resize', this.screenDisplay);
    this.$store.commit('projectInfo/contract_number', this.getQueryVariable("contract_number"))
  },
  mounted () {
    // mytodo
    let that = this;
    // this.$store.commit('projectInfo/authority', this.getQueryAuthority("id"))
    let p1 = new Promise((resolve, reject) => {
      apiServices.getAuthority({
        // id: that.authority,
        contract_number: that.contract_number
      }).then(res => {
          if (res.code == 410) {
            that.$router.replace("/authArror")
            reject('err')
          }
          if (res.code == 200) {
            that.$store.commit("projectInfo/authorityMode", res.data)
            resolve('ok')
          }
          // that.$store.commit("projectInfo/authorityMode", 'edit')
          //   resolve('ok')
      })
      .catch((err) => {
        reject(err)
        that.$store.commit("projectInfo/authorityMode", 'get')
      })
    })
    Promise.all([p1]).then((res)=>{
      let p2 = new Promise((resolve, reject) => {
        apiServices.getFramsProjectData({
          contract_number: that.contract_number
        }).then((res) =>{
          if (res.code == 200) {
            resolve(res.data)
          }
        }).catch((err)=>{
          reject(err)
        })
      })
      Promise.all([p2]).then((res)=>{
        that.initData()
      }).catch((err)=>{
        that.$message.error('获取Frams数据失败！')
        // 关闭loading
        that.$store.commit('screen/loadNumber', 100)
      })
    }).catch((err)=>{
      that.$message.error('您没有权限获取数据！')
      // 关闭loading
      that.$store.commit('screen/loadNumber', 100)
    })
    // this.initData()

    this.shortcutKey()

    this.screenDisplay()
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.screenDisplay);
  },
  methods: {
    screenDisplay (){
      let bodys = document.getElementById('body');
      if (bodys.clientWidth <= 850){
        bodys.className = 'screenDisplay'
      } else{
        bodys.className = ''
      }
    },
    shortcutKey (){
      document.onkeyup = function(event){
        if (event && event.keyCode == 81){
          gwmap.dataManager.locat2Layer()
        }
        if (event && event.keyCode == 87){
          gwmap.dataManager.locat2LayerNew()
        }
      }
    },
    getQueryVariable (variable) {
      var query = window.location.search.substring(1);
      var vars = query.split("&");
      for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) { return pair[1]; }
      }
      return (false);
    },
    getQueryAuthority (variable) {
      var query = window.location.search.substring(1);
      var vars = query.split("&");
      for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) { return pair[1]; }
      }
      return (false);
    },
    ...mapActions("projectGeoInfo", [
      "getProjectLocation",
      "getStationLocation",
      "getRoadGeoInfo",
      "getCreditData",
      "getTurbineStatus",
      "getCraneData",
      "getFieldAreaGeoInfo",
      "getAllRoadInfo"
    ]),
    ...mapActions("projectInfo", [
      "getProjectInfo"
    ]),
    initData () {
      let that = this
      this.getProjectInfo({
        callback: res => {
          this.projectInfo = Object.assign({}, res);
          if (!res) {
            return;
          }
        }
      });
      this.getProjectLocation({
        callback: res => {
          if (!res) {
            return;
          }
          // console.log(res, "项目部")
          if (this.isEnterProjectLocation){
            gwmap.dataManager.projectLayer.load(res, 'startEdit');
          } else{
            gwmap.dataManager.projectLayer.load(res);
          }
        }
      });
      this.getStationLocation({
        callback: res => {
          if (!res) {
            return;
          }
          if (this.isEnterStation){
            gwmap.dataManager.stationLayer.load(res, 'circle');
          } else{
            gwmap.dataManager.stationLayer.load(res);
          }
        }
      });

      this.getFieldAreaGeoInfo({
        callback: (res) => {
          if (!res) {
            return
          }
          gwmap.dataManager.fieldLayer.load(res);
          // gwmap.dataManager.fieldLayer.zoomToLayer()
        }
      });
      this.getTurbineStatus({
        callback: res => {
          // 关闭loading
          that.$store.commit('screen/loadNumber', 100)

          if (!res) {
            return;
          }
          gwmap.dataManager.turbineLayer.load(res)
          // gwmap.dataManager.locat2Layer()
          if (this.isEnterTurbines){
            gwmap.dataManager.turbineLayer.remove()
          }

          // 获取吊车
          this.getCraneData({
            callback: res2 => {
              if (!res2) {
                return;
              }
              gwmap.dataManager.craneLayer.load(res2)
            }
          });
          // gwmap.dataManager.craneLayer.load(this.craneLocations)

          // setTimeout(() => {
          //   gwmap.dataManager.turbineLayer.zoomToLayer()// todo:测试使用

          // }, 1000);
        }
      });

      this.getAllRoadInfo({
        callback: res => {
          if (!res) {
            this.$message.error('道路异常！')
            return;
          }
          if (this.isEnterRoad){
            return;
          }
          this.$store.commit('screen/pit_road_postion', {pit_road_min: res.pit_road_min, pit_road_max: res.pit_road_max})
          gwmap.dataManager.roadLayerEdit.load(res.pit_road);
          // gwmap.dataManager.roadLayerEdit.zoomToLayer()
          gwmap.dataManager.roadLayerPoint.load(res.flight_path);
          gwmap.dataManager.roadLayerOver.load(res.off_road);
          gwmap.dataManager.locat2LayerNew()
        }
      });

    },
    enterTurbines(isTrue){
      this.isEnterTurbines = isTrue
    },
    enterStation(isTrue){
      this.isEnterStation = isTrue
    },
    enterProjectLocation(isTrue){
      this.isEnterProjectLocation = isTrue
    },
    enterRoad(isTrue){
      this.isEnterRoad = isTrue
    }

  }
};
</script>

<style lang="less">
@import "./assets/less/main.less";
@import "./assets/less/variable.less";
@import "./assets/style/table.less";
@import "./assets/style/dialog.less";

.screenDisplay{
  .sidebar, .compass{
    display: none;
  }
}
</style>
