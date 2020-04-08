<template>
  <el-table :data="tableData" style="width: 100%;" height="100%" class="commonTable" @selection-change="handleSelectionChange" :row-class-name="rowNameFunc" @row-click="handleRowClick">
    <el-table-column type="selection" width="55"></el-table-column>
    <el-table-column label="机位点编号" style="position: relative;">
      <template slot-scope="scope">
        <span v-if="!isEditName">{{scope.row.engineer_number}}</span>
        
        <div v-if="isEditName">
          <el-input v-model="scope.row.input_engineer_number" 
          :class="!scope.row.frams_validate ? 'frams_validate' : ''"
          @blur="onCheckIput(scope.row.input_engineer_number, scope.row)" class="ipt"></el-input>
          <div class="open" @click.stop="openEditIpt(scope.row, scope.$index)"><i class="el-icon-arrow-down"></i></div>
          <el-select v-model="scope.row.input_engineer_number" 
          @change="onCheckIput(scope.row.input_engineer_number, scope.row)"
          :ref="'iptSelect'+ scope.$index" style="position: absolute;left: 0;top:0;z-index:-1;">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
      </template>
    </el-table-column>
    <el-table-column prop="logitude" label="经度">
      <template slot-scope="scope">
        <span>{{scope.row.logitude}}</span>
        <!--<el-input-->
        <!--v-model="scope.row.logitude"-->
        <!--@keyup.enter.native="enterBlur($event)"-->
        <!--@blur="updateDataStatus(scope.row,'logitude')"-->
        <!--&gt;</el-input>-->
      </template>
    </el-table-column>
    <el-table-column prop="latitude" label="纬度">
      <template slot-scope="scope">
        <span>{{scope.row.latitude}}</span>
        <!--<el-input-->
        <!--v-model="scope.row.latitude"-->
        <!--@keyup.enter.native="enterBlur($event)"-->
        <!--@blur="updateDataStatus(scope.row,'latitude')"-->
        <!--&gt;</el-input>-->
      </template>
    </el-table-column>
    <el-table-column prop="turbine_type" label="机型"></el-table-column>
    <el-table-column prop="ops_number" label="运维编号"></el-table-column>
    <el-table-column label="状态">
      <template slot-scope="scope">
        <div v-if="scope.row.turbine_type">
          <span>{{scope.row.schedule_status}}</span>
        </div>
        <div v-else>
          <!-- <i class="iconfont icon-jinggao"></i> -->
        </div>
      </template>
    </el-table-column>
  </el-table>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import bus from "@/utils/bus.js"
