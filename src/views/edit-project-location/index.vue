<template>
  <!-- <panel-container id="root"> -->
  <!-- <template v-slot:header>
      <i class="iconfont icon-diaoche" style="color:#EBF2E4;"></i>
      <div style="color: rgb(235, 242, 228);display: inline-block;">
        项目部
      </div>
    </template> -->
  <div id="root">
    <el-form ref="form" class="gold-form" :model="formData" style="padding: 28px;">
      <el-form-item label="经度：" prop="lon">
        <el-input v-model="formData.lon" style="width: 168px;" @blur="onBlur"></el-input>
      </el-form-item>
      <el-form-item label="纬度：" prop="lat">
        <el-input v-model="formData.lat" style="width: 168px;" @blur="onBlur"></el-input>
      </el-form-item>
      <el-form-item style="margin-top:10px;">
        <el-button class="gold-button" style="position: relative;left: 62px;" :disabled="disableSubmit" @click="submitForm">确定</el-button>
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
      projectLocation: state => state.projectGeoInfo.projectLocation
    }),
    disableSubmit () {
      if (!this.formData) return true;
      const lon = Number(this.formData.lon);
      const lat = Number(this.formData.lat);
      if (
        isNaN(lon) ||
        isNaN(lat) ||
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
    projectLocation (val) {
      this.formData.lon = val.lon;
      this.formData.lat = val.lat;
    }
  },
  mounted () {
    this.initFormData();
  },
  beforeDestroy(){
    gwmap.dataManager.projectLayer.stopEdit()
    gwmap.dataManager.projectLayer.remove()
    this.closeSubmitForm ()
  },
  methods: {
    ...mapActions("projectGeoInfo", [
      "getProjectLocation",
      "updateProjectLocation"
    ]),
    submitForm () {
      this.updateProjectLocation({
        data: this.formData,
        callback: res => {
          if (res) {
            this.$message.success("保存项目部位置成功");
            this.updateLocation(this.formData.lon, this.formData.lat);
          } else {
            this.$message.error("保存项目部位置出错。");
          }
        }
      });
    },
    closeSubmitForm(){
      this.updateProjectLocation({
        data: this.formData,
        callback: res => {
          if (res) {
            gwmap.dataManager.projectLayer.load({
              lon: Number(this.formData.lon),
              lat: Number(this.formData.lat)
            })
          } else {
            this.$message.error("保存项目部位置出错。");
          }
        }
      })
    },
    onBlur () {
      gwmap.dataManager.projectLayer.changeEdit(this.formData)
    },
    resetForm () {
      this.initFormData();
    },
    updateLocation (lon, lat) {
      gwmap.dataManager.projectLayer.load({
        lon: Number(lon),
        lat: Number(lat)
      }, "startEdit");
      gwmap.dataManager.projectLayer.zoomToLayer()
    },
    initFormData () {
      this.getProjectLocation({
        callback: res => {
          this.formData = Object.assign({}, res);
          if (!res) {
            return;
          }
          this.updateLocation(this.formData.lon, this.formData.lat);
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

  width: 280px;
  height: 165px;
  background: rgba(14, 32, 53, 1);
  opacity: 0.8;
  border-radius: 3px;
}
</style>
