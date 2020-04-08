<style lang="less">
  @import "../../../assets/style/cascadar.less";
</style>
<template>
  <el-dialog
    title="导入风机坐标"
    custom-class="import-turbine commonDialog"
    :visible.sync="showImport"
    :modal="false"
    width="866px"
    :close-on-click-modal="false"
    :before-close="handleClose">
    <el-form ref="form" label-width="100px" label-position="left" class="importForm">
      <el-form-item label="参考坐标系：">
        <!-- clearable -->
        <el-cascader class="cascader-selecte-style" 
          :options="options"
          @change="handleChange"
          @expand-change="handleExpandChange"
          v-model="value"
        ></el-cascader>
      </el-form-item>
      <div class="right_item">
        <el-form-item>
          <div class="iconfontBox" @click="handleDownLoad">
            <i class="iconfont icon-moban"></i>
            <span class="iconfont">下载模板</span>
          </div>
        </el-form-item>
        <el-form-item>
          <el-upload class="upload-file"
            action=""
            accept="text/plain"
            :show-file-list="false"
            :http-request="uploadFile">
            <div class="iconfontBox"> <i class="iconfont icon-daoru1"></i><span class="iconfont">导入文件</span></div>
          </el-upload>
        </el-form-item>
      </div>
    </el-form>
    <!-- 表格内容 -->
    <turbine-table :tableData="tableData" :validateMode="validateMode"></turbine-table>

  </el-dialog>
</template>

<script>
  import {mapState} from 'vuex'
  import {uploadFile} from '@/services/file.service'
  import envConfig from '@/config/env-config'
  import turbineTable from './turbineTable.vue'
  export default {
    name: 'importTurbine',
    components:{
      turbineTable
    },
    data() {
      return {
        validateMode: '',
        epsg_id: '',
        options: [],
        tableData: [],
        value: [] // 数据回显
      }
    },
    computed: {
      ...mapState({
        showImport: function (state) {
          return state.hoist.showImport
        },
        contract_number: function (state) {
          return state.projectInfo.contract_number
        }
      })
    },
    watch: {
      showImport() {
        if (this.showImport) {
          if (this.value.length > 0){
            // 数据回显
            this.getEpsgZoneBack(this.value)
          } else{
            this.getEpsgZone(null, "0")
          }
        }
      }
    },
    mounted() {
      
    },
    methods: {
      handleClose() {
        this.tableData = []
        this.$store.commit('hoist/showImport', false)
      },
      handleDownLoad() {
        if (!this.epsg_id) {
          this._toast('请选择参考坐标系')
          return;
        }
        window.location.href = `${envConfig.apiBaseUrl}/download_turbine_template?epsg_id=${this.epsg_id}`
      },
      getEpsgZoneBack(arr){
        // console.log(arr)
        let that = this
        let data = {
          pcs: arr[0]
        }
        this.httpEpsgZoneBack(data, res => {
          if(!res) return;
          let resData = res.data
          if (arr.length == 1) {
            that.epsg_id = resData.epsg_id
            return;
          }
          that.options.forEach((item, index) => {
            if (item.label == resData.pcs) {
              item.children = resData.latitude_zone.map(v => {
                return {
                  label: v,
                  value: v,
                  children: []
                }
              })
            }
          })
          let data2 = {
            pcs: arr[0],
            latitude_zone: arr[1]
          }
          that.httpEpsgZoneBack(data2, res=>{
            if(!res) return;
            let resData = res.data
            that.options.forEach(function (item) {
              if (item.label == resData.pcs) {
                item.children.forEach(function (citem) {
                  if (citem.label === resData.latitude_zone) {
                    citem.children = resData.zone.map(v => {
                      return {
                        label: v,
                        value: v,
                      }
                    })
                  }
                })
              }
            })
          })
          let data3 = {
            pcs: arr[0],
            latitude_zone: arr[1],
            zone: arr[2]
          }
          that.httpEpsgZoneBack(data3, res =>{
            if(!res) return;
            that.epsg_id = res.data.epsg_id
          })

        })
      },
      httpEpsgZoneBack(data, callBack){
        let that = this;
        apiServices.getCoordinateSystem(data).then(res => {
          if (res.code != 200){
            callBack(null)
            return;
          };
          callBack(res)
        }).catch((err)=>{
          console.log(err)
          callBack(null)
        })
      },
      getEpsgZone(data, level) {
        let _this = this
        apiServices.getCoordinateSystem(data).then(res => {
          let resData = res.data
          if (level === '0') {
            _this.options = this.handleData(resData)
          }
          else if (level === '1') {
            if (!resData.latitude_zone) {
              this.epsg_id = resData.epsg_id
            } else {
              _this.options.forEach(function (item) {
                if (item.label == resData.pcs) {
                  item.children = resData.latitude_zone.map(v => {
                    return {
                      label: v,
                      value: v,
                      children: []
                    }
                  })
                }
              })
            }
          }
          else if (level === '2') {
            if (JSON.stringify(resData) == "{}") return false
            _this.options.forEach(function (item) {
              if (item.label === resData.pcs) {
                item.children.forEach(function (citem) {
                  if (citem.label === resData.latitude_zone) {
                    citem.children = resData.zone.map(v => {
                      return {
                        label: v,
                        value: v,
                      }
                    })
                  }
                })
              }
            })
          }
          else if (level === '3') {
            _this.epsg_id = resData.epsg_id
          }
        })
      },
      handleData(data) {
        return data.map(v => {
          let rv = {}
          rv.label = v.pcs
          rv.value = v.pcs
          if (v.children === "true") {
            rv.children = []
          } else {
            delete  rv.children
          }
          return rv
        })
      },
      verification (value){
        if ( value.length == 1 && value[0] == 'GCS_WGS_1984' || value[0] == 'GCS_CN_2000' ){
          this.validateMode = 1
        }
        else if (value.length == 3 && value[0] == 'WGS_84_UTM'){
          this.validateMode = 2
        }
        else {
          this.validateMode = 3
        }
      },
      handleChange(value) {
        this.value = value
        this.verification(value);
        if (value.length === 0) {
          this.epsg_id = ''
          return
        }
        let list = ['pcs', 'latitude_zone', 'zone']
        let requestParam = {}
        value.forEach(function (item, index) {
          requestParam[list[index]] = item
        })
        if (value.length === 1) {
          this.getEpsgZone(requestParam, '1')
        } else {
          this.getEpsgZone(requestParam, "3")
        }
      },
      handleExpandChange(value) {
        let requestParam = {}
        if (value.length == 1) {
          requestParam.pcs = value[0]
          this.getEpsgZone(requestParam, '1')
        } else {
          requestParam.pcs = value[0]
          requestParam.latitude_zone = value[1]
          this.getEpsgZone(requestParam, "2")
        }
      },
      uploadFile(option) {
        if(!this.epsg_id){
          _toast('请选择参考坐标系!')
          return false
        }
        const _this = this
        const file = option.file
        let  params= {
          contract_number:this.contract_number,
          epsg_id:this.epsg_id,
        }
        apiServices.uploadHoistData({turbine_file:file},params).then(res=>{
          if (res.code != 200) {
            this.$message.error(res.data);
            return;
          }
          this.tableData = res.data;
          // this.tableData.forEach((item,index)=>{

          //   item.framsValidate = true
          // })

          // if(res.code == 200){
          //   _toast(res.message)
          //   _this.$store.commit('hoist/refreshTable',true)
          //   _this.$store.commit('hoist/showImport',false)
          //   _this.$store.commit('hoist/showTable',true)
          // }else {
          //   _toast(res.data)
          // }
        })
      },
    }
  }
