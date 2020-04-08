<template>
  <!-- <panel-container id="root"> -->
  <!-- <template v-slot:header>
      <i class="iconfont icon-diaoche" style="color:#EBF2E4;"></i>
      <div style="color: rgb(235, 242, 228);display: inline-block;">
        升压站
      </div>
    </template> -->
  <div id="root">
    <el-form ref="form" :model="formData" class="gold-form" style="padding: 28px;position: relative;left: 22px;">
      <el-form-item label="经度：" prop="lon">
        <el-input v-model="formData.lon" style="width: 168px;" @blur="onBlur"></el-input>
      </el-form-item>
      <el-form-item label="纬度：" prop="lat">
        <el-input v-model="formData.lat" style="width: 168px;" @blur="onBlur"></el-input>
      </el-form-item>
      <el-form-item label="旋转角度：" prop="angle" style="position: relative;left: -28px;">
        <el-input v-model="formData.angle" style="width: 168px;" @blur="onBlur"></el-input>
      </el-form-item>
      <el-form-item style="margin-top:10px;">
        <el-button class="gold-button" :disabled="disableSubmit" style="position: relative;left: 62px;" @click="submitForm">确定</el-button>
        <!-- <el-button class="gold-button" @click="resetForm">取消</el-button> -->
      </el-form-item>
    </el-form>
  </div>
  <!-- </panel-container> -->
</template>
<script>
import { mapState, mapActions } from "vuex";
import PanelContainer from "@/components/panel-container.vue";
export default {
  components: { PanelContainer },
  data () {
    return {
      formData: {}
    };
  },
  computed: {
    ...mapState({
      stationLocation: state => state.projectGeoInfo.stationLocation
    }),
    disableSubmit () {
      if (!this.formData) return true;
      const lon = Number(this.formData.lon);
      const lat = Number(this.formData.lat);
      const angle = Number(this.formData.angle);
      if (
        isNaN(lon) ||
        isNaN(lat) ||
        isNaN(angle) ||
        lon < -180 ||
        lon > 180 ||
        lat < -90 ||
        lat > 90
      )
        return true;
      return false;
    }
  },
  watch: {
    stationLocation (val) { 
      if (val){
        this.formData.lon = val.lon;
        this.formData.lat = val.lat;
        this.formData.angle = val.angle;
      }
    }
  },
  mounted () {
    this.initFormData();
  },
  beforeDestroy(){
    // gwmap.dataManager.stationLayer.stopEdit()
    gwmap.dataManager.stationLayer.stopCircle()
    gwmap.dataManager.stationLayer.remove()
    this.closeSubmitForm ()
  },
  methods: {
    ...mapActions("projectGeoInfo", [
      "getStationLocation",
      "updateStationLocation"
    ]),
    onBlur(){
      // gwmap.dataManager.stationLayer.changeEdit(this.formData)
      gwmap.dataManager.stationLayer.changeCircle(this.formData)
    },
    submitForm (isTrue) {
      this.updateStationLocation({
        data: this.formData,
        callback: res => {
          if (res) {
            this.updateLocation();
            this.$message.success("保存升压站位置成功！");
          } else {
            this.$message.error("保存升压站位置出错。");
          }
        }
      });
    },
    resetForm () {
      this.initFormData();
    },
    updateLocation () {
      gwmap.dataManager.stationLayer.load({
        lon: Number(this.formData.lon),
        lat: Number(this.formData.lat),
        angle: Number(this.formData.angle)
      }, 'circle');
      gwmap.dataManager.stationLayer.zoomToLayer()
    },
    // 临时对策
    closeSubmitForm(){
      this.updateStationLocation({
        data: this.formData,
        callback: res => {
          if (res) {
            gwmap.dataManager.stationLayer.load({
              lon: Number(this.formData.lon),
              lat: Number(this.formData.lat),
              angle: Number(this.formData.angle)
            })
            // gwmap.dataManager.stationLayer.zoomToLayer()
          } else {
            this.$message.error("保存升压站位置出错。");
          }
        }
      })
    },
    initFormData () {
      this.getStationLocation({
        callback: res => {
          this.formData = Object.assign({}, res);
          if (!res) {
            return;
          }
          this.updateLocation();
          // gwmap.dataManager.stationLayer.startEdit();
          gwmap.dataManager.stationLayer.startCircle();
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
#root {
  position: absolute;
  right: 20px;
  bottom: 30px;

  width: 310px;
  height: 210px;
  background: rgba(14, 32, 53, 1);
  opacity: 0.8;
  border-radius: 3px;
}
</style>