export default {
  name: 'sequenceTbale',
  data () {
    return {
      tableData: [],
      idList: [],
      options:[]
    }
  },
  computed: {
    ...mapState({
      refreshTable: function (state) {
        return state.hoist.refreshTable
      },
      saveTable: function (state) {
        return state.hoist.saveTable
      },
      delTable: function (state) {
        return state.hoist.delTable
      },
      contract_number: function (state) {
        return state.projectInfo.contract_number
      },
      isEditName: function (state) {
        return state.hoist.isEditName
      }
    })
  },
  mounted () {
    this.getTableData()
    this.getEngineerNumberList()
  },
  methods: {
    ...mapActions("projectGeoInfo", ["getTurbineStatus", "getCraneData"]),
    checkFanLonlat (name) {
      let currentFans = this.$store.state.hoist.tableData;
      for (let i = 0; i < currentFans.length; i++) {
        if (currentFans[i].engineer_number == name) {
          return false;
        }
      }
      return true;
    },
    refreshLayer(){
      let that = this
      this.getTurbineStatus({
        callback: res => {
          if (!res) {
            return;
          }
          // 移除风机图层，加载风机编辑图层
          gwmap.dataManager.turbineLayer.remove()
          gwmap.dataManager.turbineEditLayer.load(res)
          // 获取吊车
          that.getCraneData({
            callback: res2 => {
              if (!res2) {
                return;
              }
              gwmap.dataManager.craneLayer.load(res2)
            }
          });
          that.$store.commit('hoist/deleteEndDataRefresh', [])
          that.tableData.forEach((item,index)=>{
            item.addEdit = false
            item.moveEdit = false
          }) 
        }
      });
    },
    openEditIpt (row, index){
      // console.log(row, index)
      this.$refs['iptSelect'+ index].$el.click()
    },
    onCheckIput (val, row){
      // console.log(val, row)
      if(!val){
        row.frams_validate = false
        this.$message.error('不能为空')
        return
      }
      let checkName = this.checkFanLonlat(val);
      if (!checkName){
        row.frams_validate = false
        this.$message.error("此编号与现有的风机编号重复！")
        return;
      }
      let that = this
      apiServices.postValidateName({
        contract_number : that.$route.query.contract_number,
        engineer_number : val
      }).then((res)=>{
        if (res.code == 410){
          row.frams_validate = false
          this.$message.error(res.data)
        } else{
          row.frams_validate = true
          row.engineer_number = val;
          this.postEngineerNumberName(val, row) // post数据
        }
      }).catch((err)=>{
        console.log(err)
        row.input_engineer_number = row.engineer_number
        this.$message.error('获取FARMS系统的工程机位号数据失败！')
      })
    },
    postEngineerNumberName (val, row){
      // 修改接口
      // console.log(val, row)
      apiServices.putUploadTurbine({turbine_json: row}).then((res)=>{
        if(res.code != 200){
          this.$$message.error(res.data)
          return
        }
        this.$message.success(res.data)
        // 调刷新界面
        this.refreshLayer()
      }).catch((err)=>{
        this.$$message.error("修改编号失败")
      })
    },
    getEngineerNumberList (){
      let requestParam = { contract_number: this.contract_number }
      let _this = this
      apiServices.engineerNumberList(requestParam).then(res => {
        // console.log(res)
        if(res.code != 200){
          this.$message.error(res.data)
          return
        }
        this.options = res.data.map((item, index)=>{
          return{
            label: item,
            value: item
          }
        })
      }).catch((err)=>{
        // console.log(err)
      })
    },
    getTableData () {
      let requestParam = { contract_number: this.contract_number }
      let _this = this
      apiServices.getHoistTableData(requestParam).then(res => {
        let resData = res.data
        if (resData.length > 0) {
          _this.tableData = resData.map(item => {
            item.addEdit = false
            item.moveEdit = false
            item.input_engineer_number = item.engineer_number
            return item
          })
          _this.$store.commit('hoist/showTable', true)
        } else {
          _this.tableData = []
        }
        
        _this.$store.commit('hoist/tableData', _this.tableData)
      })
    },
    rowNameFunc ({ row, rowIndex }) {
      if (!row.turbine_type) {
        return 'e1'
        // return 'error-style'
      }
    },
    enterBlur (event) {
      event.target.blur()
    },
    updateDataStatus (row, param) {
      if (row[param] != row[`${param}_copy`]) {
        row.changed = true
      }
    },
    handleSelectionChange (val) {
      this.idList = val.map(v => { return v.id })
    },
    deleteTurbine(){
      this.$store.commit('hoist/delTable', false)
      if(this.idList.length == 0){
        this.$store.commit('hoist/delTable', false)
        return false
      }
      let _this = this
      let requestParam = {}
      requestParam.turbine_id = this.idList.join(',')
      this.$confirm('已选中 [ '+ this.idList.length +' ] 台风机，是否删除?', '提示', {
        confirmButtonText: '确定',
        // showCancelButton:false,
        center: true,
        type: 'warning'
      }).then(() => {
        this.$store.commit ('hoist/delTableData', requestParam.turbine_id) 
      }).catch(() => {
              
      })
      
      

      // this.$store.commit("screen/setLoadingTip", { loading: true, text: '删除数据中,请稍后...'})
      // apiServices.deleteTurbine(requestParam).then(res => {
      //   if(res.code === 200){
      //     _this.$message.success(res.data)
      //     _this.getTableData()
      //   }else {
      //     _this.$message.error(res.data)
      //   }
      //   _this.$store.commit('hoist/delTable', false)
      //   _this.$store.commit("screen/setLoadingTip", { loading: false})
      // }).catch((err)=>{
      //   console.log(err)
      //   _this.$message.error("删除机位点失败")
      //   _this.$store.commit("screen/setLoadingTip", { loading: false})
      // })
    },
    handleRowClick (row, column, event) {
      gwmap.dataManager.turbineEditLayer.zoomToFeature(row.engineer_number)
    }
  },
  watch: {
    refreshTable () {
      if (this.refreshTable) {
        this.getTableData()
        this.$store.commit('hoist/refreshTable',false)
      }
    },
    saveTable () {
      if (this.saveTable) {
        
      }
    },
    delTable () {
      if (this.delTable) {
        this.deleteTurbine()
      }
    }
  }
}
</script>

<style scoped lang="less">
.icon-jinggao {
  font-size: 18px;
  color: #ff0125;
}
/deep/.el-input__inner {
  border-color: transparent;
  color: #d4eff6;
}
/deep/ .ipt .el-input__inner{
  text-align: center !important;
}
.open{
  position: absolute;
  top: 5px;
  right: 15px;
  z-index: 11;
}
/deep/ .frams_validate .el-input__inner, /deep/ .frams_validate .el-input__inner:focus{
  border: 1px solid #F56C6C !important;
}
</style>