</script>

<style lang="less" scoped>

/deep/ .import-turbine {
  position: fixed;
  left: 50%;
  top: 30%;
  transform: translate(-50%, -50%);
  font-size: 16px;
  .el-dialog__header{
    height:46px;
    line-height:46px;
    background:rgba(14,32,53,1);
    .el-dialog__title{
      font-size: 17px;
      color: #D4EFF6;
    }
    .el-dialog__headerbtn{
      font-size: 23px;
    }
  }
  .el-dialog__body{
    background:rgba(14,32,53,0.8);
    padding: 0 30px 20px 30px;
  }
}
/deep/ .el-form.importForm {
  display: flex;
  justify-content: space-between;
  .el-form-item{
    margin-bottom: 5px;
  }
  .el-form-item__label {
    color: #D4EFF6;
    padding-right: 0px;
    line-height: 34px;
    font-size: 16px;
  }
  .el-form-item__content {
    height: 34px;
    line-height: 34px;
    .iconfont{
      font-size: 15px;
      color: #D4EFF6;
      cursor: pointer;
    }
    .iconfontBox:hover .iconfont{
      color: #2CD0B9;
    }
  }
  .upload-file {
    .el-button--primary {
      width: 100px;
      height: 34px;
      background-color: rgba(57, 207, 184, 0.6);
      border-radius: 2px;
      border: none;
      &:hover {
        background-color: #2CD0B9;
      }
    }
  }
  .right_item{
    display: flex;
    .el-form-item__content{
      margin-left: 25px !important;
    }
    .icon-moban, .icon-daoru1{
      margin-right: 8px;
      font-size: 19px;
    }
    .icon-daoru1{
      font-size: 16.5px;
    }
  }
}

</style>
