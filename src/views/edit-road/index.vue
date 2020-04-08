<template>
  <div class="edit-road">
    <road-bar @close="onClose" :pit_road="roadAllInfo.pit_road" :off_road="roadAllInfo.off_road" :flight_path="roadAllInfo.flight_path"></road-bar>
  </div>
</template>
<script>
import { mapState, mapActions } from "vuex";
import roadBar from "@/components/road-bar.vue";

export default {
  components: {
    roadBar
  },
  data () {
    return {
      roadAllInfo: {
        pit_road:{},
        off_road:{},
        flight_path:{}
      }
    };
  },
  computed: {
  },
  watch: {},
  created(){

    this.loadAllInfo()
  },
  mounted () {
  },
  methods: {
    ...mapActions("projectGeoInfo", [
      "getAllRoadInfo"
    ]),
    loadAllInfo () {
      let that = this
      this.getAllRoadInfo({
        callback: res => {
          if (!res) {
            this.$message.error('道路异常！')
            return;
          }
          this.roadAllInfo = Object.assign({}, res);
          // console.log(this.roadAllInfo)
          gwmap.dataManager.roadLayerEdit.load(this.roadAllInfo.pit_road);
          gwmap.dataManager.roadLayerEdit.zoomToLayer()
          
          gwmap.dataManager.roadLayerPoint.load(this.roadAllInfo.flight_path);
          gwmap.dataManager.roadLayerOver.load(this.roadAllInfo.off_road);
        }
      });
    },
    onClose(){
      let that = this;
      let p = new Promise(function(resolve,reject){
        that.getAllRoadInfo({
          callback: res => {
            that.roadAllInfo = {};
            gwmap.dataManager.roadLayerEdit.load(res.pit_road);
            gwmap.dataManager.roadLayerEdit.zoomToLayer()
            
            gwmap.dataManager.roadLayerPoint.load(res.flight_path);
            gwmap.dataManager.roadLayerOver.load(res.off_road);
            resolve('ok')
          }
        })
      })
      p.then(() => {
        this.$router.push({ path: '/edit', query: this.$route.query });
      })
    }
  }
};
</script>

<style lang="less" scoped>
.edit-road{
  position: absolute;
  bottom: 20px;
  right: 0;
  z-index: 9;
  color: #fff;
}
</style>
