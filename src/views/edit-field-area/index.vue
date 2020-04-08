<template>
  <div id="root">
    <el-upload class="upload-file" action="" :multiple="false" :show-file-list="false" accept=".kml,.kmz" :http-request="uploadKMZ">
      <el-button class="gold-button" id="uploadFile" style="padding: 10px;width: 130px;">上传场区范围文件</el-button>
    </el-upload>
  </div>
</template>
<script>
import { mapState, mapActions } from "vuex";

export default {
  components: {},
  data () {
    return {
      fieldAreaKmlUrl: {}
    };
  },
  computed: {
    ...mapState({
      contract_number: state => state.projectInfo.contract_number
    }),
  },
  watch: {
  },
  mounted () {
    this.getFieldAreaGeoInfo({
      callback: (res) => {
        if (!res) {
          //自动弹出上传文件框
          document.getElementById("uploadFile").click()
          return
        }
        this.loadGeoData(res)
      }
    });
  },
  methods: {
    ...mapActions("projectGeoInfo", [
      "getFieldAreaGeoInfo",
      "updateFieldAreaGeoInfo",
    ]),
    loadGeoData (url) {
      gwmap.dataManager.fieldLayer.load(url);
      gwmap.dataManager.fieldLayer.zoomToLayer()
    },
    uploadKMZ (file) {
      const data = new FormData()
      // data.append('contract_number', 'GOLDWIND-2000-2017001')
      data.append('contract_number', this.contract_number)
      data.append('kml_file', file.file)
      apiServices.uploadFieldKml(data).then(res => {
        if (!res || res.code !== 200 || !res.data) return
        this.loadGeoData(res.data)
        // 保存kml文件url
        this.updateFieldAreaGeoInfo(
          {
            url: res.data,
            callback: (res2) => {
              // console.log(res2)
            }
          }
        )
      })
    }
  }
};
</script>

<style lang="less" scoped>
#root {
  position: absolute;
  right: 20px;
  bottom: 30px;

  // width: 260px;
  // height: 210px;
  background: rgba(14, 32, 53, 1);
  opacity: 0.8;
  border-radius: 3px;
}
</style>
